(function(global){
  const incoming = global.__VMP_CONFIG__ || {};
  const defaults = {
    apiKeys: {
      delhivery: '',
      razorpay: ''
    },
    firebase: {
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
      measurementId: ''
    },
    endpoints: {
      delhivery: 'https://track.delhivery.com/api/v1/packages/json/'
    },
    theme: {
      primary: '#065f46',
      secondary: '#047857',
      textOnPrimary: '#ffffff'
    }
  };

  global.VMP_CONFIG = {
    apiKeys: { ...defaults.apiKeys, ...(incoming.apiKeys || {}) },
    firebase: { ...defaults.firebase, ...(incoming.firebase || {}) },
    endpoints: { ...defaults.endpoints, ...(incoming.endpoints || {}) },
    theme: { ...defaults.theme, ...(incoming.theme || {}) }
  };
})(window);
