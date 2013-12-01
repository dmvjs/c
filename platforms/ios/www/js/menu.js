$(window).on('go', function (e) {
  window.app.menu = {
    selectStory: function () {
      var $item = $('.menuContainer ul li').eq(window.app.story.currentStory);
      $('.menuContainer .selected').removeClass('selected');
      $item.find('.storyItem').addClass('selected');
      //$('.menuContainer').scrollTop($item.position().top);
    },
    loadMenu: function () {
      var firstTitle = $('.storyTitle').first().text(),
        json = window.app.feedServices.existingJSON,
        html = '';

      if (!firstTitle || firstTitle !== json[0].title) {
        html = '';

        $.each(json, function (index, element) {
          html += '<li>';
          html += '<div class="storyItem">';
          html += '<img src="' + window.app.feedServices.fs.root.fullPath + '/' + element.image.split('/').pop() + '" class="storyImage"/>';
          html += '<div class="storyText">';
          html += '<div class="storyTitle">' + element.title + '</div>';
          html += '<div class="storyAuthor">' + element.author + '</div>';
          html += '<div class="storyDate">' + element.pubDate + '</div>';
          html += '</div>';
          html += '</div>';
          html += '</li>';
        });

        html += "";
        $('.menuContainer ul').html(html);

        $('.storyItem').on('click', function (e) {
          var li = $(this).closest('li'),
            index = $('.menuContainer ul li').index(li);
          $(window).trigger('story.selected', index);
        });

        setTimeout(function () {
          window.navigator.splashscreen.hide();
        }, 100);

      }
    }
  };
});

$(window).on('menu.contentloaded', function (e) {
  window.app.menu.loadMenu();
});

$(window).on('story.change', function () {
  window.app.menu.selectStory();
});