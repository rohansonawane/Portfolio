import ArcadeHub from '../components/arcade/ArcadeHub';
import PageMeta from '../components/seo/PageMeta';

export default function PlayHubPage() {
  return (
    <>
      <PageMeta
        title="Notebook Arcade"
        description="Classic school games rebuilt for the web: Tic Tac Toe, Sudoku, Snake, and more in Rohan Sonawane's Notebook Arcade."
        path="/play"
        image="/assets/notebook-arcade/images/hero-background.png"
      />
      <div className={`arcade-page`} data-arcade-page="hub">
        <div className="arcade-shell">
          <div className="arcade-inner">
            <ArcadeHub />
          </div>
        </div>
      </div>
    </>
  );
}
