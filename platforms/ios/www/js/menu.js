$(window).on('go', function (e) {
  window.app.menu = {
    loadMenu: function () {
      var firstTitle = $('.storyTitle').first().text(),
        json = window.app.feedServices.existingJSON,
        html = '';

      if (!firstTitle || firstTitle !== json[0].title) {
        html = '<div class="menuContainer">';

        $.each(json, function (index, element) {
          html += '<div class="storyItem">';
          html += '<img src="' + window.app.feedServices.fs.root.fullPath + '/' + element.image.split('/').pop() + '" class="storyImage"/>';
          html += '<div class="storyText">'
          html += '<div class="storyTitle">' + element.title + '</div>'
          html += '<div class="storyAuthor">' + element.author + '</div>'
          html += '<div class="storyDate">' + element.pubDate + '</div>'
          html += '</div>'
          html += '</div>';
        });

        html += "</div>";
        $('.c-view').html(html);

        $('.storyItem').on('click', function (e) {
          $('.selected').removeClass('selected');
          $(e.currentTarget).addClass('selected');

        });
      }
    }
  };
});

$(window).on('menu.contentloaded', function (e) {
  window.app.menu.loadMenu();
});