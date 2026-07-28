const StatCard = ({ title, value, icon, iconBg, iconColor }) => {
  // Mapping icon berdasarkan title untuk konsistensi
  const getIcon = () => {
    if (icon) return icon;
    switch(title?.toLowerCase()) {
      case 'new request': return 'ti-file-plus';
      case 'in progress': return 'ti-loader';
      case 'in review': return 'ti-eye';
      case 'completed': return 'ti-check-circle';
      default: return 'ti-file';
    }
  };

  // Mapping warna icon berdasarkan title
  const getIconColor = () => {
    if (iconColor) return iconColor;
    switch(title?.toLowerCase()) {
      case 'new request': return '#02BC94';
      case 'in progress': return '#018374';
      case 'in review': return '#05322B';
      case 'completed': return '#02BC94';
      default: return '#02BC94';
    }
  };

  // Mapping background icon berdasarkan title
  const getIconBg = () => {
    if (iconBg) return iconBg;
    switch(title?.toLowerCase()) {
      case 'new request': return 'rgba(2,188,148,0.12)';
      case 'in progress': return 'rgba(1,131,116,0.12)';
      case 'in review': return 'rgba(5,50,43,0.08)';
      case 'completed': return 'rgba(2,188,148,0.12)';
      default: return 'rgba(2,188,148,0.10)';
    }
  };

  // Border color berdasarkan title
  const getBorderColor = () => {
    switch(title?.toLowerCase()) {
      case 'new request': return '#02BC94';
      case 'in progress': return '#018374';
      case 'in review': return '#05322B';
      case 'completed': return '#02BC94';
      default: return '#02BC94';
    }
  };

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '12px',
      padding: '20px 20px 18px',
      border: '1px solid rgba(2,188,148,0.10)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      transition: 'all 0.2s ease',
      cursor: 'default',
      position: 'relative',
      overflow: 'hidden',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(2,188,148,0.08)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
    >
      {/* Decorative line top */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: `linear-gradient(90deg, ${getBorderColor()}, ${getBorderColor()}88)`,
        borderRadius: '12px 12px 0 0',
      }} />

      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{
            fontSize: '11px',
            color: 'rgba(5,50,43,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            fontWeight: '500',
            marginBottom: '6px',
          }}>
            {title}
          </div>
          <div style={{
            fontSize: '32px',
            fontWeight: '600',
            color: '#05322B',
            lineHeight: '1.1',
            letterSpacing: '-0.5px',
          }}>
            {value?.toLocaleString('en-US') ?? '0'}
          </div>
        </div>

        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          background: getIconBg(),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '2px',
        }}>
          <i 
            className={`ti ${getIcon()}`} 
            style={{ 
              fontSize: '20px', 
              color: getIconColor(),
            }} 
            aria-hidden="true" 
          />
        </div>
      </div>

      {/* Subtle progress indicator for completed */}
      {title?.toLowerCase() === 'completed' && (
        <div style={{
          marginTop: '12px',
          height: '2px',
          background: 'rgba(2,188,148,0.08)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, #02BC94, #018374)',
            borderRadius: '2px',
          }} />
        </div>
      )}
    </div>
  );
};

export default StatCard