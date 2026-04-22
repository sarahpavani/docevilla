/* ================================================================
   DOCEVILLA – script.js  (estrutura padrão de uma página)
   ================================================================ */

/* ── NAVBAR SCROLL ── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const darkToggle = document.getElementById('darkToggle');

// Dark Mode Logic
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
  document.body.classList.add('dark-mode');
}

darkToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  highlightNav();
  
  // Background Parallax
  const meshBg = document.querySelector('.mesh-bg');
  if (meshBg) {
    const scrollPos = window.scrollY;
    meshBg.style.transform = `translateY(${scrollPos * 0.15}px) scale(1.1)`;
  }
});

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

/* ── ACTIVE LINK HIGHLIGHT ── */
function highlightNav() {
  const sections = document.querySelectorAll('section[id], .hero[id]');
  const links    = document.querySelectorAll('.nav-link');
  let current    = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 130) current = s.id;
  });
  links.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
}

/* ── SCROLL REVEAL ── */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { 
      // Handle staggering for grids
      const parent = e.target.parentElement;
      if (parent && (parent.classList.contains('prod-grid') || parent.classList.contains('hl-grid') || parent.classList.contains('stats-inner'))) {
        const siblings = Array.from(parent.querySelectorAll('.reveal'));
        const index = siblings.indexOf(e.target);
        e.target.style.transitionDelay = `${index * 0.1}s`;
      }
      
      e.target.classList.add('shown'); 
      revObs.unobserve(e.target); 
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* ── MAGNETIC TITLES ── */
document.querySelectorAll('h1, .sec-header h2').forEach(title => {
  title.addEventListener('mousemove', e => {
    const { left, top, width, height } = title.getBoundingClientRect();
    const x = (e.clientX - (left + width / 2)) * 0.15;
    const y = (e.clientY - (top + height / 2)) * 0.15;
    title.style.transform = `translate(${x}px, ${y}px)`;
    title.style.transition = 'transform 0.1s ease-out';
  });
  title.addEventListener('mouseleave', () => {
    title.style.transform = 'translate(0, 0)';
    title.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  });
});

/* ── COUNTER ANIMATION ── */
function animCounter(el, target, dur = 1600) {
  const t0 = performance.now();
  const tick = now => {
    const p = Math.min((now - t0) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * e).toLocaleString('pt-BR') + '+';
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString('pt-BR') + '+';
  };
  requestAnimationFrame(tick);
}

const cntObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animCounter(e.target, parseInt(e.target.dataset.count, 10));
      cntObs.unobserve(e.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('[data-count]').forEach(el => cntObs.observe(el));

/* ── CATEGORY TABS ── */
const tabs    = document.querySelectorAll('.tab');
const cards   = document.querySelectorAll('.pcard');
const cbIcon  = document.getElementById('cbIcon');
const cbTitle = document.getElementById('cbTitle');
const cbDesc  = document.getElementById('cbDesc');

const catInfo = {
  todos:      { icon: '✦',  title: 'Todos os Produtos',        desc: 'Explore nossa coleção completa de doces artesanais com estética vintage' },
  bolos:      { icon: '🎂', title: 'Bolos Personalizados',     desc: 'Bolos artesanais com decoração vintage para cada momento especial' },
  cupcakes:   { icon: '🧁', title: 'Kits de Cupcakes',         desc: 'Kits irresistíveis com decorações retrô únicas, feitos à mão com amor' },
  donuts:     { icon: '🍩', title: 'Kits de Donuts',           desc: 'Donuts artesanais riquíssimamente decorados no estilo vintage que você ama' },
  chocolates: { icon: '🍫', title: 'Chocolates & Bombons',     desc: 'Chocolates de luxo, trufas douradas e morangos cobertos de beleza' },
  tortas:     { icon: '🥧', title: 'Tortas Artesanais',        desc: 'Tortas vintage de diversos sabores com acabamento de confeitaria francesa' },
  presentes:  { icon: '🎁', title: 'Para Presentear',          desc: 'Kits e combos exclusivos para presentear com amor e sofisticação' },
};

/* ── CATEGORY SWIPER & SYNC ── */
const catOrder = ['todos', 'bolos', 'cupcakes', 'donuts', 'chocolates', 'tortas', 'presentes'];
const catSwiper = new Swiper('.cat-header-swiper', {
  slidesPerView: 1,
  spaceBetween: 0,
  speed: 800,
  effect: 'fade',
  fadeEffect: { crossFade: true },
  pagination: {
    el: '.cat-pagination',
    clickable: true,
  },
  autoplay: {
    delay: 8000,
    disableOnInteraction: true,
  }
});

function filterCategory(cat, fromSwiper = false) {
  /* update tabs */
  tabs.forEach(t => t.classList.toggle('active', t.dataset.cat === cat));

  /* Sync Swiper if call came from elsewhere */
  if (catSwiper && !fromSwiper) {
    const idx = catOrder.indexOf(cat);
    if (idx !== -1) catSwiper.slideTo(idx);
  }

  /* filter cards */
  cards.forEach((card, i) => {
    const match = cat === 'todos' || card.dataset.cat === cat;
    if (match) {
      card.classList.remove('hidden');
      card.style.opacity   = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'opacity .45s ease, transform .45s ease';
        card.style.opacity    = '1';
        card.style.transform  = 'translateY(0)';
      }, i * 40);
    } else {
      card.classList.add('hidden');
    }
  });
}

/* Bind swiper change to filtering */
catSwiper.on('slideChange', () => {
  const currentCat = catOrder[catSwiper.activeIndex];
  filterCategory(currentCat, true);
});

/* bind tab clicks */
tabs.forEach(tab => {
  tab.addEventListener('click', () => filterCategory(tab.dataset.cat));
});

/* ── HEART TOGGLE ── */
function toggleHeart(btn) {
  btn.classList.toggle('liked');
  btn.textContent = btn.classList.contains('liked') ? '♥' : '♡';
  spawnHearts(btn);
}

function spawnHearts(el) {
  const { left, top, width, height } = el.getBoundingClientRect();
  const cx = left + width / 2, cy = top + height / 2;
  for (let i = 0; i < 6; i++) {
    const h   = document.createElement('span');
    const ang = (i / 6) * Math.PI * 2;
    const d   = 28 + Math.random() * 24;
    h.textContent = '♥';
    h.style.cssText = `
      position:fixed;left:${cx}px;top:${cy}px;
      font-size:${.45 + Math.random() * .5}rem;
      color:var(--bord);pointer-events:none;z-index:9999;
      transform:translate(-50%,-50%);
      animation:hPart .7s ease-out forwards;
      --dx:${Math.cos(ang)*d}px;--dy:${Math.sin(ang)*d}px;
    `;
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 700);
  }
  if (!document.getElementById('hps')) {
    const s = document.createElement('style');
    s.id = 'hps';
    s.textContent = `@keyframes hPart{0%{opacity:1;transform:translate(-50%,-50%) scale(1)}
      100%{opacity:0;transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(.3)}}`;
    document.head.appendChild(s);
  }
}

/* ── CARD RIPPLE ── */
if (!document.getElementById('ripStyle')) {
  const s = document.createElement('style');
  s.id = 'ripStyle';
  s.textContent = `@keyframes rip{to{transform:scale(1);opacity:0}}`;
  document.head.appendChild(s);
}
document.querySelectorAll('.pcard').forEach(card => {
  card.addEventListener('click', e => {
    const r    = card.getBoundingClientRect();
    const sp   = document.createElement('span');
    const size = Math.max(r.width, r.height) * 1.5;
    sp.style.cssText = `position:absolute;border-radius:50%;pointer-events:none;z-index:0;
      width:${size}px;height:${size}px;
      left:${e.clientX - r.left - size/2}px;top:${e.clientY - r.top - size/2}px;
      background:rgba(124,29,43,.07);transform:scale(0);
      animation:rip .6s ease-out forwards;`;
    card.appendChild(sp);
    setTimeout(() => sp.remove(), 650);
  });
});

/* ── SPARKLE ON MOUSEMOVE ── */
const sparkWrap = document.getElementById('sparkles');
let lastSpark   = 0;
document.addEventListener('mousemove', e => {
  const now = Date.now();
  if (now - lastSpark < 90) return;
  lastSpark = now;
  const d = document.createElement('div');
  const sz = 4 + Math.random() * 5;
  const clr = ['#7C1D2B','#E8A0A8','#F5C8CC'][Math.floor(Math.random()*3)];
  d.className = 'sp';
  d.style.cssText = `left:${e.clientX - sz/2}px;top:${e.clientY - sz/2}px;width:${sz}px;height:${sz}px;background:${clr};`;
  sparkWrap.appendChild(d);
  setTimeout(() => d.remove(), 800);
});

/* ── POLAROID TILT ── */
const pol = document.getElementById('heroPol');
if (pol) {
  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    const rx = ((e.clientY - cy) / cy) * 6;
    const ry = ((e.clientX - cx) / cx) * -6;
    pol.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  pol.addEventListener('mouseleave', () => { pol.style.transform = ''; });
}

/* ── CONTACT FORM ── */
const form    = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');
const subBtn  = document.getElementById('submitBtn');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nome  = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    if (!nome)  { shake('nome');  return; }
    if (!email) { shake('email'); return; }
    subBtn.disabled    = true;
    subBtn.textContent = 'Enviando...';
    setTimeout(() => {
      success.classList.add('show');
      form.reset();
      subBtn.textContent = 'Enviar Pedido ♥';
      subBtn.disabled    = false;
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1200);
  });
}

function shake(id) {
  const el = document.getElementById(id);
  el.style.borderColor = 'var(--bord-md)';
  el.style.boxShadow   = '0 0 0 3px rgba(124,29,43,.15)';
  if (!document.getElementById('shk')) {
    const s = document.createElement('style');
    s.id = 'shk';
    s.textContent = `@keyframes shk{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}`;
    document.head.appendChild(s);
  }
  el.style.animation = 'shk .4s ease';
  setTimeout(() => { el.style.borderColor=''; el.style.boxShadow=''; el.style.animation=''; }, 2500);
}

/* ── SECTION SPARKLE ON ENTER ── */
const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { burstSparkles(e.target); secObs.unobserve(e.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll('section').forEach(s => secObs.observe(s));

function burstSparkles(sec) {
  const r = sec.getBoundingClientRect();
  if (!document.getElementById('secSpk')) {
    const st = document.createElement('style');
    st.id = 'secSpk';
    st.textContent = `@keyframes secSpk{0%{opacity:.6;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-40px) scale(.5)}}`;
    document.head.appendChild(st);
  }
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const sp = document.createElement('span');
      sp.textContent = ['✦','♥','✦','❋'][Math.floor(Math.random()*4)];
      sp.style.cssText = `position:absolute;
        left:${r.left + Math.random() * r.width}px;
        top:${r.top + window.scrollY + Math.random() * 160}px;
        font-size:${.8 + Math.random() * .8}rem;
        color:var(--bord);opacity:.5;pointer-events:none;z-index:0;
        animation:secSpk 1.1s ease-out forwards;`;
      document.body.appendChild(sp);
      setTimeout(() => sp.remove(), 1200);
    }, i * 110);
  }
}

/* ── INSPIRATION SWIPER ── */
const inspSwiper = new Swiper('.insp-swiper', {
  parallax: true,
  slidesPerView: 1,
  spaceBetween: 30,
  speed: 1000,
  loop: true,
  centeredSlides: true,
  grabCursor: true,
  autoplay: {
    delay: 3500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  pagination: {
    el: '.insp-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.insp-next',
    prevEl: '.insp-prev',
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 4,
    },
  }
});

/* ── FLUID BACKGROUND INTERACTIVITY ── */
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 40; // Max 20px movement
  const y = (e.clientY / window.innerHeight - 0.5) * 40;
  
  document.documentElement.style.setProperty('--mx', `${x}px`);
  document.documentElement.style.setProperty('--my', `${y}px`);
});

/* ── LOG ── */
console.log('%c♥ Docevilla – Cake Retrô', 'font-size:16px;color:#7C1D2B;font-weight:bold;font-family:Georgia,serif;');
