window.app = {
  go: function () {
    $(window).trigger('go')
  }
};

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  app.go();

  setTimeout(function() {
    checkConnection()
  }, 0);
}

function checkConnection() {
  //check for connection
  if (window.app.connect.online) {
    //
  } else {
    window.app.alert(
      'This app requires an internet connection.',
      tryAgain,
      'Carnegie',
      'OK'
    );
  }
}

function tryAgain() {
  setTimeout(checkConnection, 500);
}