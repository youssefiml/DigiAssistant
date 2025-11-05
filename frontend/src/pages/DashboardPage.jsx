import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionAPI } from '../services/api';
import { 
  FaBuilding, 
  FaIndustry, 
  FaUsers, 
  FaRocket, 
  FaBullseye,
  FaClipboardCheck,
  FaLaptop,
  FaShieldAlt,
  FaCogs,
  FaHandshake,
  FaChartLine,
  FaAward,
  FaClock,
  FaLightbulb
} from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

export default function DashboardPage() {
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('');
  const [size, setSize] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const tempCompanyId = 'temp_' + Date.now();
      localStorage.setItem('tempCompanyInfo', JSON.stringify({
        id: tempCompanyId,
        name: companyName,
        sector,
        size
      }));
      
      const session = await sessionAPI.createWithTempCompany({
        name: companyName,
        sector,
        size
      });
      
      navigate(`/diagnostic/${session.session_id}`);
    } catch (error) {
      setError(error.response?.data?.detail || error.message || 'Erreur lors de la création');
      setLoading(false);
    }
  };

  const universes = [
    { icon: <FaBullseye />, name: 'Strategy', description: 'Évaluez votre capacité à mener la transformation numérique' },
    { icon: <FaUsers />, name: 'Culture & Human', description: 'Mesurez votre adaptabilité aux changements rapides' },
    { icon: <FaHandshake />, name: 'Customer Relation', description: 'Analysez votre approche client à l\'ère numérique' },
    { icon: <FaCogs />, name: 'Process', description: 'Découvrez votre potentiel d\'innovation digitale' },
    { icon: <FaLaptop />, name: 'Technology', description: 'Évaluez votre maîtrise des outils digitaux' },
    { icon: <FaShieldAlt />, name: 'Security', description: 'Mesurez votre niveau de protection digitale' }
  ];

  const profiles = [
    { icon: <FaAward />, name: 'Leaders', description: 'Pour les décideurs et dirigeants' },
    { icon: <FaChartLine />, name: 'Managers', description: 'Pour les chefs d\'équipe et responsables' },
    { icon: <FaCogs />, name: 'Équipes spécialisées', description: 'Pour les experts métiers' },
    { icon: <FaUsers />, name: 'Collaborateurs', description: 'Pour tous les membres de l\'équipe' }
  ];

  const benefits = [
    { icon: <FaClipboardCheck />, text: 'Obtenez un rapport détaillé sur les compétences de votre équipe' },
    { icon: <FaBullseye />, text: 'Identifiez les priorités de formation et développement' },
    { icon: <FaLightbulb />, text: 'Recevez des recommandations personnalisées d\'amélioration' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '1.5rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img 
            src="/logo.png" 
            alt="DigiAssistant Logo" 
            style={{ height: '3rem', width: 'auto' }} 
            onError={(e) => {
              // Fallback if logo doesn't exist
              e.target.style.display = 'none';
            }}
          />
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'rgb(0, 77, 77)', marginBottom: '0.25rem' }}>
              DigiAssistant
            </h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ background: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#000', marginBottom: '1.5rem', lineHeight: '1.2' }}>
            Évaluez votre niveau de compétence digitale<br />en 15 minutes
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#666', maxWidth: '800px', margin: '0 auto 1rem', lineHeight: '1.7' }}>
            Vous ne savez pas toujours où concentrer vos efforts de formation digitale ? Notre diagnostic vous offre une vision claire et mesurable de la maturité digitale de votre organisation à travers <strong style={{ color: '#000' }}>6 univers clés</strong> : Strategy, Culture & Human, Customer Relation, Process, Technology, Security.
          </p>
          <p style={{ fontSize: '1rem', color: '#666', maxWidth: '750px', margin: '0 auto 2rem', lineHeight: '1.7' }}>
            En comparant les profils (leaders, managers, spécialistes, collaborateurs), vous identifiez les écarts à combler et les priorités à traiter pour faire progresser vos équipes là où cela aura le plus d'impact.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: '#f5f5f5', borderRadius: '9999px', color: 'rgb(0, 77, 77)', fontSize: '0.875rem', fontWeight: '500' }}>
            <FaClock style={{ fontSize: '1rem', color: 'rgb(180, 0, 60)' }} />
            <span>Durée estimée : 15-20 minutes</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        
        {/* Universes Section */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#000', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '2.5rem', height: '2.5rem', background: 'rgb(180, 0, 60)', color: 'white', borderRadius: '0.5rem', fontSize: '1.25rem', fontWeight: '700' }}>6</span>
              Univers d'Expertise
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {universes.map((universe, index) => (
              <div key={index} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '2rem', transition: 'all 0.2s ease' }} onMouseEnter={(e) => {e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,77,77,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)';}} onMouseLeave={(e) => {e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)';}}>
                <div style={{ fontSize: '2.5rem', color: 'rgb(0, 77, 77)', marginBottom: '1rem' }}>{universe.icon}</div>
                <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#000', marginBottom: '0.5rem' }}>{universe.name}</h4>
                <p style={{ color: '#666', lineHeight: '1.6', fontSize: '0.9375rem' }}>{universe.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Profiles Section */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#000', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '2.5rem', height: '2.5rem', background: 'rgb(180, 0, 60)', color: 'white', borderRadius: '0.5rem', fontSize: '1.25rem', fontWeight: '700' }}>4</span>
              Profils Évalués
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {profiles.map((profile, index) => (
              <div key={index} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.75rem', transition: 'all 0.2s ease' }} onMouseEnter={(e) => {e.currentTarget.style.boxShadow = '0 4px 12px rgba(180,0,60,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)';}} onMouseLeave={(e) => {e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)';}}>
                <div style={{ fontSize: '2.5rem', color: 'rgb(180, 0, 60)', marginBottom: '1rem' }}>{profile.icon}</div>
                <h4 style={{ fontSize: '1.0625rem', fontWeight: '600', color: '#000', marginBottom: '0.375rem' }}>{profile.name}</h4>
                <p style={{ color: '#666', fontSize: '0.875rem', lineHeight: '1.5' }}>{profile.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '3rem 2rem', marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#000', marginBottom: '2rem', textAlign: 'center' }}>
            Pourquoi faire le diagnostic maintenant ?
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {benefits.map((benefit, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ fontSize: '1.5rem', color: 'rgb(0, 77, 77)', flexShrink: 0, marginTop: '0.125rem' }}>{benefit.icon}</div>
                <p style={{ color: '#333', fontSize: '1rem', lineHeight: '1.6', fontWeight: '400' }}>{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form Section */}
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '2.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <FaBuilding style={{ fontSize: '3rem', color: 'rgb(180, 0, 60)', marginBottom: '1rem' }} />
              <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'rgb(0, 77, 77)', marginBottom: '0.5rem' }}>
                Commencer le diagnostic
              </h2>
              <p style={{ color: '#666', fontSize: '0.9375rem', lineHeight: '1.5' }}>
                Commençons par quelques informations sur votre entreprise
              </p>
            </div>

            {error && (
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', color: '#dc2626', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label htmlFor="companyName" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#000', marginBottom: '0.5rem' }}>
                  <FaClipboardCheck style={{ color: 'rgb(180, 0, 60)', fontSize: '0.875rem' }} /> Nom de l'entreprise *
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '0.9375rem', transition: 'border-color 0.15s ease', outline: 'none' }}
                  placeholder="Ex: Acme Corporation"
                  disabled={loading}
                  onFocus={(e) => e.target.style.borderColor = 'rgb(0, 77, 77)'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div>
                <label htmlFor="sector" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#000', marginBottom: '0.5rem' }}>
                  <FaIndustry style={{ color: 'rgb(180, 0, 60)', fontSize: '0.875rem' }} /> Secteur d'activité *
                </label>
                <select
                  id="sector"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '0.9375rem', transition: 'border-color 0.15s ease', outline: 'none', background: 'white' }}
                  disabled={loading}
                  onFocus={(e) => e.target.style.borderColor = 'rgb(0, 77, 77)'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                >
                  <option value="">Sélectionnez un secteur</option>
                  <option value="Technologie">Technologie</option>
                  <option value="Finance">Finance</option>
                  <option value="Santé">Santé</option>
                  <option value="Éducation">Éducation</option>
                  <option value="Commerce">Commerce / Retail</option>
                  <option value="Industrie">Industrie</option>
                  <option value="Services">Services</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div>
                <label htmlFor="size" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#000', marginBottom: '0.5rem' }}>
                  <FaUsers style={{ color: 'rgb(180, 0, 60)', fontSize: '0.875rem' }} /> Taille de l'entreprise *
                </label>
                <select
                  id="size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '0.9375rem', transition: 'border-color 0.15s ease', outline: 'none', background: 'white' }}
                  disabled={loading}
                  onFocus={(e) => e.target.style.borderColor = 'rgb(0, 77, 77)'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                >
                  <option value="">Sélectionnez une taille</option>
                  <option value="1-10">1-10 employés</option>
                  <option value="11-50">11-50 employés</option>
                  <option value="51-200">51-200 employés</option>
                  <option value="201-500">201-500 employés</option>
                  <option value="500+">500+ employés</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '0.875rem 1.5rem', fontSize: '0.9375rem', fontWeight: '500', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: loading ? '#999' : 'rgb(180, 0, 60)', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.15s ease' }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.background = 'rgb(150, 0, 50)')}
                onMouseLeave={(e) => !loading && (e.currentTarget.style.background = 'rgb(180, 0, 60)')}
              >
                <FaRocket /> {loading ? 'Création en cours...' : 'Commencer le diagnostic'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}