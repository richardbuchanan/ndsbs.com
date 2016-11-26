<?php
/**
 * @file
 * refund_payment_node_form.tpl.php
 */
global $base_path;
//echo '<pre>';
//print_r($form);

//  field_refund_for_service
?>
<h1>Refund Requests</h1>
<div class="wd_1">
    <div class="form-item_custum fw_fixed">
        <?php 
            //$purchased_service = get_user_purchased_services();
            //print drupal_render($purchased_service);
            print drupal_render($form['field_refund_for_service']);
        ?>
    </div>
    
    <div class="form-item_custum crequest_fixed fw_fixed">
        <?php print drupal_render($form['field_refund_reason']); ?>
    </div>
    
    <div class="form-item_custum crequest_fixed fw_fixed">
        <?php print drupal_render($form['actions']['submit']); ?>
    </div>

    <div style='display:none;'>
        <?php
        //  Use to render the drupal 7 form
        print drupal_render_children($form);
        ?>
    </div>
</div>