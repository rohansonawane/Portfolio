import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageMeta from '../components/seo/PageMeta';
import ArcadeSettings from '../components/arcade/ArcadeSettings';
import { getGameById } from '../arcade/data.js';
import { trackEvent } from '../lib/analytics';

export default function PlayGamePage() {
  const { gameId } = useParams();
  const game = getGameById(gameId);

  useEffect(() => {
    trackEvent('game_play', { game: gameId });
    import('../arcade/game-page.js').then((mod) => {
      mod.initGamePage(gameId);
    });
  }, [gameId]);

  return (
    <>
      <PageMeta
        title={game ? `${game.title} | Notebook Arcade` : 'Game | Notebook Arcade'}
        description={game?.rules || 'Play classic pencil-and-paper games in Notebook Arcade.'}
        path={`/play/${gameId}`}
        image={game ? `/assets/notebook-arcade/images/${game.id}.png` : undefined}
      />
      <div className="arcade-page" data-arcade-page="game">
        <div className="arcade-shell">
          <div className="arcade-inner arcade-inner--game">
            <div id="gameApp" />
          </div>
        </div>
      </div>
      <ArcadeSettings />
    </>
  );
}
