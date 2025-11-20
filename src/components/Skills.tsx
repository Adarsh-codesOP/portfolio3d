import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code2, Database, Cloud, Wrench, BookOpen } from 'lucide-react';
import LogoLoop from './LogoLoop';
import { 
  SiReact, 
  SiNextdotjs, 
  SiTypescript, 
  SiTailwindcss,
  SiPython,
  SiJavascript,
  SiDocker,
  SiAmazon,
  SiGooglecloud,
  SiTensorflow,
  SiPytorch,
  SiFlask,
  SiSolidity,
  SiGit,
  SiNodedotjs
} from 'react-icons/si';

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

const techLogos = [
  { node: <SiPython size={48} />, title: 'Python', href: 'https://www.python.org' },
  { node: <SiJavascript size={48} />, title: 'JavaScript', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
  { node: <SiReact size={48} />, title: 'React', href: 'https://react.dev' },
  { node: <SiNextdotjs size={48} />, title: 'Next.js', href: 'https://nextjs.org' },
  { node: <SiTypescript size={48} />, title: 'TypeScript', href: 'https://www.typescriptlang.org' },
  { node: <SiTailwindcss size={48} />, title: 'Tailwind CSS', href: 'https://tailwindcss.com' },
  { node: <SiDocker size={48} />, title: 'Docker', href: 'https://www.docker.com' },
  { node: <SiAmazon size={48} />, title: 'AWS', href: 'https://aws.amazon.com' },
  { node: <SiGooglecloud size={48} />, title: 'Google Cloud', href: 'https://cloud.google.com' },
  { node: <SiTensorflow size={48} />, title: 'TensorFlow', href: 'https://www.tensorflow.org' },
  { node: <SiPytorch size={48} />, title: 'PyTorch', href: 'https://pytorch.org' },
  { node: <SiFlask size={48} />, title: 'Flask', href: 'https://flask.palletsprojects.com' },
  { node: <SiSolidity size={48} />, title: 'Solidity', href: 'https://soliditylang.org' },
  { node: <SiGit size={48} />, title: 'Git', href: 'https://git-scm.com' },
  { node: <SiNodedotjs size={48} />, title: 'Node.js', href: 'https://nodejs.org' },
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
            className="text-5xl md:text-6xl font-display font-bold mb-16 text-gradient tracking-tight"
          >
            Skills & Technologies
          </motion.h2>

          {/* Tech Logo Loop */}
          <motion.div variants={itemVariants} className="mb-16">
            <div style={{ height: '120px', position: 'relative', overflow: 'hidden' }}>
              <LogoLoop
                logos={techLogos}
                speed={80}
                direction="left"
                logoHeight={48}
                gap={40}
                hoverSpeed={20}
                scaleOnHover
                fadeOut
                ariaLabel="Technologies and tools"
                className="opacity-90"
              />
            </div>
          </motion.div>

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