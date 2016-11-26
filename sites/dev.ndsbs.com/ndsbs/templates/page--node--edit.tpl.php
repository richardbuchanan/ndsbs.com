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
<?php
global $user;
global $base_url;
/*
echo '<pre>';
    print_r($user);
echo '</pre>';
*/
//  custom image path defined
$path_image = $base_path . path_to_theme() . '/' . 'images';
?>
<?php
/*
if($user->roles[6] == 'client' || $user->uid <= 0) { ?>
    <div class="layout fix_layout">
<?php
}
*/
?>

<?php
if((arg(1) != 'questionnaire') && (arg(2) != 'questionnaire')) {
?>
<?php if($user->uid <= 0) { ?>
<div class="layout fix_layout">
  <?php } else { ?>
  <div class="layout">
    <?php } ?>



    <?php
    //  header included
    include_once 'header.tpl.php';
    ?>
    <!--contents starts here-->
    <div class="contents <?php if ($user->uid <= 0) { ?>fix_contents<?php } ?>">
      <div class="contents_inner">
        <?php
        if($user->uid > 0) {
          if(in_array('super admin', $user->roles) || in_array('therapist', $user->roles) || in_array('staff admin', $user->roles) || in_array('developer', $user->roles)) {
            //  left included   If logged in user is superadmin, Staff admin, therapist
            include_once 'left_admin.tpl.php';
          } else {
            //  left included   If logged in user is client
            include_once 'left.tpl.php';
          }
        } else {
          //  Include right panel block
          include_once 'right_block.tpl.php';
        }
        ?>
        <!--right column starts here-->
        <div class="right_column">
          <?php //print $breadcrumb; ?>
          <?php print render($tabs); ?>
          <?php //print render($page['help']); ?>
          <?php if ($action_links): ?>
            <ul class="action-links"><?php print render($action_links); ?></ul>
          <?php endif; ?>
          <?php //if (arg(0) != 'view' && arg(1) != 'assessment' && arg(2) != 'status'): ?>
          <?php print $messages; ?>
          <?php //endif; ?>
          <?php print render($page['content']); ?>
        </div>
        <!--right column ends here-->
      </div>
    </div>
    <!--contents ends here-->
    <?php if (isset($user->roles[6]) && $user->roles[6] == 'client' || $user->uid <= 0) { ?>
  </div>
<?php } ?>


  <div class="footer">
    <?php
    //  footer included
    include_once 'footer.tpl.php';
    ?>
  </div>
  <?php
  } else {
    ?>
    <div class="layout fix_layout">
      <?php
      //  header included
      include_once 'header.tpl.php';
      ?>
      <!--contents starts here-->
      <div class="contents">
        <div class="contents_inner">
          <!--right column starts here-->
          <div class="questionnaire">
            <?php //print $breadcrumb; ?>
            <?php //print render($tabs); ?>
            <?php //print render($page['help']); ?>
            <?php if ($action_links): ?>
              <ul class="action-links"><?php print render($action_links); ?></ul>
            <?php endif; ?>
            <?php
            if($messages <> '') {
            ?>
            <div class="message_fixed" style="padding:0">
              <div class="message_inner">
                <?php print $messages; ?>
                <?php } ?>
                <?php print render($page['content']); ?>
                <?php
                if($messages <> '') {
                ?>
              </div>
            </div>
          <?php
          }
          ?>
          </div>
          <!--right column ends here-->
        </div>
      </div>
      <!--contents ends here-->
      <div class="footer">
        <?php
        //  footer included
        include_once 'footer.tpl.php';
        ?>
      </div>
    </div>
  <?php
  }
  ?>
