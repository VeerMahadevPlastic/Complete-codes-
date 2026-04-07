(function(global){
  const incoming = global.__VMP_CONFIG__ || {};
  const defaults = {
    apiKeys: {
      delhivery: '',
      razorpay: ''
    },
    firebase: {
      apiKey: 'AIzaSyAGfZVese3tqFf_Uw_pJUQbSR5p6sohRmo',
      authDomain: 'veermahadev--codes.firebaseapp.com',
      projectId: 'veermahadev--codes',
      storageBucket: 'veermahadev--codes.firebasestorage.app',
      messagingSenderId: '380308449387',
      appId: '1:380308449387:web:964942c3eb82a4c742292e',
      measurementId: 'G-R2DHXNS9TF'
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
