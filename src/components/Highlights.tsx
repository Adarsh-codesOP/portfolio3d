import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Trophy, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const certifications = [
  'GCP Vertex AI',
  'AWS Cloud Foundations',
  'IT Specialist (Data Analytics)',
  'IT Specialist (Cloud Computing)',
  'IT Specialist (HTML5)',
  'RPA Developer (UiPath)',
  'Android Developer',
  'Node.js',
  'Database Using SQL',
  'Cybersecurity (Palo Alto)',
  'AWS Data Engineering',
  'Cloud Computing',
  'Oracle Generative AI',
  'Oracle Data Science',
];

const achievements = [
  {
    title: 'First Prize - Hackathon',
    description: 'Won first place in CSE track at SIT & SSOSC DevAppSys Hackathon',
    project: 'Developed AskDB - Natural Language to SQL platform',
  },
];

const leadership = [
  {
    role: 'Student Placement Coordinator',
    description: 'Assisted in placement drives and guided peers in coding preparation',
  },
  {
    role: 'Joint Secretary (ASCEE)',
    description: 'Led hackathons and workshops for 300+ participants, boosting engagement by 40%',
  },
  {
    role: 'Hackathon Organizer',
    description: 'Organized "Codeathon" with 80 dual-member teams, promoting innovation and teamwork',
  },
];

export function Highlights() {
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
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section ref={ref} className="py-32 relative" id="highlights">
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
            Highlights
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Certifications */}
            <motion.div variants={itemVariants}>
              <Card className="glass h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Award className="w-7 h-7 text-primary" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {certifications.map((cert, index) => (
                      <Badge 
                        key={index} 
                        variant="outline"
                        className="px-3 py-1.5 glass border-primary/30 hover:border-primary/70 transition-colors"
                      >
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements */}
            <motion.div variants={itemVariants}>
              <Card className="glass h-full glow-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Trophy className="w-7 h-7 text-accent" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="p-4 bg-background/40 rounded-lg border border-accent/30">
                      <h3 className="font-display font-semibold text-lg mb-2 text-accent">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground mb-1">{achievement.description}</p>
                      <p className="text-sm">{achievement.project}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Leadership */}
          <motion.div variants={itemVariants}>
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Users className="w-7 h-7 text-secondary" />
                  Leadership Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {leadership.map((item, index) => (
                    <div key={index} className="p-4 glass rounded-lg">
                      <h3 className="font-display font-semibold text-lg mb-2">{item.role}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
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