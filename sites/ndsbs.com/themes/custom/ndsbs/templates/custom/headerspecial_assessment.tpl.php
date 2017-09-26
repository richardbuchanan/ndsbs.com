<?php
global $base_url;
$stepsdata = get_special_assessment_data_status();
$stepsdata = $stepsdata[0];

$status = $stepsdata->status ? TRUE : FALSE;
$payment_status = $stepsdata->payment_status ? TRUE : FALSE;

$step_one_attributes = array(
  'id' => 'step-one',
);
$step_two_attributes = array(
  'id' => 'step-two',
);

if (current_path() == 'user/special/assessment') {
  $step_one_attributes['class'][] = 'uk-active';
}
elseif (current_path() == 'special/assessment/payment') {
  $step_two_attributes['class'][] = 'uk-active';
}

$step_one_button_attributes = array(
  'href' => '/user/special/assessment?destination=special/assessment/payment',
  'class' => array('uk-icon-button'),
);
$step_one_title_attributes = array(
  'class' => array(
    'steps-header-title',
    'uk-text-center@l',
  ),
);

if ($status) {
  $step_one_button_attributes['class'][] = 'uk-button-success';
  $step_one_title_attributes['class'][] = 'step-completed';
}
else {
  $step_one_button_attributes['class'][] = 'uk-button-primary';
}

$step_two_button_attributes = array(
  'href' => '/special/assessment/payment',
  'class' => array('uk-icon-button'),
);
$step_two_title_attributes = array(
  'class' => array(
    'steps-header-title',
    'uk-text-center@l',
  ),
);

if ($payment_status) {
  $step_two_button_attributes['class'][] = 'uk-button-success';
  $step_two_title_attributes['class'][] = 'step-completed';
}
else {
  $step_two_button_attributes['class'][] = 'uk-button-primary';
}

$step_one_button_classes =  implode(' ', $step_one_button_attributes['class']) . ' uk-hidden@l uk-margin-right';
$step_two_button_classes =  implode(' ', $step_two_button_attributes['class']) . ' uk-hidden@l uk-margin-right';

?>
<ul class="uk-nav uk-nav-default uk-margin-bottom uk-hidden@l">
  <li<?php print drupal_attributes($step_one_attributes); ?>>
    <a href="/user/special/assessment?destination=special/assessment/payment">1. Request Special or Rush Order Services</a>
  </li>

  <li<?php print drupal_attributes($step_two_attributes); ?>>
    <a href="/special/assessment/payment">2. Make Payment</a>
  </li>
</ul>

<ul id="steps-header-progress" class="uk-child-width-1-2@l uk-grid-small uk-visible@l" uk-grid>
  <li class="uk-text-center">
    <h3><a<?php print drupal_attributes($step_one_button_attributes); ?>>1</a></h3>
  </li>
  <li class="uk-text-center">
    <h3><a<?php print drupal_attributes($step_two_button_attributes); ?>>2</a></h3>
  </li>
</ul>

<ul id="steps-header-steps" class="uk-child-width-1-1 uk-child-width-1-2@l uk-grid-small uk-margin-bottom uk-visible@l" uk-grid>
  <li<?php print drupal_attributes($step_one_attributes); ?>>
    <div class="steps-header-content uk-height-1-1@l">
      <h3<?php print drupal_attributes($step_one_title_attributes); ?>>
        <a href="/user/special/assessment?destination=special/assessment/payment">
          <span class="<?php print $step_one_button_classes; ?>">1</span>Request Special or Rush Order Services</a>
      </h3>

      <div class="steps-header-footer">
        <?php if ($status): ?>
          <div><strong>Status</strong>: Completed</div>
          <div><strong>Date Requested</strong>: <?php print date('m-d-Y', $stepsdata->updated_on); ?></div>
        <?php else: ?>
          <?php if (!$status && isset($stepsdata->status)): ?>
            <div><strong>Status</strong>: Pending</div>
            <div><strong>Date Requested</strong>: <?php print date('m-d-Y', $stepsdata->requested_on); ?></div>
          <?php else: ?>
            <div>Please select assessment below and click submit, then await email invoice to make payment from.</div>
          <?php endif; ?>
        <?php endif; ?>
      </div>
    </div>
  </li>

  <li<?php print drupal_attributes($step_two_attributes); ?>>
    <div class="steps-header-content uk-height-1-1@l">
      <h3<?php print drupal_attributes($step_two_title_attributes); ?>>
        <a href="/special/assessment/payment">
          <span class="<?php print $step_two_button_classes; ?>">2</span>Make Payment</a>
      </h3>

      <div class="steps-header-footer">
        <?php if ($status): ?>
          <div><strong>Status</strong>: Pending</div>
          <div><strong>Payment Status</strong>: Not Paid</div>
          <div>Invoice sent by counselor, select assessment below to make payment.</div>
        <?php else: ?>
          <div>Make a payment for Special Assessment or Rush Services</div>
        <?php endif; ?>
      </div>
    </div>
  </li>
</ul>
