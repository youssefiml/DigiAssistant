import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sessionAPI } from '../services/api';
import { 
  FaTrophy,
  FaChartBar,
  FaHome,
  FaCog,
  FaUsers,
  FaHandshake,
  FaLayerGroup,
  FaServer,
  FaShieldAlt,
  FaStar,
  FaRegStar,
  FaCheckCircle,
  FaDownload
} from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

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
      'STRAT': <FaCog style={{ fontSize: '2.5rem' }} />,
      'CULTURE': <FaUsers style={{ fontSize: '2.5rem' }} />,
      'CLIENT': <FaHandshake style={{ fontSize: '2.5rem' }} />,
      'PROCESS': <FaLayerGroup style={{ fontSize: '2.5rem' }} />,
      'TECH': <FaServer style={{ fontSize: '2.5rem' }} />,
      'SECURITE': <FaShieldAlt style={{ fontSize: '2.5rem' }} />
    };
    return icons[dimensionCode] || <FaChartBar style={{ fontSize: '2.5rem' }} />;
  };

  const getScoreColor = (score) => {
    if (score >= 2.5) return '#10b981';
    if (score >= 1.5) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 2.5) return 'Excellent';
    if (score >= 2.0) return 'Très Bon';
    if (score >= 1.5) return 'Bon';
    if (score >= 1.0) return 'Moyen';
    return 'À Améliorer';
  };

  const renderStars = (score) => {
    const stars = [];
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 >= 0.5;
    
    for (let i = 0; i < 3; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} style={{ color: '#fbbf24' }} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} style={{ color: '#fbbf24', opacity: 0.5 }} />);
      } else {
        stars.push(<FaRegStar key={i} style={{ color: 'var(--gray-400)' }} />);
      }
    }
    return stars;
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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
      {/* Header */}
      <header style={{ background: 'var(--white)', boxShadow: 'var(--shadow-md)', padding: '1.25rem 2rem', borderBottom: '3px solid var(--primary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <MdDashboard style={{ fontSize: '2rem', color: 'var(--primary)' }} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
              Résultats du Diagnostic
            </h1>
          </div>
          <button onClick={() => navigate('/')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaHome /> Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        {/* Global Score Card */}
        <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)', color: 'white', textAlign: 'center', marginBottom: '3rem', border: 'none' }}>
          <FaTrophy style={{ fontSize: '4rem', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>
            Score Global
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '5rem', fontWeight: '800' }}>
              {globalScore.toFixed(1)}
            </div>
            <div style={{ fontSize: '2.5rem', opacity: 0.8 }}>/ 3</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '2rem', marginBottom: '1rem' }}>
            {renderStars(globalScore)}
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '600', opacity: 0.95 }}>
            {getScoreLabel(globalScore)}
          </div>
        </div>

        {/* Dimensions Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          {dimensions.map((dim) => {
            const avgScore = dim.score ?? 0;
            const answeredCount = dim.answered_count ?? 0;
            
            return (
              <div key={dim.dimension_code} className="card" style={{ borderTop: `4px solid ${getScoreColor(avgScore)}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ color: 'var(--primary)' }}>
                    {getDimensionIcon(dim.dimension_code)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--gray-900)', marginBottom: '0.25rem' }}>
                      {dim.dimension_name}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>
                      {dim.dimension_code}
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: '600', color: 'var(--gray-700)' }}>Score moyen:</span>
                    <span style={{ fontSize: '1.75rem', fontWeight: '700', color: getScoreColor(avgScore) }}>
                      {avgScore.toFixed(1)}/3
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                    {renderStars(avgScore)}
                  </div>
                  <div style={{ textAlign: 'center', fontSize: '0.9rem', fontWeight: '600', color: getScoreColor(avgScore) }}>
                    {getScoreLabel(avgScore)}
                  </div>
                </div>

                <div style={{ borderTop: '2px solid var(--gray-200)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '0.25rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <FaCheckCircle style={{ fontSize: '0.85rem', color: '#10b981' }} />
                      Questions répondues:
                    </span>
                    <span style={{ fontWeight: '600', color: 'var(--gray-900)' }}>{answeredCount}</span>
                  </div>
                  <div className="progress-bar" style={{ height: '0.4rem' }}>
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${(avgScore / 3) * 100}%`,
                        background: getScoreColor(avgScore)
                      }} 
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Section */}
        <div className="card" style={{ marginTop: '3rem', background: 'var(--gray-100)', border: '2px solid var(--gray-200)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--gray-900)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FaChartBar style={{ color: 'var(--secondary)' }} />
            Résumé du Diagnostic
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--white)', borderRadius: '0.75rem', border: '2px solid var(--gray-200)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                {results?.total_questions || 0}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)', fontWeight: '600' }}>
                Questions Totales
              </div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--white)', borderRadius: '0.75rem', border: '2px solid var(--gray-200)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#10b981', marginBottom: '0.5rem' }}>
                {dimensions.length}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)', fontWeight: '600' }}>
                Dimensions Évaluées
              </div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--white)', borderRadius: '0.75rem', border: '2px solid var(--gray-200)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--secondary)', marginBottom: '0.5rem' }}>
                {((globalScore / 3) * 100).toFixed(0)}%
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)', fontWeight: '600' }}>
                Maturité Digitale
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ textAlign: 'center', marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={handleDownloadPDF}
            disabled={downloadingPDF}
            className="btn-primary"
            style={{ 
              padding: '1.25rem 2.5rem', 
              fontSize: '1.1rem', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              background: 'var(--secondary)',
              opacity: downloadingPDF ? 0.7 : 1,
              cursor: downloadingPDF ? 'not-allowed' : 'pointer'
            }}
          >
            <FaDownload /> {downloadingPDF ? 'Téléchargement...' : 'Télécharger le Rapport PDF'}
          </button>
          <button 
            onClick={() => navigate('/')} 
            className="btn-secondary"
            style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <FaHome /> Retour au Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}
