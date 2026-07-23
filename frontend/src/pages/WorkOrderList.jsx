import { useState, useEffect } from 'react'
import { getWorkOrders } from '../services/api'

const statusOptions = ['Released', 'Closed', 'Failed Close', 'Completed']
const deptOptions   = ['QC', 'TA', 'MACH', 'WELD']

const statusColor = (s) => {
  const map = {
    'Released'    : 'warning',
    'Closed'      : 'success',
    'Failed Close': 'danger',
    'Completed'   : 'info',
  }
  return map[s] ?? 'secondary'
}

const WorkOrderList = ({ onSelect }) => {
  const [data, setData]           = useState(null)
  const [search, setSearch]       = useState('')
  const [status, setStatus]       = useState('')
  const [department, setDepartment] = useState('')
  const [page, setPage]           = useState(1)
  const [loading, setLoading]     = useState(false)

  const fetchData = async (p = page) => {
    setLoading(true)
    try {
      const result = await getWorkOrders({ search, status, department, page: p, pageSize: 20 })
      setData(result)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [page])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchData(1)
  }

  const handleReset = () => {
    setSearch('')
    setStatus('')
    setDepartment('')
    setPage(1)
    fetchData(1)
  }

  // Pagination: tampil max 5 page button
  const renderPages = () => {
    if (!data) return null
    const total = data.totalPages
    const start = Math.max(1, page - 2)
    const end   = Math.min(total, start + 4)
    const pages = []
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  return (
    <div className="container-fluid py-4 px-4">
      <h2 className="mb-4">📋 Work Order List</h2>

      {/* Filter Bar */}
      <div className="card mb-4">
        <div className="card-body">
          <form className="row g-2 align-items-end" onSubmit={handleSearch}>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="WO Number / Description..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">Status</label>
              <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="">All Status</option>
                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label fw-semibold">Department</label>
              <select className="form-select" value={department} onChange={e => setDepartment(e.target.value)}>
                <option value="">All Dept</option>
                {deptOptions.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="col-md-3 d-flex gap-2">
              <button type="submit" className="btn btn-primary w-100">🔎 Search</button>
              <button type="button" className="btn btn-outline-secondary w-100" onClick={handleReset}>Reset</button>
            </div>
          </form>
        </div>
      </div>

      {/* Info */}
      {data && !loading && (
        <div className="text-muted mb-2">
          Showing <strong>{((page - 1) * 20) + 1}–{Math.min(page * 20, data.totalData)}</strong> of{' '}
          <strong>{data.totalData.toLocaleString('en-US')}</strong> Work Orders
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-5">
          <span className="spinner-border text-primary" />
        </div>
      )}

      {/* Table */}
      {!loading && data && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>WO Number</th>
                <th>Description</th>
                <th className="text-center">Qty</th>
                <th className="text-center">Status</th>
                <th className="text-center">Dept</th>
                <th className="text-center">Operations</th>
                <th className="text-center">Current Op</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-muted py-4">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : data.data.map((wo, i) => (
                <tr key={i}>
                  <td><strong>{wo.woNumber}</strong></td>
                  <td style={{ maxWidth: '280px' }}>
                    <div style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '280px'
                    }}>
                      {wo.description}
                    </div>
                  </td>
                  <td className="text-center">{wo.quantity}</td>
                  <td className="text-center">
                    <span className={`badge bg-${statusColor(wo.woStatus)}`}>
                      {wo.woStatus}
                    </span>
                  </td>
                  <td className="text-center">{wo.department}</td>
                  <td className="text-center">{wo.operationCount}</td>
                  <td className="text-center">{wo.currentOperation}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onSelect && onSelect(wo.woNumber)}
                    >
                      👁 View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && data && data.totalPages > 1 && (
        <nav className="mt-3">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(1)}>«</button>
            </li>
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(p => p - 1)}>‹ Prev</button>
            </li>
            {renderPages().map(p => (
              <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setPage(p)}>{p}</button>
              </li>
            ))}
            <li className={`page-item ${page === data.totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(p => p + 1)}>Next ›</button>
            </li>
            <li className={`page-item ${page === data.totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(data.totalPages)}>»</button>
            </li>
          </ul>
          <div className="text-center text-muted small">
            Page {page} of {data?.totalPages.toLocaleString('en-US')}
          </div>
        </nav>
      )}
    </div>
  )
}

export default WorkOrderList