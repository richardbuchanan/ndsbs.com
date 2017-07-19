/**
 * @file
 * Attaches behaviors to the UIkit CKEditor module.
 */

(function ($) {
  'use strict';

  Drupal.behaviors.uikitCKEditorWidgets = {
    attach: function (context, settings) {
      $('.uk-accordion').each(function () {
        UIkit.accordion($(this));
      });
    }
  }
})(jQuery);
