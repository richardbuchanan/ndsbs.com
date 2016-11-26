<?php
/**
 * @file
 * list_all_client_paperwork.tpl.php
 */
?>
<?php
if($_REQUEST['search_text'] <> '' || $_REQUEST['assessment_status'] <> '') {
    $val = get_client_paperwork_custom_search();
} else {
    //  function defined to load the content type paper-work
    $val = get_all_paperwork_request();
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
<h1>Client Requests</h1>
<div  class="field_fixed full_width left">
    <?php print search_client_paperwork(); ?>
</div>
<div class="table_wrap">
    <table class="schedule_table">
        <tr class="bkg_b">
            <th>Profile Picture</th>
            <th>Name</th>
            <th>Contact Details</th>
            <th>Service</th>
            <th>Paperwork</th>
        </tr>
        <?php
            $count_record = count($result);
            foreach($result as $rec) {
                $user_info = user_load($rec->uid);
                //echo '<pre>';
                //print_r($user_info);
        ?>
            <tr>
                <td>
                    <img src="<?php print image_style_url('thumbnail', $user_info->field_profile_picture['und'][0]['uri']) ?>">
                </td>
                <td>
                    <b>First Name-</b> <?php print l(t($user_info->field_first_name['und'][0]['value']), 'user/'.$user_info->uid.'/edit'); ?>
                    <br />
                    <b>Middle Name-</b> <?php print $user_info->field_middle_name['und'][0]['value']; ?>
                    <br />
                    <b>Last Name-</b> <?php print $user_info->field_last_name['und'][0]['value']; ?>
                </td>
                <td>
                    <b>Email-</b> <?php print $user_info->mail; ?>
                    <br />
                    <b>Address-</b><?php print $user_info->field_address['und'][0]['value']; ?>, 
                              <?php print $user_info->field_city['und'][0]['value']; ?>, 
                              <?php print $user_info->field_state['und'][0]['value']; ?>, 
                              <?php print $user_info->field_zip['und'][0]['value']; ?>
                    <br />
                    <b>Phone-</b> <?php print $user_info->field_phone['und'][0]['value']; ?>
                </td>
                <td>
                    <?php
                        //$term = taxonomy_term_load($rec->field_assessment['und'][0]['tid']);
                        //echo '<pre>';
                        //print_r($term);
                        //print $term->name;
                        ////////////////////////////////////////////////////////
                        $data = get_user_purchased_assessment_list();
                        foreach($data as $data_info) {
                            $node_info = node_load($data_info->nid);

                            //  Function called to get the main service and sub service title
                            $service_title = get_mainservice_subservice_title($node_info, $rec->field_assessment['und'][0]['tid']);
                            $explode_title = explode('||', $service_title);
                            $main_title = $explode_title[0];
                            $sub_title = $explode_title[1];
                            if($sub_title == 'NO') {
                                $title = $main_title;
                            } else {
                                $title = $sub_title;
                            }
                            if($rec->field_assessment['und'][0]['tid'] == $data_info->termid) {
                                print $title;
                                break;
                            }
                        }
                        ////////////////////////////////////////////////////////
                    ?>
                </td>
                <td>
                    <?php 
                        if($rec->field_paperwork_status['und'][0]['value'] == 1) {
                            print '<ul class="tr_actions">
                                     <li class="verified_icon">Verified</li>
                                   </ul>';
                        } else {
                            print '<ul class="tr_actions">
                                     <li class="notverified_icon">Not Verified</li>
                                   </ul>';
                        }
                    ?>
                </td>
            </tr>
        <?php
            }
        ?>
        <!--
        <tr>
            <td colspan="5">
                <?php
                    //$total = 10;
                    //print $output = theme('pager', array('quantity' => $total));
                ?>
            </td>
        </tr>
        -->
           <?php
                if($count_record <= 0) {
                    ?>
                        <tr><td class="txt_ac" colspan="5">Record not found</td></tr>
                    <?php
                }
           ?>
    </table>
</div>
<?php
    $total = 10;
    print $output = theme('pager', array('quantity' => $total));
?>
