<?php
global $base_url;
$stepsdata = get_special_assessment_data_status();
$stepsdata = $stepsdata[0];

$status = !$stepsdata->status;
$payment_status = !$stepsdata->payment_status;

$step_one_class = $status ? 'step step-one' : 'step step-one active';
$step_two_class = $payment_status ? 'step step-two' : 'step step-two active';
$complete_class = $payment_status ? 'steps' : 'steps active';
?>
<div id="steps-container" class="steps-container-col-2">
  <nav id="steps-wrapper">
    <ul class="<?php print $complete_class; ?>">
      <li class="<?php print $step_one_class; ?>">
        <div class="shift"><span>1</span></div>
      </li>
      <li class="<?php print $step_two_class; ?>">
        <div class="shift"><span>2</span></div>
      </li>
    </ul>
  </nav>

  <div id="steps-badge-wrapper" class="row">
    <div class="steps-col col-xs-6 col-sm-6 col-md-6">
      <?php $badge_class = arg(0) == 'user' && arg(1) == 'special' && arg(2) == 'assessment' ? 'badge-link active' : 'badge-link'; ?>
      <?php $request_url = $base_url . '/user/special/assessment?destination=special/assessment/payment'; ?>
      <h3 class="badge-heading">
        <a href="<?php print $request_url; ?>" class="<?php print $badge_class; ?>">Request Special or<br/>Rush Order Services</a>
      </h3>

      <div class="step-badge-bottom">
        <?php if ($stepsdata->status <> 0): ?>
          <span>Status: <b>Completed</b></span>
          <span>Date Requested: <b><?php print date('m-d-Y', $stepsdata->updated_on); ?></b></span>
        <?php else: ?>
          <?php if ($stepsdata->status == 0 && isset($stepsdata->status)): ?>
            <span>Status: <b>Pending</b></span>
            <span>Date Requested: <b><?php print date('m-d-Y', $stepsdata->requested_on); ?></b></span>
          <?php else: ?>
            <span>Please select assessment below and click submit, then await email invoice to make payment from.</span>
          <?php endif; ?>
        <?php endif; ?>
      </div>
    </div>

    <div class="steps-col col-xs-6 col-sm-6 col-md-6">
      <?php $badge_class = arg(0) == 'special' && arg(1) == 'assessment' && arg(2) == 'payment' ? 'badge-link active' : 'badge-link'; ?>
      <?php $request_url = $base_url . '/special/assessment/payment'; ?>
      <h3 class="badge-heading">
        <a href="<?php print $request_url; ?>" class="<?php print $badge_class; ?>">Make<br/>Payment</a>
      </h3>

      <div class="step-badge-bottom">
        <?php if (!$status): ?>
          <span>Status: <b>Pending</b></span>
          <span>Payment Status: <b>Not Paid</b></span>
          <span>Invoice sent by counselor, select assessment below to make payment.</span>
        <?php else: ?>
          <span>Click here to make payment.</span>
        <?php endif; ?>
      </div>
    </div>
  </div>
</div>
