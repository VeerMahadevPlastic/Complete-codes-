(function(global){
  function normalizeIndianPhone(value) {
    return String(value || '').replace(/\D/g, '').slice(-10);
  }

  function isValidIndianPhone(value) {
    return /^[6-9]\d{9}$/.test(normalizeIndianPhone(value));
  }

  function getFirebaseConfig() {
    return (global.VMP_CONFIG && global.VMP_CONFIG.firebase) || {};
  }

  global.VMP_AUTH = {
    normalizeIndianPhone,
    isValidIndianPhone,
    getFirebaseConfig
  };
})(window);
