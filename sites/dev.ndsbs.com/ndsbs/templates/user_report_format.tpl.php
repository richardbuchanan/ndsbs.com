<?php
/**
 * @file
 * user_report_format.tpl.php
 */
$report_id = arg(3);
if($report_id <> '') {
    $report_data = get_report_template($report_id);
}
?>
<div id="single_report_view">
    <div class="wd_1">
        <div class="form-item_custum">
            <?php
                if($report_data <> '') {
                    print 'This is the format of the report which will be generated and the variable enclosed under XX_  _XX  will be replaced by their respective value.';
                    
                    print $report_data;
                } else {
                    print 'Please select report from Select Menu to view the report format';
                }
            ?>
        </div>
    </div>
</div>