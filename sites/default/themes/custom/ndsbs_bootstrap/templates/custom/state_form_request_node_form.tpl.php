<?php
/**
 * @file
 * state_form_request_node_form.tpl.php
 */
global $base_path;
include_once 'headerstate.tpl.php';
?>
<div class="wd_1 appointment_page">

    <div class="form-item_custum p_10">
        <?php print drupal_render($form['field_state_form_title']); ?>
    </div>
    <div class="form-item_custum">
        <?php print drupal_render($form['field_state_form_upload']); ?>
    </div>

    <div class="form-item_custum p_10 crequest_fixed">
        <?php print drupal_render($form['field_state_form_comment']); ?>
    </div>

    <div class="form-item_custum">
        <?php print drupal_render($form['actions']['submit']); ?>
    </div>

    <div style='display:none;'>
        <?php
        //  Use to render the drupal 7 form
        print drupal_render_children($form);
        ?>
    </div>
</div>
