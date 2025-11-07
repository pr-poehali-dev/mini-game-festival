import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface RacingGameProps {
  onBack: () => void;
}

interface Obstacle {
  id: number;
  x: number;
  y: number;
}

export default function RacingGame({ onBack }: RacingGameProps) {
  const [carPosition, setCarPosition] = useState(50);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const startGame = () => {
    setCarPosition(50);
    setObstacles([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameOver || !gameStarted) return;
    
    if (e.key === 'ArrowLeft') {
      setCarPosition(prev => Math.max(10, prev - 15));
    } else if (e.key === 'ArrowRight') {
      setCarPosition(prev => Math.min(90, prev + 15));
    }
  }, [gameOver, gameStarted]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const obstacleInterval = setInterval(() => {
      setObstacles(prev => [
        ...prev,
        {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: 0
        }
      ]);
    }, 1500);

    return () => clearInterval(obstacleInterval);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const moveInterval = setInterval(() => {
      setObstacles(prev => {
        const updated = prev
          .map(obs => ({ ...obs, y: obs.y + 5 }))
          .filter(obs => obs.y < 100);

        updated.forEach(obs => {
          if (obs.y > 80 && obs.y < 95) {
            const distance = Math.abs(obs.x - carPosition);
            if (distance < 10) {
              setGameOver(true);
              if (score > highScore) {
                setHighScore(score);
              }
            }
          }
        });

        return updated;
      });

      setScore(prev => prev + 1);
    }, 50);

    return () => clearInterval(moveInterval);
  }, [gameStarted, gameOver, carPosition, score, highScore]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-50 p-4">
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
            <div className="text-2xl font-bold text-primary">🏁 Очки: {score}</div>
            <div className="text-lg font-semibold text-secondary">🏆 Рекорд: {highScore}</div>
          </div>
        </div>

        <Card className="bg-white p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-5xl font-bold text-primary mb-2">🏎️ Гонки</h1>
            <p className="text-lg text-muted-foreground font-semibold">
              Управляй стрелками ← → и уворачивайся от препятствий!
            </p>
          </div>

          <div className="relative bg-gradient-to-b from-gray-700 to-gray-900 rounded-3xl overflow-hidden border-8 border-white shadow-2xl"
            style={{ height: '600px' }}>
            
            <div className="absolute inset-0 flex justify-center">
              <div className="w-1 bg-yellow-400 animate-pulse" style={{ 
                backgroundImage: 'linear-gradient(to bottom, transparent 0%, transparent 40%, #facc15 40%, #facc15 60%, transparent 60%, transparent 100%)',
                backgroundSize: '100% 60px',
                animation: 'roadline 0.5s linear infinite'
              }} />
            </div>

            {!gameStarted && !gameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="text-center space-y-6 animate-bounce-in">
                  <div className="text-8xl">🏁</div>
                  <h2 className="text-4xl font-bold text-white">Готов к гонке?</h2>
                  <Button
                    onClick={startGame}
                    size="lg"
                    className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold text-2xl px-12 py-8 rounded-full shadow-2xl transform hover:scale-110 transition-all"
                  >
                    Старт! 🚀
                  </Button>
                </div>
              </div>
            )}

            {gameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                <div className="text-center space-y-6 animate-bounce-in">
                  <div className="text-8xl">💥</div>
                  <h2 className="text-5xl font-bold text-white">Авария!</h2>
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

            {obstacles.map(obstacle => (
              <div
                key={obstacle.id}
                className="absolute w-12 h-12 text-4xl transition-all duration-75"
                style={{
                  left: `${obstacle.x}%`,
                  top: `${obstacle.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                🚧
              </div>
            ))}

            <div
              className="absolute bottom-8 w-16 h-24 text-5xl transition-all duration-100"
              style={{
                left: `${carPosition}%`,
                transform: 'translateX(-50%)'
              }}
            >
              🏎️
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl px-6 py-3 shadow-lg">
              <span className="text-xl font-bold">⬅️ Влево</span>
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl px-6 py-3 shadow-lg">
              <span className="text-xl font-bold">➡️ Вправо</span>
            </div>
          </div>
        </Card>
      </div>

      <style>{`
        @keyframes roadline {
          from { background-position-y: 0; }
          to { background-position-y: 60px; }
        }
      `}</style>
    </div>
  );
}
