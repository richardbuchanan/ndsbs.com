<?php
/**
 * @file
 * user_transactions.tpl.php
 */
global $base_url, $user;
$data = get_user_purchased_assessment();
//echo '<pre>';
//print_r($data);
//echo '</pre>';
?>
<h1>
    Purchased Assessment
</h1>
<div class="table_wrap">
    <table class="schedule_table">
        <tr class="bkg_b">
            <th>Service Name</th>
            <th>Rush Order</th>
            <th>Service Duration</th>
            <th>Questionnaire</th>
            <th>Counselor</th>
            <th>Reports</th>
        </tr>
        <?php
            $total_count = count($data);
            foreach($data as $data_info) {
                $node_info = node_load($data_info->nid);
//                echo '<pre>';
//                print_r($node_info);
//                echo '</pre>';

                //  Function called to get the main service and sub service title
                $service_title = get_mainservice_subservice_title($node_info, $data_info->termid);
                $explode_title = explode('||', $service_title);
                
                //  Get the details of attempted questionnaire
                $qinfo = questionnaire_attempted_details($data_info->nid, $user->uid, $data_info->order_id);
//                echo '<pre>';
//                  print_r($qinfo);
//                echo '</pre>';
        ?>
            <tr>
                <td>
                    <?php
                        print $main_service = $explode_title[0];
                    ?>
                </td>
                <td>
                    <?php
                        print $sub_service = $explode_title[1];
                    ?>
                </td>
                <td>
                    Start- <?php print date('d M Y', $data_info->order_date); ?>
                    <br />
                    End- 
                    <?php
                        $next_date = strtotime(date("Y-m-d", $data_info->order_date) . " +10 days");
                        print $end_date = date('d M Y', $next_date);
                    ?>
                    <br />
                    Extra days to queries- 10 Days
                </td>
                <td>
                        <?php //print l(t('Start/Resume/Review'), $base_url.'/questionnaire/start/'.$data_info->nid.'/trans/'.$data_info->order_id); ?>
                        <!--Status- Completed/Pending/Interrupted-->
                        <?php
                            $status = 'Pending';
                            $total_attempted = 0;
                            foreach($qinfo as $ques_data) {
                                if($ques_data->evaluation == 1) {
                                    $status = 'Completed';
                                } else {
                                    $status = 'Pending';
                                }
                                $total_attempted = $ques_data->total_attempts;
                            }
                            if($total_attempted > 0) {
                                print '<b>' . l(t('Start/Resume/Review'), $base_url.'/questionnaire/start/'.$data_info->nid.'/trans/'.$data_info->order_id) . '</b>';
                                print '<br />';
                                print 'Status- ' . $status;
                                print '<br /> Attempted- '.$total_attempted.' times';
                            } elseif($node_info->field_online_questionnaire['und'][0]['value'] == 'Available') {
                                print '<b>' . l(t('Start/Resume/Review'), $base_url.'/questionnaire/start/'.$data_info->nid.'/trans/'.$data_info->order_id) . '</b>';
                                print '<br />';
                                print 'Status- ' . $status;
                                print '<br /> Attempted- '.$total_attempted.' times';
                            } else {
                                print 'Not Available';
                            }
                        ?>
                </td>
                <td>
                    <?php
                        $user_therapist = user_load($data_info->therapist);
                        print $user_therapist->field_first_name['und'][0]['value'] . ' ' . $user_therapist->field_last_name['und'][0]['value'];
                    ?>
                </td>
                <td>
                    <?php
                        if($data_info->report_status == 1) {
                            print '<ul class="tr_actions">
                                     <li class="completed_icon">Completed</li>
                                   </ul>';
                        } else {
                            print '<ul class="tr_actions">
                                     <li class="inprocess_icon">In-Process</li>
                                   </ul>';
                        }
                    ?>
                </td>
            </tr>
        <?php
            }
            if($total_count <= 0) {
            ?>
            <tr>
                <td colspan="6" class="txt_ac">
                    Record not found.
                </td>
            </tr>
            <?php
            }
        ?>
    </table>
</div>
