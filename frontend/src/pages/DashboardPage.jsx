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
  FaMoneyBillWave,
  FaHeartbeat,
  FaGraduationCap,
  FaShoppingCart,
  FaCogs,
  FaHandshake,
  FaList,
  FaPlus,
  FaEdit,
  FaChartLine,
  FaAward
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
      console.log('Form submitted with:', { companyName, sector, size });
      
      // Store company info in localStorage (no backend company creation)
      const tempCompanyId = 'temp_' + Date.now();
      localStorage.setItem('tempCompanyInfo', JSON.stringify({
        id: tempCompanyId,
        name: companyName,
        sector,
        size
      }));
      
      // Create diagnostic session with temp company ID
      const session = await sessionAPI.createWithTempCompany({
        name: companyName,
        sector,
        size
      });
      
      console.log('Session created successfully:', session);
      
      // Navigate to diagnostic
      navigate(`/diagnostic/${session.session_id}`);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setError(error.response?.data?.detail || error.message || 'Erreur lors de la création');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
      {/* Header */}
      <header style={{ padding: '1.5rem 0', background: 'var(--white)', borderBottom: '3px solid var(--primary)', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <MdDashboard style={{ fontSize: '3rem', color: 'var(--primary)' }} />
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.5rem' }}>
              DigiAssistant
            </h1>
            <p style={{ color: 'var(--gray-600)', fontSize: '1.1rem', fontWeight: '500' }}>
              Diagnostic de maturité digitale propulsé par l'IA
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem' }}>
        {/* Company Form */}
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <FaBuilding style={{ fontSize: '3.5rem', color: 'var(--primary)', marginBottom: '1rem' }} />
              <h2 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--gray-900)', marginBottom: '0.75rem' }}>
                Bienvenue !
              </h2>
              <p style={{ color: 'var(--gray-600)', fontSize: '1.05rem', lineHeight: '1.6' }}>
                Commençons par quelques informations sur votre entreprise
              </p>
            </div>

            {error && (
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fee2e2', border: '2px solid #ef4444', borderRadius: '1rem', color: '#991b1b', fontWeight: '500' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label htmlFor="companyName" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', fontWeight: '600', color: 'var(--gray-700)', marginBottom: '0.5rem' }}>
                  <FaClipboardCheck style={{ color: 'var(--primary)' }} /> Nom de l'entreprise *
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="input-field"
                  placeholder="Ex: Acme Corporation"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="sector" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', fontWeight: '600', color: 'var(--gray-700)', marginBottom: '0.5rem' }}>
                  <FaIndustry style={{ color: 'var(--primary)' }} /> Secteur d'activité *
                </label>
                <select
                  id="sector"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  required
                  className="input-field"
                  disabled={loading}
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
                <label htmlFor="size" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', fontWeight: '600', color: 'var(--gray-700)', marginBottom: '0.5rem' }}>
                  <FaUsers style={{ color: 'var(--primary)' }} /> Taille de l'entreprise *
                </label>
                <select
                  id="size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  required
                  className="input-field"
                  disabled={loading}
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
                className="btn-primary"
                style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <FaRocket /> {loading ? 'Création en cours...' : 'Commencer le diagnostic'}
              </button>
            </form>
          </div>
      </main>
    </div>
  );
}
