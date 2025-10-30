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
import { MdDashboard } from 'react-icons/md';

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
      console.error('Error loading first question:', err);
      console.error('Error details:', err.response?.data);
      setError('Erreur lors du chargement de la question: ' + (err.response?.data?.detail || err.message));
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
      console.error('Error submitting answer:', err);
      console.error('Error details:', err.response?.data);
      setError('Erreur lors de l\'envoi de la réponse: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = (progress.current / progress.total) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <header style={{ background: 'var(--white)', boxShadow: 'var(--shadow-md)', padding: '1.25rem 2rem', borderBottom: '3px solid var(--primary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <MdDashboard style={{ fontSize: '2rem', color: 'var(--primary)' }} />
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
                Diagnostic Digital
              </h1>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginTop: '0.25rem', fontWeight: '500' }}>
                Question {progress.current + 1} / {progress.total}
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <FaChartBar /> {Math.round(progressPercentage)}%
            </div>
            <div className="progress-bar" style={{ width: '180px' }}>
              <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 1rem', background: 'var(--gray-50)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{ display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' }}
            >
              <div className={msg.type === 'user' ? 'message-user' : msg.type === 'ai-feedback' ? 'message-feedback' : 'message-ai'}>
                {msg.type === 'ai' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <FaRobot style={{ fontSize: '1.5rem', color: 'var(--primary)' }} />
                    <span style={{ fontWeight: '600', color: 'var(--primary)' }}>Assistant Digital</span>
                  </div>
                )}
                {msg.type === 'ai-feedback' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <FaCheckCircle style={{ fontSize: '1.5rem', color: 'var(--secondary)' }} />
                    <span style={{ fontWeight: '600', color: 'var(--secondary)' }}>Feedback</span>
                  </div>
                )}
                <div style={{ fontSize: '1.05rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {msg.content}
                </div>
                {msg.score !== undefined && (
                  <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '2px solid var(--gray-300)', fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gray-700)' }}>
                    <FaChartBar style={{ color: 'var(--secondary)' }} />
                    Score: {msg.score}/3 
                    {msg.score === 3 && <><FaStar style={{ color: '#fbbf24' }} /><FaStar style={{ color: '#fbbf24' }} /><FaStar style={{ color: '#fbbf24' }} /></>}
                    {msg.score === 2 && <><FaStar style={{ color: '#fbbf24' }} /><FaStar style={{ color: '#fbbf24' }} /><FaRegStar style={{ color: '#d1d5db' }} /></>}
                    {msg.score === 1 && <><FaStar style={{ color: '#fbbf24' }} /><FaRegStar style={{ color: '#d1d5db' }} /><FaRegStar style={{ color: '#d1d5db' }} /></>}
                    {msg.score === 0 && <><FaRegStar style={{ color: '#d1d5db' }} /><FaRegStar style={{ color: '#d1d5db' }} /><FaRegStar style={{ color: '#d1d5db' }} /></>}
                  </div>
                )}
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <FaClock style={{ fontSize: '0.7rem' }} />
                  {msg.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div className="message-ai" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FaRobot style={{ fontSize: '1.5rem', color: 'var(--primary)' }} />
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
      <div style={{ background: 'var(--white)', borderTop: '2px solid var(--gray-200)', padding: '1.5rem 2rem', boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {error && (
            <div style={{ marginBottom: '1rem', padding: '1rem', background: '#fee2e2', border: '2px solid #ef4444', borderRadius: '1rem', color: '#991b1b', fontSize: '0.95rem', fontWeight: '500' }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Décrivez votre réponse de manière détaillée..."
                className="input-field"
                style={{ 
                  resize: 'vertical', 
                  minHeight: '110px',
                  fontSize: '1rem',
                  paddingRight: '1.25rem'
                }}
                disabled={loading}
              />
              <div style={{ 
                position: 'absolute', 
                bottom: '0.75rem', 
                right: '1rem', 
                fontSize: '0.75rem', 
                color: 'var(--gray-500)',
                background: 'var(--white)',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.5rem',
                fontWeight: '500'
              }}>
                {userInput.length} caractères
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !userInput.trim()}
              className="btn-primary"
              style={{ 
                padding: '1.25rem 2rem', 
                fontSize: '1.05rem', 
                whiteSpace: 'nowrap', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                minHeight: '3.5rem'
              }}
            >
              <FaPaperPlane /> {loading ? 'Envoi...' : 'Envoyer'}
            </button>
          </form>
          
          <div style={{ 
            marginTop: '1rem', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            fontSize: '0.85rem',
            color: 'var(--gray-600)'
          }}>
            <p style={{ 
              fontWeight: '500', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem' 
            }}>
              <FaLightbulb style={{ color: 'var(--secondary)' }} />
              Soyez précis et détaillé pour un meilleur diagnostic
            </p>
            <p style={{ 
              fontWeight: '500',
              color: 'var(--gray-500)',
              fontStyle: 'italic'
            }}>
              Entrée pour envoyer • Shift+Entrée pour nouvelle ligne
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
