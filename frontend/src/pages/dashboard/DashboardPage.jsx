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
  Plus,
  SlidersHorizontal,
  ClipboardCheck,
  PlayCircle,
  CalendarCheck2,
  CheckCircle2,
  Eye,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import bhLogo from "../../assets/logo.png";

const summaryCards = [
  { title: "New Request", value: 128, icon: <ClipboardCheck size={20} />, color: "#3b82f6" },
  { title: "In Progress", value: 45, icon: <PlayCircle size={20} />, color: "#f59e0b" },
  { title: "In Review", value: 18, icon: <CalendarCheck2 size={20} />, color: "#8b5cf6" },
  { title: "Completed", value: 22, icon: <CheckCircle2 size={20} />, color: "#10b981" },
];

const workOrders = [
  { order: "668", op: "OP - 5", dept: "QC", assign: "Production Team", status: "RUNNING", progress: 45 },
  { order: "669", op: "OP - 100", dept: "ME", assign: "Warehouse Team", status: "AWAITING", progress: 60 },
  { order: "670", op: "OP - 500", dept: "WELD", assign: "Quality Team", status: "REVIEW", progress: 25 },
  { order: "671", op: "OP - 75", dept: "QC", assign: "Quality Team", status: "RUNNING", progress: 80 },
  { order: "672", op: "OP - 200", dept: "ME", assign: "Production Team", status: "AWAITING", progress: 30 },
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

        {/* Chart Section - Line Diagram */}
        <section className="chart-section">
          <div className="chart-header">
            <div className="chart-title-group">
              <h2 className="chart-title">Production Velocity</h2>
              <p className="chart-subtitle">Weekly output analytics</p>
            </div>
            <div className="chart-controls">
              <div className="chart-legend">
                <span className="legend-item">
                  <span className="legend-dot running"></span>
                  Production
                </span>
                <span className="legend-item">
                  <span className="legend-dot target"></span>
                  Target
                </span>
              </div>
              <button className="btn-outline">Current Week</button>
            </div>
          </div>
          
          {/* Line Chart */}
          <div className="line-chart-container">
            <svg className="line-chart" viewBox="0 0 900 350" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1="300" x2="900" y2="300" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="0" y1="225" x2="900" y2="225" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
              <line x1="0" y1="150" x2="900" y2="150" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
              <line x1="0" y1="75" x2="900" y2="75" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
              
              {/* Y-axis labels */}
              <text x="0" y="310" className="chart-label">0</text>
              <text x="0" y="235" className="chart-label">25</text>
              <text x="0" y="160" className="chart-label">50</text>
              <text x="0" y="85" className="chart-label">75</text>
              <text x="0" y="15" className="chart-label">100</text>
              
              {/* Target Line (dashed) */}
              <polyline
                points="60,150 200,135 340,142 480,127 620,120 760,112"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeDasharray="8,4"
              />
              
              {/* Production Line with gradient */}
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Area under the line */}
              <polygon
                points="60,300 60,170 200,140 340,115 480,160 620,85 760,120 760,300"
                fill="url(#areaGradient)"
              />
              
              {/* Production Line */}
              <polyline
                points="60,170 200,140 340,115 480,160 620,85 760,120"
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Data points */}
              <circle cx="60" cy="170" r="7" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
              <circle cx="200" cy="140" r="7" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
              <circle cx="340" cy="115" r="7" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
              <circle cx="480" cy="160" r="7" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
              <circle cx="620" cy="85" r="7" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
              <circle cx="760" cy="120" r="7" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
              
              {/* Glow effect */}
              <circle cx="620" cy="85" r="12" fill="#3b82f6" opacity="0.15" />
              
              {/* X-axis labels */}
              <text x="60" y="330" className="chart-label">Mon</text>
              <text x="200" y="330" className="chart-label">Tue</text>
              <text x="340" y="330" className="chart-label">Wed</text>
              <text x="480" y="330" className="chart-label">Thu</text>
              <text x="620" y="330" className="chart-label">Fri</text>
              <text x="760" y="330" className="chart-label">Sat</text>
            </svg>
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
                      <div className="progress-container">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${work.progress}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">{work.progress}%</span>
                      </div>
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