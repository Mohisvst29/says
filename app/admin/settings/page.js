'use client';

import { useState, useEffect } from 'react';
import AdminShell from '@/components/AdminShell';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [uploadingField, setUploadingField] = useState(null);

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
      showToast('تم حفظ الإعدادات بنجاح');
    } catch (error) {
      showToast(error.message, true);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingField(fieldName);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        updateField(fieldName, data.url);
        // Auto-save immediately to prevent user confusion
        const updatedSettings = { ...settings, [fieldName]: data.url };
        await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedSettings),
        });
        setSettings(updatedSettings);
        showToast('تم رفع الملف وحفظه بنجاح');
      } else {
        throw new Error(data.error || 'فشل رفع الملف');
      }
    } catch (error) {
      showToast(error.message, true);
    } finally {
      setUploadingField(null);
    }
  };

  const updateFeature = (index, field, value) => {
    setSettings(prev => {
      const features = [...prev.features];
      features[index] = { ...features[index], [field]: value };
      return { ...prev, features };
    });
  };

  const updateAboutFeature = (index, value) => {
    setSettings(prev => {
      const aboutFeatures = [...prev.aboutFeatures];
      aboutFeatures[index] = value;
      return { ...prev, aboutFeatures };
    });
  };

  const updateBrand = (index, value) => {
    setSettings(prev => {
      const brands = [...prev.brands];
      brands[index] = value;
      return { ...prev, brands };
    });
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

  return (
    <AdminShell>
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">إعدادات الموقع</h1>
          <p className="admin-header-subtitle">تعديل محتوى وإعدادات الموقع</p>
        </div>
        <button className="admin-add-btn" onClick={handleSave} disabled={saving}>
          {saving ? <><i className="fas fa-spinner fa-spin"></i> جاري الحفظ...</> : <><i className="fas fa-save"></i> حفظ التغييرات</>}
        </button>
      </div>

      {/* Design & Colors */}
      <div className="admin-settings-section">
        <h3 className="admin-settings-title">
          <i className="fas fa-paint-brush"></i> الألوان والخطوط
        </h3>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">اللون الرئيسي (Primary Color)</label>
            <input type="color" className="admin-form-input" style={{ height: '50px', padding: '5px' }} value={settings.primaryColor || '#C8A456'} onChange={(e) => updateField('primaryColor', e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">لون الخلفية (Background Color)</label>
            <input type="color" className="admin-form-input" style={{ height: '50px', padding: '5px' }} value={settings.secondaryColor || '#0a0a0f'} onChange={(e) => updateField('secondaryColor', e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">اللون المميز (Accent Color)</label>
            <input type="color" className="admin-form-input" style={{ height: '50px', padding: '5px' }} value={settings.accentColor || '#1a73e8'} onChange={(e) => updateField('accentColor', e.target.value)} />
          </div>
        </div>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">لون النص الرئيسي</label>
            <input type="color" className="admin-form-input" style={{ height: '50px', padding: '5px' }} value={settings.textPrimaryColor || '#f0ece4'} onChange={(e) => updateField('textPrimaryColor', e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">لون النص الثانوي</label>
            <input type="color" className="admin-form-input" style={{ height: '50px', padding: '5px' }} value={settings.textSecondaryColor || '#a0a0b0'} onChange={(e) => updateField('textSecondaryColor', e.target.value)} />
          </div>
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">نوع الخط (Font Family)</label>
          <select className="admin-form-select" value={settings.fontFamily || 'Cairo'} onChange={(e) => updateField('fontFamily', e.target.value)}>
            <option value="Cairo">Cairo (كيرو)</option>
            <option value="Tajawal">Tajawal (تجوال)</option>
            <option value="Almarai">Almarai (المراعي)</option>
            <option value="Changa">Changa (تشانجا)</option>
            <option value="IBM Plex Sans Arabic">IBM Plex Sans Arabic</option>
          </select>
        </div>
      </div>
      <div className="admin-settings-section">
        <h3 className="admin-settings-title">
          <i className="fas fa-camera"></i> إعدادات الشعار واسم الموقع
        </h3>
        
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">اسم الموقع (عربي)</label>
            <input className="admin-form-input rtl-input" value={settings.siteNameAr || 'سيارتي'} onChange={(e) => updateField('siteNameAr', e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">اسم الموقع (إنجليزي)</label>
            <input className="admin-form-input" value={settings.siteNameEn || 'SAYARATI'} onChange={(e) => updateField('siteNameEn', e.target.value)} style={{ direction: 'ltr' }} />
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">صورة الشعار (رفع من الجهاز)</label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'logoImage')}
              style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid var(--color-border)' }}
              disabled={uploadingField === 'logoImage'}
            />
            {uploadingField === 'logoImage' && <i className="fas fa-spinner fa-spin" style={{ color: 'var(--color-primary)' }}></i>}
          </div>
          {settings.logoImage && (
            <div style={{ marginTop: '10px' }}>
              <img src={settings.logoImage} alt="Preview" style={{ height: '60px', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
            </div>
          )}
          <div className="admin-form-label" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>اترك الحقل فارغاً لاستخدام الأيقونة الافتراضية</div>
        </div>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">حجم الشعار (العرض بـ px)</label>
            <input type="number" className="admin-form-input" value={settings.logoWidth || 120} onChange={(e) => updateField('logoWidth', Number(e.target.value))} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">موقع الشعار (Position)</label>
            <select className="admin-form-select" value={settings.logoPosition || 'right'} onChange={(e) => updateField('logoPosition', e.target.value)}>
              <option value="right">يمين (Right)</option>
              <option value="center">منتصف (Center)</option>
              <option value="left">يسار (Left)</option>
            </select>
          </div>
        </div>
      </div>
      {/* Marquee Settings */}
      <div className="admin-settings-section">
        <h3 className="admin-settings-title">
          <i className="fas fa-bullhorn"></i> الشريط المتحرك (الإعلانات)
        </h3>
        <div className="admin-form-group">
          <label className="admin-checkbox-group">
            <input
              type="checkbox"
              className="admin-checkbox"
              checked={settings.marqueeEnabled || false}
              onChange={(e) => updateField('marqueeEnabled', e.target.checked)}
            />
            <span>تفعيل الشريط المتحرك في أعلى الموقع</span>
          </label>
        </div>

        {settings.marqueeEnabled && (
          <>
            <div className="admin-form-group">
              <label className="admin-form-label">نص الإعلان</label>
              <input className="admin-form-input rtl-input" value={settings.marqueeText || ''} onChange={(e) => updateField('marqueeText', e.target.value)} />
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">لون النص</label>
                <input type="color" className="admin-form-input" style={{ height: '50px', padding: '5px' }} value={settings.marqueeColor || '#ffffff'} onChange={(e) => updateField('marqueeColor', e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">لون الخلفية</label>
                <input type="color" className="admin-form-input" style={{ height: '50px', padding: '5px' }} value={settings.marqueeBgColor || '#C8A456'} onChange={(e) => updateField('marqueeBgColor', e.target.value)} />
              </div>
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">حجم الخط</label>
                <select className="admin-form-select" value={settings.marqueeFontSize || '16px'} onChange={(e) => updateField('marqueeFontSize', e.target.value)}>
                  <option value="12px">صغير جداً</option>
                  <option value="14px">صغير</option>
                  <option value="16px">متوسط</option>
                  <option value="18px">كبير</option>
                  <option value="20px">كبير جداً</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">سرعة الحركة</label>
                <select className="admin-form-select" value={settings.marqueeSpeed || '20s'} onChange={(e) => updateField('marqueeSpeed', e.target.value)}>
                  <option value="40s">بطيء جداً</option>
                  <option value="30s">بطيء</option>
                  <option value="20s">متوسط</option>
                  <option value="10s">سريع</option>
                  <option value="5s">سريع جداً</option>
                </select>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Hero Section Settings */}
      <div className="admin-settings-section">
        <h3 className="admin-settings-title">
          <i className="fas fa-home"></i> القسم الرئيسي (Hero)
        </h3>
        
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">العنوان بداية (عربي)</label>
            <input className="admin-form-input rtl-input" value={settings.heroTitle1} onChange={(e) => updateField('heroTitle1', e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">العنوان بداية (إنجليزي)</label>
            <input className="admin-form-input" value={settings.heroTitle1En || ''} onChange={(e) => updateField('heroTitle1En', e.target.value)} style={{ direction: 'ltr' }} />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">العنوان المميز ذهبي (عربي)</label>
            <input className="admin-form-input rtl-input" value={settings.heroTitleHighlight} onChange={(e) => updateField('heroTitleHighlight', e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">العنوان المميز ذهبي (إنجليزي)</label>
            <input className="admin-form-input" value={settings.heroTitleHighlightEn || ''} onChange={(e) => updateField('heroTitleHighlightEn', e.target.value)} style={{ direction: 'ltr' }} />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">العنوان نهاية (عربي)</label>
            <input className="admin-form-input rtl-input" value={settings.heroTitle2} onChange={(e) => updateField('heroTitle2', e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">العنوان نهاية (إنجليزي)</label>
            <input className="admin-form-input" value={settings.heroTitle2En || ''} onChange={(e) => updateField('heroTitle2En', e.target.value)} style={{ direction: 'ltr' }} />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">الوصف (عربي)</label>
            <textarea className="admin-form-textarea" value={settings.heroDescription} onChange={(e) => updateField('heroDescription', e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">الوصف (إنجليزي)</label>
            <textarea className="admin-form-textarea" value={settings.heroDescriptionEn || ''} onChange={(e) => updateField('heroDescriptionEn', e.target.value)} style={{ direction: 'ltr' }} />
          </div>
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">وسائط القسم الرئيسي (Hero Media Slider)</label>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '10px' }}>يمكنك إضافة حتى 3 صور أو مقاطع فيديو ليتم التبديل بينها في خلفية القسم الرئيسي.</p>
          
          <div className="admin-form-row">
            <div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => handleFileUpload(e, 'heroMedia1')}
                  style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                  disabled={uploadingField === 'heroMedia1'}
                />
                {uploadingField === 'heroMedia1' && <i className="fas fa-spinner fa-spin" style={{ color: 'var(--color-primary)' }}></i>}
              </div>
              {settings.heroMedia1 && (
                 <div style={{ marginTop: '10px' }}>
                 {settings.heroMedia1.match(/\.(mp4|webm|ogg)$/i) ? (
                   <video src={settings.heroMedia1} autoPlay loop muted style={{ height: '60px', borderRadius: '8px' }} />
                 ) : (
                   <img src={settings.heroMedia1} alt="Preview" style={{ height: '60px', borderRadius: '8px' }} />
                 )}
               </div>
              )}
            </div>

            <div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => handleFileUpload(e, 'heroMedia2')}
                  style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                  disabled={uploadingField === 'heroMedia2'}
                />
                {uploadingField === 'heroMedia2' && <i className="fas fa-spinner fa-spin" style={{ color: 'var(--color-primary)' }}></i>}
              </div>
              {settings.heroMedia2 && (
                 <div style={{ marginTop: '10px' }}>
                 {settings.heroMedia2.match(/\.(mp4|webm|ogg)$/i) ? (
                   <video src={settings.heroMedia2} autoPlay loop muted style={{ height: '60px', borderRadius: '8px' }} />
                 ) : (
                   <img src={settings.heroMedia2} alt="Preview" style={{ height: '60px', borderRadius: '8px' }} />
                 )}
               </div>
              )}
            </div>

            <div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => handleFileUpload(e, 'heroMedia3')}
                  style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                  disabled={uploadingField === 'heroMedia3'}
                />
                {uploadingField === 'heroMedia3' && <i className="fas fa-spinner fa-spin" style={{ color: 'var(--color-primary)' }}></i>}
              </div>
              {settings.heroMedia3 && (
                 <div style={{ marginTop: '10px' }}>
                 {settings.heroMedia3.match(/\.(mp4|webm|ogg)$/i) ? (
                   <video src={settings.heroMedia3} autoPlay loop muted style={{ height: '60px', borderRadius: '8px' }} />
                 ) : (
                   <img src={settings.heroMedia3} alt="Preview" style={{ height: '60px', borderRadius: '8px' }} />
                 )}
               </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-settings-section">
        <h3 className="admin-settings-title">
          <i className="fas fa-chart-bar"></i> الإحصائيات
        </h3>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">عدد السيارات المباعة</label>
            <input type="number" className="admin-form-input" value={settings.statCarsSold} onChange={(e) => updateField('statCarsSold', Number(e.target.value))} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">عدد العلامات التجارية</label>
            <input type="number" className="admin-form-input" value={settings.statBrands} onChange={(e) => updateField('statBrands', Number(e.target.value))} />
          </div>
        </div>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">نسبة رضا العملاء</label>
            <input type="number" className="admin-form-input" value={settings.statSatisfaction} onChange={(e) => updateField('statSatisfaction', Number(e.target.value))} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">سنوات الخبرة</label>
            <input type="number" className="admin-form-input" value={settings.statYearsExperience} onChange={(e) => updateField('statYearsExperience', Number(e.target.value))} />
          </div>
        </div>
      </div>

      {/* Brands */}
      <div className="admin-settings-section">
        <h3 className="admin-settings-title">
          <i className="fas fa-tags"></i> العلامات التجارية
        </h3>
        <div className="admin-form-row">
          {settings.brands && settings.brands.map((brand, i) => (
            <div key={i} className="admin-form-group">
              <label className="admin-form-label">العلامة {i + 1}</label>
              <input className="admin-form-input" value={brand} onChange={(e) => updateBrand(i, e.target.value)} />
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="admin-settings-section">
        <h3 className="admin-settings-title">
          <i className="fas fa-star"></i> المميزات
        </h3>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">شارة القسم</label>
            <input className="admin-form-input rtl-input" value={settings.featuresBadge} onChange={(e) => updateField('featuresBadge', e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">عنوان القسم</label>
            <input className="admin-form-input rtl-input" value={settings.featuresTitle} onChange={(e) => updateField('featuresTitle', e.target.value)} />
          </div>
        </div>

        {settings.features && settings.features.map((feature, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 12, marginTop: 16, border: '1px solid var(--color-border-light)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600, marginBottom: 12 }}>
              الميزة {i + 1}
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">الأيقونة (CSS class)</label>
                <input className="admin-form-input" value={feature.icon} onChange={(e) => updateFeature(i, 'icon', e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">العنوان</label>
                <input className="admin-form-input rtl-input" value={feature.title} onChange={(e) => updateFeature(i, 'title', e.target.value)} />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">الوصف</label>
              <textarea className="admin-form-textarea" value={feature.description} onChange={(e) => updateFeature(i, 'description', e.target.value)} style={{ minHeight: 80 }} />
            </div>
          </div>
        ))}
      </div>

      {/* About */}
      <div className="admin-settings-section">
        <h3 className="admin-settings-title">
          <i className="fas fa-info-circle"></i> من نحن
        </h3>
        <div className="admin-form-group">
          <label className="admin-form-label">وصف القسم</label>
          <textarea className="admin-form-textarea" value={settings.aboutDescription} onChange={(e) => updateField('aboutDescription', e.target.value)} />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">صورة قسم من نحن (رفع من الجهاز)</label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => handleFileUpload(e, 'aboutImage')}
              style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid var(--color-border)' }}
              disabled={uploadingField === 'aboutImage'}
            />
            {uploadingField === 'aboutImage' && <i className="fas fa-spinner fa-spin" style={{ color: 'var(--color-primary)' }}></i>}
          </div>
          {settings.aboutImage && (
            <div style={{ marginTop: '10px' }}>
              <img src={settings.aboutImage} alt="Preview" style={{ height: '60px', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
            </div>
          )}
        </div>
        <div style={{ marginTop: 16 }}>
          <label className="admin-form-label">مميزات "من نحن"</label>
          {settings.aboutFeatures && settings.aboutFeatures.map((feature, i) => (
            <div key={i} className="admin-form-group">
              <input className="admin-form-input rtl-input" value={feature} onChange={(e) => updateAboutFeature(i, e.target.value)} placeholder={`الميزة ${i + 1}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="admin-settings-section">
        <h3 className="admin-settings-title">
          <i className="fas fa-phone-alt"></i> معلومات التواصل
        </h3>
        <div className="admin-form-group">
          <label className="admin-form-label">عنوان قسم التواصل</label>
          <input className="admin-form-input rtl-input" value={settings.ctaTitle} onChange={(e) => updateField('ctaTitle', e.target.value)} />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">وصف قسم التواصل</label>
          <textarea className="admin-form-textarea" value={settings.ctaDescription} onChange={(e) => updateField('ctaDescription', e.target.value)} />
        </div>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">رقم الهاتف</label>
            <input className="admin-form-input" value={settings.phone} onChange={(e) => updateField('phone', e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">رقم الهاتف (للعرض)</label>
            <input className="admin-form-input" value={settings.phoneDisplay} onChange={(e) => updateField('phoneDisplay', e.target.value)} />
          </div>
        </div>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">رقم الواتساب</label>
            <input className="admin-form-input" value={settings.whatsapp} onChange={(e) => updateField('whatsapp', e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">العنوان</label>
            <input className="admin-form-input rtl-input" value={settings.address} onChange={(e) => updateField('address', e.target.value)} />
          </div>
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">ساعات العمل</label>
          <input className="admin-form-input rtl-input" value={settings.workingHours} onChange={(e) => updateField('workingHours', e.target.value)} />
        </div>
      </div>

      {/* Social Media */}
      <div className="admin-settings-section">
        <h3 className="admin-settings-title">
          <i className="fas fa-share-alt"></i> وسائل التواصل الاجتماعي
        </h3>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label"><i className="fab fa-x-twitter"></i> تويتر</label>
            <input className="admin-form-input" value={settings.twitter} onChange={(e) => updateField('twitter', e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label"><i className="fab fa-instagram"></i> إنستغرام</label>
            <input className="admin-form-input" value={settings.instagram} onChange={(e) => updateField('instagram', e.target.value)} />
          </div>
        </div>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label"><i className="fab fa-snapchat-ghost"></i> سناب شات</label>
            <input className="admin-form-input" value={settings.snapchat} onChange={(e) => updateField('snapchat', e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label"><i className="fab fa-youtube"></i> يوتيوب</label>
            <input className="admin-form-input" value={settings.youtube} onChange={(e) => updateField('youtube', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="admin-settings-section">
        <h3 className="admin-settings-title">
          <i className="fas fa-file-alt"></i> الفوتر
        </h3>
        <div className="admin-form-group">
          <label className="admin-form-label">وصف الفوتر</label>
          <textarea className="admin-form-textarea" value={settings.footerDescription} onChange={(e) => updateField('footerDescription', e.target.value)} />
        </div>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">الوسيط الأول في الفوتر (صورة/فيديو)</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => handleFileUpload(e, 'footerMedia1')}
                style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                disabled={uploadingField === 'footerMedia1'}
              />
              {uploadingField === 'footerMedia1' && <i className="fas fa-spinner fa-spin" style={{ color: 'var(--color-primary)' }}></i>}
            </div>
            {settings.footerMedia1 && (
              <div style={{ marginTop: '10px' }}>
                {settings.footerMedia1.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video src={settings.footerMedia1} autoPlay loop muted style={{ height: '80px', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                ) : (
                  <img src={settings.footerMedia1} alt="Preview" style={{ height: '80px', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                )}
              </div>
            )}
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">الوسيط الثاني في الفوتر (صورة/فيديو)</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => handleFileUpload(e, 'footerMedia2')}
                style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                disabled={uploadingField === 'footerMedia2'}
              />
              {uploadingField === 'footerMedia2' && <i className="fas fa-spinner fa-spin" style={{ color: 'var(--color-primary)' }}></i>}
            </div>
            {settings.footerMedia2 && (
              <div style={{ marginTop: '10px' }}>
                {settings.footerMedia2.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video src={settings.footerMedia2} autoPlay loop muted style={{ height: '80px', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                ) : (
                  <img src={settings.footerMedia2} alt="Preview" style={{ height: '80px', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ textAlign: 'center', padding: 'var(--space-lg) 0' }}>
        <button className="admin-add-btn" onClick={handleSave} disabled={saving} style={{ fontSize: '1.05rem', padding: '16px 48px' }}>
          {saving ? <><i className="fas fa-spinner fa-spin"></i> جاري الحفظ...</> : <><i className="fas fa-save"></i> حفظ جميع التغييرات</>}
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
