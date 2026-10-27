// Let details flow naturally; align the fully opened final heading to the photo.
(() => {
  const section = document.querySelector('#visit');
  const photo = section?.querySelector('.service-photo img');
  const column = section?.querySelector('.service-details');
  if (!photo || !column) return;
  const rows = [...column.querySelectorAll('.service-detail')];
  const lastSummary = rows.at(-1).querySelector('summary');
  let queued = false;
  function align() {
    queued = false;
    column.style.removeProperty('--service-open-spacing');
    if (window.matchMedia('(max-width: 600px)').matches) return;
    const gap = parseFloat(getComputedStyle(column).gap) || 0;
    // Measure each content panel in its own current width, even when closed.
    // A temporary offscreen clone never changes live open/closed states.
    const clone = column.cloneNode(true);
    clone.removeAttribute('aria-label');
    clone.setAttribute('aria-hidden', 'true');
    clone.inert = true;
    Object.assign(clone.style, {
      position: 'absolute', visibility: 'hidden', pointerEvents: 'none',
      width: `${column.getBoundingClientRect().width}px`, left: '-10000px', top: '0',
      height: 'auto'
    });
    clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    clone.querySelectorAll('details').forEach(el => { el.open = true; el.style.paddingBottom = '0'; });
    column.parentElement.appendChild(clone);
    const measured = [...clone.querySelectorAll('.service-detail')];
    const base = measured.slice(0, -1).reduce((total, el) => total + el.getBoundingClientRect().height, 0)
      + gap * (rows.length - 1) + lastSummary.getBoundingClientRect().height;
    const target = photo.getBoundingClientRect().bottom - column.getBoundingClientRect().top;
    const extra = Math.max(0, (target - base) / (rows.length - 1));
    clone.remove();
    column.style.setProperty('--service-open-spacing', `${extra}px`);
  }
  function schedule() {
    if (!queued) { queued = true; requestAnimationFrame(align); }
  }
  photo.addEventListener('load', schedule);
  window.addEventListener('resize', schedule);
  new ResizeObserver(schedule).observe(photo);
  if (document.fonts) document.fonts.ready.then(schedule);
  schedule();
})();
