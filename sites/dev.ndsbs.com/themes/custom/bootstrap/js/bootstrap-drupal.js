(function ($) {
  // Table cells that have a checkbox will have an unwanted wrapper div that
  // does not style correctly. We replace that div with just the checkbox input
  // element.
  $('form td input[type="checkbox"]').each(function() {
    var updateID = $(this).attr('id');
    var updateName = $(this).attr('name');
    var updateValue = $(this).attr('value');
    var updateState = $(this).attr('checked');

    var updateChecked = '';

    if (updateState == 'checked') {
      updateChecked = ' checked="checked"';
    }

    var updateText = '<input type="checkbox" id="' + updateID + '" name="' + updateName + '" value="' + updateValue + '"' + updateChecked + '>';
    $(this).parents('div.checkbox').replaceWith(updateText);
  });

  // Wrap vertical tabs panels with a group div to help us style vertical tabs
  // correctly. We use the equivalent of Bootstrap's accordian plugin without
  // implicitely declaring it in this script.
  $('.vertical-tabs-panes .panel').wrapAll('<div class="vertical-tabs-panel-group"></div>');

  $('.vertical-tabs-panel-group .panel:first')
    .find('.collapse')
    .addClass('in')
    .attr('aria-expanded', 'true')
    .prev('.panel-heading').addClass('panel-open');

  $('.vertical-tabs-panel-group .panel-heading a').click(function() {
    $(this).closest('.panel-heading').toggleClass('panel-open');
  });

  // Render dropdown menus correctly using Bootstrap's dropdown menu
  // attributes.
  $('ul.navbar-nav li.dropdown ul.nav').attr('class', 'dropdown-menu');

  $('ul.navbar-nav li.dropdown > a').each(function () {
    $(this).closest('li.dropdown').removeClass('active');

    var dropdownTitle = $(this).text();
    $(this).html(dropdownTitle + ' <span class="caret"></span>');

    $(this)
      .attr('href', '#')
      .attr('class', 'dropdown-toggle')
      .attr('data-toggle', 'dropdown')
      .attr('role', 'button')
      .attr('aria-haspopup', 'true')
      .attr('aria-expanded', 'false');
  });

  // Replace menu items entered as a separator with the correct HTML.
  $('ul.navbar-nav ul.dropdown-menu a').each(function() {
    if ($(this).html() == '&lt;separator&gt;') {
      $(this).closest('li').attr('class', 'divider').attr('role', 'separator');
    }
    if ($(this).closest('li').hasClass('divider')) {
      $(this).remove();
    }
  });

  // Add the active class to the parent menu item in a dropdown menu when it is
  // in the active trail.
  $('ul.dropdown-menu li.active').each(function() {
    $(this).parents('li.dropdown').addClass('active');
  });

  // Update the autocomplete status glyphicon class to use animations.
  if (Drupal.jsAC) {
    Drupal.jsAC.prototype.setStatus = function (status) {
      switch (status) {
        case 'begin':
          $(this.input).addClass('throbbing').next('.glyphicon-refresh').addClass('glyphicon-refresh-animate');
          $(this.ariaLive).html(Drupal.t('Searching for matches...'));
          break;
        case 'cancel':
        case 'error':
        case 'found':
          $(this.input).removeClass('throbbing').next('.glyphicon-refresh').removeClass('glyphicon-refresh-animate');
          break;
      }
    };
  }

  $('.reset-password').once(function() {
    var field = $(this).next('input[type="password"]');
    $(this).width(field.outerWidth());
  });
})(jQuery);

// So the theme does not seem to "jump" on page load, we initially hid the
// body. Once the document is ready, go ahead and show the body.
jQuery(document).ready(function($) {
  $('body').fadeTo('slow' , 1, function() {
  });
});