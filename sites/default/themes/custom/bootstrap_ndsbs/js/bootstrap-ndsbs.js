// Add Facebook SDK integration to all pages.
window.fbAsyncInit = function() {
  FB.init({
    appId      : '1334749103208264',
    xfbml      : true,
    version    : 'v2.5'
  });
};

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

(function ($) {
  var a = $('.faq-video-box.first');
  var b = $('.faq-video-box.second');
  var c = $('.faq-video-box.third');
  var d = $('.faq-video-box.fourth');

  if (b.length) {
    var f = Math.max(a.find('h2').outerHeight(), b.find('h2').outerHeight());
    a.find('h2').height(f);
    b.find('h2').height(f);

    var e = Math.max(a.outerHeight(), b.outerHeight());
    a.height(e);
    b.height(e);
  }

  if (d.length) {
    var h = Math.max(c.find('h2').outerHeight(), d.find('h2').outerHeight());
    c.find('h2').height(h);
    d.find('h2').height(h);

    var g = Math.max(c.outerHeight(), d.outerHeight());
    c.height(g);
    d.height(g);
  }

  function navbarAnimations() {
    // When using a medium or larger screen, use animations to open the dropdown
    // menus.
    if (window.matchMedia('(min-width: 768px)').matches) {
      $('ul.navbar-nav li.dropdown > a').each(function () {
        var dropdownTitle = $(this).text();
        $(this).html(dropdownTitle);
      });
    }

    if (window.matchMedia('(max-width: 767px)').matches) {
      $('#main-menu-wrapper').find('#main-menu').removeClass('nav-justified');
    }
  }

  navbarAnimations();
}(jQuery));

jQuery(document).ready(function($) {
  var userMenu = $('#user-menu-wrapper');
  var callUs = $('.call-us');
  var userMenuPosition = userMenu.find('.navbar-nav').position();
  var callUsPosition = callUs.position();
  callUs.css({
    position: "relative",
  });
  var html = $('html');
  var body = $('body');
  var dropdown = $('ul.nav li.dropdown');
  var accordion = $('[data-parent=#accordion]');
  var trigger = $('.trigger');
  var staffTrigger = $('.staff-profile-more-info');
  var carouselItem = $('[data-carousel-item]');
  var menuPosition = 1;
  var staffRole = !!(body.hasClass('role-client') &&
    (body.hasClass('role-therapist') ||
    body.hasClass('role-staff-admin') ||
    body.hasClass('role-developer') ||
    body.hasClass('role-super-admin')));

  if (body.hasClass('front')) {
    var professionalReviews = $('body.front #main-container #left-content #professional-reviews .view-content .carousel .carousel-inner');
    var professionalReviewsItem = professionalReviews.find('.item');
    var professionalReviewsSlide = $('body.front #main-container #left-content #professional-reviews .view .slide');

    function thisHeight() {
      return $(this).outerHeight(true);
    }

    professionalReviews.each(function () {
      var thisULMax = Math.max.apply(Math, $(this)
        .find('.item')
        .map(thisHeight));
      $(this).height(thisULMax + 15);
    });

    var professionalReviewsHeight = professionalReviews.outerHeight();
    professionalReviewsItem.each(function () {
      var professionalReviewsItemHeight = $(this).outerHeight();
      var professionalReviewsItemPadding = (professionalReviewsHeight - professionalReviewsItemHeight) / 2;
      $(this).css({
        'padding-top': professionalReviewsItemPadding,
        'padding-bottom': professionalReviewsItemPadding
      });
    });

    if (professionalReviewsSlide.length) {
      var professionalReviewsLeft = professionalReviewsSlide.offset().left + 15;
      var professionalReviewsFooter = $('body.front #main-container #left-content #professional-reviews .view-footer');

      professionalReviewsFooter.css({
        'left': professionalReviewsLeft,
        'width': '70px'
      });
    }
  }

  // First add a menu position class to each user menu item.
  $('.header-nav #user-menu-wrapper .dropdown-menu>li>a').each(function() {
    $(this).addClass('menu-position-' + menuPosition);
    menuPosition++;
  });

  // Now we can get the "My Dashboard" link for later use.
  var dashboardLink = $('.header-nav #user-menu-wrapper .dropdown-menu>li>a.menu-position-2');

  dashboardLink.click(function(event) {
    if (staffRole) {
      event.preventDefault();
      var text = 'Since you have both a staff role and a client role assigned to your account, please select which dashboard should be opened.';

      $('<div id="dialog">' + text + '</div>').appendTo('body');

      var host = location.protocol + "//" + location.host;
      $('#dialog').dialog({
        draggable: true,
        width: 'auto',
        maxWidth: 600,
        modal: true,
        title: 'Select Dashboard',
        buttons: {
          "Staff Dashboard": function() {
            window.location.href = host + '/user/clients/list';
          },
          "Client Dashboard": function() {
            window.location.href = host + '/questionnaire/start/trans';
          }
        }
      }); //.prev().find('.ui-dialog-titlebar-close').hide();
    }
  });

  $(document).ready(function () {
    $('[data-toggle="offcanvas"]').click(function () {
      html.toggleClass('offcanvas-active');
      body.toggleClass('offcanvas-active');
      $('.row-offcanvas').toggleClass('active');
      $('#offcanvas-overlay').toggleClass('overlayed');
      $('#toggle-dashboard').toggleClass('open');
      $(this).toggleClass('open');

      if ($(this).hasClass('open')) {
        $(this).attr('title', 'Close Dashboard');
      }
      else {
        $(this).attr('title', 'Open Dashboard');
      }
    });
  });

  body.click(function(event ){
    var $target = $(event.target);
    if(!$target.parents().is(".staff-profile-popup") && !$target.is(".staff-profile-popup")){
      body.find(".staff-profile-popup").fadeOut();
      body.removeClass('overlay');
      $('.staff-profile-overlay').delay(100).fadeOut();

      // Un-lock scroll position
      var html = jQuery('html');
      var scrollPosition = html.data('scroll-position');
      html.css('overflow', html.data('previous-overflow'));
      if (scrollPosition) {
        window.scrollTo(scrollPosition[0], scrollPosition[1]);
      }
    }
  });

  // When using a medium or larger screen, use animations to open the dropdown
  // menus.
  if (window.matchMedia('(min-width: 768px)').matches) {
    dropdown.hover(function () {
        $(this).find('.dropdown-toggle').addClass('open');
        $(this).find('.dropdown-menu').stop(true, true).delay(100).fadeIn();
      },
      function () {
        $(this).find('.dropdown-menu').stop(true, true).delay(100).fadeOut();
        $(this).find('.dropdown-toggle').removeClass('open');
      }
    );

    dropdown.click(function (event) {
      event.stopPropagation();
    });

    $('.header-nav').css('overflow', 'visible');
  }


  // Apply better styling to collapsed panel headings and add a data state.
  var toggled = false;
  accordion.parents('.panel-heading')
    .attr('data-descendant-expanded', $(this).attr('aria-expanded'))
    .css('border-bottom-width', '0');

  // React on the accordion click event to toggle the heading data states.
  accordion.click(function() {
    var heading = $(this).parents('.panel-heading');
    toggled = !toggled;

    // Use a closure to toggle the data state of the heading.
    heading.attr('data-descendant-expanded', toggled ? 'true' : 'false');

    // Use a delay queue to add/remove the bottom border from the heading.
    heading.delay(100).queue(function() {
      $(this).css('border-bottom-width', toggled ? '1px' : '0').dequeue();
    });
  });

  // Expands the trigger box content, and scrolls to the top of the content if
  // the content extends below the browser window.
  trigger.click(function() {
    $(this).find('span').toggleClass('expanded');

    $(this).next('.toggle_box').toggle( "slow", function() {
      var windowPosition = $(window).scrollTop() + $(window).height();
      var toggleBoxPosition = $(this).offset().top + $(this).height() + 30;
      if(windowPosition < toggleBoxPosition) {
        $('html, body').animate(
          { scrollTop: $(this).offset().top }, 600
        );
      }
    });
  });

  // Show the active menu item in dashboard menus.
  $('ul.nav-staff-dropdown li.active').each(function() {
    $(this).parents('.dropdown-link').addClass('expanded');
    $(this).parents('.nav-staff-dropdown').show();
  });

  $('ul.nav-client-dropdown li a.active').parent('li').addClass('active');

  $('ul.nav-client-dropdown li.active').each(function() {
    $(this).parents('.dropdown-link').addClass('expanded');
    $(this).parents('.nav-client-dropdown').show();
  });

  // Creates an accordion-style animation effect for dashboard menus.
  $('ul.nav-staff-tree li .dropdown-link').click(function (e) {
    e.preventDefault();

    if ($(this).hasClass('expanded')) {
      $(this).removeClass('expanded');
      $(this).next().children().show();
      $(this).next().slideToggle();
    }
    else {
      $('ul.nav-staff-tree li .dropdown-link.expanded').removeClass('expanded');
      $(this).addClass('expanded');
      $('ul.nav-staff-tree li ul.nav-staff-dropdown').slideUp();
      $(".left_menu ul li ul li ul").show();
      $(this).children().toggleClass('expanded');
      $(this).next().children().show();
      $(this).next().slideToggle();
    }
  });
  $('ul.nav-client-tree li .dropdown-link').click(function (e) {
    e.preventDefault();

    if ($(this).hasClass('expanded')) {
      $(this).removeClass('expanded');
      $(this).next().children().show();
      $(this).next().slideToggle();
    }
    else {
      $('ul.nav-client-tree li .dropdown-link.expanded').removeClass('expanded');
      $(this).addClass('expanded');
      $('ul.nav-client-tree li ul.nav-client-dropdown').slideUp();
      $(".left_menu ul li ul li ul").show();
      $(this).children().toggleClass('expanded');
      $(this).next().children().show();
      $(this).next().slideToggle();
    }
  });

  // Add the required form-control class to data tables. jQuery strips these
  // classes out.
  var dataTablesWrapper = $('.dataTables_wrapper');
  dataTablesWrapper.find('input[type=search]').addClass('form-control');
  dataTablesWrapper.find('select').addClass('form-control');

  // Staff profiles
  if (staffTrigger.length > 0) {
    body.append('<div class="staff-profile-overlay"></div>');
    body.css('position', 'relative');
  }

  staffTrigger.click(function(e) {
    e.stopPropagation();
    var parent = $(this).parents('.profile-row').attr('id');
    $('body').toggleClass('overlay');
    $('.staff-profile-overlay').delay(100).fadeIn();
    $("[data-parent=#" + parent + "]").fadeIn();

    // Lock page scroll position, but retain settings for later.
    var scrollPosition = [
      self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
      self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
    ];

    var html = jQuery('html'); // it would make more sense to apply this to body, but IE7 won't have that
    html.data('scroll-position', scrollPosition);
    html.data('previous-overflow', html.css('overflow'));
    html.css('overflow', 'hidden');
    window.scrollTo(scrollPosition[0], scrollPosition[1]);
  });

  $('.staff-profile-popup .close').click(function(e) {
    var parent = $(this).parents('.profile-row').attr('id');
    body.toggleClass('overlay');
    $("[data-parent=#" + parent + "]").fadeOut();
    $('.staff-profile-overlay').delay(100).fadeOut();

    // Un-lock scroll position
    var html = jQuery('html');
    var scrollPosition = html.data('scroll-position');
    html.css('overflow', html.data('previous-overflow'));
    window.scrollTo(scrollPosition[0], scrollPosition[1]);
  });

  // Staff Profiles Popup Modal
  var resizeStaffProfileModal = function (e, no_shrink) {
    var $modal = $('.staff-profile-popup');
    var $scroll = $('.staff-profile-scroll', $modal);
    if ($modal.size() == 0 || $modal.css('display') == 'none') {
      //return;
    }

    var maxWidth = parseInt($(window).width() * .85); // 70% of window
    var minWidth = parseInt($(window).width() * .6); // 70% of window

    // Set the modal to the minwidth so that our width calculation of
    // children works.
    $modal.css('width', minWidth);
    var width = minWidth;

    // Don't let the window get more than 80% of the display high.
    var maxHeight = parseInt($(window).height() * .8);
    var minHeight = 300;
    if (no_shrink) {
      minHeight = $modal.height();
    }

    if (minHeight > maxHeight) {
      minHeight = maxHeight;
    }

    var height = 0;

    // Calculate the height of the 'scroll' region.
    var scrollHeight = 0;

    scrollHeight += parseInt($scroll.css('padding-top'));
    scrollHeight += parseInt($scroll.css('padding-bottom'));

    $scroll.children().each(function () {
      var w = $(this).innerWidth();
      if (w > width) {
        width = w;
      }
      scrollHeight += $(this).outerHeight(true);
    });

    // Now, calculate what the difference between the scroll and the modal
    // will be.

    var difference = 0;
    difference += parseInt($scroll.css('padding-top'));
    difference += parseInt($scroll.css('padding-bottom'));
    difference += $('.staff-profile-title').outerHeight(true);
    difference += $('.views-add-form-selected').outerHeight(true);

    height = scrollHeight + difference;

    if (height > maxHeight) {
      height = maxHeight;
      scrollHeight = maxHeight - difference;
    }
    else if (height < minHeight) {
      height = minHeight;
      scrollHeight = minHeight - difference;
    }

    if (width > maxWidth) {
      width = maxWidth;
    }

    // Get where we should move content to
    var top = ($(window).height() / 2) - (height / 2);
    var left = ($(window).width() / 2) - (width / 2);

    $modal.css({
      'top': top + 'px',
      'left': left + 'px',
      'width': width + 'px'
    });

    $scroll.css({
      'max-height': (height + 25) + 'px'
    });
  };

  resizeStaffProfileModal(true);

  $(window).resize(function() {
    resizeStaffProfileModal(true);
  });

  var footer = $('#site-footer');

  if (footer.length) {
    var docHeight = $(window).height();
    var footerHeight = footer.height();
    var footerTop = footer.position().top + footerHeight;

    if (footerTop < docHeight) {
      //footer.css('margin-top', (docHeight - footerTop) + 'px');
    }
  }

  var stepsBadgeWrapper = $('#steps-badge-wrapper');

  $('#arrows-wrapper').width(stepsBadgeWrapper.outerWidth(false));
  $('#arrows-wrapper-bottom').width(stepsBadgeWrapper.outerWidth(false));

  var i = 0;
  carouselItem.each(function () {
    $(this).addClass('item-' + i);
    i++;
  });

  var stepsButton = $('#steps-sidebar-button');
  var slidesButton = $('.slides-button');
  var loggedInButton = '';
  var NotloggedInButton = '<p><a href="/user/register" class="btn btn-primary">Get started</a></p>';
  var loggedInButtonSlides = '<p><div class="btn-group"><a href="/user/register" class="btn btn-slide btn-sm">Get started</a><a href="/state-map" class="btn btn-slide btn-sm">Check My State</a></div></p>';
  var NotloggedInButtonSlides = '<p><a href="/state-map" class="btn btn-slide btn-sm">Check My State</a></p>';

  if (body.hasClass('not-logged-in')) {
    stepsButton.html(NotloggedInButton + stepsButton.html());
    slidesButton.html(loggedInButtonSlides);
  }
  else {
    stepsButton.html(loggedInButton + stepsButton.html());
    slidesButton.html(NotloggedInButtonSlides);
  }

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
    var accepted = Drupal.settings.bdg_ndsbs.accepted;
    var lineOne = Drupal.settings.bdg_ndsbs.line_one;
    var lineTwo = Drupal.settings.bdg_ndsbs.line_two;
    var lineThree = Drupal.settings.bdg_ndsbs.line_three;
    var lineFour = Drupal.settings.bdg_ndsbs.line_four;

    if(map.length) {
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
        'mouseover': function (event, data) {
          var mainContainer = $('#main-container');
          var popoverWidth = mainContainer.outerWidth();
          var title = data.name;
          var statename = title.toUpperCase();
          var stateabbr = title.toLowerCase();
          //var stateoptions = accepted[stateabbr];
          //var mv_abbr = stateoptions['motor_vehicle_abbr'];
          //var courtsclass = stateoptions['accepted']['Courts']['class'];
          //var mvclass = stateoptions['accepted']['Motor Vehicles']['class'];
          //var courts = '<li class="list-group-item ' + courtsclass + '">' + stateoptions['accepted']['Courts']['text'] + '</li>';
          //var motorvehicle = '<li class="list-group-item ' + mvclass + '">' + stateoptions['accepted']['Motor Vehicles']['text'] + '</li>';
          var line_one = '';
          var line_two = '';
          var line_three = '';
          var line_four = '';

          if (lineOne[statename]) {
            line_one = '<li class="list-group-item">' + lineOne[statename] + '</li>';
          }

          if (lineTwo[statename]) {
            line_two = '<li class="list-group-item">' + lineTwo[statename] + '</li>';
          }

          if (lineThree[statename]) {
            line_three = '<li class="list-group-item">' + lineThree[statename] + '</li>';
          }

          if (lineFour[statename]) {
            line_four = '<li class="list-group-item">' + lineFour[statename] + '</li>';
          }

          //var statelist = '<ul class="list-group">' + courts + motorvehicle + '</ul>';
          var statelist = '<ul class="list-group">' + line_one + line_two + line_three + line_four + '</ul>';
          var text;

          if (popoverWidth > 768) {
            text = '<div class="arrow"></div><h3 class="popover-title">' + states[statename] + '<button type="button" class="close visible-xs-block" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></h3><div class="popover-content"> <p>' + statelist + '</p></div>';
            $('<div class="popover right"></div>').html(text)
              .appendTo('body')
              .fadeIn('slow')
              .css({'max-width': 560, 'min-width': 350});

            $('#interactive-map').mousemove(function (e) {
              var mousex = e.pageX + 30; //Get X coordinates
              var mousey = e.pageY - 70; //Get Y coordinates
              $('.popover').css({top: mousey, left: mousex})
            });
          }
        },
        'click': function (event, data) {
          var mainContainer = $('#main-container');
          var popoverWidth = mainContainer.outerWidth();
          var title = data.name;
          var statename = title.toUpperCase();
          var stateabbr = title.toLowerCase();
          //var stateoptions = accepted[stateabbr];
          //var mv_abbr = stateoptions['motor_vehicle_abbr'];
          //var courtsclass = stateoptions['accepted']['Courts']['class'];
          //var mvclass = stateoptions['accepted']['Motor Vehicles']['class'];
          //var courts = '<li class="list-group-item ' + courtsclass + '">' + stateoptions['accepted']['Courts']['text'] + '</li>';
          //var motorvehicle = '<li class="list-group-item ' + mvclass + '">' + stateoptions['accepted']['Motor Vehicles']['text'] + '</li>';
          var line_one = '';
          var line_two = '';
          var line_three = '';
          var line_four = '';

          if (lineOne[statename]) {
            line_one = '<li class="list-group-item">' + lineOne[statename] + '</li>';
          }

          if (lineTwo[statename]) {
            line_two = '<li class="list-group-item">' + lineTwo[statename] + '</li>';
          }

          if (lineThree[statename]) {
            line_three = '<li class="list-group-item">' + lineThree[statename] + '</li>';
          }

          if (lineFour[statename]) {
            line_four = '<li class="list-group-item">' + lineFour[statename] + '</li>';
          }

          var statelist = '<ul class="list-group">' + line_one + line_two + line_three + line_four + '</ul>';
          var text;

          if (popoverWidth < 768) {
            text = '<div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" style="font-size: 200%" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">' + states[statename] + '</h4></div><div class="modal-body"><p>' + statelist + '</p></div></div></div>';
            $('<div id="map-modal" class="modal fade in" tabindex="-1" role="dialog"></div>')
              .html(text)
              .appendTo('body')
              .modal('toggle');
          }
        },
        'mouseout': function (event, data) {
          $('.popover').remove();
        }
      });
    }
  }
});

(function ($) {
  Drupal.behaviors.paymentReload = {
    attach: function (context, settings) {
      $('.form-item-rush-service input').click(function (e) {
      });
    }
  }
})(jQuery);
