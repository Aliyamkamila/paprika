import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Filter,
  X,
  ChevronDown,
  SlidersHorizontal,
  Eye,
  Calendar,
  Package,
  Download,
  Printer,
  RefreshCw,
  ChevronUp,
  ChevronsUpDown,
  Circle,
  CheckCircle2,
  AlertCircle,
  Timer,
  Check,
  CircleDot,
} from "lucide-react";
import "./workOrders.css";

const allWorkOrders = [
  { 
    order: "668", 
    op: "OP - 5", 
    dept: "QC", 
    assign: "Production Team", 
    status: "RUNNING",
    customer: "Chevron",
    updatedAt: "2026-07-12",
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
    customer: "ExxonMobil",
    updatedAt: "2026-07-11",
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
    customer: "Pertamina",
    updatedAt: "2026-07-10",
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
    customer: "TotalEnergies",
    updatedAt: "2026-07-13",
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
    customer: "BP",
    updatedAt: "2026-07-09",
    stages: [
      { name: "ME", status: "pending" },
      { name: "QC", status: "pending" },
      { name: "WELD", status: "pending" },
      { name: "OSP", status: "pending" },
      { name: "WH", status: "pending" },
    ]
  },
  { 
    order: "673", 
    op: "OP - 120", 
    dept: "TA", 
    assign: "Test Cell A", 
    status: "RUNNING",
    customer: "Shell",
    updatedAt: "2026-07-13",
    stages: [
      { name: "ME", status: "completed" },
      { name: "QC", status: "completed" },
      { name: "WELD", status: "active" },
      { name: "OSP", status: "pending" },
      { name: "WH", status: "pending" },
    ]
  },
  { 
    order: "674", 
    op: "OP - 330", 
    dept: "WHS", 
    assign: "Warehouse Shift B", 
    status: "REVIEW",
    customer: "Conoco",
    updatedAt: "2026-07-08",
    stages: [
      { name: "ME", status: "completed" },
      { name: "QC", status: "completed" },
      { name: "WELD", status: "pending" },
      { name: "OSP", status: "pending" },
      { name: "WH", status: "pending" },
    ]
  },
  { 
    order: "675", 
    op: "OP - 80", 
    dept: "OSP", 
    assign: "OSP Team", 
    status: "RUNNING",
    customer: "ENI",
    updatedAt: "2026-07-12",
    stages: [
      { name: "ME", status: "completed" },
      { name: "QC", status: "completed" },
      { name: "WELD", status: "completed" },
      { name: "OSP", status: "active" },
      { name: "WH", status: "pending" },
    ]
  },
  { 
    order: "676", 
    op: "OP - 410", 
    dept: "QC", 
    assign: "QC Cell 3", 
    status: "AWAITING",
    customer: "Petronas",
    updatedAt: "2026-07-12",
    stages: [
      { name: "ME", status: "pending" },
      { name: "QC", status: "pending" },
      { name: "WELD", status: "pending" },
      { name: "OSP", status: "pending" },
      { name: "WH", status: "pending" },
    ]
  },
  { 
    order: "677", 
    op: "OP - 510", 
    dept: "ME", 
    assign: "Engineering Cell", 
    status: "REVIEW",
    customer: "Repsol",
    updatedAt: "2026-07-07",
    stages: [
      { name: "ME", status: "completed" },
      { name: "QC", status: "pending" },
      { name: "WELD", status: "pending" },
      { name: "OSP", status: "pending" },
      { name: "WH", status: "pending" },
    ]
  },
  { 
    order: "678", 
    op: "OP - 15", 
    dept: "WELD", 
    assign: "Weld Team A", 
    status: "RUNNING",
    customer: "ADNOC",
    updatedAt: "2026-07-13",
    stages: [
      { name: "ME", status: "completed" },
      { name: "QC", status: "completed" },
      { name: "WELD", status: "active" },
      { name: "OSP", status: "pending" },
      { name: "WH", status: "pending" },
    ]
  },
  { 
    order: "679", 
    op: "OP - 95", 
    dept: "TA", 
    assign: "Test Cell B", 
    status: "AWAITING",
    customer: "Santos",
    updatedAt: "2026-07-06",
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

export default function WorkOrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState("order");
  const [sortDir, setSortDir] = useState("asc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredSorted = useMemo(() => {
    let rows = [...allWorkOrders];

    if (status !== "ALL") {
      rows = rows.filter((r) => r.status === status);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((r) =>
        r.order.toLowerCase().includes(q) ||
        r.customer.toLowerCase().includes(q) ||
        r.dept.toLowerCase().includes(q) ||
        r.assign.toLowerCase().includes(q) ||
        r.op.toLowerCase().includes(q)
      );
    }

    rows.sort((a, b) => {
      let av = a[sortBy];
      let bv = b[sortBy];

      if (sortBy === "order") {
        av = Number(av);
        bv = Number(bv);
      }

      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return rows;
  }, [search, status, sortBy, sortDir]);

  const setSort = (key) => {
    if (sortBy === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("asc");
    }
  };

  const onStatusChange = (v) => {
    setStatus(v);
    setIsFilterOpen(false);
  };

  const onSearchChange = (v) => {
    setSearch(v);
  };

  const getStatusCount = (statusFilter) => {
    if (statusFilter === "ALL") return allWorkOrders.length;
    return allWorkOrders.filter(order => order.status === statusFilter).length;
  };

  const statusOptions = [
    { value: "ALL", label: "All Status" },
    { value: "RUNNING", label: "Running" },
    { value: "AWAITING", label: "Awaiting" },
    { value: "REVIEW", label: "Review" },
  ];

  const runningCount = allWorkOrders.filter(w => w.status === 'RUNNING').length;
  const awaitingCount = allWorkOrders.filter(w => w.status === 'AWAITING').length;
  const reviewCount = allWorkOrders.filter(w => w.status === 'REVIEW').length;

  return (
    <div className="wo-list-page">
      <div className="wo-list-container">
        {/* Header */}
        <div className="wo-list-header">
          <div className="wo-list-header-left">
            <div className="wo-breadcrumb">
              <Link to="/dashboard" className="wo-breadcrumb-link">
                <ArrowLeft size={14} />
                Back to Dashboard
              </Link>
              <span className="wo-breadcrumb-sep">/</span>
              <span className="wo-breadcrumb-current">Work Orders</span>
            </div>
            <h1 className="wo-page-title">Work Orders</h1>
            <p className="wo-page-subtitle">Manage and monitor all work orders across departments</p>
          </div>
          <div className="wo-list-header-right">
            <div className="wo-header-actions">
              <button className="wo-header-btn" title="Refresh">
                <RefreshCw size={16} />
              </button>
              <button className="wo-header-btn" title="Download">
                <Download size={16} />
              </button>
              <button className="wo-header-btn" title="Print">
                <Printer size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="wo-stats-grid">
          <div className="wo-stat-card">
            <div className="wo-stat-card-icon" style={{ background: '#eef2ff', color: '#4f46e5' }}>
              <Package size={20} />
            </div>
            <div className="wo-stat-card-content">
              <span className="wo-stat-card-value">{allWorkOrders.length}</span>
              <span className="wo-stat-card-label">Total Orders</span>
            </div>
          </div>
          <div className="wo-stat-card">
            <div className="wo-stat-card-icon" style={{ background: '#d1fae5', color: '#059669' }}>
              <Timer size={20} />
            </div>
            <div className="wo-stat-card-content">
              <span className="wo-stat-card-value">{runningCount}</span>
              <span className="wo-stat-card-label">Running</span>
            </div>
          </div>
          <div className="wo-stat-card">
            <div className="wo-stat-card-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
              <Circle size={20} />
            </div>
            <div className="wo-stat-card-content">
              <span className="wo-stat-card-value">{awaitingCount}</span>
              <span className="wo-stat-card-label">Awaiting</span>
            </div>
          </div>
          <div className="wo-stat-card">
            <div className="wo-stat-card-icon" style={{ background: '#fce4ec', color: '#dc2626' }}>
              <AlertCircle size={20} />
            </div>
            <div className="wo-stat-card-content">
              <span className="wo-stat-card-value">{reviewCount}</span>
              <span className="wo-stat-card-label">Review</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="wo-toolbar">
          <div className="wo-search">
            <Search size={16} className="wo-search-icon" />
            <input
              placeholder="Search by WO, customer, department, assign..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="wo-search-input"
            />
            {search && (
              <button className="wo-search-clear" onClick={() => onSearchChange("")}>
                <X size={14} />
              </button>
            )}
            <kbd className="wo-search-kbd">⌘K</kbd>
          </div>

          <div className="wo-toolbar-right">
            <div className="wo-filter-container">
              <button 
                className="wo-filter-btn"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <SlidersHorizontal size={16} />
                <span>Status</span>
                <ChevronDown size={14} className={`wo-filter-chevron ${isFilterOpen ? 'open' : ''}`} />
                {status !== "ALL" && (
                  <span className="wo-filter-badge">{getStatusCount(status)}</span>
                )}
              </button>

              {isFilterOpen && (
                <div className="wo-filter-dropdown">
                  <div className="wo-filter-header">
                    <Filter size={14} />
                    <span>Filter by Status</span>
                    <button className="wo-filter-close" onClick={() => setIsFilterOpen(false)}>
                      <X size={14} />
                    </button>
                  </div>
                  <div className="wo-filter-options">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`wo-filter-option ${status === option.value ? 'active' : ''}`}
                        onClick={() => onStatusChange(option.value)}
                      >
                        <span className="wo-filter-label">{option.label}</span>
                        <span className="wo-filter-count">{getStatusCount(option.value)}</span>
                        {status === option.value && <CheckCircle2 size={14} className="wo-filter-check" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="wo-table-wrap">
          <table className="wo-table">
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
              {filteredSorted.length ? (
                filteredSorted.map((r) => (
                  <tr key={r.order} className="wo-table-row">
                    <td className="wo-id">{r.order}</td>
                    <td>{r.op}</td>
                    <td><span className="wo-dept-badge">{r.dept}</span></td>
                    <td>{r.assign}</td>
                    <td><StatusBadge status={r.status} /></td>
                    <td>
                      <StageTimeline stages={r.stages} />
                    </td>
                    <td>
                      <Link to={`/work-order/${r.order}`} className="wo-open-btn">OPEN</Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="wo-empty">
                    <div className="wo-empty-state">
                      <Package size={48} className="wo-empty-icon" />
                      <h3>No work orders found</h3>
                      <p>Try adjusting your search or filter criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="wo-footer">
          <p className="wo-footer-info">
            Showing <strong>{filteredSorted.length}</strong> of <strong>{allWorkOrders.length}</strong> work orders
            {status !== "ALL" && (
              <span className="wo-filter-info"> · Filtered by {status.toLowerCase()}</span>
            )}
            {search && (
              <span className="wo-filter-info"> · Search results</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}