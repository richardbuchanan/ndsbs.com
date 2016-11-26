<?php
/**
 * See variables.inc for variables called on this page.
 *
 * Variables Used
 *   $logged_in
 *   $user_name
 *   $assessment_link
 *   $documents_link
 *   $account_link
 *   $transactions_link
 *   $logout_link
 *   $is_admin
 */
?>
<?php include('variables.inc'); ?>
<?php global $base_url; ?>
<header id="top-nav" class="clearfix">
  <div id="top-nav-wrapper">
    <div id="client-wrapper">
      <?php if (!$logged_in): ?>
      <div id="login">
        <a href="<?php print $base_url; ?>/user/login">Login</a>
      </div>
      <?php endif; ?>
      <?php if ($logged_in): ?>
      <div id="client-menu">
        <h3 id="client-menu-header"><?php print $user_name; ?>
          <ul class="client-menu-list">
            <?php if ($is_client || $is_temp_user): ?>
              <li><?php print $assessment_link; ?></li>
            <?php endif; ?>
            <?php if (!$is_client && !$is_temp_user): ?>
              <li><?php print $staff_dash_link; ?></li>
            <?php endif; ?>
            <li><?php print $account_link; ?></li>
            <?php if ($is_client): ?>
              <li><?php print $transactions_link; ?></li>
            <?php endif; ?>
            <li><?php print $logout_link; ?></li>
          </ul>
        </h3>
      </div>
      <?php endif; ?>
    </div>
    <div id="branding-wrapper">
      <div id="branding">
      <?php if ($logo): ?>
        <figure id="logo-figure">
          <?php print $site_logo; ?>
        </figure>
      <?php endif; ?>
      <?php if (!$logo): ?>
      <?php print $site_name; ?>
      <?php endif; ?>
      </div>

      <div id="navbar">
        <nav id="main-nav">
        <?php if ($page['main_menu']): ?>
        <?php print render($page['main_menu']); ?>
        <?php endif; ?>
        </nav>
      </div>
    </div>
  </div>
</header>