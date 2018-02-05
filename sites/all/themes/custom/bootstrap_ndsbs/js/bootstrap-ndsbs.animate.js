jQuery(document).ready(function ($) {
  var $frontCarousel = $('#front-page-carousel');
  //$('.item[data-carousel-item=0] .field-name-field-title').attr('data-animation', 'animated bounceInLeft');
  //$('.item[data-carousel-item=0] .field-name-field-carousel-content').attr('data-animation', 'animated fadeIn');
  //$('.item[data-carousel-item=1] .field-name-field-title').attr('data-animation', 'animated bounceInDown');
  //$('.item[data-carousel-item=1] .field-name-field-carousel-content').attr('data-animation', 'animated fadeIn');
  //$('.item[data-carousel-item=2] .field-name-field-title').attr('data-animation', 'animated zoomInLeft');
  //$('.item[data-carousel-item=2] .field-name-field-carousel-content').attr('data-animation', 'animated fadeIn');

  // Initialize carousel
  $frontCarousel.carousel({
    interval: 8000,
    pause: false
  });

  function doAnimations(elems) {
    var animEndEv = 'webkitAnimationEnd animationend';

    elems.each(function () {
      var $this = $(this),
        $animationType = $this.data('animation');

      // Add animate.css classes to
      // the elements to be animated
      // Remove animate.css classes
      // once the animation event has ended
      $this.addClass($animationType).one(animEndEv, function () {
        $this.removeClass($animationType);
      });
    });
  }

  // Select the elements to be animated
  // in the first slide on page load
  var $firstAnimatingElems = $frontCarousel.find('.item:first')
    .find('[data-animation ^= "animated"]');

  // Apply the animation using our function
  doAnimations($firstAnimatingElems);

  // Attach our doAnimations() function to the
  // carousel's slide.bs.carousel event
  $frontCarousel.on('slide.bs.carousel', function (e) {
    //alert($(e.relatedTarget).attr('class'));
    //$(e.relatedTarget).hide();

    // Select the elements to be animated inside the active slide
    //var $animatingElems = $(e.relatedTarget)
      //.find("[data-animation ^= 'animated']");

    //doAnimations($animatingElems);

    //$(e.relatedTarget).fadeIn('slow');
    //$(e.relatedTarget).find('img').attr('align', 'middle');
  });
});