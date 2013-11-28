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
    activeFile: null,
    activeWriter: null,
    activeFeed: 0,
    existingFile: null,
    workingFeed: 0,
    imageURLList: [],


    init: function (feedId) {
      var feedId = feedId || 0,
        filename = 'feed' + window.app.feeds[feedId].id + '.json';

      if (window.app.connect.online) {
        $.getJSON(
          window.app.feeds[feedId].url,
          window.app.feedServices.writeLocalFeed
        )
      }

      window.app.feedServices.loadFile(
        filename,
        window.app.feedServices.gotReadFileEntry,
        function () {
          if (!window.app.connect.online) {
            alert('no connection & no local file');
          } else {
            alert('making file');
            window.app.feedServices.createFile(
              filename
            );
          }
        });
    },

    loadFile: function (filename, callback, fail) {
      window.app.feedServices.fs.root.getFile(
        filename,
        null,
        callback || window.app.feedServices.gotFileEntry,
        fail || window.app.feedServices.fileError
      );
    },

    readFile: function (file) {
      var reader = new FileReader();
      reader.onloadend = function (e) {
        var text = JSON.stringify(e.target.result);
        alert(text.substr(0, 40))
      };
      reader.readAsText(file);
    },

    writeLocalFeed: function (data) {
      var text = JSON.stringify(data);
      window.app.feedServices.activeWriter.write(JSON.stringify(data));
    },

    createFile: function (filename) {
      window.app.feedServices.fs.root.getFile(
        filename,
        {
          create: true,
          exclusive: false
        },
        window.app.feedServices.gotFile,
        window.app.feedServices.fileError
      );
    },

    gotReadFileEntry: function (fileEntry) {
      fileEntry.file(
        window.app.feedServices.gotReadFile,
        window.app.feedServices.fileError
      );
    },

    gotFileEntry: function (fileEntry) {
      fileEntry.file(
        window.app.feedServices.gotFile,
        window.app.feedServices.fileError
      );
    },

    gotReadFile: function (file) {
      window.app.feedServices.existingFile = file;
      window.app.feedServices.readFile(file);
    },

    gotFile: function (file) {
      window.app.feedServices.activeFile = file;
      file.createWriter(
        window.app.feedServices.gotFileWriter,
        window.app.feedServices.fileError
      );
    },

    gotFileWriter: function (writer) {
      window.app.feedServices.activeWriter = writer;
      writer.onwriteend = function(e) {
        alert('writer done');
        window.app.feedServices.gotReadFileEntry(window.app.feedServices.activeFile);
        //window.app.feedServices.readFile(window.app.feedServices.activeFile);
        //window.app.feedServices.downloadImages();
      };
    },






    createImageURLList: function () {
      var feed = window.app.feedServices.feedJSON.rss.channel.item;

      $.each(feed, function (index, element) {
        window.app.feedServices.imageURLList.push(element.image);
      })

      alert('imageURLList created')
    },

    downloadImages: function () {
      var file = window.app.feedServices.imageURLList.shift();
      if (window.app.feedServices.imageURLList.length) {
        window.app.feedServices.downloadFile(file);
      } else {
        alert('all done');
      }
    },

    downloadFile: function (url, callback) {
      var fileTransfer = new FileTransfer(),
        uri = encodeURI(url);

      fileTransfer.download(
        uri,
        window.app.feedServices.fs.root.fullPath + '/' + url.split('/').pop(),
        callback,
        window.app.feedServices.fileError,
        false
      );
    },

    fileError: function (error) {
      alert('error')
    },

    onFileSystemSuccess: function (fs) {
      window.app.feedServices.fs = fs;
      window.app.feedServices.init();
    },

    onFileSystemFail: function (event) {
      alert(event.target.error.code);
    }
  }

  window.requestFileSystem(
    LocalFileSystem.PERSISTENT,
    0,
    window.app.feedServices.onFileSystemSuccess,
    window.app.feedServices.onFileSystemFail
  );

});