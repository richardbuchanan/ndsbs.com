<?php

/**
 * @file
 * Default theme implementation to display a single Drupal page.
 *
 * The doctype, html, head and body tags are not in this template. Instead they
 * can be found in the html.tpl.php template in this directory.
 *
 * Available variables:
 *
 * General utility variables:
 * - $base_path: The base URL path of the Drupal installation. At the very
 *   least, this will always default to /.
 * - $directory: The directory the template is located in, e.g. modules/system
 *   or themes/bartik.
 * - $is_front: TRUE if the current page is the front page.
 * - $logged_in: TRUE if the user is registered and signed in.
 * - $is_admin: TRUE if the user has permission to access administration pages.
 *
 * Site identity:
 * - $front_page: The URL of the front page. Use this instead of $base_path,
 *   when linking to the front page. This includes the language domain or
 *   prefix.
 * - $logo: The path to the logo image, as defined in theme configuration.
 * - $site_name: The name of the site, empty when display has been disabled
 *   in theme settings.
 * - $site_slogan: The slogan of the site, empty when display has been disabled
 *   in theme settings.
 *
 * Navigation:
 * - $main_menu (array): An array containing the Main menu links for the
 *   site, if they have been configured.
 * - $secondary_menu (array): An array containing the Secondary menu links for
 *   the site, if they have been configured.
 * - $breadcrumb: The breadcrumb trail for the current page.
 *
 * Page content (in order of occurrence in the default page.tpl.php):
 * - $title_prefix (array): An array containing additional output populated by
 *   modules, intended to be displayed in front of the main title tag that
 *   appears in the template.
 * - $title: The page title, for use in the actual HTML content.
 * - $title_suffix (array): An array containing additional output populated by
 *   modules, intended to be displayed after the main title tag that appears in
 *   the template.
 * - $messages: HTML for status and error messages. Should be displayed
 *   prominently.
 * - $tabs (array): Tabs linking to any sub-pages beneath the current page
 *   (e.g., the view and edit tabs when displaying a node).
 * - $action_links (array): Actions local to the page, such as 'Add menu' on the
 *   menu administration interface.
 * - $feed_icons: A string of all feed icons for the current page.
 * - $node: The node object, if there is an automatically-loaded node
 *   associated with the page, and the node ID is the second argument
 *   in the page's path (e.g. node/12345 and node/12345/revisions, but not
 *   comment/reply/12345).
 *
 * Regions:
 * - $page['help']: Dynamic help text, mostly for admin pages.
 * - $page['highlighted']: Items for the highlighted content region.
 * - $page['content']: The main content of the current page.
 * - $page['sidebar_first']: Items for the first sidebar.
 * - $page['sidebar_second']: Items for the second sidebar.
 * - $page['header']: Items for the header region.
 * - $page['footer']: Items for the footer region.
 *
 * @see template_preprocess()
 * @see template_preprocess_page()
 * @see template_process()
 * @see html.tpl.php
 *
 * @ingroup themeable
 */
?>
<?php hide($page['content']['system_main']); ?>
<?php print render($page['header']); ?>


<div id="page-container">
  <div id="main-container" class="container">
    <div class="row">
      <a id="content"></a>

      <div<?php print $left_col_attributes; ?>>

        <?php if ($breadcrumb): ?>
          <div<?php print $breadcrumb_attributes; ?>>
            <?php print $breadcrumb; ?>
          </div>
        <?php endif; ?>

        <?php if ($tabs = render($tabs)): ?>
          <a href="/node/1670/edit" title="Edit front page content" class="front-page-edit"><span class="glyphicon glyphicon-cog" aria-hidden="true"></span></a>
        <?php endif; ?>

        <div id="front-carousel" class="container-fluid">
          <?php print render($page['field_carousel']); ?>
        </div>

        <?php print render($title_prefix); ?>
        <meta itemscope itemprop="mainEntityOfPage"  itemType="https://schema.org/WebPage" itemid="https://www.ndsbs.com"/>
        <h1 class="title hidden" id="page-title" itemprop="headline"><?php print $site_name; ?></h1>
        <?php print render($title_suffix); ?>

        <?php if ($messages): ?>
          <div class="container">
            <?php print $messages; ?>
          </div>
        <?php endif; ?>

        <div id="professional-reviews">
          <?php print views_embed_view('professional_reviews', $display_id = 'block'); ?>
        </div>

        <div id="front-welcome" class="container">
          <div id="front-welcome-wrapper" class="col-xs-12 col-sm-12 col-md-9">
            <div id="front-welcome-message" class="row">
              <div id="welcome-image" class="col-xs-4 col-sm-3 col-md-3">
                <a href="/staff"><?php print render($page['field_welcome_image']); ?></a>
                <h4><a href="/staff">Brian T. Davis, CEO, LISW-S, SAP</a></h4>
              </div>
              <div id="welcome-message" class="col-xs-12 col-sm-9 col-md-9">
                <h2>Welcome to New Directions</h2>
                <?php print render($page['field_welcome_message']); ?>
              </div>
            </div>

            <div id="faq-videos" class="row">
              <div class="col-xs-12">
                <h2>Get Answers to Common Questions Here</h2>
              </div>

              <div class="col-xs-12 col-sm-12 col-md-4">
                <h3>What's the cost?</h3>
                <div class="embed-responsive embed-responsive-16by9">
                  <iframe class="embed-responsive-item" src="//www.youtube.com/embed/i5sqJNFFwqc?rel=0" allowfullscreen=""></iframe>
                </div>
              </div>

              <div class="col-xs-12 col-sm-12 col-md-4">
                <h3>Will it be accepted?</h3>
                <div class="embed-responsive embed-responsive-16by9">
                  <iframe class="embed-responsive-item" src="//www.youtube.com/embed/Mdcl1teQG3A?rel=0" allowfullscreen=""></iframe>
                </div>
              </div>

              <div class="col-xs-12 col-sm-12 col-md-4">
                <h3>How's it work?</h3>
                <div class="embed-responsive embed-responsive-16by9">
                  <iframe class="embed-responsive-item" src="//www.youtube.com/embed/H8ULIw0Zgaw?rel=0" allowfullscreen=""></iframe>
                </div>
              </div>
            </div>

            <div id="our-team-services" class="row">
              <div id="our-team" class="col-xs-12 col-sm-6 col-md-6">
                <h2><a href="/staff">Our Team</a></h2>
                <a href="/staff"><?php print render($page['field_our_team_image']); ?></a>
                <?php print render($page['field_our_team_message']); ?>
              </div>
              <div id="our-services" class="col-xs-12 col-sm-6 col-md-6">
                <h2><a href="/our-services">Our Services</a></h2>
                <a href="/our-services"><?php print render($page['field_our_services_image']); ?></a>
                <?php print render($page['field_our_services_message']); ?>
              </div>
            </div>

          </div>

          <div id="front-testimonials" class="col-xs-12 col-sm-12 col-md-3">
            <h2>Check My State</h2>
            <div id="states-map">
              <?php $theme = drupal_get_path('theme', 'bootstrap_ndsbs'); ?>
              <a href="/state-map">
                <img src="<?php print $theme ?>/css/images/state-map.jpg" style="max-width: 100%;" />
              </a>
            </div>
            <h2>Testimonials</h2>
            <?php print views_embed_view('testimonials', $display_id = 'block_1'); ?>
            <div id="bbb">
              <a href="https://www.bbb.org/centralohio/business-reviews/marriage-family-child-individual-counselors/directions-counseling-group-in-worthington-oh-70078980/#bbbonlineclick">
                <?php print render($page['field_better_business_bureau']); ?>
              </a>
            </div>
            <div id="payment-cards">
              <?php print render($page['field_accepted_payments']); ?>
            </div>
          </div>
          <div id="front-recent-blogs" class="col-xs-12">
            <?php print render($page['content']); ?>
          </div>
        </div>
        <div id="sub-footer">
          <div class="container">
            <div class="col-md-12">
              <div class="row">
                <div id="choose-us" class="col-xs-12 col-sm-4 col-md-4">
                  <h2>Why Clients Choose Us?</h2>
                  <?php print render($page['field_choose_us']); ?>
                </div>
                <div id="front-main-menu" class="col-xs-12 col-sm-4 col-md-4">
                  <h2>Assessments</h2>
                  <?php print render($page['front_main_menu']); ?>
                </div>
                <div id="contact-us" class="col-xs-12 col-sm-4 col-md-4">
                  <h2>Contact Us</h2>
                  <ul id="front-contact-menu">
                    <li class="mail"><a href="mailto:info@ndsbs.com">info@ndsbs.com</a>, <a href="mailto:support@ndsbs.com">support@ndsbs.com</a></li>
                    <li class="phone">1-800-671-8589</li>
                    <li class="fax">614.888.3239</li>
                    <li class="facebook"><a href="https://www.facebook.com/onlinealcoholdrugassessment" target="_blank">Facebook</a></li>
                    <li class="twitter"><a href="https://twitter.com/DUIevaluation" target="_blank">Twitter</a></li>
                    <li class="google"><a href="https://plus.google.com/100444795766134346734" rel="publisher" target="_blank">Google+</a></li>
                    <li class="contact"><a href="https://www.ndsbs.com/contact">Map</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <footer id="site-footer">
    <div class="container">
      <div class="row">
        <div id="footer-left" class="col-xs-12 col-sm-12 col-md-8">
          <?php print render($page['footer_left']); ?>
        </div>
        <div id="footer-right" class="col-xs-12 col-sm-12 col-md-4">
          <?php print render($page['footer_right']); ?>
        </div>
      </div>
    </div>
  </footer>
</div>
