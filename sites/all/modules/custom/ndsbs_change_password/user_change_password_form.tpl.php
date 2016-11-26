<?php
/**
 * @file
 * user_reset_password_form.tpl.php
 */
global $base_path;
//echo '<pre>';
//print_r($form);
?>
<h1>Change Password</h1>
<div class="wd_1">

    <div class="form-item_custum">
        <?php print drupal_render($form['current_pass']); ?>
    </div>
    <div class="form-item_custum passstrength_fixed fw_fixed">
        <?php print drupal_render($form['account']['pass']['pass1']); ?>
    </div>

    <div class="form-item_custum">
        <?php print drupal_render($form['account']['pass']['pass2']); ?>
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
