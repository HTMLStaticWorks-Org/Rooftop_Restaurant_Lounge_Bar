/* ==========================================================================
   ROOFTOP RESTAURANT & LOUNGE BAR — PUBLIC WEBSITE INTERACTIONS (main.js)
   Handles: Theme, RTL, Navigation, Menu Filtering/Search/Favourites,
            Gallery Lightbox, Contact Form, Login Demo Auth & Scroll Reveals
   ========================================================================== */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     1. THEME (DARK / LIGHT) & DIRECTION (LTR / RTL) PERSISTENCE
     -------------------------------------------------------------------------- */
  const THEME_KEY = 'rooftop_theme';
  const DIR_KEY = 'rooftop_dir';

  function applyTheme(theme) {
    const validTheme = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', validTheme);
    localStorage.setItem(THEME_KEY, validTheme);

    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      const icon = btn.querySelector('i');
      const label = btn.querySelector('.theme-label');
      if (icon) {
        icon.className = validTheme === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars';
      }
      if (label) {
        label.textContent = validTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
      }
      btn.setAttribute('aria-label', validTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    });
  }

  function applyDirection(dir) {
    const validDir = dir === 'rtl' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', validDir);
    localStorage.setItem(DIR_KEY, validDir);

    document.querySelectorAll('[data-rtl-toggle]').forEach((btn) => {
      const span = btn.querySelector('.dir-label');
      if (span) {
        span.textContent = validDir === 'rtl' ? 'LTR' : 'RTL';
      } else {
        btn.textContent = validDir === 'rtl' ? 'LTR' : 'RTL';
      }
      btn.setAttribute('aria-label', validDir === 'rtl' ? 'Switch to Left-to-Right' : 'Switch to Right-to-Left');
    });
  }

  // Initialize immediately
  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  const savedDir = localStorage.getItem(DIR_KEY) || 'ltr';
  applyTheme(savedTheme);
  applyDirection(savedDir);

  /* --------------------------------------------------------------------------
     2. IMAGE FALLBACK PROTECTION (ZERO BROKEN IMAGES)
     -------------------------------------------------------------------------- */
  function attachImageFallbacks() {
    document.querySelectorAll('img').forEach((img) => {
      if (img.dataset.fallbackBound) return;
      img.dataset.fallbackBound = 'true';
      img.addEventListener('error', function () {
        const label = (this.getAttribute('alt') || 'ROOFTOP SKYLINE').replace(/[<>&"']/g, '');
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
          <defs>
            <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#15171C"/>
              <stop offset="55%" stop-color="#0D0E11"/>
              <stop offset="100%" stop-color="#642F45"/>
            </linearGradient>
          </defs>
          <rect width="900" height="600" fill="url(#g)"/>
          <rect x="30" y="30" width="840" height="540" fill="none" stroke="#D6B878" stroke-opacity="0.35" stroke-width="1.5"/>
          <path d="M120 460 H780 M220 460 V310 L280 280 V460 M340 460 V210 L420 175 V460 M470 460 V250 L550 220 V460 M600 460 V320 L670 300 V460" stroke="#D6B878" stroke-opacity="0.28" stroke-width="2" fill="none"/>
          <text x="450" y="290" text-anchor="middle" fill="#D6B878" font-family="Georgia, serif" font-size="28" letter-spacing="4">ROOFTOP</text>
          <text x="450" y="330" text-anchor="middle" fill="#F4EFE6" font-family="sans-serif" font-size="14" letter-spacing="2">${label.slice(0, 48)}</text>
        </svg>`;
        this.src = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. COMPLETE MENU DATA (SECTION 12)
     -------------------------------------------------------------------------- */
  const MENU_ITEMS = [
    // Starters
    {
      id: 'st-1',
      name: 'Truffle Parmesan Fries',
      category: 'Starters',
      price: 680,
      veg: true,
      image: 'assets/images/truffle-fries.jpg',
      desc: 'Hand-cut crispy artisanal potatoes tossed in white truffle oil, 24-month aged Parmigiano-Reggiano and fresh rosemary.'
    },
    {
      id: 'st-2',
      name: 'Crispy Calamari',
      category: 'Starters',
      price: 890,
      veg: false,
      image: 'assets/images/crispy-calamari.jpg',
      desc: 'Lightly dusted tender squid rings served with charred lemon, smoked paprika aioli and micro-herb garnish.'
    },
    {
      id: 'st-3',
      name: 'Grilled Chicken Skewers',
      category: 'Starters',
      price: 840,
      veg: false,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80',
      desc: 'Charcoal-seared organic chicken tenders glazed with citrus-herb reduction and roasted garlic emulsion.'
    },
    {
      id: 'st-4',
      name: 'Burrata Salad',
      category: 'Starters',
      price: 950,
      veg: true,
      image: 'assets/images/burrata-salad.jpg',
      desc: 'Creamy Pugliese burrata over heirloom tomatoes, aged balsamic pearls, toasted pine nuts and sweet basil oil.'
    },
    // Signature Plates
    {
      id: 'sp-1',
      name: 'Rooftop Signature Platter',
      category: 'Signature Plates',
      price: 2450,
      veg: false,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
      desc: 'An elevated tasting ensemble of grilled prawns, herb-crusted medallions, artisanal cheeses, olives and house dips.'
    },
    {
      id: 'sp-2',
      name: 'Herb-Crusted Chicken',
      category: 'Signature Plates',
      price: 1380,
      veg: false,
      image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=80',
      desc: 'Free-range supreme of chicken in a thyme and pistachio crust with velvety parsnip purée and jus lié.'
    },
    {
      id: 'sp-3',
      name: 'Grilled Salmon',
      category: 'Signature Plates',
      price: 1850,
      veg: false,
      subCategory: 'Seafood',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80',
      desc: 'Norwegian Atlantic salmon fillet with crispy skin, saffron beurre blanc, charred asparagus and caviar pearls.'
    },
    {
      id: 'sp-4',
      name: 'Mediterranean Mezze',
      category: 'Signature Plates',
      price: 1290,
      veg: true,
      image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=900&q=80',
      desc: 'Silky truffle hummus, smoked babaganoush, whipped feta, marinated olives and warm char-grilled flatbreads.'
    },
    // Main Course & Seafood
    {
      id: 'mc-1',
      name: 'Premium Grilled Steak',
      category: 'Main Course',
      price: 2350,
      veg: false,
      image: 'assets/images/k-AcZ5I_xCdz.jpg',
      desc: 'Prime tenderloin seared to perfection with bone-marrow herb butter, fondant potato and red wine reduction.'
    },
    {
      id: 'mc-2',
      name: 'Creamy Mushroom Risotto',
      category: 'Main Course',
      price: 1250,
      veg: true,
      image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=900&q=80',
      desc: 'Acquerello carnaroli rice slow-cooked with porcini, chanterelles, mascarpone and crisp sage leaves.'
    },
    {
      id: 'mc-3',
      name: 'Pan-Seared Sea Bass',
      category: 'Seafood',
      price: 1920,
      veg: false,
      subCategory: 'Main Course',
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80',
      desc: 'Wild line-caught sea bass over fennel purée, citrus segments, caper brown butter and samphire.'
    },
    {
      id: 'mc-4',
      name: 'Gourmet Pasta',
      category: 'Main Course',
      price: 1180,
      veg: true,
      image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281298?auto=format&fit=crop&w=900&q=80',
      desc: 'Hand-rolled artisanal tagliolini in a velvety saffron-garlic emulsion topped with toasted pangrattato.'
    },
    {
      id: 'sf-2',
      name: 'Chargrilled King Prawns',
      category: 'Seafood',
      price: 2100,
      veg: false,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=80',
      desc: 'Jumbo tiger prawns flambéed with garlic-lemon herb butter, served with grilled sourdough and sea salt.'
    },
    // Vegetarian
    {
      id: 'vg-1',
      name: 'Roasted Vegetable Bowl',
      category: 'Vegetarian',
      price: 980,
      veg: true,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
      desc: 'Charred baby carrots, heirloom beets, roasted squash, quinoa tabbouleh and tahini-pomegranate glaze.'
    },
    {
      id: 'vg-2',
      name: 'Wild Mushroom Risotto',
      category: 'Vegetarian',
      price: 1280,
      veg: true,
      image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=900&q=80',
      desc: 'Foraged forest mushrooms, black truffle shavings, aged parmesan crisp and cold-pressed olive oil.'
    },
    {
      id: 'vg-3',
      name: 'Grilled Halloumi Salad',
      category: 'Vegetarian',
      price: 920,
      veg: true,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80',
      desc: 'Seared Cypriot halloumi with baby arugula, roasted figs, candied walnuts and citrus honey vinaigrette.'
    },
    // Signature Cocktails
    {
      id: 'ck-1',
      name: 'Golden Hour Martini',
      category: 'Signature Cocktails',
      price: 950,
      veg: true,
      image: 'assets/images/yUOzSeD2BsRG.jpg',
      desc: 'Small-batch botanical gin, saffron-infused dry vermouth, elderflower mist and a 24k edible gold leaf garnish.'
    },
    {
      id: 'ck-2',
      name: 'Midnight Mojito',
      category: 'Signature Cocktails',
      price: 880,
      veg: true,
      image: 'assets/images/CXjp2a6ti1uM.jpg',
      desc: 'Dark aged Caribbean rum, muddled blackberries, fresh garden mint, lime zest and sparkling artisanal soda.'
    },
    {
      id: 'ck-3',
      name: 'Skyline Spritz',
      category: 'Signature Cocktails',
      price: 920,
      veg: true,
      image: 'assets/images/eG7CpLAfXSvX.jpg',
      desc: 'Artisanal blood-orange aperitivo, crisp vintage prosecco, rosemary sprig and dehydrated citrus wheel.'
    },
    {
      id: 'ck-4',
      name: 'Rooftop Old Fashioned',
      category: 'Signature Cocktails',
      price: 1050,
      veg: true,
      image: 'assets/images/huZ5234stz9n.jpg',
      desc: 'Single-barrel bourbon infused with toasted oak smoke, aromatic bitters, demerara syrup and orange peel.'
    },
    // Mocktails
    {
      id: 'mk-1',
      name: 'Sunset Cooler',
      category: 'Mocktails',
      price: 520,
      veg: true,
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80',
      desc: 'Fresh passionfruit nectar, blood orange juice, ginger blossom tonic and crushed ice.'
    },
    {
      id: 'mk-2',
      name: 'Citrus Garden',
      category: 'Mocktails',
      price: 540,
      veg: true,
      image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=900&q=80',
      desc: 'Cold-pressed yuzu, cucumber ribbons, basil hydrosol and elderflower sparkling water.'
    },
    {
      id: 'mk-3',
      name: 'Berry Breeze',
      category: 'Mocktails',
      price: 520,
      veg: true,
      image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=900&q=80',
      desc: 'Muddled wild raspberries, hibiscus tea infusion, kaffir lime leaf and artisanal soda.'
    },
    // Desserts
    {
      id: 'ds-1',
      name: 'Chocolate Fondant',
      category: 'Desserts',
      price: 780,
      veg: true,
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80',
      desc: 'Warm 70% Valrhona dark chocolate lava cake with Madagascar vanilla bean gelato and gold-dusted tuile.'
    },
    {
      id: 'ds-2',
      name: 'Classic Tiramisu',
      category: 'Desserts',
      price: 740,
      veg: true,
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=900&q=80',
      desc: 'Savoiardi biscuits soaked in single-origin espresso, layered with whipped mascarponezabaglione and cocoa.'
    },
    {
      id: 'ds-3',
      name: 'Vanilla Panna Cotta',
      category: 'Desserts',
      price: 690,
      veg: true,
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80',
      desc: 'Silky Tahitian vanilla cream crowned with wild berry compote, pistachio crumble and micro-mint.'
    }
  ];

  /* --------------------------------------------------------------------------
     4. HEADER, MOBILE MENU & SCROLL REVEAL INITIALIZATION
     -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    // Re-apply theme & dir to bind icons
    applyTheme(localStorage.getItem(THEME_KEY) || 'dark');
    applyDirection(localStorage.getItem(DIR_KEY) || 'ltr');

    // Theme toggle click handlers
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    });

    // RTL toggle click handlers
    document.querySelectorAll('[data-rtl-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('dir') || 'ltr';
        applyDirection(current === 'ltr' ? 'rtl' : 'ltr');
      });
    });

    // Sticky Header Scroll State
    const header = document.querySelector('.site-header');
    if (header) {
      const updateHeader = () => {
        if (window.scrollY > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      };
      updateHeader();
      window.addEventListener('scroll', updateHeader, { passive: true });
    }

    // Mobile Navigation Drawer
    const hamburgerBtn = document.getElementById('mobileMenuOpenBtn');
    const mobileCloseBtn = document.getElementById('mobileMenuCloseBtn');
    const mobileDrawer = document.getElementById('mobileMenuDrawer');
    const mobileBackdrop = document.getElementById('mobileMenuBackdrop');

    function closeMobileMenu() {
      if (mobileDrawer) mobileDrawer.classList.remove('open');
      if (mobileBackdrop) mobileBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }

    function openMobileMenu() {
      if (mobileDrawer) mobileDrawer.classList.add('open');
      if (mobileBackdrop) mobileBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', openMobileMenu);
    if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileMenu);
    if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileMenu);

    if (mobileDrawer) {
      mobileDrawer.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMobileMenu);
      });
    }

    // Scroll Reveal Animations (Up, Left, Right, Scale) & Animated Counters
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
    if ('IntersectionObserver' in window && revealEls.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      revealEls.forEach((el) => observer.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add('revealed'));
    }

    // Animated Number Counters
    const counterEls = document.querySelectorAll('[data-counter]');
    if ('IntersectionObserver' in window && counterEls.length > 0) {
      const counterObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target;
              const target = parseInt(el.getAttribute('data-counter'), 10) || 0;
              const suffix = el.getAttribute('data-suffix') || '';
              const duration = 1600;
              const startTime = performance.now();
              const step = (now) => {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target).toLocaleString('en-IN') + suffix;
                if (progress < 1) requestAnimationFrame(step);
              };
              requestAnimationFrame(step);
              counterObserver.unobserve(el);
            }
          });
        },
        { threshold: 0.3 }
      );
      counterEls.forEach((el) => counterObserver.observe(el));
    }

    // Initialize Page-Specific Modules
    initMenuPage();
    initHomeMenuHighlights();
    initGalleryLightbox();
    initContactForm();
    initLoginPage();
    initSignupPage();
    initEventModalTriggers();
    initScrollTopButton();
    attachImageFallbacks();
  });

  /* --------------------------------------------------------------------------
     4B. GLOBAL FLOATING BACK-TO-TOP BUTTON (ALL PAGES)
     -------------------------------------------------------------------------- */
  function initScrollTopButton() {
    let btn = document.getElementById('scrollTopBtn');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'scrollTopBtn';
      btn.className = 'scroll-top-btn';
      btn.setAttribute('aria-label', 'Scroll to top');
      btn.setAttribute('title', 'Back to Top');
      btn.innerHTML = '<i class="bi bi-arrow-up"></i>';
      document.body.appendChild(btn);
    }

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --------------------------------------------------------------------------
     5. HOME PAGE MENU HIGHLIGHTS FILTER (index.html Section 3)
     -------------------------------------------------------------------------- */
  function initHomeMenuHighlights() {
    const homeTabs = document.querySelectorAll('[data-home-menu-tab]');
    const homeItems = document.querySelectorAll('[data-home-menu-item]');
    if (!homeTabs.length || !homeItems.length) return;

    homeTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        homeTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        const targetCat = tab.getAttribute('data-home-menu-tab');

        homeItems.forEach((item) => {
          const itemCat = item.getAttribute('data-home-menu-item');
          if (targetCat === 'all' || itemCat === targetCat) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* --------------------------------------------------------------------------
     6. MENU PAGE ENGINE (menu.html — Filters, Search, Favourites, Details Modal)
     -------------------------------------------------------------------------- */
  function initMenuPage() {
    const menuGrid = document.getElementById('rooftopMenuGrid');
    if (!menuGrid) return;

    const FAV_KEY = 'rooftop_fav_menu';
    let favIds = JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
    let currentCategory = 'All';
    let searchQuery = '';

    const searchInput = document.getElementById('menuSearchInput');
    const filterButtons = document.querySelectorAll('[data-menu-category]');
    const favCountBadge = document.getElementById('favMenuCount');
    const emptyState = document.getElementById('menuEmptyState');

    function updateFavBadge() {
      if (favCountBadge) {
        favCountBadge.textContent = favIds.length;
      }
    }

    function renderMenu() {
      const filtered = MENU_ITEMS.filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(searchQuery) ||
          item.desc.toLowerCase().includes(searchQuery) ||
          item.category.toLowerCase().includes(searchQuery);

        if (!matchesSearch) return false;
        if (currentCategory === 'All') return true;
        if (currentCategory === 'Favourites') return favIds.includes(item.id);
        if (currentCategory === 'Vegetarian') return item.veg === true;
        return item.category === currentCategory || item.subCategory === currentCategory;
      });

      if (filtered.length === 0) {
        menuGrid.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
      }

      if (emptyState) emptyState.style.display = 'none';

      menuGrid.innerHTML = filtered
        .map((item) => {
          const isFav = favIds.includes(item.id);
          return `
          <article class="menu-card" data-item-id="${item.id}">
            <div class="menu-card-media">
              <img src="${item.image}" alt="${item.name}" loading="lazy">
              <div class="menu-card-badges">
                <span class="badge-gold" style="background-color: rgba(13, 14, 17, 0.94) !important; color: #FFFFFF !important; border: 1.5px solid #D6B878 !important; font-weight: 700 !important; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);">${item.category}</span>
                ${item.veg ? '<span class="veg-indicator" style="background-color: rgba(13, 14, 17, 0.94) !important; color: #5CE6A0 !important; border: 1.5px solid #35A66E !important; font-weight: 700 !important; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);"><i class="bi bi-circle-fill" style="font-size:0.45rem;"></i> VEG</span>' : ''}
              </div>
              <button type="button" class="menu-fav-btn ${isFav ? 'active' : ''}" data-fav-toggle="${item.id}" aria-label="Save ${item.name} to favourites" title="Add to Favourites">
                <i class="bi ${isFav ? 'bi-heart-fill' : 'bi-heart'}"></i>
              </button>
            </div>
            <div class="menu-card-body">
              <div class="menu-card-header">
                <h3 class="menu-card-title">${item.name}</h3>
                <span class="menu-card-price">₹${item.price.toLocaleString('en-IN')}</span>
              </div>
              <p class="mb-3 flex-grow-1" style="font-size:0.9rem;">${item.desc}</p>
              <div class="d-flex justify-content-between align-items-center pt-2 border-top" style="border-color: var(--subtle-border) !important;">
                <button type="button" class="link-gold-underline bg-transparent border-0 p-0" data-menu-detail="${item.id}">
                  Tasting Notes <i class="bi bi-arrow-up-right"></i>
                </button>
                <span class="text-uppercase" style="font-size:0.68rem; letter-spacing:0.14em; color:var(--text-muted);">Demo INR Price</span>
              </div>
            </div>
          </article>`;
        })
        .join('');

      attachImageFallbacks();
    }

    // Category filter click
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-menu-category');
        renderMenu();
      });
    });

    // Search input
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        renderMenu();
      });
    }

    // Reset filter button
    const resetBtn = document.getElementById('resetMenuFilterBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentCategory = 'All';
        searchQuery = '';
        if (searchInput) searchInput.value = '';
        filterButtons.forEach((b) => {
          b.classList.toggle('active', b.getAttribute('data-menu-category') === 'All');
        });
        renderMenu();
      });
    }

    // Delegated clicks for Favourite toggle and Tasting Notes modal
    menuGrid.addEventListener('click', (e) => {
      const favBtn = e.target.closest('[data-fav-toggle]');
      if (favBtn) {
        const id = favBtn.getAttribute('data-fav-toggle');
        if (favIds.includes(id)) {
          favIds = favIds.filter((x) => x !== id);
        } else {
          favIds.push(id);
        }
        localStorage.setItem(FAV_KEY, JSON.stringify(favIds));
        updateFavBadge();
        renderMenu();
        return;
      }

      const detailBtn = e.target.closest('[data-menu-detail]');
      if (detailBtn) {
        const id = detailBtn.getAttribute('data-menu-detail');
        const item = MENU_ITEMS.find((m) => m.id === id);
        if (item) openMenuDetailModal(item);
      }
    });

    function openMenuDetailModal(item) {
      const modal = document.getElementById('menuDetailModal');
      if (!modal) return;
      document.getElementById('modalDishImg').src = item.image;
      document.getElementById('modalDishImg').alt = item.name;
      document.getElementById('modalDishCat').textContent = item.category;
      document.getElementById('modalDishTitle').textContent = item.name;
      document.getElementById('modalDishPrice').textContent = `₹${item.price.toLocaleString('en-IN')}`;
      document.getElementById('modalDishDesc').textContent = item.desc;
      document.getElementById('modalDishVeg').innerHTML = item.veg
        ? '<span class="veg-indicator"><i class="bi bi-circle-fill" style="font-size:0.45rem;"></i> Vegetarian Selection</span>'
        : '<span class="badge-gold">Chef Specialty</span>';
      modal.classList.add('open');
    }

    const closeModalBtn = document.getElementById('closeMenuModalBtn');
    const menuDetailModal = document.getElementById('menuDetailModal');
    if (closeModalBtn && menuDetailModal) {
      closeModalBtn.addEventListener('click', () => menuDetailModal.classList.remove('open'));
      menuDetailModal.addEventListener('click', (e) => {
        if (e.target === menuDetailModal) menuDetailModal.classList.remove('open');
      });
    }

    updateFavBadge();
    renderMenu();
  }

  /* --------------------------------------------------------------------------
     7. GALLERY PAGE FILTER & LIGHTBOX (gallery.html — Section 14)
     -------------------------------------------------------------------------- */
  function initGalleryLightbox() {
    const galleryContainer = document.getElementById('rooftopGalleryGrid');
    if (!galleryContainer) return;

    const filterBtns = document.querySelectorAll('[data-gallery-filter]');
    const allItems = Array.from(galleryContainer.querySelectorAll('.gallery-item'));
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCategory = document.getElementById('lightboxCategory');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const prevBtn = document.getElementById('lightboxPrevBtn');
    const nextBtn = document.getElementById('lightboxNextBtn');
    const closeBtn = document.getElementById('lightboxCloseBtn');

    let visibleItems = [...allItems];
    let currentIndex = 0;

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.getAttribute('data-gallery-filter');

        visibleItems = [];
        allItems.forEach((item) => {
          const itemCat = item.getAttribute('data-category');
          if (category === 'All' || itemCat === category) {
            item.style.display = '';
            visibleItems.push(item);
          } else {
            item.style.display = 'none';
          }
        });
      });
    });

    function showLightboxSlide(idx) {
      if (!visibleItems.length) return;
      currentIndex = (idx + visibleItems.length) % visibleItems.length;
      const item = visibleItems[currentIndex];
      const img = item.querySelector('img');
      const title = item.getAttribute('data-title') || img.alt;
      const cat = item.getAttribute('data-category') || 'Rooftop';

      lightboxImg.src = img.src;
      lightboxImg.alt = title;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxCategory) lightboxCategory.textContent = cat;
      if (lightboxCounter) lightboxCounter.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    allItems.forEach((item) => {
      item.addEventListener('click', () => {
        const idx = visibleItems.indexOf(item);
        showLightboxSlide(idx >= 0 ? idx : 0);
      });
    });

    if (prevBtn) prevBtn.addEventListener('click', () => showLightboxSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => showLightboxSlide(currentIndex + 1));
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (!lightbox || !lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showLightboxSlide(currentIndex - 1);
      if (e.key === 'ArrowRight') showLightboxSlide(currentIndex + 1);
    });
  }

  /* --------------------------------------------------------------------------
     8. EVENTS PAGE QUICK SPOTLIGHT MODAL (events.html — Section 13)
     -------------------------------------------------------------------------- */
  function initEventModalTriggers() {
    const eventModal = document.getElementById('eventSpotlightModal');
    if (!eventModal) return;

    document.querySelectorAll('[data-event-spotlight]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-event-title') || 'Skyline Event Night';
        const date = btn.getAttribute('data-event-date') || 'Every Weekend (Demo Date)';
        const time = btn.getAttribute('data-event-time') || '8:00 PM Onwards';
        const desc = btn.getAttribute('data-event-desc') || 'Experience curated music and skyline cocktails.';
        document.getElementById('spotlightEventTitle').textContent = title;
        document.getElementById('spotlightEventMeta').textContent = `${date} • ${time}`;
        document.getElementById('spotlightEventDesc').textContent = desc;
        eventModal.classList.add('open');
      });
    });

    const closeBtn = document.getElementById('closeEventSpotlightBtn');
    if (closeBtn) closeBtn.addEventListener('click', () => eventModal.classList.remove('open'));
    eventModal.addEventListener('click', (e) => {
      if (e.target === eventModal) eventModal.classList.remove('open');
    });
  }

  /* --------------------------------------------------------------------------
     9. CONTACT PAGE FORM VALIDATION (contact.html — Section 16)
     -------------------------------------------------------------------------- */
  function initContactForm() {
    const contactForm = document.getElementById('rooftopContactForm');
    if (!contactForm) return;

    const feedbackBox = document.getElementById('contactFormFeedback');

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const phone = document.getElementById('contactPhone').value.trim();
      const subject = document.getElementById('contactSubject').value.trim();
      const message = document.getElementById('contactMessage').value.trim();

      if (!name || !email || !phone || !subject || !message) {
        if (feedbackBox) {
          feedbackBox.style.display = 'block';
          feedbackBox.className = 'p-3 mb-3 border border-danger text-danger';
          feedbackBox.innerHTML = '<i class="bi bi-exclamation-triangle me-2"></i>Please complete all required fields before sending your enquiry.';
        }
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        if (feedbackBox) {
          feedbackBox.style.display = 'block';
          feedbackBox.className = 'p-3 mb-3 border border-danger text-danger';
          feedbackBox.innerHTML = '<i class="bi bi-exclamation-triangle me-2"></i>Please enter a valid email address.';
        }
        return;
      }

      if (feedbackBox) {
        feedbackBox.style.display = 'block';
        feedbackBox.className = 'p-4 mb-3';
        feedbackBox.style.background = 'rgba(214, 184, 120, 0.14)';
        feedbackBox.style.border = '1px solid var(--champagne-gold)';
        feedbackBox.innerHTML = `
          <div class="d-flex align-items-start gap-3">
            <i class="bi bi-check2-circle fs-3" style="color:var(--champagne-gold);"></i>
            <div>
              <h4 class="h5 mb-1">Enquiry Received (Demo Confirmation)</h4>
              <p class="mb-0 small">Thank you, <strong>${name}</strong>. Your message regarding "<em>${subject}</em>" has been recorded in this frontend prototype.</p>
            </div>
          </div>`;
      }
      contactForm.reset();
    });
  }

  /* --------------------------------------------------------------------------
     10. GUEST LOGIN PORTAL (login.html — Section 17)
     -------------------------------------------------------------------------- */
  function initLoginPage() {
    const loginForm = document.getElementById('guestLoginForm');
    if (!loginForm) return;

    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const togglePassBtn = document.getElementById('togglePasswordBtn');
    const fillDemoBtn = document.getElementById('fillDemoCredentialsBtn');
    const feedbackEl = document.getElementById('loginFeedbackMsg');
    const createAccBtn = document.getElementById('createAccountDemoBtn');
    const forgotPassLink = document.getElementById('forgotPasswordDemoLink');

    if (togglePassBtn && passwordInput) {
      togglePassBtn.addEventListener('click', () => {
        const isPass = passwordInput.type === 'password';
        passwordInput.type = isPass ? 'text' : 'password';
        togglePassBtn.innerHTML = isPass ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
      });
    }

    if (fillDemoBtn) {
      fillDemoBtn.addEventListener('click', () => {
        emailInput.value = 'guest@example.com';
        passwordInput.value = 'guest123';
        if (feedbackEl) {
          feedbackEl.style.display = 'block';
          feedbackEl.className = 'p-3 mb-3 small';
          feedbackEl.style.background = 'rgba(214, 184, 120, 0.14)';
          feedbackEl.style.border = '1px solid var(--champagne-gold)';
          feedbackEl.innerHTML = '<i class="bi bi-stars me-2" style="color:var(--champagne-gold);"></i>Demo guest credentials populated. Click <strong>SIGN IN</strong> to enter your portal.';
        }
      });
    }

    if (forgotPassLink) {
      forgotPassLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (feedbackEl) {
          feedbackEl.style.display = 'block';
          feedbackEl.className = 'p-3 mb-3 small';
          feedbackEl.style.background = 'rgba(214, 184, 120, 0.14)';
          feedbackEl.style.border = '1px solid var(--champagne-gold)';
          feedbackEl.innerHTML = '<i class="bi bi-info-circle me-2" style="color:var(--champagne-gold);"></i><strong>Frontend Demo Notice:</strong> Use <code>guest@example.com</code> and password <code>guest123</code> to sign in.';
        }
      });
    }

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = emailInput.value.trim().toLowerCase();
      const pass = passwordInput.value.trim();

      if (!email || !pass) {
        feedbackEl.style.display = 'block';
        feedbackEl.className = 'p-3 mb-3 small text-danger border border-danger';
        feedbackEl.innerHTML = '<i class="bi bi-exclamation-octagon me-2"></i>Please enter both your email address and password.';
        return;
      }

      if (email === 'guest@example.com' && pass === 'guest123') {
        feedbackEl.style.display = 'block';
        feedbackEl.className = 'p-3 mb-3 small';
        feedbackEl.style.background = 'rgba(92, 230, 139, 0.15)';
        feedbackEl.style.border = '1px solid rgba(92, 230, 139, 0.45)';
        feedbackEl.innerHTML = '<i class="bi bi-check2-circle me-2"></i>Welcome back, Alex Morgan. Entering your Rooftop Guest Portal...';

        localStorage.setItem(
          'rooftop_session',
          JSON.stringify({ email: 'guest@example.com', name: 'Alex Morgan', tier: 'Gold Member', loggedInAt: new Date().toISOString() })
        );

        setTimeout(() => {
          window.location.href = 'dashboard.html#overview';
        }, 650);
      } else {
        feedbackEl.style.display = 'block';
        feedbackEl.className = 'p-3 mb-3 small text-danger border border-danger';
        feedbackEl.innerHTML =
          '<i class="bi bi-shield-exclamation me-2"></i>Invalid demo credentials. Please use <strong>guest@example.com</strong> and <strong>guest123</strong>.';
      }
    });
  }

  /* --------------------------------------------------------------------------
     11. GUEST SIGN UP PORTAL (signup.html)
     -------------------------------------------------------------------------- */
  function initSignupPage() {
    const signupForm = document.getElementById('guestSignupForm');
    if (!signupForm) return;

    const firstNameInput = document.getElementById('signupFirstName');
    const lastNameInput = document.getElementById('signupLastName');
    const emailInput = document.getElementById('signupEmail');
    const phoneInput = document.getElementById('signupPhone');
    const seatingInput = document.getElementById('signupSeating');
    const passInput = document.getElementById('signupPassword');
    const confirmPassInput = document.getElementById('signupConfirmPassword');
    const termsCheck = document.getElementById('signupTermsCheck');
    const togglePassBtn = document.getElementById('toggleSignupPassBtn');
    const toggleConfirmPassBtn = document.getElementById('toggleSignupConfirmPassBtn');
    const feedbackEl = document.getElementById('signupFeedbackMsg');
    const termsLink = document.getElementById('termsLink');

    if (togglePassBtn && passInput) {
      togglePassBtn.addEventListener('click', () => {
        const isPass = passInput.type === 'password';
        passInput.type = isPass ? 'text' : 'password';
        togglePassBtn.innerHTML = isPass ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
      });
    }

    if (toggleConfirmPassBtn && confirmPassInput) {
      toggleConfirmPassBtn.addEventListener('click', () => {
        const isPass = confirmPassInput.type === 'password';
        confirmPassInput.type = isPass ? 'text' : 'password';
        toggleConfirmPassBtn.innerHTML = isPass ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
      });
    }

    if (termsLink && feedbackEl) {
      termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        feedbackEl.style.display = 'block';
        feedbackEl.className = 'p-3 mb-3 small text-info border border-info';
        feedbackEl.innerHTML = '<i class="bi bi-shield-check me-2"></i><strong>Reservation Policy:</strong> Complimentary cancellations up to 2 hours prior to arrival. Gold Loyalty rewards earn 10 points per ₹100 spent.';
      });
    }

    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const firstName = firstNameInput.value.trim();
      const lastName = lastNameInput.value.trim();
      const email = emailInput.value.trim().toLowerCase();
      const phone = phoneInput.value.trim();
      const seating = seatingInput ? seatingInput.value : 'Skyline View';
      const pass = passInput.value.trim();
      const confirmPass = confirmPassInput.value.trim();

      if (!firstName || !lastName || !email || !phone || !pass || !confirmPass) {
        feedbackEl.style.display = 'block';
        feedbackEl.className = 'p-3 mb-3 small text-danger border border-danger';
        feedbackEl.innerHTML = '<i class="bi bi-exclamation-octagon me-2"></i>Please complete all required registration fields.';
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        feedbackEl.style.display = 'block';
        feedbackEl.className = 'p-3 mb-3 small text-danger border border-danger';
        feedbackEl.innerHTML = '<i class="bi bi-exclamation-triangle me-2"></i>Please enter a valid email address.';
        return;
      }

      if (pass.length < 6) {
        feedbackEl.style.display = 'block';
        feedbackEl.className = 'p-3 mb-3 small text-danger border border-danger';
        feedbackEl.innerHTML = '<i class="bi bi-shield-exclamation me-2"></i>Password must be at least 6 characters long.';
        return;
      }

      if (pass !== confirmPass) {
        feedbackEl.style.display = 'block';
        feedbackEl.className = 'p-3 mb-3 small text-danger border border-danger';
        feedbackEl.innerHTML = '<i class="bi bi-shield-exclamation me-2"></i>Passwords do not match. Please re-enter.';
        return;
      }

      if (termsCheck && !termsCheck.checked) {
        feedbackEl.style.display = 'block';
        feedbackEl.className = 'p-3 mb-3 small text-danger border border-danger';
        feedbackEl.innerHTML = '<i class="bi bi-exclamation-circle me-2"></i>Please accept the Guest Reservation Policy & Privacy Terms.';
        return;
      }

      const fullName = `${firstName} ${lastName}`.trim();
      localStorage.setItem(
        'rooftop_guest_profile_v1',
        JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          preferredSeating: seating,
          occNotifications: true,
          eventAnnouncements: true,
          resReminders: true,
          promoUpdates: true
        })
      );

      localStorage.setItem(
        'rooftop_session',
        JSON.stringify({
          email,
          name: fullName,
          tier: 'Gold Member',
          loggedInAt: new Date().toISOString()
        })
      );

      feedbackEl.style.display = 'block';
      feedbackEl.className = 'p-3 mb-3 small';
      feedbackEl.style.background = 'rgba(92, 230, 139, 0.15)';
      feedbackEl.style.border = '1px solid rgba(92, 230, 139, 0.45)';
      feedbackEl.innerHTML = `<i class="bi bi-check2-circle me-2"></i>Welcome to ROOFTOP, <strong>${fullName}</strong>! Your Gold Member account is ready. Redirecting to your Guest Portal...`;

      setTimeout(() => {
        window.location.href = 'dashboard.html#overview';
      }, 750);
    });
  }
})();
