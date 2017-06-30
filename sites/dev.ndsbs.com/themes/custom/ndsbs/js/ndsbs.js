/**
 * @file
 * Attaches behaviors for ndsbs.
 */

(function ($) {

  'use strict';

  Drupal.behaviors.NDSBS = {
    attach: function () {
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
              var mainContainer = $('#page');
              var popoverWidth = mainContainer.outerWidth();
              var title = data.name;
              var statename = title.toUpperCase();
              var stateabbr = title.toLowerCase();
              var line_one = '';
              var line_two = '';
              var line_three = '';
              var line_four = '';

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

              $('<div id="states-dropdown" uk-modal="center: true"></div>').html(text)
                .appendTo('body');
              UIkit.modal('#states-dropdown').toggle();
            }
          });
        }
      }
    }
  };
})(jQuery);
