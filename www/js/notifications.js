$(window).on('go', function (e) {
  window.app.alert = function (message, callback, title, buttonLabel) {
    navigator.notification.alert(message, callback, title, buttonLabel);
  };
  window.app.confirm = function (message, callback, title, buttonLabels) {
    //title: defaults to 'Confirm'
    //buttonLabels: defaults to [OK, Cancel]
    navigator.notification.confirm(message, confirmCallback, title, buttonLabels);
  };
});