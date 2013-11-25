$(window).on('go', function (e) {

  window.app.feeds = [
    {
      title: 'Main',
      url: 'http://carnegieendowment.org/rss/solr/?fa=AppEurasiaOutlook',
      id: 0
    }
  ];

  window.app.feedServices = {
    fs: null,
    onFileSystemSuccess: function (fileSystem) {
      window.app.feedServices.fs = fileSystem;

      //window.app.feedServices.getFeed(window.app.feeds[0]);

      $.getJSON(window.app.feeds[0].url,
        function(data){
          alert("data: " + data);
        })
        .success(function() { alert("second success"); })
        .error(function() { alert("error"); })
        .complete(function() { alert("complete"); });
    },
    onFileSystemFail: function (event) {
      alert(event.target.error.code);
    },
    getFeed: function (feed) {
      var fileTransfer = new FileTransfer();
      var uri = encodeURI(feed.url);

      fileTransfer.download(
        uri,
        window.app.feedServices.fs.root.fullPath,
        function(entry) {
          alert("download complete: " + entry.fullPath);
        },
        function(error) {
          alert("download error source " + error.source);
          alert("download error target " + error.target);
          alert("download error code" + error.code);
        },
        false
      );
    }
  }

  window.requestFileSystem(
    LocalFileSystem.PERSISTENT,
    0,
    window.app.feedServices.onFileSystemSuccess,
    window.app.feedServices.onFileSystemFail
  );

});