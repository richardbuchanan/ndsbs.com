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
 * - $is_front: TRUE if the current page is the front page.
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
 *
 * Regions:
 * - $page['header']: Main content header of the current page.
 * - $page['main_menu']: Main menu region of the site.
 * - $page['user_menu']: User menu region of the site.
 * - $page['highlighted']: Items for the highlighted content region.
 * - $page['help']: Dynamic help text, mostly for admin pages.
 * - $page['content']: The main content of the current page.
 * - $page['sidebar']: Items for the sidebar.
 * - $page['footer']: Items for the footer region.
 *
 * @see html.tpl.php
 */
?>
<div id="branding" class="clearfix">
  <?php print $breadcrumb; ?>
  <?php print render($title_prefix); ?>
  <?php if ($title): ?>
    <h1 class="page-title"><?php print $title; ?></h1>
  <?php endif; ?>
  <?php print render($title_suffix); ?>
</div>

<div id="page-container">
  <?php if ($primary_local_tasks): ?>
    <div class="tabs-primary clearfix">
      <?php print render($primary_local_tasks); ?>
    </div>
  <?php endif; ?>
  <?php if ($secondary_local_tasks): ?>
    <div class="tabs-secondary clearfix">
      <?php print render($secondary_local_tasks); ?>
    </div>
  <?php endif; ?>

  <div id="content-section" class="container_12 clearfix">
    <div class="element-invisible"><a id="main-content"></a></div>

    <?php if ($messages): ?>
      <div id="site-messages" class="grid_12 alpha omega clearfix">
        <?php print $messages; ?>
      </div>
    <?php endif; ?>
  
    <?php if ($page['highlighted']): ?>
      <div id="highlighted" class="grid_12 alpha omega clearfix">
        <?php print render($page['highlighted']); ?>
      </div>
    <?php endif; ?>
  
    <?php if ($page['help']): ?>
      <div id="help" class="grid_12 alpha omega clearfix">
        <?php print render($page['help']); ?>
      </div>
    <?php endif; ?>

    <?php if ($action_links): ?>
      <ul id="action-links" class="grid_12 alpha omega clearfix">
        <?php print render($action_links); ?>
      </ul>
    <?php endif; ?>

    <div id="content" class="grid_12 alpha omega">
      <div id="page-content">
        <?php print render($page['content']); ?>
      </div>
    </div>
  </div>
</div>
<footer id="footer" class="clearfix">
  <div id="footer-section">
    <div class="content">
      <a href="/admin/dashboard" title="Ohio DUI Eval Administration Dashboard">
        <img src="<?php print render($logo); ?>" id="site-logo" />
      </a>
    </div>
    <div id="footer-bottom">
    <?php
      $dc_prefix = '<a href="';
      $dc_suffix = '" target="_blank">';
      $dc_url = 'http://www.directionscounseling.com/';
      $dc_text = 'Directions Counseling Group</a>';
      function copyright_year() {
        $current_year = date("Y");
        if ($current_year == '2013') {
          print '2013';
        }
        else {
          print '2013-' . date("Y");
        }
      }
      $dc_anchor = $dc_prefix.$dc_url.$dc_suffix.$dc_text; ?>
      <p>OhioDuiEval is a subsidiary of <?php print $dc_anchor; ?>
      <br>Copyright <?php copyright_year(); ?>, Directions Counseling Group
      <br>All Rights Reserved</p>
    </div>
  </div>
</footer>