const Topbar = ({ title }) => {
  return (
    <div style={{
      height: '56px',
      background: '#fff',
      borderBottom: '0.5px solid var(--green-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      flexShrink: 0,
    }}>
      <div style={{ fontSize: '18px', fontWeight: '500', color: 'var(--green-dark)' }}>
        {title}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--green-bg)',
          border: '0.5px solid var(--green-border)',
          borderRadius: '8px',
          padding: '6px 12px',
          width: '220px',
        }}>
          <i className="ti ti-search" style={{ fontSize: '15px', color: 'var(--green-accent)' }} aria-hidden="true" />
          <span style={{ fontSize: '13px', color: 'var(--green-muted)' }}>Search across system...</span>
        </div>

        {/* Bell */}
        <i className="ti ti-bell" style={{ fontSize: '18px', color: 'var(--green-accent)', cursor: 'pointer' }} aria-hidden="true" />

        {/* User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--green-dark)' }}>Aliya Kamila</div>
            <div style={{ fontSize: '11px', color: 'var(--green-muted)' }}>ENGINEER</div>
          </div>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--green-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: '500',
            color: 'var(--green-dark)',
          }}>
            AK
          </div>
        </div>
      </div>
    </div>
  )
}

export default Topbar