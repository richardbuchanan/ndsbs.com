/*!
 * Bootstrap v3.3.5 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under the MIT license
 */
+function (a) {
  "use strict";
  var a = $('.navbar-toggle');

  a.click(function() {
    if ($(this).hasClass('collapsed')) {
      $(this).attr('aria-expanded', 'true');
    }
    else {
      $(this).attr('aria-expanded', 'false');
    }

    $(this).toggleClass('collapsed');
    //$('.navbar-collapse').toggleClass('in');
    $('.navbar-collapse').slideToggle();
  });

  var menuExpand = $('.navbar-collapse .menu .menu');
  var menuExpandAnchor = $('.navbar-collapse .is-expanded > a');

  $(document).ready(function() {
    menuExpand.addClass('collapsed');

    menuExpandAnchor.each(function() {
      $(this).removeAttr('href');
      $(this).removeAttr('title');
      $(this).parents('.is-expanded').removeClass('expanded');
    });

    menuExpandAnchor.each(function() {
      $(this).click(function() {
        $(this).parents('.is-expanded').toggleClass('expanded');
        $(this).siblings('ul.menu').slideToggle();
        $(this).siblings('ul.menu').toggleClass('collapsed');
      });
    });
  });
}(jQuery);