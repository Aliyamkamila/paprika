import "./dashboard.css";
import {
  LayoutDashboard,
  ClipboardList,
  CheckSquare,
  Activity,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  SlidersHorizontal,
  ClipboardCheck,
  PlayCircle,
  CalendarCheck2,
  CheckCircle2,
  Eye,
  ChevronRight,
  ChevronLeft,
  Check,
  Circle,
  CircleDot,
} from "lucide-react";
import bhLogo from "../../assets/logo.png";

const summaryCards = [
  { title: "New Request", value: 128, icon: <ClipboardCheck size={20} />, color: "#3b82f6" },
  { title: "In Progress", value: 45, icon: <PlayCircle size={20} />, color: "#f59e0b" },
  { title: "In Review", value: 18, icon: <CalendarCheck2 size={20} />, color: "#8b5cf6" },
  { title: "Completed", value: 22, icon: <CheckCircle2 size={20} />, color: "#10b981" },
];

const workOrders = [
  { 
    order: "668", 
    op: "OP - 5", 
    dept: "QC", 
    assign: "Production Team", 
    status: "RUNNING", 
    stages: [
      { name: "ME", status: "completed" },
      { name: "QC", status: "completed" },
      { name: "WELD", status: "active" },
      { name: "OSP", status: "pending" },
      { name: "WH", status: "pending" },
    ]
  },
  { 
    order: "669", 
    op: "OP - 100", 
    dept: "ME", 
    assign: "Warehouse Team", 
    status: "AWAITING",
    stages: [
      { name: "ME", status: "completed" },
      { name: "QC", status: "pending" },
      { name: "WELD", status: "pending" },
      { name: "OSP", status: "pending" },
      { name: "WH", status: "pending" },
    ]
  },
  { 
    order: "670", 
    op: "OP - 500", 
    dept: "WELD", 
    assign: "Quality Team", 
    status: "REVIEW",
    stages: [
      { name: "ME", status: "completed" },
      { name: "QC", status: "completed" },
      { name: "WELD", status: "completed" },
      { name: "OSP", status: "pending" },
      { name: "WH", status: "pending" },
    ]
  },
  { 
    order: "671", 
    op: "OP - 75", 
    dept: "QC", 
    assign: "Quality Team", 
    status: "RUNNING",
    stages: [
      { name: "ME", status: "completed" },
      { name: "QC", status: "completed" },
      { name: "WELD", status: "active" },
      { name: "OSP", status: "pending" },
      { name: "WH", status: "pending" },
    ]
  },
  { 
    order: "672", 
    op: "OP - 200", 
    dept: "ME", 
    assign: "Production Team", 
    status: "AWAITING",
    stages: [
      { name: "ME", status: "pending" },
      { name: "QC", status: "pending" },
      { name: "WELD", status: "pending" },
      { name: "OSP", status: "pending" },
      { name: "WH", status: "pending" },
    ]
  },
];

function StatusBadge({ status }) {
  const statusMap = {
    running: { label: "RUNNING", class: "status-running" },
    awaiting: { label: "AWAITING", class: "status-awaiting" },
    review: { label: "REVIEW", class: "status-review" },
  };
  
  const key = status.toLowerCase();
  const statusInfo = statusMap[key] || statusMap.running;
  
  return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.label}</span>;
}

function StageTimeline({ stages }) {
  const getIcon = (status) => {
    switch(status) {
      case 'completed':
        return <Check size={14} className="stage-icon completed" />;
      case 'active':
        return <CircleDot size={14} className="stage-icon active" />;
      case 'pending':
        return <Circle size={14} className="stage-icon pending" />;
      default:
        return <Circle size={14} className="stage-icon pending" />;
    }
  };

  return (
    <div className="stage-timeline">
      {stages.map((stage, index) => (
        <div key={index} className="stage-item">
          <div className="stage-icon-wrapper">
            {getIcon(stage.status)}
            {index < stages.length - 1 && (
              <div className={`stage-line ${stage.status === 'completed' ? 'completed' : ''}`} />
            )}
          </div>
          <span className={`stage-name ${stage.status}`}>{stage.name}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand">
            <img src={bhLogo} alt="Baker Hughes" className="brand-logo" />
            <span className="brand-name">eWorkOrder</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-link active">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          <button className="nav-link">
            <ClipboardList size={20} />
            <span>Work Order</span>
          </button>
          <button className="nav-link">
            <CheckSquare size={20} />
            <span>My Task</span>
          </button>
          <button className="nav-link">
            <Activity size={20} />
            <span>Activity Log</span>
          </button>
          <button className="nav-link">
            <FileText size={20} />
            <span>Documents</span>
          </button>
          <button className="nav-link">
            <BarChart3 size={20} />
            <span>Reports</span>
          </button>
          <button className="nav-link">
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>

        <button className="logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <h1 className="greeting">Good Morning, Aliya</h1>
          </div>

          <div className="topbar-right">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search across system..." 
                className="search-input"
              />
            </div>

            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>

            <div className="user-profile">
              <div className="user-info">
                <p className="user-name">Aliya Kamila</p>
                <p className="user-role">ENGINEER</p>
              </div>
              <div className="user-avatar">AK</div>
            </div>
          </div>
        </header>

        {/* Summary Cards */}
        <section className="summary-section">
          {summaryCards.map((card) => (
            <div key={card.title} className="summary-card">
              <div className="summary-card-content">
                <p className="summary-card-title">{card.title}</p>
                <h3 className="summary-card-value">{card.value}</h3>
              </div>
              <div 
                className="summary-card-icon"
                style={{ backgroundColor: card.color + '15', color: card.color }}
              >
                {card.icon}
              </div>
            </div>
          ))}
        </section>

        {/* Chart Section - Bar Chart */}
        <section className="chart-section">
          <div className="chart-header">
            <div className="chart-title-group">
              <h2 className="chart-title">Weekly Completed Work Orders</h2>
              <p className="chart-subtitle">Total completed work orders per day</p>
            </div>
            <div className="chart-controls">
              <div className="chart-legend">
                <span className="legend-item">
                  <span className="legend-dot completed"></span>
                  Completed
                </span>
              </div>
              <button className="btn-outline">This Week</button>
            </div>
          </div>
          
          {/* Bar Chart */}
          <div className="bar-chart-container">
            <div className="bar-chart">
              <div className="bar-item" style={{ height: '80%' }}>
                <div className="bar-value">23</div>
                <div className="bar-bar" style={{ height: '80%' }}></div>
                <div className="bar-label">Mon</div>
              </div>
              <div className="bar-item" style={{ height: '90%' }}>
                <div className="bar-value">27</div>
                <div className="bar-bar" style={{ height: '90%' }}></div>
                <div className="bar-label">Tue</div>
              </div>
              <div className="bar-item" style={{ height: '100%' }}>
                <div className="bar-value">31</div>
                <div className="bar-bar" style={{ height: '100%' }}></div>
                <div className="bar-label">Wed</div>
              </div>
              <div className="bar-item" style={{ height: '60%' }}>
                <div className="bar-value">18</div>
                <div className="bar-bar" style={{ height: '60%' }}></div>
                <div className="bar-label">Thu</div>
              </div>
              <div className="bar-item" style={{ height: '95%' }}>
                <div className="bar-value">35</div>
                <div className="bar-bar" style={{ height: '95%' }}></div>
                <div className="bar-label">Fri</div>
              </div>
              <div className="bar-item" style={{ height: '45%' }}>
                <div className="bar-value">14</div>
                <div className="bar-bar" style={{ height: '45%' }}></div>
                <div className="bar-label">Sat</div>
              </div>
              <div className="bar-item" style={{ height: '30%' }}>
                <div className="bar-value">9</div>
                <div className="bar-bar" style={{ height: '30%' }}></div>
                <div className="bar-label">Sun</div>
              </div>
            </div>
          </div>
        </section>

        {/* Table Section */}
        <section className="table-section">
          <div className="table-header">
            <div className="table-title-group">
              <h2 className="table-title">Active Work Orders</h2>
              <p className="table-subtitle">Live production tracking</p>
            </div>
            <div className="table-actions">
              <button className="btn-secondary">
                <SlidersHorizontal size={16} />
                <span>Status</span>
              </button>
              <button className="btn-view-all">
                <Eye size={16} />
                <span>View All</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="work-order-table">
              <thead>
                <tr>
                  <th>ORDER</th>
                  <th>LAST OPERATION</th>
                  <th>DEPARTMENT</th>
                  <th>ASSIGN TO</th>
                  <th>STATUS</th>
                  <th>PROGRESS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {workOrders.map((work) => (
                  <tr key={work.order}>
                    <td className="order-id">{work.order}</td>
                    <td>{work.op}</td>
                    <td>{work.dept}</td>
                    <td>{work.assign}</td>
                    <td><StatusBadge status={work.status} /></td>
                    <td>
                      <StageTimeline stages={work.stages} />
                    </td>
                    <td>
                      <button className="btn-action">OPEN</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="table-footer">
            <p className="table-count">
              Showing <strong>{workOrders.length}</strong> active work orders
            </p>
            <div className="table-pagination">
              <button className="pagination-btn pagination-prev">
                <ChevronLeft size={16} />
              </button>
              <button className="pagination-btn active">1</button>
              <button className="pagination-btn">2</button>
              <button className="pagination-btn">3</button>
              <span className="pagination-dots">...</span>
              <button className="pagination-btn">8</button>
              <button className="pagination-btn pagination-next">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}