<?php

/**
 * @file
 * UIkit's theme implementation to display a single Drupal page.
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
 * - $page['navigation']: Items for the UIkit navbar component.
 * - $page['header']: Items for the header region, including the site slogan.
 * - $page['highlighted']: Items for the highlighted content region.
 * - $page['help']: Dynamic help text, mostly for admin pages.
 * - $page['content']: The main content of the current page.
 * - $page['sidebar_first']: Items for the first sidebar.
 * - $page['sidebar_second']: Items for the second sidebar.
 * - $page['footer']: Items for the footer region.
 *
 * Original front page node: 1670
 *
 * @see template_preprocess()
 * @see template_preprocess_page()
 * @see template_process()
 * @see uikit_preprocess_page()
 * @see uikit_process_page()
 * @see html.tpl.php
 *
 * @ingroup uikit_themeable
 */
?>
<header<?php print $header_attributes; ?>>
  <nav<?php print $navbar_attributes; ?>>
    <div class="uk-navbar-left">
      <a href="#offcanvas" uk-toggle uk-navbar-toggle-icon class="uk-navbar-toggle uk-navbar-toggle-icon uk-icon uk-hidden@l"></a>

      <?php if ($logo): ?>
        <a href="<?php print $front_page; ?>" id="site-logo" class="uk-navbar-item uk-logo" title="<?php print t('Home'); ?>" rel="home">
          <img class="uk-margin-small-right" src="<?php print $logo; ?>" alt="<?php print t('Home'); ?>" />
        </a>
      <?php endif; ?>
    </div>

    <div class="uk-navbar-right">
      <?php print render($company_info); ?>
      <?php if ($main_menu): ?>
        <?php print render($navbar_primary); ?>
      <?php endif; ?>

      <?php if ($secondary_menu): ?>
        <?php print render($navbar_secondary_compact); ?>
      <?php endif; ?>
    </div>

  </nav>

  <?php if ($page['header'] || ($title && !$is_front)): ?>
    <div id="header-below">
      <?php print render($title_prefix); ?>
      <?php if ($title && !$is_front): ?>
        <div id="page-title-wrapper" uk-grid>
          <div class="uk-width-auto">
            <div class="block uk-width-auto ie9-gradient">
              <h1 id="page-title" class="uk-article-title"><?php print $title; ?></h1>

              <?php if ($page_description): ?>
                <div class="page-description"><?php print $page_description; ?></div>
              <?php endif; ?>
            </div>
          </div>
        </div>
      <?php endif; ?>
      <?php print render($title_suffix); ?>

      <?php print render($page['header']); ?>
    </div>
  <?php endif; ?>
</header>

<?php if ($page['highlighted']): ?>
  <div<?php print $highlighted_attributes; ?>>
    <?php print render($page['highlighted']); ?>
  </div>
<?php endif; ?>

<div<?php print $page_container_attributes; ?>>
  <div class="uk-grid" uk-grid>

    <div<?php print $content_attributes; ?>>
      <?php if ($tabs): ?>
        <?php print render($tabs); ?>
      <?php endif; ?>

      <?php if ($messages): ?>
        <?php print $messages; ?>
      <?php endif; ?>

      <?php print render($page['help']); ?>

      <?php if ($action_links): ?>
        <ul class="action-links uk-subnav uk-subnav-pill"><?php print render($action_links); ?></ul>
      <?php endif; ?>

      <?php print render($page['content']); ?>
      <?php print $feed_icons; ?>
    </div>

    <?php if ($page['sidebar_first']): ?>
      <div<?php print $sidebar_first_attributes; ?>>
        <?php print render($page['sidebar_first']); ?>
      </div>
    <?php endif; ?>

    <?php if ($page['sidebar_second']): ?>
      <div<?php print $sidebar_second_attributes; ?>>
        <?php print render($page['sidebar_second']); ?>
      </div>
    <?php endif; ?>

  </div>

  <div class="uk-grid" uk-grid>
    <?php if ($page['footer']): ?>
      <div id="footer" class="uk-width-1-1">
        <?php print render($page['footer']); ?>
      </div>
    <?php endif; ?>
  </div>

</div>

<?php if ($dashboard_modal): ?>
  <?php print render($dashboard_modal); ?>
<?php endif; ?>

<?php if ($offcanvas_primary || $offcanvas_secondary): ?>
  <div id="offcanvas" uk-offcanvas="mode: push; overlay: true" class="uk-offcanvas">
    <div class="uk-offcanvas-bar ie9-gradient">
      <?php print render($offcanvas_primary); ?>
      <?php print render($offcanvas_secondary); ?>
    </div>
  </div>
<?php endif; ?>

<!-- Modal container -->
<div id="modal-overflow" uk-modal="center: true"></div>
