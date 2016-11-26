<?php
/**
 * @file
 * list_all_client_counseling_request.tpl.php
 */
?>
<?php
//  function defined to load the content type counseling request
$val = get_counseling_request_info();
$nid_array = array();
foreach ($val as $data) {
    $nid_array[] = $data->nid;
}

//  load the node data
$result = node_load_multiple($nid_array);
//echo '<pre>';
//print_r($result);
?>
<h1>Counseling Requests</h1>
<div class="table_wrap">
    <table class="schedule_table">
        <tr class="bkg_b">
            <th>Client</th>
            <th>Preferred Counselor</th>
            <th>No. of Sessions</th>
            <th>Availability</th>
            <th>Comments</th>
            <th>Action</th>
        </tr>
        <?php
            foreach($result as $rec) {
                $user_info = user_load($rec->uid);
                //echo '<pre>';
                //print_r($user_info);
        ?>
            <tr>
                <td>
                    <?php $name = $user_info->field_first_name['und'][0]['value'] . ' ' . $user_info->field_middle_name['und'][0]['value'] . ' ' . $user_info->field_last_name['und'][0]['value']; ?>
                    Name- <?php print l(t($name), 'user/'.$user_info->uid.'/edit'); ?>
                    <br />
                    Phone - <?php print $user_info->field_phone['und'][0]['value']; ?>
                    <br />
                    Email - <?php print $user_info->mail; ?>
                </td>
                <td>
                    <?php
                        $therapist = user_load($rec->field_preferred_therapist['und'][0]['uid']);
                        print $name = $therapist->field_first_name['und'][0]['value'] . ' ' . $therapist->field_middle_name['und'][0]['value'] . ' ' . $therapist->field_last_name['und'][0]['value'];
                    ?>
                </td>
                <td>
                    <?php print $rec->field_no_of_sessions_required['und'][0]['value']; ?>
                </td>
                <td>
                    <?php print $rec->field_availability_required['und'][0]['value']; ?>
                </td>
                <td>
                    <?php print $rec->field_counselingrequest_comment['und'][0]['value']; ?>
                </td>
                <td>
                    <?php
                        if($rec->field_attempted_on['und'][0]['value'] == 0) {
                            print l(t('Attempted'), 'request/counseling/update/'.$rec->nid);
                        } else {
                            print 'Attempted On';
                            print '<br />';
                            print $attempted_on = date('M d Y h:i A', $rec->field_attempted_on['und'][0]['value']);
                        }
                    ?>
                </td>
            </tr>
        <?php
            }
        ?>
    </table>
</div>
