<?php
/**
 * @file
 * report_format_node_form.tpl.php
 */
global $base_path;
?>
<h1>Generate Report</h1>
<div class="wd_1">
    <div class="form-item_custum">
        <?php print drupal_render($form['title']); ?>
    </div>
    <?php
        /*
    ?>
        <div class="report-body">
            <?php print drupal_render($form['body']); ?>
        </div>

        <div class="form-item_custum block mt_10">
            <?php print drupal_render($form['field_use_my_signature']); ?>
            <br />
            OR
            <br />
            Upload a new signature
        </div>

        <div class="form-item_custum block mt_10">
            <?php print drupal_render($form['field_therapist_signature']); ?>
        </div>
    <?php
        */
    ?>
    <div class="form-item_custum block mt_10">
        <?php print drupal_render($form['field_report_upload_pdf']); ?>
    </div>
    
    <div class="form-item_custum">
        <?php print drupal_render($form['actions']['submit']); ?>
        <?php //print drupal_render($form['actions']['preview']); ?>
    </div>
    
    <div style='display:none;'>
        <?php
        //  Use to render the drupal 7 form
        print drupal_render_children($form);
        ?>
    </div>
</div>