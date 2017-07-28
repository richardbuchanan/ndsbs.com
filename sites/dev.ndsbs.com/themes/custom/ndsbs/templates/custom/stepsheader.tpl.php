<?php
global $base_url;

//  Implemetation START for creating steps data  //
//  Questionnaire Section
$get_assessment_id = explode('/', $_SESSION['COMPLETE_MY_QUESTIONNAIRE']);
$assessment_id = $get_assessment_id[2];
$transid = $get_assessment_id[4];
$termid = $get_assessment_id[6];

$question_info = get_total_attempted_times($assessment_id, $transid);
$total_attempts = $question_info['total_attempts'];
$total_time = $question_info['total_time'];
$evaluation_status = $question_info['evaluation'];

//  Get total number of attempts
if($total_attempts <> '') {
  $times = $total_attempts;
} else {
  $times = 0;
}

//  Paper work Section
//  function defined to load the content type paper-work
$val = get_paperwork_info_transid($transid);
$nid_array = array();
foreach ($val as $data) {
  $nid_array[] = $data->nid;
}

//  load the node data
$result = node_load_multiple($nid_array);

// Set the timezone.
date_default_timezone_set('America/New_York');

foreach($result as $rec_data_steps) {
  if($rec_data_steps->field_paperwork_status['und'][0]['value'] == 1) {
    $verified_date = date('m-d-Y', $rec_data_steps->changed);
  }
}

//  Scheduling counselin gsection
$coun_data = get_counseling_request_info_transid($transid);
$counseling_data = is_array($coun_data) && isset($coun_data[0]->nid) ? node_load($coun_data[0]->nid) : 0;

//
$data_transaction = get_transaction_data_by_transid($transid);
$order_date = date('m-d-Y', $data_transaction[0]->order_date);
//  Implemetation END for creating steps data  //
$nid = node_load($assessment_id);

/**
 * BEGIN BDG DEVELOPMENT
 *
 * DO NOT MODIFY/REMOVE ANYTHING IN THIS SECTION WITHOUT CONTACTING ME FIRST!!!
 *
 * @contact Richard Buchanan <richard_buchanan@buchanandesigngroup.com>
 * @link http://www.buchanandesigngroup.com @endlink
 */
global $user;
$pdf = $user->uid . '.pdf';
$uri = 'public://reports/uploaded/' . $pdf;
/**
 * END BDG DEVELOPMENT
 */
?>

<?php
//  Report download section
$data = get_purchased_items_reports_trans($assessment_id, 1, 0, $termid, $transid);
foreach($data as $report_info) {
}

drupal_set_title($nid->field_assessment_title['und'][0]['value']);

$report_status = empty($report_info->main_report);
$eval_status = !empty($evaluation_status) && $report_status;
$attempt_status = empty($counseling_data->field_attempted_on['und'][0]['value']) && $report_status;
$paperwork_status = empty($rec_data_steps->field_paperwork_status['und'][0]['value']) && $report_status;

$step_one_attributes = array(
  'class' => array(
    'uk-text-center',
    'step-one',
  ),
);
if (!empty($eval_status)) {
  $step_one_attributes['class'][] = 'uk-active';
}

$step_two_attributes = array(
  'class' => array(
    'uk-text-center',
    'step-two',
  ),
);
if (!empty($attempt_status)) {
  $step_two_attributes['class'][] = 'uk-active';
}

$step_three_attributes = array(
  'class' => array(
    'uk-text-center',
    'step-three',
  ),
);
if (!empty($paperwork_status)) {
  $step_three_attributes['class'][] = 'uk-active';
}

$step_four_attributes = array(
  'class' => array(
    'uk-text-center',
    'step-four',
  ),
);
if (!empty($report_status)) {
  $step_four_attributes['class'][] = 'uk-active';
}

$steps_attributes = array(
  'class' => array(
    'uk-child-width-1-4',
    'steps',
  ),
  'uk-grid' => '',
);
if ($report_status) {
  $steps_attributes['class'][] = 'uk-active';
}

$current_step = explode('/', current_path());
$step = arg(0);
$step_one_arrow_class = 'arrow';
$step_two_arrow_class = 'arrow';
$step_three_arrow_class = 'arrow';
$step_four_arrow_class = 'arrow';
switch ($step) {
  case 'questionnaire':
    $step_one_arrow_class .= ' arrow-active';
    break;
  case 'node':
    $step_two_arrow_class .= ' arrow-active';
    break;
  case 'user':
    $step_three_arrow_class .= ' arrow-active';
    break;
  case 'view':
    $step_four_arrow_class .= ' arrow-active';
    break;
}
?>
<?php $questionnaire_url = $base_url . '/' . $_SESSION['COMPLETE_MY_QUESTIONNAIRE']; ?>
<?php $counseling_url = $base_url . '/node/add/counseling-request?destination=user/paperwork/list'; ?>
<?php $necessary_docs_url = $base_url . '/user/paperwork/list'; ?>
<?php $report_url = $base_url . '/view/assessment/report'; ?>
<span id="steps-header-order-date">Order date: <?php print $order_date; ?></span>
<div id="steps-container" class="steps-container-col-4">
  <nav id="steps-wrapper">
    <ul<?php print drupal_attributes($steps_attributes); ?>>
      <li<?php print drupal_attributes($step_one_attributes); ?>>
        <a href="<?php print $questionnaire_url; ?>">
          <button class="uk-button uk-button-default uk-button-large">1</button>
          <?php $badge_class = arg(0) == 'questionnaire' && arg(1) == 'start' ? 'badge-link active' : 'badge-link'; ?>
          <h3 class="badge-heading uk-text-left">
            <a href="<?php print $questionnaire_url; ?>" class="<?php print $badge_class; ?>">Complete<br />My Questionnaire</a>
          </h3>

          <div class="step-badge-bottom uk-text-left">
            <?php $attempts_badge = $evaluation_status == 1 ? 'Completed' : 'Pending'; ?>
            <p>No. Of Attempts: <b><?php print $times; ?></b></p>
            <p>Status: <b><?php print $attempts_badge; ?></b></p>
          </div>
        </a>
      </li>
      <li<?php print drupal_attributes($step_two_attributes); ?>>
        <a href="<?php print $counseling_url; ?>">
          <button class="uk-button uk-button-default uk-button-large">2</button>
          <?php $badge_class = arg(0) == 'node' && arg(1) == 'add' && arg(2) == 'counseling-request' ? 'badge-link active' : 'badge-link'; ?>
          <h3 class="badge-heading uk-text-left">
            <a href="<?php print $counseling_url; ?>" class="<?php print $badge_class; ?>">Schedule<br/>My Interview</a>
          </h3>

          <div class="step-badge-bottom uk-text-left">
            <?php $attendance = isset($counseling_data->field_attempted_on['und']) ? $counseling_data->field_attempted_on['und'][0]['value'] : 0; ?>
            <?php $attended_badge = $attendance != 0 ? 'Attended' : 'Not Attended'; ?>
            <p>Status: <b><?php print $attended_badge; ?></b></p>
            <?php if ($attendance == 0): ?>
              <p>Call Now to Schedule (9 a.m. – 5 p.m. EST) OR indicate & Save appt. request below</p>
            <?php endif; ?>
          </div>
        </a>
      </li>
      <li<?php print drupal_attributes($step_three_attributes); ?>>
        <a href="<?php print $necessary_docs_url; ?>">
          <button class="uk-button uk-button-default uk-button-large">3</button>
          <?php $user_paperwork = arg(0) == 'user' && arg(1) == 'paperwork' && arg(2) == 'list' ? true : false; ?>
          <?php $node_paperwork = arg(0) == 'node' && arg(2) == 'paper-work' ? true : false; ?>
          <?php $node_edit = arg(0) == 'node' && arg(2) == 'edit' ? true : false; ?>
          <?php $badge_class = $user_paperwork || $node_paperwork || $node_edit ? 'badge-link active' : 'badge-link'; ?>
          <h3 class="badge-heading uk-text-left">
            <a href="<?php print $necessary_docs_url; ?>" class="<?php print $badge_class; ?>">Upload or Fax Documents<br>(If your evaluator requests)</a>
          </h3>

          <div class="step-badge-bottom uk-text-left">
            <?php $verify_date = !empty($verified_date) ? $verified_date : 'Unverified'; ?>
            <p>Verified On: <b><?php print $verify_date; ?></b></p>
            <?php if (empty($verified_date)): ?>
              <p>Submit documents requested by your counselor</p>
            <?php endif; ?>
          </div>
        </a>
      </li>
      <li<?php print drupal_attributes($step_four_attributes); ?>>
        <a href="<?php print $report_url; ?>">
          <button class="uk-button uk-button-default uk-button-large">4</button>
          <?php $user_report = arg(0) == 'view' && arg(1) == 'assessment' && arg(2) == 'report' ? true : false; ?>
          <?php $email_report = arg(0) == 'user' && arg(1) == 'email' && arg(2) == 'report' ? true : false; ?>
          <?php $badge_class = $user_report || $email_report ? 'badge-link active' : 'badge-link'; ?>
          <h3 class="badge-heading uk-text-left">
            <a href="<?php print $report_url; ?>" class="<?php print $badge_class; ?>">View My<br/>Assessment Report</a>
          </h3>

          <div class="step-badge-bottom uk-text-left">
            <?php if ($report_info->main_report == ''): ?>
              <p>Status: <b>Pending</b></p>
              <p>Must complete the 3 Steps to the left to receive a report.</p>
            <?php else: ?>
              <?php $fname = $report_info->main_report; ?>
              <?php $file_name_path = 'public://reports/' . $fname; ?>
              <?php $file_time = date("n/j/Y @ g:i a", $report_info->updated_on); ?>
              <p>Status: <b>Uploaded <?php print $file_time; ?></b></p>
              <div class="status-complete add-testimonial">
                <p>Would you like to <a href="https://www.ndsbs.com/testimonials/add?destination=<?php print bdg_ndsbs_get_steps_page_no_base_url(); ?>">add a testimonial</a>?</p>
              </div>
            <?php endif; ?>
          </div>
        </a>
      </li>
    </ul>
  </nav>
</div>
