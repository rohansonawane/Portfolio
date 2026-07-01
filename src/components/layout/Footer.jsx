export default function Footer() {
  return (
    <footer className="site-footer">
      <p className="footer-brand">
        Made with{' '}
        <span className="footer-heart" aria-hidden="true">
          <svg viewBox="0 0 7 6" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="">
            <rect x="1" y="0" width="1" height="1" fill="currentColor" />
            <rect x="2" y="0" width="1" height="1" fill="currentColor" />
            <rect x="4" y="0" width="1" height="1" fill="currentColor" />
            <rect x="5" y="0" width="1" height="1" fill="currentColor" />
            <rect x="0" y="1" width="7" height="1" fill="currentColor" />
            <rect x="0" y="2" width="7" height="1" fill="currentColor" />
            <rect x="1" y="3" width="5" height="1" fill="currentColor" />
            <rect x="2" y="4" width="3" height="1" fill="currentColor" />
            <rect x="3" y="5" width="1" height="1" fill="currentColor" />
          </svg>
        </span>{' '}
        by <strong>Rohan Sonawane</strong> · <span className="footer-verse">RohanVerse</span>
      </p>
      <div className="footer-socials">
        <a href="https://github.com/RohanBSonawane" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/rohanbsonawane" target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
      <p className="model-credit">
        3D avatar credit: Based on <a href="https://sketchfab.com/3d-models/midoriya-rigged-hatchxr-afc0941d31b746adb18baaf243d12fb1" target="_blank" rel="noreferrer">Midoriya Rigged (HatchXR)</a> by nitwit.friends, <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC-BY-4.0</a>.
      </p>
    </footer>
  );
}
