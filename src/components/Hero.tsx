import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail } from 'lucide-react';

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Parallax transforms
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden" id="hero">
      {/* Content with parallax */}
      <motion.div
        className="relative z-20 container mx-auto px-6 py-32"
        style={{ y: contentY, opacity }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-4xl">
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-block px-4 py-2 glass rounded-full text-sm font-medium text-gradient">
              AI Engineer • Software Developer
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-6xl md:text-8xl font-black mb-6 leading-tight tracking-tight"
          >
            <span className="text-gradient">Adarsh A S</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-8 leading-relaxed"
          >
            Aspiring AI Engineer building scalable applications and deploying high-performance solutions. 
            Proficient in full-stack development, MLOps, and cloud platforms.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-12">
            <Button 
              size="lg" 
              className="group relative overflow-hidden bg-primary hover:bg-primary/90 glow-primary"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="relative z-10">Explore My Work</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="glass border-border/50 hover:border-primary/50"
              onClick={() => window.open('mailto:adarshas107@gmail.com')}
            >
              Get in Touch
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-4">
            <a 
              href="https://github.com/Adarsh-codesOP" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 glass rounded-full hover:bg-primary/20 transition-all hover:glow-primary"
            >
              <Github className="w-6 h-6" />
            </a>
            <a 
              href="https://linkedin.com/in/adarsh-as-oo7" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 glass rounded-full hover:bg-secondary/20 transition-all hover:glow-secondary"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a 
              href="mailto:adarshas107@gmail.com"
              className="p-3 glass rounded-full hover:bg-accent/20 transition-all"
            >
              <Mail className="w-6 h-6" />
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}