(function ($) {
  var $dashbboardTherapistReports = $('#block-ndsbs-reports-therapist-reports-all');
  var $dashboardChildren = $('#region-dashboard-main').find('.block-views');
  var $hoverMapsChildren = $('#bdg-maps-admin').find('.form-wrapper');
  $dashbboardTherapistReports.removeClass('col-md-6');
  for(var i = 0, l = $dashboardChildren.length; i < l; i += 2) {
    $dashboardChildren.slice(i, i + 2).wrapAll('<div class="row"></div>');
  }
  for(var d = 0, m = $hoverMapsChildren.length; d < m; d += 3) {
    $hoverMapsChildren.slice(d, d+3).wrapAll('<div class="row"></div>');
  }
}(jQuery));
jQuery(document).ready(function($) {
});
