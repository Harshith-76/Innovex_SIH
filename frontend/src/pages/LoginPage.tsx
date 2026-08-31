import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  BarChart2,
  Users,
  Landmark,
  User,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export interface LoginPageProps {
  onLoginSuccess: (username: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isSuccess) return;

    const newErrors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      newErrors.username = 'Email or username is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setIsSuccess(true);

    setTimeout(() => {
      onLoginSuccess(username.trim());
    }, 800);
  };

  const handleSSOLogin = () => {
    alert('Government SSO is not yet configured.');
  };

  return (
    <div className="lp2-container">
      {/* Dark green gradient overlay */}
      <div className="lp2-overlay" />

      {/* Main content wrapper */}
      <div className="lp2-content-wrapper">
        {/* Left Side: Text over photo */}
        <div className="lp2-left-section">
          <div className="lp2-left-top">
            <h1 className="lp2-title">
              Land Acquisition /<br />
              Management System
            </h1>
            <p className="lp2-tagline">
              Digitizing land records. Simplifying acquisition. Building a transparent tomorrow.
            </p>

            {/* Frosted glass pills */}
            <div className="lp2-pills-row">
              <div className="lp2-pill">
                <ShieldCheck size={16} className="lp2-pill-icon" />
                <span>Secure</span>
              </div>
              <div className="lp2-pill">
                <FileText size={16} className="lp2-pill-icon" />
                <span>Transparent</span>
              </div>
              <div className="lp2-pill">
                <BarChart2 size={16} className="lp2-pill-icon" />
                <span>Efficient</span>
              </div>
              <div className="lp2-pill">
                <Users size={16} className="lp2-pill-icon" />
                <span>Accountable</span>
              </div>
            </div>
          </div>

          {/* Bottom-left quote / badge */}
          <div className="lp2-badge-bottom">
            <Landmark size={18} className="lp2-badge-icon" />
            <span>Managing land. Empowering progress.</span>
          </div>
        </div>

        {/* Right Side: Floating white card */}
        <div className="lp2-right-section">
          <div className="lp2-card">
            {/* Inline SVG Illustration: House on Green Hills (86px diameter) */}
            <div className="lp2-illustration-container">
              <svg
                width="86"
                height="86"
                viewBox="0 0 86 86"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="lp2-illustration-svg"
              >
                <defs>
                  <linearGradient id="lp2-sky-grad" x1="0" y1="0" x2="0" y2="86" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#ecfdf5" />
                    <stop offset="100%" stopColor="#d1fae5" />
                  </linearGradient>
                  <linearGradient id="lp2-hill-grad1" x1="0" y1="40" x2="86" y2="86" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="lp2-hill-grad2" x1="0" y1="52" x2="86" y2="86" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                  <linearGradient id="lp2-roof-grad" x1="28" y1="36" x2="58" y2="48" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#065f46" />
                    <stop offset="100%" stopColor="#044e3b" />
                  </linearGradient>
                  <clipPath id="lp2-circle-clip">
                    <circle cx="43" cy="43" r="43" />
                  </clipPath>
                </defs>

                {/* Circle background */}
                <circle cx="43" cy="43" r="43" fill="url(#lp2-sky-grad)" />

                {/* Clipped Scene */}
                <g clipPath="url(#lp2-circle-clip)">
                  {/* Sun / Glow */}
                  <circle cx="64" cy="22" r="10" fill="#fef08a" opacity="0.85" />
                  <circle cx="64" cy="22" r="6" fill="#facc15" />

                  {/* Gentle Clouds */}
                  <path
                    d="M18 24 C18 21.5 20.5 19.5 23 19.5 C25 19.5 26.8 20.5 27.5 22.2 C29.2 22.2 31 23.2 31 25 C31 26.8 29.5 28 27.5 28 L19 28 C17.5 28 16 26.8 16 25.5 C16 24.5 17 24 18 24 Z"
                    fill="#ffffff"
                    opacity="0.85"
                  />

                  {/* Distant Hills */}
                  <path
                    d="M-10 65 Q 26 44, 56 58 T 96 52 L 96 90 L -10 90 Z"
                    fill="url(#lp2-hill-grad1)"
                    opacity="0.9"
                  />

                  {/* Foreground Rolling Hills */}
                  <path
                    d="M-10 74 Q 30 52, 60 63 T 96 66 L 96 90 L -10 90 Z"
                    fill="url(#lp2-hill-grad2)"
                  />
                  <path
                    d="M20 90 Q 52 68, 96 74 L 96 90 Z"
                    fill="#065f46"
                    opacity="0.35"
                  />

                  {/* Trees */}
                  <circle cx="21" cy="54" r="5" fill="#047857" />
                  <rect x="20" y="57" width="2" height="5" fill="#78350f" />

                  <circle cx="67" cy="56" r="6" fill="#065f46" />
                  <rect x="66" y="60" width="2" height="5" fill="#78350f" />

                  {/* House / Government Office */}
                  <rect
                    x="33"
                    y="44"
                    width="20"
                    height="18"
                    rx="1.5"
                    fill="#ffffff"
                    stroke="#cbd5e1"
                    strokeWidth="0.75"
                  />
                  {/* Door */}
                  <rect x="40" y="52" width="6" height="10" rx="1" fill="#047857" />
                  {/* Windows */}
                  <rect
                    x="35.5"
                    y="47"
                    width="3.5"
                    height="3.5"
                    rx="0.5"
                    fill="#bae6fd"
                    stroke="#94a3b8"
                    strokeWidth="0.5"
                  />
                  <rect
                    x="47"
                    y="47"
                    width="3.5"
                    height="3.5"
                    rx="0.5"
                    fill="#bae6fd"
                    stroke="#94a3b8"
                    strokeWidth="0.5"
                  />
                  {/* Triangular Roof */}
                  <polygon points="43,32 28,45 58,45" fill="url(#lp2-roof-grad)" />
                  {/* Flag / Chimney Accent */}
                  <rect x="49" y="34" width="2" height="6" fill="#b91c1c" />
                  <polygon points="49,34 53,36 49,38" fill="#dc2626" />
                </g>

                {/* Border ring */}
                <circle cx="43" cy="43" r="42" stroke="#a7f3d0" strokeWidth="2" fill="none" opacity="0.6" />
              </svg>
            </div>

            {/* Header Text */}
            <h2 className="lp2-heading">Welcome Back</h2>
            <p className="lp2-subtitle">Sign in to your LAMS account</p>

            {/* Success Banner */}
            {isSuccess && (
              <div className="lp2-success-banner" role="alert">
                <CheckCircle2 size={16} className="lp2-success-icon" />
                <span>Authentication successful! Redirecting...</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="lp2-form" noValidate>
              {/* Username / Email Field */}
              <div className="lp2-form-group">
                <label htmlFor="lp2-username" className="lp2-label">
                  Email or Username
                </label>
                <div className="lp2-input-wrapper">
                  <User size={16} className="lp2-input-icon-left" />
                  <input
                    id="lp2-username"
                    type="text"
                    className={`lp2-input ${errors.username ? 'lp2-input-error' : ''}`}
                    placeholder="Enter email or username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (errors.username) {
                        setErrors((prev) => ({ ...prev, username: undefined }));
                      }
                    }}
                    disabled={isSubmitting}
                    autoComplete="username"
                  />
                </div>
                {errors.username && (
                  <span className="lp2-error-text">
                    <AlertCircle size={12} />
                    {errors.username}
                  </span>
                )}
              </div>

              {/* Password Field */}
              <div className="lp2-form-group">
                <label htmlFor="lp2-password" className="lp2-label">
                  Password
                </label>
                <div className="lp2-input-wrapper">
                  <Lock size={16} className="lp2-input-icon-left" />
                  <input
                    id="lp2-password"
                    type={showPassword ? 'text' : 'password'}
                    className={`lp2-input lp2-input-with-toggle ${errors.password ? 'lp2-input-error' : ''}`}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) {
                        setErrors((prev) => ({ ...prev, password: undefined }));
                      }
                    }}
                    disabled={isSubmitting}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="lp2-input-toggle-right"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="lp2-error-text">
                    <AlertCircle size={12} />
                    {errors.password}
                  </span>
                )}
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="lp2-submit-btn"
                disabled={isSubmitting}
              >
                <Lock size={16} />
                <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
              </button>

              {/* Divider */}
              <div className="lp2-divider">
                <span className="lp2-divider-text">or continue with</span>
              </div>

              {/* SSO Button */}
              <button
                type="button"
                className="lp2-sso-btn"
                onClick={handleSSOLogin}
              >
                <ShieldCheck size={16} className="lp2-sso-icon" />
                <span>Login with Government SSO</span>
              </button>
            </form>

            {/* Footer */}
            <div className="lp2-footer">
              © 2026 LAMS. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
