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

date_default_timezone_set('America/New_York');
global $user;
drupal_add_js(drupal_get_path('theme', 'bootstrap_ndsbs') . '/js/clients-view-reports.js');
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

$user_name = array(
  $user_info->field_first_name['und'][0]['value'],
  $user_info->field_middle_name['und'][0]['value'],
  $user_info->field_last_name['und'][0]['value']
);

$client_name = implode(' ', $user_name);
$street = $user_info->field_address['und'][0]['value'];
$city = $user_info->field_city['und'][0]['value'];
$state = $user_info->field_state['und'][0]['value'];
$zip = $user_info->field_zip['und'][0]['value'];
$address = $street . '<br />' . $city . ', ' . $state . ' ' . $zip;
$phone = $user_info->field_phone['und'][0]['value'];
$second_phone = $user_info->field_second_phone['und'][0]['value'];
$dob = $user_info->field_month['und'][0]['value'] . '/' . $user_info->field_dobdate['und'][0]['value'] . '/' . $user_info->field_year['und'][0]['value'];
$referred_by = !empty($user_info->field_referred_by['und'][0]['value']) ? $user_info->field_referred_by['und'][0]['value'] : 'N/A';

$recipient = !empty($user_info->field_recipient_name['und'][0]['value']) ? true : false;
$recipient_name = $recipient ? $user_info->field_recipient_name['und'][0]['value'] : '';
$recipient_title = !empty($user_info->field_recipient_title['und'][0]['value']) ? $user_info->field_recipient_title['und'][0]['value'] : '';
$recipient_company = !empty($user_info->field_recipient_company['und'][0]['value']) ? $user_info->field_recipient_company['und'][0]['value'] : '';
$recipient_street = !empty($user_info->field_recipient_street['und'][0]['value']) ? $user_info->field_recipient_street['und'][0]['value'] : '';
$recipient_city = !empty($user_info->field_recipient_city['und'][0]['value']) ? $user_info->field_recipient_city['und'][0]['value'] : '';
$recipient_state = !empty($user_info->field_recipient_state['und'][0]['value']) ? $user_info->field_recipient_state['und'][0]['value'] : '';
$recipient_zip = !empty($user_info->field_recipient_zip['und'][0]['value']) ? $user_info->field_recipient_zip['und'][0]['value'] : '';
$recipient_address = !empty($recipient_street) ? $recipient_street . '<br />' . $recipient_city . ', ' . $recipient_state . ' ' . $recipient_zip : '';
?>
<ul class="nav nav-tabs">
  <li role="presentation" class="active">
    <a data-toggle="tab" href="#paperwork">Client Info</a>
  </li>
  <li role="presentation">
    <a data-toggle="tab" href="#assessment">Assessment</a>
  </li>
  <li role="presentation">
    <a data-toggle="tab" href="#interview">Schedule Interview</a>
  </li>
</ul>

<div class="tab-content">
  <div id="paperwork" class="tab-pane fade in active">
    <h2 class="tab-title"><?php print l(t($client_name), 'user/' . $user_info->uid . '/edit'); ?></h2>
    <div class="row">
      <div class="col-xs-12 col-sm-4 col-md-4">
        <ul class="list-group">
          <li class="list-group-item active">Contact Information</li>
          <li class="list-group-item"><a href="mailto:<?php print $user_info->mail; ?>"><?php print $user_info->mail; ?></a></li>
          <li class="list-group-item"><?php print $address; ?></li>
          <li class="list-group-item"><?php print $phone; ?></li>
          <?php if ($second_phone): ?>
            <li class="list-group-item"><?php print $second_phone; ?></li>
          <?php endif; ?>
        </ul>
      </div>
      <div class="col-xs-12 col-sm-4 col-md-4">
        <ul class="list-group">
          <li class="list-group-item active">Personal Details</li>
          <li class="list-group-item">Gender: <?php print $user_info->field_gender['und'][0]['value']; ?></li>
          <li class="list-group-item">DOB: <?php print $dob; ?></li>
          <li class="list-group-item">How did you hear about us? <?php print $user_info->field_referred_by['und'][0]['value']; ?></li>
        </ul>
      </div>
      <div class="col-xs-12 col-sm-4 col-md-4">
        <ul class="list-group">
          <li class="list-group-item active">Recipient Information</li>
          <?php if ($recipient): ?>
            <li class="list-group-item"><?php print $recipient_name; ?></li>
            <li class="list-group-item"><?php print $recipient_title; ?></li>
            <li class="list-group-item"><?php print $recipient_company; ?></li>
            <li class="list-group-item"><?php print $recipient_address; ?></li>
          <?php else: ?>
            <li class="list-group-item">Not Applicable</li>
          <?php endif; ?>
        </ul>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12">
        <form id="paperwork-frm" method="POST" enctype="multipart/form-data" action="<?php print $base_url.'/save/paperwork/verification';?>">
          <table class="table table-striped table-responsive sticky-enabled">
            <thead>
              <tr>
                <th>Title</th>
                <th>Selected File</th>
                <th>Status</th>
                <th>Note</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <?php $val = get_client_paperwork_info($userid = arg(3), $tid = arg(9)); ?>
              <?php $nid_array = array(); ?>
              <?php foreach ($val as $data): ?>
                <?php $nid_array[] = $data->nid; ?>
              <?php endforeach; ?>

              <?php $result = node_load_multiple($nid_array); ?>
              <?php $i = 0; ?>
              <?php $count = count($result); ?>

              <?php if ($count > 0): ?>
                <?php foreach ($result as $rec): ?>
                  <tr>
                    <td><?php print $rec->field_title['und'][0]['value']; ?></td>
                    <td>
                      <?php $explode = explode('.', $rec->field_upload['und'][0]['filename']); ?>
                      <?php $file_extension = $explode[1]; ?>
                      <a href="<?php print $base_url . '/sites/ndsbs.com/files/paperwork/' . $rec->field_upload['und'][0]['filename']; ?>" type="application/<?php print $file_extension; ?>; length=<?php print $rec->field_upload['und'][0]['filesize']; ?>"><?php print $rec->field_upload['und'][0]['filename']; ?></a>
                    </td>
                    <td>
                      <?php if ($rec->field_paperwork_status['und'][0]['value'] == 1): ?>
                        <span>Verified</span>
                      <?php else: ?>
                        <span>Not Verified</span>
                      <?php endif; ?>
                    </td>
                    <td>
                      <input type="text" class="form-control" name="paper_work_note_<?php print $i; ?>" size="15" <?php if ($rec->field_paperwork_note['und'][0]['value']) { ?>value="<?php print $rec->field_paperwork_note['und'][0]['value']; ?>"<?php } ?> />
                      <input type="hidden" name="paper_work_node_id_<?php print $i; ?>" value="<?php print $rec->nid; ?>" />
                    </td>
                    <td>
                      <select name="verification_status_<?php print $i; ?>" class="form-control">
                        <option>Select</option>
                        <option value="1">Verified</option>
                        <option value="0">Not Verified</option>
                      </select>
                    </td>
                  </tr>
                  <?php $i++; ?>
                <?php endforeach; ?>
              <?php else: ?>
                <tr>
                  <td colspan="6">No Paper work found.</td>
                </tr>
              <?php endif; ?>
              <tr>
                <td><input type="text" class="form-control" size="15" name="new_title"></td>
                <td></td>
                <td>
                  <input type="text" class="form-control" size="15" name="new_status">
                </td>
                <td>
                  <input type="text" class="form-control" size="15" name="new_note" />
                  <input type="hidden" name="uid" value="<?php print arg(3);?>">
                  <input type="hidden" name="tid" value="<?php print arg(9);?>">
                  <input type="hidden" name="fiveid" value="<?php print arg(5);?>">
                  <input type="hidden" name="sevenid" value="<?php print arg(7);?>">
                </td>

                <td>
                  <select name="verification_status_new" id="verification_status" class="form-select form-control">
                    <option>Select</option>
                    <option value="1">Verified</option>
                    <option value="0">Not Verified</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td colspan="6">
                  <input type="hidden" name="total_count" value="<?php print $i; ?>" />
                  <input type="submit" name="button" value="Submit"  class="btn btn-primary" />
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  </div>

  <div id="assessment" class="tab-pane fade">
    <?php $subreport_data = get_purchased_items_subreports_report_section_trans($report_nid = arg(7), 1, 1, $report_tid = arg(5), $user_id, arg(9)); ?>
    <?php $data = get_purchased_items_reports_section_trans($report_nid = arg(7), 1, 0, $report_tid = arg(5), $user_id, arg(9)); ?>
    <?php foreach($data as $report_info_result): ?>
      <?php $termid_assessment = $report_info_result->termid; ?>
      <?php $result_report = node_load($report_info_result->nid); ?>
      <h2 class="tab-title"><?php print $result_report->title; ?></h2>
      <?php $assigned_therapist = $report_info_result->therapist ? true : false; ?>
      <?php if ($assigned_therapist): ?>
        <?php $therapist_info = user_load($report_info_result->therapist); ?>
        <span class="clearfix"><b>Assigned Professional Counselor:</b> <?php print $therapist_info->field_first_name['und'][0]['value'] . ' ' . $therapist_info->field_last_name['und'][0]['value']; ?></span>
      <?php else: ?>
        <span class="clearfix"><b>Assigned Professional Counselor:</b> Not assigned</span>
      <?php endif; ?>
      <?php if (isset($report_info_result->updated_on) && isset($report_info_result->updated_by)): ?>
        <?php $report_gen_updated_by = user_load($report_info_result->updated_by); ?>
        <?php $generated_by = isset($report_gen_updated_by->field_first_name['und'][0]['value']) ? 'Generated by ' . $report_gen_updated_by->field_first_name['und'][0]['value'] . ' ' . $report_gen_updated_by->field_last_name['und'][0]['value'] : ''; ?>
        <?php $generated_on = isset($report_info_result->updated_on) ? ' on ' . date('M d, Y', $report_info_result->updated_on) . ' at ' . date('g:i a', $report_info_result->updated_on) : ''; ?>
        <span class="clearfix"><?php print $generated_by; ?><?php print $generated_on; ?></span>
      <?php endif; ?>
    <?php endforeach; ?>
    <form id="assessment-frm" method="post" action="<?php print $base_url; ?>/save/assessmentform/verification" enctype="multipart/form-data">
      <table class="table table-striped table-responsive sticky-enabled">
        <thead>
          <tr>
            <th>Requested Document</th>
            <th>Express Mail</th>
            <?php if ($notary_status == 'active'): ?>
              <th>Notary Request</th>
            <?php endif; ?>
            <th>Counselor's Report</th>
            <?php if ($notary_status == 'active'): ?>
              <th>Upload Notary Report</th>
            <?php endif; ?>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($data as $report_info): ?>
            <?php $term_id_assessment = $report_info->termid; ?>
            <?php $result = node_load($report_info->nid); ?>
            <tr>
              <td>Assessment Report</td>
              <td>
                <?php if ($report_info->express_mail): ?>
                  <span>Requested On: <?php print date('M d, Y', $report_info->order_date); ?></span>
                <?php endif; ?>
              </td>
              <?php if ($notary_status == 'active'): ?>
                <td>
                  <?php if ($report_info->notary_cost): ?>
                    <span>Requested On: <?php print date('M d, Y', $report_info->order_date); ?></span>
                  <?php endif; ?>
                </td>
              <?php endif; ?>
              <td>
                <?php $options_dest = array('query' => array('destination' => 'users/view/reports/'.arg(3).'/tid/'.arg(5).'/nid/'.arg(7).'/transid/'.arg(9).'/tab/2'), 'attributes' => array('class' => 'btn btn-primary')); ?>
                <?php print l(t('Upload Report'), 'node/add/report-format/generate/user/report/uid/'. arg(3) . '/tid/' . arg(5) . '/nid/' . arg(7) . '/id/'.$report_info->id.'/stid/'.$report_info->termid, $options_dest); ?>
                <?php $explode = explode('.', $report_info->main_report); ?>
                <?php $file_extension = $explode[1]; ?>
                <?php $fname = $report_info->main_report; ?>
                <?php $file_name_path = 'public://reports/'.$fname; ?>
                <?php print l(t($fname), $base_url.'/download/report', array('query' => array('file_name_path' => $file_name_path))); ?>
              </td>
              <?php if ($notary_status == 'active'): ?>
                <td></td>
              <?php endif; ?>
            </tr>
          <?php endforeach; ?>

          <?php $inc1 = 0; ?>
          <?php foreach ($subreport_data as $sub_info): ?>
            <?php if ($sub_info->main_report_id == $sub_info->termid): ?>
              <?php if ($sub_info->notary_cost): ?>
                <tr>
                  <td>
                    <span>Assessment Report</span>
                    <input type="hidden" name="assessment_oid_<?php print $inc1; ?>" value="<?php print $sub_info->id; ?>" />
                    <input type="hidden" name="termid_<?php print $inc1; ?>" value="<?php print $sub_info->termid; ?>" />
                  </td>
                  <td>
                    <?php if ($sub_info->express_mail): ?>
                      <?php $report_updated_by = user_load($sub_info->updated_by); ?>
                      <?php if ($sub_info->express_mail_status == 2): ?>
                        <span class="clearfix">Dispatched on: <?php print date('M d, Y', $sub_info->updated_on); ?>
                        <span class="clearfix">Updated by: <?php print $report_updated_by->field_first_name['und'][0]['value'] . ' ' . $report_updated_by->field_last_name['und'][0]['value']; ?></span>
                      <?php else: ?>
                        <select name="express_mail_status_<?php print $inc1; ?>" id="express_mail_status" class="form-control">
                          <option value="0">-Select-</option>
                          <option value="2">Dispatched</option>
                        </select>
                      <?php endif; ?>
                    <?php else: ?>
                      <span>Not Requested</span>
                    <?php endif; ?>
                  </td>

                  <?php if ($notary_status == 'active'): ?>
                    <td>
                      <?php if ($sub_info->notary_cost): ?>
                        <?php $report_updated_by = user_load($sub_info->updated_by); ?>
                        <?php if ($sub_info->notary_status == 2): ?>
                          <span class="clearfix">Attached</span>
                          <span class="clearfix">Updated by: <?php print $report_updated_by->field_first_name['und'][0]['value'] . ' ' . $report_updated_by->field_last_name['und'][0]['value']; ?>
                        <?php else: ?>
                          <select name="notary_status_<?php print $inc1; ?>" id="notary_status" class="form-control">
                            <option value="0">-Select-</option>
                            <option value="2">Attached</option>
                          </select>
                        <?php endif; ?>
                      <?php else: ?>
                        <span>Not Requested</span>
                      <?php endif; ?>
                    </td>
                  <?php endif; ?>

                  <td>
                    <?php $options_dest = array('query' => array('destination' => 'users/view/reports/'.arg(3).'/tid/'.arg(5).'/nid/'.arg(7).'/transid/'.arg(9).'/tab/2'), array('class' => "brown_btn dis_ib")); ?>
                    <?php print l(t('Generate Report'), 'node/add/report-format/generate/user/report/uid/'. arg(3) . '/tid/' . arg(5) . '/nid/' . arg(7) . '/id/'.$sub_info->id.'/stid/'.$sub_info->termid, $options_dest); ?>
                    <?php $explode = explode('.', $sub_info->main_report); ?>
                    <?php $file_extension = $explode[1]; ?>
                    <?php $fname = $sub_info->main_report; ?>
                    <?php $file_name_path = 'public://reports/'.$fname; ?>
                    <?php print l(t($fname), $base_url.'/download/report', array('query' => array('file_name_path' => $file_name_path))); ?>
                  </td>

                  <?php if ($notary_status == 'active'): ?>
                    <td>
                      <input type="file" name="file_<?php print $inc1; ?>" />
                      <?php $explode = explode('.', $sub_info->report_name); ?>
                      <?php $file_extension = $explode[1]; ?>
                      <?php $fname = $sub_info->report_name; ?>
                      <?php $file_name_path = 'public://reports/'.$fname; ?>
                      <?php print l(t($fname), $base_url.'/download/report', array('query' => array('file_name_path' => $file_name_path))); ?>
                    </td>
                  <?php endif; ?>
                </tr>
                <?php $inc1++; ?>
              <?php endif; ?>
            <?php endif; ?>
          <?php endforeach; ?>

          <?php $statform_array = array(21, 22, 23, 24); ?>
          <?php foreach ($subreport_data as $sub_info): ?>
            <?php if (!in_array($sub_info->termid, $statform_array)): ?>
              <?php if ($sub_info->main_report_id != $sub_info->termid): ?>
                <?php $term_id_assessment = $report_info->termid; ?>
                <?php $sub_report = taxonomy_term_load($sub_info->termid); ?>
                <?php $result = node_load($sub_info->nid); ?>
                <tr>
                  <td><?php print $sub_report->name; ?>
                    <input type="hidden" name="assessment_oid_<?php print $inc1; ?>" value="<?php print $sub_info->id; ?>" />
                    <input type="hidden" name="termid_<?php print $inc1; ?>" value="<?php print $sub_info->termid; ?>" />
                  </td>
                  <td>
                    <?php if ($sub_info->express_mail > 0): ?>
                      <?php $report_updated_by = user_load($sub_info->updated_by); ?>
                      <?php if ($sub_info->express_mail_status == 2): ?>
                        <span class="clearfix">Dispatched on: <?php print date('M d, Y', $sub_info->updated_on); ?></span>
                        <span class="clearfix">Updated by: <?php print $report_updated_by->field_first_name['und'][0]['value'] . ' ' . $report_updated_by->field_last_name['und'][0]['value']; ?></span>
                      <?php else: ?>
                        <select name="express_mail_status_<?php print $inc1; ?>" id="express_mail_status" class="form-control">
                          <option value="0">-Select-</option>
                          <option value="2">Dispatched</option>
                        </select>
                      <?php endif; ?>
                    <?php else: ?>
                      <span>Not Requested</span>
                    <?php endif; ?>
                  </td>

                  <?php if ($notary_status == 'active'): ?>
                    <td>
                      <?php if ($sub_info->notary_cost > 0): ?>
                        <?php $report_updated_by = user_load($sub_info->updated_by); ?>
                        <?php if ($sub_info->notary_status == 2): ?>
                          <span class="clearfix">Attached</span>
                          <span class="clearfix">Updated by: <?php print $report_updated_by->field_first_name['und'][0]['value'] . ' ' . $report_updated_by->field_last_name['und'][0]['value']; ?></span>
                        <?php else: ?>
                          <select name="notary_status_<?php print $inc1; ?>" id="notary_status" class="form-control">
                            <option value="0">-Select-</option>
                            <option value="2">Attached</option>
                          </select>
                        <?php endif; ?>
                      <?php else: ?>
                        <span>Not Requested</span>
                      <?php endif; ?>
                    </td>
                  <?php endif; ?>

                  <td>
                    <?php $options_dest = array('query' => array('destination' => 'users/view/reports/' . arg(3) . '/tid/' . arg(5) . '/nid/' . arg(7) . '/transid/' . arg(9) . '/tab/2')); ?>
                    <?php print l(t('Generate Report'), 'node/add/report-format/generate/user/report/uid/' . arg(3) . '/tid/' . arg(5) . '/nid/' . arg(7) . '/id/' . $sub_info->id . '/stid/' . $sub_info->termid, $options_dest); ?>
                    <?php $explode = explode('.', $sub_info->main_report); ?>
                    <?php $file_extension = $explode[1]; ?>
                    <?php $fname = $sub_info->main_report; ?>
                  </td>

                  <?php if ($notary_status == 'active'): ?>
                    <td>
                      <input type="file" name="file_<?php print $inc1; ?>" />
                      <?php $explode = explode('.', $sub_info->report_name); ?>
                      <?php $file_extension = $explode[1]; ?>
                      <?php $fname = $sub_info->report_name; ?>
                      <?php $file_name_path = 'public://reports/'.$fname; ?>
                      <?php print l(t($fname), $base_url.'/download/report', array('query' => array('file_name_path' => $file_name_path))); ?>
                    </td>
                  <?php endif; ?>
                </tr>
                <?php $inc1++; ?>
              <?php endif; ?>
            <?php endif; ?>
          <?php endforeach; ?>
          <tr style="display:none;">
            <td colspan="3">
              <input type="hidden" name="total_count" value="<?php print $inc1; ?>" />
              <input type="hidden" name="uid" value="<?php print arg(3); ?>" />
              <input type="hidden" name="tid" value="<?php print arg(5); ?>" />
              <input type="hidden" name="nid" value="<?php print arg(7); ?>" />
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  </div>
  <div id="interview" class="tab-pane fade">
    <h2 class="tab-title">Interview</h2>
    <?php
    $result = array();
    $val = get_counseling_request_info_transid(arg(9));
    $nid_array = array();
    foreach ($val as $data) {
      $nid_array[] = $data->nid;
    }
    $result = node_load_multiple($nid_array); ?>
    <table class="table table-striped table-responsive sticky-enabled">
      <thead>
        <tr>
          <th>Client</th>
          <th>Preferred Counselor</th>
          <th>Comments</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($result as $rec): ?>
          <?php $user_info = user_load($rec->uid); ?>
          <tr>
            <td>
              <?php $name = $user_info->field_first_name['und'][0]['value'] . ' ' . $user_info->field_middle_name['und'][0]['value'] . ' ' . $user_info->field_last_name['und'][0]['value']; ?>
              <span class="clearfix"><?php print l(t($name), 'user/'.$user_info->uid.'/edit'); ?></span>
              <span class="clearfix"><?php print $user_info->field_phone['und'][0]['value']; ?></span>
              <span class="clearfix"><?php print $user_info->mail; ?></span>
            </td>
            <td>
              <?php $therapist = user_load($rec->field_preferred_therapist['und'][0]['uid']); ?>
              <?php print $name = $therapist->field_first_name['und'][0]['value'] . ' ' . $therapist->field_middle_name['und'][0]['value'] . ' ' . $therapist->field_last_name['und'][0]['value']; ?>
            </td>
            <td>
              <?php print $rec->field_counselingrequest_comment['und'][0]['value']; ?>
            </td>
            <td>
              <?php if ($rec->field_attempted_on['und'][0]['value'] == 0): ?>
                <?php $currpath = current_path(); ?>
                <?php $options = array('query' => array('destination' => $currpath . '/tab/4'), 'attributes' => array('class' => 'btn btn-primary')); ?>
                <?php print l(t('Attended'), 'request/counseling/update/'.$rec->nid, $options); ?>
              <?php else: ?>
                <span>Attended On: <?php print $attempted_on = date('M d Y h:i A', $rec->field_attempted_on['und'][0]['value']); ?>
              <?php endif; ?>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>
