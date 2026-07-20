import "./dashboard.css";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  CheckSquare,
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
  ChevronDown,
  Filter,
  X,
} from "lucide-react";
import bhLogo from "../../assets/logo.png";
import { useState } from "react";

const summaryCards = [
  { title: "WO Active", value: 128, icon: <ClipboardCheck size={20} />, color: "#3b82f6" },
  { title: "Running", value: 45, icon: <PlayCircle size={20} />, color: "#f59e0b" },
  { title: "Prosses", value: 18, icon: <CalendarCheck2 size={20} />, color: "#8b5cf6" },
  { title: "Finish", value: 22, icon: <CheckCircle2 size={20} />, color: "#10b981" },
];

// Mapping operation ke department
const opDeptMap = {
  "OP - 5": "ME",
  "OP - 100": "WELD",
  "OP - 200": "QC",
  "OP - 400": "QC",
  "OP - 500": "TA",
  "OP - 600": "QC",
  "OP - 1000": "WELD",
  "OP - 1300": "QC",
  "OP - 1500": "WELD",
  "OP - 1600": "WELD",
  "OP - 1700": "QC",
  "OP - 1800": "OSP",
  "OP - 3000": "WELD",
  "OP - 3100": "QC",
  "OP - 3500": "WELD",
  "OP - 3600": "WELD",
  "OP - 3700": "QC",
  "OP - 4000": "OSP",
  "OP - 4100": "OSP",
  "OP - 4500": "QC",
  "OP - 4600": "QC",
  "OP - 5000": "OSP",
  "OP - 5100": "OSP",
  "OP - 5500": "QC",
  "OP - 5600": "QC",
  "OP - 5800": "QC",
  "OP - 6000": "TA",
  "OP - 6500": "QC",
  "OP - 6700": "TA",
  "OP - 6800": "OSP",
  "OP - 9500": "QC",
  "OP - 9900": "WHS",
};

// Generate stages berdasarkan operation
const getStagesFromOp = (op) => {
  const dept = opDeptMap[op] || "QC";
  // Semua department yang mungkin
  const allDepts = ["ME", "QC", "WELD", "OSP", "WH", "TA", "WHS"];
  const currentIndex = allDepts.indexOf(dept);
  
  return allDepts.map((name, index) => {
    let status = "pending";
    if (index < currentIndex) status = "completed";
    else if (index === currentIndex) status = "active";
    return { name, status };
  });
};

const allWorkOrders = [
  { 
    order: "668", 
    op: "OP - 5", 
    dept: "QC", 
    assign: "Production Team", 
    status: "RUNNING",
    stages: getStagesFromOp("OP - 5")
  },
  { 
    order: "669", 
    op: "OP - 100", 
    dept: "ME", 
    assign: "Warehouse Team", 
    status: "AWAITING",
    stages: getStagesFromOp("OP - 100")
  },
  { 
    order: "670", 
    op: "OP - 500", 
    dept: "WELD", 
    assign: "Quality Team", 
    status: "REVIEW",
    stages: getStagesFromOp("OP - 500")
  },
  { 
    order: "671", 
    op: "OP - 75", 
    dept: "QC", 
    assign: "Quality Team", 
    status: "RUNNING",
    stages: getStagesFromOp("OP - 75")
  },
  { 
    order: "672", 
    op: "OP - 200", 
    dept: "ME", 
    assign: "Production Team", 
    status: "AWAITING",
    stages: getStagesFromOp("OP - 200")
  },
  { 
    order: "673", 
    op: "OP - 1000", 
    dept: "WELD", 
    assign: "Weld Team A", 
    status: "RUNNING",
    stages: getStagesFromOp("OP - 1000")
  },
  { 
    order: "674", 
    op: "OP - 1800", 
    dept: "OSP", 
    assign: "OSP Team", 
    status: "REVIEW",
    stages: getStagesFromOp("OP - 1800")
  },
  { 
    order: "675", 
    op: "OP - 3000", 
    dept: "WELD", 
    assign: "Weld Team B", 
    status: "RUNNING",
    stages: getStagesFromOp("OP - 3000")
  },
  { 
    order: "676", 
    op: "OP - 4100", 
    dept: "OSP", 
    assign: "OSP Team", 
    status: "AWAITING",
    stages: getStagesFromOp("OP - 4100")
  },
  { 
    order: "677", 
    op: "OP - 6000", 
    dept: "TA", 
    assign: "Test Cell A", 
    status: "RUNNING",
    stages: getStagesFromOp("OP - 6000")
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [workOrders, setWorkOrders] = useState(allWorkOrders);

  const statusOptions = [
    { value: "ALL", label: "All Status" },
    { value: "RUNNING", label: "Running" },
    { value: "AWAITING", label: "Awaiting" },
    { value: "REVIEW", label: "Review" },
  ];

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setIsFilterOpen(false);
    
    if (status === "ALL") {
      setWorkOrders(allWorkOrders);
    } else {
      const filtered = allWorkOrders.filter(order => order.status === status);
      setWorkOrders(filtered);
    }
  };

  const getStatusCount = (status) => {
    if (status === "ALL") return allWorkOrders.length;
    return allWorkOrders.filter(order => order.status === status).length;
  };

  const handleViewAll = () => {
    setSelectedStatus("ALL");
    setWorkOrders(allWorkOrders);
    setIsFilterOpen(false);
    document.querySelector(".table-section")?.scrollIntoView({ 
      behavior: "smooth", 
      block: "start" 
    });
  };

  return (
    <div className="dashboard-container">
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
          <Link to="/work-orders" className="nav-link" style={{ textDecoration: 'none' }}>
            <ClipboardList size={20} />
            <span>Work Order</span>
          </Link>
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

      <main className="main-content">
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

        <section className="table-section">
          <div className="table-header">
            <div className="table-title-group">
              <h2 className="table-title">Active Work Orders</h2>
              <p className="table-subtitle">Live production tracking</p>
            </div>
            <div className="table-actions">
              <div className="filter-container">
                <button 
                  className="btn-filter"
                  onClick={handleFilterToggle}
                >
                  <SlidersHorizontal size={16} />
                  <span>Status</span>
                  <ChevronDown size={14} className={`filter-chevron ${isFilterOpen ? 'open' : ''}`} />
                  {selectedStatus !== "ALL" && (
                    <span className="filter-badge">{getStatusCount(selectedStatus)}</span>
                  )}
                </button>
                
                {isFilterOpen && (
                  <div className="filter-dropdown">
                    <div className="filter-dropdown-header">
                      <Filter size={14} />
                      <span>Filter by Status</span>
                      <button 
                        className="filter-close"
                        onClick={() => setIsFilterOpen(false)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="filter-options">
                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          className={`filter-option ${selectedStatus === option.value ? 'active' : ''}`}
                          onClick={() => handleStatusSelect(option.value)}
                        >
                          <span className="filter-option-label">{option.label}</span>
                          <span className="filter-option-count">{getStatusCount(option.value)}</span>
                          {selectedStatus === option.value && (
                            <Check size={14} className="filter-option-check" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link to="/work-orders" className="btn-view-all" style={{ textDecoration: 'none' }}>
                <Eye size={16} />
                <span>View All</span>
                <ChevronRight size={14} />
              </Link>
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
                {workOrders.length > 0 ? (
                  workOrders.map((work) => (
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
                        <Link to={`/work-order/${work.order}`} className="btn-action" style={{ textDecoration: 'none' }}>
                          OPEN
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="empty-state">
                      <p>No work orders found for this status</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="table-footer">
            <p className="table-count">
              Showing <strong>{workOrders.length}</strong> active work orders
              {selectedStatus !== "ALL" && (
                <span className="filter-info"> (filtered by {selectedStatus.toLowerCase()})</span>
              )}
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