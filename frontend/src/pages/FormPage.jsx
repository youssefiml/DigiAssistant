import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionAPI } from '../services/api';
import { 
  FaBuilding, 
  FaIndustry, 
  FaUsers, 
  FaRocket,
  FaClipboardCheck
} from 'react-icons/fa';

export default function FormPage() {
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

      {/* Form Section */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '4rem 2rem' }}>
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
  );
}

