# 💙 Ammuuuu 11:11 Wish Website 🌷

A magical, premium digital experience designed and dedicated to **Ammuuuu**, themed around the magic of 11:11, her favorite flower (Tulips), and her favorite color (Sky Blue).

The entire website is designed with a premium, elegant, and peaceful aesthetic, leveraging modern animation libraries and styling best practices.

---

## ✨ Features

- 🌌 **Opening Experience**: Completely dark starlit screen, soft wind and procedural piano ambience, and a countdown timer leading up to the exact moment of **✨ 11:11 ✨**. Once reached, a shooting star crosses, particles react, and an emotional wording sequence unfolds.
- 🌠 **Cosmic Transition**: Connects stars, triggers particle expansions, and smoothly zooms into the main screen.
- 👸 **Hero Section**: Mouse-tilt responsive portrait border reflection sheen suspended in a luxury floating frame.
- 💌 **Wish Letter**: Elegant typewriter animation typing a heartfelt (non-proposal) wish of growth, peace, happiness, and hope.
- 🌷 **Dream Tulip Garden**: SVG-based tulips swaying to virtual wind forces. Hovering draws animated blue butterflies that land on the blossoms and flap their wings.
- 📸 **Memory Gallery**: Premium masonry photo grid utilizing glassmorphism cards, rounded corners, soft glows, and fullscreen lightboxes.
- ⭐ **Constellation Memories**: Interactive canvas link mapping starlit nodes in the night sky. Click nodes to trace coordinates and unlock floating memory captions.
- 🫙 **Magical Wish Jar**: Star-filled glass jar. Click it to shake and draw one of **100+ random heartfelt wishes**.
- 🎁 **Secret Easter Egg**: Clicking a hidden glowing blue tulip triggers screen flashes, rising sky blue hearts, fireworks, and a special message.
- 🎵 **Procedural Audio Engine**: Plays ambient lowpass wind sweeps and pentatonic piano sweeps synthesized locally in-browser via the Web Audio API if local audio files are missing, ensuring initial load viability.
- 🌙 **Spelling Constellation Ending**: At the bottom of the page, floating blue hearts rise and automatically morph to spell out the name **`AMMUUUU`** as connecting stars.

---

## 🎨 Color Palette & Design Tokens

- **Base Colors**: Deep Navy, Midnight Blue, Sky Blue (`#87CEEB`), Baby Blue (`#BFEFFF`), White Glow, Lavender, Silver, Soft Purple.
- **Visual Styles**: Glassmorphism, thin borders, high-fidelity light glows, custom cursors, mouse spotlight overlays.

---

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (Latest App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## ⚙️ Configuration & Customization

You can easily customize name, images, sound paths, wishes, and colors inside the site configuration file without editing any react/component code:

📂 Open [src/config/site-config.ts](src/config/site-config.ts):
```typescript
export const siteConfig = {
  girlName: "Ammuuuu",
  favoriteHeartColor: "Sky Blue",
  favoriteHeartEmoji: "💙",
  favoriteFlower: "Tulips",
  favoriteFlowerEmoji: "🌷",
  music: {
    pianoUrl: "/music/piano.mp3",
    windUrl: "/music/wind.mp3",
    sparkleUrl: "/music/sparkle.mp3",
  },
  // Update wishes, quotes, gallery items, and constellations coordinates here!
};
```

### Adding Custom Assets

- **Images**: Add photos to `/public/images/` and map them inside the config (`gallery` and `constellations` nodes).
- **Music**: Place `.mp3` files in `/public/music/` named `piano.mp3`, `wind.mp3`, and `sparkle.mp3` to override the procedural synthetics.

---

## 🚀 Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the local development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your web browser.

---

## 🌎 Production Deployment

### Option 1: Vercel (Recommended)

1. Install Vercel CLI globally:
   ```bash
   npm i -g vercel
   ```
2. Deploy directly from the directory:
   ```bash
   vercel
   ```
3. Follow the CLI instructions to link and deploy your site in seconds.

### Option 2: GitHub Repository

1. Initialize Git and commit changes:
   ```bash
   git init
   ```
2. Add files and make initial commit:
   ```bash
   git add .
   git commit -m "feat: initial commit of Ammuuuu 11:11 Wish Webapp"
   ```
3. Create a repository named `ammuuuu-1111-wish` on GitHub and link:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ammuuuu-1111-wish.git
   git branch -M main
   git push -u origin main
   ```
