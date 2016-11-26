<?php
/**
 * @file
 * user_profile_form.tpl.php
 */
global $base_path;
//echo '<pre>';
//print_r($form);
?>
<h1>Express Mail</h1>
<div class="wd_1">

    <div class="form-item_custum request2 mt_m35">
        <?php
            //  Function call to get the shipping form
            print change_user_shipping_address();
        ?>
    </div>

</div>