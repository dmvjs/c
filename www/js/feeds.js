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
    feedJSON: {},
    imageCounter: 0,
    imageCounterMax: 0,
    imageURLList: [],
    onFileSystemSuccess: function (fileSystem) {
      window.app.feedServices.fs = fileSystem;

      //window.app.feedServices.getFeed(window.app.feeds[0]);
      $.getJSON(window.app.feeds[0].url,
        function(data){
          window.app.feedServices.feedJSON = data;
          window.app.feedServices.createFile('feed.json')
        })
        //.success(function() { alert("second success"); })
        //.error(function() { alert("error"); })
        //.complete(function() { alert("complete"); });
    },
    onFileSystemFail: function (event) {
      alert(event.target.error.code);
    },
    getFile: function (url) {
      var fileTransfer = new FileTransfer(),
        uri = encodeURI(url);

      fileTransfer.download(
        uri,
        window.app.feedServices.fs.root.fullPath + '/' + url.split('/').pop(),
        function(entry) {
          alert("download complete: " + entry.fullPath);
          window.app.feedServices.imageCounter += 1;
          if (window.app.feedServices.imageCounter < window.app.feedServices.imageURLList.length) {
            window.app.feedServices.getFile(window.app.feedServices.imageURLList[window.app.feedServices.imageCounter]);
          } else {
            window.app.feedServices.imageCounter = 0;
            alert('all done');
          }
        },
        function(error) {
          alert("download error source " + error.source);
          /*alert("download error target " + error.target);
          alert("download error code" + error.code);*/
        },
        false
      );
    },
    createFile: function (filename) {
      window.app.feedServices.fs.root.getFile(
        filename,
        {
          create: true,
          exclusive: false
        },
        window.app.feedServices.gotFileEntry,
        window.app.feedServices.fileError
      );
    },
    gotFileEntry: function (fileEntry) {
      fileEntry.createWriter(
        window.app.feedServices.gotFileWriter,
        window.app.feedServices.fileError
      );
    },
    gotFileWriter: function (writer) {
      writer.onwriteend = function(evt) {
        window.app.feedServices.downloadImages();
      };
      writer.write(JSON.stringify(window.app.feedServices.feedJSON));
    },
    fileError: function (error) {
      console.log(error.code);
    },
    downloadImages: function () {
      var feed = window.app.feedServices.feedJSON.rss.channel.item;
      //window.app.feedServices.imageCounterMax = feed.length;
      for (var i = 0; i < feed.length; i += 1) {
        window.app.feedServices.imageURLList.push(feed[i].image);
      }
      window.app.feedServices.getFile(window.app.feedServices.imageURLList[0]);
    }

  }

  window.requestFileSystem(
    LocalFileSystem.PERSISTENT,
    0,
    window.app.feedServices.onFileSystemSuccess,
    window.app.feedServices.onFileSystemFail
  );

});

function gotFileWriter(writer) {
  writer.onwriteend = function(evt) {
    alert('file complete');
  };
  writer.write("some sample text");
}

function fail(error) {
  console.log(error.code);
}
