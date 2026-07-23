const StatCard = ({ title, value, icon, iconBg, iconColor }) => {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '10px',
      padding: '16px',
      border: '0.5px solid var(--green-border)',
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        background: iconBg ?? 'var(--green-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '10px',
      }}>
        <i className={`ti ${icon ?? 'ti-file'}`} style={{ fontSize: '18px', color: iconColor ?? 'var(--green-text)' }} aria-hidden="true" />
      </div>
      <div style={{ fontSize: '11px', color: 'var(--green-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
        {title}
      </div>
      <div style={{ fontSize: '28px', fontWeight: '500', color: 'var(--green-dark)' }}>
        {value?.toLocaleString('en-US') ?? '0'}
      </div>
    </div>
  )
}

export default StatCard