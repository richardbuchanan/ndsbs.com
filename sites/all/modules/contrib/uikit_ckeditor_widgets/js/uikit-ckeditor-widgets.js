/**
 * @file
 * Attaches behaviors to the UIkit CKEditor module.
 */

(function ($) {
  'use strict';

  Drupal.behaviors.uikitCKEditorWidgets = {
    attach: function (context, settings) {
      var accordions = $('.uk-accordion');
      var accordion = UIkit.accordion(accordions, { /* options */ });
    }
  }
})(jQuery);
