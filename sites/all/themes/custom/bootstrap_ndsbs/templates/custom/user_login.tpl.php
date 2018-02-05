<?php
/**
 * @file
 * user_login.tpl.php
 */
global $base_path;
global $base_url;
?>
<style>
  #local-tasks { display: none; }
</style>
<span itemprop="name" style="display: none">User Login</span>
<div id="breadcrumb" style="display: none;" itemscope itemtype="http://schema.org/BreadcrumbList">
  <ol>
    <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
      <a itemprop="item" href="<?php print $base_url; ?>">
        <span itemprop="name">NDSBS</span>
      </a>
      <meta itemprop="position" content="1" />
    </li>
    <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
      <a itemprop="item" href="<?php print $base_url; ?>/user/login">
        <span itemprop="name">Login</span>
      </a>
      <meta itemprop="position" content="2" />
    </li>
  </ol>
</div>
<p>New here? <?php print l(t('Create an NDSBS account.'), 'user/register'); ?></p>
<?php print drupal_render($form['name']); ?>
<?php print drupal_render($form['pass']); ?>
<p>Forgot password? <?php print l(t('Reset password.'), 'user/password'); ?></p>
<?php print drupal_render($form['remember_me']); ?>
<?php print drupal_render($form['actions']['submit']); ?>

<div style='display:none;'>
  <?php
  //  Use to render the drupal 7 form
  print drupal_render_children($form);
  ?>
</div>
