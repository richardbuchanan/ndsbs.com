<?php
/**
 * @file
 * paypal_payment_success.tpl.php
 */
//  Empty the cart in case of order is placed
delete_cart_items();
?>
<div class="container">
    <h1 class="h_bt_bod upper_c">Payment Received</h1>
    <div class="wd_1 left">
        <p>
            <b class="t2">
                <?php
                    global $base_url;
                    $type = $_REQUEST['type'];
                    if($type == 'assessment') {
                        $data_left_asment = get_purchased_questionnaire_assessment_list_leftpanel();
                        $i = 1;
                        foreach($data_left_asment as $dataleft_asment) {
                            //  http://dev.newndsbs.com/questionnaire/start/259/trans/15
                            if($i == 1) {
                    ?>
                                <a href="<?php print $base_url . '/questionnaire/start/'.$dataleft_asment['assessment_node_id'].'/trans/'.$dataleft_asment['transaction_id'].'/termid/'.$dataleft_asment['term_id']; ?>" class="brown_btn">Begin Your Questionnaire</a>
                    <?php
                            }
                            $i++;
                        }
                        //  print l(t('Begin Your Questionnaire'), $base_url . '/user/complete/resume/questionnaire');
                    }
                ?>
            </b>
        </p>
    </div>
</div>
