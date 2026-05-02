/* =============================================================================
   NORDHOST — App logic
   SPA s router-like screen switching, demo flow + portál.
   ============================================================================= */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // DATA: Server configurations
  // ---------------------------------------------------------------------------
  const servers = [
    {
      id: 'ds-entry',
      name: 'DS-ENTRY',
      subtitle: 'Ideální pro webhosting, VPN a menší projekty',
      cpu: 'Intel Xeon E-2236',
      cpuDetail: 'Intel Xeon E-2236 (6C/12T @ 3.4 GHz)',
      cores: '6C / 12T',
      ram: '32 GB DDR4 ECC',
      ramDetail: '32 GB DDR4 ECC 2666 MHz (2× 16 GB)',
      disk: '2× 512 GB NVMe SSD',
      diskDetail: '2× 512 GB NVMe SSD (Samsung PM9A3)',
      net: '1 Gbps',
      netDetail: '1 Gbps unmetered, 1× IPv4, /64 IPv6',
      ipmi: 'Ano',
      location: 'Praha, CZ — DC Tower',
      price: 1990,
      status: 'available'
    },
    {
      id: 'ds-pro',
      name: 'DS-PRO',
      subtitle: 'Výkonný server pro produkční nasazení a databáze',
      cpu: 'Intel Xeon E-2388G',
      cpuDetail: 'Intel Xeon E-2388G (8C/16T @ 3.2 GHz)',
      cores: '8C / 16T',
      ram: '64 GB DDR4 ECC',
      ramDetail: '64 GB DDR4 ECC 3200 MHz (2× 32 GB)',
      disk: '2× 1 TB NVMe SSD',
      diskDetail: '2× 1 TB NVMe SSD (Samsung PM9A3, RAID 1)',
      net: '1 Gbps',
      netDetail: '1 Gbps unmetered, 2× IPv4, /64 IPv6',
      ipmi: 'Ano',
      location: 'Praha, CZ — DC Tower',
      price: 3490,
      status: 'available'
    },
    {
      id: 'ds-power',
      name: 'DS-POWER',
      subtitle: 'Maximální výkon pro HPC, rendering a large-scale aplikace',
      cpu: 'AMD EPYC 7443P',
      cpuDetail: 'AMD EPYC 7443P (24C/48T @ 2.85 GHz)',
      cores: '24C / 48T',
      ram: '128 GB DDR4 ECC',
      ramDetail: '128 GB DDR4 ECC 3200 MHz (4× 32 GB)',
      disk: '2× 2 TB NVMe SSD',
      diskDetail: '2× 2 TB NVMe SSD (Micron 7450 PRO, RAID 1)',
      net: '10 Gbps',
      netDetail: '10 Gbps unmetered, 4× IPv4, /48 IPv6',
      ipmi: 'Ano',
      location: 'Frankfurt, DE — Equinix FR5',
      price: 7990,
      status: 'last'
    },
    {
      id: 'ds-storage',
      name: 'DS-STORAGE',
      subtitle: 'Optimalizováno pro velkokapacitní úložiště a backup',
      cpu: 'Intel Xeon E-2336',
      cpuDetail: 'Intel Xeon E-2336 (6C/12T @ 2.9 GHz)',
      cores: '6C / 12T',
      ram: '32 GB DDR4 ECC',
      ramDetail: '32 GB DDR4 ECC 3200 MHz (2× 16 GB)',
      disk: '4× 4 TB HDD + 512 GB NVMe',
      diskDetail: '4× 4 TB SATA HDD (RAID 10) + 512 GB NVMe cache',
      net: '1 Gbps',
      netDetail: '1 Gbps unmetered, 1× IPv4, /64 IPv6',
      ipmi: 'Ano',
      location: 'Praha, CZ — DC Tower',
      price: 3290,
      status: 'sold'
    },
    {
      id: 'ds-gpu',
      name: 'DS-GPU',
      subtitle: 'GPU akcelerace pro ML/AI workloady a inference',
      cpu: 'AMD EPYC 7313P',
      cpuDetail: 'AMD EPYC 7313P (16C/32T @ 3.0 GHz)',
      cores: '16C / 32T',
      ram: '128 GB DDR4 ECC',
      ramDetail: '128 GB DDR4 ECC 3200 MHz (4× 32 GB)',
      disk: '2× 1 TB NVMe SSD',
      diskDetail: '2× 1 TB NVMe SSD (Samsung PM9A3) + NVIDIA A4000 16GB',
      net: '10 Gbps',
      netDetail: '10 Gbps unmetered, 2× IPv4, /48 IPv6',
      ipmi: 'Ano',
      location: 'Frankfurt, DE — Equinix FR5',
      price: 12990,
      status: 'available'
    }
  ];

  const periods = [
    { months: 1,  label: '1 měsíc',   discount: 0  },
    { months: 3,  label: '3 měsíce',  discount: 5  },
    { months: 6,  label: '6 měsíců',  discount: 10 },
    { months: 12, label: '12 měsíců', discount: 15 }
  ];

  let selectedServer = null;
  let selectedPeriod = periods[0];

  // ---------------------------------------------------------------------------
  // NAVIGATION
  // ---------------------------------------------------------------------------
  function showScreen(id) {
    document.getElementById('portal-wrapper').style.display = 'none';
    document.getElementById('public-nav').style.display = '';
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('screen-' + id);
    if (target) target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  function showPortal(screenId) {
    document.getElementById('public-nav').style.display = 'none';
    document.getElementById('portal-wrapper').style.display = 'flex';
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('screen-' + screenId);
    if (target) target.classList.add('active');
    document.querySelectorAll('.sidebar-nav a').forEach(a => {
      a.classList.toggle('active', a.dataset.portal === screenId);
    });
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  function logout() {
    showScreen('landing');
  }

  // ---------------------------------------------------------------------------
  // THEME TOGGLE — light je default (ZonerCloud styl), dark je opt-in
  // s persistencí přes localStorage
  // ---------------------------------------------------------------------------
  function toggleTheme() {
    const root = document.documentElement;
    root.classList.toggle('dark');
    try {
      localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
    } catch (_) {}
  }

  function initTheme() {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') document.documentElement.classList.add('dark');
    } catch (_) {}
  }

  // ---------------------------------------------------------------------------
  // CATALOG
  // ---------------------------------------------------------------------------
  function renderCatalog() {
    const grid = document.getElementById('server-grid');
    if (!grid) return;
    grid.innerHTML = servers.map(s => {
      const statusBadge = {
        available: '<span class="badge badge-available">Dostupné</span>',
        last:      '<span class="badge badge-last">Poslední kus</span>',
        sold:      '<span class="badge badge-sold">Obsazeno</span>'
      }[s.status];

      const isSold = s.status === 'sold';

      return `
        <div class="server-card ${isSold ? 'sold' : ''}"
             ${!isSold ? `onclick="window.NH.selectServer('${s.id}')" tabindex="0" role="button"` : 'aria-disabled="true"'}>
          <div class="server-card-header">
            <span class="server-card-name">${s.name}</span>
            ${statusBadge}
          </div>
          <div class="server-card-specs">
            <div class="server-spec-row">
              <span class="server-spec-label">CPU</span>
              <span class="server-spec-value">${s.cpu}</span>
            </div>
            <div class="server-spec-row">
              <span class="server-spec-label">RAM</span>
              <span class="server-spec-value">${s.ram}</span>
            </div>
            <div class="server-spec-row">
              <span class="server-spec-label">Disk</span>
              <span class="server-spec-value">${s.disk}</span>
            </div>
            <div class="server-spec-row">
              <span class="server-spec-label">Síť</span>
              <span class="server-spec-value">${s.net}</span>
            </div>
          </div>
          <div class="server-card-footer">
            <div class="server-price">${formatPrice(s.price)} <span>Kč/měs.</span></div>
            <button class="btn btn-primary btn-sm" ${isSold ? 'disabled' : ''}>${isSold ? 'Obsazeno' : 'Vybrat'}</button>
          </div>
        </div>
      `;
    }).join('');

    // Allow Enter/Space to activate cards (a11y)
    grid.querySelectorAll('[role="button"]').forEach(card => {
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // SERVER DETAIL
  // ---------------------------------------------------------------------------
  function selectServer(id) {
    selectedServer = servers.find(s => s.id === id);
    if (!selectedServer) return;

    selectedPeriod = periods[0];

    document.getElementById('detail-name').textContent = selectedServer.name;
    document.getElementById('detail-subtitle').textContent = selectedServer.subtitle;

    document.getElementById('detail-spec-table').innerHTML = `
      <tr><td>CPU</td><td>${selectedServer.cpuDetail}</td></tr>
      <tr><td>Jádra / Vlákna</td><td>${selectedServer.cores}</td></tr>
      <tr><td>RAM</td><td>${selectedServer.ramDetail}</td></tr>
      <tr><td>Disky</td><td>${selectedServer.diskDetail}</td></tr>
      <tr><td>Síť</td><td>${selectedServer.netDetail}</td></tr>
      <tr><td>IPMI</td><td>${selectedServer.ipmi}</td></tr>
      <tr><td>Lokace</td><td>${selectedServer.location}</td></tr>
    `;

    renderPeriodSelector();
    updatePriceDisplay();
    showScreen('server-detail');
  }

  function renderPeriodSelector() {
    const container = document.getElementById('period-selector');
    container.innerHTML = periods.map((p, i) => `
      <button class="period-btn ${i === 0 ? 'active' : ''}"
              onclick="window.NH.selectPeriod(${i})"
              data-period-index="${i}">
        <span>${p.label}</span>
        ${p.discount > 0 ? `<span class="period-discount">−${p.discount}&nbsp;%</span>` : ''}
      </button>
    `).join('');
  }

  function selectPeriod(index) {
    selectedPeriod = periods[index];
    document.querySelectorAll('.period-btn').forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });
    updatePriceDisplay();
  }

  function updatePriceDisplay() {
    if (!selectedServer) return;
    const base = selectedServer.price;
    const discounted = Math.round(base * (1 - selectedPeriod.discount / 100));

    document.getElementById('price-card-name').textContent = selectedServer.name;
    document.getElementById('price-display').innerHTML =
      `${formatPrice(discounted)} <span>Kč/měs.</span>`;

    const originalEl = document.getElementById('price-original');
    if (selectedPeriod.discount > 0) {
      originalEl.textContent = `${formatPrice(base)} Kč/měs. původně`;
    } else {
      originalEl.textContent = '';
    }
  }

  // ---------------------------------------------------------------------------
  // CHECKOUT
  // ---------------------------------------------------------------------------
  function goToCheckout() {
    if (!selectedServer) return;

    const discounted = Math.round(selectedServer.price * (1 - selectedPeriod.discount / 100));
    const total = discounted * selectedPeriod.months;

    document.getElementById('order-summary').innerHTML = `
      <h3>Shrnutí objednávky</h3>
      <div class="summary-row"><span class="label">Server</span><span>${selectedServer.name}</span></div>
      <div class="summary-row"><span class="label">Konfigurace</span><span>${selectedServer.cpu}</span></div>
      <div class="summary-row"><span class="label">RAM / Disk</span><span>${selectedServer.ram} / ${selectedServer.disk}</span></div>
      <div class="summary-row"><span class="label">Délka pronájmu</span><span>${selectedPeriod.months} měs.</span></div>
      <div class="summary-row"><span class="label">Cena za měsíc</span><span>${formatPrice(discounted)} Kč</span></div>
      ${selectedPeriod.discount > 0 ? `<div class="summary-row"><span class="label">Sleva</span><span style="color:var(--success);">−${selectedPeriod.discount}&nbsp;%</span></div>` : ''}
      <div class="summary-row total"><span>Celkem</span><span>${formatPrice(total)} Kč</span></div>
    `;

    showScreen('checkout');
  }

  function goToPayment() {
    showScreen('payment-pending');

    setTimeout(() => {
      const discounted = Math.round(selectedServer.price * (1 - selectedPeriod.discount / 100));
      const total = discounted * selectedPeriod.months;

      document.getElementById('confirmed-details').innerHTML = `
        <div class="summary-row"><span class="label">Server</span><span>${selectedServer.name}</span></div>
        <div class="summary-row"><span class="label">Délka</span><span>${selectedPeriod.months} měs.</span></div>
        <div class="summary-row"><span class="label">Zaplaceno</span><span>${formatPrice(total)} Kč</span></div>
        <div class="summary-row"><span class="label">Aktivace</span><span>do 30 minut</span></div>
        <div class="summary-row"><span class="label">Přístupy</span><span>email do 30 min</span></div>
      `;

      showScreen('order-confirmed');
    }, 2400);
  }

  // ---------------------------------------------------------------------------
  // PORTAL: TABS
  // ---------------------------------------------------------------------------
  function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');

    const tabs = ['tab-overview', 'tab-access', 'tab-hardware', 'tab-actions'];
    const index = tabs.indexOf(tabId);
    if (index >= 0) {
      document.querySelectorAll('.tab-btn')[index].classList.add('active');
    }
  }

  // ---------------------------------------------------------------------------
  // PORTAL: ACTIONS
  // ---------------------------------------------------------------------------
  function copySSH() {
    const cmd = document.getElementById('ssh-cmd').textContent;
    if (navigator.clipboard) navigator.clipboard.writeText(cmd).catch(() => {});
    const btn = document.getElementById('copy-ssh-btn');
    const original = btn.textContent;
    btn.textContent = 'Zkopírováno ✓';
    setTimeout(() => { btn.textContent = original; }, 2000);
  }

  function togglePassword() {
    const input = document.getElementById('root-password');
    const btn = input.nextElementSibling;
    if (input.type === 'password') {
      input.type = 'text';
      btn.textContent = 'Skrýt';
    } else {
      input.type = 'password';
      btn.textContent = 'Zobrazit';
    }
  }

  function showRebootConfirm() {
    document.getElementById('reboot-confirm').classList.add('show');
    document.getElementById('reboot-msg').classList.remove('show');
  }

  function hideRebootConfirm() {
    document.getElementById('reboot-confirm').classList.remove('show');
  }

  function confirmReboot() {
    document.getElementById('reboot-confirm').classList.remove('show');
    document.getElementById('reboot-msg').classList.add('show');
    setTimeout(() => {
      document.getElementById('reboot-msg').classList.remove('show');
    }, 5000);
  }

  // ---------------------------------------------------------------------------
  // UTILITIES
  // ---------------------------------------------------------------------------
  function formatPrice(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  // ---------------------------------------------------------------------------
  // EXPOSE — onclick handlers v HTML
  // ---------------------------------------------------------------------------
  window.NH = {
    showScreen,
    showPortal,
    logout,
    toggleTheme,
    selectServer,
    selectPeriod,
    goToCheckout,
    goToPayment,
    switchTab,
    copySSH,
    togglePassword,
    showRebootConfirm,
    hideRebootConfirm,
    confirmReboot
  };

  // ---------------------------------------------------------------------------
  // INIT
  // ---------------------------------------------------------------------------
  initTheme();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderCatalog);
  } else {
    renderCatalog();
  }
})();
