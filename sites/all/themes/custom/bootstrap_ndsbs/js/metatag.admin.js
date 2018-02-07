/**
 * @file
 * Custom admin-side JS for the Metatag module.
 */

(function ($) {
  'use strict';

  Drupal.behaviors.metatagUIConfigListing = {
    attach: function (context) {
      // Hidden elements to be visible if JavaScript is enabled.
      $('.js-show').show();

      // Make the leaf arrow clickable.
      $('.metatag-config-label').hover(function(){
        $(this).css({'cursor': 'pointer'});
      });

      // Show or hide the summary
      //$('.toggle-details').each(function() {
      $('.toggle-details').click(function(event) {
        event.preventDefault();
        $(this).parent('div').siblings('div.metatag-config-details').each(function() {
          if ($(this).hasClass('js-hide')) {
            $(this).slideDown('slow').removeClass('js-hide');
          }
          else {
            $(this).slideUp('slow').addClass('js-hide');
          }
          event.stopPropagation();
        });

        // Change the expanded or collapsed state of the instance label.
        if ($(this).parent('div').hasClass('collapsed')) {
          $(this).parent('div').removeClass('collapsed').addClass('expanded');
        }
        else {
          $(this).parent('div').removeClass('expanded').addClass('collapsed');
        }

        // This event may be triggered by a parent element click - so we don't
        // want the click to bubble up otherwise we get recursive click events.
        event.stopPropagation();
      });
      //});
    }
  };

})(jQuery);