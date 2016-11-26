$(document).ready(function () {
  /* Start img function*/
  var theWindow = $(window),
    $bg = $("#bg"),
    aspectRatio = $bg.width() / $bg.height();

  function resizeBg() {
    var slide = $('.slide');

    if ((slide.width() / slide.height()) < aspectRatio) {
      $bg.removeClass().addClass('bgheight');
    }
    else {
      $bg.removeClass().addClass('bgwidth');
    }
  }

  theWindow.resize(function () {
    resizeBg();
  }).trigger("resize");
  /* End img function*/

  /* Start Universal textbox watermark function */
  $('.watermark').each(function () {
    var default_value = this.value;

    $(this).focus(function () {
      if ($(this).value == default_value) {
        $(this).value = '';
      }
    });

    $(this).blur(function () {
      if ($(this).value == '') {
        $(this).value = default_value;
      }
    });
  });
  /* End Universal textbox watermark function*/

  /* Starts dropdown menu function */
  $(".left_menu ul li span.main_link").click(function (e) {
    e.preventDefault();

    if ($(this).hasClass('expanded')) {
      $(this).removeClass('expanded');
      $(this).next().children().show();
      $(this).next().slideToggle();
    }
    else {
      $(".left_menu ul li span.main_link").removeClass('expanded');
      $(this).addClass('expanded');
      $(".left_menu ul li ul").hide();
      $(".left_menu ul li ul li ul").show();
      $(this).children().toggleClass('expanded');
      $(this).next().children().show();
      $(this).next().slideToggle();
    }
  });
  /* End dropdown menu function */

  /* Starts dropdown function */
  var x = {
    toggleLogin1: function (elem) {
      $(".ndrequests_jewel").removeClass("ndrequests_jewel_active");
      $("#ndrequests_layout").slideUp(400);

      if ($(elem).hasClass("ndmassage_jewel_active")) {
        $(".ndmassage_jewel").removeClass("ndmassage_jewel_active");
        $("#ndmassage_layout").slideUp(400);
      }
      else {
        $("#ndmassage_layout").slideDown(400);
        $(elem).addClass("ndmassage_jewel_active");
      }
    },

    closeLogin1: function () {
      $(".ndmassage_jewel").removeClass("ndmassage_jewel_active");
      $("#ndmassage_layout").slideUp(400);
    },

    toggleLogin2: function (elem) {
      $(".ndmassage_jewel").removeClass("ndmassage_jewel_active");
      $("#ndmassage_layout").slideUp(400);

      if ($(elem).hasClass("ndrequests_jewel_active")) {
        $(".ndrequests_jewel").removeClass("ndrequests_jewel_active");
        $("#ndrequests_layout").slideUp(400);
      }
      else {
        $("#ndrequests_layout").slideDown(400);
        $(elem).addClass("ndrequests_jewel_active");
      }
    },

    closeLogin2: function () {
      $(".ndrequests_jewel").removeClass("ndrequests_jewel_active");
      $("#ndrequests_layout").slideUp(400);
    }
  };

  var jewelMessage = $(".ndmassage_jewel");
  var jewelRequests = $(".ndrequests_jewel");

  jewelMessage.click(function (event) {
    event.preventDefault();
    x.toggleLogin1(this);
  });

  jewelRequests.click(function (event) {
    event.preventDefault();
    x.toggleLogin2(this);
  });

  jewelMessage.click(function (event) {
    $("html").click(function () {
      x.closeLogin1()
    });
    event.stopPropagation();
  });

  jewelRequests.click(function (event) {
    $("html").click(function () {
      x.closeLogin2()
    });
    event.stopPropagation();
  });
  /* End dropdown function */

  /*accordian interaction starts here */
  var $accordian = {
    ppAcordian: function () {
      $('h2.trigger').click(function () {
        //toggle active class
        $(this).toggleClass('active');
        //toggle content box
        $(this).siblings('.toggle_box').slideToggle();
      });
    }
  };

  $accordian.ppAcordian();
  /* accordian interaction ends here */

  /*slider starts here*/
  $(".slides_b ul li").click(function () {
    var x = $(this).attr("id");
    $(".slides_b ul li").removeClass("active");

    for (var i = 0; i <= 4; i++) {
      $(".li" + i).hide();
    }

    $("." + x).slideToggle(1000);
    this.className = 'active'
  });
  /*slider ends here*/

  /* Starts menu function */
  $('.nav li').hover(function () {
      $(this).children('ul').slideToggle(500);
      $(this).children('a:first').addClass('selected');
    },
    function () {
      $(this).children('ul').hide();
      $(this).children('a:first').removeClass('selected');
    });

  $('.nav li a').each(function () {
    if ($(this).attr('href') == '/') {
      $(this).removeAttr('href');
    }
  });
  /* Ends menu function*/

  //  FB scroll
  $('.message_scroll').each(function () {
    $(this).slimscroll({
      height: '264px',
      width: '480px',
      start: 'top',
      disableFadeOut: true
    })
  });

  var breadcrumbPosition = 1;

  $('#breadcrumb').find('a').each(function () {
    var breadcrumbText = $(this).html();
    $(this).attr('itemprop', 'item');
    $(this).html('<span itemprop="name">' + breadcrumbText + '</span>');
    $(this).after('<meta itemprop="position" content="' + breadcrumbPosition++ + '" />');
  });
});

/**
 * Registration Terms of Use
 */
(function ($) {
  $(document).ready(function () {
    var agreeTerms = $('#edit-field-terms-of-use-und-i-agree-with-ndsbs-terms-of-use');
    var frmValidation = $("#user_registration_frm_validation");

    if ($('html.js').length) {
      agreeTerms.addClass('invalid');

      frmValidation.find('#edit-submit').css({
        opacity: .2,
        cursor: 'not-allowed'
      });

      agreeTerms.change(function () {
        if (this.checked) {
          $(this).addClass('valid').removeClass('invalid');
          frmValidation.find('#edit-submit').css({
            opacity: 1,
            cursor: 'pointer'
          });
        }
        else {
          $(this).addClass('invalid').removeClass('valid');
          frmValidation.find('#edit-submit').css({
            opacity: .2,
            cursor: 'not-allowed'
          });
        }
      });
    }

    frmValidation.find("#edit-submit").on("click", function () {
      if (!$("#edit-field-terms-of-use-und-i-agree-with-ndsbs-terms-of-use").hasClass('valid')) {
        alert("You must agree to the Terms of Use to continue.");
      }
      return true;
    });
  });
}(jQuery));