import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight } from 'lucide-react';
import { ContactForm } from './ContactForm';

export function Publications() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section ref={ref} className="py-32 relative" id="publications">
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.h2
            variants={itemVariants}
            className="text-5xl md:text-6xl font-display font-bold mb-16 text-gradient tracking-tight"
          >
            Publications
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div variants={itemVariants}>
              <Card className="glass glow-secondary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <FileText className="w-7 h-7 text-secondary" />
                    Research Publication
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-bold text-xl mb-2">Video-to-Notes Generation</h3>
                    <p className="text-muted-foreground mb-4">
                      Published in International Journal of Emerging Technologies and Innovative Research (JETIR)
                    </p>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="px-3 py-1 bg-secondary/20 border border-secondary/50 rounded">
                        Vol. 12
                      </span>
                      <span className="px-3 py-1 bg-secondary/20 border border-secondary/50 rounded">
                        Issue 7
                      </span>
                      <span className="px-3 py-1 bg-secondary/20 border border-secondary/50 rounded">
                        July 2025
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* CTA */}
            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary opacity-20 blur-3xl" />
              <Card className="glass relative border-2 border-primary/50">
                <CardContent className="p-8 text-center">
                  <h3 className="text-3xl font-display font-bold mb-4 text-gradient">
                    Let's Build Something Amazing
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Interested in collaborating on innovative projects or discussing new opportunities?
                    I'm always open to connecting with fellow developers and tech enthusiasts.
                  </p>
                  <Button
                    size="lg"
                    className="group bg-gradient-to-r from-primary via-accent to-secondary hover:opacity-90 glow-primary"
                    onClick={() => setIsContactFormOpen(true)}
                  >
                    Get In Touch
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Contact Form Modal */}
      <ContactForm isOpen={isContactFormOpen} onClose={() => setIsContactFormOpen(false)} />
    </section>
  );
}