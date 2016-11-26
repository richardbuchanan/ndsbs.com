<?php
/**
 * @file
 * user_profile_form.tpl.php
 */
global $base_path;
//echo '<pre>';
//print_r($form);
$path_theme = drupal_get_path('theme', 'ndsbs') . '/templates';
?>

<!--<h1>PROOF OF SERVICE LETTER</h1>-->

<?php
    //  Include the theme steps header
    include_once $path_theme . '/stepsheader.tpl.php';
?>

<div class="wd_1">

    <div class="form-item_custum fw_fixed">
        <?php //print drupal_render($form['field_assessment']); ?>
    </div>
    <div class="form-item_custum fw_fixed">
        <?php print drupal_render($form['field_title']); ?>
    </div>
    <br/>
    <div class="form-item_custum">
        <?php print drupal_render($form['field_upload']); ?>
    </div>
    
    <div class="form-item_custum">
        <?php //    print drupal_render($form['field_paperwork_user_reference']); ?>
    </div>
    
    <div class="form-item_custum">
        <?php // FOR ADMIN print drupal_render($form['field_status']); ?>
    </div>
    
    <div class="form-item_custum">
        <?php // FOR ADMIN print drupal_render($form['field_paperwork_note']); ?>
    </div>
    
    <br/>
    <div class="form-item_custum crequest_fixed">
        <?php print drupal_render($form['actions']['submit']); ?>
    </div>

    <div style='display:none;'>
        <?php print drupal_render($form['field_assessment']); ?>
        <?php
        //  Use to render the drupal 7 form
        print drupal_render_children($form);
        ?>
    </div>
</div>