'use client';

import { useState, useEffect } from 'react';
import AdminShell from '@/components/AdminShell';

export default function AdminSEOPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
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

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error('فشل الحفظ');
      showToast('تم حفظ إعدادات SEO بنجاح');
    } catch (error) {
      showToast(error.message, true);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
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
      updateField('ogImage', data.url);
      showToast('تم رفع الصورة بنجاح');
    } catch (error) {
      showToast(error.message, true);
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading || !settings) {
    return (
      <AdminShell>
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--color-primary)' }}></i>
        </div>
      </AdminShell>
    );
  }

  const titleLength = (settings.seoTitle || '').length;
  const descLength = (settings.seoDescription || '').length;

  return (
    <AdminShell>
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">إعدادات SEO</h1>
          <p className="admin-header-subtitle">تحسين ظهور الموقع في محركات البحث</p>
        </div>
        <button className="admin-add-btn" onClick={handleSave} disabled={saving}>
          {saving ? <><i className="fas fa-spinner fa-spin"></i> جاري الحفظ...</> : <><i className="fas fa-save"></i> حفظ التغييرات</>}
        </button>
      </div>

      {/* SEO Preview */}
      <div className="admin-settings-section">
        <h3 className="admin-settings-title">
          <i className="fas fa-eye"></i> معاينة نتائج البحث
        </h3>
        <div style={{
          background: '#fff',
          padding: 20,
          borderRadius: 12,
          maxWidth: 600,
          direction: 'ltr',
        }}>
          <div style={{ fontSize: '1.15rem', color: '#1a0dab', fontFamily: 'Arial, sans-serif', marginBottom: 4, lineHeight: 1.4 }}>
            {settings.seoTitle || 'عنوان الصفحة'}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#006621', fontFamily: 'Arial, sans-serif', marginBottom: 4 }}>
            https://sayarati.com
          </div>
          <div style={{ fontSize: '0.9rem', color: '#545454', fontFamily: 'Arial, sans-serif', lineHeight: 1.5 }}>
            {settings.seoDescription || 'وصف الصفحة...'}
          </div>
        </div>
      </div>

      {/* Meta Tags */}
      <div className="admin-settings-section">
        <h3 className="admin-settings-title">
          <i className="fas fa-code"></i> Meta Tags
        </h3>

        <div className="admin-form-group">
          <label className="admin-form-label">
            عنوان الصفحة (Title Tag)
            <span style={{
              float: 'left',
              fontSize: '0.8rem',
              color: titleLength > 60 ? '#e74c3c' : titleLength > 50 ? '#f39c12' : '#2ecc71',
            }}>
              {titleLength}/60
            </span>
          </label>
          <input
            className="admin-form-input rtl-input"
            value={settings.seoTitle}
            onChange={(e) => updateField('seoTitle', e.target.value)}
            placeholder="سيارتي | أفخم معرض سيارات في المملكة"
          />
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 6 }}>
            يُفضل أن يكون العنوان بين 50-60 حرف لأفضل ظهور في نتائج البحث
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">
            الوصف (Meta Description)
            <span style={{
              float: 'left',
              fontSize: '0.8rem',
              color: descLength > 160 ? '#e74c3c' : descLength > 150 ? '#f39c12' : '#2ecc71',
            }}>
              {descLength}/160
            </span>
          </label>
          <textarea
            className="admin-form-textarea"
            value={settings.seoDescription}
            onChange={(e) => updateField('seoDescription', e.target.value)}
            placeholder="وصف الموقع لمحركات البحث..."
            style={{ minHeight: 100 }}
          />
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 6 }}>
            يُفضل أن يكون الوصف بين 120-160 حرف. يظهر هذا النص تحت العنوان في نتائج البحث
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">الكلمات المفتاحية (Keywords)</label>
          <textarea
            className="admin-form-textarea"
            value={settings.seoKeywords}
            onChange={(e) => updateField('seoKeywords', e.target.value)}
            placeholder="سيارات, معرض سيارات, سيارات فاخرة..."
            style={{ minHeight: 80 }}
          />
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 6 }}>
            أضف الكلمات المفتاحية مفصولة بفواصل
          </div>
        </div>
      </div>

      {/* Open Graph */}
      <div className="admin-settings-section">
        <h3 className="admin-settings-title">
          <i className="fas fa-share-alt"></i> Open Graph (مشاركة على وسائل التواصل)
        </h3>

        <div className="admin-form-group">
          <label className="admin-form-label">صورة المشاركة (OG Image)</label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid var(--color-border)' }}
              disabled={uploadingImage}
            />
            {uploadingImage && <i className="fas fa-spinner fa-spin" style={{ color: 'var(--color-primary)' }}></i>}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 6 }}>
            الصورة التي تظهر عند مشاركة الموقع على فيسبوك وتويتر. يُفضل أن تكون 1200×630 بكسل
          </div>
        </div>

        {settings.ogImage && (
          <div style={{ marginTop: 16 }}>
            <label className="admin-form-label">معاينة الصورة</label>
            <div style={{
              width: 300,
              height: 157,
              borderRadius: 12,
              overflow: 'hidden',
              border: '1px solid var(--color-border-light)',
            }}>
              <img
                src={settings.ogImage}
                alt="OG Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* SEO Tips */}
      <div className="admin-settings-section">
        <h3 className="admin-settings-title">
          <i className="fas fa-lightbulb"></i> نصائح SEO
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { icon: titleLength >= 30 && titleLength <= 60 ? 'fa-check-circle' : 'fa-times-circle', color: titleLength >= 30 && titleLength <= 60 ? '#2ecc71' : '#e74c3c', text: 'عنوان الصفحة بين 30-60 حرف' },
            { icon: descLength >= 120 && descLength <= 160 ? 'fa-check-circle' : 'fa-times-circle', color: descLength >= 120 && descLength <= 160 ? '#2ecc71' : '#e74c3c', text: 'الوصف بين 120-160 حرف' },
            { icon: settings.seoKeywords && settings.seoKeywords.length > 10 ? 'fa-check-circle' : 'fa-times-circle', color: settings.seoKeywords && settings.seoKeywords.length > 10 ? '#2ecc71' : '#e74c3c', text: 'الكلمات المفتاحية محددة' },
            { icon: settings.ogImage ? 'fa-check-circle' : 'fa-times-circle', color: settings.ogImage ? '#2ecc71' : '#e74c3c', text: 'صورة المشاركة محددة' },
          ].map((tip, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <i className={`fas ${tip.icon}`} style={{ color: tip.color }}></i>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{tip.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div style={{ textAlign: 'center', padding: 'var(--space-lg) 0' }}>
        <button className="admin-add-btn" onClick={handleSave} disabled={saving} style={{ fontSize: '1.05rem', padding: '16px 48px' }}>
          {saving ? <><i className="fas fa-spinner fa-spin"></i> جاري الحفظ...</> : <><i className="fas fa-save"></i> حفظ إعدادات SEO</>}
        </button>
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
