<?php

/**
 * @file
 * Default theme implementation to display a single Drupal page.
 *
 * The doctype, html, head and body tags are not in this template. Instead they
 * can be found in the html.tpl.php template in the ./templates directory.
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
 *
 * Regions:
 * - $page['header']: Main content header of the current page.
 * - $page['help']: Dynamic help text, mostly for admin pages.
 * - $page['highlighted']: Items for the highlighted content region.
 * - $page['content']: The main content of the current page.
 * - $page['sidebar']: Items for the sidebar.
 * - $page['footer']: Items for the footer region.
 *
 * @see html.tpl.php
 */

// Sets up some variables to be used later.
$search_block = module_invoke('search', 'block_view', 'search');
?>
<header id="top-nav" class="">
  <div id="top-nav-wrapper" class="container_12 clearfix">
    <div id="branding" class="grid_4 alpha">
      <?php if ($logo): ?>
      <figure id="logo-figure"><?php print $site_logo; ?></figure>
      <?php endif; ?>
      <?php if (!$logo): ?>
      <?php print $site_name; ?>
      <?php endif; ?>
    </div>
    <?php if ($main_menu || $secondary_menu): ?>
    <div id="navbar" class="grid_8 omega">
      <nav id="main-nav" class="alpha clearfix">
        <?php print theme('links__system_main_menu', array(
          'links' => $main_menu,
          'attributes' => array(
            'id' => 'main-menu',
            'class' => array(
              'site-nav'
            )
          )
        )); ?>
      </nav>
      <nav id="secondary-nav" class="omega clearfix">
        <?php print theme('links__system_secondary_menu', array(
          'links' => $secondary_menu,
          'attributes' => array(
            'id' => 'secondary-menu',
            'class' => array(
              'site-nav'
            )
          )
        )); ?>
      </nav>
    </div>
    <?php endif ?>
  </div>
</header>

<div id="main-container" class="content-row expand">
  <section id="page-header" class="container_12 clearfix">
    <div id="page-title-search" class="clearfix">
      <div id="page-title-wrapper" class="grid_9 alpha clearfix">
        <?php print render($title_prefix); ?>
        <h1 id="page-title"><?php print $title; ?></h1>
        <?php print render($title_suffix); ?>
      </div>
      <div id="search-block-wrapper" class="grid_3 omega clearfix">
        <?php print render($search_block); ?>
      </div>
    </div>
    <?php if ($breadcrumb): ?>
    <div id="breadcrumb-wrapper" class="grid_12 alpha omega clearfix">
      <?php print $breadcrumb; ?>
    </div>
    <?php endif; ?>
  </section>

  <?php if ($messages || $page['highlighted'] || $page['help']): ?>
  <section id="highlights" class="container_12 clearfix">
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
  </section>
  <?php endif; ?>

  <section id="content-section" class="container_12 clearfix">
    <a id="main-content"></a>
    <?php if ($page['header']): ?>
    <div id="content-header" class="grid_12 alpha omega clearfix">
      <?php print render($page['header']); ?>
    </div>
    <?php endif; ?>
    <?php if ($tabs): ?>
    <div id="tabs" class="grid_12 alpha omega clearfix">
      <?php print render($tabs); ?>
    </div>
    <?php endif; ?>
    <?php if ($action_links): ?>
    <ul id="action-links" class="grid_12 alpha omega clearfix">
      <?php print render($action_links); ?>
    </ul>
    <?php endif; ?>
    <div id="content" class="clearfix">
      <?php if ($page['sidebar']): ?>
      <article id="page-content" class="grid_8 alpha clearfix">
        <?php print render($page['content']); ?>
      </article>
      <aside id="sidebar" class="grid_4 omega clearfix">
        <?php print render($page['sidebar']); ?>
      </aside>
      <?php else: ?>
      <article id="page-content" class="grid_12 alpha omega clearfix">
        <?php print render($page['content']); ?>
      </article>
      <?php endif; ?>
    </div>
    <?php print $feed_icons; ?>
  </section>
</div>

<footer id="footer" class="content-row">
  <div id="footer-section" class="container_12 clearfix">
    <div class="footer-content">
      <ul class="grid_4 alpha clearfix">
        <li>Powered by <a href="https://drupal.org" target="_blank">Drupal</a> </li>
      </ul>
      <ul class="grid_4 clearfix">
        <li></li>
      </ul>
      <ul class="grid_4 omega clearfix">
        <li>Theme by <a href="buchanandesigngroup.com" target="_blank">Buchanan Design Group</a></li>
      </ul>
    </div>
  </div>
</footer>