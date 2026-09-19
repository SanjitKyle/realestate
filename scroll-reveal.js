// Smooth Scroll Reveal & Next-Gen Interactive Animation Engine for Steady Shield Realtech Pvt Ltd
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. TOP SCROLL PROGRESS BAR (Glowing Gradient Indicator)
    // ==========================================================================
    if (!document.getElementById('scroll-progress-bar')) {
        const progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress-bar';
        document.body.prepend(progressBar);
    }

    // ==========================================================================
    // 2. BACK-TO-TOP FLOATING BUTTON
    // ==========================================================================
    if (!document.getElementById('back-to-top-btn')) {
        const backBtn = document.createElement('button');
        backBtn.id = 'back-to-top-btn';
        backBtn.setAttribute('aria-label', 'Back to top');
        backBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>`;
        document.body.appendChild(backBtn);

        backBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const progressBarEl = document.getElementById('scroll-progress-bar');
    const backBtnEl = document.getElementById('back-to-top-btn');
    const navbarEl = document.getElementById('main-nav') || document.querySelector('.navbar');

    // ==========================================================================
    // 3. GLOBAL SCROLL HANDLER (Progress, Nav Blur, Back-To-Top, Parallax)
    // ==========================================================================
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

                // Update progress bar
                if (progressBarEl) {
                    progressBarEl.style.width = `${scrollPercent}%`;
                }

                // Toggle back-to-top button
                if (backBtnEl) {
                    if (scrollTop > 350) {
                        backBtnEl.classList.add('visible');
                    } else {
                        backBtnEl.classList.remove('visible');
                    }
                }

                // Navbar scrolled elevation
                if (navbarEl) {
                    if (scrollTop > 40) {
                        navbarEl.classList.add('nav-scrolled');
                    } else {
                        navbarEl.classList.remove('nav-scrolled');
                    }
                }

                // Hero & Section Parallax effect
                const heroes = document.querySelectorAll('.page-hero, .about-hero-section, .gallery-hero-v2, .contact-hero-v2, .portal-hero-slider');
                heroes.forEach(hero => {
                    if (scrollTop < window.innerHeight) {
                        const bgOverlay = hero.querySelector('.hero-bg-overlay');
                        if (bgOverlay) {
                            bgOverlay.style.transform = `translateY(${scrollTop * 0.22}px)`;
                        }
                    }
                });

                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // ==========================================================================
    // 4. KINETIC TEXT LINE-MASK REVEAL ENGINE
    // ==========================================================================
    const titlesToMask = document.querySelectorAll('.section-title, .monograph-title, .advantage-title, .cta-banner h2');
    titlesToMask.forEach(title => {
        if (!title.dataset.masked && !title.querySelector('.text-mask-wrap')) {
            title.dataset.masked = 'true';
            const originalHTML = title.innerHTML;
            title.innerHTML = `<span class="text-mask-wrap"><span class="text-mask-inner">${originalHTML}</span></span>`;
        }
    });

    // ==========================================================================
    // 5. AUTO-TARGET SELECTORS FOR SCROLL REVEALS
    // ==========================================================================
    const autoRevealSelectors = [
        '.two-col-img', '.two-col-text', '.about-visual-stack',
        '.section-badge', '.section-title', '.section-subtitle',
        '.about-hero-content', '.about-stat-strip', '.about-quote-card',
        '.contact-info-col', '.styled-form', '.styled-form-v2', '.cta-banner',
        '.info-item', '.map-placeholder', '.map-card-v2', '.timeline-item',
        '.contact-card-v2', '.prop-search-bar-v2', '.monograph-header',
        '.monograph-lead', '.advantage-header', '.advantage-bottom-strip',
        '.emi-wrapper', '.portal-filter-tabs', '.category-strip-inner'
    ];

    const autoStaggerSelectors = [
        '.portal-grid', '.monograph-bento-grid', '.advantage-cards-grid',
        '.features-grid', '.team-grid', '.properties-listing', '.properties-listing-v2',
        '.about-stat-grid', '.about-check-grid', '.gallery-masonry',
        '.stats-row', '.gallery-grid-v2', '.amenity-grid-v2', '.neigh-grid-v2',
        '.mini-milestones-grid', '.contact-info-list', '.faq-wrap-v2',
        '.testimonials-slider'
    ];

    autoRevealSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            if (!el.classList.contains('reveal') && !el.classList.contains('reveal-up') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right')) {
                el.classList.add('reveal-up');
            }
        });
    });

    autoStaggerSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            if (!el.classList.contains('reveal-stagger')) {
                el.classList.add('reveal-stagger');
            }
            // Set staggered child transition delays dynamically
            Array.from(el.children).forEach((child, idx) => {
                child.style.setProperty('--stagger-index', idx);
                child.style.transitionDelay = `${idx * 90}ms`;
            });
        });
    });

    // ==========================================================================
    // 6. INTERSECTION OBSERVER FOR KINETIC ENTRANCES & NUMBER ANIMATION
    // ==========================================================================
    const observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -40px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');

                // Trigger nested text-mask-inners
                const maskInner = entry.target.querySelector('.text-mask-inner');
                if (maskInner) {
                    maskInner.classList.add('revealed');
                }

                // Trigger stat number counters
                const statNums = entry.target.querySelectorAll(
                    '.adv-trust-num, .about-stat-num, .stat-number, .stat-num-v2, .stat-num, .adv-highlight-pill, .bento-metric-val'
                );
                if (statNums.length > 0) {
                    animateNumbers(statNums);
                }

                // Stop observing once animated
                if (!entry.target.classList.contains('keep-observing')) {
                    revealObserver.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    const observeTargets = document.querySelectorAll(
        '.reveal, .reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur, .reveal-stagger, .title-animated, .section-badge, .advantage-bottom-strip'
    );
    observeTargets.forEach(el => revealObserver.observe(el));

    // ==========================================================================
    // 7. SMOOTH STATISTICAL NUMBER COUNTER EASING ENGINE
    // ==========================================================================
    function animateNumbers(elements) {
        elements.forEach(el => {
            if (el.dataset.counted) return;
            el.dataset.counted = 'true';

            const rawText = el.textContent.trim();
            const numericValue = parseFloat(rawText.replace(/[^0-9.]/g, ''));
            if (isNaN(numericValue)) return;

            const prefix = rawText.startsWith('₹') ? '₹ ' : '';
            let suffix = '';
            if (rawText.includes('Cr+')) suffix = ' Cr+';
            else if (rawText.includes('Cr')) suffix = ' Cr';
            else if (rawText.includes('%')) suffix = '%';
            else if (rawText.includes('+')) suffix = '+';
            else if (rawText.includes('-Point')) suffix = '-Point';

            const duration = 1500;
            const startTime = performance.now();

            function step(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Custom luxury cubic bezier easing: easeOutExpo
                const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const currentNum = Math.floor(numericValue * easedProgress);

                el.textContent = `${prefix}${currentNum}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = rawText;
                }
            }
            requestAnimationFrame(step);
        });
    }

    // ==========================================================================
    // 8. 3D CARD PARALLAX TILT PHYSICS & SPECULAR GLARE
    // ==========================================================================
    const tiltCards = document.querySelectorAll(
        '.prop-card, .bento-card, .adv-luxury-card, .testimonial-card, .feature-card, .team-member, .prop-card-v2'
    );

    tiltCards.forEach(card => {
        card.classList.add('card-3d-tilt');

        // Add specular glare overlay
        if (!card.querySelector('.card-glare-effect')) {
            const glare = document.createElement('div');
            glare.className = 'card-glare-effect';
            card.appendChild(glare);
        }

        const glareEl = card.querySelector('.card-glare-effect');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;

            const rotateX = (-deltaY * 6.5).toFixed(2);
            const rotateY = (deltaX * 6.5).toFixed(2);

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;

            if (glareEl) {
                const glareX = (x / rect.width) * 100;
                const glareY = (y / rect.height) * 100;
                glareEl.style.opacity = '1';
                glareEl.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.18), transparent 60%)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            if (glareEl) {
                glareEl.style.opacity = '0';
            }
        });
    });

    // ==========================================================================
    // 9. MAGNETIC BUTTON MICRO-INTERACTIONS
    // ==========================================================================
    const magneticButtons = document.querySelectorAll(
        '.btn-adv-consult, .btn-cta-solid, .btn-prestige-primary, .btn-inquire, .btn-gallery-inquire, .btn-cta-outline'
    );

    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px) scale(1.02)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px) scale(1)';
        });
    });

    // ==========================================================================
    // 10. PROPERTIES & GALLERY FILTERING ENGINES
    // ==========================================================================
    const tabBtns = document.querySelectorAll('.prop-tab-btn');
    const propCards = document.querySelectorAll('.prop-card-v2');
    const searchInput = document.querySelector('.prop-search-box input');

    if (tabBtns.length > 0 && propCards.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterText = btn.textContent.trim().toUpperCase();
                filterProperties(filterText, searchInput ? searchInput.value.toLowerCase() : '');
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const activeTab = document.querySelector('.prop-tab-btn.active');
            const filterText = activeTab ? activeTab.textContent.trim().toUpperCase() : 'ALL';
            filterProperties(filterText, e.target.value.toLowerCase());
        });
    }

    function filterProperties(category, query) {
        propCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const location = card.querySelector('.prop-location') ? card.querySelector('.prop-location').textContent.toUpperCase() : '';

            let matchesCategory = true;
            if (category.includes('ALIPORE')) matchesCategory = location.includes('ALIPORE');
            else if (category.includes('BALLYGUNGE')) matchesCategory = location.includes('BALLYGUNGE');
            else if (category.includes('EM BYPASS')) matchesCategory = location.includes('EM BYPASS');
            else if (category.includes('NEW TOWN')) matchesCategory = location.includes('NEW TOWN');
            else if (category.includes('SALT LAKE')) matchesCategory = location.includes('SALT LAKE');

            let matchesQuery = query === '' || text.includes(query);

            if (matchesCategory && matchesQuery) {
                card.style.display = 'flex';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Gallery Filter Tabs
    const galleryBtns = document.querySelectorAll('.gallery-filter-btn');
    const galleryCards = document.querySelectorAll('.gallery-card-v2');

    if (galleryBtns.length > 0 && galleryCards.length > 0) {
        galleryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                galleryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter ? btn.dataset.filter.toLowerCase() : 'all';

                galleryCards.forEach(card => {
                    const cardCat = card.dataset.category ? card.dataset.category.toLowerCase() : '';
                    if (filter === 'all' || cardCat.includes(filter)) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 250);
                    }
                });
            });
        });
    }

    // FAQ Accordion Interactivity
    const faqItems = document.querySelectorAll('.faq-item-v2');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const header = item.querySelector('.faq-header-v2');
            if (header) {
                header.addEventListener('click', () => {
                    const isOpen = item.classList.contains('active');
                    faqItems.forEach(i => i.classList.remove('active'));
                    if (!isOpen) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }
});


// ==========================================================================
// PORTAL INTERACTIVITY ENGINE (Search Hub, Showcase Filter, EMI Calculator)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {

    // 1. Search Hub Tab Switching
    const searchTabs = document.querySelectorAll('.search-tab');
    if (searchTabs.length > 0) {
        searchTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                searchTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });
    }

    // ==========================================================================
    
    // ═══════════════════════════════════════════
    // 9. FILTER TABS (simple show/hide grid cards)
    // ═══════════════════════════════════════════
    const portalFilterBtns = document.querySelectorAll('.portal-filter-btn');
    const portalPropCards  = document.querySelectorAll('#properties-grid .prop-card');

    if (portalFilterBtns.length && portalPropCards.length) {
        portalFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                portalFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;
                portalPropCards.forEach(card => {
                    const cats = card.dataset.category || '';
                    const show = filter === 'all' || cats.includes(filter);
                    card.style.display    = show ? '' : 'none';
                    card.style.opacity    = show ? '1' : '0';
                    card.style.transform  = show ? 'none' : '';
                });
            });
        });
    }

});
