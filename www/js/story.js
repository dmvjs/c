/*global window:false, $:false*/
$(window).on('go', function (e) {
  'use strict';
  window.app.story = {
    currentStory: 0,
    currentSelector: '.alpha',
    setCurrentStory: function (int) {
      window.app.story.currentStory = int;
      $(window).trigger('story.change');
    },
    removeEnter: function () {
      $('.storyContainer').removeClass('enter-from-right enter-from-left');
    },
    removeExit: function () {
      $('.storyContainer').removeClass('exit-to-right exit-to-left');
    },
    removeTransitions: function () {
      window.app.story.removeEnter();
      window.app.story.removeExit();
      $(window.app.story.currentSelector).removeClass('from-right from-left');
    },
    showStory: function () {
      window.app.story.removeTransitions();
      $(window.app.story.currentSelector).addClass('enter-from-right');
    },
    hideStory: function () {
      window.app.story.removeTransitions();
      $(window.app.story.currentSelector).addClass('exit-to-right');
    },
    prevStory: function () {
      if (window.app.story.currentStory > 0) {
        window.app.story.setCurrentStory(window.app.story.currentStory - 1);
        window.app.story.buildPage();
        window.app.story.slidePrev();
        window.app.story.toggleSelector();
      }
    },
    nextStory: function () {
      if (window.app.story.currentStory < window.app.feedServices.existingJSON.length - 1) {
        window.app.story.setCurrentStory(window.app.story.currentStory + 1);
        window.app.story.buildPage();
        window.app.story.slideNext();
        window.app.story.toggleSelector();
      }
    },
    getNotSelector: function () {
      return window.app.story.currentSelector === '.alpha' ? '.bravo' : '.alpha';
    },
    getSelector: function () {
      return window.app.story.currentSelector !== '.alpha' ? '.bravo' : '.alpha';
    },
    toggleSelector: function () {
      window.app.story.currentSelector = window.app.story.getNotSelector();
    },
    buildPage: function (selector) {
      var json = window.app.feedServices.existingJSON[window.app.story.currentStory],
        html = '',
        selector = selector || window.app.story.getSelector();
      html += '<div class="storyTitle">' + json.title + '</div>';
      html += '<div class="storyImage"><img src="' + json.image + '"/></div>';
      html += '<div class="storyAuthor">' + json.author + '</div>';
      html += '<div class="storyDate">' + json.pubDate + '</div>';
      html += '<div class="storyText">' + json.description + '</div>';
      $(selector).html(html);
    },
    slidePrev: function () {
      window.app.story.removeTransitions();
      $(window.app.story.getNotSelector()).addClass('exit-to-right');
      $(window.app.story.getSelector()).addClass('enter-from-left');
    },
    slideNext: function () {
      window.app.story.removeTransitions();
      $(window.app.story.getNotSelector()).addClass('exit-to-left');
      $(window.app.story.getSelector()).addClass('enter-from-right');
    }
  };

  $(window).on('story.selected', function (event, index) {
    window.app.story.setCurrentStory(parseInt(index, 10));
    window.app.story.buildPage();

    $(window.app.story.getSelector()).find('img').on('load', function () {
      window.app.story.showStory();
      window.app.story.toggleSelector();
    });
  });

  $(window).on('story.back', window.app.story.hideStory);
  $(window).on('story.next', window.app.story.nextStory);
  $(window).on('story.prev', window.app.story.prevStory);
});