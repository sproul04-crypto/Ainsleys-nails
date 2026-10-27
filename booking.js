(() => {
  const value = window.AINSLEYS_CONFIG?.bookingUrl?.trim();
  if (!value) return;
  let url;
  try { url = new URL(value); } catch { return; }
  if (url.protocol === 'https:') document.getElementById('booking-link').href = url.href;
})();
