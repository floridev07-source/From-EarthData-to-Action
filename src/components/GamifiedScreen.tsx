import { X, Trophy, Target, Award, Star, CheckCircle2, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { motion } from 'motion/react';

interface GamifiedScreenProps {
  onClose: () => void;
}

export default function GamifiedScreen({ onClose }: GamifiedScreenProps) {
  const challenges = [
    {
      id: 1,
      title: 'Air Quality Explorer',
      description: 'Check air quality in 5 different cities',
      progress: 60,
      current: 3,
      target: 5,
      points: 50,
      status: 'active',
      icon: Target,
    },
    {
      id: 2,
      title: 'Data Detective',
      description: 'Compare satellite and ground data 10 times',
      progress: 40,
      current: 4,
      target: 10,
      points: 100,
      status: 'active',
      icon: Award,
    },
    {
      id: 3,
      title: 'Pollution Predictor',
      description: 'Make 3 correct air quality predictions',
      progress: 100,
      current: 3,
      target: 3,
      points: 75,
      status: 'completed',
      icon: CheckCircle2,
    },
    {
      id: 4,
      title: 'Global Guardian',
      description: 'Monitor air quality for 7 consecutive days',
      progress: 0,
      current: 0,
      target: 7,
      points: 200,
      status: 'locked',
      icon: Lock,
    },
  ];
  
  const achievements = [
    { name: 'First Steps', earned: true },
    { name: 'Data Master', earned: true },
    { name: 'Global Explorer', earned: true },
    { name: 'Prediction Pro', earned: false },
    { name: 'Health Advocate', earned: false },
    { name: 'Legend', earned: false },
  ];
  
  const quizQuestions = [
    {
      question: 'What does PM2.5 stand for?',
      options: [
        'Particulate Matter 2.5 micrometers',
        'Pollution Measurement 2.5',
        'Primary Molecule 2.5',
        'Positive Material 2.5',
      ],
      correct: 0,
    },
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 bg-black/95 backdrop-blur-md"
    >
      <div className="h-full overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-white mb-2">Challenges & Achievements</h1>
              <p className="text-white/60">Learn about air quality while earning rewards</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 p-6">
              <Trophy className="w-8 h-8 text-yellow-400 mb-2" />
              <div className="text-white mb-1">425</div>
              <p className="text-white/60 text-sm">Total Points</p>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30 p-6">
              <Star className="w-8 h-8 text-purple-400 mb-2" />
              <div className="text-white mb-1">Level 5</div>
              <p className="text-white/60 text-sm">Air Quality Expert</p>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30 p-6">
              <Target className="w-8 h-8 text-blue-400 mb-2" />
              <div className="text-white mb-1">2/4</div>
              <p className="text-white/60 text-sm">Active Challenges</p>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30 p-6">
              <Award className="w-8 h-8 text-green-400 mb-2" />
              <div className="text-white mb-1">3/6</div>
              <p className="text-white/60 text-sm">Achievements</p>
            </Card>
          </div>
          
          {/* Active Challenges */}
          <div className="mb-8">
            <h2 className="text-white mb-4">Active Challenges</h2>
            <div className="grid grid-cols-2 gap-4">
              {challenges.map((challenge, index) => {
                const Icon = challenge.icon;
                return (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`p-6 ${
                        challenge.status === 'completed'
                          ? 'bg-green-500/10 border-green-500/30'
                          : challenge.status === 'locked'
                          ? 'bg-white/5 border-white/10 opacity-60'
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              challenge.status === 'completed'
                                ? 'bg-green-500/20'
                                : 'bg-white/10'
                            }`}
                          >
                            <Icon
                              className={`w-6 h-6 ${
                                challenge.status === 'completed'
                                  ? 'text-green-400'
                                  : 'text-white'
                              }`}
                            />
                          </div>
                          <div>
                            <h3 className="text-white">{challenge.title}</h3>
                            <p className="text-white/60 text-sm">{challenge.description}</p>
                          </div>
                        </div>
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-0">
                          +{challenge.points} pts
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/60">Progress</span>
                          <span className="text-white">
                            {challenge.current}/{challenge.target}
                          </span>
                        </div>
                        <Progress value={challenge.progress} className="h-2" />
                      </div>
                      
                      {challenge.status === 'active' && (
                        <Button
                          className="w-full mt-4 bg-white/10 text-white hover:bg-white/20 border-0"
                        >
                          Continue
                        </Button>
                      )}
                      {challenge.status === 'completed' && (
                        <Button
                          className="w-full mt-4 bg-green-500/20 text-green-400 hover:bg-green-500/30 border-0"
                          disabled
                        >
                          Completed
                        </Button>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
          
          {/* Achievements */}
          <div className="mb-8">
            <h2 className="text-white mb-4">Achievements</h2>
            <Card className="bg-white/5 border-white/10 p-6">
              <div className="grid grid-cols-6 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                        achievement.earned
                          ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                          : 'bg-white/10'
                      }`}
                    >
                      <Award
                        className={`w-8 h-8 ${
                          achievement.earned ? 'text-white' : 'text-white/40'
                        }`}
                      />
                    </div>
                    <p
                      className={`text-xs text-center ${
                        achievement.earned ? 'text-white' : 'text-white/40'
                      }`}
                    >
                      {achievement.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
          
          {/* Quiz */}
          <div>
            <h2 className="text-white mb-4">Daily Quiz</h2>
            <Card className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/30 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white mb-2">Test Your Knowledge</h3>
                  <p className="text-white/60">Answer correctly to earn bonus points!</p>
                </div>
                <Badge className="bg-indigo-500/20 text-indigo-400 border-0">+25 pts</Badge>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4 mb-4">
                <p className="text-white mb-4">{quizQuestions[0].question}</p>
                <div className="space-y-2">
                  {quizQuestions[0].options.map((option, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              
              <Button className="w-full bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 border-0">
                Submit Answer
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
