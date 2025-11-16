import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Award, Languages } from 'lucide-react';

const education = [
  {
    degree: 'B.E. Computer Science & Engineering',
    institution: 'Srinivas Institute of Technology',
    period: '2022–2026',
    grade: 'CGPA: 7.8',
  },
  {
    degree: 'PUC (Science)',
    institution: 'Navajivana HSS',
    period: '2020–2022',
    grade: '83%',
  },
  {
    degree: 'SSLC',
    institution: 'Navajivana HSS',
    period: '2019–2020',
    grade: '95%',
  },
];

const softSkills = [
  'Problem-Solving',
  'Debugging',
  'Team Collaboration',
  'Communication',
  'Adaptability',
  'Time Management',
  'System Design',
];

const languages = [
  { name: 'English', level: 'C1' },
  { name: 'Hindi', level: 'C1' },
  { name: 'Kannada', level: 'C2' },
  { name: 'Malayalam', level: 'C2' },
  { name: 'Tamil', level: 'A2' },
];

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
    <section ref={ref} className="py-32 relative overflow-hidden" id="about">
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
            About Me
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Education */}
            <motion.div variants={itemVariants}>
              <Card className="glass h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <GraduationCap className="w-7 h-7 text-primary" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-primary/30 pl-4">
                      <h3 className="font-bold text-lg">{edu.degree}</h3>
                      <p className="text-muted-foreground">{edu.institution}</p>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-primary">{edu.period}</span>
                        <span className="font-semibold">{edu.grade}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Languages */}
            <motion.div variants={itemVariants}>
              <Card className="glass h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Languages className="w-7 h-7 text-secondary" />
                    Languages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {languages.map((lang, index) => (
                      <div key={index} className="flex items-center justify-between p-3 glass rounded-lg">
                        <span className="font-medium">{lang.name}</span>
                        <span className="text-sm px-2 py-1 bg-primary/20 rounded text-primary">
                          {lang.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Soft Skills */}
          <motion.div variants={itemVariants}>
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Award className="w-7 h-7 text-accent" />
                  Soft Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {softSkills.map((skill, index) => (
                    <motion.span
                      key={index}
                      className="px-4 py-2 glass rounded-full font-medium hover:bg-primary/20 transition-colors cursor-default"
                      whileHover={{ scale: 1.05 }}
                    >
                      {skill}
                    </motion.span>
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