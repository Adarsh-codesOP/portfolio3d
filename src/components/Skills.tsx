import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code2, Database, Cloud, Wrench, BookOpen } from 'lucide-react';

const skillCategories = [
  {
    title: 'Programming',
    icon: Code2,
    skills: ['Python', 'Java', 'C', 'JavaScript', 'SQL', 'NoSQL'],
    color: 'text-primary',
  },
  {
    title: 'Frameworks & Libraries',
    icon: Database,
    skills: ['Flask', 'Docker', 'React', 'Solidity', 'TensorFlow', 'PyTorch'],
    color: 'text-secondary',
  },
  {
    title: 'Cloud Platforms',
    icon: Cloud,
    skills: ['AWS (EC2, S3, Lambda)', 'GCP Vertex AI', 'Azure'],
    color: 'text-accent',
  },
  {
    title: 'Developer Tools',
    icon: Wrench,
    skills: ['VS Code', 'Git', 'Docker', 'Jenkins', 'GitHub Actions', 'Postman'],
    color: 'text-primary',
  },
];

const coursework = [
  'Data Structures and Algorithms',
  'Operating Systems',
  'Computer Networks',
  'DBMS',
  'Software Engineering',
  'Cloud Computing',
  'Advanced Machine Learning',
  'NLP',
];

export function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section ref={ref} className="py-32 relative" id="skills">
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
            Skills & Technologies
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {skillCategories.map((category, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="glass h-full group hover:glow-primary transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <category.icon className={`w-6 h-6 ${category.color}`} />
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-background/60 rounded-lg text-sm font-medium border border-border/50 hover:border-primary/50 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Coursework */}
          <motion.div variants={itemVariants}>
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <BookOpen className="w-7 h-7 text-secondary" />
                  Relevant Coursework
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-3">
                  {coursework.map((course, index) => (
                    <div
                      key={index}
                      className="p-3 glass rounded-lg text-center hover:bg-secondary/10 transition-colors"
                    >
                      {course}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}