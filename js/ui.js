(function(global){
  const cfg = global.VMP_CONFIG || {};
  const colors = cfg.theme || {};

  function showPopup(message, level = 'info') {
    const id = 'vmp-emerald-popup';
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const popup = document.createElement('div');
    popup.id = id;
    popup.textContent = message || 'Something went wrong. Please try again.';
    popup.style.cssText = [
      'position:fixed',
      'left:50%',
      'bottom:24px',
      'transform:translateX(-50%)',
      'z-index:2147483647',
      'max-width:min(92vw,560px)',
      'padding:12px 16px',
      'border-radius:999px',
      `background:${level === 'error' ? (colors.primary || '#065f46') : (colors.secondary || '#047857')}`,
      `color:${colors.textOnPrimary || '#fff'}`,
      'font:600 13px/1.3 Inter,system-ui,sans-serif',
      'box-shadow:0 10px 30px rgba(6,95,70,.35)'
    ].join(';');

    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 3500);
  }

  async function safeAsync(fn, fallback = null, message = 'Service temporarily unavailable.') {
    try {
      return await fn();
    } catch (_error) {
      showPopup(message, 'error');
      return fallback;
    }
  }

  function safeFetch(url, options = {}, fallback = null) {
    return safeAsync(async () => {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP_${response.status}`);
      return response;
    }, fallback, 'Unable to connect to server right now.');
  }

  function initLazyLoading() {
    const images = Array.from(document.querySelectorAll('img'));
    images.forEach((img) => {
      if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy');
      if (!img.getAttribute('decoding')) img.setAttribute('decoding', 'async');
    });
  }

  function enableStrictErrorCatching() {
    global.addEventListener('unhandledrejection', (event) => {
      event.preventDefault();
      showPopup('Request failed. Please retry in a moment.', 'error');
    });

    global.addEventListener('error', (event) => {
      const target = event?.target;
      if (target && (target.tagName === 'IMG' || target.tagName === 'SCRIPT')) {
        showPopup('Some resources failed to load. Please refresh.', 'error');
        return;
      }

      const message = String(event?.message || 'Unexpected application error.');
      if (/fetch|api|network|http|firebase|delhivery|razorpay/i.test(message)) {
        event.preventDefault();
        showPopup('Service temporarily unavailable. Please try again.', 'error');
      }
    }, true);
  }

  global.VMP_UI = {
    showPopup,
    safeAsync,
    safeFetch,
    initLazyLoading,
    enableStrictErrorCatching
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoading, { once: true });
  } else {
    initLazyLoading();
  }
  enableStrictErrorCatching();
})(window);
