<?php
$get_assessment_id = explode('/', $_SESSION['COMPLETE_MY_QUESTIONNAIRE']);
$assessment_id = $get_assessment_id[2];
$transid = $get_assessment_id[4];
$termid = $get_assessment_id[6];

$question_info = get_total_attempted_times($assessment_id, $transid);
$total_attempts = $question_info['total_attempts'];
$total_time = $question_info['total_time'];
$evaluation_status = $question_info['evaluation'];

if ($total_attempts <> '') {
  $times = $total_attempts;
}
else {
  $times = 0;
}

$val = get_paperwork_info_transid($transid);
$nid_array = array();

foreach ($val as $data) {
  $nid_array[] = $data->nid;
}

$result = node_load_multiple($nid_array);
date_default_timezone_set('America/New_York');

foreach($result as $rec_data_steps) {
  if ($rec_data_steps->field_paperwork_status['und'][0]['value'] == 1) {
    $verified_date = date('m-d-Y', $rec_data_steps->changed);
  }
}

$coun_data = get_counseling_request_info_transid($transid);
$counseling_data = is_array($coun_data) && isset($coun_data[0]->nid) ? node_load($coun_data[0]->nid) : 0;

$data_transaction = get_transaction_data_by_transid($transid);
$order_date = date('m-d-Y', $data_transaction[0]->order_date);

$nid = node_load($assessment_id);

$data = get_purchased_items_reports_trans($assessment_id, 1, 0, $termid, $transid);
foreach($data as $report_info) {
}

drupal_set_title($nid->field_assessment_title['und'][0]['value']);

$report_status = empty($report_info->main_report);
$eval_status = !empty($evaluation_status) && $report_status;
$attempt_status = empty($counseling_data->field_attempted_on['und'][0]['value']) && $report_status;
$paperwork_status = empty($rec_data_steps->field_paperwork_status['und'][0]['value']) && $report_status;

$step_one_attributes = array('class' => array('step-one'));
if ($eval_status) {
  $step_one_attributes['class'][] = 'uk-active';
}

$step_two_attributes = array('class' => array('step-two'));
if ($attempt_status) {
  $step_two_attributes['class'][] = 'uk-active';
}

$step_three_attributes = array('class' => array('step-three'));
if ($paperwork_status) {
  $step_three_attributes['class'][] = 'uk-active';
}

$step_four_attributes = array('class' => array('step-four'));
if ($report_status) {
  $step_four_attributes['class'][] = 'uk-active';
}

$questionnaire_url = '/' . $_SESSION['COMPLETE_MY_QUESTIONNAIRE'];
$counseling_url = '/node/add/counseling-request?destination=user/paperwork/list';
$necessary_docs_url = '/user/paperwork/list';
$report_url = '/view/assessment/report';
?>

<span id="steps-header-order-date">Order date: <?php print $order_date; ?></span>
<ul class="uk-child-width-1-1 uk-child-width-1-4@l uk-grid-small" uk-grid>

  <li<?php print drupal_attributes($step_one_attributes); ?>>
    <h3>Complete My Questionnaire</h3>
    <?php $attempts_status = $evaluation_status == 1 ? 'Completed' : 'Pending'; ?>
    <div>No. Of Attempts: <b><?php print $times; ?></b></div>
    <div>Status: <b><?php print $attempts_status; ?></b></div>
  </li>

  <li<?php print drupal_attributes($step_two_attributes); ?>>
    <h3>Schedule My Interview</h3>
    <?php $attendance = isset($counseling_data->field_attempted_on['und']) ? $counseling_data->field_attempted_on['und'][0]['value'] : 0; ?>
    <?php $attended_badge = $attendance != 0 ? 'Attended' : 'Not Attended'; ?>
    <div>Status: <b><?php print $attended_badge; ?></b></div>
    <?php if ($attendance == 0): ?>
      <div>Call Now to Schedule (9 a.m. – 5 p.m. EST) OR indicate & Save appt. request below</div>
    <?php endif; ?>
  </li>

  <li<?php print drupal_attributes($step_three_attributes); ?>>
    <?php $user_paperwork = arg(0) == 'user' && arg(1) == 'paperwork' && arg(2) == 'list' ? true : false; ?>
    <?php $node_paperwork = arg(0) == 'node' && arg(2) == 'paper-work' ? true : false; ?>
    <?php $node_edit = arg(0) == 'node' && arg(2) == 'edit' ? true : false; ?>

    <h3>Upload or Fax Documents (If your evaluator requests)</h3>
    <?php $verify_date = !empty($verified_date) ? $verified_date : 'Unverified'; ?>
    <div>Verified On: <b><?php print $verify_date; ?></b></div>
    <?php if (empty($verified_date)): ?>
      <div>Submit documents requested by your counselor</div>
    <?php endif; ?>
  </li>

  <li<?php print drupal_attributes($step_four_attributes); ?>>
    <?php $user_report = arg(0) == 'view' && arg(1) == 'assessment' && arg(2) == 'report' ? true : false; ?>
    <?php $email_report = arg(0) == 'user' && arg(1) == 'email' && arg(2) == 'report' ? true : false; ?>

    <h3>View My Assessment Report</h3>
    <?php if ($report_info->main_report == ''): ?>
      <div>Status: <b>Pending</b></div>
      <div>Must complete the 3 Steps to the left to receive a report.</div>
    <?php else: ?>
      <?php $fname = $report_info->main_report; ?>
      <?php $file_name_path = 'public://reports/' . $fname; ?>
      <?php $file_time = date("n/j/Y @ g:i a", $report_info->updated_on); ?>
      <div>Status: <b>Uploaded <?php print $file_time; ?></b></div>
      <div>Would you like to <a href="https://www.ndsbs.com/testimonials/add?destination=<?php print bdg_ndsbs_get_steps_page_no_base_url(); ?>">add a testimonial</a>?</div>
    <?php endif; ?>
  </li>

</ul>
