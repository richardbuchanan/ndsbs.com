<?php
/**
 * @file
 * user_login.tpl.php
 */
global $base_path;
global $base_url;
//echo '<pre>';
//print_r($form);
?>
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
<h1>Login</h1>
<div class="wd_1 login_item_custum">

    <div class="form-item_custum">
        <?php print drupal_render($form['name']); ?>
    </div>

    <div class="form-item_custum">
        <?php print drupal_render($form['pass']); ?>
    </div>

    <div class="form-item_custum pl_fixed">
        <?php print drupal_render($form['remember_me']); ?>
    </div>

    <div class="form-item_custum pl_fixed">
        <?php print drupal_render($form['actions']['submit']); ?>	<!-- Button to submit the form -->
    </div>

    <div style='display:none;'>
        <?php
        //  Use to render the drupal 7 form
        print drupal_render_children($form);
        ?>
    </div>

    <div class="form-item_custum pl_fixed">
        <?php print l(t('Forgot your Password?'), 'user/password'); ?>
    </div>
	
	<div class="form-item_custum pl_fixed">
        <p>
			Or 
		</p>
		<?php print l(t('Register a new account.'), 'user/register'); ?>
    </div>
	
</div>
