import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './pages/Dashboard'
import WorkOrderList from './pages/WorkOrderList'
import WorkOrderDetail from './pages/WorkOrderDetail'

const pageTitles = {
  dashboard  : 'Good morning, Aliya',
  workorders : 'Work Order',
  wodetail   : 'Work Order',
  mytask     : 'My Task',
  activitylog: 'Activity Log',
  documents  : 'Documents',
}

function App() {
  const [page, setPage]       = useState('dashboard')
  const [selectedWo, setSelectedWo] = useState(null)
  const [dashboard, setDashboard] = useState(null)  // ← tambah ini

  const handleSelectWo = (woNumber) => {
    setSelectedWo(woNumber)
    setPage('wodetail')
  }

  const handleBack = () => {
    setSelectedWo(null)
    setPage('workorders')
  }

  const handleNavigate = (key) => {
    setSelectedWo(null)
    setPage(key)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar activePage={page} onNavigate={handleNavigate} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--green-bg)', overflow: 'hidden' }}>
        <Topbar title={pageTitles[page] ?? ''} />

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {page === 'dashboard'   && <Dashboard dashboard={dashboard} setDashboard={setDashboard} />}
          {page === 'workorders'  && <WorkOrderList onSelect={handleSelectWo} />}
          {page === 'wodetail'    && <WorkOrderDetail woNumber={selectedWo} onBack={handleBack} />}
          {page === 'mytask'      && <div style={{ padding: '24px', color: 'var(--green-muted)' }}>Coming soon...</div>}
          {page === 'activitylog' && <div style={{ padding: '24px', color: 'var(--green-muted)' }}>Coming soon...</div>}
          {page === 'documents'   && <div style={{ padding: '24px', color: 'var(--green-muted)' }}>Coming soon...</div>}
        </div>
      </div>
    </div>
  )
}

export default App