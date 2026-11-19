// Night sky behind the page: twinkling stars, and a meteor shower (moon and sun are photos in sky/).
(() => {
  const c = document.getElementById('sky'), x = c.getContext('2d');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w, h, dpr, stars = [], meteors = [], next = 0;
  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2); w = innerWidth; h = innerHeight;
    c.width = w * dpr; c.height = h * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = Array.from({ length: Math.round(w * h / 2600) }, () => ({
      x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.1 + .3,
      a: Math.random() * .6 + .25, s: Math.random() * 2 + .6, p: Math.random() * 6.3,
      gold: Math.random() < .08 }));
    if (still) draw(0);
  }
  function meteor() {
    const ang = (Math.PI / 180) * (155 + Math.random() * 8); // heading down-left, same direction like a shower
    const sp = 7 + Math.random() * 9;
    meteors.push({ x: w * (.15 + Math.random() * 1.1), y: -40 + Math.random() * h * .6,
      vx: Math.cos(ang) * sp, vy: Math.abs(Math.sin(ang) * sp) + 2.5, len: 70 + Math.random() * 160, life: .55 + Math.random() * .45, wid: .8 + Math.random() * 1.6 });
  }
  function draw(t) {
    x.clearRect(0, 0, w, h);
    for (const st of stars) {
      const a = still ? st.a : st.a * (.6 + .4 * Math.sin(t / 1000 * st.s + st.p));
      x.fillStyle = st.gold ? `rgba(255,217,119,${a})` : `rgba(220,232,255,${a})`;
      x.beginPath(); x.arc(st.x, st.y, st.r, 0, 6.283); x.fill();
    }
    if (still) return;
    if (t > next) { meteor(); if (Math.random() < .3) meteor(); next = t + 50 + Math.random() * 150; }
    meteors = meteors.filter(m => m.life > 0 && m.x > -300 && m.y < h + 300);
    for (const m of meteors) {
      m.x += m.vx; m.y += m.vy; m.life -= .009;
      const n = Math.hypot(m.vx, m.vy), tx = m.x - m.vx / n * m.len, ty = m.y - m.vy / n * m.len;
      const g = x.createLinearGradient(m.x, m.y, tx, ty);
      g.addColorStop(0, `rgba(255,244,214,${m.life})`); g.addColorStop(.25, `rgba(255,217,119,${m.life * .5})`);
      g.addColorStop(1, 'rgba(255,217,119,0)');
      x.strokeStyle = g; x.lineWidth = m.wid; x.lineCap = 'round';
      x.beginPath(); x.moveTo(m.x, m.y); x.lineTo(tx, ty); x.stroke();
      x.fillStyle = `rgba(255,250,235,${m.life})`; x.beginPath(); x.arc(m.x, m.y, m.wid * .8, 0, 6.283); x.fill();
    }
    requestAnimationFrame(draw);
  }
  addEventListener('resize', size); size();
  if (!still) { next = 600; requestAnimationFrame(draw); }
})();
