import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import RacingGame from '@/components/RacingGame';
import ShootingGame from '@/components/ShootingGame';

interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const games: Game[] = [
  {
    id: 'racing',
    title: '🏎️ Гонки',
    description: 'Управляй машиной стрелками и уворачивайся от препятствий!',
    icon: 'Zap',
    color: 'bg-gradient-to-br from-[#FF6B6B] to-[#FF8B94]'
  },
  {
    id: 'shooting',
    title: '🎯 Попади в цель',
    description: 'Кликай по мишеням и набирай максимум очков!',
    icon: 'Target',
    color: 'bg-gradient-to-br from-[#4ECDC4] to-[#A8E6CF]'
  }
];

export default function Index() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  if (selectedGame === 'racing') {
    return <RacingGame onBack={() => setSelectedGame(null)} />;
  }

  if (selectedGame === 'shooting') {
    return <ShootingGame onBack={() => setSelectedGame(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12 animate-bounce-in">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent drop-shadow-lg">
            🎮 Игровая Платформа
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-semibold">
            Выбери свою любимую игру и начинай веселье!
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {games.map((game, index) => (
            <Card
              key={game.id}
              className={`${game.color} p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:rotate-1 hover:shadow-2xl border-4 border-white animate-bounce-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedGame(game.id)}
            >
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg animate-float">
                    <Icon name={game.icon} size={40} className="text-primary" />
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">
                  {game.title}
                </h2>
                <p className="text-lg text-white/90 font-semibold">
                  {game.description}
                </p>
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 font-bold text-xl px-8 py-6 rounded-full shadow-xl transform transition-transform hover:scale-110"
                >
                  Играть! 🎯
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center space-y-4">
          <div className="flex justify-center gap-4 flex-wrap">
            <div className="bg-white rounded-full px-6 py-3 shadow-lg animate-float">
              <span className="text-2xl font-bold text-primary">🏆 Рекорды</span>
            </div>
            <div className="bg-white rounded-full px-6 py-3 shadow-lg animate-float" style={{ animationDelay: '0.5s' }}>
              <span className="text-2xl font-bold text-secondary">⚡ Азарт</span>
            </div>
            <div className="bg-white rounded-full px-6 py-3 shadow-lg animate-float" style={{ animationDelay: '1s' }}>
              <span className="text-2xl font-bold text-accent">🎨 Веселье</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
