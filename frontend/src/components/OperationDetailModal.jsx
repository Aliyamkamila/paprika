import { useState, useEffect } from 'react'
import { getOperationDetail, createNote } from '../services/api'

const statusStyle = (s) => {
  const up = s?.toUpperCase()
  if (up === 'COMPLETED')   return { bg: '#e0f5eb', color: '#1a7a4a', icon: '✅' }
  if (up === 'IN PROGRESS') return { bg: '#fff8e1', color: '#7a5a00', icon: '🔄' }
  if (up === 'NOT STARTED') return { bg: '#f3f4f6', color: '#6b7280', icon: '⭕' }
  return { bg: '#f3f4f6', color: '#6b7280', icon: '❓' }
}

const OperationDetailModal = ({ woNumber, operationNum, onClose, onNoteSaved }) => {
  const [detail, setDetail]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [noteText, setNoteText] = useState('')
  const [sendingNote, setSendingNote] = useState(false)

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

              {/* Notes from DB */}
              {detail.notes?.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '500', color: '#111', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="ti ti-notes" style={{ color: '#1a7a4a' }} aria-hidden="true" />
                    Notes ({detail.notes.length})
                  </div>
                  {detail.notes.map((n, i) => (
                    <div key={i} style={{
                      background: '#f9fafb', borderRadius: '8px',
                      padding: '10px 14px', marginBottom: '6px',
                      fontSize: '12px', color: '#374151',
                    }}>
                      <div style={{ lineHeight: '1.5', marginBottom: '4px' }}>{n.noteText}</div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '10px', background: 'rgba(2,188,148,0.10)', color: '#018374', fontWeight: '500' }}>
                          {n.authorDept}
                        </span>
                        <span style={{ fontSize: '10px', color: '#9ca3af' }}>{n.authorName}</span>
                        <span style={{ fontSize: '10px', color: '#d1d5db' }}>·</span>
                        <span style={{ fontSize: '10px', color: '#9ca3af' }}>{n.createdAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Note Section */}
              <div style={{
                borderTop: '0.5px solid #e8e8e8',
                paddingTop: '16px',
              }}>
                <div style={{ fontSize: '12px', fontWeight: '500', color: '#111', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="ti ti-plus" style={{ color: '#1a7a4a' }} aria-hidden="true" />
                  Add Note
                </div>
                <textarea
                  rows={3}
                  placeholder="Tulis note di sini..."
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px',
                    fontSize: '13px', color: '#111',
                    border: '0.5px solid #e8e8e8', borderRadius: '8px',
                    background: '#f9fafb', resize: 'vertical',
                    outline: 'none', fontFamily: 'inherit',
                    lineHeight: '1.6', marginBottom: '10px',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button 
                    onClick={() => setNoteText('')} 
                    style={{
                      fontSize: '12px', padding: '6px 14px',
                      borderRadius: '8px', border: '0.5px solid #e8e8e8',
                      background: '#fff', color: '#6b7280', cursor: 'pointer',
                    }}
                  >
                    Clear
                  </button>
                  <button 
                    onClick={async () => {
                      if (!noteText.trim() || sendingNote) return
                      setSendingNote(true)
                      try {
                        const saved = await createNote(woNumber, operationNum, noteText.trim(), 'Aliya Kamila', detail?.department ?? '-')
                        if (onNoteSaved) {
                          onNoteSaved({
                            operationNum: operationNum,
                            text: noteText.trim(),
                            department: detail?.department ?? '-',
                            author: 'Aliya Kamila',
                            timestamp: new Date().toLocaleString('en-GB', {
                              day: '2-digit', month: 'short', year: 'numeric',
                              hour: '2-digit', minute: '2-digit'
                            }),
                          })
                        }
                        setDetail(prev => ({
                          ...prev,
                          notes: [...(prev?.notes ?? []), saved]
                        }))
                        setNoteText('')
                      } catch (err) {
                        console.error('Failed to save note:', err)
                      } finally {
                        setSendingNote(false)
                      }
                    }} 
                    disabled={!noteText.trim() || sendingNote}
                    style={{
                      fontSize: '12px', padding: '6px 14px',
                      borderRadius: '8px', border: 'none',
                      background: noteText.trim() && !sendingNote ? '#1a7a4a' : '#d1d5db',
                      color: '#fff', cursor: noteText.trim() && !sendingNote ? 'pointer' : 'not-allowed',
                      display: 'flex', alignItems: 'center', gap: '4px',
                    }}
                  >
                    {sendingNote ? (
                      <span className="spinner-border spinner-border-sm" />
                    ) : (
                      <i className="ti ti-send" style={{ fontSize: '13px' }} aria-hidden="true" />
                    )}
                    {sendingNote ? 'Sending...' : 'Send Note'}
                  </button>
                </div>
              </div>

              {/* No data */}
              {detail.workInstructions?.length === 0 &&
               detail.materials?.length === 0 &&
               detail.employees?.length === 0 &&
               detail.notes?.length === 0 && (
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