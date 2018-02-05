jQuery(document).ready(function () {
  initialize();
});// Main function closed

function initialize() {
  var ohLatlng = new google.maps.LatLng(40.1029728, -83.0171951);
  // var nyLatlng = new google.maps.LatLng(43.1554502, -77.6062491);
  var ohmapOptions = {
    zoom: 4,
    center: ohLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  var ohmap = new google.maps.Map(document.getElementById('map_canvas'), ohmapOptions);

  var ohcontentString = '<div id="content">' +
    '<p><b>NDSBS, 6797 N High Street Suite 350 Worthington OH 43085</b></p>' +
    '</div>';

  // var nycontentString = '<div id="content">' +
  //   '<p><b>NDSBS, 510 Clinton Square, Rochester, NY 14604</b></p>' +
  //   '</div>';

  var ohinfowindow = new google.maps.InfoWindow({
    content: ohcontentString
  });

  // var nyinfowindow = new google.maps.InfoWindow({
  //   content: nycontentString
  // });

  var ohmarker = new google.maps.Marker({
    position: ohLatlng,
    map: ohmap,
    title: 'NDSBS'
  });

  // var nymarker = new google.maps.Marker({
  //   position: nyLatlng,
  //   map: ohmap,
  //   title: 'NDSBS'
  // });

  google.maps.event.addListener(ohmarker, 'click', function () {
    ohinfowindow.open(ohmap, ohmarker);
  });

  // google.maps.event.addListener(nymarker, 'click', function () {
  //   nyinfowindow.open(ohmap, nymarker);
  // });
}
