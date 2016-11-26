<?php
/**
 * @file
 * Zen theme's implementation to display a single Drupal page.
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
 * - $secondary_menu_heading: The title of the menu used by the secondary links.
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
 * - $page['header']: Items for the header region.
 * - $page['navigation']: Items for the navigation region, below the main menu (if any).
 * - $page['help']: Dynamic help text, mostly for admin pages.
 * - $page['highlighted']: Items for the highlighted content region.
 * - $page['content']: The main content of the current page.
 * - $page['sidebar_first']: Items for the first sidebar.
 * - $page['sidebar_second']: Items for the second sidebar.
 * - $page['footer']: Items for the footer region.
 * - $page['bottom']: Items to appear at the bottom of the page below the footer.
 *
 * @see template_preprocess()
 * @see template_preprocess_page()
 * @see zen_preprocess_page()
 * @see template_process()
 */
?>
<?php global $user, $base_url; ?>
<?php if (arg(0) != 'user'): ?>
  <span itemprop="name" style="display: none"><?php print drupal_get_title(); ?></span>
  <div id="breadcrumb" style="display: none;" itemscope itemtype="http://schema.org/BreadcrumbList">
    <ol>
      <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
        <a itemprop="item" href="<?php print $base_url; ?>">
          <span itemprop="name">NDSBS</span>
        </a>
        <meta itemprop="position" content="1"/>
      </li>
      <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
        <a itemprop="item" href="<?php print $base_url . '/' . current_path(); ?>">
          <span itemprop="name"><?php print drupal_get_title(); ?></span>
        </a>
        <meta itemprop="position" content="2"/>
      </li>
    </ol>
  </div>
<?php endif; ?>

<?php if ((arg(1) != 'questionnaire') && (arg(2) != 'questionnaire')): ?>
  <div class="layout<?php if (!$user->uid): ?> fix_layout<?php endif; ?>">
    <?php include_once 'header.tpl.php'; ?>

    <!--contents starts here-->
    <div class="contents<?php if (!$user->uid): ?> fix_contents<?php endif; ?>">
      <div class="contents_inner">

        <?php if ($user->uid): ?>
          <?php if (in_array('super admin', $user->roles) || in_array('therapist', $user->roles) || in_array('staff admin', $user->roles) || in_array('developer', $user->roles)): ?>
            <?php include_once 'left_admin.tpl.php'; ?>
          <?php //endif; ?>
          <?php elseif (in_array('client', $user->roles)): ?>
            <?php include_once 'left.tpl.php'; ?>
          <?php endif; ?>

        <?php //if (!path_is_admin(current_path()) && in_array('client', $user->roles)): ?>
        <?php else: ?>
          <?php include_once 'right_block.tpl.php'; ?>
        <?php endif; ?>

        <!--right column starts here-->
        <div class="right_column">
          <?php print render($tabs); ?>

          <?php if ($action_links): ?>
            <ul class="action-links"><?php print render($action_links); ?></ul>
          <?php endif; ?>

          <?php print $messages; ?>

          <?php print render($page['content']); ?>
        </div>
        <!--right column ends here-->

      </div>
    </div>
    <!--contents ends here-->

    <div class="footer">
      <?php include_once 'footer.tpl.php'; ?>
    </div>
  </div>

<?php else: ?>
  <div class="layout fix_layout">
    <?php include_once 'header.tpl.php'; ?>

    <!--contents starts here-->
    <div class="contents">
      <div class="contents_inner">
        <!--right column starts here-->
        <div class="questionnaire">
          <?php if ($action_links): ?>
            <ul class="action-links"><?php print render($action_links); ?></ul>
          <?php endif; ?>

          <?php if ($messages): ?><div class="message_fixed" style="padding:0"><div class="message_inner"><?php print $messages; ?><?php endif; ?>

          <?php print render($page['content']); ?>

          <?php if ($messages <> ''): ?></div></div><?php endif; ?>
        </div>
        <!--right column ends here-->

      </div>
    </div>
    <!--contents ends here-->

    <div class="footer">
      <?php include_once 'footer.tpl.php'; ?>
    </div>
  </div>
<?php endif; ?>
