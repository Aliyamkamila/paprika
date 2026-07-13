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

// Mapping operation ke department - LENGKAP dari data yang diberikan
const opDeptMap = {
  "OP-5": "ME",
  "OP-100": "WELD",
  "OP-200": "QC",
  "OP-400": "QC",
  "OP-500": "TA",
  "OP-600": "QC",
  "OP-1000": "WELD",
  "OP-1300": "QC",
  "OP-1500": "WELD",
  "OP-1600": "WELD",
  "OP-1700": "QC",
  "OP-1800": "OSP",
  "OP-3000": "WELD",
  "OP-3100": "QC",
  "OP-3500": "WELD",
  "OP-3600": "WELD",
  "OP-3700": "QC",
  "OP-4000": "OSP",
  "OP-4100": "OSP",
  "OP-4500": "QC",
  "OP-4600": "QC",
  "OP-5000": "OSP",
  "OP-5100": "OSP",
  "OP-5500": "QC",
  "OP-5600": "QC",
  "OP-5800": "QC",
  "OP-6000": "TA",
  "OP-6500": "QC",
  "OP-6700": "TA",
  "OP-6800": "OSP",
  "OP-9500": "QC",
  "OP-9900": "WHS",
};

// Data operation lengkap dengan detail
const allOperations = [
  { op: "OP-5", dept: "ME", desc: "Initial Machining", machine: "CNC-01", stdTime: "2.5", noted: "OK - Setup completed" },
  { op: "OP-100", dept: "WELD", desc: "Torch Cut Bevel Pipe", machine: "WELD-01", stdTime: "3.0", noted: "In progress - Welding" },
  { op: "OP-200", dept: "QC", desc: "Quality Inspection", machine: "QC-01", stdTime: "1.5", noted: "Pending inspection" },
  { op: "OP-400", dept: "QC", desc: "Dimensional Check", machine: "QC-02", stdTime: "2.0", noted: "All dimensions verified" },
  { op: "OP-500", dept: "TA", desc: "Test Pump Performance", machine: "TA-01", stdTime: "4.0", noted: "Test running" },
  { op: "OP-600", dept: "QC", desc: "Material Verification", machine: "QC-03", stdTime: "1.0", noted: "Material certified" },
  { op: "OP-1000", dept: "WELD", desc: "Welding Assembly", machine: "WELD-02", stdTime: "5.0", noted: "Assembly in progress" },
  { op: "OP-1300", dept: "QC", desc: "NDT Inspection", machine: "QC-04", stdTime: "2.5", noted: "NDT passed" },
  { op: "OP-1500", dept: "WELD", desc: "Finish Welding", machine: "WELD-03", stdTime: "3.5", noted: "Finishing weld" },
  { op: "OP-1600", dept: "WELD", desc: "Welding Repair", machine: "WELD-04", stdTime: "2.0", noted: "Repair completed" },
  { op: "OP-1700", dept: "QC", desc: "Final QC Check", machine: "QC-05", stdTime: "1.5", noted: "QC approved" },
  { op: "OP-1800", dept: "OSP", desc: "Final Assembly & Coating", machine: "OSP-01", stdTime: "6.0", noted: "Coating applied" },
  { op: "OP-3000", dept: "WELD", desc: "Structural Welding", machine: "WELD-05", stdTime: "4.5", noted: "Structure welded" },
  { op: "OP-3100", dept: "QC", desc: "Welding Inspection", machine: "QC-06", stdTime: "2.0", noted: "Weld inspected" },
  { op: "OP-3500", dept: "WELD", desc: "Pipe Welding", machine: "WELD-06", stdTime: "3.0", noted: "Pipe welded" },
  { op: "OP-3600", dept: "WELD", desc: "Pipe Beveling", machine: "WELD-07", stdTime: "2.5", noted: "Beveling done" },
  { op: "OP-3700", dept: "QC", desc: "Pipe QC", machine: "QC-07", stdTime: "1.5", noted: "Pipe QC passed" },
  { op: "OP-4000", dept: "OSP", desc: "OSP Machining", machine: "OSP-02", stdTime: "4.0", noted: "Machining completed" },
  { op: "OP-4100", dept: "OSP", desc: "OSP Finishing", machine: "OSP-03", stdTime: "3.0", noted: "Finishing done" },
  { op: "OP-4500", dept: "QC", desc: "OSP QC", machine: "QC-08", stdTime: "1.5", noted: "OSP QC passed" },
  { op: "OP-4600", dept: "QC", desc: "Final OSP QC", machine: "QC-09", stdTime: "1.0", noted: "Final OSP approved" },
  { op: "OP-5000", dept: "OSP", desc: "OSP Coating", machine: "OSP-04", stdTime: "5.0", noted: "Coating in progress" },
  { op: "OP-5100", dept: "OSP", desc: "OSP Coating QC", machine: "QC-10", stdTime: "2.0", noted: "Coating QC passed" },
  { op: "OP-5500", dept: "QC", desc: "Coating Inspection", machine: "QC-11", stdTime: "1.5", noted: "Coating inspected" },
  { op: "OP-5600", dept: "QC", desc: "Final Coating QC", machine: "QC-12", stdTime: "1.0", noted: "Final coating ok" },
  { op: "OP-5800", dept: "QC", desc: "Package QC", machine: "QC-13", stdTime: "1.5", noted: "Package inspected" },
  { op: "OP-6000", dept: "TA", desc: "Final Testing", machine: "TA-02", stdTime: "6.0", noted: "Final test running" },
  { op: "OP-6500", dept: "QC", desc: "Test QC", machine: "QC-14", stdTime: "2.0", noted: "Test QC passed" },
  { op: "OP-6700", dept: "TA", desc: "Retesting", machine: "TA-03", stdTime: "4.0", noted: "Retest completed" },
  { op: "OP-6800", dept: "OSP", desc: "OSP Packaging", machine: "OSP-05", stdTime: "3.0", noted: "Packaging done" },
  { op: "OP-9500", dept: "QC", desc: "Final QC Approval", machine: "QC-15", stdTime: "2.0", noted: "Final QC approved" },
  { op: "OP-9900", dept: "WHS", desc: "Warehouse Storage", machine: "WHS-01", stdTime: "1.0", noted: "Stored in warehouse" },
];

// Generate timeline berdasarkan current operation
const generateTimeline = (currentOp) => {
  const currentIndex = allOperations.findIndex(op => op.op === currentOp);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  
  return allOperations.map((op, index) => {
    let state = "waiting";
    if (index < safeIndex) state = "completed";
    else if (index === safeIndex) state = "current";
    
    return {
      dept: op.dept,
      state: state,
      detail: {
        operation: op.op,
        description: op.desc,
        machine: op.machine,
        stdTime: op.stdTime,
        noted: op.noted,
        status: state === "completed" ? "Completed" : 
                state === "current" ? "In Progress" : "Waiting",
        engineer: state === "completed" ? "Aliya Kamila" : 
                   state === "current" ? "Current User" : "-",
        date: state === "completed" ? "12 Jul 2026" : 
              state === "current" ? "13 Jul 2026" : "-",
        remark: state === "completed" ? "Operation completed successfully" : 
                state === "current" ? "Operation in progress" : "Pending"
      }
    };
  });
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
    currentOperation: "OP-100",
    currentDepartment: "WELD",
    operationDetail: {
      operation: "OP-100",
      description: "Torch Cut Bevel Pipe",
      department: "WELD",
      machine: "WELD-01",
      stdTime: "3.0",
      noted: "In progress - Welding",
      scheduled: "12 Jul",
      due: "13 Jul",
    },
    workInstructions: [
      { id: 1, text: "Torch Cut Bevel Pipe", checked: true },
      { id: 2, text: "WS Inspect", checked: true },
      { id: 3, text: "Follow Drawing H443737", checked: false },
      { id: 4, text: "Verify Material", checked: false },
    ],
    timeline: generateTimeline("OP-100"),
  },
  {
    id: "669",
    woNumber: "WO-669",
    salesOrder: "SO-230046",
    customer: "ExxonMobil",
    partNumber: "PN-PUMP-6IN",
    description: "Centrifugal Pump Assembly",
    revision: "Rev B",
    quantity: 12,
    dueDate: "20 Jul 2026",
    status: "RUNNING",
    progress: 60,
    priority: "High",
    currentOperation: "OP-500",
    currentDepartment: "TA",
    operationDetail: {
      operation: "OP-500",
      description: "Test Pump Performance",
      department: "TA",
      machine: "TA-01",
      stdTime: "4.0",
      noted: "Test running",
      scheduled: "15 Jul",
      due: "20 Jul",
    },
    workInstructions: [
      { id: 1, text: "Install pump components", checked: true },
      { id: 2, text: "Align shaft", checked: true },
      { id: 3, text: "Test run", checked: false },
      { id: 4, text: "Final inspection", checked: false },
    ],
    timeline: generateTimeline("OP-500"),
  },
  {
    id: "670",
    woNumber: "WO-670",
    salesOrder: "SO-230047",
    customer: "Pertamina",
    partNumber: "PN-COMP-12IN",
    description: "Compressor Housing Assembly",
    revision: "Rev A",
    quantity: 8,
    dueDate: "25 Jul 2026",
    status: "AWAITING",
    progress: 30,
    priority: "Normal",
    currentOperation: "OP-200",
    currentDepartment: "QC",
    operationDetail: {
      operation: "OP-200",
      description: "Quality Inspection",
      department: "QC",
      machine: "QC-01",
      stdTime: "1.5",
      noted: "Pending inspection",
      scheduled: "18 Jul",
      due: "25 Jul",
    },
    workInstructions: [
      { id: 1, text: "Visual inspection", checked: true },
      { id: 2, text: "Dimensional check", checked: false },
      { id: 3, text: "Material verification", checked: false },
    ],
    timeline: generateTimeline("OP-200"),
  },
  {
    id: "671",
    woNumber: "WO-671",
    salesOrder: "SO-230048",
    customer: "TotalEnergies",
    partNumber: "PN-VALVE-10IN",
    description: "Gate Valve Assembly",
    revision: "Rev D",
    quantity: 16,
    dueDate: "30 Jul 2026",
    status: "REVIEW",
    progress: 85,
    priority: "High",
    currentOperation: "OP-1800",
    currentDepartment: "OSP",
    operationDetail: {
      operation: "OP-1800",
      description: "Final Assembly & Coating",
      department: "OSP",
      machine: "OSP-01",
      stdTime: "6.0",
      noted: "Coating applied",
      scheduled: "28 Jul",
      due: "30 Jul",
    },
    workInstructions: [
      { id: 1, text: "Assembly components", checked: true },
      { id: 2, text: "Apply coating", checked: true },
      { id: 3, text: "Final inspection", checked: true },
      { id: 4, text: "Packaging", checked: false },
    ],
    timeline: generateTimeline("OP-1800"),
  },
  {
    id: "672",
    woNumber: "WO-672",
    salesOrder: "SO-230049",
    customer: "BP",
    partNumber: "PN-TURBINE-24",
    description: "Turbine Blade Assembly",
    revision: "Rev E",
    quantity: 32,
    dueDate: "05 Aug 2026",
    status: "RUNNING",
    progress: 20,
    priority: "Normal",
    currentOperation: "OP-5",
    currentDepartment: "ME",
    operationDetail: {
      operation: "OP-5",
      description: "Initial Machining",
      department: "ME",
      machine: "CNC-01",
      stdTime: "2.5",
      noted: "OK - Setup completed",
      scheduled: "01 Aug",
      due: "05 Aug",
    },
    workInstructions: [
      { id: 1, text: "Setup machine", checked: true },
      { id: 2, text: "Rough cut", checked: false },
      { id: 3, text: "Finish cut", checked: false },
    ],
    timeline: generateTimeline("OP-5"),
  },
  {
    id: "673",
    woNumber: "WO-673",
    salesOrder: "SO-230050",
    customer: "Shell",
    partNumber: "PN-HEAT-36",
    description: "Heat Exchanger Assembly",
    revision: "Rev A",
    quantity: 6,
    dueDate: "10 Aug 2026",
    status: "AWAITING",
    progress: 10,
    priority: "High",
    currentOperation: "OP-9900",
    currentDepartment: "WHS",
    operationDetail: {
      operation: "OP-9900",
      description: "Warehouse Storage",
      department: "WHS",
      machine: "WHS-01",
      stdTime: "1.0",
      noted: "Stored in warehouse",
      scheduled: "08 Aug",
      due: "10 Aug",
    },
    workInstructions: [
      { id: 1, text: "Inspect storage area", checked: false },
      { id: 2, text: "Prepare packaging", checked: false },
    ],
    timeline: generateTimeline("OP-9900"),
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
          
          <div className="wo-popup-info-row">
            <div className="wo-popup-info-item">
              <span className="wo-popup-info-label">Description</span>
              <span className="wo-popup-info-value">{detail.description}</span>
            </div>
            <div className="wo-popup-info-item">
              <span className="wo-popup-info-label">Machine</span>
              <span className="wo-popup-info-value">{detail.machine}</span>
            </div>
            <div className="wo-popup-info-item">
              <span className="wo-popup-info-label">Std Time</span>
              <span className="wo-popup-info-value">{detail.stdTime} hrs</span>
            </div>
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

          {/* Noted - Khusus dari masing-masing department */}
          <div className="wo-popup-noted">
            <ClipboardList size={14} className="wo-popup-noted-icon" />
            <div>
              <span className="wo-popup-noted-label">Noted</span>
              <span className="wo-popup-noted-value">{detail.noted || "-"}</span>
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
                <div className="wo-hero-stat-value">{wo.currentOperation}</div>
                <div className="wo-hero-stat-label">Current Op</div>
              </div>
              <div className="wo-hero-stat-divider"></div>
              <div className="wo-hero-stat">
                <div className="wo-hero-stat-value">{progressPercent}%</div>
                <div className="wo-hero-stat-label">Progress</div>
              </div>
            </div>
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

            {/* Current Operation */}
            <div className="wo-card">
              <div className="wo-card-header">
                <div className="wo-card-title">
                  <Zap size={18} className="wo-card-icon" />
                  <h3>Current Operation</h3>
                </div>
                <span className="wo-card-badge active">Active</span>
              </div>
              <div className="wo-card-body">
                <div className="wo-current-op-grid">
                  <div className="wo-current-op-item">
                    <span className="wo-current-op-label">Operation No</span>
                    <span className="wo-current-op-value">{wo.operationDetail.operation}</span>
                  </div>
                  <div className="wo-current-op-item">
                    <span className="wo-current-op-label">Description</span>
                    <span className="wo-current-op-value">{wo.operationDetail.description}</span>
                  </div>
                  <div className="wo-current-op-item">
                    <span className="wo-current-op-label">Department</span>
                    <span className="wo-current-op-value">{wo.operationDetail.department}</span>
                  </div>
                  <div className="wo-current-op-item">
                    <span className="wo-current-op-label">Machine / Code</span>
                    <span className="wo-current-op-value">{wo.operationDetail.machine}</span>
                  </div>
                  <div className="wo-current-op-item">
                    <span className="wo-current-op-label">Std Time</span>
                    <span className="wo-current-op-value">{wo.operationDetail.stdTime} hrs</span>
                  </div>
                  <div className="wo-current-op-item">
                    <span className="wo-current-op-label">Status</span>
                    <span className="wo-current-op-value">
                      <span className="wo-status-active">In Progress</span>
                    </span>
                  </div>
                  <div className="wo-current-op-item full">
                    <span className="wo-current-op-label">Schedule</span>
                    <span className="wo-current-op-value">
                      <CalendarDays size={14} className="inline-icon" />
                      {wo.operationDetail.scheduled} - {wo.operationDetail.due}
                    </span>
                  </div>
                  <div className="wo-current-op-item full">
                    <span className="wo-current-op-label">Noted</span>
                    <span className="wo-current-op-value">{wo.operationDetail.noted || "-"}</span>
                  </div>
                </div>

                <div className="wo-divider"></div>

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

          {/* Right Column - Timeline with Scroll */}
          <div className="wo-main-right">
            <div className="wo-card timeline-card">
              <div className="wo-card-header">
                <div className="wo-card-title">
                  <Layers size={18} className="wo-card-icon" />
                  <h3>Operation Timeline</h3>
                </div>
                <span className="wo-card-badge">{completedCount}/{totalCount}</span>
              </div>
              <div className="wo-card-body wo-timeline-scroll">
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