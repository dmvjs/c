$(window).on('go', function (e) {
  window.app.header = {
    showStoryControls: function () {
      $('.menu-btn').hide();
      $('.story-btn').show();
    },
    hideStoryControls: function () {
      $('.story-btn').hide();
      $('.menu-btn').show();
    }
  };

  $('header').find('.story-btn').hide();

  $(window).on('story.selected', window.app.header.showStoryControls);
  $(window).on('story.back', window.app.header.hideStoryControls);
  $('.story-btn.back-btn').on('click', function () {
      $(window).trigger('story.back');
  });
  $('.prev-btn').on('click', function (e) {
    $(this).closest('.active').removeClass('active');
    $(window).trigger('story.prev');
  });
  $('.next-btn').on('click', function (e) {
    $(this).closest('.active').removeClass('active');
    $(window).trigger('story.next');
  });
});