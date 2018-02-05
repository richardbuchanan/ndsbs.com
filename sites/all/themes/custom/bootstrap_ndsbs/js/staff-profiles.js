jQuery(document).ready(function($) {
  var d = 0; //delay
  var ry, tz, s; //transform params

  //animation time
  $(".animate").on("click", function (e) {
    var target = $(this).attr('href');
    $(this).addClass('active');
    e.preventDefault();
    //fading out the thumbnails with style
    $(this).find("img").each(function () {
      d = 100; //100ms delay
      $(this).delay(d).animate({opacity: 0}, {
        //while the thumbnails are fading out, we will use the step function to apply some transforms. variable n will give the current opacity in the animation.
        step: function (n) {
          s = 1 - n; //scale - will animate from 0 to 1
          $(this).css("transform", "scale(" + s + ")");
        },
        duration: 500
      })
    }).promise().done(function () {
      //after *promising* and *doing* the fadeout animation we will bring the images back
      storm();
      calm(target);
    })
  });

  //bringing back the images with style
  function storm() {
    $(".animate img").each(function () {
      d = 500;
      $(this).delay(d).animate({opacity: 1}, {
        step: function (n) {
          //rotating the images on the Y axis from 360deg to 0deg
          ry = (1 - n) * 360;
          //translating the images from 100px to 0px
          tz = (1 - n) * 100;
          //applying the transformation
          $(this).css("transform", "rotateY(" + ry + "deg) translateZ(" + tz + "px)");
        },
        duration: 3000,
        //some easing fun. Comes from the jquery easing plugin.
        easing: 'easeOutQuint'
      })
    })
  }

  function calm(t) {
    $('.col').each(function() {
      $(this).fadeOut(500);
    });
    $(t).fadeIn(500);
  }

  $('.view-staff-profiles .panel-vertical .panel-body').click(function() {
    var expandBio = $(this).find('.expand-bio');
    var target = $(expandBio).data('target');
    var height = $(target).find('.staff-bio-content').outerHeight(true);
    $(target).toggleClass('collapsed').toggleClass('expanded');

    $(expandBio).find('h3').toggleText('Read less', 'Read more');

    slideHeight(target, 'collapsed', '100px', height);
  });

  $('.view-staff-profiles .panel-horizontal .panel-body .expand-bio').click(function() {
    var target = $(this).data('target');
    $(target).find('.contact-form').slideToggle(500);
  });

  $('.view-staff-profiles .expand-contact').click(function() {
    var target = $(this).data('target');
    $(target).slideToggle(500);
  });

  function slideHeight(target, targetClass, minHeight, maxHeight) {
    if ($(target).hasClass(targetClass)) {
      $(target).animate({
        height: minHeight
      }, 500, function() {
      });
    }
    else {
      $(target).animate({
        height: maxHeight
      }, 500, function() {
      });
    }
  }

  $.fn.toggleText = function(t1, t2){
    if (this.text() == t1) this.text(t2);
    else                   this.text(t1);
    return this;
  };
});