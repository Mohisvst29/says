'use client';

import { useState, useEffect } from 'react';
import AdminShell from '@/components/AdminShell';

const emptyCar = {
  title: '',
  year: '2025',
  subtitle: '',
  category: 'sedan',
  price: '',
  horsepower: '',
  fuelType: 'بنزين',
  transmission: 'أوتوماتيك',
  badge: 'جديدة',
  image: '/images/car-sedan.png',
  featured: false,
  isActive: true,
  description: '',
};

const categoryLabels = {
  sedan: 'سيدان',
  suv: 'دفع رباعي',
  sports: 'رياضية',
  electric: 'كهربائية',
};

export default function AdminCarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [formData, setFormData] = useState(emptyCar);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await fetch('/api/cars');
      const data = await res.json();
      setCars(Array.isArray(data) ? data : []);
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
    setEditingCar(null);
    setFormData(emptyCar);
    setShowModal(true);
  };

  const openEditModal = (car) => {
    setEditingCar(car);
    setFormData({
      title: car.title,
      year: car.year,
      subtitle: car.subtitle,
      category: car.category,
      price: car.price,
      horsepower: car.horsepower,
      fuelType: car.fuelType,
      transmission: car.transmission,
      badge: car.badge,
      image: car.image,
      featured: car.featured,
      isActive: car.isActive,
      description: car.description || '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editingCar ? `/api/cars/${editingCar._id}` : '/api/cars';
      const method = editingCar ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, price: Number(formData.price) }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'حدث خطأ');
      }

      showToast(editingCar ? 'تم تحديث السيارة بنجاح' : 'تم إضافة السيارة بنجاح');
      setShowModal(false);
      fetchCars();
    } catch (error) {
      showToast(error.message, true);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('فشل رفع الملف');
      
      const data = await res.json();
      updateForm('image', data.url);
      showToast('تم رفع الصورة بنجاح');
    } catch (error) {
      showToast(error.message, true);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/cars/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('فشل الحذف');
      showToast('تم حذف السيارة بنجاح');
      setDeleteConfirm(null);
      fetchCars();
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
          <h1 className="admin-header-title">إدارة السيارات</h1>
          <p className="admin-header-subtitle">إضافة وتعديل وحذف السيارات في المعرض</p>
        </div>
        <button className="admin-add-btn" onClick={openAddModal}>
          <i className="fas fa-plus"></i>
          إضافة سيارة
        </button>
      </div>

      {/* Cars Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>الصورة</th>
              <th>الاسم</th>
              <th>الفئة</th>
              <th>السنة</th>
              <th>السعر</th>
              <th>الحالة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {cars.length === 0 ? (
              <tr>
                <td colSpan="7">
                  <div className="admin-empty">
                    <div className="admin-empty-icon"><i className="fas fa-car"></i></div>
                    <div className="admin-empty-text">لا توجد سيارات بعد</div>
                  </div>
                </td>
              </tr>
            ) : (
              cars.map((car) => (
                <tr key={car._id}>
                  <td>
                    <img src={car.image} alt={car.title} className="admin-table-img" />
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {car.title}
                    <br />
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{car.subtitle}</span>
                  </td>
                  <td>{categoryLabels[car.category] || car.category}</td>
                  <td>{car.year}</td>
                  <td style={{ fontFamily: 'var(--font-en)' }}>
                    {new Intl.NumberFormat('en').format(car.price)} ر.س
                  </td>
                  <td>
                    <span className={`admin-badge ${car.isActive ? 'active' : 'inactive'}`}>
                      {car.isActive ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <button className="admin-action-btn edit" title="تعديل" onClick={() => openEditModal(car)}>
                        <i className="fas fa-pen"></i>
                      </button>
                      <button className="admin-action-btn delete" title="حذف" onClick={() => setDeleteConfirm(car)}>
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingCar ? 'تعديل السيارة' : 'إضافة سيارة جديدة'}
              </h3>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">اسم السيارة *</label>
                  <input
                    className="admin-form-input rtl-input"
                    value={formData.title}
                    onChange={(e) => updateForm('title', e.target.value)}
                    placeholder="مثال: مرسيدس S-Class"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">سنة الصنع *</label>
                  <input
                    className="admin-form-input"
                    value={formData.year}
                    onChange={(e) => updateForm('year', e.target.value)}
                    placeholder="2025"
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">الوصف الفرعي</label>
                  <input
                    className="admin-form-input rtl-input"
                    value={formData.subtitle}
                    onChange={(e) => updateForm('subtitle', e.target.value)}
                    placeholder="مثال: سيدان فاخرة"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">الفئة *</label>
                  <select
                    className="admin-form-select"
                    value={formData.category}
                    onChange={(e) => updateForm('category', e.target.value)}
                  >
                    <option value="sedan">سيدان</option>
                    <option value="suv">دفع رباعي</option>
                    <option value="sports">رياضية</option>
                    <option value="electric">كهربائية</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">السعر (ر.س) *</label>
                  <input
                    type="number"
                    className="admin-form-input"
                    value={formData.price}
                    onChange={(e) => updateForm('price', e.target.value)}
                    placeholder="850000"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">القوة (حصان)</label>
                  <input
                    className="admin-form-input rtl-input"
                    value={formData.horsepower}
                    onChange={(e) => updateForm('horsepower', e.target.value)}
                    placeholder="496 حصان"
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">نوع الوقود</label>
                  <select
                    className="admin-form-select"
                    value={formData.fuelType}
                    onChange={(e) => updateForm('fuelType', e.target.value)}
                  >
                    <option value="بنزين">بنزين</option>
                    <option value="ديزل">ديزل</option>
                    <option value="كهربائي">كهربائي</option>
                    <option value="هجين">هجين</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">ناقل الحركة</label>
                  <select
                    className="admin-form-select"
                    value={formData.transmission}
                    onChange={(e) => updateForm('transmission', e.target.value)}
                  >
                    <option value="أوتوماتيك">أوتوماتيك</option>
                    <option value="يدوي">يدوي</option>
                    <option value="PDK">PDK</option>
                    <option value="CVT">CVT</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">الشارة</label>
                  <input
                    className="admin-form-input rtl-input"
                    value={formData.badge}
                    onChange={(e) => updateForm('badge', e.target.value)}
                    placeholder="جديدة"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">صورة السيارة (رفع من الجهاز)</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                      disabled={uploadingImage}
                    />
                    {uploadingImage && <i className="fas fa-spinner fa-spin" style={{ color: 'var(--color-primary)' }}></i>}
                  </div>
                  {formData.image && (
                    <div style={{ marginTop: '10px' }}>
                      <img src={formData.image} alt="Preview" style={{ width: '100px', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">الوصف</label>
                <textarea
                  className="admin-form-textarea"
                  value={formData.description}
                  onChange={(e) => updateForm('description', e.target.value)}
                  placeholder="وصف تفصيلي للسيارة..."
                ></textarea>
              </div>

              <div className="admin-form-row">
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
                <div className="admin-form-group">
                  <label className="admin-checkbox-group">
                    <input
                      type="checkbox"
                      className="admin-checkbox"
                      checked={formData.featured}
                      onChange={(e) => updateForm('featured', e.target.checked)}
                    />
                    <span>سيارة مميزة</span>
                  </label>
                </div>
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
              هل أنت متأكد من حذف <strong>{deleteConfirm.title}</strong>؟ لا يمكن التراجع عن هذا الإجراء.
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

      {/* Toast */}
      {toast && (
        <div className={`admin-toast ${toast.isError ? 'error' : ''}`}>
          <i className={toast.isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle'}></i>
          {toast.message}
        </div>
      )}
    </AdminShell>
  );
}
