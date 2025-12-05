import { Link } from 'react-router-dom';

export default function Navbar({ 
  title = "DigiAssistant", 
  subtitle, 
  rightContent, 
  isSticky = false,
  className = "",
  style = {},
  logoHeight = "2rem",
  titleStyle = {}
}) {
  const baseStyle = {
    background: 'white',
    borderBottom: '1px solid #e5e7eb',
    padding: '0.75rem 0',
    ...style
  };

  if (isSticky) {
    baseStyle.position = 'sticky';
    baseStyle.top = 0;
    baseStyle.zIndex = 40;
  }

  return (
    <header className={className} style={baseStyle}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 1.25rem', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center', 
        gap: '0.75rem' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img 
              src="/logo.png" 
              alt="DigiAssistant Logo" 
              style={{ height: logoHeight, width: 'auto', marginRight: '15px' }} 
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          
            <div>
              <h1 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                color: 'rgb(0, 77, 77)', 
                marginBottom: subtitle ? '0.25rem' : '0', 
                lineHeight: 1.2,
                ...titleStyle
              }}>
                {title}
              </h1>
              {subtitle && (
                <div style={{ fontSize: '0.875rem', color: '#666', fontWeight: '500' }}>
                  {subtitle}
                </div>
              )}
            </div>
          </Link>
        </div>
        
        {rightContent && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {rightContent}
          </div>
        )}
      </div>
    </header>
  );
}

