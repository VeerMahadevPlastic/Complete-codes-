(function(global){
  const app = global.VMP_APP || (global.VMP_APP = { modules: {} });

  app.modules.Auth = global.VMP_AUTH || app.modules.Auth || {};
  app.modules.Tracking = global.VMP_TRACKING || app.modules.Tracking || {};
  app.modules.UI = global.VMP_UI || app.modules.UI || {};
})(window);
