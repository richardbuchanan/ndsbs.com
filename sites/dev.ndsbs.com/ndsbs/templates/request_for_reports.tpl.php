<?php
    if($_REQUEST['reptype'] == 'statefrm') {
        $path_theme = drupal_get_path('theme', 'ndsbs') . '/templates';
        include_once $path_theme . '/headerstate.tpl.php';
    } else {
?>
    <h1>
        Request A report
    </h1>
<?php
    }
?>
<?php
/**
 * @file
 * request_for_reports.tpl.php
 */
global $base_url;

//  Notary status defined on 29-03-2013 mail dated on 29-03-2013
$notary_status = 'inactive';        //  Change $notary_status from inactive to active to show the notary
//  Notary status defined on 29-03-2013

$report_nid = arg(3);
//  Empty Cart in users come from left panel and there is no argument
if(arg(3) == '' && arg(4) == '' && arg(5) == '') {
    empty_cart_all_data();
}

?>
<?php
//  Render
print drupal_render(get_sub_reports_form());

//  Get the items from the cart
$cart_data = get_saved_cart_items();

$taxonomy_main = taxonomy_get_tree(2);
foreach($taxonomy_main as $taxo_data) {
    $main_texonomy_term[] = $taxo_data->tid;
}
?>
<div class="table_wrap">
    <div class="bkg_c">Requests</div>
    <table class="schedule_table">
        <tr class="bkg_b">
<!--            <th>Assessment</th>-->
            <th>Report Type</th>
            <?php
            if($notary_status == 'active') {
            ?>
                <th>Notary Request Amount 
                    <?php
                        //  Get the notary amount
                        $notary_id = 18;
                        $notary_data = taxonomy_term_load($notary_id);
                        $notary_amount = $notary_data->field_other_service_amount['und'][0]['value'];
                        print '$' . $notary_amount;
                    ?>
                </th>
            <?php
            }
            ?>
            <th>Amount</th>
            <th>Action</th>
        </tr>
        <?php
            //  Get subreport tid for paid and not paid service
            $data_subreport_term = check_user_purchased_subreport_term($report_nid, 1, 1);
//            echo '<pre>';
//                print_r($data_subreport_term);
//            echo '</pre>';
            $sub_purchased_term = array();
            $subreport_orderdate = array();
            foreach($data_subreport_term as $data_subreport) {
                $sub_purchased_term[] = $data_subreport->termid;
                $subreport_orderdate[$data_subreport->termid] = $data_subreport->order_date;
            }
            
            //  get users transaction information
            $data = get_purchased_items($report_nid, 1, 0);
            $term_id_assessment = $data[0]->termid;
            
            //get_purchased_assessment_information();
            
            $assessment_node = get_assessment_information();
            $nid_array = array();
            foreach($assessment_node as $data) {
                $nid_array[] = $data->nid;
            }
            
            //  load the node data
            $result_node = node_load_multiple($nid_array);
            foreach($result_node as $node_data) {
                $result = $node_data;
            }
//            echo '<pre>';
//            print_r($result);
//            echo '</pre>';
//            
        foreach($cart_data as $carddata) {
            $term_data = taxonomy_term_load($carddata->tid);
            //$total_amount = $total_amount + 0 + $carddata->notary_amount;
            //            print '<pre>';
            //            print_r($term_data);
            //            print '</pre>';

            //  Check used for main report
            if(in_array($carddata->tid, $main_texonomy_term)) {
        ?>
                <tr>
                    <!--
                    <td>
                        <?php
                            /*
                            switch($term_id_assessment) {
                                case $result->field_primary_service['und'][0]['tid']:
                                    $report_title = $result->field_assessment_title['und'][0]['value'];
                                    break;
                                case $result->field_rush_order_service_one['und'][0]['tid']:
                                    $report_title = $result->field_rush_order_title_one['und'][0]['value'];
                                    break;
                                case $result->field_rush_order_service_two['und'][0]['tid']:
                                    $report_title = $result->field_rush_order_title_two['und'][0]['value'];
                                    break;
                                case $result->field_rush_order_service_three['und'][0]['tid']:
                                    $report_title = $result->field_rush_order_title_three['und'][0]['value'];
                                    break;
                                case $result->field_rush_order_service_four['und'][0]['tid']:
                                    $report_title = $result->field_rush_order_title_four['und'][0]['value'];
                                    break;
                            }
                            print $report_title;
                            $main_assessment_name = $report_title;
                            */
                        ?>
                    </td>
                    -->
                    <td>
                        <?php
                            //print $result->field_assessment_title['und'][0]['value'];
                            print 'Assessment Report';
                        ?>
                    </td>
                    <?php
                    if($notary_status == 'active') {
                    ?>
                        <td>
                            <select name="notary_type" class="select_box saveintocartcls" id="saveintocart<?php print $i; ?>">
                                <option value="">Select</option>
                            <option value="1|<?php print $carddata->cid; ?>|0|<?php print $notary_amount; ?>">Include</option>
                            <option value="0|<?php print $carddata->cid; ?>|0|0">Not Include</option>
                            </select>
                        </td>
                    <?php
                    }
                    ?>
                    <td class="bold">$<span id="sub_current_amount<?php print $carddata->cid; ?>"><?php print number_format(($carddata->notary_amount), 2); ?></span></td>
                    <td></td>
                </tr>
                <!--
                <tr class="bkg_b">
                    <td>Sub Report</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                -->
        <?php
            }
        }
        ?>
        <?php
        $i = 0;
        $total_amount = 0;
        $count = count($cart_data);
        foreach($cart_data as $carddata) {
            $term_data = taxonomy_term_load($carddata->tid);
//                        print '<pre>';
//                        print_r($term_data);
//                        print '</pre>';
            //  Check used for main report -> not include in the list
            if(!in_array($carddata->tid, $main_texonomy_term)) {
        ?>
            <tr>
                <!--
                <td>
                    <?php //print $main_assessment_name; ?>
                </td>
                -->
                <td>
                    <?php //print $term_data->name . ' (SR)'; ?>
                    <?php
                        if($term_data->vocabulary_machine_name == 'stateform_vocab') {
                            print $term_data->field_stateformtitle['und'][0]['value'];
                            $subreport_amount = $term_data->field_stateformamount['und'][0]['value'];
                        } else {
                            print $term_data->name;
                    ?>
                    <p>
                        (
                        Amount : <b>$<?php print $term_data->field_other_service_amount['und'][0]['value']; ?></b>
                        <?php
                            if(in_array($carddata->tid, $sub_purchased_term)) {
                                $already_paid = 1;
                                print '(Already Paid) on ' . date('M d, Y', $subreport_orderdate[$carddata->tid]);
                            } else {
                                $already_paid = 0;
                                print '(Not Paid)';
                            }

                            //  If client is already paid for sub service then make that service price to 0
                            if($already_paid != 1) {
                                $subreport_amount = $term_data->field_other_service_amount['und'][0]['value'];
                            } else {
                                $subreport_amount = 0;
                            }
                        ?>
                        )
                        <br>
                    </p>
                    <?php
                        }
                    ?>
                </td>
                
                <?php
                if($notary_status == 'active') {
                ?>
                    <td>
                        <?php
                            //  Show dd selected
                            if('1|'.$carddata->cid.'|'.$term_data->field_other_service_amount['und'][0]['value'].'|'.$notary_amount
                                    == '1|'.$carddata->cid.'|'.$term_data->field_other_service_amount['und'][0]['value'].'|'.$carddata->notary_amount) {
                                $selected1 = 'selected="selected"';
                            } elseif('0|'.$carddata->cid.'|'.$term_data->field_other_service_amount['und'][0]['value'].'|0.00'
                                    == '0|'.$carddata->cid.'|'.$term_data->field_other_service_amount['und'][0]['value'].'|'.$carddata->notary_amount) {
                                $selected2 = 'selected="selected"';
                            } else {
                                $selected1 = '';
                                $selected2 = '';
                            }
                        ?>
                        <select name="notary_type" class="select_box saveintocartcls" id="saveintocart<?php print $i; ?>">
                            <option value="">Select</option>
                            <option value="1|<?php print $carddata->cid; ?>|<?php print $subreport_amount; ?>|<?php print $notary_amount; ?>" <?php print $selected1; ?>>Include</option>
                            <option value="0|<?php print $carddata->cid; ?>|<?php print $subreport_amount; ?>|0" <?php print $selected2; ?>>Not Include</option>
                        </select>
                    </td>
                <?php
                }
                ?>
                <td class="bold">$<span id="sub_current_amount<?php print $carddata->cid; ?>"><?php print number_format(($subreport_amount + $carddata->notary_amount), 2); ?></span></td>
                <td>
                    <a href="<?php print $base_url; ?>/report/cart/delete/cid/<?php print $carddata->cid; ?>/nid/<?php print arg(3); ?><?php if($_REQUEST['type'] <> '') print '?type=state';  ?>" class="remove_icon">Remove</a>
                </td>
            </tr>
        <?php
                $total_amount = $total_amount + $subreport_amount + $carddata->notary_amount;
            } else {
                $total_amount = $total_amount + $carddata->notary_amount;
            }
            $i++;
        }
        ?>
        <tr class="bkg_c">
            <td>Payable Amount</td>
            <?php
            if($notary_status == 'active') {
            ?>
                <td></td>
            <?php
            }
            ?>
            <td>$<span id="total_amount_id"><?php print number_format($total_amount, 2); ?></span></td>
            <td></td>
        </tr>

    </table>
</div>

<div class="mb_20">
    <h2>All letters and reports will be accessible directly from user account once prepared– click on "<?php print l(t('Download My letter'), $base_url . '/user/requested/reports/356') ?>".</h2>
    <br />
    If you need a letter or report by regular mail choose from options below, purchase and provide the mailing address 
    <br />
    <label for="address"  class="left mr_10">Shipping Method -</label>
    <input type="radio" name="shipping_method" id="shipping_method" value="1" /> Express Mail
    &nbsp;&nbsp;&nbsp;
    <input type="radio" name="shipping_method" id="shipping_method" value="0" /> Regular U.S. Mail  (Free)
    <div class="request2">        
        <?php
            //  Function call to get the shipping form
            print get_user_shipping_address_form();
        ?>  

    <a href="javascript:void(0);" class="brown_btn brown_inbtn" id="makepaymentnow">Make Payment Now</a>
    </div>
</div>
<script>
    jQuery(document).ready(function() {
        jQuery('.saveintocartcls').change(function() {
            //  alert(this.value);
            var postdata = this.value;
            var data = postdata.split("|");
            var notary_status = data[0];
            var cart_id = data[1];
            var service_amount = data[2];
            var notary_amount = data[3];
            ajaxRequest(notary_status, cart_id, service_amount, notary_amount);
        });
        
        //  function called to save the shipping data
        jQuery('#makepaymentnow').unbind('click');
        jQuery('#makepaymentnow').bind('click',function() {
            var shipping;
            //var address = jQuery('#shippingaddress').val();
            var adrs = jQuery('#edit-user-shipping-address').val();
            var cty = jQuery('#edit-user-shipping-city').val();
            var state = jQuery('#edit-user-shipping-state').val();
            var zip = jQuery('#edit-user-shipping-zip').val();
            //  Concatenate the complete address
            var address = adrs + ' ' + cty + ' ' + state + ' ' + zip;
            //alert(address);

            var shipMethod = jQuery('#shipping_method').val();

            //  Original Service
            var original_service = jQuery('#get_main_reports').val();

            /*
            if(original_service == '') {
                alert('Please select Original Service.');
                return false;
            }
            */

            if($('#shipping_method').is(":checked")) {
                if(address == '') {
                    alert('Please enter shipping address.');
                    return false;
                } else {
                    shipping = 1;
                }
            } else {
                //alert('Please select shipping method.');
                //return false;
                shipping = 0;
            }

            makeAjaxRequest(address, shipping);
        });// Bind function closed

        //  Hide the dropdown Primary Service Dropdown
        jQuery('.form-item-get-main-reports').hide();

    });// Main function closed

    function ajaxRequest(notary_status, cart_id, service_amount, notary_amount) {
        // Fire the ajax request
        jQuery.ajax({
            url: '<?php print $base_url;  ?>/reports/terminfo',
            type: 'post',
            data: { notary_status: notary_status, cart_id: cart_id, service_amount: service_amount, notary_amount:notary_amount },
            success: function(response) {
                //alert(response);
                var response_data = jQuery.parseJSON(response);
                var subamount = response_data.sub_total;
                var amount = response_data.total;
                jQuery('#sub_current_amount'+cart_id).html(subamount + '.00');
                jQuery('#total_amount_id').html(amount + '.00');
                //  alert(subamount);
                //  alert(amount);
            }
        });//  Ajax function closed
    }
    
    //  Function used in for saving the shipping adddress
    function makeAjaxRequest(address, shipping) {
        // Fire the ajax request
        jQuery.ajax({
            url: '<?php print $base_url; ?>/reports/saveaddress',
            type: 'post',
            data: { address: address, shipping: shipping },
            success: function(response) {
                //alert(response);
                if(response == 'success') {
                    window.location.href = '<?php print $base_url;  ?>/user/payment';
                }
            }
        });//  Ajax function closed
    }
</script>