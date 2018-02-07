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
      var modalOverflow = $('#modal-overflow');
      var pageHeader = $('#page-header');
      var pageHighlighted = $('#page-highlighted');
      var viewportHeight = $(window).height();
      var adminMenuHeight = $('#admin-menu').length ? 29 : 0;

      UIkit.util.on('#modal-overflow', 'hidden', function () {
        html.removeClass('ndsbs-overflow-initial');
      });

      if (body.hasClass('front')) {
        pageHeader.css('min-height', viewportHeight - adminMenuHeight);
      }

      if (pageHighlighted.length) {
        pageHighlighted.css('min-height', viewportHeight - adminMenuHeight);
      }

      UIkit.accordion($('.uk-accordion'));

      $('a.active').each(function () {
        $(this).addClass('uk-active');
      })
    }
  };

  Drupal.behaviors.NDSBSStatusMessages = {
    attach: function () {
      var close = $('[uk-close]');

      close.click(function () {
        $(this).parent().fadeOut();
      })
    }
  };

  Drupal.behaviors.NDSBSFaqVideos = {
    attach: function () {
      var faqView = $('.view-faq-videos');
      var a = faqView.find('.views-field:nth-child(1)');
      var b = faqView.find('.views-field:nth-child(2)');
      var c = faqView.find('.views-field:nth-child(3)');
      var d = faqView.find('.views-field:nth-child(4)');

      matchHeight();
      $(window).resize(function () {
        matchHeight();
      });

      function matchHeight() {
        if ($(window).width() >= 960) {
          if (b.length && (a.find('h3').height() !== b.find('h3').height())) {
            var e = Math.max(a.find('h3').outerHeight(), b.find('h2')
              .outerHeight());
            a.find('h3').height(e);
            b.find('h3').height(e);
          }

          if (d.length && (c.find('h3').height() !== d.find('h3').height())) {
            var f = Math.max(c.find('h3').outerHeight(), d.find('h3')
              .outerHeight());
            c.find('h3').height(f);
            d.find('h3').height(f);
          }
        }
        else {
          a.find('h3').removeAttr('style');
          b.find('h3').removeAttr('style');
          c.find('h3').removeAttr('style');
          d.find('h3').removeAttr('style');
        }
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
      var offcanvas = $('#offcanvas');

      UIkit.util.on('#page-navbar', 'beforeshow', function (e) {
        //body.addClass('navbar-open');
        //body.removeClass('navbar-closed');
      });

      UIkit.util.on('#page-navbar', 'hidden', function (e) {
        //body.removeClass('navbar-open');
        //body.addClass('navbar-closed');
      });

      $('#page-navbar').find('a').hover(function (e) {
        e.preventDefault();
        $(this).blur();
      });

      UIkit.util.on('#offcanvas', 'beforeshow', function (e) {
        //body.addClass('offcanvas-open');
        //body.removeClass('offcanvas-closed');
      });

      UIkit.util.on('#offcanvas', 'hidden', function (e) {
        //if (!offcanvas.hasClass('uk-open')) {
          //body.removeClass('offcanvas-open');
          //body.addClass('offcanvas-closed');
        //}
      });
    }
  };

  Drupal.behaviors.NDSBSDashboards = {
    attach: function () {
      var dashboard = $('.ndsbs-navigation-accordion');
      var noIconLink = dashboard.find('li.no-icon').find('a');

      noIconLink.click(function () {
        var dashboardLocation = $(this).attr('href');
        window.location.href = window.location.origin + dashboardLocation;
      });

      var activeLink = dashboard.find('a.uk-active');
      var activeContent = activeLink.parents('.uk-accordion-content');
      var activeParent = activeContent.parent('li');
      activeContent.attr('aria-hidden', 'false').removeAttr('hidden');
      activeParent.addClass('uk-open');
    }
  };

  Drupal.behaviors.NDSBSAssessmentSelect = {
    attach: function () {
      var selectForm = $('#ndsbs-assessment-client-assessments-select-form');
      var assessmentSelect = selectForm.find('select');
      var origin = window.location.origin;

      assessmentSelect.change(function () {
        window.location.href = origin + '/' + this.value;
      })
    }
  };

  Drupal.behaviors.NDSBSAcceptanceModal = {
    attach: function () {
      $('#edit-field-assessment-state-und').change(function (e) {
        if (this.value === 'IL' || this.value === 'NY') {
          e.preventDefault();
          $(this).blur();

          UIkit.modal.alert('Please call 1-800-671-8589 to verify acceptance before purchasing')
            .then(function () {
              // Alert has closed....
            });
        }
      });
    }
  };

  Drupal.behaviors.NDSBSAssessmentsSwitcher = {
    attach: function () {
      var switcherModal0 = $('#switcher-modal-0');
      var switcherModal1 = $('#switcher-modal-1');

      if (switcherModal0.length) {
        UIkit.util.on('#switcher-modal-0', 'beforeshow', function (e) {
          switcherModal0.find('.uk-modal-dialog').removeAttr('style');
        });
      }

      if (switcherModal1.length) {
        UIkit.util.on('#switcher-modal-1', 'beforeshow', function (e) {
          switcherModal1.find('.uk-modal-dialog').removeAttr('style');
        });
      }
    }
  }

})(jQuery);
