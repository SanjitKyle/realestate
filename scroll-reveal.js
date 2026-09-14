// Smooth Scroll Reveal Animation Engine for LUXE LIVING Real Estate
document.addEventListener('DOMContentLoaded', () => {
    // Auto-target section elements for smooth scroll reveal
    const autoRevealSelectors = [
        '.two-col-img', '.two-col-text', '.about-visual-stack',
        '.section-badge', '.section-title', '.section-subtitle',
        '.about-hero-content', '.about-stat-strip',
        '.about-quote-card', '.about-timeline-wrap',
        '.contact-info-col', '.styled-form', '.cta-banner',
        '.info-item', '.map-placeholder', '.timeline-item'
    ];

    const autoStaggerSelectors = [
        '.features-grid', '.team-grid', '.properties-listing',
        '.about-stat-grid', '.about-check-grid', '.gallery-masonry',
        '.stats-row', '.gallery-grid-v2', '.amenity-grid-v2'
    ];

    autoRevealSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            if (!el.classList.contains('reveal') && !el.classList.contains('reveal-up')) {
                el.classList.add('reveal-up');
            }
        });
    });

    autoStaggerSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            if (!el.classList.contains('reveal-stagger')) {
                el.classList.add('reveal-stagger');
            }
        });
    });

    // Intersection Observer for scroll triggers
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Trigger stat counter animation if target contains numbers
                const statNums = entry.target.querySelectorAll('.about-stat-num, .stat-number');
                if (statNums.length > 0) {
                    animateNumbers(statNums);
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px'
    });

    document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger').forEach(el => {
        observer.observe(el);
    });

    // Number counting animation
    function animateNumbers(elements) {
        elements.forEach(el => {
            if (el.dataset.counted) return;
            el.dataset.counted = 'true';
            const text = el.textContent.trim();
            const numericValue = parseFloat(text.replace(/[^0-9.]/g, ''));
            if (isNaN(numericValue)) return;
            
            const prefix = text.startsWith('₹') ? '₹ ' : '';
            const suffix = text.includes('+') ? '+' : (text.includes('Cr') ? ' Cr+' : '');
            
            let start = 0;
            const duration = 1200;
            const startTime = performance.now();
            
            function step(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
                const currentNum = Math.floor(start + (numericValue - start) * easedProgress);
                
                el.textContent = `${prefix}${currentNum}${suffix}`;
                
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = text;
                }
            }
            requestAnimationFrame(step);
        });
    }

    // Property Filter Tabs Interactivity
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

    // Gallery Tab Filtering Interactivity
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

    // Lightbox Modal Interactivity
    const lightboxModal = document.getElementById('gallery-lightbox');
    if (lightboxModal) {
        const lbImg = lightboxModal.querySelector('.lightbox-img-wrap img');
        const lbTitle = lightboxModal.querySelector('.lightbox-details h3');
        const lbDesc = lightboxModal.querySelector('.lightbox-details p');
        const lbBadge = lightboxModal.querySelector('.lightbox-details .gallery-tag-badge');
        const lbClose = lightboxModal.querySelector('.lightbox-close');

        document.querySelectorAll('.gallery-card-v2').forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('img');
                const title = card.querySelector('.gallery-card-info h4');
                const desc = card.querySelector('.gallery-card-info p');
                const badge = card.querySelector('.gallery-tag-badge');

                if (img && lbImg) lbImg.src = img.src;
                if (title && lbTitle) lbTitle.textContent = title.textContent;
                if (desc && lbDesc) lbDesc.textContent = desc.textContent;
                if (badge && lbBadge) lbBadge.textContent = badge.textContent;

                lightboxModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeLightbox = () => {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (lbClose) lbClose.addEventListener('click', closeLightbox);
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
                closeLightbox();
            }
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
