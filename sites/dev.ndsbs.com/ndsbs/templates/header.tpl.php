<?php
/**
 * @file
 * header.tpl.php
 */
global $base_url;
$user_info = user_load($user->uid);

if((isset($user_info->roles[6]) && $user_info->roles[6] == 'client') || (isset($user_info->roles[1]) && $user_info->roles[1] == 'anonymous user')) {
    $view_status = 1;
}
else {
    $view_status = 0;
}

if (isset($user_info->field_first_name['und'])) {
  $user_name = $user_info->field_first_name['und'][0]['value'];
}
?>
<!--hreader starts here-->

<?php //if (!$touchscreen): ?>
  <div class="<?php if($view_status) print 'header'; else print 'headernew' ?>">
    <div class="header_inner"> <a href="<?php print $base_url; ?>" title="New Direction" class="logo"></a>
      <div class="rt_link">
        <?php if ($user->uid > 0) { ?>
          <div class="jewel_container">
            <div class="ndjewel">
              <a href="" class="ndrequests_jewel"><span><?php print $user_name; ?></span></a>
              <div id="ndrequests_layout">
                <ul class="jewel_content">
                  <?php
                  if(isset($user->roles[6]) && $user->roles[6] != 'client') {
                    ?>
                    <li><a href="<?php print $base_url; ?>/admin/dashboard">Dashboard</a></li>
                  <?php
                  }
                  ?>
                  <li><a href="<?php print $base_url; ?>/user/<?php print $user->uid; ?>">My Account</a></li>
                  <li><a href="<?php print $base_url; ?>/user/logout">Sign Out</a></li>
                </ul>
              </div>
            </div>
          </div>
        <?php } else { ?>
          <div class="rt_top">
            <div class="contact_col">
              <p>Call Us</p>
              <span class="contact_phone"><?php print variable_get('SA_ADMIN_PHONE'); ?></span>
            </div>
            <div class="user_col">
              <a href="<?php print $base_url; ?>/user/login" title="Log In" class="upper_c lbrown_btn">
                <span class="login_icon">log in</span>
              </a>
              <a href="<?php print $base_url; ?>/user/register" title="Register" class="upper_c lbrown_btn ml_5">
                <span class="register_icon">register</span>
              </a>
            </div>
          </div>
        <?php } ?>
      </div>
      <?php if ($view_status || arg(0) == 'testimonials'): ?>
        <nav class="nav">
          <?php print drupal_render($main_menu_expanded); ?>
        </nav>
      <?php endif; ?>
    </div>
  </div>
  <!--hreader ends here-->
<?php //else: ?>
  <!-- <header class="navbar navbar-static" role="banner">
    <div class="container">
      <div class="navbar-header">
        <button class="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target="#ndsbs-navbar" aria-controls="ndsbs-navbar" aria-expanded="false">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a href="<?php //print $base_url; ?>" title="New Directions" class="navbar-brand">
          <img src="<?php //print $logo; ?>" alt="New Directions" class="navbar-logo" />
        </a>
      </div>
      <nav id="ndsbs-navbar" class="collapse navbar-collapse">
        <?php //if ($user->uid > 0): ?>
          <ul class="nav navbar-nav">
            <?php //if(isset($user->roles[6]) && $user->roles[6] != 'client'): ?>
              <li><a href="<?php //print $base_url; ?>/admin/dashboard">Dashboard</a></li>
            <?php //endif; ?>
            <li><a href="<?php //print $base_url; ?>/user/<?php //print $user->uid; ?>">My Account</a></li>
            <li><a href="<?php //print $base_url; ?>/user/logout">Sign Out</a></li>
          </ul>
        <?php //else: ?>
          <ul class="menu">
            <?php //$path = current_path(); ?>
            <?php //$login_active = ''; ?>
            <?php //$register_active = ''; ?>

            <?php //if ($path == 'user/login'): ?>
              <?php //$login_active = ' class="active"'; ?>
            <?php //endif; ?>
            <?php //if ($path == 'user/register'): ?>
              <?php //$register_active = ' class="active"'; ?>
            <?php //endif; ?>
            <li>
              <a href="<?php //print $base_url; ?>/user/login"<?php //print $login_active; ?>>Log In</a>
            </li>
            <li>
              <a href="<?php //print $base_url; ?>/user/register"<?php //print $register_active; ?>>Register</a>
            </li>
          </ul>
        <?php //endif; ?>
        <?php //if ($view_status || arg(0) == 'testimonials'): ?>
          <?php //print drupal_render($main_menu_expanded); ?>
        <?php //endif; ?>
      </nav>
      <div class="navbar-brand-contact">
        <span>Call Us <?php //print variable_get('SA_ADMIN_PHONE'); ?></span>
      </div>
    </div>
  </header>
  <!--hreader ends here-->
<?php //endif; ?>
