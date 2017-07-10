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

      if (body.hasClass('front') || body.hasClass('page-node-two') || body.hasClass('page-node-three')) {
        pageHeader.css('min-height', viewportHeight - adminMenuHeight);
      }

      if (pageHighlighted.length) {
        pageHighlighted.css('min-height', viewportHeight - adminMenuHeight);
      }
    }
  };

  Drupal.behaviors.NdsbsSwitcher = {
    attach: function () {
      if ($('body').hasClass('front')) {
        var switcherRightItems = $('.switcher-right li');

        switcherInit(switcherRightItems);

        $(window).on('resize', function () {
          switcherInit(switcherRightItems);
        });

        switcherRightItems.on('shown', function (e) {
          switcherRightItems.each(function () {
            $(this).removeClass('switcher-reveal');
          });

          $(e.target).addClass('switcher-reveal');
        });
      }
    }
  };

  Drupal.behaviors.NdsbsNavbar = {
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
      }).on('hidden', function () {
        body.removeClass('offcanvas-open');
        body.addClass('offcanvas-closed');
      });
    }
  };

  Drupal.behaviors.NdsbsInteractiveMaps = {
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

  function switcherInit(switcherItems) {
    if ($(window).width() > 1200) {
      switcherItems.each(function () {
        //$(this).css('display', 'inline-block');
        //$(this).width($(this).innerWidth() - 38);
        //$(this).height($(this).innerHeight() - 38);
        //$(this).css('position', 'absolute');
      });
    }
    else {
      switcherItems.each(function () {
        //$(this).removeAttr('style');
      });
    }
  }
})(jQuery);
