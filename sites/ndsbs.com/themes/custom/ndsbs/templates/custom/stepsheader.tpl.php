<?php
//$assessment_data = get_purchased_questionnaire_assessment_list_leftpanel();
$assessment_data = explode('/', $_SESSION['COMPLETE_MY_QUESTIONNAIRE']);
$assessment_id = $assessment_data[2];
$transid = $assessment_data[4];
$termid = $assessment_data[6];

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

$paperwork_status = 0;
foreach($result as $rec_data_steps) {
  if ($rec_data_steps->field_paperwork_status['und'][0]['value'] == 1) {
    $verified_date = date('m-d-Y', $rec_data_steps->changed);
    $paperwork_status = 1;
  }
}

$coun_data = get_counseling_request_info_transid($transid);
$counseling_data = is_array($coun_data) && isset($coun_data[0]->nid) ? node_load($coun_data[0]->nid) : 0;
$attendance = isset($counseling_data->field_attempted_on['und']) ? $counseling_data->field_attempted_on['und'][0]['value'] : 0;

$data_transaction = get_transaction_data_by_transid($transid);
$order_date = date('m-d-Y', $data_transaction[0]->order_date);

$nid = node_load($assessment_id);
$data = get_purchased_items_reports_trans($assessment_id, 1, 0, $termid, $transid);

$client_reports = get_all_client_reports($transid);
$documents_status = $paperwork_status || (!empty($client_reports) && !empty($report_info));

$report_info = array();
foreach($data as $report) {
  $report_info = $report;
}

$questionnaire_url = '/' . $_SESSION['COMPLETE_MY_QUESTIONNAIRE'];
$counseling_url = '/schedule/interview?destination=user/paperwork/list';
$necessary_docs_url = '/user/paperwork/list';
$report_url = '/view/assessment/report';

/**
 * Step one attributes.
 */
$step_one_attributes = array('class' => array('step-one'));
$step_one_button_attributes = array(
  'href' => $questionnaire_url,
  'class' => array('uk-icon-button'),
);
$step_one_title_attributes = array(
  'class' => array(
    'steps-header-title',
    'uk-text-center@l',
  ),
);
if ($evaluation_status) {
  $step_one_button_attributes['class'][] = 'uk-button-success';
  $step_one_title_attributes['class'][] = 'step-completed';
}
else {
  $step_one_button_attributes['class'][] = 'uk-button-primary';
}
if (substr(current_path(), 0, 19) === 'questionnaire/start') {
  $step_one_attributes['class'][] = 'uk-active';
  drupal_set_title('Complete My Questionnaire');
}

/**
 * Step two attributes.
 */
$step_two_attributes = array('class' => array('step-two'));
$step_two_button_attributes = array(
  'href' => $counseling_url,
  'class' => array('uk-icon-button'),
);
$step_two_title_attributes = array(
  'class' => array(
    'steps-header-title',
    'uk-text-center@l',
  ),
);
if ($attendance) {
  $step_two_button_attributes['class'][] = 'uk-button-success';
  $step_two_title_attributes['class'][] = 'step-completed';
}
else {
  $step_two_button_attributes['class'][] = 'uk-button-primary';
}
if (current_path() == 'schedule/interview') {
  $step_two_attributes['class'][] = 'uk-active';
  drupal_set_title('Schedule My Interview');
}

/**
 * Step three attributes.
 */
$step_three_attributes = array('class' => array('step-three'));
$step_three_button_attributes = array(
  'href' => $necessary_docs_url,
  'class' => array('uk-icon-button'),
);
$step_three_title_attributes = array(
  'class' => array(
    'steps-header-title',
    'uk-text-center@l',
  ),
);
if ($documents_status) {
  $step_three_button_attributes['class'][] = 'uk-button-success';
  $step_three_title_attributes['class'][] = 'step-completed';
}
else {
  $step_three_button_attributes['class'][] = 'uk-button-primary';
}
if (current_path() == 'user/paperwork/list') {
  $step_three_attributes['class'][] = 'uk-active';
  drupal_set_title('Upload or Fax Documents');
}

/**
 * Step four attributes.
 */
$step_four_attributes = array('class' => array('step-four'));
$step_four_button_attributes = array(
  'href' => $report_url,
  'class' => array('uk-icon-button'),
);
$step_four_title_attributes = array(
  'class' => array(
    'steps-header-title',
    'uk-text-center@l',
  ),
);
if (!empty($client_reports) && $report_info->main_report) {
  $step_four_button_attributes['class'][] = 'uk-button-success';
  $step_four_title_attributes['class'][] = 'step-completed';
}
else {
  $step_four_button_attributes['class'][] = 'uk-button-primary';
}
if (current_path() == 'view/assessment/report') {
  $step_four_attributes['class'][] = 'uk-active';
  drupal_set_title('View My Assessment Report');
}

$step_one_button_classes =  implode(' ', $step_one_button_attributes['class']) . ' uk-hidden@l uk-margin-right';
$step_two_button_classes =  implode(' ', $step_two_button_attributes['class']) . ' uk-hidden@l uk-margin-right';
$step_three_button_classes =  implode(' ', $step_three_button_attributes['class']) . ' uk-hidden@l uk-margin-right';
$step_four_button_classes =  implode(' ', $step_four_button_attributes['class']) . ' uk-hidden@l uk-margin-right';
?>

<div id="steps-header-order-date" class="uk-display-inline-block uk-margin-bottom uk-width-1-1 uk-visible@l">
  <span class="uk-float-right">Order date: <?php print $order_date; ?></span>
</div>

<ul class="uk-nav uk-nav-default uk-margin-bottom uk-hidden@l">
  <li<?php print drupal_attributes($step_one_attributes); ?>>
    <a href="<?php print $questionnaire_url; ?>">1. Complete My Questionnaire</a>
  </li>

  <li<?php print drupal_attributes($step_two_attributes); ?>>
    <a href="<?php print $counseling_url; ?>">2. Schedule My Interview</a>
  </li>

  <li<?php print drupal_attributes($step_three_attributes); ?>>
    <a href="<?php print $necessary_docs_url; ?>">3. Upload or Fax Documents</a>
  </li>

  <li<?php print drupal_attributes($step_four_attributes); ?>>
    <a href="<?php print $report_url; ?>">4. View My Assessment Report</a>
  </li>

</ul>

<ul id="steps-header-progress" class="uk-child-width-1-4@l uk-grid-small uk-visible@l" uk-grid>
  <li class="uk-text-center">
    <h3><a<?php print drupal_attributes($step_one_button_attributes); ?>>1</a></h3>
  </li>
  <li class="uk-text-center">
    <h3><a<?php print drupal_attributes($step_two_button_attributes); ?>>2</a></h3>
  </li>
  <li class="uk-text-center">
    <h3><a<?php print drupal_attributes($step_three_button_attributes); ?>>3</a></h3>
  </li>
  <li class="uk-text-center">
    <h3><a<?php print drupal_attributes($step_four_button_attributes); ?>>4</a></h3>
  </li>
</ul>

<ul id="steps-header-steps" class="uk-child-width-1-1 uk-child-width-1-4@l uk-grid-small uk-margin-bottom uk-visible@l" uk-grid>
  <li<?php print drupal_attributes($step_one_attributes); ?>>
    <div class="steps-header-content uk-height-1-1@l">
      <h3<?php print drupal_attributes($step_one_title_attributes); ?>>
        <a href="<?php print $questionnaire_url; ?>">
          <span class="<?php print $step_one_button_classes; ?>">1</span>Complete My Questionnaire</a>
      </h3>

      <?php $attempts_status = $evaluation_status == 1 ? 'Completed' : 'Pending'; ?>

      <div class="steps-header-footer">
        <div><strong>No. Of Attempts</strong>: <?php print $times; ?></div>
        <div><strong>Status</strong>: <?php print $attempts_status; ?></div>
      </div>
    </div>
  </li>

  <li<?php print drupal_attributes($step_two_attributes); ?>>
    <div class="steps-header-content uk-height-1-1@l">
      <h3<?php print drupal_attributes($step_two_title_attributes); ?>>
        <a href="<?php print $counseling_url; ?>">
          <span class="<?php print $step_two_button_classes; ?>">2</span>Schedule My Interview
        </a>
      </h3>

      <?php $attended_badge = $attendance != 0 ? 'Attended' : 'Not Attended'; ?>

      <div class="steps-header-footer">
        <div><strong>Status</strong>: <?php print $attended_badge; ?></div>
        <?php if (!$counseling_data): ?>
          <p class="uk-margin-remove-bottom">Submit interview request <strong>OR</strong> call to schedule interview (9 a.m. – 5 p.m. EST): <a href="tel: 1-800-671-8589">1-800-671-8589</a></p>
        <?php elseif (!$attendance): ?>
          <p>A representative will call shortly to schedule your appointment</p>
        <?php endif; ?>
      </div>
    </div>
  </li>

  <li<?php print drupal_attributes($step_three_attributes); ?>>
    <?php $user_paperwork = arg(0) == 'user' && arg(1) == 'paperwork' && arg(2) == 'list' ? true : false; ?>
    <?php $node_paperwork = arg(0) == 'node' && arg(2) == 'paper-work' ? true : false; ?>
    <?php $node_edit = arg(0) == 'node' && arg(2) == 'edit' ? true : false; ?>

    <div class="steps-header-content uk-height-1-1@l">
      <h3<?php print drupal_attributes($step_three_title_attributes); ?>>
        <a href="<?php print $necessary_docs_url; ?>">
          <span class="<?php print $step_three_button_classes; ?>">3</span>Upload or Fax Documents
        </a>
      </h3>

      <?php $verify_date = !empty($verified_date) ? $verified_date : 'Unverified'; ?>

      <div class="steps-header-footer">
        <div><strong>Verified On</strong>: <?php print $verify_date; ?></div>
        <?php if (empty($verified_date)): ?>
          <p class="uk-margin-remove-bottom">Use this step only if your evaluator requests specific documents during your interview.</p>
        <?php endif; ?>
      </div>
    </div>
  </li>

  <li<?php print drupal_attributes($step_four_attributes); ?>>
    <?php $user_report = arg(0) == 'view' && arg(1) == 'assessment' && arg(2) == 'report' ? true : false; ?>
    <?php $email_report = arg(0) == 'user' && arg(1) == 'email' && arg(2) == 'report' ? true : false; ?>

    <div class="steps-header-content uk-height-1-1@l">
      <h3<?php print drupal_attributes($step_four_title_attributes); ?>>
        <a href="<?php print $report_url; ?>">
          <span class="<?php print $step_four_button_classes; ?>">4</span>View My Assessment Report
        </a>
      </h3>

      <div class="steps-header-footer">
        <?php if (empty($client_reports) || !$report_info->main_report): ?>
          <p><strong>Status</strong>: Pending</p>
          <p class="uk-margin-remove-bottom">Must complete first three steps to receive a report.</p>
        <?php else: ?>
          <?php $fname = $report_info->main_report; ?>
          <?php $file_name_path = 'public://reports/' . $fname; ?>
          <?php $file_time = date("n/j/Y @ g:i a", $report_info->updated_on); ?>
          <div>Status: <b>Uploaded <?php print $file_time; ?></b></div>
          <p class="uk-margin-remove-bottom">Would you like to <a href="https://www.ndsbs.com/testimonials/add?destination=<?php print bdg_ndsbs_get_steps_page_no_base_url(); ?>">add a testimonial</a>?</p>
        <?php endif; ?>
      </div>
    </div>
  </li>

</ul>
