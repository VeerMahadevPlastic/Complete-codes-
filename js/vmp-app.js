(function(global){
  const config = global.VMP_CONFIG || {};
  const ui = global.VMP_UI || {};

  global.VMP_APP = {
    version: '2.0.0',
    config,
    showAlert: ui.showPopup || function(){},
    safeCall: ui.safeAsync || (async (fn) => fn()),
    safeFetch: ui.safeFetch || fetch,
    modules: {
      Auth: global.VMP_AUTH || {},
      Tracking: global.VMP_TRACKING || {},
      UI: ui
    }
  };
})(window);
