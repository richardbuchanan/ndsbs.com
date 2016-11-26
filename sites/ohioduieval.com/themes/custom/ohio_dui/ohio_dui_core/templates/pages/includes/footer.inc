<?php
/**
 * See variables.inc for variables called on this page.
 *
 * Variables Used
 *   $menu_main
 *   $menu_main_level_2
 *   $menu)agreements
 *   $fb_link
 *   $fb_img
 *   $tw_link
 *   $tw_img
 *   $gp_link
 *   $gp_img
 *   $dc_anchor
 */
?>
<?php include('variables.inc'); ?>
<footer id="footer" class="clearfix">
  <div id="footer-section">
    <div class="content">
      <div class="footer-column">
        <div class="footer-inner-column">
        <?php if ($main_menu) { print $menu_main; } ?>
        <?php print $menu_main_level_2; ?>
        <?php print $menu_agreements; ?>
        </div>
      </div>
      <div class="footer-column">
        <div class="footer-inner-column">
          <h3 class="footer-menu-heading">CONTACT</h3>
          <p>Office:</p>
          <p>6797 N. High Street</p>
          <p>Columbus, OH 43085</p>
          <h3 class="footer-menu-heading">614.888.7274</h3>
          <p>
            <span class="footer-note">Walk-in &amp; In-Person</span>
            <span class="footer-note">Service also available</span>
          </p>
        </div>
      </div>
      <div class="footer-column">
        <div class="footer-inner-column getting-started">
          <?php if (!$logged_in): ?>
          <a href="/get-started">Get Started Now</a><br />
          <span>or</span><br />
          <a href="/user/login">LOGIN</a>
          <?php endif; ?>
          <?php if ($logged_in): ?>
          <a href="/user/<?php print $user_uid; ?>/edit">VIEW MY ACCOUNT</a>
          <?php endif; ?>
        </div>
      </div>
      <div class="footer-column">
        <div class="footer-inner-column">
          <h3 class="footer-menu-heading">GET CONNECTED</h3>
          <a href="<?php print $fb_link; ?>" id="footer-fb" target="_blank">
            <img src="<?php print $fb_img; ?>" />
          </a>
          <a href="<?php print $tw_link; ?>" id="footer-tw" target="_blank">
            <img src="<?php print $tw_img; ?>">
          </a>
          <a href="<?php print $gp_link; ?>" id="footer-gp" target="_blank">
            <img src="<?php print $gp_img; ?>">
          </a>
        </div>
      </div>
    </div>
    <div id="footer-bottom">
      <a title="Directions Counseling Group BBB Business Review" href="https://www.bbb.org/centralohio/business-reviews/marriage-family-child-individual-counselors/directions-counseling-group-in-worthington-oh-70078980/#bbbonlineclick"><img alt="Directions Counseling Group BBB Business Review" style="border: 0;" src="https://seal-centralohio.bbb.org/seals/blue-seal-96-50-directions-counseling-group-70078980.png" /></a>
      <p>OhioDuiEval is a subsidiary of <?php print $dc_anchor; ?>
      <br>Copyright 2014, Directions Counseling Group
      <br>All Rights Reserved</p>
    </div>
  </div>
</footer>
