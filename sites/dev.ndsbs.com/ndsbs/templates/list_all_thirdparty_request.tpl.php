<?php
/**
 * @file
 * list_all_client_paperwork.tpl.php
 */
global $base_url;
?>
<?php
if($_REQUEST['search_text'] <> '' || $_REQUEST['assessment_status'] <> '') {
    $val = get_third_party_request_custom_search();
} else {
    //  function defined to load the content type third party request
    $val = get_all_thirdparty_request();
}
//print_r($val);
//echo $val[0]->nid;
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
<h1>All Third Party Requests</h1>
<div  class="field_fixed full_width left">
    <?php print search_third_party_request(); ?>
</div>
<div class="table_wrap">
    <table class="schedule_table">
        <tr class="bkg_b">
            <th>Probation Officer Name</th>
            <th>Contact Details</th>
            <th>Attached file</th>
            <th>Other Details</th>
            <th>Status</th>
            <th>Action</th>
        </tr>
        <?php
            $record_not_found = count($result);
            foreach($result as $rec) {
        ?>
            <tr>
                <td>
                    <?php print $rec->field_probation_officer_name['und'][0]['value']; ?>
                </td>
                <td>
                    Email- <?php print $rec->field_probation_officer_email['und'][0]['value']; ?>
                    <br />
                    Phone- <?php print $rec->field_probation_officer_phone['und'][0]['value']; ?>
                </td>
                <td>
                    <?php
                        $explode = explode('.', $rec->field_attached_file['und'][0]['filename']);
                        $file_extension = $explode[1];
                        print '<a href="'.$base_url.'/sites/ndsbs.com/files/thirdparty_request/'.$rec->field_attached_file['und'][0]['filename'].'" type="application/'.$file_extension.'; length='.$rec->field_attached_file['und'][0]['filesize'].'">'.$rec->field_attached_file['und'][0]['filename'].'</a>';
                        //print l($rec->field_attached_file['und'][0]['filename'], 'request/thirdparty/download/' . $rec->field_attached_file['und'][0]['filename']);
                    ?>
                </td>
                <td>
                    <?php
                        print $rec->field_other_details['und'][0]['value'];
                    ?>
                </td>
                <td>
                    <?php
                        if($rec->field_status_changed_by['und'][0]['value'] == 0) {
                            print 'Pending';
                        } else {
                            $user_info = user_load($rec->field_status_changed_by['und'][0]['value']);
                            $name = $user_info->field_first_name['und'][0]['value'] . ' ' . $user_info->field_last_name['und'][0]['value'];
                            print 'Closed by ' . $name;
                        }
                    ?>
                </td>
                <td>
                    <?php
                        if($rec->field_status_changed_by['und'][0]['value'] == 0) {
                            $options = array('attributes' => array('class' => 'closer_icon'));
                            print l(t('Close Request'), 'request/thirdparty/update/'.$rec->nid, $options);
                        } else {
                            print '<ul class="tr_actions">
                                     <li class="close_icon">Closed</li>
                                   </ul>';
                        }
                    ?>
                </td>
            </tr>
        <?php
            }
        ?>
            <?php
                if($record_not_found <= 0) {
                    ?>
                        <tr><td class="txt_ac" colspan="6">Record not found</td></tr>
                    <?php
                }
            ?>
    </table>
</div>
<?php
    $total = 10;
    print $output = theme('pager', array('quantity' => $total));
?>