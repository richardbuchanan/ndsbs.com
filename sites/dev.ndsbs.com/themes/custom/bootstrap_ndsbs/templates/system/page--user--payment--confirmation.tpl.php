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
<?php print render($page['header']); ?>

<div id="main-container" class="container">
  <div class="row">
    <a id="content"></a>

    <div<?php print $left_col_attributes; ?>>
      <?php print render($title_prefix); ?>
      <meta itemscope itemprop="mainEntityOfPage"  itemType="https://schema.org/WebPage" itemid="https://www.ndsbs.com/blog"/>
      <?php if ($title): ?>
        <h1 class="title" id="page-title" itemprop="headline"><?php print $title; ?></h1>
      <?php else: ?>
        <h1 class="title hidden" id="page-title" itemprop="headline"><?php print $site_name; ?></h1>
      <?php endif; ?>
      <?php print render($title_suffix); ?>

      <?php if ($messages): ?>
        <?php print $messages; ?>
      <?php endif; ?>

      <h2>Thank you for your order!</h2>
      <h4>Order number: <?php print $payment['order_id']; ?></h4>
      <p>You will receive an order confirmation shortly at <?php print $payment['user_email']; ?></p>

      <div class="row">
        <div class="col-sm-12">
          <h2>Order Details</h2>
          <table class="table table-striped table-responsive sticky-enabled">
            <thead>
              <tr>
                <th>Assessment</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
            <tr class="assessment-row">
              <td class="assessment-title"><?php print $payment['assessment']; ?></td>
              <td class="assessment-total">$ <?php print $payment['cost']; ?></td>
            </tr>
            <tr class="rush-service-row">
              <td class="rush-service-title text-right">Rush Service Amount:</td>
              <td class="rush-service-amount">$ <?php print $payment['rush_cost']; ?></td>
            </tr>
            <tr class="cart-total-row">
              <td class="cart-total-title text-right">Total Amount:</td>
              <td class="cart-total-amount">$ <?php print $payment['total_cost']; ?></td>
            </tr>
            </tbody>
          </table>
          <a href="/questionnaire/start/trans" class="btn btn-primary">Begin My Assessment</a>

          <!-- Google Code for NDSBS Conversion Page -->
          <script type="text/javascript">
            /* <![CDATA[ */
            var google_conversion_id = 1017904011;
            var google_conversion_language = "en";
            var google_conversion_format = "3";
            var google_conversion_color = "ffffff";
            var google_conversion_label = "PLjyCJWdoQwQi_ev5QM";
            var google_conversion_value = <?php print $payment['total_cost']; ?>;
            var google_conversion_currency = "USD";
            var google_remarketing_only = false;
            /* ]]> */
          </script>
          <script type="text/javascript" src="//www.googleadservices.com/pagead/conversion.js">
          </script>
          <noscript>
            <div style="display:none;">
              <img height="1" width="1" style="border-style:none;" alt="" src="//www.googleadservices.com/pagead/conversion/1017904011/?value=<?php print $payment['total_cost']; ?>&amp;currency_code=USD&amp;label=PLjyCJWdoQwQi_ev5QM&amp;guid=ON&amp;script=0"/>
            </div>
          </noscript>
        </div>
      </div>

    </div>

    <?php if ($page['sidebar']): ?>
      <div<?php print $right_col_attributes; ?>>
        <div class="sidebar hidden-print hidden-xs hidden-sm">
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
