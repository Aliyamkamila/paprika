import logo from "../assets/logo.png";

export default function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <div className="left-panel">
        <div className="brand-wrap">
          <div className="logo-box">
            <img src={logo} alt="eWorkOrder Logo" />
          </div>
          <h1>eWorkOrder</h1>
          <p>
            Intelligent Asset Management &amp; Work Execution Platform
            <br />
            by Baker Hughes.
          </p>
        </div>
      </div>

      <div className="right-panel">
        <div className="form-wrap">{children}</div>
      </div>
    </div>
  );
}