$(window).on('go', function (e) {
  window.app.alert = function (message, callback, title, buttonName) {
    navigator.notification.alert(message, callback, title, buttonName);
  }
});