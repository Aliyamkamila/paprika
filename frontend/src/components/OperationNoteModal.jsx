import { useState } from 'react'

const OperationNoteModal = ({ operation, onClose, onSave }) => {
  const [note, setNote] = useState('')

  const handleSubmit = () => {
    if (!note.trim()) return
    onSave({
      operationNum: operation.operationNum,
      description: operation.description,
      department: operation.department,
      text: note.trim(),
      author: 'Aliya Kamila',
      timestamp: new Date().toLocaleString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }),
    })
    setNote('')
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: '12px',
        width: '480px', padding: '24px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '500', color: '#111', marginBottom: '4px' }}>
              Add Note — OP {operation.operationNum}
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>{operation.description}</div>
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none',
            cursor: 'pointer', color: '#9ca3af', fontSize: '18px', lineHeight: 1,
          }}>
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        </div>

        {/* Info row */}
        <div style={{
          display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap',
        }}>
          <span style={{
            fontSize: '11px', padding: '3px 10px', borderRadius: '20px',
            background: '#e8f5ee', color: '#1a7a4a', fontWeight: '500',
          }}>
            {operation.department}
          </span>
          <span style={{
            fontSize: '11px', padding: '3px 10px', borderRadius: '20px',
            background: '#f3f4f6', color: '#6b7280',
          }}>
            Aliya Kamila
          </span>
          <span style={{
            fontSize: '11px', padding: '3px 10px', borderRadius: '20px',
            background: '#f3f4f6', color: '#6b7280',
          }}>
            {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>

        {/* Textarea */}
        <textarea
          autoFocus
          rows={4}
          placeholder="Tulis note di sini..."
          value={note}
          onChange={e => setNote(e.target.value)}
          style={{
            width: '100%', padding: '10px 12px',
            fontSize: '13px', color: '#111',
            border: '0.5px solid #e8e8e8', borderRadius: '8px',
            background: '#f9fafb', resize: 'vertical',
            outline: 'none', fontFamily: 'inherit',
            lineHeight: '1.6', marginBottom: '16px',
          }}
        />

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button onClick={onClose} style={{
            fontSize: '13px', padding: '8px 16px',
            borderRadius: '8px', border: '0.5px solid #e8e8e8',
            background: '#fff', color: '#6b7280', cursor: 'pointer',
          }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={!note.trim()} style={{
            fontSize: '13px', padding: '8px 16px',
            borderRadius: '8px', border: 'none',
            background: note.trim() ? '#1a7a4a' : '#d1d5db',
            color: '#fff', cursor: note.trim() ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <i className="ti ti-send" style={{ fontSize: '14px' }} aria-hidden="true" />
            Send Note
          </button>
        </div>
      </div>
    </div>
  )
}

export default OperationNoteModal