'use client';

import { useState, useEffect } from 'react';
import AdminShell from '@/components/AdminShell';

const emptyTestimonial = {
  name: '',
  title: '',
  text: '',
  rating: 5,
  initials: '',
  isActive: true,
};

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(emptyTestimonial);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/testimonials');
      const data = await res.json();
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 3000);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData(emptyTestimonial);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      title: item.title,
      text: item.text,
      rating: item.rating,
      initials: item.initials,
      isActive: item.isActive,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editingItem ? `/api/testimonials/${editingItem._id}` : '/api/testimonials';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'حدث خطأ');
      }

      showToast(editingItem ? 'تم تحديث التقييم بنجاح' : 'تم إضافة التقييم بنجاح');
      setShowModal(false);
      fetchData();
    } catch (error) {
      showToast(error.message, true);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('فشل الحذف');
      showToast('تم حذف التقييم بنجاح');
      setDeleteConfirm(null);
      fetchData();
    } catch (error) {
      showToast(error.message, true);
    }
  };

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <AdminShell>
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--color-primary)' }}></i>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">آراء العملاء</h1>
          <p className="admin-header-subtitle">إدارة تقييمات وآراء العملاء</p>
        </div>
        <button className="admin-add-btn" onClick={openAddModal}>
          <i className="fas fa-plus"></i>
          إضافة تقييم
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>الاسم</th>
              <th>الوصف</th>
              <th>التقييم</th>
              <th>النص</th>
              <th>الحالة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="admin-empty">
                    <div className="admin-empty-icon"><i className="fas fa-comments"></i></div>
                    <div className="admin-empty-text">لا توجد تقييمات بعد</div>
                  </div>
                </td>
              </tr>
            ) : (
              testimonials.map((item) => (
                <tr key={item._id}>
                  <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 40, height: 40,
                        background: 'rgba(200,164,86,0.1)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.8rem', color: 'var(--color-primary)',
                        fontWeight: 700,
                      }}>
                        {item.initials}
                      </div>
                      {item.name}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{item.title}</td>
                  <td>
                    <div style={{ color: '#ffc107', fontSize: '0.85rem' }}>
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={i < Math.floor(item.rating) ? 'fas fa-star' : 'far fa-star'}></i>
                      ))}
                    </div>
                  </td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.text}
                  </td>
                  <td>
                    <span className={`admin-badge ${item.isActive ? 'active' : 'inactive'}`}>
                      {item.isActive ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <button className="admin-action-btn edit" onClick={() => openEditModal(item)}>
                        <i className="fas fa-pen"></i>
                      </button>
                      <button className="admin-action-btn delete" onClick={() => setDeleteConfirm(item)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingItem ? 'تعديل التقييم' : 'إضافة تقييم جديد'}
              </h3>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">اسم العميل *</label>
                  <input
                    className="admin-form-input rtl-input"
                    value={formData.name}
                    onChange={(e) => updateForm('name', e.target.value)}
                    placeholder="أحمد محمد"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">الأحرف الأولى</label>
                  <input
                    className="admin-form-input rtl-input"
                    value={formData.initials}
                    onChange={(e) => updateForm('initials', e.target.value)}
                    placeholder="أ م"
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">المسمى الوظيفي والمدينة</label>
                  <input
                    className="admin-form-input rtl-input"
                    value={formData.title}
                    onChange={(e) => updateForm('title', e.target.value)}
                    placeholder="رجل أعمال — الرياض"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">التقييم</label>
                  <select
                    className="admin-form-select"
                    value={formData.rating}
                    onChange={(e) => updateForm('rating', Number(e.target.value))}
                  >
                    <option value={5}>5 نجوم</option>
                    <option value={4.5}>4.5 نجوم</option>
                    <option value={4}>4 نجوم</option>
                    <option value={3.5}>3.5 نجوم</option>
                    <option value={3}>3 نجوم</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">نص التقييم *</label>
                <textarea
                  className="admin-form-textarea"
                  value={formData.text}
                  onChange={(e) => updateForm('text', e.target.value)}
                  placeholder="رأي العميل..."
                ></textarea>
              </div>

              <div className="admin-form-group">
                <label className="admin-checkbox-group">
                  <input
                    type="checkbox"
                    className="admin-checkbox"
                    checked={formData.isActive}
                    onChange={(e) => updateForm('isActive', e.target.checked)}
                  />
                  <span>نشط (ظاهر في الموقع)</span>
                </label>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button className="btn-save" onClick={handleSave} disabled={saving}>
                {saving ? <><i className="fas fa-spinner fa-spin"></i> جاري الحفظ...</> : <><i className="fas fa-check"></i> حفظ</>}
              </button>
              <button className="btn-cancel" onClick={() => setShowModal(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="admin-confirm-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-confirm-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-confirm-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h3 className="admin-confirm-title">تأكيد الحذف</h3>
            <p className="admin-confirm-text">
              هل أنت متأكد من حذف تقييم <strong>{deleteConfirm.name}</strong>؟
            </p>
            <div className="admin-confirm-actions">
              <button className="btn-danger" onClick={() => handleDelete(deleteConfirm._id)}>
                <i className="fas fa-trash"></i> نعم، احذف
              </button>
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`admin-toast ${toast.isError ? 'error' : ''}`}>
          <i className={toast.isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle'}></i>
          {toast.message}
        </div>
      )}
    </AdminShell>
  );
}
