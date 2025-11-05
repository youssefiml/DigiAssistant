import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sessionAPI } from '../services/api';
import { 
  FaHome,
  FaChartBar,
  FaCog,
  FaUsers,
  FaHandshake,
  FaLayerGroup,
  FaServer,
  FaShieldAlt,
  FaDownload,
  FaLightbulb,
  FaExclamationCircle
} from 'react-icons/fa';

export default function ResultsPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  const loadResults = async () => {
    try {
      const data = await sessionAPI.getResults(sessionId);
      setResults(data);
    } catch (err) {
      setError('Erreur lors du chargement des résultats: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const handleDownloadPDF = async () => {
    setDownloadingPDF(true);
    try {
      const blob = await sessionAPI.downloadPDF(sessionId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `diagnostic_report_${sessionId}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert('Erreur lors du téléchargement du PDF');
    } finally {
      setDownloadingPDF(false);
    }
  };

  const getDimensionIcon = (dimensionCode) => {
    const icons = {
      'STRAT': <FaCog style={{ fontSize: '1.5rem' }} />,
      'CULTURE': <FaUsers style={{ fontSize: '1.5rem' }} />,
      'CLIENT': <FaHandshake style={{ fontSize: '1.5rem' }} />,
      'PROCESS': <FaLayerGroup style={{ fontSize: '1.5rem' }} />,
      'TECH': <FaServer style={{ fontSize: '1.5rem' }} />,
      'SECURITE': <FaShieldAlt style={{ fontSize: '1.5rem' }} />
    };
    return icons[dimensionCode] || <FaChartBar style={{ fontSize: '1.5rem' }} />;
  };

  const getScoreColor = (score) => {
    if (score >= 2.5) return '#059669'; // green-600
    if (score >= 1.5) return '#d97706'; // amber-600
    return '#dc2626'; // red-600
  };

  const getScoreLabel = (score) => {
    if (score >= 2.5) return 'Excellent';
    if (score >= 2.0) return 'Très Bon';
    if (score >= 1.5) return 'Bon';
    if (score >= 1.0) return 'Moyen';
    return 'À Améliorer';
  };

  const getMaturityLevelColor = (level) => {
    const colors = {
      'beginner': '#6b7280', // gray-500
      'emergent': '#059669', // green-600
      'challenger': '#2563eb', // blue-600
      'leader': '#7c3aed' // violet-600
    };
    return colors[level] || '#6b7280';
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--gray-600)', fontSize: '1.1rem' }}>Chargement des résultats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)' }}>
        <div className="card" style={{ maxWidth: '500px', textAlign: 'center' }}>
          <p style={{ color: '#ef4444', fontSize: '1.1rem', marginBottom: '1.5rem' }}>{error}</p>
          <button onClick={() => navigate('/')} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaHome /> Retour au dashboard
          </button>
        </div>
      </div>
    );
  }

  const globalScore = results?.global_score || 0;
  const dimensions = results?.dimension_scores || [];
  const recommendations = results?.recommendations || [];
  const gaps = results?.gaps || [];
  const maturityLevel = results?.maturity_profile?.level || 'beginner';
  const maturityDescription = results?.maturity_profile?.description || '';
  const companyName = results?.company_name || '';

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Header */}
      <header style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '1rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img 
              src="/logo.png" 
              alt="Digitancy Logo" 
              style={{ height: '2.5rem', width: 'auto' }} 
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                Résultats du Diagnostic
              </h1>
              {companyName && (
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                  {companyName}
                </p>
              )}
            </div>
          </div>
          <button 
            onClick={() => navigate('/')} 
            className="btn-secondary"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.625rem 1.25rem',
              background: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              color: '#374151',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            <FaHome /> Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Score Overview */}
        <div style={{ 
          background: '#ffffff', 
          border: '1px solid #e5e7eb', 
          borderRadius: '0.75rem', 
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Score Global
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '3.5rem', fontWeight: '700', color: '#111827' }}>
                  {globalScore.toFixed(1)}
                </span>
                <span style={{ fontSize: '1.5rem', fontWeight: '500', color: '#9ca3af' }}>/ 3</span>
              </div>
              <div style={{ 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: getScoreColor(globalScore),
                marginTop: '0.5rem'
              }}>
                {getScoreLabel(globalScore)}
              </div>
            </div>
            
            <div style={{ borderLeft: '1px solid #e5e7eb', paddingLeft: '2rem' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Niveau de Maturité
              </div>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                color: getMaturityLevelColor(maturityLevel),
                marginBottom: '0.5rem',
                textTransform: 'capitalize'
              }}>
                {maturityLevel}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.5' }}>
                {maturityDescription}
              </div>
            </div>

            <div style={{ borderLeft: '1px solid #e5e7eb', paddingLeft: '2rem' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Maturité Digitale
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
                {((globalScore / 3) * 100).toFixed(0)}%
              </div>
              <div className="progress-bar" style={{ height: '0.5rem', background: '#f3f4f6', borderRadius: '0.25rem' }}>
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${(globalScore / 3) * 100}%`,
                    background: getMaturityLevelColor(maturityLevel),
                    height: '100%',
                    borderRadius: '0.25rem',
                    transition: 'width 0.3s ease'
                  }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dimensions */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>
            Dimensions Évaluées
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {dimensions.map((dim) => {
              const avgScore = dim.score ?? 0;
              const answeredCount = dim.answered_count ?? 0;
              
              return (
                <div 
                  key={dim.dimension_code} 
                  style={{ 
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    padding: '1.5rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ 
                      color: '#374151',
                      padding: '0.75rem',
                      background: '#f9fafb',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {getDimensionIcon(dim.dimension_code)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                        {dim.dimension_name}
                      </h3>
                      <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '500' }}>
                        {dim.dimension_code}
                      </p>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Score</span>
                      <span style={{ fontSize: '1.5rem', fontWeight: '700', color: getScoreColor(avgScore) }}>
                        {avgScore.toFixed(1)}/3
                      </span>
                    </div>
                    <div className="progress-bar" style={{ height: '0.375rem', background: '#f3f4f6', borderRadius: '0.25rem', marginBottom: '0.5rem' }}>
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${(avgScore / 3) * 100}%`,
                          background: getScoreColor(avgScore),
                          height: '100%',
                          borderRadius: '0.25rem'
                        }} 
                      />
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '500', color: getScoreColor(avgScore) }}>
                      {getScoreLabel(avgScore)}
                    </div>
                  </div>

                  <div style={{ 
                    paddingTop: '1rem', 
                    borderTop: '1px solid #f3f4f6',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {answeredCount} questions répondues
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations / Solutions */}
        {recommendations.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#111827', 
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <FaLightbulb style={{ color: '#f59e0b' }} />
              Recommandations et Solutions
            </h2>
            <div style={{ 
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recommendations.map((rec, idx) => (
                  <div 
                    key={idx}
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      padding: '1rem',
                      background: '#f9fafb',
                      borderRadius: '0.5rem',
                      border: '1px solid #f3f4f6'
                    }}
                  >
                    <div style={{ 
                      flexShrink: 0,
                      width: '1.5rem',
                      height: '1.5rem',
                      borderRadius: '50%',
                      background: '#374151',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {idx + 1}
                    </div>
                    <div style={{ flex: 1, fontSize: '0.9375rem', color: '#374151', lineHeight: '1.6' }}>
                      {rec}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Gaps Section */}
        {gaps.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#111827', 
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <FaExclamationCircle style={{ color: '#dc2626' }} />
              Points d'Amélioration
            </h2>
            <div style={{ 
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {gaps.map((gap, idx) => (
                  <div 
                    key={idx}
                    style={{
                      display: 'flex',
                      gap: '0.75rem',
                      alignItems: 'flex-start',
                      padding: '0.75rem',
                      background: '#fef2f2',
                      borderRadius: '0.5rem',
                      border: '1px solid #fee2e2'
                    }}
                  >
                    <FaExclamationCircle style={{ 
                      color: '#dc2626', 
                      fontSize: '0.875rem',
                      marginTop: '0.125rem',
                      flexShrink: 0
                    }} />
                    <div style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: '1.6' }}>
                      {gap}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center',
          flexWrap: 'wrap',
          paddingTop: '2rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          <button 
            onClick={handleDownloadPDF}
            disabled={downloadingPDF}
            style={{ 
              padding: '0.875rem 1.75rem', 
              fontSize: '0.9375rem', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.625rem',
              background: '#111827',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '500',
              cursor: downloadingPDF ? 'not-allowed' : 'pointer',
              opacity: downloadingPDF ? 0.7 : 1,
              transition: 'opacity 0.2s'
            }}
          >
            <FaDownload /> {downloadingPDF ? 'Téléchargement...' : 'Télécharger le Rapport PDF'}
          </button>
          <button 
            onClick={() => navigate('/')} 
            style={{ 
              padding: '0.875rem 1.75rem', 
              fontSize: '0.9375rem', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.625rem',
              background: '#ffffff',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.target.style.background = '#ffffff'}
          >
            <FaHome /> Retour au Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}
