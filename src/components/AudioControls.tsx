import { useState } from 'react';
import { AudioManager } from '../audio/AudioManager';

export function AudioControls() {
  const [muted, setMuted] = useState(() => AudioManager.getSettings().muted);

  const toggle = () => {
    AudioManager.toggleMute();
    setMuted(!muted);
  };

  return (
    <button
      onClick={toggle}
      title={muted ? 'Unmute' : 'Mute'}
      style={{
        background: 'none',
        border: '1px solid var(--color-border)',
        borderRadius: 3,
        padding: '4px 10px',
        fontFamily: 'var(--font-ui)',
        fontSize: '0.8rem',
        cursor: 'pointer',
        color: 'var(--color-text-muted)',
      }}
    >
      {muted ? 'Sound Off' : 'Sound On'}
    </button>
  );
}
