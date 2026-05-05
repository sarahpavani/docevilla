
/* ── CURSOR & MOUSE INTERACTIONS (ROMANTIC PREMIUM) ── */
const cursor = document.getElementById('custom-cursor');

if (cursor) {
  window.addEventListener('mousemove', (e) => {
    const { clientX: x, clientY: y } = e;
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
    
    // Trail logic
    createTrail(x, y);
  });

  document.querySelectorAll('a, button, .pcard, .kg-item, input, .db-tab-btn, .ai-trigger').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

function createTrail(x, y) {
  if (Math.random() > 0.8) {
    const span = document.createElement('span');
    span.className = 'cursor-trail';
    span.innerHTML = Math.random() > 0.5 ? '🌸' : '✨';
    span.style.left = x + 'px';
    span.style.top = y + 'px';
    span.style.fontSize = Math.random() * 10 + 8 + 'px';
    span.style.position = 'fixed';
    span.style.pointerEvents = 'none';
    span.style.zIndex = '9999';
    span.style.transition = 'all 1s cubic-bezier(0.1, 0.5, 0.5, 1)';
    
    document.body.appendChild(span);
    
    const tx = (Math.random() - 0.5) * 150;
    const ty = (Math.random() - 0.5) * 150;
    
    requestAnimationFrame(() => {
      span.style.transform = `translate(${tx}px, ${ty}px) rotate(${Math.random() * 360}deg) scale(0)`;
      span.style.opacity = '0';
    });

    setTimeout(() => span.remove(), 1000);
  }
}

// Pressed effect
window.addEventListener('mousedown', () => {
  if (cursor) cursor.style.transform = 'scale(0.8)';
});
window.addEventListener('mouseup', () => {
  if (cursor) cursor.style.transform = 'scale(1)';
});

// Parallax on Mouse Move for specific images
document.querySelectorAll('.momento-visual img, .pcard-img img, .kg-item img').forEach(img => {
  const parent = img.parentElement;
  parent.addEventListener('mousemove', (e) => {
    const { width, height, left, top } = parent.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    img.style.transform = `scale(1.1) translate(${x * 25}px, ${y * 25}px)`;
  });
  parent.addEventListener('mouseleave', () => {
    img.style.transform = 'scale(1) translate(0, 0)';
  });
});
