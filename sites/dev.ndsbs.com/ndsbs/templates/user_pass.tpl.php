<?php
/**
 * @file
 * user_pass.tpl.php
 */
global $base_path;
global $base_url;
/*
echo '<pre>';
print_r($form);
die;
*/

?>
<span itemprop="name" style="display: none">Password Reset</span>
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
        <span itemprop="name">Password Reset</span>
      </a>
      <meta itemprop="position" content="2" />
    </li>
  </ol>
</div>
<div class="">
    <?php
        if(arg(2) != 'active' && arg(2) != 'expire') {
    ?>
    <h1 class="h_bt_bod upper_c pset">PASSWORD RESET</h1>
    <div class="wd_1 login_item_custum pass_item_custum">
        
        <div class="form-item_custump">
            To reset your password, enter your email address below. Upon submitting your email address, 
            you will receive a password reset email. Please follow the directions in the email. If you do 
            not receive an email or if you cannot remember your email address, then please contact our admin 
            staff to help you login to your account.
            <br /><br /><br />
        </div>
        
        <div class="form-item_custum">
            <?php print drupal_render($form['name']); ?>
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
    </div>
    <?php
    } elseif(arg(2) == 'expire') {
        ?>
        <h1 class="h_bt_bod upper_c">Account Activation Link Has Expired</h1>
        <div class="wd_1 login_item_custum pass_item_custum">
            <div class="form-item_custum">
                It seems that you are trying to use a account activation link which has expired. Please use the form below to request a new activation link. It will be sent to the email address with which you have registered.
                <br /><br /><br />
            </div>

            <div class="form-item_custum">
                <?php print drupal_render($form['name']); ?>
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
        </div>
        <?php
    } elseif(arg(2) == 'active') {
    ?>
        <h1 class="h_bt_bod upper_c">Account Already Activated</h1>
    <?php
    }
    ?>
</div>