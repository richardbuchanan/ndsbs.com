/**
 * @file
 * Attaches behaviors for ndsbs.
 */

(function ($) {

  'use strict';

  Drupal.behaviors.NDSBS = {
    attach: function () {
      var html = $('html');
      var body = $('body');
      var loginLink = $('[href="/user/login"]');
      var loginModal = $("#block-user-login");
      var loginContent = loginModal.clone();
      var modalOverflow = $('#modal-overflow');
      var pageHeader = $('#page-header');
      var pageHighlighted = $('#page-highlighted');
      var viewportHeight = $(window).height();
      var adminMenuHeight = $('#admin-menu').length ? 29 : 0;

      loginModal.remove();

      loginLink
        .prop('href', '#block-user-login')
        .attr('uk-toggle', '')
        .after(loginContent)
        .click(function () {
          UIkit.modal('#block-user-login').toggle();
        });

      modalOverflow.on('hidden', function () {
        html.removeClass('ndsbs-overflow-initial');
      });

      pageHeader.css('min-height', viewportHeight - adminMenuHeight);

      if (pageHighlighted.length) {
        pageHighlighted.css('min-height', viewportHeight - adminMenuHeight);
      }
    }
  };

  Drupal.behaviors.NDSBSFaqVideos = {
    attach: function () {
      var faqView = $('.view-faq-videos');
      var a = faqView.find('.views-field:nth-child(1)');
      var b = faqView.find('.views-field:nth-child(2)');
      var c = faqView.find('.views-field:nth-child(3)');
      var d = faqView.find('.views-field:nth-child(4)');

      if (b.length && (a.find('h3').height() !== b.find('h3').height())) {
          var e = Math.max(a.find('h3').outerHeight(), b.find('h2').outerHeight());
          a.find('h3').height(e);
          b.find('h3').height(e);
      }

      if (d.length && (c.find('h3').height() !== d.find('h3').height())) {
        var f = Math.max(c.find('h3').outerHeight(), d.find('h3').outerHeight());
        c.find('h3').height(f);
        d.find('h3').height(f);
      }
    }
  };

  Drupal.behaviors.NDSBSInteractiveMaps = {
    attach: function () {

      /**
       * Interactive US map.
       *
       * The interactive map allows visitors to view what services are available
       * in their state. This map has hover capabilities, and the values are
       * defined on the hover map settings page.
       *
       * @see https://www.ndsbs.com/admin/config/user-interface/hover-maps
       * @see https://newsignature.github.io/us-map
       */
      if (Drupal.settings.hasOwnProperty('bdg_ndsbs')) {
        var map = $('#interactive-map');
        var states = Drupal.settings.bdg_ndsbs.global_states;
        var lineOne = Drupal.settings.bdg_ndsbs.line_one;
        var lineTwo = Drupal.settings.bdg_ndsbs.line_two;
        var lineThree = Drupal.settings.bdg_ndsbs.line_three;
        var lineFour = Drupal.settings.bdg_ndsbs.line_four;

        if (map.length) {
          map.usmap({
            stateStyles: {
              fill: '#e3e2de'
            },
            stateHoverStyles: {
              fill: '#82796f'
            },
            labelBackingHoverStyles: {
              fill: '#82796f'
            },
            showLabels: true,
            'click': function (event, data) {
              var modalContainer = $('#modal-overflow');
              var title = data.name;
              var statename = title.toUpperCase();
              var stateabbr = title.toLowerCase();
              var line_one = '';
              var line_two = '';
              var line_three = '';
              var line_four = '';

              $('html').addClass('ndsbs-overflow-initial');

              if (modalContainer.find('.uk-modal-dialog').length) {
                modalContainer.find('.uk-modal-dialog').remove();
              }

              if (lineOne[statename]) {
                line_one = '<li>' + lineOne[statename] + '</li>';
              }
              if (lineTwo[statename]) {
                line_two = '<li>' + lineTwo[statename] + '</li>';
              }
              if (lineThree[statename]) {
                line_three = '<li>' + lineThree[statename] + '</li>';
              }
              if (lineFour[statename]) {
                line_four = '<li>' + lineFour[statename] + '</li>';
              }

              var statelist = '<ul class="uk-list uk-list-large uk-list-divider">' + line_one + line_two + line_three + line_four + '</ul>';
              var text;

              text = '<div class="uk-modal-dialog">';
              text += '<button class="uk-modal-close-default" type="button" uk-close></button>';
              text += '<div class="uk-modal-header">';
              text += '<h3 class="uk-modal-title">' + states[statename] + '</h3>';
              text += '</div>';
              text += '<div class="uk-modal-body">' + statelist + '</div>';
              text += '</div>';

              modalContainer.append(text);
              UIkit.modal('#modal-overflow').toggle();
            }
          });
        }
      }
    }
  };

  Drupal.behaviors.NDSBSNavbar = {
    attach: function () {
      var body = $('body');
      var pageNavbar = $('#page-navbar');
      var offcanvas = $('#offcanvas');

      pageNavbar.on('beforeshow', function () {
        body.addClass('navbar-open');
        body.removeClass('navbar-closed');
      }).on('hidden', function () {
        body.removeClass('navbar-open');
        body.addClass('navbar-closed');
      });

      offcanvas.on('beforeshow', function () {
        body.addClass('offcanvas-open');
        body.removeClass('offcanvas-closed');
      }).on('hidden', function (e) {
        if (!offcanvas.hasClass('uk-open')) {
          body.removeClass('offcanvas-open');
          body.addClass('offcanvas-closed');
        }
      });
    }
  };

  Drupal.behaviors.NDSBSSwitcher = {
    attach: function () {
      var switcherRightItems = $('.switcher-right li');
      var demoThree = switcherRightItems.parents('.switcher-demo-three');
      var closeSwitcher = $('.close-switcher');

      demoThree.css('min-height', demoThree.height());

      switcherRightItems.on('shown', function (e) {
        switcherRightItems.each(function () {
          $(this).removeClass('switcher-reveal');
        });

        $(e.target).addClass('switcher-reveal');
        demoThree.addClass('open');
      });

      closeSwitcher.click(function () {
        $(this).parents('.switcher-animate').removeClass('uk-active');
        $(this).parents('.switcher-animate').removeClass('switcher-reveal');
        demoThree.removeClass('open');
      });
    }
  };
})(jQuery);
