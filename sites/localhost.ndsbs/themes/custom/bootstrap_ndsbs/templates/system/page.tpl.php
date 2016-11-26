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
<div id="offcanvas-overlay" class="body-overlay"></div>

<div id="page-container">
  <?php print render($page['header']); ?>

  <?php if ($page['jumbotron']): ?>
    <?php print render($page['jumbotron']); ?>
  <?php endif; ?>

  <div id="main-container" class="container<?php if ($page['navigation_sidebar'] || arg(0) == 'admin'): ?>-fluid<?php endif; ?>">
    <div class="row row-offcanvas row-offcanvas-right">
      <a id="content"></a>

      <?php if ($page['navigation_sidebar']): ?>
        <div<?php print $nav_col_attributes; ?>>
          <div class="sidebar hidden-print">
            <?php print render($page['navigation_sidebar']); ?>
          </div>
        </div>
      <?php endif; ?>

      <div<?php print $left_col_attributes; ?>>
        <?php global $user; ?>
        <?php if ($page['navigation_sidebar'] && $user->uid): ?>
          <p id="toggle-dashboard" class="pull-right visible-xs visible-sm">
            <button type="button" class="btn btn-primary btn-xs" data-toggle="offcanvas" title="Open Dashboard">
              <span class="toggle-dashboard-title">Go To My Dashboard</span>
            </button>
          </p>
        <?php endif; ?>

        <?php if (!drupal_is_front_page()): ?>
          <?php print render($title_prefix); ?>
          <meta itemscope itemprop="mainEntityOfPage"  itemType="https://schema.org/WebPage" itemid="https://www.ndsbs.com/blog"/>
          <?php if ($title): ?>
            <h1 class="title" id="page-title" itemprop="headline"><?php print $title; ?></h1>
          <?php else: ?>
            <h1 class="title hidden" id="page-title" itemprop="headline"><?php print $site_name; ?></h1>
          <?php endif; ?>
          <?php print render($title_suffix); ?>
        <?php endif; ?>

        <?php if ($breadcrumb): ?>
          <div<?php print $breadcrumb_attributes; ?>>
            <?php print $breadcrumb; ?>
          </div>
        <?php endif; ?>

        <?php if ($tabs = render($tabs)): ?>
          <nav id="local-tasks" class="navbar">
            <?php print render($tabs); ?>
          </nav>
        <?php endif; ?>

        <?php if ($messages): ?>
          <?php print $messages; ?>
        <?php endif; ?>

        <?php print render($page['help']); ?>

        <?php if ($action_links): ?>
          <div id="action-links" class="panel panel-default">
            <div class="panel-body">
              <?php print render($action_links); ?>
            </div>
          </div>
        <?php endif; ?>

        <?php print render($page['content']); ?>
      </div>

      <?php if ($page['sidebar']): ?>
        <div<?php print $right_col_attributes; ?>>
          <div class="sidebar hidden-print">
            <?php print render($page['sidebar']); ?>
          </div>
        </div>
      <?php endif; ?>
    </div>
  </div>

  <footer id="site-footer">
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-8">
          <?php print render($page['footer_left']); ?>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4">
          <?php print render($page['footer_right']); ?>
        </div>
      </div>
    </div>
  </footer>
</div>
