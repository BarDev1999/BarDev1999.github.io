// ===== Concept chart: balance against a flow-neutral index =====
(() => {
  const host = document.querySelector('[data-flow-chart]');
  if (!host) return;
  const pts = JSON.parse(host.dataset.points);
  const depositMonth = Number(host.dataset.deposit);
  const NS = 'http://www.w3.org/2000/svg';
  const el = (name, attrs, text) => {
    const node = document.createElementNS(NS, name);
    Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const series = [
    { key: 'b', name: 'Account balance', color: 'var(--chart-2)' },
    { key: 't', name: 'Flow-neutral return index', color: 'var(--chart-1)' },
  ];
  const textStyle = 'fill:var(--muted);font:12px var(--font-mono)';

  const tip = document.createElement('div');
  tip.className = 'chart-tip';
  tip.hidden = true;

  let current = -1;

  const draw = () => {
    const width = Math.max(280, host.clientWidth);
    const compact = width < 520;
    const height = compact ? 250 : 320;
    const m = { top: 24, right: compact ? 14 : 128, bottom: 30, left: 42 };
    const all = pts.flatMap((p) => [p.b, p.t]);
    const low = Math.floor(Math.min(...all) / 20) * 20;
    const high = Math.ceil(Math.max(...all) / 20) * 20;
    const x = (month) => m.left + (month / 24) * (width - m.left - m.right);
    const y = (v) => m.top + (1 - (v - low) / (high - low)) * (height - m.top - m.bottom);

    host.replaceChildren();
    const svg = el('svg', {
      viewBox: `0 0 ${width} ${height}`, height, role: 'img', tabindex: '0',
      'aria-label': 'Invented example. The account balance jumps when a deposit arrives at month 12, while the flow-neutral return index continues smoothly.',
    });

    for (let v = low; v <= high; v += 20) {
      svg.append(el('line', { x1: m.left, x2: width - m.right, y1: y(v), y2: y(v), style: 'stroke:var(--chart-grid);stroke-width:1' }));
      svg.append(el('text', { x: m.left - 8, y: y(v) + 4, 'text-anchor': 'end', style: textStyle }, v));
    }
    for (let month = 0; month <= 24; month += 6) {
      svg.append(el('text', { x: x(month), y: height - 8, 'text-anchor': 'middle', style: textStyle }, `M${month}`));
    }

    svg.append(el('line', { x1: x(depositMonth), x2: x(depositMonth), y1: m.top - 4, y2: height - m.bottom, style: 'stroke:var(--muted);stroke-width:1' }));
    svg.append(el('text', { x: x(depositMonth) + 6, y: m.top + 6, style: textStyle }, 'Deposit'));

    series.forEach((s) => {
      const d = pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.m).toFixed(1)} ${y(p[s.key]).toFixed(1)}`).join(' ');
      svg.append(el('path', { d, style: `fill:none;stroke:${s.color};stroke-width:2;stroke-linejoin:round;stroke-linecap:round` }));
      const last = pts[pts.length - 1];
      svg.append(el('circle', { cx: x(last.m), cy: y(last[s.key]), r: 4, style: `fill:${s.color};stroke:var(--surface);stroke-width:2` }));
      if (!compact) {
        svg.append(el('text', { x: x(last.m) + 10, y: y(last[s.key]) - 2, style: 'fill:var(--text);font:600 12px var(--font-body)' }, s.key === 'b' ? 'Balance' : 'Return index'));
        svg.append(el('text', { x: x(last.m) + 10, y: y(last[s.key]) + 13, style: textStyle }, last[s.key].toFixed(1)));
      }
    });

    const hover = el('g', { style: 'display:none' });
    const cross = el('line', { y1: m.top, y2: height - m.bottom, style: 'stroke:var(--muted);stroke-width:1' });
    hover.append(cross);
    const dots = series.map((s) => {
      const c = el('circle', { r: 4, style: `fill:${s.color};stroke:var(--surface);stroke-width:2` });
      hover.append(c);
      return c;
    });
    svg.append(hover);
    host.append(svg, tip);

    const show = (i) => {
      current = i;
      const p = pts[i];
      hover.style.display = '';
      cross.setAttribute('x1', x(p.m));
      cross.setAttribute('x2', x(p.m));
      series.forEach((s, n) => {
        dots[n].setAttribute('cx', x(p.m));
        dots[n].setAttribute('cy', y(p[s.key]));
      });
      tip.hidden = false;
      tip.innerHTML = `<strong>Month ${p.m}</strong><br>Balance: ${p.b.toFixed(1)}<br>Return index: ${p.t.toFixed(1)}`;
      const left = x(p.m) + 12;
      tip.style.left = `${left + tip.offsetWidth > width ? x(p.m) - tip.offsetWidth - 12 : left}px`;
    };
    const hide = () => {
      current = -1;
      hover.style.display = 'none';
      tip.hidden = true;
    };

    svg.addEventListener('pointermove', (e) => {
      const box = svg.getBoundingClientRect();
      const month = Math.round((((e.clientX - box.left) - m.left) / (width - m.left - m.right)) * 24);
      show(Math.min(24, Math.max(0, month)));
    });
    svg.addEventListener('pointerleave', hide);
    svg.addEventListener('blur', hide);
    svg.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const step = e.key === 'ArrowRight' ? 1 : -1;
      show(Math.min(24, Math.max(0, (current < 0 ? depositMonth : current) + step)));
    });
  };

  draw();
  let lastWidth = host.clientWidth;
  new ResizeObserver(() => {
    if (host.clientWidth !== lastWidth) {
      lastWidth = host.clientWidth;
      draw();
    }
  }).observe(host);
})();
