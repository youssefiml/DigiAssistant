import { FaRobot, FaCheckCircle, FaStar } from 'react-icons/fa';

export default function ChatMessage({ message }) {
  const { type, content, score, timestamp } = message;

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'flex-start',
      gap: '0.75rem',
      justifyContent: type === 'user' ? 'flex-end' : 'flex-start',
    }}>
      {/* Avatar - Only for AI messages */}
      {type !== 'user' && (
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: type === 'ai-feedback' 
            ? 'linear-gradient(135deg, #B4003C, #CC0044)' 
            : 'linear-gradient(135deg, #004D4D, #006666)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          {type === 'ai-feedback' ? (
            <FaCheckCircle style={{ fontSize: '1.125rem' }} />
          ) : (
            <FaRobot style={{ fontSize: '1.125rem' }} />
          )}
        </div>
      )}

      {/* Message Bubble */}
      <div 
        className={
          type === 'user' 
            ? 'glass-message-user' 
            : type === 'ai-feedback' 
            ? 'glass-message-feedback' 
            : 'glass-message-ai'
        }
        style={{ 
          maxWidth: '70%',
          minWidth: '100px'
        }}
      >

        {/* Message Content */}
        <div style={{ 
          fontSize: '0.9375rem', 
          lineHeight: '1.5', 
          whiteSpace: 'pre-wrap',
          color: type === 'user' ? 'white' : '#1f2937'
        }}>
          {content}
        </div>

        {/* Score Display - Simplified */}
        {score !== undefined && (
          <div style={{ 
            marginTop: '0.75rem',
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.375rem'
          }}>
            {[...Array(3)].map((_, i) => (
              <FaStar 
                key={i}
                style={{ 
                  color: i < score ? '#fbbf24' : '#e5e7eb',
                  fontSize: '0.875rem'
                }} 
              />
            ))}
            <span style={{ 
              fontSize: '0.75rem',
              color: type === 'user' ? 'rgba(255, 255, 255, 0.7)' : '#6b7280',
              marginLeft: '0.25rem',
              fontWeight: '500'
            }}>
              {score}/3
            </span>
          </div>
        )}

        {/* Timestamp - Simplified */}
        <div style={{ 
          fontSize: '0.6875rem', 
          color: type === 'user' ? 'rgba(255, 255, 255, 0.6)' : '#9ca3af', 
          marginTop: '0.5rem',
          fontWeight: '500'
        }}>
          {timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}