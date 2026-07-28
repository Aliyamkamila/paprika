import React, { useState } from 'react';
import Logo from "../assets/Logo.png";

const Topbar = ({ title }) => {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div style={{
      height: '64px',
      background: '#FFFFFF',
      borderBottom: '1px solid rgba(2,188,148,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      flexShrink: 0,
      boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
    }}>
      {/* Left - Title with subtle accent */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{
          width: '4px',
          height: '28px',
          background: 'linear-gradient(180deg, #02BC94, #018374)',
          borderRadius: '2px',
        }} />
        <div style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#05322B',
          letterSpacing: '-0.2px',
        }}>
          {title}
        </div>
      </div>

      {/* Right - Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: searchFocused ? '#FFFFFF' : 'rgba(5,50,43,0.03)',
          border: searchFocused 
            ? '1.5px solid #02BC94' 
            : '1px solid rgba(2,188,148,0.10)',
          borderRadius: '8px',
          padding: '8px 14px',
          width: searchFocused ? '280px' : '200px',
          transition: 'all 0.25s ease',
          boxShadow: searchFocused ? '0 0 0 3px rgba(2,188,148,0.08)' : 'none',
        }}>
          <i 
            className="ti ti-search" 
            style={{ 
              fontSize: '16px', 
              color: searchFocused ? '#02BC94' : 'rgba(5,50,43,0.3)',
              transition: 'color 0.2s ease',
            }} 
            aria-hidden="true" 
          />
          <input
            type="text"
            placeholder="Search..."
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '13px',
              color: '#05322B',
              width: '100%',
              fontFamily: 'inherit',
            }}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchFocused && (
            <span style={{
              fontSize: '10px',
              color: 'rgba(5,50,43,0.25)',
              fontWeight: '400',
              letterSpacing: '0.3px',
              whiteSpace: 'nowrap',
            }}>
              ⌘K
            </span>
          )}
        </div>

        {/* Divider */}
        <div style={{
          width: '1px',
          height: '30px',
          background: 'rgba(2,188,148,0.10)',
        }} />

        {/* Notification Bell with Badge */}
        <div style={{
          position: 'relative',
          cursor: 'pointer',
          padding: '6px',
          borderRadius: '8px',
          transition: 'background 0.2s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(2,188,148,0.06)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <i 
            className="ti ti-bell" 
            style={{ 
              fontSize: '20px', 
              color: 'rgba(5,50,43,0.6)',
              display: 'block',
            }} 
            aria-hidden="true" 
          />
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            width: '8px',
            height: '8px',
            background: '#02BC94',
            borderRadius: '50%',
            border: '2px solid #FFFFFF',
          }} />
        </div>

        {/* Divider */}
        <div style={{
          width: '1px',
          height: '30px',
          background: 'rgba(2,188,148,0.10)',
        }} />

        {/* User Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          padding: '4px 8px 4px 4px',
          borderRadius: '10px',
          transition: 'background 0.2s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(2,188,148,0.05)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #02BC94, #018374)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: '600',
            color: '#FFFFFF',
            flexShrink: 0,
          }}>
            AK
          </div>
          <div style={{ 
            textAlign: 'left',
            lineHeight: '1.3',
          }}>
            <div style={{
              fontSize: '13px',
              fontWeight: '500',
              color: '#05322B',
            }}>
              Aliya Kamila
            </div>
            <div style={{
              fontSize: '10px',
              color: 'rgba(5,50,43,0.4)',
              fontWeight: '400',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}>
              Engineer
            </div>
          </div>
          <i 
            className="ti ti-chevron-down" 
            style={{ 
              fontSize: '14px', 
              color: 'rgba(5,50,43,0.25)',
              marginLeft: '2px',
            }} 
            aria-hidden="true" 
          />
        </div>
      </div>
    </div>
  );
};

export default Topbar;