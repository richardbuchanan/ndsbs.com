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
<div id="front-page-container">
  <div id="top-wrapper">
    <div class="container">
      <div class="row first">
        <?php print render($page['header']); ?>
      </div>

      <?php print render($title_prefix); ?>
      <meta itemscope itemprop="mainEntityOfPage"  itemType="https://schema.org/WebPage" itemid="https://www.ndsbs.com"/>
      <h1 class="title hidden" id="page-title" itemprop="headline"><?php print $site_name; ?></h1>
      <?php print render($title_suffix); ?>
    </div>
  </div>

  <div id="professional-reviews">
    <div class="container">
      <div class="row">
        <?php print views_embed_view('professional_reviews', $display_id = 'block'); ?>
      </div>
    </div>
  </div>

  <div id="faq-videos">
    <div class="container">
      <div class="row">
        <?php print render($faq_videos); ?>
      </div>
    </div>
  </div>

  <div id="main-container">
    <a id="content"></a>

    <?php if ($messages): ?>
      <div class="container">
        <?php print $messages; ?>
      </div>
    <?php endif; ?>
  </div>
</div>

<div id="sub-footer">
  <div class="container">
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
          <li class="fax">614-888-3239</li>
          <li class="facebook"><a href="https://www.facebook.com/onlinealcoholdrugassessment" target="_blank">Facebook</a></li>
          <li class="twitter"><a href="https://twitter.com/DUIevaluation" target="_blank">Twitter</a></li>
          <li class="google"><a href="https://plus.google.com/100444795766134346734" rel="publisher" target="_blank">Google+</a></li>
          <li class="contact"><a href="https://www.ndsbs.com/contact">Map</a></li>
        </ul>
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
        <?php print $site_seals; ?>
      </div>
    </div>
  </div>
</footer>
