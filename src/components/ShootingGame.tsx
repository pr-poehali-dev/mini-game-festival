import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface ShootingGameProps {
  onBack: () => void;
}

interface Target {
  id: number;
  x: number;
  y: number;
  speed: number;
}

export default function ShootingGame({ onBack }: ShootingGameProps) {
  const [targets, setTargets] = useState<Target[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const startGame = () => {
    setTargets([]);
    setScore(0);
    setTimeLeft(30);
    setGameStarted(true);
    setGameOver(false);
  };

  const createTarget = () => {
    const newTarget: Target = {
      id: Date.now(),
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 10,
      speed: Math.random() * 2 + 1
    };
    setTargets(prev => [...prev, newTarget]);
  };

  const hitTarget = (targetId: number) => {
    setTargets(prev => prev.filter(t => t.id !== targetId));
    setScore(prev => prev + 10);
  };

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const targetInterval = setInterval(() => {
      createTarget();
    }, 1200);

    return () => clearInterval(targetInterval);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const moveInterval = setInterval(() => {
      setTargets(prev => 
        prev.map(target => ({
          ...target,
          x: target.x + (Math.random() - 0.5) * target.speed * 2,
          y: target.y + (Math.random() - 0.5) * target.speed * 2
        })).filter(target => 
          target.x >= 5 && target.x <= 95 && 
          target.y >= 5 && target.y <= 95
        )
      );
    }, 50);

    return () => clearInterval(moveInterval);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          setGameStarted(false);
          if (score > highScore) {
            setHighScore(score);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [gameStarted, gameOver, score, highScore]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-yellow-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Button
            onClick={onBack}
            variant="outline"
            size="lg"
            className="bg-white font-bold"
          >
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад
          </Button>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">🎯 Очки: {score}</div>
            <div className="text-lg font-semibold text-secondary">🏆 Рекорд: {highScore}</div>
          </div>
        </div>

        <Card className="bg-white p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-5xl font-bold text-primary mb-2">🎯 Попади в цель</h1>
            <p className="text-lg text-muted-foreground font-semibold">
              Кликай по мишеням и набирай максимум очков за 30 секунд!
            </p>
          </div>

          <div className="relative bg-gradient-to-br from-cyan-400 via-blue-300 to-purple-400 rounded-3xl overflow-hidden border-8 border-white shadow-2xl"
            style={{ height: '600px' }}>
            
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className={`text-4xl font-bold px-8 py-4 rounded-full ${
                timeLeft <= 10 ? 'bg-red-500 animate-pulse' : 'bg-white'
              } shadow-xl`}>
                ⏱️ {timeLeft}с
              </div>
            </div>

            {!gameStarted && !gameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="text-center space-y-6 animate-bounce-in">
                  <div className="text-8xl">🎯</div>
                  <h2 className="text-4xl font-bold text-white">Готов стрелять?</h2>
                  <p className="text-xl text-white/90">Попади в максимум мишеней за 30 секунд!</p>
                  <Button
                    onClick={startGame}
                    size="lg"
                    className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold text-2xl px-12 py-8 rounded-full shadow-2xl transform hover:scale-110 transition-all"
                  >
                    Начать! 🚀
                  </Button>
                </div>
              </div>
            )}

            {gameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                <div className="text-center space-y-6 animate-bounce-in">
                  <div className="text-8xl">🎉</div>
                  <h2 className="text-5xl font-bold text-white">Время вышло!</h2>
                  <p className="text-3xl text-yellow-400 font-bold">Очки: {score}</p>
                  {score === highScore && score > 0 && (
                    <p className="text-2xl text-green-400 font-bold animate-pulse">🏆 Новый рекорд!</p>
                  )}
                  <Button
                    onClick={startGame}
                    size="lg"
                    className="bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-600 text-white font-bold text-2xl px-12 py-8 rounded-full shadow-2xl transform hover:scale-110 transition-all"
                  >
                    Играть снова! 🎮
                  </Button>
                </div>
              </div>
            )}

            {gameStarted && targets.map(target => (
              <button
                key={target.id}
                onClick={() => hitTarget(target.id)}
                className="absolute w-16 h-16 text-5xl transition-transform hover:scale-125 cursor-crosshair animate-pulse"
                style={{
                  left: `${target.x}%`,
                  top: `${target.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                🎯
              </button>
            ))}
          </div>

          <div className="mt-6 text-center">
            <div className="inline-block bg-gradient-to-r from-yellow-100 to-orange-200 rounded-2xl px-8 py-4 shadow-lg">
              <span className="text-xl font-bold">🖱️ Кликай по мишеням!</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
