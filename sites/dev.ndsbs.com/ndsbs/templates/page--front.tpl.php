<?php
global $user;
global $base_url;
//  Get the home page content with using the node id of the home page
//  Home page nid = 167
$home_nid = '167';
$node = node_load($home_nid);

//  custom image path defined
$path_image = $base_path . path_to_theme() . '/' . 'images';

//  Get the testimonials
$testimonial = get_all_testimonial();

$node_testimonial = array();
foreach ($testimonial as $testidata) {
  $node_testimonial[] = node_load($testidata->nid);
}
?>
<?php print $messages; ?>
<span itemprop="name" style="display: none">NDSBS.com</span>
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
  </ol>
</div>
<div class="layout fix_layout hshadow page-front-content">
  <?php
  //  header included
  include_once 'header.tpl.php';
  ?>
  <!--slide starts here-->
  <div class="main_slider">

    <div class="slide_wrapper">
      <div class="slide slide1">
        <div class="slide_content">
          <?php print $node->field_slider_one_text['und'][0]['value']; ?>
        </div>
      </div>
      <div class="slide slide2">
        <div class="slide_content">
          <?php print $node->field_slider_two_text['und'][0]['value']; ?>
        </div>
      </div>
      <div class="slide slide3">
        <div class="slide_content">
          <?php print $node->field_slider_three_text['und'][0]['value']; ?>
        </div>
      </div>
    </div>
    <div class="thumbs">
      <ul>
        <li id="slide1" class="active"></li>
        <li id="slide2"></li>
        <li id="slide3"></li>
      </ul>
    </div>
  </div>
  <!--slide ends here-->

  <!--contents starts here-->
  <div class="contents homepage">
    <div class="contents_inner">
      <!--left column starts here-->
      <div class="left_columns">
        <h2>Testimonials</h2>

        <div class="gery_bkg" style="min-height: 344px;">
          <div class="testimonial_contents"
               style="min-height: 344px; background-color: #fff;">
            <?php print views_embed_view('testimonials', 'block_1'); ?>
          </div>
        </div>

        <div class="sd_bottom txt_ac">
          <a title="Directions Counseling Group BBB Business Review" href="https://www.bbb.org/centralohio/business-reviews/marriage-family-child-individual-counselors/directions-counseling-group-in-worthington-oh-70078980/#bbbonlineclick">
            <img alt="Directions Counseling Group BBB Business Review" style="border: 0;" src="https://seal-centralohio.bbb.org/seals/blue-seal-160-82-directions-counseling-group-70078980.png" />
          </a>
          <br/>
          <img src="<?php print $path_image; ?>/cards.png" alt="Secure Payment" />
        </div>
      </div>
      <!--left column ends here-->
      <!--right column starts here-->
      <div class="right_columns">
        <img src="<?php print image_style_url('home_left_image', $node->field_home_left_image['und'][0]['uri']); ?>" class="thin left" alt="Welcome to New Directions" title="Welcome to New Directions" />
        <h3 style="position: absolute; top: 200px; color: #434343; font-size: 12px; font-weight: bold;">Brian T. Davis, CEO, LISW-S, SAP</h3>
        <h1>Welcome to New Directions</h1>
        <p><?php print $node->field_home_left_text['und'][0]['value']; ?></p>

        <div class="services_bottom">
          <div class="sb_col left">
            <h2>Our Team</h2>
            <a href="/professional-staff">
              <img src="<?php print image_style_url('page_images', $node->field_our_team['und'][0]['uri']); ?>" class="thin" alt="Our Team" title="Our Team" />
            </a>
            <p><?php print $node->field_our_team_text['und'][0]['value']; ?></p>
          </div>
          <div class="sb_col right">
            <h2>Our Services</h2>
            <a href="/our-services">
              <img src="<?php print image_style_url('page_images', $node->field_our_services['und'][0]['uri']); ?>" class="thin" alt="Our Services" title="Our Services" />
            </a>
            <p><?php print $node->field_our_services_text['und'][0]['value']; ?></p>
          </div>
        </div>
      </div>
      <!--right column ends here-->
    </div>
    <div id="front-page-content" class="element-invisible">
      <?php print render($page['content']); ?>
    </div>
  </div>
  <!--contents ends here-->
  <div class="footer">
    <?php
    //  footer included
    include_once 'footer_sub.tpl.php';
    //  footer included
    include_once 'footer.tpl.php';
    ?>
  </div>
</div>
