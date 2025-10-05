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
            className="absolute inset-0 z-30 bg-[#0a0e1a]" // Noir uni
        >
            <div className="h-full overflow-y-auto">
                <div className="max-w-7xl mx-auto p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-gray-200 mb-2">Challenges & Achievements</h1>
                            <p className="text-gray-200/60">Learn about air quality while earning rewards</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="text-gray-200 hover:bg-gray-200/10"
                        >
                            <X className="w-6 h-6" />
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-6 mb-8">
                        <Card className="bg-green-600/20 border-green-600/30 p-6">
                            <Trophy className="w-8 h-8 text-green-600 mb-3" />
                            <div className="text-gray-200">350</div>
                            <p className="text-gray-200/60 text-sm">Points</p>
                        </Card>
                        <Card className="bg-orange-600/20 border-orange-600/30 p-6">
                            <Star className="w-8 h-8 text-orange-600 mb-3" />
                            <div className="text-gray-200">3</div>
                            <p className="text-gray-200/60 text-sm">Achievements</p>
                        </Card>
                        <Card className="bg-green-600/20 border-green-600/30 p-6">
                            <Target className="w-8 h-8 text-green-600 mb-3" />
                            <div className="text-gray-200">2</div>
                            <p className="text-gray-200/60 text-sm">Active Challenges</p>
                        </Card>
                        <Card className="bg-orange-600/20 border-orange-600/30 p-6">
                            <CheckCircle2 className="w-8 h-8 text-orange-600 mb-3" />
                            <div className="text-gray-200">1</div>
                            <p className="text-gray-200/60 text-sm">Completed</p>
                        </Card>
                    </div>

                    {/* Challenges */}
                    <div className="mb-8">
                        <h2 className="text-gray-200 mb-4">Challenges</h2>
                        <div className="grid grid-cols-2 gap-6">
                            {challenges.map((challenge) => {
                                const Icon = challenge.icon;
                                return (
                                    <Card
                                        key={challenge.id}
                                        className={`${
                                            challenge.status === 'completed'
                                                ? 'bg-green-600/20 border-green-600/30'
                                                : challenge.status === 'active'
                                                    ? 'bg-orange-600/20 border-orange-600/30'
                                                    : 'bg-gray-200/10 border-gray-200/20'
                                        } p-6`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <Icon
                                                    className={`w-6 h-6 ${
                                                        challenge.status === 'completed'
                                                            ? 'text-green-600'
                                                            : challenge.status === 'active'
                                                                ? 'text-orange-600'
                                                                : 'text-gray-200/40'
                                                    }`}
                                                />
                                                <div>
                                                    <h3 className="text-gray-200">{challenge.title}</h3>
                                                    <p className="text-gray-200/60 text-sm">{challenge.description}</p>
                                                </div>
                                            </div>
                                            <Badge
                                                className={`${
                                                    challenge.status === 'completed'
                                                        ? 'bg-green-600'
                                                        : challenge.status === 'active'
                                                            ? 'bg-orange-600'
                                                            : 'bg-gray-200/20'
                                                } text-gray-200 border-0`}
                                            >
                                                {challenge.points} pts
                                            </Badge>
                                        </div>
                                        <Progress
                                            value={challenge.progress}
                                            className="h-2 mb-3"
                                            style={{
                                                background: '#0a0e1a',
                                                '--progress-bg': challenge.status === 'completed' ? '#16a34a' : '#ea580c',
                                            } as any}
                                        />
                                        <p className="text-gray-200/60 text-sm">
                                            {challenge.current}/{challenge.target}
                                        </p>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>

                    {/* Achievements */}
                    <div className="mb-8">
                        <h2 className="text-gray-200 mb-4">Achievements</h2>
                        <Card className="bg-green-600/20 border-green-600/30 p-6">
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
                                                achievement.earned ? 'bg-green-600' : 'bg-gray-200/10'
                                            }`}
                                        >
                                            <Award
                                                className={`w-8 h-8 ${
                                                    achievement.earned ? 'text-gray-200' : 'text-gray-200/40'
                                                }`}
                                            />
                                        </div>
                                        <p
                                            className={`text-xs text-center ${
                                                achievement.earned ? 'text-gray-200' : 'text-gray-200/40'
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
                        <h2 className="text-gray-200 mb-4">Daily Quiz</h2>
                        <Card className="bg-orange-600/20 border-orange-600/30 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-gray-200 mb-2">Test Your Knowledge</h3>
                                    <p className="text-gray-200/60">Answer correctly to earn bonus points!</p>
                                </div>
                                <Badge className="bg-green-600 text-gray-200 border-0">+25 pts</Badge>
                            </div>

                            <div className="bg-gray-200/10 rounded-lg p-4 mb-4">
                                <p className="text-gray-200 mb-4">{quizQuestions[0].question}</p>
                                <div className="space-y-2">
                                    {quizQuestions[0].options.map((option, index) => (
                                        <button
                                            key={index}
                                            className="w-full text-left p-3 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-gray-200 transition-all"
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button className="w-full bg-green-600 text-gray-200 hover:bg-green-700 border-0">
                                Submit Answer
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
