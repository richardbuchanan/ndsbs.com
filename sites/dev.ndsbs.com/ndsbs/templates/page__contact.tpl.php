<?php
global $user;
global $base_url;
?>
<span itemprop="name" style="display: none"><?php print $title; ?></span>
<div id="breadcrumb" style="display: none;" itemscope
     itemtype="http://schema.org/BreadcrumbList">
  <ol>
    <li itemprop="itemListElement" itemscope
        itemtype="http://schema.org/ListItem">
      <a itemprop="item" href="<?php print $base_url; ?>">
        <span itemprop="name">NDSBS</span>
      </a>
      <meta itemprop="position" content="1"/>
    </li>
    <li itemprop="itemListElement" itemscope
        itemtype="http://schema.org/ListItem">
      <a itemprop="item" href="<?php print $base_url; ?>/contact">
        <span itemprop="name">Contact Us</span>
      </a>
      <meta itemprop="position" content="2"/>
    </li>
  </ol>
</div>
<div class="layout fix_layout">
  <?php
  //  header included
  include_once 'header.tpl.php';
  ?>
  <style type="text/css">
    #bubble-marker {
      font-size: 11px;
      line-height: 15px;
    }
  </style>
  <script type="text/javascript"
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCDcHtkegKuJiiMTxt-k0go1vRXhOK0eFA&sensor=false"></script>
  <div class="contents">
    <div class="contents_inner">
      <h1 class="tag_tittle">Contact Us</h1>

      <div class="col2 border_n">
        <?php
        //  Print the body of the page
        //print $node->body['und'][0]['value'];
        if ($messages <> '') {
          print '<div class="message_fixed pt_22"><div class="message_inner">';
          print $messages;
          print '</div></div>';
        }
        $cnfrm = get_contact_form();
        print drupal_render($cnfrm);
        ?>
      </div>
      <div class="col2 last border_n mt_20">
        <ul class="social_list">
          <li class="mail_icon">
            <span><a
                href="mailto:info@ndsbs.com"><?php print variable_get('SA_ADMIN_EMAIL'); ?></a></span>,
            <span><a
                href="mailto:support@ndsbs.com">support@ndsbs.com</a></span>
          </li>
          <li
            class="home_icon"><?php print variable_get('SA_ADMIN_ADDRESS'); ?></li>
          <li
            class="phone_icon"><?php print variable_get('SA_ADMIN_PHONE'); ?></li>
          <li></li>
          <li class="home_icon">510 Clinton Square Rochester,NY 14604</li>
          <li class="phone_icon">1-585-939-7531</li>
        </ul>
        <h2 class="clear pt_20">Map</h2>

        <div class="google_map">
          <div id="map_canvas" style="width: 400px; height: 300px;"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="footer">
    <?php
    //  footer included
    include_once 'footer_sub.tpl.php';
    //  footer included
    include_once 'footer.tpl.php';
    ?>
  </div>
</div>
<script>
  jQuery(document).ready(function () {
    initialize();
  });// Main function closed

  function initialize() {
    var ohLatlng = new google.maps.LatLng(40.1029728, -83.0171951);
    var nyLatlng = new google.maps.LatLng(43.1554502, -77.6062491);
    var ohmapOptions = {
      zoom: 4,
      center: ohLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    var ohmap = new google.maps.Map(document.getElementById('map_canvas'), ohmapOptions);

    var ohcontentString = '<div id="content">' +
      '<p><b>NDSBS, 6797 N High Street Suite 350 Worthington OH 43085</b></p>' +
      '</div>';

    var nycontentString = '<div id="content">' +
      '<p><b>NDSBS, 510 Clinton Square, Rochester, NY 14604</b></p>' +
      '</div>';

    var ohinfowindow = new google.maps.InfoWindow({
      content: ohcontentString
    });

    var nyinfowindow = new google.maps.InfoWindow({
      content: nycontentString
    });

    var ohmarker = new google.maps.Marker({
      position: ohLatlng,
      map: ohmap,
      title: 'NDSBS'
    });

    var nymarker = new google.maps.Marker({
      position: nyLatlng,
      map: ohmap,
      title: 'NDSBS'
    });

    google.maps.event.addListener(ohmarker, 'click', function () {
      ohinfowindow.open(ohmap, ohmarker);
    });

    google.maps.event.addListener(nymarker, 'click', function () {
      nyinfowindow.open(ohmap, nymarker);
    });
  }
</script>
