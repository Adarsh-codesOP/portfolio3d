import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
  {
    title: 'AskDB',
    subtitle: 'Natural Language to SQL',
    year: '2025',
    description: 'Platform enabling non-technical users to query and visualize databases using natural language. Developed full NLP-to-SQL pipeline with AI integration for real-time database interaction.',
    tech: ['Python', 'NLP', 'Docker', 'AI/ML', 'Database'],
    github: 'https://github.com/Adarsh-codesOP/askDB.git',
    highlights: [
      'Intuitive chat interface for seamless querying',
      'Containerized with Docker for scalable deployment',
      'Real-time database visualization',
    ],
  },
  {
    title: 'XLProCommunity',
    subtitle: 'Developer Community Platform',
    year: '2025',
    description: 'Full-stack platform for developer community networking and knowledge sharing. Built with Python backend and React frontend, enabling discussions, resource sharing, and member profiles.',
    tech: ['Python', 'React', 'Database', 'Full-Stack'],
    website: 'https://xlprocommunity.in',
    highlights: [
      'Robust backend with hosted databases',
      'Responsive React frontend',
      'Community discussions and resource sharing',
    ],
  },
  {
    title: 'ContriBlock',
    subtitle: 'Blockchain Knowledge Platform',
    year: '2025',
    description: 'Decentralized system rewarding contributions through tokenized economy. Features Solidity smart contracts and REST APIs for transparent reward distribution.',
    tech: ['Blockchain', 'Solidity', 'Flask', 'Docker', 'REST API'],
    github: 'https://github.com/Adarsh-codesOP/ContriBlock.git',
    highlights: [
      'Smart contracts for reward distribution',
      'Modular Flask + Docker backend',
      'Scalable multi-user support',
    ],
  },
];

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
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const ProjectCard = ({ project, index }: { project: typeof projects[0]; index: number }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
      target: cardRef,
      offset: ['start end', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.7, 1, 1, 0.7]);

    return (
      <motion.div
        ref={cardRef}
        variants={itemVariants}
        onHoverStart={() => setHoveredIndex(index)}
        onHoverEnd={() => setHoveredIndex(null)}
        style={{ 
          y, 
          opacity,
          willChange: 'transform, opacity'
        }}
        className="will-change-transform"
      >
        <Card className="glass group hover:glow-primary transition-all duration-500 overflow-hidden">
          <div className="grid md:grid-cols-3 gap-6 p-6">
            {/* Project Info */}
            <div className="md:col-span-2">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <CardTitle className="text-3xl font-black mb-2">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-lg text-primary">
                      {project.subtitle} • {project.year}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>

                <div>
                  <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide">
                    Key Features
                  </h4>
                  <ul className="space-y-1">
                    {project.highlights.map((highlight, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start">
                        <span className="text-primary mr-2">▸</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-primary/10 border border-primary/30 rounded text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
            </div>

            {/* Actions */}
            <div className="flex flex-col justify-center gap-3">
              {project.github && (
                <Button
                  variant="outline"
                  className="glass w-full group/btn"
                  onClick={() => window.open(project.github, '_blank')}
                >
                  <Github className="w-4 h-4 mr-2 group-hover/btn:text-primary transition-colors" />
                  View Code
                </Button>
              )}
              {project.website && (
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => window.open(project.website, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Website
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <section ref={ref} className="py-32 relative" id="projects">
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.h2 
            variants={itemVariants}
            className="text-5xl md:text-6xl font-black mb-16 text-gradient"
          >
            Featured Projects
          </motion.h2>

          <div className="space-y-8">
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}