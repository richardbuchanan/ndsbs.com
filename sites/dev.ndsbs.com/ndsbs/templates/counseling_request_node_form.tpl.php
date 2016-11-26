<?php
/**
 * @file
 * counseling_request_node_form.tpl.php
 */
global $base_path;
//echo '<pre>';
//print_r($form);
//echo '</pre>';
//die;
$path_theme = drupal_get_path('theme', 'ndsbs') . '/templates';
?>
<?php
    //  Include the theme steps header
    include_once $path_theme . '/stepsheader.tpl.php';
?>

<?php
    //  If user has attempted the counceling then no need to display the form
    //if($counseling_data->field_attempted_on == '') {
    if(true) {
?>
    <div class="wd_1">
        <div class="form-item_custum">
            <?php print drupal_render($form['field_preferred_therapist']); ?>
        </div>

        <div class="form-item_custum crequest_fixed fw_fixed">
            <?php print drupal_render($form['field_counselingrequest_comment']); ?>
        </div>

        <div class="form-item_custum crequest_fixed fw_fixed">
            <?php print drupal_render($form['actions']['submit']); ?>
        </div>

        <div style='display:none;'>
            <?php print drupal_render($form['field_assess_trans_id']); ?>
            <?php
            //  Use to render the drupal 7 form
            print drupal_render_children($form);
            ?>
        </div>
    </div>
<?php } ?>
