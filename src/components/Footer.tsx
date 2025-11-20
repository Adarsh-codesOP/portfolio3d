import { Github, Linkedin, Code } from 'lucide-react';

interface FooterProps {
  openContact?: () => void;
}

export function Footer({ openContact }: FooterProps = {}) {
  return (
    <footer className="py-12 border-t border-border/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-2xl font-display font-bold text-gradient mb-2">Adarsh A S</h3>
            <p className="text-sm text-muted-foreground font-sans">
              AI Engineer • Software Developer
            </p>
          </div>

          <div className="flex gap-4">
            <a
              href="https://github.com/Adarsh-codesOP"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 glass rounded-full hover:bg-primary/20 transition-all hover:glow-primary group"
            >
              <Github className="w-5 h-5 group-hover:text-primary transition-colors" />
            </a>
            <a
              href="https://linkedin.com/in/adarsh-as-oo7"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 glass rounded-full hover:bg-secondary/20 transition-all hover:glow-secondary group"
            >
              <Linkedin className="w-5 h-5 group-hover:text-secondary transition-colors" />
            </a>
            <a
              href="https://github.com/Adarsh-codesOP/portfolio3d.git"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 glass rounded-full hover:bg-primary/20 transition-all hover:glow-primary group"
            >
              <Code className="w-5 h-5 group-hover:text-primary transition-colors" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/30 text-center text-sm text-muted-foreground">
          <p>© 2025 Adarsh A S. Built with React, Three.js, Framer Motion & GSAP.</p>
          <a
            href="https://github.com/Adarsh-codesOP/portfolio3d.git"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block hover:text-primary transition-colors text-xs opacity-70 hover:opacity-100"
          >
            View Source Code
          </a>
        </div>
      </div>
    </footer>
  );
}