import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './pages/Dashboard'
import WorkOrderList from './pages/WorkOrderList'
import WorkOrderDetail from './pages/WorkOrderDetail'
import ImportData from './pages/ImportData'  // ✅ Tambahkan import

const pageTitles = {
  dashboard  : 'Good morning, Aliya',
  workorders : 'Work Order',
  wodetail   : 'Work Order',
  mytask     : 'My Task',
  activitylog: 'Activity Log',
  documents  : 'Documents',
  import     : 'Import Data',  // ✅ Tambahkan title untuk import
}

function App() {
  const [page, setPage] = useState('dashboard')
  const [selectedWo, setSelectedWo] = useState(null)

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
          {page === 'dashboard'   && <Dashboard />}  {/* ✅ Hapus props dashboard & setDashboard */}
          {page === 'workorders'  && <WorkOrderList onSelect={handleSelectWo} />}
          {page === 'wodetail'    && <WorkOrderDetail woNumber={selectedWo} onBack={handleBack} />}
          {page === 'mytask'      && <div style={{ padding: '24px', color: 'var(--green-muted)' }}>Coming soon...</div>}
          {page === 'activitylog' && <div style={{ padding: '24px', color: 'var(--green-muted)' }}>Coming soon...</div>}
          {page === 'documents'   && <div style={{ padding: '24px', color: 'var(--green-muted)' }}>Coming soon...</div>}
          {page === 'import'      && <ImportData />}  {/* ✅ Tambahkan route import */}
        </div>
      </div>
    </div>
  )
}

export default App