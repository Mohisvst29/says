'use client';

import { useState, useEffect, useRef } from 'react';
import FinanceCalculator from './FinanceCalculator';

export default function HomeClient({ cars, testimonials, settings }) {
  const [isEnglish, setIsEnglish] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('hero');
  const [heroIndex, setHeroIndex] = useState(0);
  const heroParticlesRef = useRef(null);

  useEffect(() => {
    // Page loader
    setTimeout(() => setIsLoaded(true), 800);

    // Scroll handler
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);

      // Active link
      const sections = document.querySelectorAll('section[id]');
      let current = 'hero';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });
      setActiveLink(current);

      // Parallax hero
      const scrolled = window.scrollY;
      const heroImg = document.querySelector('.hero-bg img');
      if (heroImg && scrolled < window.innerHeight) {
        heroImg.style.transform = `scale(1.1) translateY(${scrolled * 0.15}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Create particles
    if (heroParticlesRef.current) {
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 8}s`;
        particle.style.animationDuration = `${6 + Math.random() * 6}s`;
        particle.style.width = `${2 + Math.random() * 3}px`;
        particle.style.height = particle.style.width;
        heroParticlesRef.current.appendChild(particle);
      }
    }

    // Scroll reveal observer
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));

    // Counter animation
    const counterElements = document.querySelectorAll('.counter-number');
    let countersAnimated = false;
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          counterElements.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            const updateCounter = () => {
              current += step;
              if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString('en');
                requestAnimationFrame(updateCounter);
              } else {
                counter.textContent = target.toLocaleString('en') + '+';
              }
            };
            updateCounter();
          });
        }
      });
    }, { threshold: 0.5 });
    const countersSection = document.getElementById('counters');
    if (countersSection) counterObserver.observe(countersSection);

    // Hero stats animation
    setTimeout(() => {
      const heroStats = document.querySelectorAll('.hero-stat .stat-number');
      heroStats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const updateStat = () => {
          current += step;
          if (current < target) {
            stat.textContent = Math.floor(current).toLocaleString('en');
            requestAnimationFrame(updateStat);
          } else {
            stat.textContent = target.toLocaleString('en') + '+';
          }
        };
        updateStat();
      });
    }, 1200);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFilter = (filter) => {
    setActiveFilter(filter);
  };

  const filteredCars = activeFilter === 'all'
    ? cars
    : cars.filter(car => car.category === activeFilter);

  const smoothScroll = (e, targetId) => {
    e.preventDefault();
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    // Hero carousel interval
    const mediaCount = [settings.heroMedia1, settings.heroMedia2, settings.heroMedia3, settings.heroImage].filter(Boolean).length;
    if (mediaCount > 1) {
      const interval = setInterval(() => {
        setHeroIndex(prev => (prev + 1) % mediaCount);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [settings.heroMedia1, settings.heroMedia2, settings.heroMedia3, settings.heroImage]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en').format(price);
  };

  useEffect(() => {
    document.documentElement.dir = isEnglish ? 'ltr' : 'rtl';
    document.documentElement.lang = isEnglish ? 'en' : 'ar';
  }, [isEnglish]);

  const s = settings;

  const t = {
    home: isEnglish ? 'Home' : 'الرئيسية',
    cars: isEnglish ? 'Cars' : 'السيارات',
    features: isEnglish ? 'Features' : 'مميزاتنا',
    about: isEnglish ? 'About Us' : 'من نحن',
    testimonials: isEnglish ? 'Testimonials' : 'آراء العملاء',
    contact: isEnglish ? 'Contact Us' : 'تواصل معنا',
    book: isEnglish ? 'Book Appt' : 'احجز موعد',
    heroBtn1: isEnglish ? 'Browse Cars' : 'تصفح السيارات',
    heroBtn2: isEnglish ? 'Know Us' : 'تعرف علينا',
    statCars: isEnglish ? 'Cars Sold' : 'سيارة تم بيعها',
    statBrands: isEnglish ? 'Brands' : 'علامة تجارية',
    statExp: isEnglish ? 'Years Exp' : 'سنة خبرة',
    statSat: isEnglish ? 'Satisfaction %' : '% رضا العملاء',
    brandsLabel: isEnglish ? 'We deal with the most luxurious brands' : 'نتعامل مع أفخم العلامات التجارية',
    featuredBadge: isEnglish ? 'Featured Cars' : 'سياراتنا المميزة',
    featuredTitle1: isEnglish ? 'Discover Latest ' : 'اكتشف أحدث ',
    featuredTitle2: isEnglish ? 'Cars' : 'السيارات',
    featuredSub: isEnglish ? 'Exclusive collection of luxury cars with best prices' : 'تشكيلة حصرية من أفخم السيارات بأفضل الأسعار مع ضمان الجودة والموثوقية',
    filterAll: isEnglish ? 'All' : 'الكل',
    filterSedan: isEnglish ? 'Sedan' : 'سيدان',
    filterSuv: isEnglish ? 'SUV' : 'دفع رباعي',
    filterSports: isEnglish ? 'Sports' : 'رياضية',
    filterElectric: isEnglish ? 'Electric' : 'كهربائية',
    viewAllC: isEnglish ? 'View All Cars' : 'عرض جميع السيارات',
    aboutYears: isEnglish ? 'Years of Excellence' : 'عام من التميز',
    ctaContact: isEnglish ? 'Contact Us Now' : 'اتصل بنا الآن',
    ctaWa: isEnglish ? 'WhatsApp' : 'واتساب',
    footerLinks: isEnglish ? 'Quick Links' : 'روابط سريعة',
    footerServices: isEnglish ? 'Our Services' : 'خدماتنا',
    footerShowroom: isEnglish ? 'Showroom' : 'المعرض',
    rights: isEnglish ? '© 2025 Sayarati. All rights reserved' : '© 2025 سيارتي. جميع الحقوق محفوظة'
  };

  return (
    <>
      {/* Top Banner (Marquee) */}
      {s.marqueeEnabled && (
        <div style={{
          backgroundColor: s.marqueeBgColor || '#C8A456',
          color: s.marqueeColor || '#ffffff',
          padding: '8px 0',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1001,
          overflow: 'hidden',
          display: 'flex',
          whiteSpace: 'nowrap',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'inline-block',
            animation: `marquee ${s.marqueeSpeed || '20s'} linear infinite`,
            fontSize: s.marqueeFontSize || '16px',
            fontWeight: 600,
            paddingLeft: '100%',
          }}>
            {s.marqueeText}
          </div>
        </div>
      )}

      {/* Page Loader */}
      <div className={`page-loader ${isLoaded ? 'loaded' : ''}`} id="pageLoader">
        <div className="loader-logo">سيارتي</div>
        <div className="loader-bar"></div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`} id="mobileMenu">
        <a href="#hero" onClick={(e) => smoothScroll(e, '#hero')}>الرئيسية</a>
        <a href="#cars" onClick={(e) => smoothScroll(e, '#cars')}>السيارات</a>
        <a href="#features" onClick={(e) => smoothScroll(e, '#features')}>مميزاتنا</a>
        <a href="#about" onClick={(e) => smoothScroll(e, '#about')}>من نحن</a>
        <a href="#testimonials" onClick={(e) => smoothScroll(e, '#testimonials')}>آراء العملاء</a>
        <a href="#contact" onClick={(e) => smoothScroll(e, '#contact')}>تواصل معنا</a>
      </div>

      {/* Navigation */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar" style={{ top: s.marqueeEnabled ? '40px' : '0' }}>
        <div className="container">
          <a href="#" className="navbar-brand">
            {s.logoImage ? (
              <img src={s.logoImage} alt="Sayarati Logo" style={{ width: s.logoWidth ? `${s.logoWidth}px` : '120px', objectFit: 'contain' }} />
            ) : (
              <>
                <div className="logo-icon">
                  <i className="fas fa-car"></i>
                </div>
                <div className="brand-text">
                  <span className="brand-name">{isEnglish ? s.siteNameEn || 'SAYARATI' : s.siteNameAr || 'سيارتي'}</span>
                  <span className="brand-tagline">{isEnglish ? s.siteNameAr || 'سيارتي' : s.siteNameEn || 'SAYARATI'}</span>
                </div>
              </>
            )}
          </a>

          <div className="navbar-links" id="navLinks">
            <a href="#hero" className={activeLink === 'hero' ? 'active' : ''} onClick={(e) => smoothScroll(e, '#hero')}>{t.home}</a>
            <a href="#cars" className={activeLink === 'cars' ? 'active' : ''} onClick={(e) => smoothScroll(e, '#cars')}>{t.cars}</a>
            <a href="#features" className={activeLink === 'features' ? 'active' : ''} onClick={(e) => smoothScroll(e, '#features')}>{t.features}</a>
            <a href="#about" className={activeLink === 'about' ? 'active' : ''} onClick={(e) => smoothScroll(e, '#about')}>{t.about}</a>
            <a href="#testimonials" className={activeLink === 'testimonials' ? 'active' : ''} onClick={(e) => smoothScroll(e, '#testimonials')}>{t.testimonials}</a>
            <a href="#contact" className={activeLink === 'contact' ? 'active' : ''} onClick={(e) => smoothScroll(e, '#contact')}>{t.contact}</a>
          </div>

          <div className="navbar-cta">
            <a href="#contact" className="btn btn-primary" onClick={(e) => smoothScroll(e, '#contact')} style={{ marginLeft: isEnglish ? '0' : '15px', marginRight: isEnglish ? '15px' : '0' }}>
              <i className="fas fa-phone"></i>
              {t.book}
            </a>
            <button
              onClick={() => setIsEnglish(!isEnglish)}
              style={{
                background: 'transparent',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                padding: '6px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontFamily: 'sans-serif'
              }}
            >
              {isEnglish ? 'العربية' : 'EN'}
            </button>
          </div>

          <button
            className={`menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
            id="menuToggle"
            aria-label="القائمة"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero-bg">
          {(() => {
            let medias = [s.heroMedia1, s.heroMedia2, s.heroMedia3].filter(Boolean);
            if (medias.length === 0 && s.heroImage) medias = [s.heroImage];
            if (medias.length === 0) medias = ["/images/hero-car.png"];

            return medias.map((mediaSrc, idx) => {
              const isVideo = typeof mediaSrc === 'string' && mediaSrc.match(/\.(mp4|webm|ogg)$/i);
              return (
                <div key={idx} style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  opacity: heroIndex === idx ? 1 : 0,
                  transition: 'opacity 1s ease-in-out',
                  zIndex: heroIndex === idx ? 1 : 0
                }}>
                  {isVideo ? (
                    <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                      <source src={mediaSrc} />
                    </video>
                  ) : (
                    <img src={mediaSrc} alt="سيارة فاخرة في معرض سيارتي" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>
              );
            });
          })()}
        </div>
        <div className="hero-particles" id="heroParticles" ref={heroParticlesRef}></div>
        <div className="container">
          <div className="hero-content" style={{ paddingTop: '100px' }}>
            <h1 className="hero-title">
              {isEnglish ? s.heroTitle1En || s.heroTitle1 : s.heroTitle1} <span className="gold-text highlight">{isEnglish ? s.heroTitleHighlightEn || s.heroTitleHighlight : s.heroTitleHighlight}</span>
              <br />{isEnglish ? s.heroTitle2En || s.heroTitle2 : s.heroTitle2}
            </h1>
            <p className="hero-description">{isEnglish ? s.heroDescriptionEn || s.heroDescription : s.heroDescription}</p>
            <div className="hero-actions">
              <a href="#cars" className="btn btn-primary" onClick={(e) => smoothScroll(e, '#cars')}>
                <i className="fas fa-car"></i>
                {t.heroBtn1}
              </a>
              <a href="#about" className="btn btn-outline" onClick={(e) => smoothScroll(e, '#about')}>
                <i className="fas fa-play-circle"></i>
                {t.heroBtn2}
              </a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="stat-number" data-target={s.statCarsSold}>0</div>
                <div className="stat-label">{t.statCars}</div>
              </div>
              <div className="hero-stat">
                <div className="stat-number" data-target={s.statBrands}>0</div>
                <div className="stat-label">{t.statBrands}</div>
              </div>
              <div className="hero-stat">
                <div className="stat-number" data-target={s.statYearsExperience}>0</div>
                <div className="stat-label">{t.statExp}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="scroll-mouse">
            <div className="scroll-dot"></div>
          </div>
          <span>اسحب للأسفل</span>
        </div>
      </section>

      {/* Brands Marquee */}
      <section className="brands-section">
        <div className="brands-label">{t.brandsLabel}</div>
        <div style={{ overflow: 'hidden' }}>
          <div className="brands-marquee" id="brandsMarquee">
            {s.brands && s.brands.map((brand, i) => (
              <span key={`brand-${i}`} className="brand-item">{brand}</span>
            ))}
            {s.brands && s.brands.map((brand, i) => (
              <span key={`brand-dup-${i}`} className="brand-item">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="featured-section section-padding" id="cars">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-badge">
              <i className="fas fa-star"></i>
              {t.featuredBadge}
            </span>
            <h2 className="section-title">{t.featuredTitle1} <span className="gold-text">{t.featuredTitle2}</span></h2>
            <p className="section-subtitle">{t.featuredSub}</p>
          </div>

          <div className="filter-tabs reveal">
            {['all', 'sedan', 'suv', 'sports', 'electric'].map(filter => (
              <button
                key={filter}
                className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => handleFilter(filter)}
              >
                {filter === 'all' ? t.filterAll : filter === 'sedan' ? t.filterSedan : filter === 'suv' ? t.filterSuv : filter === 'sports' ? t.filterSports : t.filterElectric}
              </button>
            ))}
          </div>

          <div className="cars-grid">
            {filteredCars.map((car, index) => (
              <CarCard key={car._id || index} car={car} index={index} settings={settings} isEnglish={isEnglish} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }} className="reveal">
            <a href="#" className="btn btn-outline">
              <i className="fas fa-th-large"></i>
              {t.viewAllC}
            </a>
          </div>

          {/* Finance Calculator */}
          <FinanceCalculator isEnglish={isEnglish} />
        </div>
      </section>

      {/* Counters */}
      <section className="counter-section section-padding" id="counters">
        <div className="container">
          <div className="counters-grid">
            <div className="counter-item reveal">
              <div className="counter-number" data-target={s.statCarsSold}>0</div>
              <div className="counter-label">سيارة تم بيعها</div>
            </div>
            <div className="counter-item reveal reveal-delay-1">
              <div className="counter-number" data-target={s.statBrands}>0</div>
              <div className="counter-label">علامة تجارية</div>
            </div>
            <div className="counter-item reveal reveal-delay-2">
              <div className="counter-number" data-target={s.statSatisfaction}>0</div>
              <div className="counter-label">% رضا العملاء</div>
            </div>
            <div className="counter-item reveal reveal-delay-3">
              <div className="counter-number" data-target={s.statYearsExperience}>0</div>
              <div className="counter-label">سنة خبرة</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section section-padding" id="features">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-badge">
              <i className="fas fa-crown"></i>
              {s.featuresBadge}
            </span>
            <h2 className="section-title">مميزات <span className="gold-text">{s.featuresTitle}</span></h2>
            <p className="section-subtitle">نسعى دائماً لتقديم أفضل تجربة لعملائنا من خلال خدمات متكاملة ومميزة</p>
          </div>

          <div className="features-grid">
            {s.features && s.features.map((feature, i) => (
              <div key={i} className={`feature-card reveal reveal-delay-${i + 1}`}>
                <div className="feature-icon">
                  <i className={feature.icon}></i>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="about-section section-padding" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-image-wrapper reveal">
              <div className="about-image">
                {(() => {
                  const mediaSrc = s.aboutImage || "/images/car-luxury.png";
                  const isVideo = typeof mediaSrc === 'string' && mediaSrc.match(/\.(mp4|webm|ogg)$/i);
                  if (isVideo) {
                    return (
                      <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                        <source src={mediaSrc} />
                      </video>
                    );
                  }
                  return <img src={mediaSrc} alt="معرض سيارتي" />;
                })()}
              </div>
              <div className="about-float-card">
                <div className="float-icon">
                  <i className="fas fa-trophy"></i>
                </div>
                <div>
                  <div className="float-number">+{s.statYearsExperience}</div>
                  <div className="float-label">{t.aboutYears}</div>
                </div>
              </div>
            </div>

            <div className="about-content reveal reveal-delay-2">
              <span className="section-badge">
                <i className="fas fa-info-circle"></i>
                {t.about}
              </span>
              <h2 className="section-title">{isEnglish ? 'Journey of ' : 'رحلة '}<span className="gold-text">{isEnglish ? 'Excellence' : 'التميز'}</span> {isEnglish ? 'Starts Here' : ' تبدأ هنا'}</h2>
              <p className="section-subtitle">{isEnglish ? s.aboutDescriptionEn || s.aboutDescription : s.aboutDescription}</p>
              <div className="about-features">
                {s.aboutFeatures && s.aboutFeatures.map((feature, i) => (
                  <div key={i} className="about-feature-item">
                    <span className="check-icon"><i className="fas fa-check"></i></span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <a href="#contact" className="btn btn-primary" onClick={(e) => smoothScroll(e, '#contact')}>
                <i className="fas fa-headset"></i>
                {t.contact}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section section-padding" id="testimonials">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-badge">
              <i className="fas fa-comments"></i>
              آراء العملاء
            </span>
            <h2 className="section-title">ماذا يقول <span className="gold-text">عملاؤنا</span></h2>
            <p className="section-subtitle">نفتخر بثقة عملائنا ورضاهم عن خدماتنا وتجربتهم المميزة معنا</p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={t._id || i} className={`testimonial-card reveal reveal-delay-${i + 1}`}>
                <span className="testimonial-quote">&quot;</span>
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, starIndex) => (
                    <i key={starIndex} className={starIndex < Math.floor(t.rating) ? 'fas fa-star' : t.rating % 1 !== 0 && starIndex === Math.floor(t.rating) ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
                  ))}
                </div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.initials}</div>
                  <div className="testimonial-author-info">
                    <div className="author-name">{t.name}</div>
                    <div className="author-title">{t.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Contact */}
      <section className="cta-section" id="contact">
        <div className="container">
          <div className="cta-card reveal">
            <h2 className="cta-title">جاهز لتجد <span className="gold-text">سيارة أحلامك؟</span></h2>
            <p className="cta-subtitle">{s.ctaDescription}</p>
            <div className="cta-actions">
              <a href={`tel:${s.phone}`} className="btn btn-primary">
                <i className="fas fa-phone"></i>
                اتصل بنا الآن
              </a>
              <a href={`https://wa.me/${s.whatsapp}`} className="btn btn-outline" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-whatsapp"></i>
                واتساب
              </a>
            </div>
            <div className="contact-grid">
              <div className="contact-card">
                <div className="contact-card-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <div className="contact-card-label">العنوان</div>
                  <div className="contact-card-value" style={{ direction: 'rtl' }}>{s.address}</div>
                </div>
              </div>
              <div className="contact-card">
                <div className="contact-card-icon">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div>
                  <div className="contact-card-label">الهاتف</div>
                  <div className="contact-card-value">{s.phoneDisplay}</div>
                </div>
              </div>
              <div className="contact-card">
                <div className="contact-card-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div>
                  <div className="contact-card-label">ساعات العمل</div>
                  <div className="contact-card-value" style={{ direction: 'rtl' }}>{s.workingHours}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" style={{ direction: isEnglish ? 'ltr' : 'rtl' }}>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="brand-name">
                 {s.logoImage ? <img src={s.logoImage} alt="Sayarati Logo" style={{ height: '40px', objectFit: 'contain', display: 'block', marginBottom: '10px' }} /> : (isEnglish ? s.siteNameEn || 'SAYARATI' : s.siteNameAr || 'سيارتي')}
              </div>
              <p className="brand-desc">{isEnglish ? s.footerDescriptionEn || s.footerDescription : s.footerDescription}</p>
              
              <div style={{ display: 'flex', gap: '15px', marginTop: '15px', marginBottom: '15px' }}>
                {s.footerMedia1 && (
                  <div style={{ flex: 1 }}>
                    {typeof s.footerMedia1 === 'string' && s.footerMedia1.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video src={s.footerMedia1} autoPlay loop muted playsInline style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                    ) : (
                      <img src={s.footerMedia1} alt="Footer Media 1" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                    )}
                  </div>
                )}
                {s.footerMedia2 && (
                  <div style={{ flex: 1 }}>
                    {typeof s.footerMedia2 === 'string' && s.footerMedia2.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video src={s.footerMedia2} autoPlay loop muted playsInline style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                    ) : (
                      <img src={s.footerMedia2} alt="Footer Media 2" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                    )}
                  </div>
                )}
              </div>
              <div className="footer-social">
                <a href={s.twitter} aria-label="Twitter"><i className="fab fa-x-twitter"></i></a>
                <a href={s.instagram} aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                <a href={s.snapchat} aria-label="Snapchat"><i className="fab fa-snapchat-ghost"></i></a>
                <a href={s.youtube} aria-label="YouTube"><i className="fab fa-youtube"></i></a>
              </div>
            </div>

            <div>
              <h3 className="footer-col-title">{t.footerLinks}</h3>
              <div className="footer-links">
                <a href="#hero" onClick={(e) => smoothScroll(e, '#hero')}>{t.home}</a>
                <a href="#cars" onClick={(e) => smoothScroll(e, '#cars')}>{t.cars}</a>
                <a href="#features" onClick={(e) => smoothScroll(e, '#features')}>{t.features}</a>
                <a href="#about" onClick={(e) => smoothScroll(e, '#about')}>{t.about}</a>
                <a href="#contact" onClick={(e) => smoothScroll(e, '#contact')}>{t.contact}</a>
              </div>
            </div>

            <div>
              <h3 className="footer-col-title">{t.footerServices}</h3>
              <div className="footer-links">
                <a href="#">{isEnglish ? 'Sell Cars' : 'بيع السيارات'}</a>
                <a href="#">{isEnglish ? 'Buy Cars' : 'شراء السيارات'}</a>
                <a href="#">{isEnglish ? 'Financing' : 'خدمات التمويل'}</a>
                <a href="#">{isEnglish ? 'Inspection' : 'الفحص والتقييم'}</a>
                <a href="#">{isEnglish ? 'Insurance' : 'خدمات التأمين'}</a>
              </div>
            </div>

            <div>
              <h3 className="footer-col-title">{t.footerShowroom}</h3>
              <div className="footer-links">
                <a href="#">{isEnglish ? 'New Cars' : 'سيارات جديدة'}</a>
                <a href="#">{isEnglish ? 'Used Cars' : 'سيارات مستعملة'}</a>
                <a href="#">{isEnglish ? 'Electric Cars' : 'سيارات كهربائية'}</a>
                <a href="#">{isEnglish ? 'Special Offers' : 'عروض خاصة'}</a>
                <a href="#">{isEnglish ? 'Car News' : 'أخبار السيارات'}</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>{t.rights}</p>
            <div className="footer-bottom-links">
              <a href="#">{isEnglish ? 'Privacy Policy' : 'سياسة الخصوصية'}</a>
              <a href="#">{isEnglish ? 'Terms of Service' : 'الشروط والأحكام'}</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function CarCard({ car, index, settings, isEnglish }) {
  const [isFav, setIsFav] = useState(false);

  return (
    <div className={`car-card reveal reveal-delay-${(index % 3) + 1}`} data-category={car.category}>
      <div className="car-card-image">
        {(() => {
          const isVideo = typeof car.image === 'string' && car.image.match(/\.(mp4|webm|ogg)$/i);
          if (isVideo) {
            return (
              <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                <source src={car.image} />
              </video>
            );
          }
          return <img src={car.image} alt={car.title} />;
        })()}
        <span className="car-card-badge">{car.badge}</span>
        <button
          className="car-card-fav"
          aria-label="إضافة للمفضلة"
          onClick={() => setIsFav(!isFav)}
          style={isFav ? { color: '#e74c3c', background: 'rgba(231, 76, 60, 0.15)', borderColor: 'rgba(231, 76, 60, 0.3)' } : {}}
        >
          <i className={isFav ? 'fas fa-heart' : 'far fa-heart'}></i>
        </button>
      </div>
      <div className="car-card-body">
        <h3 className="car-card-title">{car.title}</h3>
        <span className="car-card-year">{car.year} — {car.subtitle}</span>
        <div className="car-card-specs">
          <span className="car-spec"><i className="fas fa-tachometer-alt"></i> {car.horsepower}</span>
          <span className="car-spec"><i className={car.fuelType === 'كهربائي' ? 'fas fa-bolt' : 'fas fa-gas-pump'}></i> {car.fuelType}</span>
          <span className="car-spec"><i className="fas fa-cog"></i> {car.transmission}</span>
        </div>
        <div className="car-card-footer">
          <div className="car-price">
            <span className="currency">{isEnglish ? 'SAR' : 'ر.س'}</span>{new Intl.NumberFormat('en').format(car.price)}
          </div>
          <a
            href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`مرحباً، أود الاستفسار عن السيارة: ${car.title} موديل ${car.year}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="car-card-link"
          >
            {isEnglish ? 'Details' : 'التفاصيل'}
            <i className={`fas fa-arrow-${isEnglish ? 'right' : 'left'}`}></i>
          </a>
        </div>
      </div>
    </div>
  );
}
