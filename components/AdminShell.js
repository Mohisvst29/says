'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminShell({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [settings, setSettings] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetch('/api/settings')
        .then(res => res.json())
        .then(data => setSettings(data))
        .catch(console.error);
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="admin-login-page">
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, background: 'var(--gradient-gold)', borderRadius: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#0a0a0f' }}>
            <i className="fas fa-spinner fa-spin"></i>
          </div>
          <p style={{ color: 'var(--color-text-muted)', marginTop: 16 }}>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const navItems = [
    { href: '/admin', icon: 'fas fa-th-large', label: 'لوحة التحكم' },
    { href: '/admin/cars', icon: 'fas fa-car', label: 'السيارات' },
    { href: '/admin/testimonials', icon: 'fas fa-comments', label: 'آراء العملاء' },
    { href: '/admin/settings', icon: 'fas fa-cog', label: 'إعدادات الموقع' },
    { href: '/admin/seo', icon: 'fas fa-search', label: 'إعدادات SEO' },
    { href: '/admin/profile', icon: 'fas fa-user-shield', label: 'إعدادات الحساب' },
  ];

  return (
    <div className="admin-layout">
      {/* Mobile Toggle */}
      <button className="admin-mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <i className={sidebarOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-brand" style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          {settings?.logoImage ? (
            <img src={settings.logoImage} alt="Admin Logo" style={{ height: '40px', objectFit: 'contain' }} />
          ) : (
            <>
              <div className="brand-icon">
                <i className="fas fa-car"></i>
              </div>
              <div className="brand-info">
                <h3>{settings?.siteNameAr || 'سيارتي'}</h3>
                <span>ADMIN PANEL</span>
              </div>
            </>
          )}
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item ${pathname === item.href ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <i className={item.icon}></i>
              {item.label}
            </Link>
          ))}

          <div className="admin-nav-divider"></div>

          <a href="/" className="admin-nav-item" target="_blank">
            <i className="fas fa-external-link-alt"></i>
            عرض الموقع
          </a>

          <button
            className="admin-nav-item admin-nav-logout"
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
          >
            <i className="fas fa-sign-out-alt"></i>
            تسجيل الخروج
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {children}
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 99,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
