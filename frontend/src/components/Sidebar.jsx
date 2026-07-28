import React from 'react';
import Logo from "../assets/Logo.png";

const navItems = [
  { key: 'dashboard',   icon: 'ti-layout-dashboard',  label: 'Dashboard'    },
  { key: 'workorders',  icon: 'ti-clipboard-list',     label: 'Work Order'   },
  { key: 'mytask',      icon: 'ti-checklist',          label: 'My Task'      },
  { key: 'activitylog', icon: 'ti-history',            label: 'Activity Log' },
  { key: 'documents',   icon: 'ti-file-description',   label: 'Documents'    },
  { key: 'import',      icon: 'ti-database-import',    label: 'Import Data'  }, // ✅ Tambahkan ini
];

const Sidebar = ({ activePage, onNavigate }) => {
  return (
    <div style={{
      width: '220px',
      minWidth: '220px',
      background: '#05322B',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      padding: '0',
      borderRight: '1px solid rgba(2,188,148,0.1)',
    }}>
      {/* Logo Section */}
      <div style={{
        padding: '24px 20px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <img 
            src={Logo} 
            alt="Baker Hughes" 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
        <span style={{
          color: '#FFFFFF',
          fontSize: '16px',
          fontWeight: '600',
          letterSpacing: '0.3px',
        }}>
          eWorkOrder
        </span>
      </div>

      {/* Navigation */}
      <nav style={{
        padding: '20px 12px',
        flex: 1,
      }}>
        {navItems.map((item) => {
          const isActive = activePage === item.key ||
            (item.key === 'workorders' && activePage === 'wodetail');
          
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                marginBottom: '2px',
                width: '100%',
                background: isActive ? 'rgba(2,188,148,0.15)' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                color: isActive ? '#02BC94' : 'rgba(255,255,255,0.55)',
                fontSize: '13px',
                fontWeight: isActive ? '500' : '400',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(2,188,148,0.08)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
                }
              }}
            >
              <i 
                className={`ti ${item.icon}`} 
                style={{ 
                  fontSize: '16px', 
                  width: '20px',
                  color: isActive ? '#02BC94' : 'rgba(255,255,255,0.4)',
                }} 
                aria-hidden="true" 
              />
              <span>{item.label}</span>
              {isActive && (
                <span style={{
                  marginLeft: 'auto',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: '#02BC94',
                }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{
        padding: '12px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 14px',
            width: '100%',
            background: 'transparent',
            border: 'none',
            borderRadius: '6px',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '13px',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(2,188,148,0.08)';
            e.currentTarget.style.color = '#02BC94';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
          }}
        >
          <i 
            className="ti ti-logout" 
            style={{ fontSize: '16px', width: '20px' }} 
            aria-hidden="true" 
          />
          <span>Logout</span>
        </button>

        {/* Company Name */}
        <div style={{
          padding: '10px 14px 0',
          color: 'rgba(255,255,255,0.12)',
          fontSize: '9px',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          textAlign: 'center',
          fontWeight: '500',
        }}>
          Baker Hughes
        </div>
      </div>
    </div>
  );
};

export default Sidebar;