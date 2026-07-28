import { useState, useEffect } from 'react'
import { getOperationDetail } from '../services/api'

const statusStyle = (s) => {
  const up = s?.toUpperCase()
  if (up === 'COMPLETED')   return { bg: '#e0f5eb', color: '#1a7a4a', icon: '✅' }
  if (up === 'IN PROGRESS') return { bg: '#fff8e1', color: '#7a5a00', icon: '🔄' }
  if (up === 'NOT STARTED') return { bg: '#f3f4f6', color: '#6b7280', icon: '⭕' }
  return { bg: '#f3f4f6', color: '#6b7280', icon: '❓' }
}

const OperationDetailModal = ({ woNumber, operationNum, onClose }) => {
  const [detail, setDetail]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const data = await getOperationDetail(woNumber, operationNum)
        setDetail(data)
      } catch (err) {
        setError('Gagal memuat detail operation.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [woNumber, operationNum])

  const st = statusStyle(detail?.status)

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: '12px',
          width: '640px', maxHeight: '85vh',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 20px', borderBottom: '0.5px solid #e8e8e8',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '500', color: '#111' }}>
              Operation {operationNum}
            </div>
            {detail && (
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                {detail.description}
              </div>
            )}
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none',
            cursor: 'pointer', color: '#9ca3af', fontSize: '18px',
          }}>
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', padding: '20px', flex: 1 }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <span className="spinner-border text-success" />
            </div>
          )}

          {error && (
            <div style={{ background: '#fdecea', color: '#c0392b', padding: '12px', borderRadius: '8px', fontSize: '13px' }}>
              {error}
            </div>
          )}

          {detail && (
            <>
              {/* Info Grid */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
                gap: '12px', marginBottom: '20px',
              }}>
                {[
                  { label: 'Status',    value: <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '500', background: st.bg, color: st.color }}>{st.icon} {detail.status ?? '-'}</span> },
                  { label: 'Department', value: detail.department ?? '-' },
                  { label: 'Machine',   value: detail.machine ?? '-' },
                  { label: 'Sched. Start',  value: detail.scheduledStart ?? '-' },
                  { label: 'Sched. Finish', value: detail.scheduledFinish ?? '-' },
                  { label: 'Barcode',   value: detail.barcodeValue ? `*${detail.barcodeValue}*` : '-' },
                ].map((item, i) => (
                  <div key={i} style={{ background: '#f9fafb', borderRadius: '8px', padding: '10px 12px' }}>
                    <div style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' }}>{item.label}</div>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#111' }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Work Instructions */}
              {detail.workInstructions?.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '500', color: '#111', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="ti ti-clipboard-text" style={{ color: '#1a7a4a' }} aria-hidden="true" />
                    Work Instructions
                  </div>
                  <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '12px 14px' }}>
                    {detail.workInstructions.map((w, i) => (
                      <div key={i} style={{
                        fontSize: '12px', color: '#374151',
                        lineHeight: '1.6',
                        paddingBottom: i < detail.workInstructions.length - 1 ? '8px' : 0,
                        marginBottom: i < detail.workInstructions.length - 1 ? '8px' : 0,
                        borderBottom: i < detail.workInstructions.length - 1 ? '0.5px solid #e8e8e8' : 'none',
                      }}>
                        {w.instructionText}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Materials */}
              {detail.materials?.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '500', color: '#111', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="ti ti-package" style={{ color: '#1a7a4a' }} aria-hidden="true" />
                    Materials
                  </div>
                  {detail.materials.map((m, i) => (
                    <div key={i} style={{
                      background: '#f9fafb', borderRadius: '8px',
                      padding: '10px 14px', marginBottom: '8px',
                      fontSize: '12px', color: '#374151',
                    }}>
                      <div style={{ fontWeight: '500', marginBottom: '2px' }}>{m.componentItem}</div>
                      <div style={{ color: '#6b7280' }}>{m.description}</div>
                      {m.requiredQty && (
                        <div style={{ marginTop: '4px', color: '#9ca3af' }}>
                          Qty: {m.requiredQty} {m.uom} {m.dateRequired && `· Due: ${m.dateRequired}`}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Employees */}
              {detail.employees?.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '500', color: '#111', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="ti ti-users" style={{ color: '#1a7a4a' }} aria-hidden="true" />
                    Employees
                  </div>
                  {detail.employees.map((e, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '8px 14px', background: '#f9fafb',
                      borderRadius: '8px', marginBottom: '6px', fontSize: '12px',
                    }}>
                      <div style={{ fontWeight: '500', color: '#111' }}>{e.employeeName}</div>
                      <div style={{ color: '#9ca3af', fontSize: '11px' }}>
                        {e.clockIn} → {e.clockOut}
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '11px' }}>
                        Std: {e.stdHours?.toFixed(2)}h · Act: {e.actHours?.toFixed(2)}h
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reviewed by */}
              {detail.reviewedBy && (
                <div style={{
                  background: '#e8f5ee', borderRadius: '8px',
                  padding: '10px 14px', fontSize: '12px', color: '#1a7a4a',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <i className="ti ti-circle-check" aria-hidden="true" />
                  Reviewed by <strong>{detail.reviewedBy}</strong> · {detail.reviewedAt}
                </div>
              )}

              {/* No data */}
              {detail.workInstructions?.length === 0 &&
               detail.materials?.length === 0 &&
               detail.employees?.length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px', color: '#9ca3af', fontSize: '13px' }}>
                  Belum ada data detail untuk operation ini.
                  <div style={{ fontSize: '11px', marginTop: '4px' }}>Upload PDF routing sheet untuk mengisi work instructions.</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default OperationDetailModal