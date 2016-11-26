<?php
/**
 * @file
 * list_all_client_stateform_invoice_requested.tpl.php
 */
global $base_url;
?>
<?php
if($_REQUEST['search_text'] <> '' || $_REQUEST['assessment_status'] <> '') {
    $val = get_requested_stateform_custom_search();
} else {
    //  function defined to load the content type paper-work
    $val = get_all_stateform_invoice_requested();
}

$nid_array = array();
foreach ($val as $data) {
    $nid_array[] = $data->nid;
}

//  load the node data
$result = node_load_multiple($nid_array);
//echo '<pre>';
//    print_r($result);
//echo '</pre>';
?>
<h1>Forms Requests</h1>
<div  class="field_fixed full_width left">
    <?php print search_requested_stateform(); ?>
</div>
<div class="table_wrap">
    <table class="schedule_table">
        <tr class="bkg_b">
            <th>Client</th>
            <th>Requested Service
                <!--
                <br />
                <div class="subcontent">
                    <div class="subcontent-left">
                        Title
                    </div>
                    <div class="subcontent-right">
                        File
                    </div>
                </div>
                -->
            </th>
            <th>Counselor</th>
            <th>Payment</th>
            <th>Action</th>
        </tr>
        <?php
            $total_count = count($result);
            foreach($result as $rec) {
                $user_info = user_load($rec->uid);
                //echo '<pre>';
                //print_r($user_info);
        ?>
            <tr>
                <td>
                    <?php $name = $user_info->field_first_name['und'][0]['value'] . ' ' . $user_info->field_middle_name['und'][0]['value'] . ' ' . $user_info->field_last_name['und'][0]['value']; ?>
                    <b>Name-</b> <?php print l(t($name), 'user/'.$user_info->uid.'/edit'); ?>
                    <br />
                    <b>Phone-</b> <?php print $user_info->field_phone['und'][0]['value']; ?>
                    <br />
                    <b>Email-</b> <?php print $user_info->mail; ?>
                </td>
                <td>
                    <?php
                        $count = count($rec->field_state_form_title['und']);
                        for($i=0; $i<$count; $i++) {
                            //print $rec->field_state_form_title['und'][0]['value'] . '-' . $rec->field_state_form_upload['und'][0]['filename'];
                            //print '<br />';
                            print '<a href="' . $base_url . '/sites/ndsbs.com/files/stateform/' . $rec->field_state_form_upload['und'][$i]['filename'].'">' . $rec->field_state_form_title['und'][$i]['value'] . '</a>';
                            print '<br />';
                    ?>
                        <!--
                        <div class="subcontent">
                            <div class="subcontent-left">
                                <?php //print $rec->field_state_form_title['und'][$i]['value']; ?>
                            </div>
                            <div class="subcontent-right">
                                <?php //print $rec->field_state_form_upload['und'][$i]['filename']; ?>
                            </div>
                        </div>
                        <br />
                        -->
                    <?php
                        }
                    ?>
                </td>
                <td>
                    <?php
                        $therapist = user_load($rec->field_report_updated_by['und'][0]['value']);
                        print $name = $therapist->field_first_name['und'][0]['value'] . ' ' . $therapist->field_last_name['und'][0]['value'];
                    ?>
                </td>
                <td>
                    <?php
                        if($rec->field_state_form_payment_status['und'][0]['value'] == 1) {
                            print 'Paid';
                        } else {
                            print 'Not Paid';
                        }
                        print '<br />';
                        print '$' . $rec->field_state_form_amount['und'][0]['value'];
                        print '<br />';
                        
                        $invoice_user = user_load($rec->field_invoice_created_by['und'][0]['value']);
                        $name = $invoice_user->field_first_name['und'][0]['value'];
                        print 'In voice created by- ' . $name;
                    ?>
                </td>
                <td>
                    <!--<a href="<?php //print '/request/stateform/createinvoice/'.$rec->nid; ?>?width=500&height=400" class="colorbox-load">Create Invoice</a>-->
                    <?php
                        if($rec->field_state_form_payment_status['und'][0]['value'] == 1) {
                    ?>
                            <a href="<?php print $base_url ?>/users/stateform/report/<?php print $rec->uid; ?>/nid/<?php print $rec->nid; ?>">
                                <ul class="tr_actions">
                                    <li class="createinvoice_icon">Create Report</li>
                                </ul>
                            </a>
                    <?php
                            if($rec->field_report_state_form['und'][0]['value'] <> '') {
                                $fname = $rec->field_report_state_form['und'][0]['value'];
                                $file_name_path = 'public://reports/'.$fname;
                                print l(t($fname), $base_url.'/download/report', array('query' => array('file_name_path' => $file_name_path)));
                            }
                        }
                        /*
                        elseif($rec->field_state_form_status['und'][0]['value'] == 0 && $rec->field_state_form_payment_status['und'][0]['value'] != 0) {
                            print '<ul class="tr_actions">
                                    <li class="inprocess_icon">In-Process</li>
                                </ul>';
                        }
                        */
                        else {
                            
                    ?>
                            <a href="javascript:void(0)" onclick="opencreate_invoice('<?php print $rec->nid; ?>');">
                                <?php
                                    print '<ul class="tr_actions">
                                            <li class="createinvoice_icon">Resend Invoice</li>
                                        </ul>';
                                ?>
                            </a>
                    <?php
                        }
                    ?>
                </td>
            </tr>
        <?php
            }
            if($total_count <= 0) {
        ?>
                <tr>
                    <td colspan="5" class="txt_ac">Record not found.</td>
                </tr>
        <?php
            }
        ?>
    </table>
</div>
<?php
    $total = 3;
    //pager_default_initialize($total, 1, $element = 0);
    print $output = theme('pager', array('quantity' => $total));
?>

<script>
    function opencreate_invoice(id) {
        myWindow=window.open('<?php print $base_url; ?>/request/stateform/createinvoice/'+id,'createinvoice','scrollbars=1,width=400,height=500');
        myWindow.focus();
    }
</script>
