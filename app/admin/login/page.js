'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="login-logo">
          <div className="login-logo-icon">
            <i className="fas fa-car"></i>
          </div>
          <h1 className="login-title">سيارتي</h1>
          <p className="login-subtitle">لوحة تحكم المدير</p>
        </div>

        {error && (
          <div className="admin-login-error">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-form-label">البريد الإلكتروني</label>
            <input
              type="email"
              className="admin-form-input"
              placeholder="admin@sayarati.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">كلمة المرور</label>
            <input
              type="password"
              className="admin-form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? (
              <><i className="fas fa-spinner fa-spin"></i> جاري الدخول...</>
            ) : (
              <><i className="fas fa-sign-in-alt"></i> تسجيل الدخول</>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a href="/" style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
            <i className="fas fa-arrow-right"></i> العودة للموقع
          </a>
        </div>
      </div>
    </div>
  );
}
