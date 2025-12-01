import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sessionAPI } from '../services/api';
import { FaPaperPlane, FaLightbulb } from 'react-icons/fa';
import ChatMessage from '../components/ChatMessage';
import TypingIndicator from '../components/TypingIndicator';

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
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      background: 'linear-gradient(135deg, #ffffff 0%, #e0f2f1 50%, #ffffff 100%)'
    }}>
      {/* Header with Glass Effect */}
      <header className="glass-header" style={{ 
        padding: '1rem 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img 
              src="/logo.png" 
              alt="DigiAssistant Logo" 
              style={{ height: '2.5rem', width: 'auto' }} 
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div>
              <h1 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.25rem' }}>
                Diagnostic Digital
              </h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', fontWeight: '500' }}>
                Question <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{progress.current + 1}</span> / {progress.total}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--secondary)' }}>
              {Math.round(progressPercentage)}%
            </div>
            <div style={{ 
              width: '140px', 
              height: '8px', 
              background: 'rgba(0, 0, 0, 0.1)', 
              borderRadius: '50px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${progressPercentage}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)',
                transition: 'width 0.5s ease',
                borderRadius: '50px'
              }} />
            </div>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '2rem 1.5rem',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} />
          ))}
          
          {loading && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area with Glass Effect */}
      <div className="glass-header" style={{ 
        padding: '1.5rem',
        position: 'sticky',
        bottom: 0,
        borderTop: '1px solid rgba(255, 255, 255, 0.3)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {error && (
            <div style={{ 
              marginBottom: '1rem', 
              padding: '1rem', 
              background: 'rgba(254, 226, 226, 0.95)',
              backdropFilter: 'blur(12px)',
              border: '2px solid #ef4444', 
              borderRadius: '1rem', 
              color: '#991b1b', 
              fontSize: '0.875rem', 
              fontWeight: '500',
              boxShadow: '0 4px 16px rgba(239, 68, 68, 0.2)'
            }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
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
              placeholder="Share your response..."
              className="glass-input"
              disabled={loading}
              style={{ flex: 1 }}
            />
            
            <button
              type="submit"
              disabled={loading || !userInput.trim()}
              className="glass-button"
            >
              {loading ? (
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <span className="typing-dot" style={{ width: '4px', height: '4px', background: 'white' }} />
                  <span className="typing-dot" style={{ width: '4px', height: '4px', background: 'white' }} />
                  <span className="typing-dot" style={{ width: '4px', height: '4px', background: 'white' }} />
                </div>
              ) : (
                <FaPaperPlane style={{ fontSize: '1.125rem' }} />
              )}
            </button>
          </form>
          
          <div style={{ 
            marginTop: '0.875rem', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            fontSize: '0.75rem',
            color: 'var(--gray-600)'
          }}>
            <p style={{ 
              fontWeight: '500', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem' 
            }}>
              <FaLightbulb style={{ color: 'var(--secondary)', fontSize: '1rem' }} />
              Soyez précis et détaillé
            </p>
            <p style={{ fontWeight: '500' }}>
              {userInput.length} caractères
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}