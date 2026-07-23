import { useState, useEffect } from 'react'
import { getWorkOrderDetail } from '../services/api'

const statusColor = (s) => {
  const map = {
    'Released'    : 'warning',
    'Closed'      : 'success',
    'Failed Close': 'danger',
    'Completed'   : 'info',
    'COMPLETED'   : 'success',
    'NOT STARTED' : 'secondary',
    'IN PROGRESS' : 'warning',
  }
  return map[s] ?? 'secondary'
}

const statusIcon = (s) => {
  const up = s?.toUpperCase()
  if (up === 'COMPLETED')   return '✅'
  if (up === 'IN PROGRESS') return '🔄'
  if (up === 'NOT STARTED') return '⭕'
  return '❓'
}

const WorkOrderDetail = ({ woNumber, onBack }) => {
  const [detail, setDetail]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [remark, setRemark]   = useState('')
  const [savedRemarks, setSavedRemarks] = useState([])

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true)
        const data = await getWorkOrderDetail(woNumber)
        setDetail(data)
      } catch (err) {
        setError('Gagal memuat data WO.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [woNumber])

  const handleSaveRemark = () => {
    if (!remark.trim()) return
    setSavedRemarks(prev => [...prev, {
      text: remark.trim(),
      time: new Date().toLocaleString('en-GB'),
      author: 'You'
    }])
    setRemark('')
  }

  if (loading) return (
    <div className="text-center py-5">
      <span className="spinner-border text-primary" />
    </div>
  )

  if (error) return (
    <div className="container py-4">
      <div className="alert alert-danger">{error}</div>
      <button className="btn btn-secondary" onClick={onBack}>← Back</button>
    </div>
  )

  if (!detail) return null

  // Progress calculation
  const totalOps     = detail.operations.length
  const completedOps = detail.operations.filter(o => o.status?.toUpperCase() === 'COMPLETED').length
  const inProgressOps= detail.operations.filter(o => o.status?.toUpperCase() === 'IN PROGRESS').length
  const progressPct  = totalOps > 0 ? Math.round((completedOps / totalOps) * 100) : 0

  // Current operation = first non-completed, or last if all done
  const currentOp = detail.operations.find(o => o.status?.toUpperCase() !== 'COMPLETED')
    ?? detail.operations[detail.operations.length - 1]

  return (
    <div className="container-fluid py-4 px-4">

      {/* Back */}
      <button className="btn btn-outline-secondary btn-sm mb-3" onClick={onBack}>
        ← Back to List
      </button>

      {/* Header Card */}
      <div className="card mb-4">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">📄 {detail.woNumber}</h5>
          <span className={`badge bg-${statusColor(detail.woStatus)} fs-6`}>
            {detail.woStatus}
          </span>
        </div>
        <div className="card-body">
          <p className="text-muted mb-3">{detail.description}</p>

          <div className="row g-3 mb-4">
            <div className="col-6 col-md-2">
              <div className="fw-semibold text-muted small">Quantity</div>
              <div className="fs-5 fw-bold">{detail.quantity}</div>
            </div>
            <div className="col-6 col-md-2">
              <div className="fw-semibold text-muted small">Department</div>
              <div className="fs-5 fw-bold">{detail.department}</div>
            </div>
            <div className="col-6 col-md-2">
              <div className="fw-semibold text-muted small">Planner</div>
              <div className="fs-5 fw-bold">{detail.plannerCode}</div>
            </div>
            <div className="col-6 col-md-2">
              <div className="fw-semibold text-muted small">Start Date</div>
              <div className="fs-5 fw-bold">{detail.woStartDate ?? '-'}</div>
            </div>
            <div className="col-6 col-md-2">
              <div className="fw-semibold text-muted small">End Date</div>
              <div className="fs-5 fw-bold">{detail.woEndDate ?? '-'}</div>
            </div>
            <div className="col-6 col-md-2">
              <div className="fw-semibold text-muted small">Current Operation</div>
              <div className="fw-bold text-primary">{currentOp?.operationNum} — {currentOp?.description?.split(' - ')[1] ?? currentOp?.description}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="d-flex justify-content-between mb-1">
              <span className="fw-semibold small">Operation Progress</span>
              <span className="small text-muted">
                {completedOps} / {totalOps} Completed
                {inProgressOps > 0 && ` · ${inProgressOps} In Progress`}
                {' '}— <strong>{progressPct}%</strong>
              </span>
            </div>
            <div className="progress" style={{ height: '18px' }}>
              <div
                className={`progress-bar bg-${progressPct === 100 ? 'success' : 'primary'}`}
                style={{ width: `${progressPct}%`, transition: 'width 0.5s' }}
              >
                {progressPct > 10 && `${progressPct}%`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Operation Timeline */}
      <div className="card mb-4">
        <div className="card-header bg-dark text-white">
          <h6 className="mb-0">🔧 Operation Timeline</h6>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Op #</th>
                  <th>Description</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Dept</th>
                  <th className="text-center">Machine</th>
                  <th>Employee</th>
                </tr>
              </thead>
              <tbody>
                {detail.operations.map((op, i) => (
                  <tr
                    key={i}
                    className={op.status?.toUpperCase() === 'IN PROGRESS' ? 'table-warning' : ''}
                  >
                    <td><strong>{op.operationNum}</strong></td>
                    <td>{op.description}</td>
                    <td className="text-center">
                      {statusIcon(op.status)}{' '}
                      <span className={`badge bg-${statusColor(op.status)}`}>
                        {op.status}
                      </span>
                    </td>
                    <td className="text-center">{op.department}</td>
                    <td className="text-center">{op.machine}</td>
                    <td>{op.employeeName}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="table-light fw-bold">
                <tr>
                  <td colSpan={6} className="text-center text-muted" style={{ fontSize: '12px' }}>
                    {detail.operations.length} operations
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Remark */}
      <div className="card mb-4">
        <div className="card-header bg-dark text-white">
          <h6 className="mb-0">💬 Remark</h6>
        </div>
        <div className="card-body">
          {savedRemarks.length === 0 && (
            <p className="text-muted small">Belum ada remark.</p>
          )}
          {savedRemarks.map((r, i) => (
            <div key={i} className="border rounded p-2 mb-2 bg-light">
              <div className="d-flex justify-content-between mb-1">
                <strong className="small">{r.author}</strong>
                <small className="text-muted">{r.time}</small>
              </div>
              <div>{r.text}</div>
            </div>
          ))}
          <div className="mt-3">
            <textarea
              className="form-control mb-2"
              rows={3}
              placeholder="Tulis remark di sini..."
              value={remark}
              onChange={e => setRemark(e.target.value)}
            />
            <button
              className="btn btn-primary btn-sm"
              onClick={handleSaveRemark}
              disabled={!remark.trim()}
            >
              💾 Save Remark
            </button>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="card mb-4">
        <div className="card-header bg-dark text-white">
          <h6 className="mb-0">📎 Documents</h6>
        </div>
        <div className="card-body">
          <div className="d-flex gap-2 flex-wrap">
            {['Drawing.pdf', 'Inspection Report.pdf', 'Material Cert.pdf'].map((doc, i) => (
              <button key={i} className="btn btn-outline-secondary btn-sm">
                📄 {doc}
              </button>
            ))}
          </div>
          <small className="text-muted mt-2 d-block">* Documents coming soon</small>
        </div>
      </div>

    </div>
  )
}

export default WorkOrderDetail