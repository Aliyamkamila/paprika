import { useState, useEffect } from 'react'
import { getDashboard } from '../services/api'

const StatCard = ({ label, value, icon, iconBg, iconColor }) => (
  <div style={{
    background: '#fff', border: '0.5px solid #e8e8e8',
    borderRadius: '12px', padding: '16px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
  }}>
    <div>
      <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
        {label}
      </div>
      <div style={{ fontSize: '26px', fontWeight: '500', color: '#111' }}>
        {typeof value === 'number' ? value.toLocaleString('en-US') : value ?? '0'}
      </div>
    </div>
    <div style={{
      width: '34px', height: '34px', borderRadius: '8px',
      background: iconBg, display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: '17px', color: iconColor,
    }}>
      <i className={`ti ${icon}`} aria-hidden="true" />
    </div>
  </div>
)

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        const data = await getDashboard()
        setDashboard(data)
      } catch (err) {
        setError('Gagal memuat dashboard.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  const weeklyData = [23, 27, 31, 18, 35, 14, 9]
  const maxVal     = Math.max(...weeklyData)

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '60px' }}>
      <span className="spinner-border text-success" />
    </div>
  )

  if (error) return (
    <div style={{ padding: '24px' }}>
      <div style={{ background: '#fdecea', color: '#c0392b', padding: '12px 16px', borderRadius: '8px', fontSize: '13px' }}>
        {error}
      </div>
    </div>
  )

  return (
    <div style={{ padding: '20px', background: '#f7f8fa', minHeight: '100%' }}>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '16px' }}>
        <StatCard label="New Request" value={dashboard?.released}    icon="ti-file-plus"       iconBg="#e8f5ee" iconColor="#1a7a4a" />
        <StatCard label="In Progress" value={dashboard?.operationStats?.inProgress} icon="ti-player-play" iconBg="#fff8e1" iconColor="#7a5a00" />
        <StatCard label="In Review"   value={dashboard?.failed}      icon="ti-clipboard-check" iconBg="#e8f0fe" iconColor="#1a56b0" />
        <StatCard label="Completed"   value={dashboard?.closed}      icon="ti-circle-check"    iconBg="#e0f5eb" iconColor="#1a7a4a" />
      </div>

      {/* Bar Chart Weekly */}
      <div style={{
        background: '#fff', border: '0.5px solid #e8e8e8',
        borderRadius: '12px', padding: '16px', marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '500', color: '#111' }}>Weekly completed work orders</div>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>Total completed work orders per day</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#9ca3af' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4a90d9', display: 'inline-block' }} />
            Completed
            <span style={{ marginLeft: '4px', padding: '3px 10px', border: '0.5px solid #e8e8e8', borderRadius: '20px', color: '#6b7280' }}>
              This Week
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '90px' }}>
          {weeklyData.map((v, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '3px' }}>
              <span style={{ fontSize: '10px', color: '#6b7280' }}>{v}</span>
              <div style={{
                width: '100%', background: '#4a90d9',
                borderRadius: '4px 4px 0 0',
                height: `${Math.round((v / maxVal) * 70)}px`,
                minHeight: '4px',
              }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', marginTop: '4px' }}>
          {days.map(d => (
            <span key={d} style={{ flex: 1, textAlign: 'center', fontSize: '10px', color: '#9ca3af' }}>{d}</span>
          ))}
        </div>
      </div>

      {/* Active WO Table */}
      <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{
          padding: '14px 16px', borderBottom: '0.5px solid #e8e8e8',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '500', color: '#111' }}>Department load</div>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>Operation count by department</div>
          </div>
        </div>
        <div style={{ padding: '16px' }}>
          {dashboard?.departments?.map((d, i) => {
            const maxOps = Math.max(...(dashboard.departments?.map(x => x.operationCount) ?? [1]))
            const pct    = maxOps > 0 ? Math.round((d.operationCount / maxOps) * 100) : 0
            const colors = ['#1a7a4a', '#52b788', '#40916c', '#2d6a4f', '#74c69d', '#95d5b2', '#b7e4c7']
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '45px', fontSize: '12px', fontWeight: '500', color: '#111' }}>{d.departmentCode}</div>
                <div style={{ flex: 1, height: '8px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: colors[i % colors.length], borderRadius: '4px', transition: 'width 0.5s' }} />
                </div>
                <div style={{ width: '60px', fontSize: '12px', color: '#9ca3af', textAlign: 'right' }}>
                  {d.operationCount?.toLocaleString('en-US')}
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}

export default Dashboard