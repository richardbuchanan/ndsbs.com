<?php
global $base_url;

// function defined to load the content type paper-work
$val = get_stateform_info();

$nid_array = array();
foreach ($val as $data) {
  $nid_array[] = $data->nid;
}

// load the node data
$result = node_load_multiple($nid_array);
$steps_data = $result;

$i = 1;
foreach($steps_data as $stepsdata1) {
  if($i == 1) {
      $stepsdata = $stepsdata1;
  }
  $i++;
}

$form_title = empty($stepsdata->field_state_form_title['und'][0]['value']);
$payment_status = empty($stepsdata->field_state_form_payment_status['und'][0]['value']);
$form_report = empty($stepsdata->field_report_state_form['und'][0]['value']);

$step_one_class = $form_title ? 'step step-one' : 'step step-one active';
$step_two_class = $payment_status ? 'step step-two' : 'step step-two active';
$step_three_class = $form_report ? 'step step-three' : 'step step-three active';
$complete_class = $form_report ? 'steps' : 'steps active';
?>
<div id="steps-container" class="steps-container-col-3">
  <nav id="steps-wrapper">
    <ul class="<?php print $complete_class; ?>">
      <li class="<?php print $step_one_class; ?>">
        <div class="shift"><span>1</span></div>
      </li>
      <li class="<?php print $step_two_class; ?>">
        <div class="shift"><span>2</span></div>
      </li>
      <li class="<?php print $step_three_class; ?>">
        <div class="shift"><span>3</span></div>
      </li>
    </ul>
  </nav>

  <div id="steps-badge-wrapper" class="row">
    <div class="steps-col col-xs-6 col-sm-6 col-md-4">
      <?php $badge_class = arg(0) == 'node' && arg(1) == 'add' && arg(2) == 'state-form-request' ? 'badge-link active' : 'badge-link'; ?>
      <?php $request_url = $base_url . '/node/add/state-form-request?destination=node/add/state-form-request'; ?>
      <h3 class="badge-heading">
        <a href="<?php print $request_url; ?>" class="<?php print $badge_class; ?>">Upload My State<br />DMV Forms</a>
      </h3>

      <div class="step-badge-bottom">
        <?php if (!$form_title): ?>
          <span>Status: <b>Completed</b></span>
          <span>Date: <b><?php print date('m-d-Y', $stepsdata->changed); ?></b></span>
        <?php else: ?>
          <?php if (!empty($stepsdata->created)): ?>
            <span>Status: <b>Pending</b></span>
            <span>Date: <b><?php print date('m-d-Y', $stepsdata->created); ?></b></span>
          <?php else: ?>
            <span>Please upload the document requested by your counselor to complete the assessment process.</span>
          <?php endif; ?>
        <?php endif; ?>
      </div>
    </div>

    <div class="steps-col col-xs-6 col-sm-6 col-md-4">
      <?php $badge_class = (arg(1) == 'add' && arg(2) == 'police-report') || ($_REQUEST['reptype'] == 'statefrm') ? 'badge-link active' : 'badge-link'; ?>
      <?php $request_url = $base_url . '/user/report/request?reptype=statefrm'; ?>
      <h3 class="badge-heading">
        <a href="<?php print $request_url; ?>" class="<?php print $badge_class; ?>">Make<br />Payment</a>
      </h3>

      <div class="step-badge-bottom">
        <?php if (!$payment_status): ?>
          <span>Status: <b>Completed</b></span>
          <span>Date: <b><?php print date('m-d-Y', $stepsdata->changed); ?></b></span>
        <?php else: ?>
          <?php if (!empty($stepsdata->created)): ?>
            <?php if ($stepsdata->field_invoice_created_by['und'][0]['value']): ?>
              <span>Invoice sent by counselor</span>
            <?php endif; ?>
            <span>Status: <b>Pending</b></span>
            <span>Payment Status: <b>Not Paid</b></span>
          <?php else: ?>
            <span>Please make a payment.</span>
          <?php endif; ?>
        <?php endif; ?>
      </div>
    </div>

    <div class="steps-col col-xs-6 col-sm-6 col-md-4">
      <?php $badge_class = arg(0) == 'user' && arg(1) == 'stateform' && arg(2) == 'list' ? 'badge-link active' : 'badge-link'; ?>
      <?php $request_url = $base_url . '/user/stateform/list'; ?>
      <h3 class="badge-heading">
        <a href="<?php print $request_url; ?>" class="<?php print $badge_class; ?>">View Completed<br />DMV Forms</a>
      </h3>

      <div class="step-badge-bottom">
        <?php $view_status = 0; ?>
        <?php if (!$form_report): ?>
          <?php $view_status = 1; ?>
          <span>Status: <b>Completed</b></span>
          <?php $fname = $rec->field_report_state_form['und'][0]['value']; ?>
          <?php $file_name_path = 'public://reports/' . $fname; ?>
          <?php print l(t($fname), $base_url.'/download/report', array('query' => array('file_name_path' => $file_name_path))); ?>
        <?php else: ?>
          <?php if (!empty($stepsdata->created)): ?>
            <span>Status: <b>Pending</b></span>
            <span>Date: <b><?php print date('m-d-Y', $stepsdata->created); ?></b></span>
          <?php else: ?>
            <span>View your report.</span>
          <?php endif; ?>
        <?php endif; ?>
      </div>
    </div>
  </div>
</div>
