'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminShell from '@/components/AdminShell';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ cars: 0, testimonials: 0, activeCars: 0, categories: 0 });
  const [recentCars, setRecentCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [carsRes, testimonialsRes] = await Promise.all([
        fetch('/api/cars'),
        fetch('/api/testimonials'),
      ]);

      const cars = await carsRes.json();
      const testimonials = await testimonialsRes.json();

      const activeCars = Array.isArray(cars) ? cars.filter(c => c.isActive).length : 0;
      const categories = Array.isArray(cars) ? new Set(cars.map(c => c.category)).size : 0;

      setStats({
        cars: Array.isArray(cars) ? cars.length : 0,
        testimonials: Array.isArray(testimonials) ? testimonials.length : 0,
        activeCars,
        categories,
      });

      setRecentCars(Array.isArray(cars) ? cars.slice(0, 5) : []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminShell>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--color-primary)' }}></i>
          <p style={{ color: 'var(--color-text-muted)', marginTop: 16 }}>جاري التحميل...</p>
        </div>
      ) : (
        <>
          <div className="admin-header">
            <div>
              <h1 className="admin-header-title">لوحة التحكم</h1>
              <p className="admin-header-subtitle">مرحباً بك في لوحة تحكم سيارتي</p>
            </div>
            <a href="/" target="_blank" className="admin-view-site">
              <i className="fas fa-external-link-alt"></i>
              عرض الموقع
            </a>
          </div>

          {/* Stats */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="stat-icon"><i className="fas fa-car"></i></div>
              <div className="stat-value">{stats.cars}</div>
              <div className="stat-label">إجمالي السيارات</div>
            </div>
            <div className="admin-stat-card">
              <div className="stat-icon"><i className="fas fa-check-circle"></i></div>
              <div className="stat-value">{stats.activeCars}</div>
              <div className="stat-label">سيارات نشطة</div>
            </div>
            <div className="admin-stat-card">
              <div className="stat-icon"><i className="fas fa-comments"></i></div>
              <div className="stat-value">{stats.testimonials}</div>
              <div className="stat-label">آراء العملاء</div>
            </div>
            <div className="admin-stat-card">
              <div className="stat-icon"><i className="fas fa-tags"></i></div>
              <div className="stat-value">{stats.categories}</div>
              <div className="stat-label">الفئات</div>
            </div>
          </div>

          {/* Recent Cars */}
          <div className="admin-table-wrapper">
            <div className="admin-table-header">
              <h3 className="admin-table-title">آخر السيارات المضافة</h3>
              <Link href="/admin/cars" className="admin-add-btn">
                عرض الكل
                <i className="fas fa-arrow-left"></i>
              </Link>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>الصورة</th>
                  <th>الاسم</th>
                  <th>الفئة</th>
                  <th>السعر</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {recentCars.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      <div className="admin-empty">
                        <div className="admin-empty-icon"><i className="fas fa-car"></i></div>
                        <div className="admin-empty-text">لا توجد سيارات بعد</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  recentCars.map((car) => (
                    <tr key={car._id}>
                      <td>
                        <img src={car.image} alt={car.title} className="admin-table-img" />
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{car.title}</td>
                      <td>
                        {car.category === 'sedan' ? 'سيدان' : car.category === 'suv' ? 'دفع رباعي' : car.category === 'sports' ? 'رياضية' : 'كهربائية'}
                      </td>
                      <td style={{ fontFamily: 'var(--font-en)' }}>
                        {new Intl.NumberFormat('en').format(car.price)} ر.س
                      </td>
                      <td>
                        <span className={`admin-badge ${car.isActive ? 'active' : 'inactive'}`}>
                          {car.isActive ? 'نشط' : 'غير نشط'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminShell>
  );
}
