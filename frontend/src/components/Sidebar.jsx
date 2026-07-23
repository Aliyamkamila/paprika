const navItems = [
  { key: 'dashboard',   icon: 'ti-layout-dashboard',  label: 'Dashboard'    },
  { key: 'workorders',  icon: 'ti-clipboard-list',     label: 'Work Order'   },
  { key: 'mytask',      icon: 'ti-checklist',          label: 'My Task'      },
  { key: 'activitylog', icon: 'ti-history',            label: 'Activity Log' },
  { key: 'documents',   icon: 'ti-file-description',   label: 'Documents'    },
]

const Sidebar = ({ activePage, onNavigate }) => {
  return (
    <div style={{
      width: '210px',
      minWidth: '210px',
      background: 'var(--green-dark)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      padding: '20px 0',
    }}>
      {/* Logo */}
      <div style={{
        padding: '0 20px 28px',
        color: 'var(--green-accent)',
        fontSize: '16px',
        fontWeight: '600',
        letterSpacing: '0.3px',
      }}>
        eWorkOrder
      </div>

      {/* Nav */}
      {navItems.map(item => {
        const isActive = activePage === item.key ||
          (item.key === 'workorders' && activePage === 'wodetail')
        return (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '11px 20px',
              background: isActive ? 'rgba(111,207,151,0.15)' : 'transparent',
              borderRight: isActive ? '3px solid var(--green-accent)' : '3px solid transparent',
              border: 'none',
              borderLeft: 'none',
              borderTop: 'none',
              borderBottom: 'none',
              borderRight: isActive ? '3px solid var(--green-accent)' : '3px solid transparent',
              color: isActive ? '#fff' : 'var(--green-muted)',
              fontSize: '13px',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'all 0.15s',
            }}
          >
            <i className={`ti ${item.icon}`} style={{ fontSize: '17px' }} aria-hidden="true" />
            {item.label}
          </button>
        )
      })}

      {/* Logout */}
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '11px 20px',
          marginTop: 'auto',
          borderTop: '0.5px solid rgba(255,255,255,0.1)',
          background: 'transparent',
          border: 'none',
          borderTop: '0.5px solid rgba(255,255,255,0.1)',
          color: 'var(--green-muted)',
          fontSize: '13px',
          cursor: 'pointer',
          width: '100%',
          textAlign: 'left',
        }}
      >
        <i className="ti ti-logout" style={{ fontSize: '17px' }} aria-hidden="true" />
        Logout
      </button>
    </div>
  )
}

export default Sidebar