<?php
/**
 * @file
 * third_party_request_node_form.tpl.php
 */
global $base_path;
//echo '<pre>';
//print_r($form);
//echo '</pre>';
?>
<h1>Third Party Request</h1>
<div class="wd_1 left">

    <div class="form-item_custum fw_fixed">
        <?php print drupal_render($form['field_probation_officer_name']); ?>
    </div>
    <div class="form-item_custum fw_fixed">
        <?php print drupal_render($form['field_probation_officer_email']); ?>
    </div>
    
    <div class="form-item_custum fw_fixed">
        <?php print drupal_render($form['field_probation_officer_phone']); ?>
    </div>
    
    
    <div class="form-item_custum fw_fixed">
        <?php print drupal_render($form['field_attached_file']); ?>
    </div>
    <div class="form-item_custum fw_fixed crequest_fixed">
        <?php print drupal_render($form['field_other_details']); ?>
    </div>
    
    <div class="form-item_custum crequest_fixed">
        <?php print drupal_render($form['actions']['submit']); ?>
    </div>

    <div style='display:none;'>
        <?php
        //  Use to render the drupal 7 form
        print drupal_render_children($form);
        ?>
    </div>
</div>