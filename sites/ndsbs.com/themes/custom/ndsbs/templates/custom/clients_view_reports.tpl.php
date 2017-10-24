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
$address = l(t($client_name), 'user/' . $user_info->uid . '/edit') . '<br />' . $street . '<br />' . $city . ', ' . $state . ' ' . $zip;
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

$active_tab = 0;

if (arg(11)) {
  $active_tab = arg(11);
}
?>
<ul uk-tab="active: <?php print $active_tab; ?>">
  <li>
    <a href="#paperwork">Client Info</a>
  </li>
  <li>
    <a href="#assessment">Assessment</a>
  </li>
  <li>
    <a href="#interview">Schedule Interview</a>
  </li>
  <li>
    <a href="#releases">Releases</a>
  </li>
</ul>

<ul class="uk-switcher uk-margin">
  <li id="paperwork">
    <h3>Client Info</h3>
    <div class="uk-grid-match uk-child-width-expand@s" uk-grid>
      <div>
        <div class="uk-card uk-card-default uk-card-body">
          <h3 class="uk-card-title">Contact Information</h3>
          <ul class="uk-list">
            <li><?php print $address; ?></li>
            <li><?php print $phone; ?></li>
            <?php if ($second_phone): ?>
              <li><?php print $second_phone; ?></li>
            <?php endif; ?>
            <li><a href="mailto:<?php print $user_info->mail; ?>"><?php print $user_info->mail; ?></a></li>
          </ul>
        </div>
      </div>

      <div>
        <div class="uk-card uk-card-default uk-card-body">
          <h3 class="uk-card-title">Personal Details</h3>
          <ul class="uk-list">
            <li>Gender: <?php print $user_info->field_gender['und'][0]['value']; ?></li>
            <li>DOB: <?php print $dob; ?></li>
            <li>How did you hear about us? <?php print $user_info->field_referred_by['und'][0]['value']; ?></li>
          </ul>
        </div>
      </div>

      <div>
        <div class="uk-card uk-card-default uk-card-body">
          <h3 class="uk-card-title">Recipient Information</h3>
          <ul class="uk-list">
            <?php if ($recipient): ?>
              <li><?php print $recipient_name; ?></li>
              <li><?php print $recipient_title; ?></li>
              <li><?php print $recipient_company; ?></li>
              <li><?php print $recipient_address; ?></li>
            <?php else: ?>
              <li>Not Applicable</li>
            <?php endif; ?>
          </ul>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12">
        <form id="paperwork-frm" method="POST" enctype="multipart/form-data" action="<?php print $base_url.'/save/paperwork/verification';?>">
          <table class="uk-table uk-table-striped sticky-enabled">
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
                      <input type="text" class="uk-input" name="paper_work_note_<?php print $i; ?>" size="15" <?php if ($rec->field_paperwork_note['und'][0]['value']) { ?>value="<?php print $rec->field_paperwork_note['und'][0]['value']; ?>"<?php } ?> />
                      <input type="hidden" name="paper_work_node_id_<?php print $i; ?>" value="<?php print $rec->nid; ?>" />
                    </td>
                    <td>
                      <select name="verification_status_<?php print $i; ?>" class="uk-select">
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
                <td><input type="text" class="uk-input" size="15" name="new_title"></td>
                <td></td>
                <td>
                  <input type="text" class="uk-input" size="15" name="new_status">
                </td>
                <td>
                  <input type="text" class="uk-input" size="15" name="new_note" />
                  <input type="hidden" name="uid" value="<?php print arg(3);?>">
                  <input type="hidden" name="tid" value="<?php print arg(9);?>">
                  <input type="hidden" name="fiveid" value="<?php print arg(5);?>">
                  <input type="hidden" name="sevenid" value="<?php print arg(7);?>">
                </td>

                <td>
                  <select name="verification_status_new" id="verification_status" class="uk-select">
                    <option>Select</option>
                    <option value="1">Verified</option>
                    <option value="0">Not Verified</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td colspan="6">
                  <input type="hidden" name="total_count" value="<?php print $i; ?>" />
                  <input type="submit" name="button" value="Submit"  class="uk-button uk-button-primary" />
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  </li>

  <li id="assessment">
    <?php $subreport_data = get_purchased_items_subreports_report_section_trans($report_nid = arg(7), 1, 1, $report_tid = arg(5), $user_id, arg(9)); ?>
    <?php $data = get_purchased_items_reports_section_trans($report_nid = arg(7), 1, 0, $report_tid = arg(5), $user_id, arg(9)); ?>
    <?php foreach($data as $report_info_result): ?>
      <?php $termid_assessment = $report_info_result->termid; ?>
      <?php $result_report = node_load($report_info_result->nid); ?>
      <h3>Assessment</h3>
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

    <?php // Temp main reports ?>
    <?php $client_assessments = ndsbs_assessment_get_client_assessments(arg(3)); ?>
    <form id="assessment-frm" method="post" action="<?php print $base_url; ?>/save/assessmentform/verification" enctype="multipart/form-data">
      <table class="uk-table uk-table-striped sticky-enabled">
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
        <?php foreach ($client_assessments as $client_assessment): ?>
          <?php $report_data = get_purchased_items_reports_section_trans($client_assessment['nid'], 1, 0, $client_assessment['termid'], $user_id, $client_assessment['trans']); ?>
          <?php $report_data = $report_data[0]; ?>
          <tr>
            <td><?php print $client_assessment['assessment_title']; ?> Report</td>
            <td>
              <?php if ($report_data->express_mail): ?>
                <span>Requested On: <?php print date('M d, Y', $report_data->order_date); ?></span>
              <?php endif; ?>
            </td>
            <?php if ($notary_status == 'active'): ?>
              <td>
                <?php if ($report_data->notary_cost): ?>
                  <span>Requested On: <?php print date('M d, Y', $report_data->order_date); ?></span>
                <?php endif; ?>
              </td>
            <?php endif; ?>
            <td>
              <ul class="uk-subnav uk-subnav-divider">
                <?php $options_dest = array(
                  'query' => array(
                    'destination' => 'users/view/reports/'. $user_id .'/tid/' . $report_data->tid . '/nid/' . $report_data->nid . '/transid/' . $report_data->order_id . '/tab/1',
                  ),
                ); ?>

                <?php $explode = explode('.', $report_data->main_report); ?>
                <?php $file_extension = $explode[1]; ?>
                <?php $fname = $report_data->main_report; ?>
                <?php $file_name_path = 'public://reports/' . $fname; ?>

                <?php $options_report = array(
                  'query' => array('file_name_path' => $file_name_path),
                ); ?>

                <li><?php print l(t('Upload Report'), 'node/add/report-format/generate/user/report/uid/'. $user_id . '/tid/' . $report_data->tid . '/nid/' . $report_data->nid . '/id/' . $report_data->id . '/stid/' . $report_data->termid, $options_dest); ?></li>

                <?php if ($report_data->main_report): ?>
                  <li><?php print l(t($fname), $base_url . '/download/report', $options_report); ?></li>
                <?php endif; ?>
              </ul>
            </td>
            <?php if ($notary_status == 'active'): ?>
              <td></td>
            <?php endif; ?>
          </tr>
        <?php endforeach; ?>
        </tbody>
      </table>
    </form>
    <?php // End temp main reports ?>

  </li>

  <li id="interview">
    <h3>Interview</h3>
    <?php
    $query = new EntityFieldQuery();
    $entities = $query->entityCondition('entity_type', 'node')
      ->entityCondition('bundle', 'counseling_request')
      ->propertyCondition('uid', arg(3))
      ->execute();
    $nodes = node_load_multiple(array_keys($entities['node'])); ?>
    <table class="uk-table uk-table-striped sticky-enabled">
      <thead>
        <tr>
          <th>Client</th>
          <th>Preferred Counselor</th>
          <th>Comments</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($nodes as $rec): ?>
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
                <?php $options = array('query' => array('destination' => $currpath . '/tab/3'), 'attributes' => array('class' => 'btn btn-primary')); ?>
                <?php print l(t('Attended?'), 'request/counseling/update/'.$rec->nid, $options); ?>
              <?php else: ?>
                <span>Attended</span>
              <?php endif; ?>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </li>

  <li id="releases">
    <h3>Releases</h3>
    <?php
    $query = new EntityFieldQuery();
    $entities = $query->entityCondition('entity_type', 'node')
      ->entityCondition('bundle', 'release_authorization')
      ->propertyCondition('uid', $user_id)
      ->execute();
    $nodes = node_load_multiple(array_keys($entities['node']));

    $header = array(
      'Recipient',
      'Date of Authorization',
      'Date of Revocation',
      'Operations',
    );
    $rows = array();

    foreach ($nodes as $nid => $node) {
      $recipient = $node->field_recipient_name['und'][0]['value'];
      $date_of_authorization = date('m/d/Y', $node->created);
      $date_of_revocation = strtotime($node->field_revocation_date['und'][0]['value']);
      $date_of_revocation = date('m/d/Y', $date_of_revocation);

      $view_options = array(
        'attributes' => array(
          'class' => array('uk-margin-small-right'),
          'target' => '_blank',
        ),
      );

      $edit_options = array(
        'query' => array(
          'destination' => 'user/release-authorizations',
        ),
      );

      $view_path = 'node/' . $nid;
      $view = l('View', $view_path, $view_options);
      $operations = $view;

      $rows[] = array(
        $recipient,
        $date_of_authorization,
        $date_of_revocation,
        $operations,
      );
    }

    $options = array(
      'attributes' => array(
        'class' => array(
          'uk-button',
          'uk-button-primary',
        ),
      ),
      'query' => array(
        'destination' => 'user/release-authorizations',
      ),
    );

    print theme('table', array(
      'header' => $header,
      'rows' => $rows,
      'empty' => t('No records found.'),
      'sticky' => TRUE,
      'attributes' => array(
        'class' => array('uk-table-striped'),
      ),
    ));
    ?>
  </li>
</ul>
