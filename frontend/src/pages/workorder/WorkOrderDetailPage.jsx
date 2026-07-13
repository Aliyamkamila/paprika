import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CheckCircle2,
  Circle,
  CircleDot,
  ArrowLeft,
  ClipboardList,
  CalendarDays,
  Building2,
  Package,
  Hash,
  Clock,
  AlertCircle,
  Check,
  ChevronRight,
  Home,
  User,
  FileText,
  Settings,
  MoreVertical,
  Download,
  Printer,
  Share2,
  Star,
  Layers,
  Activity,
  Truck,
  Shield,
  Zap,
  X,
  UserCheck,
  Calendar,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import "./workOrderDetail.css";

const currentUser = {
  name: "Aliya Kamila",
  department: "WELD",
};

const workOrders = [
  {
    id: "668",
    woNumber: "WO-668",
    salesOrder: "SO-230045",
    customer: "Chevron",
    partNumber: "PN-VALVE-8IN",
    description: "Valve Body Bevel Pipe 22.0 x 1.0",
    revision: "Rev C",
    quantity: 24,
    dueDate: "13 Jul 2026",
    status: "RUNNING",
    progress: 45,
    priority: "Normal",
    currentOperation: "OP100",
    currentDepartment: "WELD",
    operationDetail: {
      operation: "100",
      department: "WELD",
      instruction: "Torch Cut Bevel Pipe",
      scheduled: "12 Jul",
      due: "13 Jul",
    },
    workInstructions: [
      { id: 1, text: "Torch Cut Bevel Pipe", checked: true },
      { id: 2, text: "WS Inspect", checked: true },
      { id: 3, text: "Follow Drawing H443737", checked: false },
      { id: 4, text: "Verify Material", checked: false },
    ],
    timeline: [
      { 
        dept: "ME", 
        state: "completed",
        detail: {
          operation: "OP - 5",
          status: "Completed",
          engineer: "Aliya Kamila",
          date: "10 Jul 2026",
          remark: "OK - All dimensions verified"
        }
      },
      { 
        dept: "QC", 
        state: "completed",
        detail: {
          operation: "OP - 10",
          status: "Completed",
          engineer: "Budi Santoso",
          date: "11 Jul 2026",
          remark: "Passed quality inspection"
        }
      },
      { 
        dept: "ME", 
        state: "completed",
        detail: {
          operation: "OP - 15",
          status: "Completed",
          engineer: "Aliya Kamila",
          date: "11 Jul 2026",
          remark: "Machining completed"
        }
      },
      { 
        dept: "WELD", 
        state: "current",
        detail: {
          operation: "OP - 100",
          status: "In Progress",
          engineer: "Current User",
          date: "12 Jul 2026",
          remark: "Welding in progress"
        }
      },
      { 
        dept: "QC", 
        state: "waiting",
        detail: {
          operation: "OP - 105",
          status: "Waiting",
          engineer: "-",
          date: "-",
          remark: "Pending inspection"
        }
      },
      { 
        dept: "TA", 
        state: "waiting",
        detail: {
          operation: "OP - 110",
          status: "Waiting",
          engineer: "-",
          date: "-",
          remark: "Pending heat treatment"
        }
      },
      { 
        dept: "WHS", 
        state: "waiting",
        detail: {
          operation: "OP - 115",
          status: "Waiting",
          engineer: "-",
          date: "-",
          remark: "Pending warehouse"
        }
      },
    ],
  },
];

function TimelineIcon({ state }) {
  if (state === "completed") return <CheckCircle2 size={16} className="tl-icon done" />;
  if (state === "current") return <CircleDot size={16} className="tl-icon current" />;
  return <Circle size={16} className="tl-icon wait" />;
}

function StatusBadge({ status }) {
  const statusMap = {
    running: { label: "RUNNING", class: "status-running" },
    awaiting: { label: "AWAITING", class: "status-awaiting" },
    review: { label: "REVIEW", class: "status-review" },
    completed: { label: "COMPLETED", class: "status-completed" },
  };
  
  const key = status.toLowerCase();
  const statusInfo = statusMap[key] || statusMap.running;
  
  return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.label}</span>;
}

function TimelinePopup({ item, onClose }) {
  if (!item) return null;
  
  const { dept, state, detail } = item;
  
  return (
    <div className="wo-popup-overlay" onClick={onClose}>
      <div className="wo-popup" onClick={(e) => e.stopPropagation()}>
        <div className="wo-popup-header">
          <div className="wo-popup-title">
            <Building2 size={18} className="wo-popup-icon" />
            <span>Operation {detail.operation}</span>
          </div>
          <button className="wo-popup-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        
        <div className="wo-popup-body">
          <div className="wo-popup-dept">
            <span className="wo-popup-dept-label">Department</span>
            <span className="wo-popup-dept-value">{dept}</span>
          </div>
          
          <div className="wo-popup-status-row">
            <div className="wo-popup-status-item">
              <span className="wo-popup-status-label">Status</span>
              <span className={`wo-popup-status-value ${state}`}>
                {state === "completed" ? "✓ Completed" : 
                 state === "current" ? "● In Progress" : "○ Waiting"}
              </span>
            </div>
            <div className="wo-popup-status-item">
              <span className="wo-popup-status-label">Date</span>
              <span className="wo-popup-status-value">{detail.date || "-"}</span>
            </div>
          </div>
          
          <div className="wo-popup-engineer">
            <UserCheck size={14} className="wo-popup-engineer-icon" />
            <div>
              <span className="wo-popup-engineer-label">Engineer</span>
              <span className="wo-popup-engineer-value">{detail.engineer}</span>
            </div>
          </div>
          
          <div className="wo-popup-remark">
            <MessageSquare size={14} className="wo-popup-remark-icon" />
            <div>
              <span className="wo-popup-remark-label">Remark</span>
              <span className="wo-popup-remark-value">{detail.remark}</span>
            </div>
          </div>
          
          {state === "completed" && (
            <div className="wo-popup-completed-badge">
              <CheckCircle2 size={14} />
              <span>Completed successfully</span>
            </div>
          )}
          
          {state === "current" && (
            <button className="wo-popup-action-btn">
              <ExternalLink size={14} />
              Go to Operation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WorkOrderDetailPage() {
  const { id } = useParams();
  const [selectedTimeline, setSelectedTimeline] = useState(null);

  const wo = useMemo(() => {
    return workOrders.find((w) => w.id === id) || workOrders[0];
  }, [id]);

  const canGoToMyTask = wo.currentDepartment === currentUser.department;
  const completedCount = wo.timeline.filter(t => t.state === 'completed').length;
  const totalCount = wo.timeline.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const handleTimelineClick = (item) => {
    setSelectedTimeline(item);
  };

  return (
    <div className="wo-page">
      <div className="wo-container">
        {/* Top Navigation Bar */}
        <div className="wo-topbar">
          <Link to="/dashboard" className="wo-topbar-back">
            <ArrowLeft size={18} />
            <span>Back to Dashboard</span>
          </Link>
          <div className="wo-topbar-actions">
            <button className="wo-topbar-btn">
              <Star size={16} />
            </button>
            <button className="wo-topbar-btn">
              <Share2 size={16} />
            </button>
            <button className="wo-topbar-btn">
              <Download size={16} />
            </button>
            <button className="wo-topbar-btn">
              <Printer size={16} />
            </button>
            <button className="wo-topbar-btn primary">
              <FileText size={16} />
              <span>Documents</span>
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="wo-hero">
          <div className="wo-hero-left">
            <div className="wo-hero-breadcrumb">
              <span>Work Orders</span>
              <ChevronRight size={14} />
              <span className="active">{wo.woNumber}</span>
            </div>
            <div className="wo-hero-title">
              <h1>{wo.woNumber}</h1>
              <StatusBadge status={wo.status} />
              <span className="wo-hero-priority">{wo.priority}</span>
            </div>
            <p className="wo-hero-desc">{wo.description}</p>
            <div className="wo-hero-meta">
              <div className="wo-hero-meta-item">
                <User size={14} />
                <span>{wo.customer}</span>
              </div>
              <div className="wo-hero-meta-item">
                <Package size={14} />
                <span>{wo.partNumber}</span>
              </div>
              <div className="wo-hero-meta-item">
                <Clock size={14} />
                <span>Due {wo.dueDate}</span>
              </div>
              <div className="wo-hero-meta-item">
                <Building2 size={14} />
                <span>{wo.currentDepartment}</span>
              </div>
            </div>
          </div>
          <div className="wo-hero-right">
            <div className="wo-hero-stats">
              <div className="wo-hero-stat">
                <div className="wo-hero-stat-value">{wo.quantity}</div>
                <div className="wo-hero-stat-label">Quantity</div>
              </div>
              <div className="wo-hero-stat-divider"></div>
              <div className="wo-hero-stat">
                <div className="wo-hero-stat-value">OP-{wo.operationDetail.operation}</div>
                <div className="wo-hero-stat-label">Current Op</div>
              </div>
              <div className="wo-hero-stat-divider"></div>
              <div className="wo-hero-stat">
                <div className="wo-hero-stat-value">{progressPercent}%</div>
                <div className="wo-hero-stat-label">Progress</div>
              </div>
            </div>
            {canGoToMyTask && (
              <Link to="/my-task" className="wo-hero-btn">
                <Check size={16} />
                Go to My Task
                <ChevronRight size={14} />
              </Link>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="wo-progress-section">
          <div className="wo-progress-header">
            <span className="wo-progress-label">Overall Progress</span>
            <span className="wo-progress-percent">{progressPercent}%</span>
          </div>
          <div className="wo-progress-bar">
            <div className="wo-progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="wo-quick-cards">
          <div className="wo-quick-card">
            <div className="wo-quick-card-icon" style={{ background: '#eef2ff', color: '#4f46e5' }}>
              <Package size={18} />
            </div>
            <div>
              <div className="wo-quick-card-label">Sales Order</div>
              <div className="wo-quick-card-value">{wo.salesOrder}</div>
            </div>
          </div>
          <div className="wo-quick-card">
            <div className="wo-quick-card-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
              <Hash size={18} />
            </div>
            <div>
              <div className="wo-quick-card-label">Part Number</div>
              <div className="wo-quick-card-value">{wo.partNumber}</div>
            </div>
          </div>
          <div className="wo-quick-card">
            <div className="wo-quick-card-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
              <Clock size={18} />
            </div>
            <div>
              <div className="wo-quick-card-label">Due Date</div>
              <div className="wo-quick-card-value">{wo.dueDate}</div>
            </div>
          </div>
          <div className="wo-quick-card">
            <div className="wo-quick-card-icon" style={{ background: '#d1fae5', color: '#059669' }}>
              <Building2 size={18} />
            </div>
            <div>
              <div className="wo-quick-card-label">Department</div>
              <div className="wo-quick-card-value">{wo.currentDepartment}</div>
            </div>
          </div>
          <div className="wo-quick-card">
            <div className="wo-quick-card-icon" style={{ background: '#fce4ec', color: '#dc2626' }}>
              <AlertCircle size={18} />
            </div>
            <div>
              <div className="wo-quick-card-label">Priority</div>
              <div className="wo-quick-card-value">{wo.priority}</div>
            </div>
          </div>
          <div className="wo-quick-card">
            <div className="wo-quick-card-icon" style={{ background: '#f3e8ff', color: '#7c3aed' }}>
              <FileText size={18} />
            </div>
            <div>
              <div className="wo-quick-card-label">Revision</div>
              <div className="wo-quick-card-value">{wo.revision}</div>
            </div>
          </div>
        </div>

        {/* Main Content - Two Columns */}
        <div className="wo-main-grid">
          {/* Left Column */}
          <div className="wo-main-left">
            {/* General Information */}
            <div className="wo-card">
              <div className="wo-card-header">
                <div className="wo-card-title">
                  <ClipboardList size={18} className="wo-card-icon" />
                  <h3>General Information</h3>
                </div>
              </div>
              <div className="wo-card-body">
                <div className="wo-info-grid">
                  <div className="wo-info-item">
                    <label>WO Number</label>
                    <p>{wo.woNumber}</p>
                  </div>
                  <div className="wo-info-item">
                    <label>Sales Order</label>
                    <p>{wo.salesOrder}</p>
                  </div>
                  <div className="wo-info-item">
                    <label>Customer</label>
                    <p>{wo.customer}</p>
                  </div>
                  <div className="wo-info-item">
                    <label>Part Number</label>
                    <p>{wo.partNumber}</p>
                  </div>
                  <div className="wo-info-item full">
                    <label>Description</label>
                    <p>{wo.description}</p>
                  </div>
                  <div className="wo-info-item">
                    <label>Revision</label>
                    <p>{wo.revision}</p>
                  </div>
                  <div className="wo-info-item">
                    <label>Quantity</label>
                    <p>{wo.quantity}</p>
                  </div>
                  <div className="wo-info-item">
                    <label>Due Date</label>
                    <p>{wo.dueDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Operation - RAPI */}
            <div className="wo-card">
              <div className="wo-card-header">
                <div className="wo-card-title">
                  <Zap size={18} className="wo-card-icon" />
                  <h3>Current Operation</h3>
                </div>
                <span className="wo-card-badge active">Active</span>
              </div>
              <div className="wo-card-body">
                {/* Info Operation */}
                <div className="wo-current-op-grid">
                  <div className="wo-current-op-item">
                    <span className="wo-current-op-label">Operation</span>
                    <span className="wo-current-op-value">OP - {wo.operationDetail.operation}</span>
                  </div>
                  <div className="wo-current-op-item">
                    <span className="wo-current-op-label">Department</span>
                    <span className="wo-current-op-value">{wo.operationDetail.department}</span>
                  </div>
                  <div className="wo-current-op-item full">
                    <span className="wo-current-op-label">Schedule</span>
                    <span className="wo-current-op-value">
                      <CalendarDays size={14} className="inline-icon" />
                      {wo.operationDetail.scheduled} - {wo.operationDetail.due}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="wo-divider"></div>

                {/* Work Instructions */}
                <div className="wo-work-instructions">
                  <div className="wo-work-instructions-header">
                    <ClipboardList size={14} className="wo-work-instructions-icon" />
                    <span>Work Instructions</span>
                    <span className="wo-work-instructions-count">
                      {wo.workInstructions.filter(i => i.checked).length}/{wo.workInstructions.length}
                    </span>
                  </div>
                  <div className="wo-work-instructions-list">
                    {wo.workInstructions.map((instruction) => (
                      <div key={instruction.id} className="wo-work-instruction-item">
                        <div className={`wo-work-instruction-check ${instruction.checked ? 'checked' : ''}`}>
                          {instruction.checked && <Check size={12} />}
                        </div>
                        <span className={`wo-work-instruction-text ${instruction.checked ? 'checked' : ''}`}>
                          {instruction.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Timeline */}
          <div className="wo-main-right">
            <div className="wo-card timeline-card">
              <div className="wo-card-header">
                <div className="wo-card-title">
                  <Layers size={18} className="wo-card-icon" />
                  <h3>Operation Timeline</h3>
                </div>
                <span className="wo-card-badge">{completedCount}/{totalCount}</span>
              </div>
              <div className="wo-card-body">
                <div className="wo-timeline">
                  {wo.timeline.map((t, i) => (
                    <div 
                      key={`${t.dept}-${i}`} 
                      className="wo-timeline-item clickable"
                      onClick={() => handleTimelineClick(t)}
                    >
                      <div className="wo-timeline-left">
                        <div className="wo-timeline-icon-wrap">
                          <TimelineIcon state={t.state} />
                          {i < wo.timeline.length - 1 && (
                            <div className={`wo-timeline-line ${t.state === 'completed' ? 'completed' : ''}`} />
                          )}
                        </div>
                        <div className="wo-timeline-content">
                          <span className={`wo-timeline-dept ${t.state}`}>{t.dept}</span>
                          <span className="wo-timeline-op">{t.detail.operation}</span>
                          {t.state === 'current' && (
                            <span className="wo-timeline-badge">In Progress</span>
                          )}
                        </div>
                      </div>
                      <span className={`wo-timeline-status ${t.state}`}>
                        {t.state === "completed" ? "✓ Completed" : 
                         t.state === "current" ? "● In Progress" : "○ Waiting"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="wo-card info-card">
              <div className="wo-card-header">
                <div className="wo-card-title">
                  <Shield size={18} className="wo-card-icon" />
                  <h3>Additional Information</h3>
                </div>
              </div>
              <div className="wo-card-body">
                <div className="wo-additional-grid">
                  <div className="wo-additional-item">
                    <label>Created By</label>
                    <p>John Doe</p>
                  </div>
                  <div className="wo-additional-item">
                    <label>Created Date</label>
                    <p>01 Jul 2026</p>
                  </div>
                  <div className="wo-additional-item">
                    <label>Last Updated</label>
                    <p>12 Jul 2026</p>
                  </div>
                  <div className="wo-additional-item">
                    <label>Approved By</label>
                    <p>Jane Smith</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Popup */}
      <TimelinePopup 
        item={selectedTimeline} 
        onClose={() => setSelectedTimeline(null)} 
      />
    </div>
  );
}