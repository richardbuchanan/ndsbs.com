<?php
/**
 * @file
 * user_email_report_form.tpl.php
 */
global $base_path;
$path_theme = drupal_get_path('theme', 'ndsbs') . '/templates';
//echo '<pre>';
//print_r($form);
//echo '<pre>';

?>

<?php
    //  Include the theme steps header
    include_once $path_theme . '/stepsheader.tpl.php';
?>

<div class="wd_1">

    <div class="form-item_custum fw_fixed">
        <?php print drupal_render($form['mail_to']); ?>
    </div>

    <div class="form-item_custum fw_fixed">
        <?php print drupal_render($form['mail_subject']); ?>
    </div>
    
    <div class="form-item_custum fw_fixed emailmsg">
        <?php print drupal_render($form['mail_body']); ?>
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