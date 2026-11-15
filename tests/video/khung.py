"""Khung quay video hướng dẫn có giọng đọc.

Mỗi video là một danh sách bước: câu thuyết minh (hiện phụ đề + đọc bằng giọng vi-VN-HoaiMyNeural qua edge-tts) và
thao tác Playwright. Playwright quay hình (webm, không có tiếng); ffmpeg đặt từng câu đọc đúng lúc nó được nói rồi
ghép thành MP4 (H.264 + AAC) để Windows / điện thoại mở được ngay.
Dữ liệu mẫu tạo qua API với tên có "(mẫu)" và tự xoá sau khi quay (xem du_lieu_mau.py)."""
import asyncio, json, os, re, shutil, subprocess, sys, time

import edge_tts
import imageio_ffmpeg
from playwright.sync_api import sync_playwright

GIONG = "vi-VN-HoaiMyNeural"
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
RA = os.path.join(REPO, "docs", "huong-dan")
TAM = os.path.join(REPO, "tests", "video", "tam")
URL = "http://127.0.0.1:5180/"
KHUNG = {"width": 412, "height": 860}

CHU_THICH = """(t) => { let d = document.getElementById('chu-thich');
  if (!d) { d = document.createElement('div'); d.id = 'chu-thich'; document.body.appendChild(d);
    Object.assign(d.style, { position: 'fixed', left: '8px', right: '8px', bottom: '70px', zIndex: 99999, padding: '10px 12px',
      background: 'rgba(15,122,92,.95)', color: '#fff', borderRadius: '6px', fontSize: '15px', lineHeight: '1.45',
      fontFamily: '"Lexend Variable", sans-serif', boxShadow: '0 4px 14px rgba(0,0,0,.3)', pointerEvents: 'none' }) }
  d.textContent = t; d.style.display = t ? 'block' : 'none' }"""
VIEN = """(el) => { el.style.outline = '3px solid #f5a623'; el.style.outlineOffset = '2px'; setTimeout(() => { el.style.outline = '' }, 1500) }"""


def do_dai(file):
    out = subprocess.run([FFMPEG, "-i", file], capture_output=True, text=True, encoding="utf-8", errors="ignore").stderr
    h, m, s = re.search(r"Duration: (\d+):(\d+):([\d.]+)", out).groups()
    return int(h) * 3600 + int(m) * 60 + float(s)


def doc(cau, file):
    asyncio.run(edge_tts.Communicate(cau, GIONG, rate="-5%").save(file))
    return do_dai(file)


class Quay:
    """Dùng: with Quay('ten-video', 'Tiêu đề') as v: v.noi('...'); v.bam(locator) ..."""

    def __init__(self, ten, tieu_de):
        self.ten, self.tieu_de = ten, tieu_de
        self.thu_muc = os.path.join(TAM, ten)
        shutil.rmtree(self.thu_muc, ignore_errors=True)
        os.makedirs(self.thu_muc)
        self.am = []  # (giây bắt đầu, file mp3)

    def __enter__(self):
        self.pw = sync_playwright().start()
        self.b = self.pw.chromium.launch(slow_mo=120)
        self.ctx = self.b.new_context(viewport=KHUNG, record_video_dir=self.thu_muc, record_video_size=KHUNG, accept_downloads=True)
        self.p = self.ctx.new_page()
        self.t0 = time.time()
        return self

    def noi(self, cau, them=0.4):
        """Hiện phụ đề và đọc câu; chờ đọc xong mới làm bước kế."""
        f = os.path.join(self.thu_muc, f"cau-{len(self.am):03d}.mp3")
        dai = doc(cau, f)
        self.p.evaluate(CHU_THICH, cau)
        self.am.append((time.time() - self.t0, f))
        self.p.wait_for_timeout(int((dai + them) * 1000))

    def noi_trong_khi(self, cau):
        """Bắt đầu đọc, trả về hàm chờ đọc xong: để thao tác chạy song song với lời đọc."""
        f = os.path.join(self.thu_muc, f"cau-{len(self.am):03d}.mp3")
        dai = doc(cau, f)
        self.p.evaluate(CHU_THICH, cau)
        bat_dau = time.time()
        self.am.append((bat_dau - self.t0, f))
        return lambda: self.p.wait_for_timeout(max(0, int((dai + 0.4 - (time.time() - bat_dau)) * 1000)))

    def bam(self, loc, cho=0.9):
        loc.scroll_into_view_if_needed()
        loc.evaluate(VIEN)
        self.p.wait_for_timeout(600)
        loc.click()
        self.p.wait_for_timeout(int(cho * 1000))

    def go(self, loc, chu):
        loc.scroll_into_view_if_needed()
        loc.evaluate(VIEN)
        loc.click()
        loc.press_sequentially(chu, delay=70)
        self.p.wait_for_timeout(500)

    def chi(self, loc):
        """Khoanh vùng một chỗ trên màn hình (không bấm)."""
        loc.scroll_into_view_if_needed()
        loc.evaluate(VIEN)

    def dang_nhap(self, ten, mk):
        p = self.p
        p.goto(URL)
        p.get_by_label("Tên đăng nhập hoặc số điện thoại", exact=True).fill(ten)
        p.get_by_label("Mật khẩu", exact=True).fill(mk)
        p.get_by_role("button", name="Đăng nhập").click()
        p.wait_for_timeout(2500)

    def __exit__(self, kieu, loi, tb):
        self.p.evaluate(CHU_THICH, "")
        self.p.wait_for_timeout(800)
        video = self.p.video.path()
        self.ctx.close()
        self.b.close()
        self.pw.stop()
        if kieu:
            return False
        self._ghep(video)

    def _ghep(self, video):
        os.makedirs(RA, exist_ok=True)
        dich = os.path.join(RA, f"{self.ten}.mp4")
        vao = ["-i", video]
        loc = []
        for i, (giay, f) in enumerate(self.am):
            vao += ["-i", f]
            ms = int(giay * 1000)
            loc.append(f"[{i + 1}:a]adelay={ms}|{ms}[a{i}]")
        tron = "".join(f"[a{i}]" for i in range(len(self.am)))
        loc.append(f"{tron}amix=inputs={len(self.am)}:normalize=0[am]")
        cmd = [FFMPEG, "-y", *vao, "-filter_complex", ";".join(loc), "-map", "0:v", "-map", "[am]",
               "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "veryfast", "-crf", "24", "-r", "25",
               "-c:a", "aac", "-b:a", "96k", "-metadata", f"title={self.tieu_de}", dich]
        r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="ignore")
        if r.returncode:
            raise RuntimeError(r.stderr[-1500:])
        shutil.rmtree(self.thu_muc, ignore_errors=True)
        print(f"video: {dich} ({do_dai(dich):.0f} giây)")
