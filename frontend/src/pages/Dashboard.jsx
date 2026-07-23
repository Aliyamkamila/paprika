import { useState } from 'react'
import { importExcel, getDashboard } from '../services/api'
import StatCard from '../components/StatCard'

const Dashboard = ({ dashboard, setDashboard }) => {
  const [loading, setLoading]     = useState(false)
  const [importMsg, setImportMsg] = useState('')
  const [error, setError]         = useState('')

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setLoading(true)
    setImportMsg('')
    setError('')
    try {
      const result = await importExcel(file)
      setImportMsg(result.message)
      const data = await getDashboard()
      setDashboard(data)
    } catch (err) {
      setError('Gagal import file.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '24px', background: 'var(--green-bg)', minHeight: '100%' }}>

      {/* Upload */}
      <div style={{
        background: '#fff',
        borderRadius: '10px',
        border: '0.5px solid var(--green-border)',
        padding: '16px 20px',
        marginBottom: '20px',
      }}>
        <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--green-dark)', marginBottom: '8px' }}>
          <i className="ti ti-upload" style={{ marginRight: '6px', color: 'var(--green-accent)' }} />
          Upload Excel
        </div>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          disabled={loading}
          style={{
            fontSize: '13px',
            border: '0.5px solid var(--green-border)',
            borderRadius: '8px',
            padding: '6px 10px',
            background: 'var(--green-bg)',
            cursor: 'pointer',
          }}
        />
        {loading && (
          <span style={{ marginLeft: '12px', fontSize: '13px', color: 'var(--green-text)' }}>
            <span className="spinner-border spinner-border-sm me-1" />
            Memproses...
          </span>
        )}
        {importMsg && (
          <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--green-text)', background: 'var(--green-light)', padding: '8px 12px', borderRadius: '8px' }}>
            {importMsg}
          </div>
        )}
        {error && (
          <div style={{ marginTop: '8px', fontSize: '13px', color: '#c0392b', background: '#fdecea', padding: '8px 12px', borderRadius: '8px' }}>
            {error}
          </div>
        )}
      </div>

      {dashboard && (
        <>
          {/* KPI Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
            <StatCard title="Total WO"        value={dashboard.totalWO}          icon="ti-file-description" iconBg="#e0f5eb" iconColor="#1a7a4a" />
            <StatCard title="Imported Rows"   value={dashboard.importedRows}     icon="ti-table"            iconBg="#e8f5e0" iconColor="#2d6e1a" />
            <StatCard title="Unique Op."      value={dashboard.uniqueOperations} icon="ti-settings"         iconBg="#f0faf5" iconColor="#40916c" />
            <StatCard title="Departments"     value={dashboard.totalDepartments} icon="ti-building"         iconBg="#d8f3e8" iconColor="#1a4d3a" />
          </div>

          {/* WO Status */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
            <StatCard title="Released" value={dashboard.released} icon="ti-player-play"    iconBg="#d4edff" iconColor="#185fa5" />
            <StatCard title="Closed"   value={dashboard.closed}   icon="ti-circle-check"   iconBg="#e0f5eb" iconColor="#1a7a4a" />
            <StatCard title="Failed"   value={dashboard.failed}   icon="ti-alert-triangle" iconBg="#fff3e0" iconColor="#a05a00" />
            <StatCard title="Complete" value={dashboard.complete} icon="ti-trophy"         iconBg="#e8f5e0" iconColor="#2d6e1a" />
          </div>

          {/* Bottom Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

            {/* Operation Status */}
            <div style={{ background: '#fff', borderRadius: '10px', border: '0.5px solid var(--green-border)', padding: '16px 20px' }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--green-dark)', marginBottom: '4px' }}>Operation status</div>
              <div style={{ fontSize: '11px', color: 'var(--green-muted)', marginBottom: '16px' }}>All operations breakdown</div>
              {[
                { label: 'Not Started', value: dashboard.operationStats?.notStarted, color: '#8aab99' },
                { label: 'In Progress', value: dashboard.operationStats?.inProgress, color: '#f4a261' },
                { label: 'Completed',   value: dashboard.operationStats?.completed,  color: '#6fcf97' },
              ].map((item, i) => {
                const total = (dashboard.operationStats?.notStarted ?? 0) +
                              (dashboard.operationStats?.inProgress ?? 0) +
                              (dashboard.operationStats?.completed ?? 0)
                const pct = total > 0 ? Math.round((item.value / total) * 100) : 0
                return (
                  <div key={i} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--green-dark)' }}>{item.label}</span>
                      <span style={{ fontSize: '12px', color: 'var(--green-muted)' }}>{item.value?.toLocaleString('en-US')} ({pct}%)</span>
                    </div>
                    <div style={{ height: '8px', background: 'var(--green-bg)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: item.color, borderRadius: '4px', transition: 'width 0.5s' }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Department Stats */}
            <div style={{ background: '#fff', borderRadius: '10px', border: '0.5px solid var(--green-border)', padding: '16px 20px' }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--green-dark)', marginBottom: '4px' }}>Department load</div>
              <div style={{ fontSize: '11px', color: 'var(--green-muted)', marginBottom: '16px' }}>Operation count by department</div>
              {dashboard.departments?.map((d, i) => {
                const maxOps = Math.max(...dashboard.departments.map(x => x.operationCount))
                const pct = maxOps > 0 ? Math.round((d.operationCount / maxOps) * 100) : 0
                const colors = ['#6fcf97', '#52b788', '#40916c', '#2d6a4f']
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ width: '40px', fontSize: '13px', fontWeight: '500', color: 'var(--green-dark)' }}>{d.departmentCode}</div>
                    <div style={{ flex: 1, height: '8px', background: 'var(--green-bg)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: colors[i % colors.length], borderRadius: '4px', transition: 'width 0.5s' }} />
                    </div>
                    <div style={{ width: '50px', fontSize: '12px', color: 'var(--green-muted)', textAlign: 'right' }}>
                      {d.operationCount?.toLocaleString('en-US')}
                    </div>
                  </div>
                )
              })}
            </div>

          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard