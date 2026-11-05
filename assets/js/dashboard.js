/* ==========================================================================
   ROOFTOP RESTAURANT & LOUNGE BAR — GUEST DASHBOARD ENGINE (dashboard.js)
   Handles: Hash Routing, Table Booking, My Reservations (View/Edit/Cancel),
            Event Nights Discovery, Loyalty Points, Rewards Redemption,
            Reservation History Filtering, Profile Persistence & Sign Out
   ========================================================================== */

(function () {
  'use strict';

  const STORAGE_KEYS = {
    RESERVATIONS: 'rooftop_guest_reservations_v1',
    HISTORY: 'rooftop_guest_history_v1',
    LOYALTY: 'rooftop_guest_loyalty_v1',
    PROFILE: 'rooftop_guest_profile_v1',
    SAVED_EVENTS: 'rooftop_guest_events_v1',
    SESSION: 'rooftop_session'
  };

  /* --------------------------------------------------------------------------
     1. INITIAL SEED DATA (MATCHING EXACT SPECIFICATION)
     -------------------------------------------------------------------------- */
  const DEFAULT_RESERVATIONS = [
    {
      id: 'RT-8492',
      guestName: 'Alex Morgan',
      email: 'guest@example.com',
      phone: '+91 98200 00000',
      date: '2026-11-14',
      time: '20:00',
      guests: 2,
      seating: 'Skyline View',
      occasion: 'Date Night',
      status: 'Confirmed',
      requests: 'Corner table overlooking the illuminated skyline if available.'
    },
    {
      id: 'RT-8519',
      guestName: 'Alex Morgan',
      email: 'guest@example.com',
      phone: '+91 98200 00000',
      date: '2026-11-21',
      time: '21:00',
      guests: 4,
      seating: 'Lounge Seating',
      occasion: 'Celebration',
      status: 'Confirmed',
      requests: 'Near the live jazz stage.'
    }
  ];

  const DEFAULT_HISTORY = [
    { id: 'RT-7910', date: '2026-10-24', time: '20:30', guests: 2, seating: 'Skyline View', occasion: 'Anniversary', status: 'Completed', notes: 'Complimentary anniversary dessert served.' },
    { id: 'RT-7742', date: '2026-10-10', time: '19:30', guests: 4, seating: 'Outdoor Terrace', occasion: 'Business Dinner', status: 'Completed', notes: 'Quiet terrace alcove table.' },
    { id: 'RT-7518', date: '2026-09-28', time: '21:00', guests: 6, seating: 'Lounge Seating', occasion: 'Birthday', status: 'Completed', notes: 'Signature cocktail tasting pairing.' },
    { id: 'RT-7304', date: '2026-09-12', time: '20:00', guests: 2, seating: 'Indoor Dining', occasion: 'Date Night', status: 'Cancelled', notes: 'Cancelled by guest 24 hours prior.' },
    { id: 'RT-7119', date: '2026-08-29', time: '19:00', guests: 3, seating: 'Skyline View', occasion: 'Celebration', status: 'Completed', notes: 'Golden hour sunset reservation.' }
  ];

  const DEFAULT_LOYALTY = {
    points: 1850,
    tier: 'Gold Member',
    nextTier: 'Platinum',
    nextTierTarget: 2500,
    completedVisits: 12,
    redeemedIds: [],
    history: [
      { date: '24 Oct 2026', activity: 'Skyline Dinner & Signature Cocktails (RT-7910)', delta: '+240 pts' },
      { date: '10 Oct 2026', activity: 'Outdoor Terrace Business Dining (RT-7742)', delta: '+310 pts' },
      { date: '28 Sep 2026', activity: 'Lounge Celebration Evening (RT-7518)', delta: '+420 pts' },
      { date: '15 Aug 2026', activity: 'Gold Tier Welcome Milestone Bonus', delta: '+500 pts' }
    ]
  };

  const DEFAULT_PROFILE = {
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'guest@example.com',
    phone: '+91 98200 00000',
    preferredSeating: 'Skyline View',
    occNotifications: true,
    eventAnnouncements: true,
    resReminders: true,
    promoUpdates: false
  };

  const DASHBOARD_EVENTS = [
    {
      id: 'ev-1',
      title: 'Skyline Jazz Night',
      category: 'Live Jazz',
      date: 'Friday, 13 Nov 2026 (Demo)',
      time: '8:30 PM – 11:45 PM',
      image: 'assets/images/RZ25x8DjtcADh5QeWhENluw_3zAQIJsvYILDdgLY4gjlPlcpRKzR-3qlLYIrw_CWIY6112WpiWZ5favVmMtxrxRNDkXIIvAlyzOQzKfME3UT9uWGK8klU5ARIhL5zAVGY34cHg0UyWYvUqCOKKDFb7xJeGziblY8MyaEIZ-Z2_bdwbm5.jpg',
      desc: 'Contemporary saxophone and upright bass quartet performing against panoramic city lights with curated vintage cocktails.'
    },
    {
      id: 'ev-2',
      title: 'Sunset Acoustic Sessions',
      category: 'Acoustic Evening',
      date: 'Sunday, 15 Nov 2026 (Demo)',
      time: '6:00 PM – 9:30 PM',
      image: 'assets/images/AUyNX-TjOq1BqzDUzvah1E7KIeIhG6IjVkAUdhYrZEr01qk2gxDLTxHIPj4Ua7T-U9cXLfGBArXraKLPz7oAKkQwOZSutDGQjb1P8d-U4qmP2gDIPHJt0fRNCSj9vZS3vwkQBYwLThayfHtk30zPPCZl2NKXSGMuTdXdSsvWny8.jpg',
      desc: 'Unplugged soulful melodies during golden hour paired with our Golden Hour Martini and artisanal mezze platters.'
    },
    {
      id: 'ev-3',
      title: 'Rooftop DJ Experience',
      category: 'DJ & Lounge',
      date: 'Saturday, 21 Nov 2026 (Demo)',
      time: '9:30 PM – 1:30 AM',
      image: 'assets/images/Ss9y01lCzCKlU2tG9QD8VU_5Nbd1OxO7rnibxMKAlrEor2Xle9_8ckORHi_V89_v89watF-MB9LI-yoC6hLrpuusu8jcaQfatitkA9mZeGG1TBloT8HvPKCrUGyAyIrYOPb9OeexGq-NCEzTaDOQrjuEhNJD5_70bEaTjcvP8kc.jpg',
      desc: 'Deep melodic house and ambient lounge grooves under the open sky with bottle service and terrace seating.'
    },
    {
      id: 'ev-4',
      title: 'Special Celebration Nights',
      category: 'Exclusive Soirée',
      date: 'Saturday, 28 Nov 2026 (Demo)',
      time: '8:00 PM Onwards',
      image: 'assets/images/drNFxgCDI8BfXhM_YaRIJbuZDghXmxLAVrBPlcLUXvKmLEz_NIKwx92BDuFWVrZJpiNPeYammyOv4wCvu9q78PMFrR4VP-8stzR2_gpN_dO1rPoej7tTzuq7Kymc4Jkw7H6GQIdulJNvw0mSBXrnZIr2yhLmU3QiMtK9-43Due40_Zeq.jpg',
      desc: 'A bespoke five-course chef tasting menu and champagne pairing celebrating elevated metropolitan nightlife.'
    }
  ];

  const REWARDS_CATALOG = [
    {
      id: 'rw-1',
      name: 'Complimentary Signature Mocktail',
      points: 450,
      category: 'Beverage Privilege',
      desc: 'Enjoy any handcrafted zero-proof creation such as our Sunset Cooler or Citrus Garden on your next visit.'
    },
    {
      id: 'rw-2',
      name: 'Dessert Experience',
      points: 650,
      category: 'Culinary Privilege',
      desc: 'Indulge in our warm Valrhona Chocolate Fondant or Classic Tiramisu plated tableside for two guests.'
    },
    {
      id: 'rw-3',
      name: 'Exclusive Lounge Access',
      points: 900,
      category: 'VIP Access',
      desc: 'Priority sky-deck lounge seating reservation during Friday or Saturday live music and DJ showcase nights.'
    },
    {
      id: 'rw-4',
      name: 'Special Occasion Dining Offer',
      points: 1200,
      category: 'Celebration Privilege',
      desc: 'Bespoke table styling, welcome sparkling toast and chef tasting starter platter for your celebration.'
    }
  ];

  /* --------------------------------------------------------------------------
     2. STATE HELPERS
     -------------------------------------------------------------------------- */
  function loadState(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(fallback));
    } catch (e) {
      return JSON.parse(JSON.stringify(fallback));
    }
  }

  function saveState(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  let reservations = loadState(STORAGE_KEYS.RESERVATIONS, DEFAULT_RESERVATIONS);
  let historyRecords = loadState(STORAGE_KEYS.HISTORY, DEFAULT_HISTORY);
  let loyalty = loadState(STORAGE_KEYS.LOYALTY, DEFAULT_LOYALTY);
  let profile = loadState(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
  let savedEvents = loadState(STORAGE_KEYS.SAVED_EVENTS, ['ev-1']);

  /* --------------------------------------------------------------------------
     3. HASH ROUTING & SIDEBAR NAVIGATION (SECTION 18)
     -------------------------------------------------------------------------- */
  const VALID_ROUTES = [
    'overview',
    'book-table',
    'reservations',
    'events',
    'loyalty',
    'rewards',
    'history',
    'profile',
    'support'
  ];

  const ROUTE_TITLES = {
    'overview': 'Guest Overview',
    'book-table': 'Book a Table',
    'reservations': 'My Reservations',
    'events': 'Event Nights',
    'loyalty': 'My Loyalty Points',
    'rewards': 'Member Rewards',
    'history': 'Reservation History',
    'profile': 'Profile & Preferences',
    'support': 'Help & Support'
  };

  function navigateToRoute(routeHash) {
    const cleanRoute = (routeHash || '').replace(/^#/, '') || 'overview';
    const activeRoute = VALID_ROUTES.includes(cleanRoute) ? cleanRoute : 'overview';

    // Toggle active view section
    document.querySelectorAll('.dashboard-view').forEach((sec) => {
      sec.classList.toggle('active', sec.id === `view-${activeRoute}`);
    });

    // Update sidebar active state
    document.querySelectorAll('.sidebar-nav-link[data-route]').forEach((link) => {
      link.classList.toggle('active', link.getAttribute('data-route') === activeRoute);
    });

    // Update Topbar title
    const topbarTitle = document.getElementById('dashboardCurrentViewTitle');
    if (topbarTitle) {
      topbarTitle.textContent = ROUTE_TITLES[activeRoute] || 'Guest Portal';
    }

    // Close mobile sidebar if open
    closeDashboardSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeDashboardSidebar() {
    const sidebar = document.getElementById('dashboardSidebar');
    const backdrop = document.getElementById('dashboardSidebarBackdrop');
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
  }

  /* --------------------------------------------------------------------------
     4. RENDER FUNCTIONS FOR ALL DASHBOARD VIEWS
     -------------------------------------------------------------------------- */
  function renderAllDashboardViews() {
    renderProfileHeader();
    renderOverview();
    renderReservationsList();
    renderEventsSection();
    renderLoyaltySection();
    renderRewardsSection();
    renderHistoryTable();
    populateProfileForm();
  }

  function renderProfileHeader() {
    const fullName = `${profile.firstName} ${profile.lastName}`.trim();
    const initials = `${(profile.firstName || 'A')[0]}${(profile.lastName || 'M')[0]}`.toUpperCase();

    document.querySelectorAll('.js-guest-fullname').forEach((el) => (el.textContent = fullName));
    document.querySelectorAll('.js-guest-firstname').forEach((el) => (el.textContent = profile.firstName.toUpperCase()));
    document.querySelectorAll('.js-guest-initials').forEach((el) => (el.textContent = initials));
  }

  function renderOverview() {
    const activeRes = reservations.filter((r) => r.status === 'Confirmed');
    const availableRewardsCount = REWARDS_CATALOG.filter((rw) => !loyalty.redeemedIds.includes(rw.id)).length;

    const kpiUpcoming = document.getElementById('kpiUpcomingCount');
    const kpiVisits = document.getElementById('kpiCompletedVisits');
    const kpiPoints = document.getElementById('kpiLoyaltyPoints');
    const kpiRewards = document.getElementById('kpiAvailableRewards');

    if (kpiUpcoming) kpiUpcoming.textContent = activeRes.length;
    if (kpiVisits) kpiVisits.textContent = loyalty.completedVisits;
    if (kpiPoints) kpiPoints.textContent = loyalty.points.toLocaleString('en-IN');
    if (kpiRewards) kpiRewards.textContent = availableRewardsCount;

    // Next Reservation Spotlight
    const nextResBox = document.getElementById('overviewNextReservationBox');
    if (nextResBox) {
      if (activeRes.length > 0) {
        const next = activeRes[0];
        nextResBox.innerHTML = `
          <div class="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
            <div>
              <span class="badge-gold mb-2"><i class="bi bi-calendar2-check"></i> Reference: ${next.id} (Demo)</span>
              <h4 class="h3 mb-1">${next.seating} Table for ${next.guests} Guests</h4>
              <p class="mb-0 small">Occasion: <strong class="text-white">${next.occasion}</strong></p>
            </div>
            <span class="status-pill status-confirmed"><i class="bi bi-check-circle-fill"></i> ${next.status}</span>
          </div>
          <div class="row g-3 pt-3 border-top" style="border-color: var(--subtle-border) !important;">
            <div class="col-sm-4">
              <div class="small text-uppercase" style="color:var(--champagne-gold); font-size:0.7rem; letter-spacing:0.14em;">Date</div>
              <div class="fw-semibold">${next.date}</div>
            </div>
            <div class="col-sm-4">
              <div class="small text-uppercase" style="color:var(--champagne-gold); font-size:0.7rem; letter-spacing:0.14em;">Time</div>
              <div class="fw-semibold">${next.time}</div>
            </div>
            <div class="col-sm-4 text-sm-end">
              <a href="#reservations" class="link-gold-underline">Manage Booking <i class="bi bi-arrow-right"></i></a>
            </div>
          </div>`;
      } else {
        nextResBox.innerHTML = `
          <p class="mb-3">You currently have no active upcoming reservations.</p>
          <a href="#book-table" class="btn-gold">Book Your Rooftop Table</a>`;
      }
    }
  }

  function renderReservationsList() {
    const container = document.getElementById('myReservationsContainer');
    if (!container) return;

    if (reservations.length === 0) {
      container.innerHTML = `
        <div class="dash-panel text-center py-5">
          <i class="bi bi-calendar-x fs-1 mb-3 d-block" style="color:var(--champagne-gold);"></i>
          <h3 class="h4">No Reservations Found</h3>
          <p class="mb-4">Reserve your table above the city to see your bookings here.</p>
          <a href="#book-table" class="btn-gold">Book a Table Now</a>
        </div>`;
      return;
    }

    container.innerHTML = `<div class="row g-4">` +
      reservations
        .map((res) => {
          const statusClass =
            res.status === 'Confirmed'
              ? 'status-confirmed'
              : res.status === 'Cancelled'
              ? 'status-cancelled'
              : 'status-completed';
          return `
          <div class="col-lg-6">
            <div class="reservation-item-card h-100">
              <div>
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                  <span class="badge-gold">${res.id} • DEMO BOOKING</span>
                  <span class="status-pill ${statusClass}">${res.status}</span>
                </div>
                <h3 class="h4 mb-2">${res.seating}</h3>
                <div class="row g-2 mb-3 small">
                  <div class="col-6"><i class="bi bi-calendar3 me-2" style="color:var(--champagne-gold);"></i><strong>Date:</strong> ${res.date}</div>
                  <div class="col-6"><i class="bi bi-clock me-2" style="color:var(--champagne-gold);"></i><strong>Time:</strong> ${res.time}</div>
                  <div class="col-6"><i class="bi bi-people me-2" style="color:var(--champagne-gold);"></i><strong>Guests:</strong> ${res.guests} Persons</div>
                  <div class="col-6"><i class="bi bi-stars me-2" style="color:var(--champagne-gold);"></i><strong>Occasion:</strong> ${res.occasion}</div>
                </div>
                ${res.requests ? `<p class="small mb-3 p-2" style="background:rgba(255,255,255,0.03); border-inline-start:2px solid var(--champagne-gold);">"${res.requests}"</p>` : ''}
              </div>
              <div class="d-flex flex-wrap gap-2 pt-3 border-top" style="border-color:var(--subtle-border) !important;">
                <button type="button" class="btn-outline-gold py-2 px-3" style="font-size:0.7rem;" data-res-action="view" data-res-id="${res.id}">
                  <i class="bi bi-eye"></i> View Details
                </button>
                ${
                  res.status !== 'Cancelled'
                    ? `<button type="button" class="btn-outline-gold py-2 px-3" style="font-size:0.7rem;" data-res-action="edit" data-res-id="${res.id}">
                        <i class="bi bi-pencil-square"></i> Edit Reservation
                      </button>
                      <button type="button" class="btn-burgundy py-2 px-3" style="font-size:0.7rem;" data-res-action="cancel" data-res-id="${res.id}">
                        <i class="bi bi-x-circle"></i> Cancel Reservation
                      </button>`
                    : ''
                }
              </div>
            </div>
          </div>`;
        })
        .join('') +
      `</div>`;
  }

  function renderEventsSection() {
    const grid = document.getElementById('dashboardEventsGrid');
    const savedList = document.getElementById('savedEventsListBox');
    if (!grid) return;

    grid.innerHTML = DASHBOARD_EVENTS.map((ev) => {
      const isSaved = savedEvents.includes(ev.id);
      return `
        <div class="col-md-6">
          <div class="event-poster-card h-100">
            <div class="event-poster-img">
              <img src="${ev.image}" alt="${ev.title}" loading="lazy">
              <div class="position-absolute top-0 start-0 m-3">
                <span class="badge-demo">${ev.category}</span>
              </div>
            </div>
            <div class="p-4 d-flex flex-column flex-grow-1">
              <div class="small mb-1" style="color:var(--champagne-gold);"><i class="bi bi-calendar-event me-1"></i> ${ev.date} • ${ev.time}</div>
              <h3 class="h4 mb-2">${ev.title}</h3>
              <p class="small mb-4 flex-grow-1">${ev.desc}</p>
              <div class="d-flex flex-wrap gap-2">
                <button type="button" class="btn-gold py-2 px-3" style="font-size:0.7rem;" data-ev-reserve="${ev.title}">
                  Reserve for Event
                </button>
                <button type="button" class="btn-outline-gold py-2 px-3" style="font-size:0.7rem;" data-ev-details="${ev.id}">
                  View Event Details
                </button>
                <button type="button" class="icon-btn ms-auto" data-ev-save="${ev.id}" title="Save Event Interest">
                  <i class="bi ${isSaved ? 'bi-bookmark-check-fill' : 'bi-bookmark-plus'}"></i>
                </button>
              </div>
            </div>
          </div>
        </div>`;
    }).join('');

    if (savedList) {
      const savedItems = DASHBOARD_EVENTS.filter((e) => savedEvents.includes(e.id));
      if (savedItems.length === 0) {
        savedList.innerHTML = '<p class="small mb-0">No event nights bookmarked yet. Click the bookmark icon on any event above to save your interest.</p>';
      } else {
        savedList.innerHTML = savedItems
          .map(
            (item) => `
            <div class="d-flex justify-content-between align-items-center py-2 border-bottom" style="border-color:var(--subtle-border) !important;">
              <div>
                <strong class="d-block">${item.title}</strong>
                <span class="small" style="color:var(--champagne-gold);">${item.date} • ${item.time}</span>
              </div>
              <button type="button" class="btn-outline-gold py-1 px-3" style="font-size:0.68rem;" data-ev-reserve="${item.title}">Book Table</button>
            </div>`
          )
          .join('');
      }
    }
  }

  function renderLoyaltySection() {
    const ptsDisplays = document.querySelectorAll('.js-loyalty-points-val');
    ptsDisplays.forEach((el) => (el.textContent = `${loyalty.points.toLocaleString('en-IN')} Loyalty Points`));

    const pct = Math.min(100, Math.round((loyalty.points / loyalty.nextTierTarget) * 100));
    const remaining = Math.max(0, loyalty.nextTierTarget - loyalty.points);

    const progressBars = document.querySelectorAll('.js-loyalty-progress-bar');
    progressBars.forEach((bar) => (bar.style.width = `${pct}%`));

    const remText = document.getElementById('loyaltyPointsRemainingText');
    if (remText) {
      remText.textContent =
        remaining > 0
          ? `${remaining.toLocaleString('en-IN')} points away from Platinum Tier (${pct}% complete)`
          : 'Platinum Tier Threshold Reached! (Demo Milestone)';
    }

    const historyBody = document.getElementById('loyaltyHistoryList');
    if (historyBody) {
      historyBody.innerHTML = loyalty.history
        .map(
          (row) => `
          <div class="d-flex justify-content-between align-items-center py-3 border-bottom" style="border-color:var(--subtle-border) !important;">
            <div>
              <div class="fw-semibold">${row.activity}</div>
              <div class="small" style="color:var(--text-muted);">${row.date} • Sample Demo Record</div>
            </div>
            <span class="badge-gold">${row.delta}</span>
          </div>`
        )
        .join('');
    }
  }

  function renderRewardsSection() {
    const grid = document.getElementById('rewardsCatalogGrid');
    if (!grid) return;

    grid.innerHTML = REWARDS_CATALOG.map((rw) => {
      const isRedeemed = loyalty.redeemedIds.includes(rw.id);
      const canAfford = loyalty.points >= rw.points;

      return `
        <div class="col-md-6">
          <div class="dash-panel h-100 mb-0 d-flex flex-column justify-content-between">
            <div>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="badge-gold">${rw.category}</span>
                <span class="fw-bold" style="color:var(--champagne-gold); font-family:var(--font-heading); font-size:1.35rem;">
                  ${rw.points.toLocaleString('en-IN')} Pts
                </span>
              </div>
              <h3 class="h4 mb-2">${rw.name}</h3>
              <p class="small mb-4">${rw.desc}</p>
            </div>
            <div class="pt-3 border-top d-flex justify-content-between align-items-center" style="border-color:var(--subtle-border) !important;">
              <span class="small text-uppercase" style="font-size:0.68rem; letter-spacing:0.12em; color:var(--text-muted);">Frontend Demo Privilege</span>
              ${
                isRedeemed
                  ? `<span class="status-pill status-confirmed"><i class="bi bi-check2-all"></i> Redeemed (Demo)</span>`
                  : `<button type="button" class="btn-gold py-2 px-3" style="font-size:0.72rem;" data-redeem-reward="${rw.id}" ${!canAfford ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>
                      Redeem Privilege
                    </button>`
              }
            </div>
          </div>
        </div>`;
    }).join('');
  }

  function renderHistoryTable() {
    const tbody = document.getElementById('historyTableBody');
    if (!tbody) return;

    const query = (document.getElementById('historySearchInput')?.value || '').trim().toLowerCase();
    const statusFilter = document.getElementById('historyStatusFilter')?.value || 'All';
    const dateFilter = document.getElementById('historyDateFilter')?.value || '';

    const combined = [...historyRecords];

    const filtered = combined.filter((item) => {
      const matchQuery =
        item.id.toLowerCase().includes(query) ||
        item.seating.toLowerCase().includes(query) ||
        (item.occasion || '').toLowerCase().includes(query);
      const matchStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchDate = !dateFilter || item.date === dateFilter;
      return matchQuery && matchStatus && matchDate;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4">No past reservation records match your current filters.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered
      .map((rec) => {
        const pillClass = rec.status === 'Completed' ? 'status-completed' : rec.status === 'Cancelled' ? 'status-cancelled' : 'status-confirmed';
        return `
          <tr>
            <td data-label="Reservation ID"><strong style="color:var(--champagne-gold);">${rec.id}</strong></td>
            <td data-label="Date">${rec.date}</td>
            <td data-label="Time">${rec.time}</td>
            <td data-label="Guests">${rec.guests} Guests</td>
            <td data-label="Seating">${rec.seating}</td>
            <td data-label="Status"><span class="status-pill ${pillClass}">${rec.status}</span></td>
            <td data-label="Action">
              <button type="button" class="link-gold-underline bg-transparent border-0 p-0" data-history-detail="${rec.id}">
                View Details
              </button>
            </td>
          </tr>`;
      })
      .join('');
  }

  function populateProfileForm() {
    const fName = document.getElementById('profFirstName');
    if (!fName) return;
    fName.value = profile.firstName || '';
    document.getElementById('profLastName').value = profile.lastName || '';
    document.getElementById('profEmail').value = profile.email || '';
    document.getElementById('profPhone').value = profile.phone || '';
    document.getElementById('profSeating').value = profile.preferredSeating || 'Skyline View';
    document.getElementById('prefOccasion').checked = !!profile.occNotifications;
    document.getElementById('prefEvents').checked = !!profile.eventAnnouncements;
    document.getElementById('prefReminders').checked = !!profile.resReminders;
    document.getElementById('prefPromos').checked = !!profile.promoUpdates;
  }

  /* --------------------------------------------------------------------------
     5. INTERACTIVE EVENT BINDINGS ON DOM READY
     -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    const dashboardShell = document.querySelector('.dashboard-shell');
    if (!dashboardShell) return;

    // Set minimum date on Book a Table date input to today
    const bookDateInput = document.getElementById('bookDate');
    if (bookDateInput) {
      const todayStr = new Date().toISOString().split('T')[0];
      bookDateInput.setAttribute('min', todayStr);
      bookDateInput.value = '2026-11-18';
    }

    // Initial render & route
    renderAllDashboardViews();
    navigateToRoute(window.location.hash || '#overview');

    window.addEventListener('hashchange', () => {
      navigateToRoute(window.location.hash);
    });

    // Mobile Sidebar Toggle
    const sidebarOpenBtn = document.getElementById('dashSidebarOpenBtn');
    const sidebarCloseBtn = document.getElementById('dashSidebarCloseBtn');
    const sidebar = document.getElementById('dashboardSidebar');
    const backdrop = document.getElementById('dashboardSidebarBackdrop');

    if (sidebarOpenBtn) {
      sidebarOpenBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
        backdrop.classList.add('open');
      });
    }
    if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeDashboardSidebar);
    if (backdrop) backdrop.addEventListener('click', closeDashboardSidebar);

    // 1. BOOK A TABLE FORM SUBMISSION (Section 21)
    const bookForm = document.getElementById('dashboardBookTableForm');
    const bookFeedback = document.getElementById('bookTableFeedback');
    if (bookForm) {
      bookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const guestName = document.getElementById('bookGuestName').value.trim();
        const email = document.getElementById('bookEmail').value.trim();
        const phone = document.getElementById('bookPhone').value.trim();
        const date = document.getElementById('bookDate').value;
        const time = document.getElementById('bookTime').value;
        const guests = parseInt(document.getElementById('bookGuests').value, 10);
        const seating = document.getElementById('bookSeating').value;
        const occasion = document.getElementById('bookOccasion').value;
        const requests = document.getElementById('bookRequests').value.trim();

        if (!guestName || !email || !phone || !date || !time || !guests) {
          bookFeedback.style.display = 'block';
          bookFeedback.className = 'p-3 mb-4 border border-danger text-danger small';
          bookFeedback.innerHTML = '<i class="bi bi-exclamation-triangle me-2"></i>Please fill in all required reservation fields.';
          return;
        }

        if (guests < 1 || guests > 20) {
          bookFeedback.style.display = 'block';
          bookFeedback.className = 'p-3 mb-4 border border-danger text-danger small';
          bookFeedback.innerHTML = '<i class="bi bi-exclamation-triangle me-2"></i>Guest count must be between 1 and 20 guests.';
          return;
        }

        const today = new Date().toISOString().split('T')[0];
        if (date < today) {
          bookFeedback.style.display = 'block';
          bookFeedback.className = 'p-3 mb-4 border border-danger text-danger small';
          bookFeedback.innerHTML = '<i class="bi bi-calendar-x me-2"></i>Past dates cannot be selected. Please choose today or a future date.';
          return;
        }

        const newId = 'RT-' + Math.floor(1000 + Math.random() * 9000);
        const newReservation = {
          id: newId,
          guestName,
          email,
          phone,
          date,
          time,
          guests,
          seating,
          occasion,
          status: 'Confirmed',
          requests
        };

        reservations.unshift(newReservation);
        saveState(STORAGE_KEYS.RESERVATIONS, reservations);
        renderAllDashboardViews();

        bookFeedback.style.display = 'block';
        bookFeedback.className = 'p-4 mb-4';
        bookFeedback.style.background = 'rgba(92, 230, 139, 0.14)';
        bookFeedback.style.border = '1px solid rgba(92, 230, 139, 0.45)';
        bookFeedback.innerHTML = `
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <span class="badge-gold mb-1">DEMO RESERVATION CONFIRMED • ${newId}</span>
              <h4 class="h5 mb-1">Your Rooftop Table is Reserved (Demo Booking)</h4>
              <p class="mb-0 small">${guests} Guests • ${seating} • ${date} at ${time} (${occasion})</p>
            </div>
            <a href="#reservations" class="btn-gold py-2 px-3" style="font-size:0.72rem;">View in My Reservations</a>
          </div>`;
      });
    }

    // 2. MY RESERVATIONS ACTIONS: VIEW / EDIT / CANCEL (Section 22)
    const resContainer = document.getElementById('myReservationsContainer');
    const detailModal = document.getElementById('dashResDetailModal');
    const editModal = document.getElementById('dashResEditModal');
    const cancelModal = document.getElementById('dashResCancelModal');
    let activeReservationId = null;

    if (resContainer) {
      resContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-res-action]');
        if (!btn) return;
        const action = btn.getAttribute('data-res-action');
        const id = btn.getAttribute('data-res-id');
        const res = reservations.find((r) => r.id === id);
        if (!res) return;
        activeReservationId = id;

        if (action === 'view') {
          document.getElementById('resDetailBody').innerHTML = `
            <div class="mb-3"><span class="badge-gold">${res.id} • DEMO BOOKING</span></div>
            <div class="row g-3 small">
              <div class="col-6"><strong>Guest Name:</strong><br>${res.guestName}</div>
              <div class="col-6"><strong>Status:</strong><br>${res.status}</div>
              <div class="col-6"><strong>Date & Time:</strong><br>${res.date} at ${res.time}</div>
              <div class="col-6"><strong>Party Size:</strong><br>${res.guests} Guests</div>
              <div class="col-6"><strong>Seating Area:</strong><br>${res.seating}</div>
              <div class="col-6"><strong>Special Occasion:</strong><br>${res.occasion}</div>
              <div class="col-12"><strong>Special Requests:</strong><br>${res.requests || 'None specified'}</div>
            </div>`;
          detailModal.classList.add('open');
        } else if (action === 'edit') {
          document.getElementById('editResIdDisplay').textContent = res.id;
          document.getElementById('editResDate').value = res.date;
          document.getElementById('editResTime').value = res.time;
          document.getElementById('editResGuests').value = res.guests;
          document.getElementById('editResSeating').value = res.seating;
          document.getElementById('editResOccasion').value = res.occasion;
          document.getElementById('editResRequests').value = res.requests || '';
          editModal.classList.add('open');
        } else if (action === 'cancel') {
          document.getElementById('cancelResIdLabel').textContent = `${res.id} (${res.date} at ${res.time})`;
          cancelModal.classList.add('open');
        }
      });
    }

    // Save Edited Reservation
    const editResForm = document.getElementById('editReservationForm');
    if (editResForm) {
      editResForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const idx = reservations.findIndex((r) => r.id === activeReservationId);
        if (idx > -1) {
          reservations[idx].date = document.getElementById('editResDate').value;
          reservations[idx].time = document.getElementById('editResTime').value;
          reservations[idx].guests = parseInt(document.getElementById('editResGuests').value, 10) || 2;
          reservations[idx].seating = document.getElementById('editResSeating').value;
          reservations[idx].occasion = document.getElementById('editResOccasion').value;
          reservations[idx].requests = document.getElementById('editResRequests').value.trim();
          saveState(STORAGE_KEYS.RESERVATIONS, reservations);
          renderAllDashboardViews();
        }
        editModal.classList.remove('open');
      });
    }

    // Confirm Cancellation
    const confirmCancelResBtn = document.getElementById('confirmCancelResBtn');
    if (confirmCancelResBtn) {
      confirmCancelResBtn.addEventListener('click', () => {
        const idx = reservations.findIndex((r) => r.id === activeReservationId);
        if (idx > -1) {
          reservations[idx].status = 'Cancelled';
          saveState(STORAGE_KEYS.RESERVATIONS, reservations);
          renderAllDashboardViews();
        }
        cancelModal.classList.remove('open');
      });
    }

    // 3. EVENT NIGHTS ACTIONS (Section 23)
    const eventsView = document.getElementById('view-events');
    if (eventsView) {
      eventsView.addEventListener('click', (e) => {
        const saveBtn = e.target.closest('[data-ev-save]');
        if (saveBtn) {
          const evId = saveBtn.getAttribute('data-ev-save');
          if (savedEvents.includes(evId)) {
            savedEvents = savedEvents.filter((id) => id !== evId);
          } else {
            savedEvents.push(evId);
          }
          saveState(STORAGE_KEYS.SAVED_EVENTS, savedEvents);
          renderEventsSection();
          return;
        }

        const reserveBtn = e.target.closest('[data-ev-reserve]');
        if (reserveBtn) {
          const evTitle = reserveBtn.getAttribute('data-ev-reserve');
          const reqInput = document.getElementById('bookRequests');
          if (reqInput) reqInput.value = `Event Night Reservation Request: ${evTitle}`;
          window.location.hash = '#book-table';
          return;
        }

        const detailBtn = e.target.closest('[data-ev-details]');
        if (detailBtn) {
          const evId = detailBtn.getAttribute('data-ev-details');
          const ev = DASHBOARD_EVENTS.find((x) => x.id === evId);
          if (ev && detailModal) {
            document.getElementById('resDetailBody').innerHTML = `
              <span class="badge-demo mb-2">${ev.category} • Demo Event</span>
              <h4 class="h3 mb-2">${ev.title}</h4>
              <p class="small mb-2" style="color:var(--champagne-gold);">${ev.date} • ${ev.time}</p>
              <p class="mb-0">${ev.desc}</p>`;
            detailModal.classList.add('open');
          }
        }
      });
    }

    // 4. REWARDS REDEMPTION SIMULATION (Section 25)
    const rewardsGrid = document.getElementById('rewardsCatalogGrid');
    const rewardFeedback = document.getElementById('rewardRedeemFeedback');
    if (rewardsGrid) {
      rewardsGrid.addEventListener('click', (e) => {
        const redeemBtn = e.target.closest('[data-redeem-reward]');
        if (!redeemBtn) return;
        const rwId = redeemBtn.getAttribute('data-redeem-reward');
        const reward = REWARDS_CATALOG.find((r) => r.id === rwId);
        if (!reward || loyalty.redeemedIds.includes(rwId)) return;

        if (loyalty.points < reward.points) return;

        loyalty.points -= reward.points;
        loyalty.redeemedIds.push(rwId);
        loyalty.history.unshift({
          date: 'Today (Demo)',
          activity: `Redeemed Reward: ${reward.name}`,
          delta: `-${reward.points} pts`
        });
        saveState(STORAGE_KEYS.LOYALTY, loyalty);
        renderAllDashboardViews();

        if (rewardFeedback) {
          rewardFeedback.style.display = 'block';
          rewardFeedback.innerHTML = `
            <div class="p-3 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2" style="background:rgba(92, 230, 139, 0.14); border:1px solid rgba(92, 230, 139, 0.4);">
              <span><i class="bi bi-gift me-2"></i><strong>Simulated Redemption Complete:</strong> "${reward.name}" unlocked (${reward.points} demo points deducted).</span>
              <span class="badge-gold">Remaining: ${loyalty.points.toLocaleString('en-IN')} Pts</span>
            </div>`;
        }
      });
    }

    const resetLoyaltyBtn = document.getElementById('resetDemoLoyaltyBtn');
    if (resetLoyaltyBtn) {
      resetLoyaltyBtn.addEventListener('click', () => {
        loyalty = JSON.parse(JSON.stringify(DEFAULT_LOYALTY));
        saveState(STORAGE_KEYS.LOYALTY, loyalty);
        if (rewardFeedback) rewardFeedback.style.display = 'none';
        renderAllDashboardViews();
      });
    }

    // 5. RESERVATION HISTORY FILTERS & DETAILS (Section 26)
    ['historySearchInput', 'historyStatusFilter', 'historyDateFilter'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', renderHistoryTable);
        el.addEventListener('change', renderHistoryTable);
      }
    });

    const historyTbody = document.getElementById('historyTableBody');
    if (historyTbody) {
      historyTbody.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-history-detail]');
        if (!btn) return;
        const id = btn.getAttribute('data-history-detail');
        const rec = historyRecords.find((r) => r.id === id);
        if (rec && detailModal) {
          document.getElementById('resDetailBody').innerHTML = `
            <div class="mb-2"><span class="badge-gold">${rec.id} • PAST VISIT RECORD</span></div>
            <h4 class="h4 mb-3">${rec.seating} (${rec.guests} Guests)</h4>
            <p class="small mb-1"><strong>Date & Time:</strong> ${rec.date} at ${rec.time}</p>
            <p class="small mb-1"><strong>Occasion:</strong> ${rec.occasion}</p>
            <p class="small mb-1"><strong>Status:</strong> ${rec.status}</p>
            <p class="small mb-0"><strong>Notes:</strong> ${rec.notes}</p>`;
          detailModal.classList.add('open');
        }
      });
    }

    // 6. PROFILE & PREFERENCES FORM (Section 27)
    const profileForm = document.getElementById('guestProfileForm');
    const profileFeedback = document.getElementById('profileSaveFeedback');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        profile.firstName = document.getElementById('profFirstName').value.trim() || 'Alex';
        profile.lastName = document.getElementById('profLastName').value.trim() || 'Morgan';
        profile.email = document.getElementById('profEmail').value.trim() || 'guest@example.com';
        profile.phone = document.getElementById('profPhone').value.trim();
        profile.preferredSeating = document.getElementById('profSeating').value;
        profile.occNotifications = document.getElementById('prefOccasion').checked;
        profile.eventAnnouncements = document.getElementById('prefEvents').checked;
        profile.resReminders = document.getElementById('prefReminders').checked;
        profile.promoUpdates = document.getElementById('prefPromos').checked;

        saveState(STORAGE_KEYS.PROFILE, profile);
        renderProfileHeader();

        if (profileFeedback) {
          profileFeedback.style.display = 'block';
          profileFeedback.innerHTML = `
            <div class="p-3 mt-3 small" style="background:rgba(92, 230, 139, 0.14); border:1px solid rgba(92, 230, 139, 0.4);">
              <i class="bi bi-check2-circle me-2"></i>Your guest profile and dining preferences have been updated in localStorage.
            </div>`;
        }
      });
    }

    // 7. HELP & SUPPORT FORM (Section 28)
    const supportForm = document.getElementById('dashSupportForm');
    const supportFeedback = document.getElementById('dashSupportFeedback');
    if (supportForm) {
      supportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const topic = document.getElementById('supportTopic').value;
        const msg = document.getElementById('supportMessage').value.trim();
        if (!msg) return;

        if (supportFeedback) {
          supportFeedback.style.display = 'block';
          supportFeedback.innerHTML = `
            <div class="p-3 mt-3 small" style="background:rgba(214, 184, 120, 0.14); border:1px solid var(--champagne-gold);">
              <i class="bi bi-check2-circle me-2" style="color:var(--champagne-gold);"></i><strong>Concierge Enquiry Logged (Demo):</strong> Our guest relations team has received your inquiry regarding "${topic}".
            </div>`;
        }
        supportForm.reset();
      });
    }

    // 8. SIGN OUT CONFIRMATION DIALOG (Section 29)
    const signOutModal = document.getElementById('signOutConfirmModal');
    document.querySelectorAll('[data-signout-trigger]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (signOutModal) signOutModal.classList.add('open');
      });
    });

    const confirmSignOutBtn = document.getElementById('confirmSignOutBtn');
    if (confirmSignOutBtn) {
      confirmSignOutBtn.addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        window.location.href = 'login.html';
      });
    }

    // Close modal buttons
    document.querySelectorAll('[data-close-modal]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.closest('.rooftop-modal-backdrop');
        if (target) target.classList.remove('open');
      });
    });

    document.querySelectorAll('.rooftop-modal-backdrop').forEach((backdropEl) => {
      backdropEl.addEventListener('click', (e) => {
        if (e.target === backdropEl) backdropEl.classList.remove('open');
      });
    });
  });
})();
