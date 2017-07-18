/**
 * @file
 * Attaches behaviors to the NDSBS Development module.
 */

(function ($) {
  'use strict';

  var animate = setInterval(function () {
    window.progressbar && (progressbar.value += 10);

    if (!window.progressbar || progressbar.value >= progressbar.max) {
      clearInterval(animate);
    }
  }, 1000);

  // Prevent navbar parent links from being used as a link when clicked.
  var examples = $('#examples');
  if (examples.length) {
    examples.on('click', '[href="#"], [href=""]', function (e) {
      e.preventDefault();
    }).find('[href="#"]').prop('href', '')
  }

  // Prevent navbar parent links from being used as a link when clicked.
  var colorSchemeDropdown = $('.color-scheme-dropdown');
  if (colorSchemeDropdown.length) {
    colorSchemeDropdown.on('click', '[href="#"], [href=""]', function (e) {
      var colorScheme = $(e.target).attr('color-scheme');
      $('#examples').attr('active-color-scheme', colorScheme);
    })
  }
})(jQuery);
