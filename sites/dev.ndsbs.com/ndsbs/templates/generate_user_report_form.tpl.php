<?php
/**
 * @file
 * generate_user_report_form.tpl.php
 */
global $base_url;
//echo '<pre>';
    //print_r($form);
//echo '</pre>';
?>
<h1>Generate Report</h1>
<div class="wd_1">
    <div class="form-item_custum crequest_fixed fw_fixed">
        <?php
            //$purchased_service = get_user_purchased_services();
            //print drupal_render($purchased_service);
            print drupal_render($form['report_title_cat']);
        ?>
        <span style="float: right; margin-right: 471px; margin-top: -39px;" id="report_format">
            <?php
                /*
                $options = array('attributes' => array('name' => 'single_report_view', 
                                                'class' => array('simple-dialog'), 
                                                'title' => 'Report Format', 
                                                'rel' => array('width:900;height:550;resizable:true;position:[center,60]')));
                print l(t('View Report PDF Format'), 'generate/report/format', $options);
                */
            ?>
            <a class="simple-dialog" id="newLink" rel="width:900;height:550;resizable:true;position:[center,60]" title="Report Format" name="single_report_view" href="<?php print $base_url; ?>/generate/report/format">View Report PDF Format</a>
        </span>
    </div>
    <div class="form-item_custum crequest_fixed fw_fixed">
        <?php print drupal_render($form['report_subject']); ?>
    </div>
    <div class="form-item_custum crequest_fixed fw_fixed">
        <?php print drupal_render($form['assessment_for']); ?>
    </div>
    <div class="form-item_custum crequest_fixed fw_fixed">
        <?php print drupal_render($form['reference_to']); ?>
    </div>
    <div class="form-item_custum crequest_fixed fw_fixed">
        <?php print drupal_render($form['substance_dependence']); ?>
    </div>
    <div class="form-item_custum crequest_fixed fw_fixed">
        <?php print drupal_render($form['substance_abuse']); ?>
    </div>
    <div class="form-item_custum crequest_fixed fw_fixed">
        <?php print drupal_render($form['mast_score']); ?>
    </div>
    <div class="form-item_custum crequest_fixed fw_fixed">
        <?php print drupal_render($form['recommendations_for']); ?>
    </div>
    <div class="form-item_custum crequest_fixed fw_fixed">
        <?php print drupal_render($form['mname']); ?>
    </div>
    <div class="form-item_custum crequest_fixed fw_fixed">
        <?php print drupal_render($form['file']); ?>
    </div>

    <div class="form-item_custum crequest_fixed fw_fixed">
        <?php print drupal_render($form['submit']); ?>
    </div>

    <div style='display:none;'>
    <?php
        //  Use to render the drupal 7 form
        print drupal_render_children($form);
    ?>
    </div>
</div>
<script>
    jQuery(document).ready(function() {
        jQuery('#edit-report-title-cat').unbind('change');
        jQuery("#edit-report-title-cat").bind("change",function() {
            var idVal = jQuery('#edit-report-title-cat').val();
            var newHref = '<?php print $base_url; ?>/generate/report/format/' + idVal;
            jQuery("#newLink").attr('href', newHref);
        });
    });
</script>