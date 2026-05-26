  // ===== LOADER =====
  window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('loader').classList.add('hide'), 1800);
  });

  // ===== HAMBURGER =====
  function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('open');
  }

  // ===== TIER TABS =====
  function showTier(tier) {
    document.querySelectorAll('.tier-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.pc-grid').forEach(g => g.classList.remove('active'));
    document.querySelector(`.tier-tab.${tier}`).classList.add('active');
    document.getElementById(`grid-${tier}`).classList.add('active');
  }

  // ===== CONFIGURADOR =====
  const prices = { cpu: 0, mb: 0, ram: 0, stor: 0, gpu: 0, psu: 0, case: 0 };
  const perf   = { cpu: 0, gpu: 0, ram: 0 };

  function getLabel(sel) {
    const o = sel.options[sel.selectedIndex];
    return o.value === '0' ? '—' : o.text.split(' · ')[0];
  }

  function formatCOP(val) {
    return '$' + val.toLocaleString('es-CO');
  }

  function updateConfig() {
    const IDs = ['cpu','mb','ram','stor','gpu','psu','case'];
    const SELs = IDs.map(id => document.getElementById('sel-' + id));
    let total = 0;

    SELs.forEach((sel, i) => {
      const val = parseInt(sel.value) || 0;
      prices[IDs[i]] = val;
      total += val;
      const sEl = document.getElementById('s-' + IDs[i]);
      if (sEl) sEl.textContent = val ? getLabel(sel) : (IDs[i] === 'gpu' ? 'Integrada' : '—');
    });

    // Perf
    const cpuSel  = document.getElementById('sel-cpu');
    const gpuSel  = document.getElementById('sel-gpu');
    const ramSel  = document.getElementById('sel-ram');
    const storSel = document.getElementById('sel-stor');
    perf.cpu = parseInt(cpuSel.options[cpuSel.selectedIndex].dataset.perf || 0);
    perf.gpu = parseInt(gpuSel.options[gpuSel.selectedIndex].dataset.perf || 0);
    perf.ram = parseInt(ramSel.options[ramSel.selectedIndex].dataset.perf || 0);

    document.getElementById('perf-cpu').style.width  = perf.cpu + '%';
    document.getElementById('perf-gpu').style.width  = perf.gpu + '%';
    document.getElementById('perf-ram').style.width  = perf.ram + '%';
    document.getElementById('perf-cpu-val').textContent = perf.cpu + '%';
    document.getElementById('perf-gpu-val').textContent = perf.gpu + '%';
    document.getElementById('perf-ram-val').textContent = perf.ram + '%';

    document.getElementById('totalPrice').textContent = formatCOP(total);

    // Compatibilidad socket
    const cpuSocket = cpuSel.options[cpuSel.selectedIndex].dataset.socket || '';
    const mbSocket  = document.getElementById('sel-mb').options[document.getElementById('sel-mb').selectedIndex].dataset.socket || '';
    const cm = document.getElementById('compatMsg');
    if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
      cm.className = 'compat-msg compat-err';
      cm.textContent = `⚠️ Incompatibilidad: CPU (${cpuSocket}) ≠ Placa (${mbSocket})`;
    } else if (cpuSocket && mbSocket && cpuSocket === mbSocket) {
      cm.className = 'compat-msg compat-ok';
      cm.textContent = `✅ Compatibilidad de socket verificada (${cpuSocket})`;
    } else {
      cm.className = 'compat-msg';
      cm.textContent = '';
    }
  }

  function finalizeBuild() {
    const total = Object.values(prices).reduce((a,b) => a+b, 0);
    if (total === 0) {
      showModal('⚠️', '¡Ups!', 'Debes seleccionar al menos un componente antes de finalizar tu configuración.');
      return;
    }
    showModal('🚀', '¡Build Guardado!',
      `Tu configuración por ${formatCOP(total)} COP ha sido registrada. Llevaremos tu PC personalizada al siguiente nivel.`);
  }

  function addToCart(name, price) {
    showModal('🛒', `¡${name} Cotizado!`,
      `Has solicitado cotización para el equipo <strong>${name}</strong> por <strong>${price}</strong> COP. Te contactaremos pronto.`);
  }

  // ===== MODAL =====
  function showModal(icon, title, msg) {
    document.getElementById('modalIcon').textContent  = icon;
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMsg').innerHTML     = msg;
    document.getElementById('modalBg').classList.add('open');
  }
  function closeModal() { document.getElementById('modalBg').classList.remove('open'); }
  document.getElementById('modalBg').addEventListener('click', e => {
    if (e.target === document.getElementById('modalBg')) closeModal();
  });

  // ===== SCROLL REVEAL =====
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ===== NAVBAR SCROLL =====
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    nav.style.boxShadow = window.scrollY > 30 ? '0 4px 32px rgba(255,107,26,.18)' : '0 2px 24px rgba(255,107,26,.12)';
  });

  // Close mobile menu on link click
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'));
  });
