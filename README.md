# ⚡ SnapSave: High-Performance TikTok Downloader

![SnapSave](/public/globe.svg)

**SnapSave** is a premium, ultra-fast, watermark-free TikTok media downloader. Built completely on modern web standards, it seamlessly transitions into a Progressive Web App (PWA) on mobile, letting you download videos into your camera roll smoothly.

---

## 🎨 Motion & Animations

What sets SnapSave apart from generic downloaders is our **obsessive focus on UI/UX motion and feedback:**
1. **Background Orbs**: A slow CSS-accelerated orbital drift of gradients provides life to an otherwise static screen.
2. **Skeleton Pops**: When the API goes to fetch, a breathing, pulsed Skeleton loads instantly, before magically Cross-Fading (via `framer-motion` AnimatePresence) precisely into the media preview.
3. **Squishy Buttons**: Using micro-interactions on the Download buttons scales them on-tap to give physical feedback.
4. **Dynamic Resizing**: Instead of rigid height boxes, all players dynamically calculate `100dvh` space so that headers and footers flawlessly glide into place on mobile.

---

## 🔥 Features
- 🚀 **Zero Watermark**: Access unedited TikTok media servers.
- 🎵 **Dedicated Audio**: Switch into Audio-Mode to extract high-quality `mp3` tracks instantly.
- 📱 **PWA Native Share**: Install SnapSave to your phone natively. Share a video directly from the TikTok app, and SnapSave auto-triggers!
- 🛡️ **Anti-CORS Proxy Backend**: Built-in Next.js Edge proxy to slip straight past restrictions and Cloudflare blocks.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS & Vanilla CSS
- **Animations**: Framer Motion
- **Components**: Shadcn/UI

---

## 🚀 Getting Started

First, install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 👨‍💻 Author

**Made with ❤️ by Ahmed Mostafa**
