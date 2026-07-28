import { useState, useEffect } from 'react';
import { getWorkOrders } from '../services/api';

const statusOptions = ['Released', 'Closed', 'Failed Close', 'Completed'];
const deptOptions = ['QC', 'TA', 'MACH', 'WELD'];

const statusColor = (s) => {
  const map = {
    'Released'    : '#F4A261',
    'Closed'      : '#02BC94',
    'Failed Close': '#E74C3C',
    'Completed'   : '#02BC94',
  };
  return map[s] ?? '#8AAB99';
};

const WorkOrderList = ({ onSelect }) => {
  const [data, setData] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [department, setDepartment] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const fetchData = async (p = page) => {
    setLoading(true);
    try {
      const result = await getWorkOrders({ search, status, department, page: p, pageSize: 20 });
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData(1);
  };

  const handleReset = () => {
    setSearch('');
    setStatus('');
    setDepartment('');
    setPage(1);
    fetchData(1);
  };

  const renderPages = () => {
    if (!data) return null;
    const total = data.totalPages;
    const start = Math.max(1, page - 2);
    const end = Math.min(total, start + 4);
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div style={{
      padding: '24px 28px',
      background: 'rgba(5,50,43,0.02)',
      minHeight: '100%',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            width: '4px',
            height: '32px',
            background: 'linear-gradient(180deg, #02BC94, #018374)',
            borderRadius: '2px',
          }} />
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#05322B',
            margin: 0,
            letterSpacing: '-0.3px',
          }}>
            Work Order List
          </h2>
        </div>
        {data && !loading && (
          <span style={{
            fontSize: '13px',
            color: 'rgba(5,50,43,0.4)',
          }}>
            Total: <strong style={{ color: '#05322B' }}>{data.totalData?.toLocaleString('en-US')}</strong>
          </span>
        )}
      </div>

      {/* Filter Bar */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid rgba(2,188,148,0.06)',
        padding: '20px 24px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}>
        <form onSubmit={handleSearch}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 0.6fr 0.5fr 0.5fr',
            gap: '12px',
            alignItems: 'flex-end',
          }}>
            {/* Search */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '500',
                color: 'rgba(5,50,43,0.4)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '4px',
              }}>
                Search
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: searchFocused ? '#FFFFFF' : 'rgba(5,50,43,0.02)',
                border: searchFocused 
                  ? '1.5px solid #02BC94' 
                  : '1px solid rgba(2,188,148,0.08)',
                borderRadius: '8px',
                padding: '0 12px',
                transition: 'all 0.2s ease',
                boxShadow: searchFocused ? '0 0 0 3px rgba(2,188,148,0.06)' : 'none',
              }}>
                <i className="ti ti-search" style={{
                  fontSize: '15px',
                  color: searchFocused ? '#02BC94' : 'rgba(5,50,43,0.25)',
                  transition: 'color 0.2s ease',
                }} aria-hidden="true" />
                <input
                  type="text"
                  placeholder="WO Number or Description..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    padding: '10px 0',
                    fontSize: '13px',
                    color: '#05322B',
                    width: '100%',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '500',
                color: 'rgba(5,50,43,0.4)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '4px',
              }}>
                Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid rgba(2,188,148,0.08)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#05322B',
                  background: 'rgba(5,50,43,0.02)',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#02BC94';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(2,188,148,0.06)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(2,188,148,0.08)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <option value="">All Status</option>
                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Department */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '500',
                color: 'rgba(5,50,43,0.4)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '4px',
              }}>
                Department
              </label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid rgba(2,188,148,0.08)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#05322B',
                  background: 'rgba(5,50,43,0.02)',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#02BC94';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(2,188,148,0.06)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(2,188,148,0.08)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <option value="">All Dept</option>
                {deptOptions.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Buttons */}
            <div style={{
              display: 'flex',
              gap: '8px',
            }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  background: 'linear-gradient(135deg, #02BC94, #018374)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(2,188,148,0.20)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(2,188,148,0.30)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(2,188,148,0.20)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <i className="ti ti-search" style={{ fontSize: '15px' }} aria-hidden="true" />
                Search
              </button>
              <button
                type="button"
                onClick={handleReset}
                style={{
                  padding: '10px 16px',
                  background: 'transparent',
                  border: '1px solid rgba(5,50,43,0.10)',
                  borderRadius: '8px',
                  color: 'rgba(5,50,43,0.6)',
                  fontSize: '13px',
                  fontWeight: '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(5,50,43,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(5,50,43,0.20)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(5,50,43,0.10)';
                }}
              >
                <i className="ti ti-refresh" style={{ fontSize: '14px' }} aria-hidden="true" />
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Info */}
      {data && !loading && (
        <div style={{
          fontSize: '13px',
          color: 'rgba(5,50,43,0.4)',
          marginBottom: '12px',
        }}>
          Showing <strong style={{ color: '#05322B' }}>
            {((page - 1) * 20) + 1}–{Math.min(page * 20, data.totalData)}
          </strong> of{' '}
          <strong style={{ color: '#05322B' }}>{data.totalData?.toLocaleString('en-US')}</strong> Work Orders
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px 0',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(2,188,148,0.10)',
            borderTop: '3px solid #02BC94',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Table */}
      {!loading && data && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid rgba(2,188,148,0.06)',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '13px',
            }}>
              <thead>
                <tr style={{
                  background: 'rgba(5,50,43,0.02)',
                  borderBottom: '1px solid rgba(5,50,43,0.06)',
                }}>
                  {['WO Number', 'Description', 'Qty', 'Status', 'Dept', 'Ops', 'Current Op', ''].map((h, i) => (
                    <th key={i} style={{
                      textAlign: i === 0 ? 'left' : i === 7 ? 'center' : 'center',
                      padding: '12px 16px',
                      fontSize: '11px',
                      fontWeight: '500',
                      color: 'rgba(5,50,43,0.4)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      whiteSpace: 'nowrap',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.data.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{
                      padding: '40px 0',
                      textAlign: 'center',
                      color: 'rgba(5,50,43,0.3)',
                      fontSize: '14px',
                    }}>
                      <i className="ti ti-inbox" style={{ fontSize: '32px', display: 'block', marginBottom: '8px', opacity: 0.3 }} aria-hidden="true" />
                      No data found
                    </td>
                  </tr>
                ) : data.data.map((wo, i) => (
                  <tr key={i} style={{
                    borderBottom: i < data.data.length - 1 ? '1px solid rgba(5,50,43,0.04)' : 'none',
                    transition: 'background 0.15s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(2,188,148,0.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                  >
                    <td style={{
                      padding: '12px 16px',
                      fontWeight: '600',
                      color: '#05322B',
                    }}>
                      {wo.woNumber}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      color: '#05322B',
                      maxWidth: '280px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {wo.description}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                      color: '#05322B',
                    }}>
                      {wo.quantity}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                    }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 12px',
                        borderRadius: '12px',
                        background: `${statusColor(wo.woStatus)}15`,
                        color: statusColor(wo.woStatus),
                        fontSize: '12px',
                        fontWeight: '500',
                      }}>
                        {wo.woStatus}
                      </span>
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                      color: '#05322B',
                      fontWeight: '500',
                    }}>
                      {wo.department}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                      color: '#05322B',
                    }}>
                      {wo.operationCount}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                      color: '#05322B',
                      fontSize: '12px',
                    }}>
                      {wo.currentOperation}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                    }}>
                      <button
                        onClick={() => onSelect && onSelect(wo.woNumber)}
                        style={{
                          padding: '5px 16px',
                          background: 'transparent',
                          border: '1px solid rgba(2,188,148,0.20)',
                          borderRadius: '6px',
                          color: '#02BC94',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#02BC94';
                          e.currentTarget.style.color = '#FFFFFF';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(2,188,148,0.20)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#02BC94';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <i className="ti ti-eye" style={{ fontSize: '14px' }} aria-hidden="true" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && data && data.totalPages > 1 && (
        <div style={{
          marginTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}>
          <div style={{
            display: 'flex',
            gap: '4px',
            alignItems: 'center',
          }}>
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              style={{
                padding: '6px 12px',
                background: 'transparent',
                border: '1px solid rgba(5,50,43,0.06)',
                borderRadius: '6px',
                color: page === 1 ? 'rgba(5,50,43,0.2)' : '#05322B',
                fontSize: '13px',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (page !== 1) {
                  e.currentTarget.style.background = 'rgba(5,50,43,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(5,50,43,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(5,50,43,0.06)';
              }}
            >
              «
            </button>
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
              style={{
                padding: '6px 12px',
                background: 'transparent',
                border: '1px solid rgba(5,50,43,0.06)',
                borderRadius: '6px',
                color: page === 1 ? 'rgba(5,50,43,0.2)' : '#05322B',
                fontSize: '13px',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (page !== 1) {
                  e.currentTarget.style.background = 'rgba(5,50,43,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(5,50,43,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(5,50,43,0.06)';
              }}
            >
              ‹ Prev
            </button>

            {renderPages().map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  padding: '6px 14px',
                  background: p === page ? 'linear-gradient(135deg, #02BC94, #018374)' : 'transparent',
                  border: p === page ? 'none' : '1px solid rgba(5,50,43,0.06)',
                  borderRadius: '6px',
                  color: p === page ? '#FFFFFF' : '#05322B',
                  fontSize: '13px',
                  fontWeight: p === page ? '500' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  minWidth: '36px',
                }}
                onMouseEnter={(e) => {
                  if (p !== page) {
                    e.currentTarget.style.background = 'rgba(5,50,43,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(5,50,43,0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (p !== page) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(5,50,43,0.06)';
                  }
                }}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page === data.totalPages}
              style={{
                padding: '6px 12px',
                background: 'transparent',
                border: '1px solid rgba(5,50,43,0.06)',
                borderRadius: '6px',
                color: page === data.totalPages ? 'rgba(5,50,43,0.2)' : '#05322B',
                fontSize: '13px',
                cursor: page === data.totalPages ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (page !== data.totalPages) {
                  e.currentTarget.style.background = 'rgba(5,50,43,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(5,50,43,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(5,50,43,0.06)';
              }}
            >
              Next ›
            </button>
            <button
              onClick={() => setPage(data.totalPages)}
              disabled={page === data.totalPages}
              style={{
                padding: '6px 12px',
                background: 'transparent',
                border: '1px solid rgba(5,50,43,0.06)',
                borderRadius: '6px',
                color: page === data.totalPages ? 'rgba(5,50,43,0.2)' : '#05322B',
                fontSize: '13px',
                cursor: page === data.totalPages ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (page !== data.totalPages) {
                  e.currentTarget.style.background = 'rgba(5,50,43,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(5,50,43,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(5,50,43,0.06)';
              }}
            >
              »
            </button>
          </div>
          <div style={{
            fontSize: '12px',
            color: 'rgba(5,50,43,0.3)',
          }}>
            Page {page} of {data?.totalPages?.toLocaleString('en-US')}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkOrderList