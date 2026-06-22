(function(global){
  function buildTrackingLink(tracking = {}) {
    const awb = String(tracking.awb || '').trim();
    const carrier = String(tracking.carrier || 'delhivery').toLowerCase();
    if (!awb) return './live-tracking.html';
    if (carrier.includes('shiprocket')) return `https://shiprocket.co/tracking/${encodeURIComponent(awb)}`;
    return `https://www.delhivery.com/track/package/${encodeURIComponent(awb)}`;
  }

  async function fetchDelhiveryStatus(awb) {
    const token = global.VMP_CONFIG?.apiKeys?.delhivery;
    const endpoint = global.VMP_CONFIG?.endpoints?.delhivery;
    if (!awb || !token || !endpoint) {
      global.VMP_UI?.showPopup('Tracking service is not configured.', 'error');
      return null;
    }

    const url = `${endpoint}?waybill=${encodeURIComponent(awb)}&token=${encodeURIComponent(token)}`;
    const response = await global.VMP_UI.safeFetch(url, { method: 'GET' }, null);
    return response ? response.json() : null;
  }

  global.VMP_TRACKING = {
    buildTrackingLink,
    fetchDelhiveryStatus
  };
})(window);
