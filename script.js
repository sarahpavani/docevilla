/* ================================================================
   DOCEVILLA – script.js
   ================================================================ */

/* ── NAVBAR & THEME ── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const darkToggle = document.getElementById('darkToggle');

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

function highlightNav() {
  const sections = document.querySelectorAll('section[id], .hero[id]');
  const links = document.querySelectorAll('.nav-link');
  let current = '';
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

/* ── CATEGORY TABS & SWIPER ── */
const tabs = document.querySelectorAll('.tab');
const cards = document.querySelectorAll('.pcard');
const catOrder = ['todos', 'bolos', 'cupcakes', 'donuts', 'chocolates', 'tortas', 'presentes'];

const catSwiper = new Swiper('.cat-header-swiper', {
  slidesPerView: 1,
  spaceBetween: 0,
  speed: 800,
  effect: 'fade',
  fadeEffect: { crossFade: true },
  pagination: { el: '.cat-pagination', clickable: true },
  autoplay: { delay: 8000, disableOnInteraction: true }
});

const inspSwiper = new Swiper('.insp-swiper', {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  speed: 1000,
  parallax: true,
  autoplay: {
    delay: 4000,
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
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 }
  }
});

function filterCategory(cat, fromSwiper = false) {
  tabs.forEach(t => t.classList.toggle('active', t.dataset.cat === cat));
  if (catSwiper && !fromSwiper) {
    const idx = catOrder.indexOf(cat);
    if (idx !== -1) catSwiper.slideTo(idx);
  }
  cards.forEach((card, i) => {
    const match = cat === 'todos' || card.dataset.cat === cat;
    if (match) {
      card.classList.remove('hidden');
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'opacity .45s ease, transform .45s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 40);
    } else {
      card.classList.add('hidden');
    }
  });
}

if (catSwiper) {
  catSwiper.on('slideChange', () => {
    const currentCat = catOrder[catSwiper.activeIndex];
    filterCategory(currentCat, true);
  });
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => filterCategory(tab.dataset.cat));
});

/* ── UI INTERACTIONS (HEARTS, RIPPLE, SPARKLES) ── */
function toggleHeart(btn) {
  btn.classList.toggle('liked');
  btn.textContent = btn.classList.contains('liked') ? '♥' : '♡';
  spawnHearts(btn);
}

function spawnHearts(el) {
  const { left, top, width, height } = el.getBoundingClientRect();
  const cx = left + width / 2, cy = top + height / 2;
  for (let i = 0; i < 6; i++) {
    const h = document.createElement('span');
    const ang = (i / 6) * Math.PI * 2;
    const d = 28 + Math.random() * 24;
    h.textContent = '♥';
    h.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;font-size:${.45 + Math.random() * .5}rem;color:var(--bord);pointer-events:none;z-index:9999;transform:translate(-50%,-50%);animation:hPart .7s ease-out forwards;--dx:${Math.cos(ang)*d}px;--dy:${Math.sin(ang)*d}px;`;
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 700);
  }
}

document.querySelectorAll('.pcard').forEach(card => {
  card.addEventListener('click', e => {
    const r = card.getBoundingClientRect();
    const sp = document.createElement('span');
    const size = Math.max(r.width, r.height) * 1.5;
    sp.style.cssText = `position:absolute;border-radius:50%;pointer-events:none;z-index:0;width:${size}px;height:${size}px;left:${e.clientX - r.left - size/2}px;top:${e.clientY - r.top - size/2}px;background:rgba(124,29,43,.07);transform:scale(0);animation:rip .6s ease-out forwards;`;
    card.appendChild(sp);
    setTimeout(() => sp.remove(), 650);
  });
});

const sparkWrap = document.getElementById('sparkles');
let lastSpark = 0;
document.addEventListener('mousemove', e => {
  const now = Date.now();
  if (now - lastSpark < 90) return;
  lastSpark = now;
  const d = document.createElement('div');
  const sz = 4 + Math.random() * 5;
  const clr = ['#7C1D2B','#E8A0A8','#F5C8CC'][Math.floor(Math.random()*3)];
  d.className = 'sp';
  d.style.cssText = `left:${e.clientX - sz/2}px;top:${e.clientY - sz/2}px;width:${sz}px;height:${sz}px;background:${clr};`;
  if(sparkWrap) sparkWrap.appendChild(d);
  setTimeout(() => d.remove(), 800);
});

/* ── LIGHTBOX ── */
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
let isZoomed = false;

function openLightbox(src) {
  if(!lightbox) return;
  lbImg.src = src;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  resetZoom();
}

function closeLightbox() {
  if(!lightbox) return;
  lightbox.classList.remove('open');
  if (!document.querySelector('.modal-overlay.open')) {
    document.body.style.overflow = '';
  }
  resetZoom();
}

function resetZoom() {
  isZoomed = false;
  lbImg.style.transform = 'scale(1)';
  lbImg.style.cursor = 'zoom-in';
}

if(lbImg) {
  lbImg.addEventListener('click', (e) => {
    isZoomed = !isZoomed;
    if (isZoomed) {
      lbImg.style.transform = 'scale(2)';
      lbImg.style.cursor = 'zoom-out';
    } else {
      resetZoom();
    }
  });
}

if(lightbox) {
  lightbox.addEventListener('mousemove', (e) => {
    if (!isZoomed) return;
    const { clientX: x, clientY: y } = e;
    const { innerWidth: w, innerHeight: h } = window;
    const moveX = (x / w - 0.5) * -100;
    const moveY = (y / h - 0.5) * -100;
    lbImg.style.transform = `scale(2) translate(${moveX}%, ${moveY}%)`;
  });
  document.getElementById('lbClose').onclick = closeLightbox;
  lightbox.onclick = (e) => { if (e.target === lightbox || e.target.classList.contains('lb-container')) closeLightbox(); };
}

/* ── PRODUCT MODAL ── */
const pModal = document.getElementById('productModal');
let mCurrentProd = null;

if(document.getElementById('modalMainImg')) {
  document.getElementById('modalMainImg').addEventListener('click', function() {
    openLightbox(this.src);
  });
}

function openProductModal(name, price, img, cat, desc, ingredients) {
  mCurrentProd = { name, price, img, cat, desc };
  document.getElementById('modalTitle').textContent = name;
  document.getElementById('modalPrice').textContent = `R$ ${price.toFixed(2)}`;
  document.getElementById('modalMainImg').src = img;
  document.getElementById('modalDescFull').textContent = desc + " Nossa receita artesanal utiliza ingredientes premium para garantir uma experiência inesquecível de sabor e nostalgia.";
  document.getElementById('modalIngredientsText').textContent = ingredients || "Farinha de trigo, açúcar, ovos, manteiga e ingredientes secretos da DoceVilla.";
  document.getElementById('modalQty').value = 1;
  
  const custSection = document.getElementById('customizationSection');
  if (cat.includes('Bolos') || cat.includes('Kits')) {
    custSection.style.display = 'block';
  } else {
    custSection.style.display = 'none';
  }

  const thumbs = document.getElementById('modalThumbs');
  thumbs.innerHTML = `
    <img src="${img}" class="active" onclick="setMImg(this.src, this)">
    <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&q=80" onclick="setMImg(this.src, this)">
    <img src="https://images.unsplash.com/photo-1464349095431-e9a21285b19b?w=200&q=80" onclick="setMImg(this.src, this)">
  `;
  pModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePModal() {
  pModal.classList.remove('open');
  document.body.style.overflow = '';
  document.getElementById('custTema').value = '';
  document.getElementById('custInst').value = '';
  document.getElementById('custFile').value = '';
  document.getElementById('fileNameDisplay').textContent = 'Nenhum arquivo selecionado';
}

function setMImg(src, t) {
  document.getElementById('modalMainImg').src = src;
  document.querySelectorAll('.thumb-strip img').forEach(i => i.classList.remove('active'));
  t.classList.add('active');
}

function changeModalQty(d) {
  const i = document.getElementById('modalQty');
  let v = parseInt(i.value) + d;
  if (v < 1) v = 1;
  i.value = v;
}

if(pModal) {
  document.getElementById('closeModal').onclick = closePModal;
  pModal.onclick = (e) => { if(e.target === pModal) closePModal(); };
  document.getElementById('modalAddToCart').onclick = () => {
    const q = parseInt(document.getElementById('modalQty').value);
    let customization = null;
    if (document.getElementById('customizationSection').style.display === 'block') {
      customization = {
        massa: document.getElementById('custMassa').value,
        recheio: document.getElementById('custRecheio').value,
        cobertura: document.getElementById('custCobertura').value,
        tamanho: document.getElementById('custTamanho').value,
        tema: document.getElementById('custTema').value,
        instrucoes: document.getElementById('custInst').value,
        hasImage: !!document.getElementById('custFile').files[0]
      };
    }
    for(let i=0; i<q; i++) addToCart(mCurrentProd.name, mCurrentProd.price, mCurrentProd.img, customization);
    closePModal();
  };
}

/* ── CART LOGIC ── */
let cart = JSON.parse(localStorage.getItem('docevilla_cart')) || [];
let shippingValue = 0;
let discountValue = 0;

function saveCart() {
  localStorage.setItem('docevilla_cart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(name, price, img, customization = null) {
  if (customization) {
    cart.push({ name, price, img, quantity: 1, customization });
  } else {
    const existing = cart.find(item => item.name === name && !item.customization);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ name, price, img, quantity: 1 });
    }
  }
  saveCart();
  openCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
}

function updateQuantity(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) removeFromCart(index);
  else saveCart();
}

function calcShip() {
  const zip = document.getElementById('cartZip').value.trim();
  if (zip.length < 8) {
    document.getElementById('shipRes').textContent = "CEP inválido";
    return;
  }
  shippingValue = 25.00;
  document.getElementById('shipRes').textContent = "Frete Estimado: R$ 25,00";
  updateCartUI();
}

function applyC() {
  const c = document.getElementById('cartCoupon').value.toUpperCase();
  if (c === 'DOCEVILLA10') {
    discountValue = 0.1;
    document.getElementById('couponRes').textContent = "Cupom aplicado: 10% OFF";
  } else {
    discountValue = 0;
    document.getElementById('couponRes').textContent = "Cupom inválido";
  }
  updateCartUI();
}

function updateCartUI() {
  const itemsContainer = document.getElementById('cartItems');
  const countBadge = document.querySelector('.cart-count');
  if(!itemsContainer) return;

  let subtotal = 0;
  let totalCount = 0;
  
  if (cart.length === 0) {
    itemsContainer.innerHTML = '<div class="cart-empty">Seu carrinho está vazio</div>';
    shippingValue = 0;
    discountValue = 0;
  } else {
    itemsContainer.innerHTML = cart.map((item, index) => {
      totalCount += item.quantity;
      subtotal += item.price * item.quantity;
      let custDetails = item.customization ? `<div class="item-cust-summary">Personalizado: ${item.customization.tamanho} / ${item.customization.massa}</div>` : "";
      return `<div class="cart-item"><img src="${item.img}"><div class="ci-details"><h4>${item.name}</h4>${custDetails}<p>R$ ${item.price.toFixed(2)}</p><div class="ci-qty"><button onclick="updateQuantity(${index}, -1)">-</button><span>${item.quantity}</span><button onclick="updateQuantity(${index}, 1)">+</button></div></div><button class="ci-remove" onclick="removeFromCart(${index})">✕</button></div>`;
    }).join('');
  }
  
  const discAmt = subtotal * discountValue;
  const total = subtotal + shippingValue - discAmt;
  if(countBadge) countBadge.textContent = totalCount;
  document.getElementById('cartSubtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
  document.getElementById('cartShipping').textContent = `R$ ${shippingValue.toFixed(2)}`;
  document.getElementById('cartDiscount').textContent = `- R$ ${discAmt.toFixed(2)}`;
  document.getElementById('cartTotalAmount').textContent = `R$ ${total.toFixed(2)}`;
  const cartToggle = document.getElementById('cartToggle');
  if(cartToggle) cartToggle.style.display = totalCount > 0 ? 'flex' : 'none';
}

function openCart() { document.getElementById('cartDrawer').classList.add('open'); }
function closeCart() { document.getElementById('cartDrawer').classList.remove('open'); }

if(document.getElementById('cartToggle')) document.getElementById('cartToggle').addEventListener('click', openCart);
if(document.getElementById('cartClose')) document.getElementById('cartClose').addEventListener('click', closeCart);

if(document.getElementById('checkoutBtn')) {
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) return;
    const payMethod = document.querySelector('input[name="pMethod"]:checked').value;
    const date = document.getElementById('cartDate').value || "Não informada";
    const zip = document.getElementById('cartZip').value || "Não informado";
    let message = "Olá DoceVilla! Gostaria de fazer um pedido:\n\n";
    cart.forEach(item => {
      message += `*• ${item.quantity}x ${item.name}* - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
      if (item.customization) {
        message += `   - Massa: ${item.customization.massa}\n   - Recheio: ${item.customization.recheio}\n   - Cobertura: ${item.customization.cobertura}\n   - Tamanho: ${item.customization.tamanho}\n`;
      }
    });
    message += `\n--- Resumo ---\nSubtotal: ${document.getElementById('cartSubtotal').textContent}\nFrete: ${document.getElementById('cartShipping').textContent}\n*Total Final: ${document.getElementById('cartTotalAmount').textContent}*\n\nData: ${date}\nPagamento: ${payMethod}`;
    window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(message)}`, '_blank');
  });
}

/* ── WIZARD (MONTE SEU BOLO) ── */
const wizardState = {
  step: 1,
  tamanho: { name: '', price: 0 },
  massa: { name: '', price: 0, color: '#fffacd' },
  recheio: [],
  cobertura: { name: '', price: 0 },
  decoracao: { estilo: { name: '', price: 0 }, cor: '#ffffff' },
  extras: [],
  personalizacao: { nome: '', idade: '', mensagem: '', imagem: null },
  total: 0
};

function navWizard(dir) {
  if (dir === 1) {
    if (wizardState.step === 1 && !wizardState.tamanho.name) return alert('Por favor, selecione um tamanho.');
    if (wizardState.step === 2 && !wizardState.massa.name) return alert('Por favor, selecione uma massa.');
    if (wizardState.step === 4 && !wizardState.cobertura.name) return alert('Por favor, selecione uma cobertura.');
  }
  wizardState.step += dir;
  if (wizardState.step < 1) wizardState.step = 1;
  if (wizardState.step > 7) wizardState.step = 7;

  document.querySelectorAll('.w-step-pane').forEach(p => p.classList.remove('active'));
  document.getElementById(`wStep${wizardState.step}`).classList.add('active');

  document.querySelectorAll('.wp-step').forEach(p => {
    const s = parseInt(p.dataset.step);
    p.classList.remove('active');
    if (s < wizardState.step) p.classList.add('completed');
    else p.classList.remove('completed');
    if (s === wizardState.step) p.classList.add('active');
  });

  document.getElementById('btnWPrev').style.display = wizardState.step > 1 ? 'block' : 'none';
  document.getElementById('btnWNext').style.display = wizardState.step < 7 ? 'block' : 'none';
  document.getElementById('btnWFinish').style.display = wizardState.step === 7 ? 'block' : 'none';

  // Update progress bar
  const progressPercent = (wizardState.step / 7) * 100;
  const progressBar = document.getElementById('wProgressBar');
  if(progressBar) progressBar.style.width = `${progressPercent}%`;

  if (wizardState.step === 7) buildSummary();
}

function selectWizardOption(category, name, price, el, color = null) {
  const siblings = el.parentElement.querySelectorAll('.w-card');
  siblings.forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  
  if (category === 'tamanho') wizardState.tamanho = { name, price };
  if (category === 'massa') wizardState.massa = { name, price, color };
  if (category === 'cobertura') wizardState.cobertura = { name, price };
  if (category === 'estilo') wizardState.decoracao.estilo = { name, price };
  
  updateWizardPrice();
}

function selectWizardColor(color, el) {
  const siblings = el.parentElement.querySelectorAll('.w-color-btn');
  siblings.forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  wizardState.decoracao.cor = color;
}

function handleRecheio(cb) {
  const checked = document.querySelectorAll('input[name="w_recheio"]:checked');
  if (checked.length > 2) { cb.checked = false; return alert('Máximo 2 recheios.'); }
  wizardState.recheio = Array.from(checked).map(c => ({ name: c.value, price: parseFloat(c.dataset.price) }));
  updateWizardPrice();
}

function handleExtras() {
  const checked = document.querySelectorAll('input[name="w_extras"]:checked');
  wizardState.extras = Array.from(checked).map(c => ({ name: c.value, price: parseFloat(c.dataset.price) }));
  updateWizardPrice();
}

function updateWizardState() {
  const nome = document.getElementById('wNome');
  const idade = document.getElementById('wIdade');
  const mensagem = document.getElementById('wMensagem');
  
  if(nome) wizardState.personalizacao.nome = nome.value;
  if(idade) wizardState.personalizacao.idade = idade.value;
  if(mensagem) wizardState.personalizacao.mensagem = mensagem.value;
}

function updateWizardPrice() {
  let t = wizardState.tamanho.price + wizardState.massa.price + wizardState.cobertura.price + (wizardState.decoracao.estilo.price || 0);
  let rPrice = wizardState.recheio.reduce((a,b) => a + b.price, 0) + (wizardState.recheio.length === 2 ? 10 : 0);
  t += rPrice;
  wizardState.extras.forEach(e => t += e.price);
  wizardState.total = t;
  const priceNav = document.getElementById('wNavTotal');
  if(priceNav) priceNav.textContent = `Total: R$ ${t.toFixed(2).replace('.', ',')}`;
}

function buildSummary() {
  const sb = document.getElementById('wSummaryContent');
  if(!sb) return;
  
  let html = `
    <div class="ws-item"><span>Tamanho:</span> <strong>${wizardState.tamanho.name}</strong></div>
    <div class="ws-item"><span>Massa:</span> <strong>${wizardState.massa.name}</strong></div>
    <div class="ws-item"><span>Recheio:</span> <strong>${wizardState.recheio.map(r=>r.name).join(' & ') || 'Nenhum'}</strong></div>
    <div class="ws-item"><span>Cobertura:</span> <strong>${wizardState.cobertura.name}</strong></div>
    <div class="ws-item"><span>Estilo:</span> <strong>${wizardState.decoracao.estilo.name || 'Padrão'}</strong></div>
  `;
  
  if (wizardState.personalizacao.nome) {
    html += `<div class="ws-item"><span>Personalização:</span> <strong>${wizardState.personalizacao.nome}</strong></div>`;
  }
  
  sb.innerHTML = html;
}

function finishWizard() {
  const user = auth.currentUser;
  const orderDetails = {
    tipo: 'Bolo Personalizado',
    tamanho: wizardState.tamanho.name,
    massa: wizardState.massa.name,
    recheio: wizardState.recheio.map(r=>r.name).join(' & '),
    cobertura: wizardState.cobertura.name,
    estilo: wizardState.decoracao.estilo.name || 'Padrão',
    total: wizardState.total,
    data: new Date().toISOString()
  };

  if (user) {
    saveOrderToFirestore(user.uid, orderDetails);
  }

  let msg = `Olá! Gostaria de solicitar um orçamento para Bolo Personalizado DoceVilla:\n\n♥ Tamanho: ${orderDetails.tamanho}\n♥ Massa: ${orderDetails.massa}\n♥ Recheio: ${orderDetails.recheio}\n♥ Cobertura: ${orderDetails.cobertura}\n♥ Estilo: ${orderDetails.estilo}\n\nValor Estimado: R$ ${orderDetails.total.toFixed(2)}`;
  
  if (wizardState.personalizacao.nome) {
    msg += `\n♥ Nome para o topo: ${wizardState.personalizacao.nome}`;
  }
  
  window.open(`https://wa.me/5511999998888?text=${encodeURIComponent(msg)}`, '_blank');
}

function saveOrderToFirestore(uid, order) {
  if (typeof firebase === 'undefined') return;
  const db = firebase.firestore();
  db.collection('users').doc(uid).get().then(doc => {
    let orders = [];
    if(doc.exists) orders = doc.data().pedidos || [];
    orders.unshift(order); // Newest first
    return db.collection('users').doc(uid).update({ pedidos: orders });
  }).then(() => console.log('Pedido salvo no histórico.'));
}

/* ── ADMIN & USER ── */
// Legacy logic removed for Firebase integration

/* ── AI CHAT ── */
const aiChatBtn = document.getElementById('aiChatBtn');
const aiChatWindow = document.getElementById('aiChatWindow');
if(aiChatBtn) aiChatBtn.onclick = () => aiChatWindow.classList.toggle('open');
if(document.getElementById('closeAiChat')) document.getElementById('closeAiChat').onclick = () => aiChatWindow.classList.remove('open');

function addChatMsg(text, type) {
  const msg = document.createElement('div');
  msg.className = `ai-msg ${type}`;
  msg.innerHTML = text;
  const body = document.getElementById('aiChatBody');
  if(body) { body.appendChild(msg); body.scrollTop = body.scrollHeight; }
}



function initSocialProof() {
  const names = ['Mariana', 'Ricardo', 'Beatriz', 'Juliana', 'Carlos', 'Sofia', 'Enzo', 'Valentina'];
  const products = ['Bolo Vintage', 'Donuts Retrô', 'Kit Noivado', 'Torta Floresta Negra', 'Bolo Personalizado', 'Cupcakes Românticos'];
  const locations = ['em São Paulo', 'em Santos', 'em Campinas', 'em Curitiba', 'em Belo Horizonte'];
  
  setInterval(() => {
    if (Math.random() > 0.6) {
      const name = names[Math.floor(Math.random() * names.length)];
      const prod = products[Math.floor(Math.random() * products.length)];
      const loc = locations[Math.floor(Math.random() * locations.length)];
      showToast(`<strong>${name}</strong> de ${loc} acabou de pedir um <strong>${prod}</strong>!`);
    }
  }, 20000);
}

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast-msg';
  t.innerHTML = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('show'), 100);
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 500);
  }, 4000);
}

/* ── AUTHENTICATION LOGIC (FIREBASE PREMIUM) ── */

// NOTE: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "docevilla-auth.firebaseapp.com",
  projectId: "docevilla-auth",
  storageBucket: "docevilla-auth.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Initialize Firebase (Compat Version)
let auth, db;
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  db = firebase.firestore();

  // Elements
  const authOverlay = document.getElementById('authOverlay');
  const userBtn = document.getElementById('userBtn');
  const userDashboard = document.getElementById('userDashboard');
  
  // Auth Sections
  const loginSection = document.getElementById('loginSection');
  const registerSection = document.getElementById('registerSection');
  const recoverySection = document.getElementById('recoverySection');

  // Register Steps
  let currentRegStep = 1;

  // --- UI CONTROLS ---

  window.openAuth = () => {
    if (authOverlay) {
      authOverlay.style.display = 'flex';
      switchAuth('login');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeAuth = () => {
    if (authOverlay) {
      authOverlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  };

  window.switchAuth = (mode) => {
    if (loginSection) loginSection.style.display = mode === 'login' ? 'block' : 'none';
    if (registerSection) {
      registerSection.style.display = mode === 'register' ? 'block' : 'none';
      if (mode === 'register') nextRegStep(1); // Reset to step 1
    }
    if (recoverySection) recoverySection.style.display = mode === 'recovery' ? 'block' : 'none';
  };

  window.nextRegStep = (step) => {
    currentRegStep = step;
    document.querySelectorAll('.reg-step').forEach(s => s.classList.remove('active'));
    document.getElementById(`regStep${step}`).classList.add('active');
    
    // Update dots
    document.querySelectorAll('.ap-dot').forEach(dot => {
      dot.classList.toggle('active', parseInt(dot.dataset.step) === step);
    });
  };

  window.togglePassVisibility = (inputId) => {
    const input = document.getElementById(inputId);
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
  };

  // Close on overlay click (if not on modal)
  if (authOverlay) {
    authOverlay.addEventListener('click', (e) => {
      if (e.target === authOverlay) closeAuth();
    });
  }

  // --- ADDRESS AUTO-FILL (ViaCEP) ---

  window.checkCEP = (input, prefix = 'db') => {
    const cep = input.value.replace(/\D/g, '');
    if (cep.length !== 8) return;

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(res => res.json())
      .then(data => {
        if (!data.erro) {
          const rua = document.getElementById(`${prefix}Rua`);
          const bairro = document.getElementById(`${prefix}Bairro`);
          const cidade = document.getElementById(`${prefix}Cidade`);
          const estado = document.getElementById(`${prefix}Estado`);

          if (rua) rua.value = data.logradouro;
          if (bairro) bairro.value = data.bairro;
          if (cidade) cidade.value = data.localidade;
          if (estado) estado.value = data.uf;
          
          // Focus on number if rua is filled
          const num = document.getElementById(`${prefix}Num`);
          if (num) num.focus();
        }
      })
      .catch(() => console.error("Erro ao buscar CEP"));
  };

  // --- FIREBASE HANDLERS ---

  // 1. Google Login
  const googleLoginBtn = document.getElementById('googleLogin');
  if(googleLoginBtn) googleLoginBtn.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        // Check if user exists in Firestore
        return db.collection('users').doc(user.uid).get();
      })
      .then((doc) => {
        if (!doc.exists) {
          // New user from Google, maybe redirect to complete registration or just save basics
          const user = auth.currentUser;
          db.collection('users').doc(user.uid).set({
            nome: user.displayName,
            email: user.email,
            foto: user.photoURL,
            dataCriacao: firebase.firestore.FieldValue.serverTimestamp()
          });
        }
        closeAuth();
      })
      .catch(error => {
        console.error(error);
        alert('Erro no login com Google: ' + error.message);
      });
  });

  // 2. Email Login
  const loginForm = document.getElementById('loginForm');
  if(loginForm) loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;
    const remember = document.getElementById('rememberMe').checked;

    // Firebase handles persistence based on auth state, but we can set it explicitly
    const persistence = remember ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION;
    
    auth.setPersistence(persistence)
      .then(() => auth.signInWithEmailAndPassword(email, pass))
      .then(() => closeAuth())
      .catch(error => alert('Erro no login: ' + error.message));
  });

  // 3. Complete Registration
  const registerForm = document.getElementById('registerForm');
  if(registerForm) registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const tel = document.getElementById('regTel').value;
    const pass = document.getElementById('regPass').value;
    
    // Address data
    const address = {
      cep: document.getElementById('regCEP').value,
      rua: document.getElementById('regRua').value,
      num: document.getElementById('regNum').value,
      bairro: document.getElementById('regBairro').value,
      cidade: document.getElementById('regCidade').value,
      estado: document.getElementById('regEstado')?.value || ''
    };

    // Optional data
    const birth = document.getElementById('regBirth').value;
    const prefs = Array.from(document.querySelectorAll('input[name="regPref"]:checked')).map(c => c.value);

    auth.createUserWithEmailAndPassword(email, pass)
      .then((result) => {
        return db.collection('users').doc(result.user.uid).set({
          nome: name,
          email: email,
          telefone: tel,
          enderecos: [address],
          nascimento: birth,
          preferencias: prefs,
          dataCriacao: firebase.firestore.FieldValue.serverTimestamp()
        });
      })
      .then(() => {
        auth.currentUser.updateProfile({ displayName: name });
        closeAuth();
        showToast("♥ Bem-vindo à DoceVilla! Conta criada com sucesso.");
      })
      .catch(error => alert('Erro no cadastro: ' + error.message));
  });

  // 4. Recovery
  const recoveryForm = document.getElementById('recoveryForm');
  if(recoveryForm) recoveryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('recoveryEmail').value;
    auth.sendPasswordResetEmail(email)
      .then(() => {
        alert('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
        switchAuth('login');
      })
      .catch(error => alert('Erro: ' + error.message));
  });

  // --- DASHBOARD LOGIC ---

  const dbAvatar = document.getElementById('dbAvatar');
  const dbUserName = document.getElementById('dbUserName');
  const dbUserEmail = document.getElementById('dbUserEmail');

  window.toggleDashboard = () => {
    if (userDashboard) {
      const isHidden = userDashboard.style.display === 'none';
      userDashboard.style.display = isHidden ? 'block' : 'none';
      if (isHidden) {
        userDashboard.scrollIntoView({ behavior: 'smooth' });
        loadUserData();
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  if(userBtn) userBtn.addEventListener('click', () => {
    const user = auth.currentUser;
    if (user) toggleDashboard();
    else openAuth();
  });

  // Dashboard Tabs
  document.querySelectorAll('.db-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if(btn.classList.contains('logout')) return;
      document.querySelectorAll('.db-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.db-pane').forEach(p => p.style.display = 'none');
      btn.classList.add('active');
      const paneId = btn.dataset.tab;
      const pane = document.getElementById(paneId);
      if(pane) pane.style.display = 'block';
    });
  });

  function loadUserData() {
    const user = auth.currentUser;
    if(!user) return;

    if(dbAvatar) dbAvatar.style.backgroundImage = `url(${user.photoURL || 'https://api.dicebear.com/7.x/initials/svg?seed=' + user.email})`;
    if(dbUserName) dbUserName.textContent = user.displayName || 'Membro Premium';
    if(dbUserEmail) dbUserEmail.textContent = user.email;

    db.collection('users').doc(user.uid).get().then(doc => {
      if (doc.exists) {
        const data = doc.data();
        if(document.getElementById('dbName')) document.getElementById('dbName').value = data.nome || '';
        if(document.getElementById('dbEmailDisplay')) document.getElementById('dbEmailDisplay').value = data.email || '';
        if(document.getElementById('dbTel')) document.getElementById('dbTel').value = data.telefone || '';
        if(document.getElementById('dbBirth')) document.getElementById('dbBirth').value = data.nascimento || '';
        
        // Load Preferences
        if (data.preferencias) {
          document.querySelectorAll('input[name="pref"]').forEach(input => {
            input.checked = data.preferencias.includes(input.value);
          });
        }

        renderAddresses(data.enderecos || []);
        renderOrders(data.pedidos || []);
      }
    });
  }

  function renderAddresses(list) {
    const container = document.getElementById('dbAddressList');
    if(!container) return;
    if(list.length === 0) {
      container.innerHTML = '<div class="db-address-empty"><span class="empty-icon">📍</span><p>Nenhum endereço salvo.</p></div>';
      return;
    }
    container.innerHTML = list.map((addr, idx) => `
      <div class="db-address-card stitching" style="padding: 1.5rem; background: white; border-radius: var(--r-sm); position: relative;">
        <strong style="color:var(--rose-deep)">${addr.rua}, ${addr.num}</strong><br>
        <span style="font-size:0.85rem; color:var(--text-md)">${addr.bairro} - ${addr.cidade} / ${addr.estado || ''}</span><br>
        <code style="font-size:0.75rem; color:var(--text-muted)">${addr.cep}</code>
        <button onclick="removeAddress(${idx})" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: var(--rose-deep); cursor: pointer; font-size: 0.8rem; font-weight: 600;">Excluir</button>
      </div>
    `).join('');
  }

  window.removeAddress = (idx) => {
    if(!confirm('Deseja excluir este endereço?')) return;
    const user = auth.currentUser;
    db.collection('users').doc(user.uid).get().then(doc => {
      let addresses = doc.data().enderecos || [];
      addresses.splice(idx, 1);
      return db.collection('users').doc(user.uid).update({ enderecos: addresses });
    }).then(() => loadUserData());
  };

  // Dashboard Form Handlers
  const dbProfileForm = document.getElementById('dbProfileForm');
  if(dbProfileForm) dbProfileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    const nome = document.getElementById('dbName').value;
    const tel = document.getElementById('dbTel').value;
    const birth = document.getElementById('dbBirth').value;
    const prefs = Array.from(document.querySelectorAll('input[name="pref"]:checked')).map(c => c.value);

    db.collection('users').doc(user.uid).update({
      nome: nome,
      telefone: tel,
      nascimento: birth,
      preferencias: prefs
    }).then(() => {
      showToast('♥ Perfil atualizado com sucesso!');
      user.updateProfile({ displayName: nome });
      loadUserData();
    });
  });

  window.toggleAddressForm = () => {
    const form = document.getElementById('dbAddressForm');
    if(form) form.style.display = form.style.display === 'none' ? 'block' : 'none';
  };

  const dbAddressForm = document.getElementById('dbAddressForm');
  if(dbAddressForm) dbAddressForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    const newAddr = {
      cep: document.getElementById('dbCEP').value,
      rua: document.getElementById('dbRua').value,
      num: document.getElementById('dbNum').value,
      comp: document.getElementById('dbComp').value,
      bairro: document.getElementById('dbBairro').value,
      cidade: document.getElementById('dbCidade').value,
      estado: document.getElementById('dbEstado').value
    };

    db.collection('users').doc(user.uid).get().then(doc => {
      let addresses = doc.data().enderecos || [];
      addresses.push(newAddr);
      return db.collection('users').doc(user.uid).update({ enderecos: addresses });
    }).then(() => {
      showToast('♥ Novo endereço salvo!');
      dbAddressForm.reset();
      toggleAddressForm();
      loadUserData();
    });
  });

  const dbPassForm = document.getElementById('dbPassForm');
  if(dbPassForm) dbPassForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    const newPass = document.getElementById('dbNewPass').value;
    const confirmPass = document.getElementById('dbConfirmPass').value;

    if(newPass !== confirmPass) {
      alert('As senhas não coincidem!');
      return;
    }

    user.updatePassword(newPass).then(() => {
      showToast('♥ Senha alterada com sucesso!');
      dbPassForm.reset();
    }).catch(error => alert('Erro ao alterar senha: ' + error.message));
  });


  // --- AUTH STATE LISTENER ---

  auth.onAuthStateChanged(user => {
    if (user) {
      if(userBtn) userBtn.innerHTML = `<div style="width:28px; height:28px; border-radius:50%; background-image:url(${user.photoURL || 'https://api.dicebear.com/7.x/initials/svg?seed=' + user.email}); background-size:cover; border:2px solid var(--rose-lt);"></div>`;
      
      // Auto-fill checkout fields
      db.collection('users').doc(user.uid).get().then(doc => {
        if (doc.exists) {
          const data = doc.data();
          if(document.getElementById('nome')) document.getElementById('nome').value = data.nome || '';
          if(document.getElementById('email')) document.getElementById('email').value = data.email || '';
          if(document.getElementById('whats')) document.getElementById('whats').value = data.telefone || '';
          
          // Fill checkout address hint if exists
          if(data.enderecos && data.enderecos.length > 0) {
            const addr = data.enderecos[0];
            const msgInput = document.getElementById('mensagem');
            if(msgInput && !msgInput.value) {
              msgInput.placeholder = `Entregar em: ${addr.rua}, ${addr.num} - ${addr.bairro}. Detalhes: `;
            }
          }
        }
      });
    } else {
      if(userBtn) userBtn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
      if(userDashboard) userDashboard.style.display = 'none';
    }
  });

  const btnLogout = document.getElementById('btnLogout');
  if(btnLogout) btnLogout.addEventListener('click', () => {
    auth.signOut().then(() => {
      window.location.reload(); // Reload to clear states
    });
  });

  function renderOrders(list) {
    const container = document.getElementById('dbOrderList');
    if(!container) return;
    if(list.length === 0) {
      container.innerHTML = '<div class="db-order-empty"><span class="empty-icon"></span><p>Nenhum pedido realizado ainda.</p></div>';
      return;
    }
    container.innerHTML = list.map((order, idx) => `
      <div class="db-order-card stitching" style="padding: 1.5rem; background: white; border-radius: var(--r-sm); margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <strong style="color:var(--rose-deep)">${order.tipo}</strong>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${new Date(order.data).toLocaleDateString()}</span>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-md);">${order.mensagem || 'Sem observações'}</p>
        <button onclick="repeatOrder(${idx})" class="btn-cro secondary sm" style="margin-top: 1rem; padding: 0.5rem 1rem; min-height: auto;">Repetir Pedido ♥</button>
      </div>
    `).join('');
  }

  window.repeatOrder = (idx) => {
    const user = auth.currentUser;
    db.collection('users').doc(user.uid).get().then(doc => {
      const order = doc.data().pedidos[idx];
      let msg = `Olá! Gostaria de REPETIR meu pedido anterior:\n\n♥ ${order.tipo}\n`;
      if(order.mensagem) msg += `♥ Detalhes: ${order.mensagem}\n`;
      window.open(`https://wa.me/5511999998888?text=${encodeURIComponent(msg)}`, '_blank');
    });
  };

  function saveOrderToFirestore(uid, order) {
    db.collection('users').doc(uid).get().then(doc => {
      let orders = [];
      if(doc.exists) orders = doc.data().pedidos || [];
      orders.push(order);
      db.collection('users').doc(uid).update({ pedidos: orders });
    });
  }

  const contactForm = document.getElementById('contactForm');
  if(contactForm) contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    const orderDetails = {
      tipo: document.getElementById('produto')?.value || 'Orçamento Geral',
      ocasiao: document.getElementById('ocasiao')?.value || 'N/A',
      dataEvento: document.getElementById('data')?.value || 'N/A',
      mensagem: document.getElementById('mensagem')?.value,
      data: new Date().toISOString()
    };
    if (user) saveOrderToFirestore(user.uid, orderDetails);
    
    // Toast success
    showToast("Pedido enviado para análise! Logo entraremos em contato.");
    contactForm.reset();
  });

  window.showToast = (msg) => {
    const toast = document.createElement('div');
    toast.className = 'premium-toast';
    toast.innerHTML = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  };

  // --- MASKS (Simple implementation) ---

  const applyMask = (input, mask) => {
    input.addEventListener('input', () => {
      let val = input.value.replace(/\D/g, '');
      let masked = '';
      let i = 0;
      for (const char of mask) {
        if (i >= val.length) break;
        if (char === '0') {
          masked += val[i++];
        } else {
          masked += char;
        }
      }
      input.value = masked;
    });
  };

  document.querySelectorAll('.mask-tel').forEach(el => applyMask(el, '(00) 00000-0000'));
  document.querySelectorAll('.mask-cep').forEach(el => applyMask(el, '00000-000'));

}


/* ================================================================
   PRODUCT MODAL LOGIC (PREMIUM)
   ================================================================ */
function openProductModal(name, price, img, desc) {
  const modal = document.getElementById('productModal');
  if(!modal) return;
  
  // Populate data
  document.getElementById('pmTitle').textContent = name;
  document.getElementById('pmPrice').textContent = `R$ ${price}`;
  document.getElementById('pmMainImage').src = img;
  
  if(desc) {
    document.getElementById('pmDesc').textContent = desc;
  } else {
    document.getElementById('pmDesc').textContent = "Feito com ingredientes selecionados e muito carinho, nossa especialidade traz um sabor inesquecível para tornar o seu momento perfeito.";
  }

  // Thumbnails mock (duplicando a principal)
  const thumbContainer = document.getElementById('pmThumbnails');
  thumbContainer.innerHTML = `
    <div class="pm-thumb active"><img src="${img}" alt="thumb"></div>
    <div class="pm-thumb"><img src="${img}" alt="thumb"></div>
  `;

  // Update Cart Button Action
  const btnCart = document.getElementById('pmBtnCart');
  btnCart.onclick = function() {
    addToCart(name, price, img);
    closeProductModal();
  };

  // Open Modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  if(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function switchPmTab(tabId) {
  // Update Buttons
  document.querySelectorAll('.pm-tab-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  // Update Content
  document.querySelectorAll('.pm-tab-content').forEach(content => content.classList.remove('active'));
  document.getElementById(`pm-tab-${tabId}`).classList.add('active');
}

// Override button clicks on product cards to open modal instead of adding directly
document.addEventListener('DOMContentLoaded', () => {
  const pedirBtns = document.querySelectorAll('.btn-pedir');
  pedirBtns.forEach(btn => {
    // Save original onclick string if any
    const onclickStr = btn.getAttribute('onclick');
    if(onclickStr && onclickStr.includes('addToCart')) {
      // Extract args: addToCart('Bolo de Morango', 120, 'img.png')
      const argsMatch = onclickStr.match(/addToCart\((.*?)\)/);
      if(argsMatch) {
        btn.removeAttribute('onclick');
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          // Evaluate args safely
          const args = eval(`[${argsMatch[1]}]`);
          openProductModal(args[0], args[1], args[2], btn.closest('.pcard-body').querySelector('p')?.textContent);
        });
      }
    }
  });
});

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();

  initSocialProof();
  console.log('%c♥ Docevilla – Carregado', 'color:#7C1D2B;font-weight:bold;');
});

