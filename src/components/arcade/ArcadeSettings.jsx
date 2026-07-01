import { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeProvider';
import { loadSettings, saveSettings } from '../../arcade/data.js';

export default function ArcadeSettings() {
  const { toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    document.querySelector('.arcade-page')?.classList.toggle(
      'no-anim',
      !settings.animations || settings.reducedMotion
    );
  }, [settings]);

  const toggle = (key) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      saveSettings(next);
      if (key === 'music' && typeof window.naSetMusic === 'function') {
        window.naSetMusic(next.music);
      }
      return next;
    });
  };

  return (
    <>
      <button
        className="arcade-settings-fab arcade-btn-shiny-sm"
        type="button"
        id="arcadeSettingsFab"
        aria-label="Open settings"
        onClick={() => setOpen(true)}
      >
        ⚙
      </button>
      <div className={`arcade-modal${open ? ' open' : ''}`} id="arcadeSettingsModal" role="dialog" aria-modal="true" aria-labelledby="settingsTitle" onClick={(e) => { if (e.target.id === 'arcadeSettingsModal') setOpen(false); }}>
        <div className="arcade-modal-dialog">
          <div className="arcade-modal-head">
            <h2 id="settingsTitle">Settings</h2>
            <button className="arcade-slide-arrow arcade-btn-shiny-sm" type="button" id="arcadeSettingsClose" aria-label="Close settings" onClick={() => setOpen(false)}>×</button>
          </div>
          {['sound', 'music', 'animations', 'reducedMotion'].map((key) => (
            <div className="arcade-setting-row" key={key}>
              <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}</span>
              <button className={`arcade-toggle${settings[key] ? ' on' : ''}`} type="button" data-setting={key} aria-label={`Toggle ${key}`} onClick={() => toggle(key)} />
            </div>
          ))}
          <div className="arcade-setting-row">
            <span>Theme</span>
            <button className="arcade-btn arcade-btn-secondary arcade-btn-shiny theme-toggle" type="button" onClick={toggleTheme}>Toggle Light/Dark</button>
          </div>
          <div className="arcade-setting-row">
            <span>Reset progress</span>
            <button className="arcade-btn arcade-btn-secondary arcade-btn-shiny" type="button" id="resetProgressBtn" onClick={() => {
              localStorage.removeItem('na-scores');
              localStorage.removeItem('na-achievements');
              localStorage.removeItem('na-played');
            }}>Reset</button>
          </div>
        </div>
      </div>
    </>
  );
}
