'use client';

import { useState } from 'react';
import AdminShell from '@/components/AdminShell';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

export default function AdminProfilePage() {
  const { data: session } = useSession();
  
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    password: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 3000);
  };

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!formData.password) {
      showToast('يجب إدخال كلمة المرور الحالية للحفظ', true);
      return;
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      showToast('كلمتا المرور الجديدتان غير متطابقتين', true);
      return;
    }
    
    setSaving(true);
    
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ غير متوقع');
      }

      showToast('تم تحديث البيانات بنجاح.');
      setFormData(prev => ({ ...prev, password: '', newPassword: '', confirmPassword: '' }));
      
      // If email or password changed, maybe sign out to force re-login
      if (formData.newPassword || formData.email !== session?.user?.email) {
        setTimeout(() => {
          signOut({ callbackUrl: '/admin/login' });
        }, 1500);
      }
      
    } catch (error) {
      showToast(error.message, true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">إعدادات الحساب</h1>
          <p className="admin-header-subtitle">تغيير اسم المستخدم، البريد، وكلمة المرور</p>
        </div>
      </div>

      <div className="admin-settings-section" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form onSubmit={handleSave}>
          
          <div className="admin-form-group">
            <label className="admin-form-label">الاسم</label>
            <input 
              className="admin-form-input rtl-input" 
              value={formData.name} 
              onChange={(e) => updateForm('name', e.target.value)} 
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">البريد الإلكتروني (اسم المستخدم)</label>
            <input 
              type="email"
              className="admin-form-input" 
              value={formData.email} 
              onChange={(e) => updateForm('email', e.target.value)} 
              required
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
          </div>

          <hr style={{ margin: '30px 0', borderColor: 'var(--color-border)' }} />

          <div className="admin-form-group">
            <label className="admin-form-label">كلمة المرور الجديدة (اختياري)</label>
            <input 
              type="password"
              className="admin-form-input" 
              value={formData.newPassword} 
              onChange={(e) => updateForm('newPassword', e.target.value)} 
              placeholder="اترك هذا الحقل فارغاً إذا لم ترغب بالتغيير"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
          </div>

          {formData.newPassword && (
            <div className="admin-form-group">
              <label className="admin-form-label">تأكيد كلمة المرور الجديدة</label>
              <input 
                type="password"
                className="admin-form-input" 
                value={formData.confirmPassword} 
                onChange={(e) => updateForm('confirmPassword', e.target.value)} 
                required
                style={{ direction: 'ltr', textAlign: 'left' }}
              />
            </div>
          )}

          <hr style={{ margin: '30px 0', borderColor: 'var(--color-border)' }} />

          <div className="admin-form-group">
            <label className="admin-form-label" style={{ color: 'var(--color-primary)' }}>كلمة المرور الحالية (مطلوبة لتأكيد التغييرات)</label>
            <input 
              type="password"
              className="admin-form-input" 
              value={formData.password} 
              onChange={(e) => updateForm('password', e.target.value)} 
              required
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
          </div>

          <button type="submit" className="admin-add-btn" disabled={saving} style={{ width: '100%', marginTop: '20px' }}>
            {saving ? <><i className="fas fa-spinner fa-spin"></i> جاري الحفظ...</> : <><i className="fas fa-save"></i> حفظ التغييرات</>}
          </button>
        </form>
      </div>

      {toast && (
        <div className={`admin-toast ${toast.isError ? 'error' : ''}`}>
          <i className={toast.isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle'}></i>
          {toast.message}
        </div>
      )}
    </AdminShell>
  );
}
