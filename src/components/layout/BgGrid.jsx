import { useEffect } from 'react';
import { initBgBeams } from '../../lib/bg-beams.js';

export default function BgGrid() {

  useEffect(() => {
    const cleanup = initBgBeams();
    return () => cleanup?.();
  }, []);

  return (
    <div className="bg-grid" aria-hidden="true">
      <canvas className="bg-beams-canvas" />
      <div className="bg-grid-corners">
        <span className="bg-grid-corner bg-grid-corner--tl" />
        <span className="bg-grid-corner bg-grid-corner--tr" />
        <span className="bg-grid-corner bg-grid-corner--bl" />
        <span className="bg-grid-corner bg-grid-corner--br" />
      </div>
    </div>
  );
}
