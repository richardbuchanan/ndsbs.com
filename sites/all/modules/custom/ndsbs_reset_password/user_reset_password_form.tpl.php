<?php
/**
 * @file
 * user_reset_password_form.tpl.php
 */
global $base_path;
?>
<h1>Forgot Password</h1>
<div class="wd_1">
    <p>Please reset your password below and login to access NDSBS services.</p>
    <div class="form-item_custum passstrength_fixed fw_fixed">
        <?php print drupal_render($form['confirm_new_password']['pass1']); ?>
        <span class="validate-fileld" id="user_conf_email"></span>
    </div>

    <div class="form-item_custum passstrength_fixed fw_fixed">
        <?php print drupal_render($form['confirm_new_password']['pass2']); ?>
        <span class="validate-fileld" id="user_password"></span>
        <span class="validate-fileld" id="user_password_match"></span>
    </div>

    <div class="form-item_custum" id="user_registration_frm_validation">
        <?php print drupal_render($form['submit']); ?>	<!-- Button to submit the form -->
    </div>

    <div style='display:none;'>
        <?php
        //  Use to render the drupal 7 form
        print drupal_render_children($form);
        ?>
    </div>
</div>