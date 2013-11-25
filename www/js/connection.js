$(window).on('go', function () {

  window.app.connect = {
    online: window.navigator.connection.type !== 'none' || false,
    onOnline: function () {
      window.app.connect.set(true);
    },
    onOffline: function () {
      window.app.connect.set(false);
    },
    set: function (status) {
      window.app.connect.online = status;
    },
    getType: function () {
      return window.navigator.connection.type;
    }
  }

  document.addEventListener("online", window.app.connect.onOnline, false);
  document.addEventListener("offline", window.app.connect.onOffline, false);
});