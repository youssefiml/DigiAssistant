import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sessionAPI } from '../services/api';
import { 
  FaRobot, 
  FaPaperPlane, 
  FaLightbulb, 
  FaChartBar, 
  FaStar, 
  FaRegStar,
  FaCheckCircle,
  FaClock
} from 'react-icons/fa';

export default function DiagnosticPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 72 });
  const [error, setError] = useState('');
  
  const messagesEndRef = useRef(null);

  const loadFirstQuestion = async () => {
    setLoading(true);
    try {
      console.log('Loading first question for session:', sessionId);
      const data = await sessionAPI.getNextQuestion(sessionId);
      console.log('First question received:', data);
      
      if (data.completed) {
        navigate(`/results/${sessionId}`);
        return;
      }
      
      setProgress({ current: data.progress || 0, total: data.total || 72 });
      // Add AI question to messages
      setMessages([{
        type: 'ai',
        content: data.question_text,
        timestamp: new Date()
      }]);
      setError('');
    } catch (err) {
      console.error('Erreur lors du chargement de la première question:', err.response?.data || err.message);
      setError('Impossible de charger la question pour le moment. Merci de réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFirstQuestion();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userInput.trim() || loading) return;

    // Add user message
    const userMessage = {
      type: 'user',
      content: userInput,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setLoading(true);

    try {
      const response = await sessionAPI.submitAnswer(sessionId, userInput);
      
      // Add AI reaction
      if (response.ai_reaction) {
        setMessages(prev => [...prev, {
          type: 'ai-feedback',
          content: response.ai_reaction,
          score: response.score,
          timestamp: new Date()
        }]);
      }

      // Update progress
      if (response.progress !== undefined) {
        setProgress({ current: response.progress, total: response.total || 72 });
      }

      // Check if completed
      if (response.completed) {
        setTimeout(() => {
          navigate(`/results/${sessionId}`);
        }, 2000);
      } else if (response.next_question) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            type: 'ai',
            content: response.next_question.question_text,
            timestamp: new Date()
          }]);
        }, 1000);
      }
      setError('');
    } catch (err) {
      console.error('Erreur lors de l\'envoi de la réponse:', err.response?.data || err.message);
      setError('Impossible d\'envoyer la réponse pour le moment. Merci de réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = (progress.current / progress.total) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <header style={{ background: 'var(--white)', boxShadow: 'var(--shadow-md)', padding: '0.5rem 1.25rem', borderBottom: '2px solid var(--primary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img 
              src="/logo.png" 
              alt="Digitancy Logo" 
              style={{ height: '2rem', width: 'auto' }} 
              onError={(e) => {
                // Fallback if logo doesn't exist
                e.target.style.display = 'none';
              }}
            />
            <div>
              <h1 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.125rem' }}>
                Diagnostic Digital
              </h1>
              <p style={{ fontSize: '0.75rem', color: 'var(--gray-600)', fontWeight: '500' }}>
                Question {progress.current + 1} / {progress.total}
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--secondary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <FaChartBar /> {Math.round(progressPercentage)}%
            </div>
            <div className="progress-bar" style={{ width: '150px' }}>
              <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1rem', background: 'var(--gray-50)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{ display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' }}
            >
              <div className={msg.type === 'user' ? 'message-user' : msg.type === 'ai-feedback' ? 'message-feedback' : 'message-ai'}>
                {msg.type === 'ai' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <FaRobot style={{ fontSize: '1.25rem', color: 'var(--primary)' }} />
                    <span style={{ fontWeight: '600', color: 'var(--primary)', fontSize: '0.9rem' }}>Assistant Digital</span>
                  </div>
                )}
                {msg.type === 'ai-feedback' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <FaCheckCircle style={{ fontSize: '1.25rem', color: 'var(--secondary)' }} />
                    <span style={{ fontWeight: '600', color: 'var(--secondary)', fontSize: '0.9rem' }}>Feedback</span>
                  </div>
                )}
                <div style={{ fontSize: '0.95rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                  {msg.content}
                </div>
                {msg.score !== undefined && (
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--gray-300)', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gray-700)' }}>
                    <FaChartBar style={{ color: 'var(--secondary)' }} />
                    Score: {msg.score}/3 
                    {msg.score === 3 && <><FaStar style={{ color: '#fbbf24', fontSize: '0.9rem' }} /><FaStar style={{ color: '#fbbf24', fontSize: '0.9rem' }} /><FaStar style={{ color: '#fbbf24', fontSize: '0.9rem' }} /></>}
                    {msg.score === 2 && <><FaStar style={{ color: '#fbbf24', fontSize: '0.9rem' }} /><FaStar style={{ color: '#fbbf24', fontSize: '0.9rem' }} /><FaRegStar style={{ color: '#d1d5db', fontSize: '0.9rem' }} /></>}
                    {msg.score === 1 && <><FaStar style={{ color: '#fbbf24', fontSize: '0.9rem' }} /><FaRegStar style={{ color: '#d1d5db', fontSize: '0.9rem' }} /><FaRegStar style={{ color: '#d1d5db', fontSize: '0.9rem' }} /></>}
                    {msg.score === 0 && <><FaRegStar style={{ color: '#d1d5db', fontSize: '0.9rem' }} /><FaRegStar style={{ color: '#d1d5db', fontSize: '0.9rem' }} /><FaRegStar style={{ color: '#d1d5db', fontSize: '0.9rem' }} /></>}
                  </div>
                )}
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <FaClock style={{ fontSize: '0.65rem' }} />
                  {msg.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div className="message-ai" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FaRobot style={{ fontSize: '1.25rem', color: 'var(--primary)' }} />
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div style={{ background: 'var(--white)', borderTop: '2px solid var(--gray-200)', padding: '1rem 1rem 1.5rem', boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {error && (
            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#fee2e2', border: '2px solid #ef4444', borderRadius: '0.75rem', color: '#991b1b', fontSize: '0.875rem', fontWeight: '500' }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div style={{ 
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              background: '#ffffff',
              border: '2px solid #e5e7eb',
              borderRadius: '50px',
              padding: '0.625rem 0.875rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.15)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
            }}
            >
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Votre réponse ici..."
                style={{ 
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                  background: 'transparent',
                  color: '#1f2937',
                  padding: '0.5rem 0',
                  fontFamily: 'inherit',
                  minWidth: '0'
                }}
                disabled={loading}
              />
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(0.375rem, 2vw, 0.75rem)',
                marginLeft: 'clamp(0.5rem, 2vw, 1rem)',
                flexShrink: 0
              }}>
                <div style={{ 
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                  color: '#9ca3af',
                  fontWeight: '500',
                  display: window.innerWidth < 480 ? 'none' : 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  ⌘ {userInput.length}
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !userInput.trim()}
                  style={{ 
                    width: 'clamp(40px, 10vw, 48px)',
                    height: 'clamp(40px, 10vw, 48px)',
                    borderRadius: '50%',
                    background: loading || !userInput.trim() ? '#d1d5db' : '#111827',
                    border: 'none',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: loading || !userInput.trim() ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '1.25rem',
                    boxShadow: loading || !userInput.trim() ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.2)',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    if (!loading && userInput.trim()) {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.background = 'var(--primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading && userInput.trim()) {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.background = '#111827';
                    }
                  }}
                >
                  {loading ? (
                    <div style={{ display: 'flex', gap: '0.125rem' }}>
                      <span className="typing-dot" style={{ width: '3px', height: '3px' }} />
                      <span className="typing-dot" style={{ width: '3px', height: '3px' }} />
                      <span className="typing-dot" style={{ width: '3px', height: '3px' }} />
                    </div>
                  ) : (
                    <svg 
                      width="22" 
                      height="22" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M12 19V5M5 12l7-7 7 7"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </form>
          
          <div style={{ 
            marginTop: '0.75rem', 
            display: 'flex', 
            flexDirection: window.innerWidth < 640 ? 'column' : 'row',
            justifyContent: 'space-between', 
            alignItems: window.innerWidth < 640 ? 'flex-start' : 'center',
            gap: '0.5rem',
            fontSize: 'clamp(0.625rem, 2vw, 0.75rem)',
            color: '#9ca3af'
          }}>
            <p style={{ 
              fontWeight: '500', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.375rem' 
            }}>
              <FaLightbulb style={{ color: 'var(--secondary)', fontSize: '0.875rem' }} />
              Soyez précis et détaillé
            </p>
            <p style={{ 
              fontWeight: '500',
              fontStyle: 'italic',
              display: window.innerWidth < 480 ? 'none' : 'block'
            }}>
              Entrée pour envoyer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
