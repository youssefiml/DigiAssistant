import { useNavigate } from 'react-router-dom';
import { 
  FaRocket, 
  FaBullseye,
  FaUsers,
  FaLaptop,
  FaShieldAlt,
  FaCogs,
  FaHandshake,
  FaChartLine,
  FaAward,
  FaClock,
  FaLightbulb,
  FaClipboardCheck
} from 'react-icons/fa';

export default function DashboardPage() {
  const navigate = useNavigate();

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

        {/* Call to Action Section */}
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '3rem 2.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'rgb(0, 77, 77)', marginBottom: '1rem' }}>
              Prêt à commencer ?
            </h2>
            <p style={{ color: '#666', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
              Remplissez le formulaire avec les informations de votre entreprise pour lancer le diagnostic
            </p>
            <button
              onClick={() => navigate('/form')}
              style={{ 
                width: '100%', 
                padding: '0.875rem 1.5rem', 
                fontSize: '1rem', 
                fontWeight: '600', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.75rem', 
                background: 'rgb(180, 0, 60)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '0.5rem', 
                cursor: 'pointer', 
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(180, 0, 60, 0.25)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgb(150, 0, 50)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(180, 0, 60, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgb(180, 0, 60)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(180, 0, 60, 0.25)';
              }}
            >
              <FaRocket /> Commencer le diagnostic
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}