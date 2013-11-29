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
    existingFile: null,
    existingJSON: null,
    imageURLList: [],

    init: function () {
      window.app.feedServices.getFeedData();
    },

    getFeedData: function () {
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
            window.app.feedServices.createFile(
              filename
            );
          }
        });
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

    loadFile: function (filename, callback, fail) {
      window.app.feedServices.fs.root.getFile(
        filename,
        null,
        callback || window.app.feedServices.gotFileEntry,
        fail || window.app.feedServices.fileError
      );
    },

    gotFileEntry: function (fileEntry) {
      fileEntry.file(
        window.app.feedServices.gotFile,
        window.app.feedServices.fileError
      );
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
        //window.app.feedServices.gotReadFileEntry(window.app.feedServices.activeFile);
        //window.app.feedServices.downloadImages();
      };
    },

    writeLocalFeed: function (data) {
      if (data && data.rss && data.rss.channel && data.rss.channel.item) {
        if (window.app.feedServices.existingFile && window.app.feedServices.existingJSON) {
          //add new stories only to the local file (hopefully in the right order)
          var json = window.app.feedServices.existingJSON,
            item = data.rss.channel.item,
            i = data.rss.channel.item.length - 1,
            j = 0,
            match;
          for (i; i > -1; i -= 1) {
            match = false;
            for (j = 0; j < json.length; j += 1) {
              if (item[i].title === json[j].title) {
                match = true;
              }
            }
            if (match === false) {
              json.push(item[i]);
            }
          }
          window.app.feedServices.createImageURLList(json);
          window.app.feedServices.existingJSON = json;
          window.app.feedServices.activeWriter.write(JSON.stringify(json));
        } else {
          window.app.feedServices.createImageURLList(data.rss.channel.item);
          window.app.feedServices.existingJSON = data.rss.channel.item;
          window.app.feedServices.activeWriter.write(JSON.stringify(data.rss.channel.item));
        }
      }
    },

    gotReadFileEntry: function (fileEntry) {
      fileEntry.file(
        window.app.feedServices.gotReadFile,
        window.app.feedServices.fileError
      );
    },

    gotReadFile: function (file) {
      window.app.feedServices.existingFile = file;
      window.app.feedServices.readFile(file);
    },

    readFile: function (file) {
      var reader = new FileReader();
      reader.onloadend = function (e) {
        window.app.feedServices.existingJSON = JSON.parse(e.target.result);
        $(window).trigger('menu.contentloaded');
      };
      reader.readAsText(file);
    },

    createImageURLList: function (feed) {
      $.each(feed, function (index, element) {
        window.app.feedServices.imageURLList.push(element.image);
      })

      window.app.feedServices.downloadImage();
    },

    downloadImage: function () {
      var file = window.app.feedServices.imageURLList.shift();
      if (window.app.feedServices.imageURLList.length) {
        window.app.feedServices.downloadFile(file);
      } else {
        $(window).trigger('menu.contentloaded');
      }
    },

    downloadFile: function (url) {
      window.app.feedServices.loadFile(
        url.split('/').pop(),
        // image already exists locally, skip this download
        window.app.feedServices.downloadImage,
        // image does not exist locally, download image
        function () {
          window.app.feedServices.downloadNewImage(url);
        }
      );
    },

    downloadNewImage: function (url) {
      var fileTransfer = new FileTransfer(),
        uri = encodeURI(url);

      fileTransfer.download(
        uri,
        window.app.feedServices.fs.root.fullPath + '/' + url.split('/').pop(),
        window.app.feedServices.downloadImage,
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
    },

    createMenu: function () {

    }
  }



  window.requestFileSystem(
    LocalFileSystem.PERSISTENT,
    0,
    window.app.feedServices.onFileSystemSuccess,
    window.app.feedServices.onFileSystemFail
  );

});