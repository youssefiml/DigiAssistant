import { FaRobot } from 'react-icons/fa';

export default function TypingIndicator() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'flex-start',
      gap: '0.75rem',
    }}>
      {/* Avatar */}
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #004D4D, #006666)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <FaRobot style={{ fontSize: '1.125rem' }} />
      </div>

      {/* Typing bubble */}
      <div 
        className="glass-message-ai" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '1rem 1.25rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  );
}

