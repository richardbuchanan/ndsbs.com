<?php
/**
 * @file
 * user_list_verification_document.tpl.php
 */
global $base_url;
?>
<?php
$val = get_all_impdoc_acc_verification_document();

$nid_array = array();
foreach ($val as $data) {
    $nid_array[] = $data->nid;
}

//  load the node data
$result = node_load_multiple($nid_array);
//echo '<pre>';
//print_r($result);
//echo '</pre>';
?>
<!--changes made by sachin maithani on 27/5/2013-->
<!--<h1>Verification Document</h1>-->
<h1>Necessary Document</h1>
<div  class="field_fixed full_width left">
    <?php //print search_requested_stateform(); ?>
</div>
<div class="table_wrap">
    <table class="schedule_table">
        <tr class="bkg_b">
            <th>Client</th>
            <th>Document Type</th>
            <th>Uploaded Document</th>
            <th>Status</th>
            <th>Comments</th>
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
                        if($rec->type == 'important_document') {
                            print 'Important Document';
                        }
                        if($rec->type == 'account_verification') {
                            print 'Account Verification';
                        }
                    ?>
                </td>
                <td>
                    <?php
                        if($rec->type == 'important_document') {
                            $explode = explode('.', $rec->field_pr_upload['und'][0]['filename']);
                            $file_extension = $explode[1];
                            print '<a href="'.$base_url.'/sites/ndsbs.com/files/paperwork/' . $rec->field_pr_upload['und'][0]['filename'] . '" type="application/' . $file_extension . '; length=' . $rec->field_pr_upload['und'][0]['filesize'] . '" target="_blank" class="details_icon">'.$rec->field_tittle['und'][0]['value'].'</a>';
                        }
                        if($rec->type == 'account_verification') {
                            $explode = explode('.', $rec->field_pa_upload['und'][0]['filename']);
                            $file_extension = $explode[1];
                            print '<a href="'.$base_url.'/sites/ndsbs.com/files/paperwork/' . $rec->field_pa_upload['und'][0]['filename'] . '" type="application/' . $file_extension . '; length=' . $rec->field_pa_upload['und'][0]['filesize'] . '" target="_blank" class="details_icon">'.$rec->field_pa_title['und'][0]['value'].'</a>';
                        }
                    ?>
                </td>
                <td>
                    <?php
                        if($rec->type == 'important_document') {
                            if($rec->field_imp_status['und'][0]['value'] == 1) {
                                print 'Verified';
                            } else {
                                print 'Not Verified';
                            }
                        }
                        if($rec->type == 'account_verification') {
                            if($rec->field_acc_status['und'][0]['value'] == 1) {
                                print 'Verified';
                            } else {
                                print 'Not Verified';
                            }
                        }
                    ?>
                </td>
                
                <td>
                    <?php
                        if($rec->type == 'important_document') {
                            print $rec->field_pr_description['und'][0]['value'];
                        }
                        if($rec->type == 'account_verification') {
                            print $rec->field_pa_description['und'][0]['value'];
                        }
                    ?>
                </td>

                <td>
                    <?php
                        if($rec->type == 'important_document') {
                            //  verify/document/nid/%/%
                            if($rec->field_imp_status['und'][0]['value'] == 1) {
                                print '<a href="'.$base_url.'/verify/document/nid/'.$rec->nid.'/imp/0" class="edit_icon">Not Verify</a>';
                            } else {
                                print '<a href="'.$base_url.'/verify/document/nid/'.$rec->nid.'/imp/1" class="edit_icon">Verify</a>';
                            }
                            if (user_access('delete necessary documents')) {
                              print '<a href="'.$base_url.'/node/'.$rec->nid.'/delete?destination=list/verification/document" class="delete_icon">Delete</a>';
                            }
                        }
                        if($rec->type == 'account_verification') {
                            if($rec->field_acc_status['und'][0]['value'] == 1) {
                                print '<a href="'.$base_url.'/verify/document/nid/'.$rec->nid.'/acc/0" class="edit_icon">Not Verify</a>';
                            } else {
                                print '<a href="'.$base_url.'/verify/document/nid/'.$rec->nid.'/acc/1" class="edit_icon">Verify</a>';
                            }
                            if (user_access('delete necessary documents')) {
                              print '<a href="'.$base_url.'/node/'.$rec->nid.'/delete?destination=list/verification/document" class="delete_icon">Delete</a>';
                            }
                        }
                    ?>
                </td>

            </tr>
        <?php
            }
            if($total_count <= 0) {
        ?>
                <tr>
                    <td class="txt_ac" colspan="5">
                        Record not found.
                    </td>
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
