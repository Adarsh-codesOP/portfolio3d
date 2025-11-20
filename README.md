<div align="center">

# 🚀 Adarsh A S - Portfolio 3D

### *Where Innovation Meets Immersion*

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.168.0-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**A cutting-edge 3D portfolio showcasing AI engineering, full-stack development, and modern web technologies with stunning visual effects and interactive 3D mascots.**

[View Live Demo](https://your-portfolio-url.com) • [Report Bug](https://github.com/Adarsh-codesOP/portfolio3d/issues) • [Request Feature](https://github.com/Adarsh-codesOP/portfolio3d/issues)

</div>

---

## ✨ Features

### 🎭 **Dual 3D Mascots**
- **Drone Mascot** - Futuristic flying companion with procedural animations
- **Robot Mascot** - Expressive humanoid with pre-built GLTF animations
- Seamless mascot switching with unique entrance animations
- Section-specific animations and color schemes

### 🎨 **Visual Excellence**
- **Glassmorphism UI** - Modern frosted glass effects throughout
- **Neon Preloader** - Eye-catching 3D cube grid with vibrant neon colors
- **Dynamic Grid Scan** - Interactive background that responds to mascot selection
- **Smooth Animations** - GSAP-powered scroll triggers and Framer Motion transitions

### ⚡ **Performance Optimized**
- **Minimal FX Mode** - Automatic low-end device detection
- **Smart Toggle** - Auto-hiding FX toggle (desktop only)
- **Optimized Rendering** - Conditional 3D rendering based on performance
- **Lazy Loading** - Efficient resource management

### 🎯 **Interactive Elements**
- **macOS-style Dock** - Magnifying navigation with smooth animations
- **Contact Form** - Integrated Web3Forms for seamless communication
- **Scroll Animations** - Parallax effects and split-text animations
- **Responsive Design** - Mobile-first approach with adaptive layouts

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="33%">

### Frontend Core
- **React 18.3** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling

</td>
<td align="center" width="33%">

### 3D & Animation
- **Three.js** - 3D rendering
- **@react-three/fiber** - React renderer
- **@react-three/drei** - 3D helpers
- **GSAP** - Scroll animations
- **Framer Motion** - UI animations

</td>
<td align="center" width="33%">

### Additional Tools
- **Lenis** - Smooth scrolling
- **Lucide React** - Icons
- **Web3Forms** - Contact form
- **Radix UI** - Accessible components

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Adarsh-codesOP/portfolio3d.git
   cd portfolio3d
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Web3Forms API key:
   ```env
   VITE_WEB3FORMS_ACCESS_KEY=your_api_key_here
   ```
   
   Get your free API key at [web3forms.com](https://web3forms.com/)

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

---

## 📦 Build & Deploy

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Deploy

The project is ready to deploy to any static hosting service:

- **Vercel** - `vercel deploy`
- **Netlify** - Drag & drop `dist/` folder
- **GitHub Pages** - Use GitHub Actions workflow
- **Cloudflare Pages** - Connect your repository

---

## 🎨 Customization

### Mascot Colors

Edit `src/components/RobotMascot.tsx` and `src/hooks/useScrollTrigger.ts`:

```tsx
const sectionColors = {
  hero: { main: '#6b8003', accent: '#8ba605', glow: '#6b8003' },
  // Add your custom colors
};
```

### Grid Background

Modify `src/pages/Index.tsx`:

```tsx
<GridScan
  linesColor="#6b8003"
  scanColor="#8ba605"
  sensitivity={0.55}
/>
```

### Preloader Theme

Update `src/components/Preloader.css`:

```css
.preloader-wrapper {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}
```

---

## 📁 Project Structure

```
portfolio3d/
├── public/
│   ├── RobotExpressive.glb      # Robot 3D model
│   ├── drone.glb                # Drone 3D model
│   └── favicon.png
├── src/
│   ├── components/
│   │   ├── Hero.tsx             # Landing section
│   │   ├── About.tsx            # About section
│   │   ├── Skills.tsx           # Skills showcase
│   │   ├── Projects.tsx         # Project gallery
│   │   ├── Mascot3D.tsx         # Drone component
│   │   ├── RobotMascot.tsx      # Robot component
│   │   ├── Dock.tsx             # macOS-style dock
│   │   ├── ContactForm.tsx      # Contact modal
│   │   ├── Preloader.tsx        # Loading screen
│   │   └── MinimalFXToggle.tsx  # Performance toggle
│   ├── hooks/
│   │   ├── useScrollTrigger.ts  # Scroll animations
│   │   ├── usePerformance.tsx   # Performance detection
│   │   └── use-mobile.tsx       # Mobile detection
│   ├── pages/
│   │   └── Index.tsx            # Main page
│   └── main.tsx                 # App entry point
├── .env.example                 # Environment template
├── package.json
└── README.md
```

---

## 🎯 Key Features Explained

### 🤖 Dual Mascot System

The portfolio features two unique 3D mascots that can be toggled via the dock:

- **Drone**: Procedurally animated with custom behaviors per section
- **Robot**: Pre-animated GLTF model with expressive movements

Each mascot has:
- Unique entrance animations (drone descends, robot walks in)
- Section-specific positions and rotations
- Dynamic color schemes matching each section
- Smooth interpolation between states

### 🎨 Performance Modes

**High FX Mode** (Default on high-end devices):
- Full 3D mascot rendering
- Complex grid scan effects
- Bloom and post-processing
- Split-text animations

**Minimal FX Mode** (Default on low-end devices):
- Simplified grid effects
- Disabled 3D rendering
- Reduced animations
- Optimized for performance

### 📱 Responsive Design

- Desktop: Full 3D experience with all effects
- Tablet: Optimized 3D with reduced complexity
- Mobile: 2D-focused with minimal effects
- Auto-detection with manual override

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Adarsh A S**

- Portfolio: [your-portfolio-url.com](https://your-portfolio-url.com)
- GitHub: [@Adarsh-codesOP](https://github.com/Adarsh-codesOP)
- LinkedIn: [adarsh-as-oo7](https://linkedin.com/in/adarsh-as-oo7)
- Email: adarshas107@gmail.com

---

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) - 3D graphics library
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - React renderer for Three.js
- [GSAP](https://greensock.com/gsap/) - Professional-grade animation
- [Framer Motion](https://www.framer.com/motion/) - Production-ready motion library
- [Web3Forms](https://web3forms.com/) - Contact form backend
- [Lucide](https://lucide.dev/) - Beautiful icon set

---

<div align="center">

### ⭐ Star this repo if you found it helpful!

**Made with ❤️ and lots of ☕**

</div>
