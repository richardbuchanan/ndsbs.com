<?php
/**
 * @file
 * clients_view_reports.tpl.php
 */

/**
 * BEGIN BDG DEVELOPMENT
 *
 * DO NOT MODIFY/REMOVE ANYTHING IN THIS SECTION
 * WITHOUT CONTACTING ME FIRST!!!
 *
 * @contact Richard Buchanan <richard_buchanan@buchanandesigngroup.com>
 * @link http://www.buchanandesigngroup.com @endlink
 */
global $user;
$pdf = $user->uid . '.pdf';
$uri = 'public://reports/uploaded/' . $pdf;
$uploaded_pdf = arg(3) . '.pdf';
$uploaded_uri = 'public://reports/uploaded/' . $uploaded_pdf;
/**
 * END BDG DEVELOPMENT
 */
 
global $base_url;
//  Notary status defined on 29-03-2013 mail dated on 29-03-2013
$notary_status = 'inactive';        //  Change $notary_status from inactive to active to show the notary
//  Notary status defined on 29-03-2013

$user_id = arg(3);
$user_info = user_load($user_id);
//  Show the tab selected
$selected_display1 = '';
$selected_display2 = '';
$selected_display3 = '';
$selected_display4 = '';
switch (arg(11)) {
  case 1:
    $tab_display1 = 'display:inline';
    $tab_display2 = 'display:none';
    $tab_display3 = 'display:none';
    $tab_display4 = 'display:none';
    
    $selected_display1 = 'class="selected"';
    break;
  case 2:
    $tab_display1 = 'display:none';
    $tab_display2 = 'display:inline';
    $tab_display3 = 'display:none';
    $tab_display4 = 'display:none';
    
    $selected_display2 = 'class="selected"';
    break;
  case 3:
    $tab_display1 = 'display:none';
    $tab_display2 = 'display:none';
    $tab_display3 = 'display:inline';
    $tab_display4 = 'display:none';
    
    $selected_display3 = 'class="selected"';
    break;
  case 4:
    $tab_display1 = 'display:none';
    $tab_display2 = 'display:none';
    $tab_display3 = 'display:none';
    $tab_display4 = 'display:inline';
    
    $selected_display4 = 'class="selected"';
    break;
  default:
    $tab_display1 = 'display:inline';
    $tab_display2 = 'display:none';
    $tab_display3 = 'display:none';
    $tab_display4 = 'display:none';
    
    $selected_display1 = 'class="selected"';
    break;
}
?>
<h1>Client Reports</h1>
<!--<div id="user_report">-->
<span id="report-paperwork"
 <?php print $selected_display1; ?>>Personal Info & Service Letter
</span>
<span id="report-assessment"
 <?php print $selected_display2; ?>>Assessment
</span>
<!-- <span id="report-stateform"
 <?php // print $selected_display3; ?>>DMV State form
</span> -->
<span id="report-scheduling"
 <?php print $selected_display4; ?>>Schedule Interview
</span>
<div id="paperwork-content" style=" <?php print $tab_display1; ?>">
  <div class="tab_wrap">
    <table class="">
      <tr>
        <td>First Name - <?php print l(t(
          $user_info->field_first_name['und'][0]['value']),
            'user/' . $user_info->uid . '/edit'); ?><br />
          Middle Name - <?php print
            $user_info->field_middle_name['und'][0]['value']; ?><br />
          Last Name - <?php
            print $user_info->field_last_name['und'][0]['value']; ?>
        </td>
      </tr>
      <tr>
        <td>Gender - <?php print
            $user_info->field_gender['und'][0]['value']; ?><br />
          Date of Birth - <?php print
            $user_info->field_dobdate['und'][0]['value']; ?>-<?php print 
            $user_info->field_month['und'][0]['value']; ?>-<?php print 
            $user_info->field_year['und'][0]['value']; ?>
        </td>
      </tr>
      <tr>
        <td>Email - <?php print $user_info->mail; ?><br />
          Address - <?php print
            $user_info->field_address['und'][0]['value']; ?>,
            <?php print $user_info->field_city['und'][0]['value']; ?>, 
            <?php print $user_info->field_state['und'][0]['value']; ?>,
            <?php print $user_info->field_zip['und'][0]['value']; ?><br />
          Phone - <?php print
            $user_info->field_phone['und'][0]['value']; ?><br />
          Second Phone - <?php print
            $user_info->field_second_phone['und'][0]['value']; ?>
        </td>
      </tr>

      <?php if ($user_info->field_referred_by['und'][0]['value'] <> '') { ?>
      <tr>
        <td>
          How did you hear about us? - <?php print
            $user_info->field_referred_by['und'][0]['value']; ?>
        </td>
      </tr>
      <?php }

      if ($user_info->field_recipient_name['und'][0]['value'] <> '' ||
        $user_info->field_recipient_title['und'][0]['value'] <> '' ||
        $user_info->field_recipient_company['und'][0]['value'] <> '' ||
        $user_info->field_recipient_street['und'][0]['value'] <> '' ||
        $user_info->field_recipient_city['und'][0]['value'] <> '' ||
        $user_info->field_recipient_state['und'][0]['value'] <> '' ||
        $user_info->field_recipient_zip['und'][0]['value'] <> '' ) { ?>
        <tr>
          <td>
            <b>Recipient Information:</b><br />
              <?php if ($user_info->field_recipient_name['und'][0]['value'] <>
                 '') { ?>
                Name - <?php print
                  $user_info->field_recipient_name['und'][0]['value'];
              }

              if ($user_info->field_recipient_title['und'][0]['value'] <>
                 '') { ?>
                <br />Title - <?php print
                  $user_info->field_recipient_title['und'][0]['value'];
              }

              if ($user_info->field_recipient_company['und'][0]['value'] <>
                 '') { ?>
                <br />Company - <?php print
                  $user_info->field_recipient_company['und'][0]['value'];
              }

              if ($user_info->field_recipient_street['und'][0]['value'] <>
                 '') { ?>
                <br />Street - <?php print
                  $user_info->field_recipient_street['und'][0]['value'];
              }

              if ($user_info->field_recipient_city['und'][0]['value'] <>
                 '') { ?>
                <br />City - <?php print
                  $user_info->field_recipient_city['und'][0]['value']; 
              }

              if ($user_info->field_recipient_state['und'][0]['value'] <>
                 '') { ?>
                <br />State - <?php print
                  $user_info->field_recipient_state['und'][0]['value']; 
              }

              if ($user_info->field_recipient_zip['und'][0]['value'] <>
                 '') { ?>
                <br />Zip - <?php print
                  $user_info->field_recipient_zip['und'][0]['value'];
              } ?>
          </td>
        </tr>
      <?php } ?>
      <tr>
        <td>
          <?php if ($user_info->field_profile_picture['und'][0]['uri'] <>
             '') { ?>
            <img src="<?php print
              image_style_url('thumbnail',
              $user_info->field_profile_picture['und'][0]['uri']) ?>">
          <?php }

          else { ?>
            <img src="<?php print
              image_style_url('thumbnail', 
              'public://default_images/UserDefault.jpg') ?>">
          <?php } ?>
        </td>
      </tr>
      <tr>
        <td>
          <div class="table_wrap">
            <span id="success_msg_pprwrk"></span>
              <form id="paperwork-frm" method="POST"
                enctype="multipart/form-data" action="<?php print
                  $base_url.'/save/paperwork/verification';?>">
                <table class="schedule_table">
                  <tr class="bkg_b">
                    <th>Title</th>
                    <th>Selected File</th>
                    <th>Status</th>
                    <th>Note</th>
                    <th>Action</th>
                  </tr>
                  <?php
                    //  Get the user's paper work assigned to this term
                    // (Purchased Term)
                    $val = get_client_paperwork_info($userid = arg(3),
                      $tid = arg(9));
                    $nid_array = array();
                    foreach ($val as $data) {
                      $nid_array[] = $data->nid;
                    }
                    //  load the node data
                    $result = node_load_multiple($nid_array);
                    //print '<pre>';
                    //print_r($result);
                    //print '</pre>';
                    $i = 0;
                    $count = count($result);

                    if ($count > 0) {
                      foreach ($result as $rec) { ?>
                        <tr>
                          <td><?php print
                            $rec->field_title['und'][0]['value']; ?>
                          </td>
                          <td><?php
                            $explode = explode('.',
                              $rec->field_upload['und'][0]['filename']);
                            $file_extension = $explode[1];
                            print '<a href="'.$base_url.
                              '/sites/ndsbs.com/files/paperwork/' .
                              $rec->field_upload['und'][0]['filename'] .
                              '" type="application/' . $file_extension .
                              '; length=' .
                              $rec->field_upload['und'][0]['filesize'] .
                              '">' .
                              $rec->field_upload['und'][0]['filename'] .
                              '</a>'; ?>
                          </td>
                          <td> <?php
                            if ($rec->field_paperwork_status['und'][0]
                              ['value'] == 1) {
                              print 'Verified';
                            }
                            else {
                              print 'Not Verified';
                            } ?>
                          </td>
                          <td>
                            <input type="text" class="form-text"
                              name="paper_work_note_<?php print $i; ?>"
                              value="<?php print
                                $rec->field_paperwork_note['und'][0]['value'];
                                ?>" />
                            <input type="hidden" name="paper_work_node_id_
                              <?php print $i; ?>" value="<?php print
                                $rec->nid; ?>" />
                          </td>
                          <td>
                            <select name="verification_status_<?php print
                              $i; ?>" id="verification_status"
                                class="form-select wd_140">
                              <option>Select</option>
                              <option value="1">Verified</option>
                              <option value="0">Not Verified</option>
                            </select>
                          </td>
                        </tr>
                        <?php $i++;
                      } ?>
                      <!-- <tr>
                        <td colspan="6">
                          <input type="hidden" name="total_count"
                            value="<?php print $i; ?>" />
                          <input type="button" name="button" value="submit"
                            id="save_paper_work_verification"
                            class="form-submit" />
                        </td>
                      </tr>-->
                    <?php }
                      
                    else { ?>
                      <tr>
                        <td colspan="6">No Paper work found.</td>
                      </tr>
                    <?php } ?>
								    <!-- Fax status form -->
									  <tr>
                                            <td><input type="text" class="form-text" name="new_title"></td>
                                            <td>
                                              <!--  <input type="file" class="form-file" name="new_doc">-->
                                            </td>
                                            <td>
                                                <input type="text" class="form-text" name="new_status">
                                            </td>
                                            <td>
                                                <input type="text" class="form-text" name="new_note" />
                                                <input type="hidden" name="uid" value="<?php print arg(3);?>">
												<input type="hidden" name="tid" value="<?php print arg(9);?>">
												<input type="hidden" name="fiveid" value="<?php print arg(5);?>">
												<input type="hidden" name="sevenid" value="<?php print arg(7);?>">
                                            </td>
											
                                            <td>
                                                <select name="verification_status_new" id="verification_status" class="form-select wd_140">
                                                    <option>Select</option>
                                                    <option value="1">Verified</option>
                                                    <option value="0">Not Verified</option>
                                                </select>
                                            </td>
                                        </tr>
                                        
                                    <tr>
                                        <td colspan="6">
                                            <input type="hidden" name="total_count" value="<?php print $i; ?>" />
                                            <input type="submit" name="button" value="submit"  class="form-submit" />
                                        </td>
                                    </tr>
									 <!--Fax form ends here -->
                               
                            </table>
                        </form>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</div>

<!-- START assessment content   -->
<div id="assessment-content" style='<?php print $tab_display2; ?>'>
    <?php
        //  Function call to get the Subreports only
        //  $subreport_data = get_purchased_items_subreports_report_section($report_nid = arg(7), 1, 1, $report_tid = arg(5), $user_id);    //  Commented on 25-04-2013
        $subreport_data = get_purchased_items_subreports_report_section_trans($report_nid = arg(7), 1, 1, $report_tid = arg(5), $user_id, arg(9));

        //  get users transaction information
        //$data = get_purchased_items_reports_section($report_nid = arg(7), 1, 0, $report_tid = arg(5), $user_id);    //  Commented on 25-04-2013
        $data = get_purchased_items_reports_section_trans($report_nid = arg(7), 1, 0, $report_tid = arg(5), $user_id, arg(9));
    ?>
    <div class="tab_wrap">
        <table class="">
            <?php
                foreach($data as $report_info_result) {
                    $termid_assessment = $report_info_result->termid;
                    //  load the node data
                    $result_report = node_load($report_info_result->nid);
            ?>
                    <tr>
                        <td>
                            <b>Report-</b>
                            <?php
                                switch ($termid_assessment) {
                                    case $result_report->field_primary_service['und'][0]['tid']:
                                        $report_title = $result_report->field_assessment_title['und'][0]['value'];
                                        break;
                                    case $result_report->field_rush_order_service_one['und'][0]['tid']:
                                        $report_title = $result_report->field_rush_order_title_one['und'][0]['value'];
                                        break;
                                    case $result_report->field_rush_order_service_two['und'][0]['tid']:
                                        $report_title = $result_report->field_rush_order_title_two['und'][0]['value'];
                                        break;
                                    case $result_report->field_rush_order_service_three['und'][0]['tid']:
                                        $report_title = $result_report->field_rush_order_title_three['und'][0]['value'];
                                        break;
                                    case $result_report->field_rush_order_service_four['und'][0]['tid']:
                                        $report_title = $result_report->field_rush_order_title_four['und'][0]['value'];
                                        break;
                                }
                                print $report_title;
                                
                            ?>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>Alloted Professional Counselor- </b>
                            <?php
                                //echo '<pre>';
                                    //print_r($report_info_result);
                                //echo '</pre>';
                                if($report_info_result->therapist > 0) {
                                    $therapist_info = user_load($report_info_result->therapist);
                                    print $therapist_info->field_first_name['und'][0]['value'] . ' ' . $therapist_info->field_last_name['und'][0]['value'];
                                } else {
                                    print 'Not Alloted';
                                }
                            ?>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <?php
                                if($report_info_result->updated_on <> '' && $report_info_result->updated_by <> '') {
                                    $report_gen_updated_by = user_load($report_info_result->updated_by);
                                    $generated_on = date('M d, Y', $report_info_result->updated_on);
                                    $generated_by = $report_gen_updated_by->field_first_name['und'][0]['value'] . ' ' . $report_gen_updated_by->field_last_name['und'][0]['value'];
                                }
                                print 'Generated By ' . $generated_by;
                                print '<br />';
                                print 'On ' . $generated_on;
                            ?>
                        </td>
                    </tr>
            <?php
                    break;  //  Ren the loop only once to display the report title
                }
            ?>
            <!--    Assessment Form Start   -->
            <tr>
                <td>
                    <div class="table_wrap">
                        <span id="success_msg_assessmentfrm"></span>
                        <form id="assessment-frm" method="post" action="<?php print $base_url; ?>/save/assessmentform/verification" enctype="multipart/form-data">
                            <table class="schedule_table">
                                <tr class="bkg_b">
                                    <th>Requested Document</th>
                                    <th>Express Mail</th>
                                    
                                    <?php
                                    if($notary_status == 'active') {
                                    ?>
                                        <th>Notary Request</th>
                                    <?php
                                    }
                                    ?>
                                    
                                    <th>Counselor's Report</th>
                                    
                                    <?php
                                    if($notary_status == 'active') {
                                    ?>
                                        <th>Upload Notary Report</th>
                                    <?php
                                    }
                                    ?>
                                </tr>
                                <?php
                                //  echo '<pre>';
                                //      print_r($data);
                                //  echo '</pre>';
                                foreach ($data as $report_info) {
                                    $term_id_assessment = $report_info->termid;
                                    //  load the node data
                                    $result = node_load($report_info->nid);
                                    ?>
                                    <tr>
                                        <td>Assessment Report</td>
                                        <td>
                                            <?php
                                            if($report_info->express_mail > 0) {
                                                print 'Yes';
                                                print '<br />';
                                                print 'Requested On-';
                                                print '<br />';
                                                print date('M d, Y', $report_info->order_date);
                                            } else {
                                                print 'No';
                                            }
                                            ?>
                                        </td>
                                        <?php
                                        if($notary_status == 'active') {
                                        ?>
                                        <td>
                                            <?php
                                            if ($report_info->notary_cost > 0) {
                                                print 'Yes';
                                                print '<br />';
                                                print 'Requested On-';
                                                print '<br />';
                                                print date('M d, Y', $report_info->order_date);
                                            } else {
                                                print 'No';
                                            }
                                            ?>
                                        </td>
                                        <?php
                                        }
                                        ?>
                                        <td class="generate_report">
                                            <?php
                                                //  Generate Report code HERE
                                                //  dev.ndsbs.com/users/view/reports/120/tid/26/nid/259/tab/2
                                                $options_dest = array('query' => array('destination' => 'users/view/reports/'.arg(3).'/tid/'.arg(5).'/nid/'.arg(7).'/transid/'.arg(9).'/tab/2'), 'attributes' => array('class' => "brown_btn dis_ib"));
                                                //print l(t('Generate Report'), 'generate/user/report/uid/'. arg(3) . '/tid/' . arg(5) . '/nid/' . arg(7) . '/id/'.$report_info->id.'/stid/'.$report_info->termid, $options_dest);




                                                print l(t('Upload Report'), 'node/add/report-format/generate/user/report/uid/'. arg(3) . '/tid/' . arg(5) . '/nid/' . arg(7) . '/id/'.$report_info->id.'/stid/'.$report_info->termid, $options_dest);
                                            ?>
                                            <br />
                                            <br />
                                            <?php
								// ------------------- BEGIN BDG DEVELOPMENT
								// ------------------ DO NOT MODIFY OR REMOVE
								//if (file_exists($uploaded_uri)) {
									//print l(t($uploaded_pdf), $base_url.'/download/report', array(
                    //'query' => array(
                      //'file_name_path' => $uploaded_uri
                    //)
                  //));
								//}
								// -------------------- END BDG DEVELOPMENT
                                                //else {
																									$explode = explode('.', $report_info->main_report);
                                                $file_extension = $explode[1];
                                                $fname = $report_info->main_report;
                                                $file_name_path = 'public://reports/'.$fname;
                                                print l(t($fname), $base_url.'/download/report', array('query' => array('file_name_path' => $file_name_path)));
																								}
                                            ?>
                                        </td>
                                    <?php
                                    if($notary_status == 'active') {
                                    ?>
                                        <td>
                                            No
                                        </td>
                                    <?php
                                    }
                                    ?>
                                    </tr>
                                    <?php
                                //}
                                ////////////////////////////////////////////////////////////////////////////////////
                                //  Main Report Part END HERE
                                ////////////////////////////////////////////////////////////////////////////////////
                                ?>
                                <?php
                                //  Main Report for display shipping and notary information for main reports only START
                                //        echo '<pre>';
                                //            print_r($subreport_data);
                                //        echo '</pre>';
                                $inc1 = 0;
                                foreach($subreport_data as $sub_info) {
                                    if($sub_info->main_report_id == $sub_info->termid) {
                                        if($sub_info->notary_cost > 0) {
                                        ?>
                                            <tr>
                                                <td>
                                                    Assessment Report
                                                    <input type="hidden" name="assessment_oid_<?php print $inc1; ?>" value="<?php print $sub_info->id; ?>" />
                                                    <input type="hidden" name="termid_<?php print $inc1; ?>" value="<?php print $sub_info->termid; ?>" />
                                                </td>
                                                <td>
                                                <?php
                                                    if($sub_info->express_mail > 0) {
                                                        $report_updated_by = user_load($sub_info->updated_by);
                                                        //express_mail_status, notary_status, updated_on, updated_by
                                                        if ($sub_info->express_mail_status == 2) {
                                                            print 'Dispatched on ' . date('M d, Y', $sub_info->updated_on);
                                                            print '<br />';
                                                            print 'Updated by - ' . $report_updated_by->field_first_name['und'][0]['value'] . ' ' . $report_updated_by->field_last_name['und'][0]['value'];
                                                        } else {
                                                ?>
                                                            <select name="express_mail_status_<?php print $inc1; ?>" id="express_mail_status">
                                                                <option value="0">-Select-</option>
<!--                                                                <option value="1">Requested</option> 1 stand for Requested -->
                                                                <option value="2">Dispatched</option><!-- 2 stand for Dispatched -->
                                                            </select>
                                                <?php
                                                        }
                                                    } else {
                                                        print 'Not Requested';
                                                    }
                                                ?>
                                                </td>
                                                
                                                <?php
                                                if($notary_status == 'active') {
                                                ?>
                                                    <td>
                                                    <?php
                                                        if($sub_info->notary_cost > 0) {
                                                            $report_updated_by = user_load($sub_info->updated_by);
                                                                if ($sub_info->notary_status == 2) {
                                                                    print 'Attached <br />';
                                                                    print 'Updated by - ' . $report_updated_by->field_first_name['und'][0]['value'] . ' ' . $report_updated_by->field_last_name['und'][0]['value'];
                                                                } else {
                                                    ?>
                                                                <select name="notary_status_<?php print $inc1; ?>" id="notary_status">
                                                                    <option value="0">-Select-</option>
    <!--                                                                <option value="1">Requested</option> 1 stand for Requested -->
                                                                    <option value="2">Attached</option><!-- 1 stand for Attached -->
                                                                </select>
                                                    <?php
                                                                }
                                                        } else {
                                                            print 'Not Requested';
                                                        }
                                                    ?>
                                                    </td>
                                                <?php
                                                }
                                                ?>
                                                <td>
                                                    <?php
                                                        //  Generate Report code HERE
                                                        //  dev.ndsbs.com/users/view/reports/120/tid/26/nid/259/tab/2
                                                        $options_dest = array('query' => array('destination' => 'users/view/reports/'.arg(3).'/tid/'.arg(5).'/nid/'.arg(7).'/transid/'.arg(9).'/tab/2'), array('class' => "brown_btn dis_ib"));
                                                        //print l(t('Generate Report'), 'generate/user/report/uid/'. arg(3) . '/tid/' . arg(5) . '/nid/' . arg(7) . '/id/'.$sub_info->id.'/stid/'.$sub_info->termid, $options_dest);
                                                        print l(t('Generate Report'), 'node/add/report-format/generate/user/report/uid/'. arg(3) . '/tid/' . arg(5) . '/nid/' . arg(7) . '/id/'.$sub_info->id.'/stid/'.$sub_info->termid, $options_dest);
                                                    ?>
                                                    <br />
                                                    <br />
                                                    <?php
                                                        $explode = explode('.', $sub_info->main_report);
                                                        $file_extension = $explode[1];
                                                        $fname = $sub_info->main_report;
                                                        //print '<a href="'.$base_url.'/sites/ndsbs.com/files/reports/' . $fname . '" type="application/' . $file_extension . ';">' . $sub_info->main_report . '</a>';
                                                        $file_name_path = 'public://reports/'.$fname;
                                                        print l(t($fname), $base_url.'/download/report', array('query' => array('file_name_path' => $file_name_path)));

                                                    ?>
                                                </td>
                                    <?php
                                    if($notary_status == 'active') {
                                    ?>

                                                <td>
                                                    <input type="file" name="file_<?php print $inc1; ?>" />
                                                    <br />
                                                    <br />
                                                    <?php
                                                        $explode = explode('.', $sub_info->report_name);
                                                        $file_extension = $explode[1];
                                                        $fname = $sub_info->report_name;
                                                        //print '<a href="'.$base_url.'/sites/ndsbs.com/files/reports/' . $fname . '" type="application/' . $file_extension . ';">' . $sub_info->report_name . '</a>';
                                                        $file_name_path = 'public://reports/'.$fname;
                                                        print l(t($fname), $base_url.'/download/report', array('query' => array('file_name_path' => $file_name_path)));
                                                    ?>
                                                </td>
                                   <?php
                                    }
                                   ?>
                                            </tr>
                                            <?php
                                            $inc1++;
                                        }
                                    }
                                }
                                //  Main Report for display shipping and notary information for main reports only START
                                ?>
                                
                                <?php
                                //echo '<pre>';
                                    //print_r($subreport_data);
                                //echo '</pre>';
                                //  Sub Report for display main price of subreport and shipping and notary information for sub reports only START
                                //  array of Stateform term id created do not display stateform here
                                $statform_array = array(21, 22, 23, 24);
                                foreach ($subreport_data as $sub_info) {
                                    if(!in_array($sub_info->termid, $statform_array)) {
                                        if($sub_info->main_report_id != $sub_info->termid) {
                                            $term_id_assessment = $report_info->termid;
                                            $sub_report = taxonomy_term_load($sub_info->termid);
                                            //echo '<pre>';
                                            //print_r($sub_report);
                                            //echo '</pre>';
                                            $result = node_load($sub_info->nid);
                                            ?>
                                            <tr>
                                                <td>
                                                    <?php
                                                        print $sub_report->name;
                                                    ?>
                                                    <input type="hidden" name="assessment_oid_<?php print $inc1; ?>" value="<?php print $sub_info->id; ?>" />
                                                    <input type="hidden" name="termid_<?php print $inc1; ?>" value="<?php print $sub_info->termid; ?>" />
                                                </td>
                                                <td>
                                                <?php
                                                    if($sub_info->express_mail > 0) {
                                                        $report_updated_by = user_load($sub_info->updated_by);
                                                        if ($sub_info->express_mail_status == 2) {
                                                            print 'Dispatched on ' . date('M d, Y', $sub_info->updated_on);
                                                            print '<br />';
                                                            print 'Updated by - ' . $report_updated_by->field_first_name['und'][0]['value'] . ' ' . $report_updated_by->field_last_name['und'][0]['value'];
                                                        } else {
                                                ?>
                                                        <select name="express_mail_status_<?php print $inc1; ?>" id="express_mail_status">
                                                            <option value="0">-Select-</option>
<!--                                                            <option value="1">Requested</option> 1 stand for Requested -->
                                                            <option value="2">Dispatched</option><!-- 2 stand for Dispatched -->
                                                        </select>
                                                <?php
                                                        }
                                                    } else {
                                                        print 'Not Requested';
                                                    }
                                                ?>
                                                </td>

                                                <?php
                                                if($notary_status == 'active') {
                                                ?>
                                                    <td>
                                                    <?php
                                                        if($sub_info->notary_cost > 0) {
                                                            $report_updated_by = user_load($sub_info->updated_by);
                                                            if ($sub_info->notary_status == 2) {
                                                                print 'Attached <br />';
                                                                print 'Updated by - ' . $report_updated_by->field_first_name['und'][0]['value'] . ' ' . $report_updated_by->field_last_name['und'][0]['value'];
                                                            } else {
                                                    ?>
                                                                <select name="notary_status_<?php print $inc1; ?>" id="notary_status">
                                                                    <option value="0">-Select-</option>
    <!--                                                                <option value="1">Requested</option> 1 stand for Requested -->
                                                                    <option value="2">Attached</option><!-- 1 stand for Attached -->
                                                                </select>
                                                    <?php
                                                            }
                                                        } else {
                                                            print 'Not Requested';
                                                        }
                                                    ?>
                                                    </td>
                                                <?php
                                                }
                                                ?>
                                                <td>
  <?php
    //  Generate Report code HERE
    //  dev.ndsbs.com/users/view/reports/120/tid/26/nid/259/tab/2
    $options_dest = array(
      'query' => array(
        'destination' => 'users/view/reports/'.arg(3).'/tid/'.arg(5).'/nid/'.
          arg(7).'/transid/'.arg(9).'/tab/2'
      ),
      array(
        'class' => "brown_btn dis_ib"
      )
    );
    
    print l(t('Generate Report'),
      'node/add/report-format/generate/user/report/uid/'.arg(3).'/tid/'.arg(5)
      .'/nid/'.arg(7).'/id/'.$sub_info->id.'/stid/'.$sub_info->termid,
      $options_dest); ?>
  <br />
  <br />
  <?php
    $explode = explode('.', $sub_info->main_report);
    $file_extension = $explode[1];
    $fname = $sub_info->main_report;
    
    //print '<a href="'.$base_url.'/sites/ndsbs.com/files/reports/' . 
    //$fname . '" type="application/' . $file_extension . ';">' . 
    //$sub_info->main_report . '</a>';
    
    //$file_name_path = 'public://reports/'.$fname;
    //print l(t($fname), $base_url.'/download/report', array(
      //'query' => array(
        //'file_name_path' => $file_name_path
      //)
    //)); ?>
  </td>

                                                <?php
                                                if($notary_status == 'active') {
                                                ?>
                                                <td>
                                                    <input type="file" name="file_<?php print $inc1; ?>" />
                                                    <br />
                                                    <br />
                                                    <?php
                                                        $explode = explode('.', $sub_info->report_name);
                                                        $file_extension = $explode[1];
                                                        $fname = $sub_info->report_name;
                                                        //print '<a href="'.$base_url.'/sites/ndsbs.com/files/reports/' . $fname . '" type="application/' . $file_extension . ';">' . $sub_info->report_name . '</a>';
                                                        $file_name_path = 'public://reports/'.$fname;
                                                        print l(t($fname), $base_url.'/download/report', array('query' => array('file_name_path' => $file_name_path)));
                                                    ?>
                                                </td>
                                                <?php
                                                }
                                                ?>
                                            </tr>
                                            <?php
                                            $inc1++;
                                        }
                                    }
                                }
//  Sub Report for display main price of subreport and shipping and notary information for sub reports only END
                                ?>
                                <tr style="display:none;">
                                    <td colspan="3">
                                        <input type="hidden" name="total_count" value="<?php print $inc1; ?>" />
                                        <input type="hidden" name="uid" value="<?php print arg(3); ?>" />
                                        <input type="hidden" name="tid" value="<?php print arg(5); ?>" />
                                        <input type="hidden" name="nid" value="<?php print arg(7); ?>" />
                                        <!--<input type="submit" name="submit" value="submit" id="save_assessmentform_verification" class="form-submit" />-->
                                    </td>
                                </tr>
                            </table>
                        </form>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</div>

<?php
    //  Remove State form from here
    /*
?>
<!-- START stateform content   -->
<div id="stateform-content" style='<?php print $tab_display3; ?>'>
    <div class="tab_wrap">
        <table class="">
            <tr>
                <td>
                    <div class="table_wrap">
                        <span id="success_msg_statfrm"></span>
                        <form id="stateform-frm" method="post" action="<?php print $base_url; ?>/save/stateform/verification" enctype="multipart/form-data">
                            <table class="schedule_table">
                                <tr class="bkg_b">
                                    <th>Requested DMV State forms</th>
                                    <th>Preferred therapist</th>
                                    <th>Express Mail</th>
                                    <?php
                                    if($notary_status == 'active') {
                                    ?>
                                        <th>Notary Request</th>
                                    <?php
                                    }
                                    ?>
                                    <th>Comments</th>
                                    <th>Action</th>
                                </tr>
                                <?php
                                //  Get the user's paper work assigned to this term (Purchased Term)
                                $val = get_client_stateform_info_report($userid = arg(3), $tid = arg(5));
                                $nid_array = array();
                                foreach ($val as $data) {
                                    $nid_array[] = $data->nid;
                                }
                                //  load the node data
                                $result = node_load_multiple($nid_array);
//                                    print '<pre>';
//                                        print_r($result);
//                                    print '</pre>';
                                $i = 0;

                                $count = count($result);
                                if ($count > 0) {
                                    foreach ($result as $rec) {
                                        if ($rec->field_state_form_payment_status['und'][0]['value'] == 1) {
                                            //print '<pre>';
                                                //print_r($rec);
                                            //print '</pre>';
                                            ?>
                                            <tr>
                                                <td>
                                                    <?php
                                                    $total_count = count($rec->field_state_form_title['und']);
                                                    for ($j = 0; $j < $total_count; $j++) {
                                                        ?>
                                                            <?php
                                                            $explode = explode('.', $rec->field_state_form_upload['und'][$j]['filename']);
                                                            $file_extension = $explode[1];
                                                            $fname = drupal_basename($rec->field_state_form_upload['und'][$j]['uri']);
                                                            print '<a href="'.$base_url.'/sites/ndsbs.com/files/stateform/' . $fname . '" type="application/' . $file_extension . '; length=' . $rec->field_state_form_upload['und'][$j]['filesize'] . '">' . $rec->field_state_form_title['und'][$j]['value'] . '</a>';
                                                            ?>
                                                        <br />
                                                        <?php
                                                    }
                                                    //  Code for stateform title pages
                                                    $term_state_form = taxonomy_term_load($rec->field_state_form_cat_id['und'][0]['value']);
                                                    print '(' . $term_state_form->name . ')';
                                                    ?>
                                                </td>
                                                <td>
                                                    <?php
                                                    $prefrered_therapist = user_load($rec->field_state_form_user_reference['und'][0]['uid']);
                                                    print $prefrered_therapist->field_first_name['und'][0]['value'] . ' ' . $prefrered_therapist->field_last_name['und'][0]['value'];
                                                    ?>
                                                </td>
                                                <td>
                                                    <?php
                                                    $report_updated_by = user_load($rec->field_report_updated_by['und'][0]['value']);
                                                    if ($rec->field_express_mail_status['und'][0]['value'] == 2) {
                                                        print 'Dispatched on ' . date('M d, Y', $rec->field_report_updated_on['und'][0]['value']);
                                                        print '<br />';
                                                        print 'Updated by - ' . $report_updated_by->field_first_name['und'][0]['value'] . ' ' . $report_updated_by->field_last_name['und'][0]['value'];
                                                    } else {
                                                        ?>
                                                        <select name="express_mail_status_<?php print $i; ?>" id="express_mail_status">
                                                            <option value="0">-Select-</option>
<!--                                                            <option value="1">Requested</option> 1 stand for Requested -->
                                                            <option value="2">Dispatched</option><!-- 2 stand for Dispatched -->
                                                        </select>
                                                        <?php
                                                    }
                                                    ?>
                                                    <br />
                                                </td>
                                                <?php
                                                if($notary_status == 'active') {
                                                ?>
                                                <td>
                                                    <?php
                                                    if ($rec->field_notary_status['und'][0]['value'] == 2) {
                                                        print 'Attached <br />';
                                                        print 'Updated by - ' . $report_updated_by->field_first_name['und'][0]['value'] . ' ' . $report_updated_by->field_last_name['und'][0]['value'];
                                                    } else {
                                                        ?>
                                                        <select name="notary_status_<?php print $i; ?>" id="notary_status">
                                                            <option value="0">-Select-</option>
<!--                                                            <option value="1">Requested</option> 1 stand for Requested -->
                                                            <option value="2">Attached</option><!-- 1 stand for Attached -->
                                                        </select>
                                                        <?php
                                                    }
                                                    ?>
                                                </td>
                                                <?php
                                                }
                                                ?>
                                                <td>
                                                    <?php
                                                    print $rec->field_state_form_comment['und'][0]['value'];
                                                    ?>
                                                    <!-- USED to pass the node id -->
                                                    <input type="hidden" name="stateform_node_id_<?php print $i; ?>" value="<?php print $rec->nid; ?>" />
                                                </td>
                                                <td>
                                                    <!-- State from node id used  -->
                                                    <input type="hidden" name="statenid_<?php print $i; ?>" value="<?php print $rec->nid; ?>" />
                                                    <input type="file" name="file_<?php print $i; ?>" />
                                                    <br /><br />
                                                    <?php
                                                    if($rec->field_report_state_form['und'][0]['value'] <> '') {
                                                        $fname = $rec->field_report_state_form['und'][0]['value'];
                                                        $file_name_path = 'public://reports/'.$fname;
                                                        print l(t($fname), $base_url.'/download/report', array('query' => array('file_name_path' => $file_name_path)));
                                                    } else {
                                                        print 'NA';
                                                    }
                                                    ?>
                                                </td>
                                            </tr>
                                            <?php
                                            $i++;
                                        }
                                    }
                                    ?>
                                    <tr>
                                        <td colspan="5">
                                            <input type="hidden" name="total_count" value="<?php print $i; ?>" />
                                            <input type="hidden" name="uid" value="<?php print arg(3); ?>" />
                                            <input type="hidden" name="tid" value="<?php print arg(5); ?>" />
                                            <input type="hidden" name="nid" value="<?php print arg(7); ?>" />
                                            <input type="submit" name="submit" value="submit" id="save_stateform_verification" class="form-submit" />
                                        </td>
                                    </tr>
                                    <?php
                                } else {
                                    ?>
                                    <tr>
                                        <td colspan="6">
                                            No Stateform found.
                                        </td>
                                    </tr>
                                    <?php
                                }
                                ?>
                            </table>
                        </form>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</div>

<?php
*/
//  Remove state form from here
?>


<?php
//  function defined to load the content type counseling request
$result = array();
$val = get_counseling_request_info_transid(arg(9));
$nid_array = array();
foreach ($val as $data) {
    $nid_array[] = $data->nid;
}

//  load the node data
$result = node_load_multiple($nid_array);
//echo '<pre>';
//print_r($result);
//echo '</pre>';
//die;
?>
<div id="scheduling-content" style='<?php print $tab_display4; ?>'>
    <div class="tab_wrap">
        <table class="">
            <tr>
                <td>
                    <div class="table_wrap">
                        <table class="schedule_table">
                            <tr class="bkg_b">
                                <th>Client</th>
                                <th>Preferred Counselor</th>
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
                                        <?php print $rec->field_counselingrequest_comment['und'][0]['value']; ?>
                                    </td>
                                    <td>
                                        <?php
                                            if($rec->field_attempted_on['und'][0]['value'] == 0) {
                                                $currpath = current_path();
                                                $options = array('query' => array('destination' => $currpath . '/tab/4'));
                                                print l(t('Attended'), 'request/counseling/update/'.$rec->nid, $options);
                                            } else {
                                                print 'Attended On';
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
                </td>
            </tr>
        </table>
    </div>
</div>
<!--</div>-->
<script>
    jQuery(document).ready(function() {
        ////////////////////////////////////////////////////////////////////////
        //  Show hide the content
        //  paperwork section
        jQuery('#report-paperwork').unbind('click');
        jQuery("#report-paperwork").bind("click",function() {
            jQuery('#paperwork-content').show();
            jQuery('#assessment-content').hide();
            jQuery('#stateform-content').hide();
            jQuery('#scheduling-content').hide();
            jQuery('#report-paperwork').addClass('selected');
            jQuery('#report-scheduling').removeClass('selected');
            jQuery('#report-assessment').removeClass('selected');
            jQuery('#report-stateform').removeClass('selected');
        });
        //  assessment section
        jQuery('#report-assessment').unbind('click');
        jQuery("#report-assessment").bind("click",function() {
            jQuery('#paperwork-content').hide();
            jQuery('#assessment-content').show();
            jQuery('#stateform-content').hide();
            jQuery('#scheduling-content').hide();
            jQuery('#report-paperwork').removeClass('selected');
            jQuery('#report-assessment').addClass('selected');
            jQuery('#report-scheduling').removeClass('selected');
            jQuery('#report-stateform').removeClass('selected');
        });
        //  assessment section
        jQuery('#report-stateform').unbind('click');
        jQuery("#report-stateform").bind("click",function() {
            jQuery('#paperwork-content').hide();
            jQuery('#assessment-content').hide();
            jQuery('#scheduling-content').hide();
            jQuery('#stateform-content').show();
            jQuery('#report-paperwork').removeClass('selected');
            jQuery('#report-assessment').removeClass('selected');
            jQuery('#report-scheduling').removeClass('selected');
            jQuery('#report-stateform').addClass('selected');
        });
        //  Scheduling section
        jQuery('#report-scheduling').unbind('click');
        jQuery("#report-scheduling").bind("click",function() {
            jQuery('#paperwork-content').hide();
            jQuery('#assessment-content').hide();
            jQuery('#stateform-content').hide();
            jQuery('#scheduling-content').show();
            jQuery('#report-paperwork').removeClass('selected');
            jQuery('#report-assessment').removeClass('selected');
            jQuery('#report-stateform').removeClass('selected');
            jQuery('#report-scheduling').addClass('selected');
        });
        //  Show Hide End HERE

        ////////////////////////////////////////////////////////////////////////
        //                AJAX Form Submission REQUEST START                  //
        ////////////////////////////////////////////////////////////////////////
        //  save the papaerwork request
        jQuery('#save_paper_work_verification').unbind('click');
        jQuery("#save_paper_work_verification").bind("click",function() {
            var postdata = jQuery("#paperwork-frm").serialize();
            //alert(postdata);
            ajaxRequest(postdata);
        });

        ////////////////////////////////////////////////////////////////////////
        //  save the papaerwork request
//        jQuery('#save_assessmentform_verification').unbind('click');
//        jQuery("#save_assessmentform_verification").bind("click",function() {
//            var postdata = jQuery("#assessment-frm").serialize();
//            //alert(postdata);
//            //ajaxRequestAssessmentForm(postdata);
//        });
        ////////////////////////////////////////////////////////////////////////

        //  save the stateform request
//        jQuery('#save_stateform_verification').unbind('click');
//        jQuery("#save_stateform_verification").bind("click",function() {
//            var postdata = jQuery("#stateform-frm").serialize();
//            //alert(postdata);
//            ajaxRequestStateForm(postdata);
//        });
        ////////////////////////////////////////////////////////////////////////

    });

    //  make ajax request to save the form
    function ajaxRequest(postdata) {
        // Fire the ajax request
        jQuery.ajax({
            url: '<?php print $base_url; ?>/save/paperwork/verification',
            type: 'post',
			enctype: 'multipart/form-data',
            data: { postdata: postdata },
            success: function(response) {
                jQuery('#success_msg_pprwrk').html('Record Saved successfully.');
                //alert(response);
                if(response == 'success') {
                 //   window.location.href = '<?php print $base_url; ?>/users/view/reports/<?php print arg(3); ?>/tid/<?php print arg(5); ?>/nid/<?php print arg(7); ?>/transid/<?php print arg(9); ?>/tab/1';
                }                
            }
        });//  Ajax function closed
    }

    //  make ajax request to save the form
    function ajaxRequestStateForm(postdata) {
        // Fire the ajax request
        jQuery.ajax({
            url: '<?php print $base_url; ?>/save/stateform/verification',
            type: 'post',
			enctype: 'multipart/form-data',
            data: { postdata: postdata },
            success: function(response) {
                jQuery('#success_msg_statfrm').html('Record Saved successfully.');
                //alert(response);
                if(response == 'success') {
                  //  window.location.href = '<?php print $base_url; ?>/users/view/reports/<?php print arg(3); ?>/tid/<?php print arg(5); ?>/nid/<?php print arg(7); ?>/tab/3';
                }                
            }
        });//  Ajax function closed
    }
    
    //  make ajax request to save the form
    function ajaxRequestAssessmentForm(postdata) {
        // Fire the ajax request
        jQuery.ajax({
            url: '<?php print $base_url; ?>/save/assessmentform/verification',
            type: 'post',
			enctype: 'multipart/form-data',
            data: { postdata: postdata },
            success: function(response) {
                jQuery('#success_msg_assessmentfrm').html('Record Saved successfully.');
                //alert(response);
                if(response == 'success') {
                   // window.location.href = '<?php print $base_url; ?>/users/view/reports/<?php print arg(3); ?>/tid/<?php print arg(5); ?>/nid/<?php print arg(7); ?>/tab/2';
                }
            }
        });//  Ajax function closed
    }
</script>
