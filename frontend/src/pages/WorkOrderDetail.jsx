import React, { useState, useEffect } from 'react';
import { getWorkOrderDetail } from '../services/api';
import OperationNoteModal from '../components/OperationNoteModal';
import OperationDetailModal from '../components/OperationDetailModal';

const statusColor = (s) => {
  const map = {
    'Released'     : '#F4A261',
    'Closed'       : '#02BC94',
    'Failed Close' : '#E74C3C',
    'Completed'    : '#02BC94',
    'COMPLETED'    : '#02BC94',
    'NOT STARTED'  : '#8AAB99',
    'IN PROGRESS'  : '#F4A261',
  };
  return map[s] ?? '#8AAB99';
};

const statusIcon = (s) => {
  const up = s?.toUpperCase();
  if (up === 'COMPLETED')   return '✓';
  if (up === 'IN PROGRESS') return '⟳';
  if (up === 'NOT STARTED') return '○';
  return '?';
};

const WorkOrderDetail = ({ woNumber, onBack }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState({});
  const [selectedOp, setSelectedOp] = useState(null);
  const [selectedOpDetail, setSelectedOpDetail] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await getWorkOrderDetail(woNumber);
        setDetail(data);
      } catch (err) {
        setError('Gagal memuat data WO.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [woNumber]);

  const handleSaveNote = (note) => {
    setNotes(prev => ({
      ...prev,
      [note.operationNum]: [...(prev[note.operationNum] ?? []), note]
    }));
  };

  if (loading) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '400px',
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
  );

  if (error) return (
    <div style={{ padding: '24px' }}>
      <div style={{
        padding: '16px 20px',
        background: 'rgba(231,76,60,0.06)',
        borderRadius: '10px',
        border: '1px solid rgba(231,76,60,0.12)',
        color: '#E74C3C',
        marginBottom: '16px',
      }}>
        {error}
      </div>
      <button
        onClick={onBack}
        style={{
          padding: '8px 20px',
          background: 'transparent',
          border: '1px solid rgba(5,50,43,0.15)',
          borderRadius: '8px',
          color: '#05322B',
          cursor: 'pointer',
          fontSize: '13px',
        }}
      >
        ← Back
      </button>
    </div>
  );

  if (!detail) return null;

  const totalOps = detail.operations.length;
  const completedOps = detail.operations.filter(o => o.status?.toUpperCase() === 'COMPLETED').length;
  const inProgressOps = detail.operations.filter(o => o.status?.toUpperCase() === 'IN PROGRESS').length;
  const progressPct = totalOps > 0 ? Math.round((completedOps / totalOps) * 100) : 0;

  const currentOp = detail.operations.find(o => o.status?.toUpperCase() !== 'COMPLETED')
    ?? detail.operations[detail.operations.length - 1];

  return (
    <div style={{
      padding: '24px 28px',
      background: 'rgba(5,50,43,0.02)',
      minHeight: '100%',
    }}>
      {/* Back Button */}
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 16px',
          background: 'transparent',
          border: '1px solid rgba(5,50,43,0.10)',
          borderRadius: '8px',
          color: '#05322B',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '500',
          marginBottom: '20px',
          transition: 'all 0.2s ease',
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
        <i className="ti ti-arrow-left" style={{ fontSize: '16px' }} aria-hidden="true" />
        Back to List
      </button>

      {/* Header Card */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid rgba(2,188,148,0.08)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        marginBottom: '20px',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          background: 'linear-gradient(135deg, #05322B, #0A4A3E)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(2,188,148,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <i className="ti ti-file-description" style={{ fontSize: '20px', color: '#02BC94' }} aria-hidden="true" />
            </div>
            <div>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#FFFFFF',
                letterSpacing: '-0.2px',
              }}>
                {detail.woNumber}
              </div>
              <div style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.6)',
              }}>
                {detail.description}
              </div>
            </div>
          </div>
          <div style={{
            padding: '4px 14px',
            borderRadius: '20px',
            background: detail.woStatus?.toUpperCase() === 'CLOSED' || detail.woStatus?.toUpperCase() === 'COMPLETED' 
              ? 'rgba(2,188,148,0.15)' 
              : 'rgba(244,162,97,0.15)',
            border: `1px solid ${statusColor(detail.woStatus)}44`,
            color: statusColor(detail.woStatus),
            fontSize: '13px',
            fontWeight: '500',
          }}>
            {detail.woStatus}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px 24px' }}>
          {/* Info Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '16px',
            marginBottom: '20px',
          }}>
            {[
              { label: 'Quantity', value: detail.quantity },
              { label: 'Department', value: detail.department },
              { label: 'Planner', value: detail.plannerCode },
              { label: 'Start Date', value: detail.woStartDate ?? '-' },
              { label: 'End Date', value: detail.woEndDate ?? '-' },
              { label: 'Current Op', value: `${currentOp?.operationNum} — ${currentOp?.description?.split(' - ')[1] ?? currentOp?.description}` },
            ].map((item, i) => (
              <div key={i}>
                <div style={{
                  fontSize: '10px',
                  color: 'rgba(5,50,43,0.35)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontWeight: '500',
                  marginBottom: '2px',
                }}>
                  {item.label}
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#05322B',
                }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Routing Sheet Info */}
          {(detail.serialNo || detail.salesOrder || detail.assemblyNo) && (
            <div style={{
              display: 'flex',
              gap: '20px',
              padding: '12px 16px',
              background: 'rgba(2,188,148,0.04)',
              borderRadius: '10px',
              border: '1px solid rgba(2,188,148,0.10)',
              marginBottom: '16px',
              flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="ti ti-barcode" style={{ fontSize: '14px', color: '#02BC94' }} aria-hidden="true" />
                <span style={{ fontSize: '11px', color: 'rgba(5,50,43,0.4)' }}>Serial No:</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#05322B', fontFamily: 'monospace' }}>
                  {detail.serialNo ?? '-'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="ti ti-receipt" style={{ fontSize: '14px', color: '#02BC94' }} aria-hidden="true" />
                <span style={{ fontSize: '11px', color: 'rgba(5,50,43,0.4)' }}>Sales Order:</span>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#05322B' }}>
                  {detail.salesOrder ?? '-'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="ti ti-package" style={{ fontSize: '14px', color: '#02BC94' }} aria-hidden="true" />
                <span style={{ fontSize: '11px', color: 'rgba(5,50,43,0.4)' }}>Assembly:</span>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#05322B', fontFamily: 'monospace' }}>
                  {detail.assemblyNo ?? '-'}
                </span>
              </div>
              {detail.lotNo && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="ti ti-archive" style={{ fontSize: '14px', color: '#02BC94' }} aria-hidden="true" />
                  <span style={{ fontSize: '11px', color: 'rgba(5,50,43,0.4)' }}>Lot No:</span>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: '#05322B' }}>
                    {detail.lotNo}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Progress Bar */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '6px',
            }}>
              <span style={{
                fontSize: '12px',
                fontWeight: '500',
                color: '#05322B',
              }}>
                Operation Progress
              </span>
              <span style={{
                fontSize: '12px',
                color: 'rgba(5,50,43,0.5)',
              }}>
                {completedOps} / {totalOps} Completed
                {inProgressOps > 0 && ` · ${inProgressOps} In Progress`}
                {' — '}
                <strong style={{ color: '#02BC94' }}>{progressPct}%</strong>
              </span>
            </div>
            <div style={{
              height: '8px',
              background: 'rgba(5,50,43,0.05)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${progressPct}%`,
                background: progressPct === 100 
                  ? 'linear-gradient(90deg, #02BC94, #018374)'
                  : 'linear-gradient(90deg, #02BC94, #6FCF97)',
                borderRadius: '4px',
                transition: 'width 0.6s ease',
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Operation Timeline */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid rgba(2,188,148,0.06)',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        marginBottom: '20px',
      }}>
        <div style={{
          padding: '14px 24px',
          borderBottom: '1px solid rgba(5,50,43,0.04)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{
              fontSize: '13px',
              fontWeight: '500',
              color: '#05322B',
            }}>
              Operation Timeline
            </div>
            <div style={{
              fontSize: '11px',
              color: 'rgba(5,50,43,0.3)',
              marginTop: '2px',
            }}>
              Klik operation untuk lihat detail
            </div>
          </div>
          <span style={{
            fontSize: '11px',
            color: 'rgba(5,50,43,0.3)',
          }}>
            {detail.operations.length} operations
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '13px',
          }}>
            <thead>
              <tr style={{
                borderBottom: '1px solid rgba(5,50,43,0.06)',
                background: 'rgba(5,50,43,0.02)',
              }}>
                {['Op #', 'Description', 'Status', 'Dept', 'Employee', 'Routing'].map((h, i) => (
                  <th key={i} style={{
                    textAlign: i === 0 ? 'left' : 'center',
                    padding: '10px 16px',
                    fontSize: '11px',
                    fontWeight: '500',
                    color: 'rgba(5,50,43,0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {detail.operations.map((op, i) => {
                const opNotes = notes[op.operationNum] ?? [];
                const isInProgress = op.status?.toUpperCase() === 'IN PROGRESS';
                const isLast = i === detail.operations.length - 1;
                const hasRouting = op.hasRoutingData;

                return (
                  <React.Fragment key={i}>
                    <tr
                      onClick={() => {
                        setSelectedOpDetail(op.operationNum);
                      }}
                      style={{
                        borderBottom: opNotes.length === 0 && !isLast ? '1px solid rgba(5,50,43,0.04)' : 'none',
                        background: isInProgress ? 'rgba(244,162,97,0.04)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = isInProgress ? 'rgba(244,162,97,0.08)' : 'rgba(2,188,148,0.03)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isInProgress ? 'rgba(244,162,97,0.04)' : 'transparent';
                      }}
                    >
                      <td style={{
                        padding: '11px 16px',
                        fontWeight: '600',
                        color: '#05322B',
                      }}>
                        {op.operationNum}
                      </td>
                      <td style={{
                        padding: '11px 16px',
                        color: '#6B7280',
                        fontSize: '12px',
                      }}>
                        {op.description}
                      </td>
                      <td style={{
                        padding: '11px 16px',
                        textAlign: 'center',
                      }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 10px',
                          borderRadius: '12px',
                          background: `${statusColor(op.status)}15`,
                          color: statusColor(op.status),
                          fontSize: '11px',
                          fontWeight: '500',
                        }}>
                          {statusIcon(op.status)} {op.status}
                        </span>
                      </td>
                      <td style={{
                        padding: '11px 16px',
                        textAlign: 'center',
                        color: '#05322B',
                        fontWeight: '500',
                        fontSize: '12px',
                      }}>
                        {op.department}
                      </td>
                      <td style={{
                        padding: '11px 16px',
                        textAlign: 'center',
                        color: '#6B7280',
                        fontSize: '12px',
                      }}>
                        {op.employeeName}
                      </td>
                      <td style={{
                        padding: '11px 16px',
                        textAlign: 'center',
                      }}>
                        {hasRouting ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            fontSize: '10px',
                            color: '#02BC94',
                            fontWeight: '500',
                          }}>
                            <i className="ti ti-file-spreadsheet" aria-hidden="true" />
                            {op.workInstructionCount > 0 && <span title="Work Instructions">{op.workInstructionCount} WI</span>}
                            {op.materialCount > 0 && <span title="Materials">· {op.materialCount} Mat</span>}
                          </span>
                        ) : (
                          <span style={{
                            fontSize: '10px',
                            color: 'rgba(5,50,43,0.2)',
                          }}>
                            —
                          </span>
                        )}
                      </td>
                    </tr>

                    {/* Notes */}
                    {opNotes.length > 0 && (
                      <tr>
                        <td colSpan={6} style={{
                          padding: '8px 16px 12px 80px',
                          borderBottom: !isLast ? '1px solid rgba(5,50,43,0.04)' : 'none',
                          background: 'rgba(5,50,43,0.015)',
                        }}>
                          {opNotes.map((n, j) => (
                            <div key={j} style={{
                              background: '#FFFFFF',
                              border: '1px solid rgba(2,188,148,0.08)',
                              borderRadius: '8px',
                              padding: '10px 14px',
                              marginBottom: j < opNotes.length - 1 ? '8px' : 0,
                            }}>
                              <div style={{
                                fontSize: '13px',
                                color: '#05322B',
                                marginBottom: '6px',
                                lineHeight: '1.5',
                              }}>
                                {n.text}
                              </div>
                              <div style={{
                                display: 'flex',
                                gap: '8px',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                              }}>
                                <span style={{
                                  fontSize: '10px',
                                  padding: '2px 8px',
                                  borderRadius: '12px',
                                  background: 'rgba(2,188,148,0.10)',
                                  color: '#018374',
                                  fontWeight: '500',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.3px',
                                }}>
                                  {n.department}
                                </span>
                                <span style={{
                                  fontSize: '11px',
                                  color: '#6B7280',
                                }}>
                                  {n.author}
                                </span>
                                <span style={{
                                  fontSize: '11px',
                                  color: 'rgba(5,50,43,0.3)',
                                }}>
                                  · {n.timestamp}
                                </span>
                              </div>
                            </div>
                          ))}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Documents */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid rgba(2,188,148,0.06)',
        padding: '16px 24px 20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}>
        <div style={{
          fontSize: '13px',
          fontWeight: '500',
          color: '#05322B',
          marginBottom: '12px',
        }}>
          Documents
        </div>
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        }}>
          {['Drawing.pdf', 'Inspection Report.pdf', 'Material Cert.pdf'].map((doc, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px 6px 10px',
              background: 'rgba(5,50,43,0.02)',
              border: '1px solid rgba(5,50,43,0.06)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(2,188,148,0.04)';
              e.currentTarget.style.borderColor = 'rgba(2,188,148,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(5,50,43,0.02)';
              e.currentTarget.style.borderColor = 'rgba(5,50,43,0.06)';
            }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: 'rgba(2,188,148,0.10)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <i className="ti ti-file" style={{ fontSize: '14px', color: '#02BC94' }} aria-hidden="true" />
              </div>
              <span style={{
                fontSize: '12px',
                color: '#05322B',
              }}>
                {doc}
              </span>
            </div>
          ))}
        </div>
        <div style={{
          fontSize: '11px',
          color: 'rgba(5,50,43,0.3)',
          marginTop: '10px',
        }}>
          * Documents coming soon
        </div>
      </div>

      {/* Modal untuk Add Note */}
      {selectedOp && (
        <OperationNoteModal
          operation={selectedOp}
          onClose={() => setSelectedOp(null)}
          onSave={handleSaveNote}
        />
      )}

      {/* Modal untuk Operation Detail */}
      {selectedOpDetail && (
        <OperationDetailModal
          woNumber={detail.woNumber}
          operationNum={selectedOpDetail}
          onClose={() => setSelectedOpDetail(null)}
          onNoteSaved={handleSaveNote}
        />
      )}
    </div>
  );
};

export default WorkOrderDetail;