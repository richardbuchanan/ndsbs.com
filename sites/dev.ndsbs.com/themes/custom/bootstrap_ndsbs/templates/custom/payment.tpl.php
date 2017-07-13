<?php

/**
 * @file
 * payment.tpl.php
 */

global $base_path, $user;

$notary_status = 'inactive';
$tmp_amount = 0;

$data = get_cart_items();

$confirm_status = chk_confirm_status();
$cstatus = $confirm_status[0]->confirm_status;
$assessment_title = 'Cart Empty';
$special_rush = 0;

foreach ($data as $item) {
  if (isset($item->tid) && $item->tid == '49') {
    $special_rush = 1;
  }
}
?>

<?php
$filed_disable = '';
if ($cstatus != 1) {
  /********************************************************************************************
   *  Updates the users_confirm table with a confirm_status value of 1 and then reloads the page.
   * 11/20/2014
   *********************************************************************************************/
  $data = db_insert('users_confirm')
    ->fields(array(
      'user_uid' => $user->uid,
      'ap_uid' => 1,
      'confirm_status' => 1,
    ))
    ->execute();

  drupal_goto('user/payment');
  /********************************************************************************************/
}
?>

<div id="payment-ajax-load">
  <div class="row">
    <div id="form-state-message" class="col-xs-12">
      <div class="alert alert-warning alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>Please <a href="/view/assessment/status" class="alert-link">select an assessment</a> to purchase to continue.</div>
    </div>
  </div>
  <?php if ($data): ?>
    <div class="row voffset2 cart-empty">
      <div class="col-xs-12 text-right">
        <a class="btn btn-default" href="/cart/empty">Empty cart</a>
      </div>
    </div>
  <?php endif; ?>

  <div class="row">
    <div class="col-xs-12 col-md-5 ndsbs-push-right">
      <table class="table table-striped table-responsive sticky-enabled">
        <thead>
        <tr>
          <th class="text-left">Assessment</th>
          <th class="text-right">Amount</th>
        </tr>
        </thead>
        <tbody>
          <tr class="assessment-row">
            <?php $i = 1;
            $total_amount = 0;

            foreach ($data as $carddata) {
              $node_id = $carddata->nid;
              $term_data = taxonomy_term_load($carddata->tid);

              //  Amount Calculation START
              if ($carddata->sub_report != 1) {
                $custom_special_amount = get_special_assessment_custom_amount($node_id);

                if ($custom_special_amount > 0) {
                  $service_amount_main_service = $custom_special_amount;
                }
                else {
                  $service_amount_main_service = $term_data->field_assessment_amount['und'][0]['value'];
                }
              }

              if ($i == 1) {
                //  Function call to chk that sub service is already purchased or not
                $data_subreport_term = check_user_purchased_subreport_term($carddata->nid, 1, 1);

                foreach ($data_subreport_term as $data_subreport) {
                  $sub_purchased_term[] = $data_subreport->termid;
                }
              }

              $service_amount = 0;

              if ($term_data->vocabulary_machine_name == 'stateform_vocab') {
                $service_amount = $term_data->field_stateformamount['und'][0]['value'];
              }
              elseif (isset($term_data->field_other_service_amount['und'][0]['value'])) {
                $service_amount = $term_data->field_other_service_amount['und'][0]['value'];
              }

              $shipping_amount = $carddata->express_mail;
              $notary_amount = $carddata->notary_amount;
              $tmp_amount = $service_amount_main_service + $service_amount + $carddata->notary_amount;
              $tmp_amount_display = $service_amount_main_service + $service_amount;
              //  Amount Calculation END ?>

              <?php if ($tmp_amount > 0 || $special_rush) {
                  if ($term_data->vocabulary_machine_name != 'assessment') {
                    if ($term_data->vocabulary_machine_name == 'stateform_vocab') {
                      $assessment_title = $term_data->field_stateformtitle['und'][0]['value'];
                    }
                    else {
                      $assessment_title = $term_data->name;
                    }
                  }
                  else {
                    $result = node_load($node_id);
                    switch ($term_data->tid) {
                      case $result->field_primary_service['und'][0]['tid']:
                        $report_title = $result->title;
                        break;
                      case $result->field_rush_order_service_one['und'][0]['tid']:
                        $report_title = $result->field_rush_order_title_one['und'][0]['value'];
                        break;
                      case $result->field_rush_order_service_two['und'][0]['tid']:
                        $report_title = $result->field_rush_order_title_two['und'][0]['value'];
                        break;
                      case $result->field_rush_order_service_three['und'][0]['tid']:
                        $report_title = $result->field_rush_order_title_three['und'][0]['value'];
                        break;
                      case $result->field_rush_order_service_four['und'][0]['tid']:
                        $report_title = $result->field_rush_order_title_four['und'][0]['value'];
                        break;
                    }

                    $assessment_title = $report_title;
                  } ?>
              <?php $i++; }
              else { ?>
              <?php }

              $total_amount = $total_amount + $tmp_amount;
            } ?>
            <td class="assessment-title text-left"><?php print $assessment_title; ?></td>
            <?php if ($user->uid == '354'): ?>
              <?php // $tmp_amount_display = 1; ?>
            <?php endif; ?>
            <td class="assessment-total text-right">$<?php print number_format($tmp_amount_display, 2); ?></td>
          </tr>
          <?php $rush_amount = number_format($_SESSION['ndsbs_payment']['rush_amount'], 2); ?>
          <tr class="rush-service-row">
            <td class="rush-service-title text-left">Rush Service Amount:</td>
            <td class="rush-service-amount text-right"><?php print '$' . $rush_amount; ?></td>
          </tr>
          <tr class="cart-total-row">
            <?php if ($notary_status == 'active') { ?>
              <?php if ($shipping_amount > 0 || $notary_amount > 0) { ?>
                <td class="4-2 notary-status-active text-left">Total Amount:</td>
                <td class="4-3" colspan="2"></td>
              <?php }
              else { ?>
                <td class="4-5 notary-status-active text-left">Total Amount:</td>
              <?php } ?>
            <?php }
            else { ?>
              <td class="cart-total-title text-left">Total Amount:</td>
            <?php } ?>

            <?php $total_with_rush = $total_amount + $shipping_amount + $rush_amount; ?>
            <td class="cart-total-amount text-right"><?php print '$' . number_format($total_with_rush, 2); ?></td>
          </tr>
        </tbody>
      </table>
    </div>

    <?php $disabled = 'enabled'; ?>

    <?php if ($tmp_amount == 0 && !$special_rush): ?>
      <?php $disabled = 'disabled'; ?>
    <?php endif; ?>

    <div class="col-xs-12 col-md-7">
      <?php if (!$special_rush): ?>
        <!-- RUSH START -->
        <div class="row">
          <div id="rush-details" class="col-xs-12">
            <div class="panel panel-default rush-service-box">
              <div class="panel-heading">
                <h3 class="panel-title">Rush Services</h3>
              </div>
              <div class="panel-body" data-form-state="<?php print $disabled; ?>" data-target="#ndsbs-payment-rush-service-form">
                <?php print drupal_render(drupal_get_form('_payment_rush_service')); ?>
              </div>
              <div class="panel-footer">
                <h4>ABOUT RUSH ORDERS</h4>
                <p>We will make an effort to schedule you as soon as we can. The time frames for rush orders begin once your interview with the evaluator is completed.</p>
              </div>
            </div>
          </div>
        </div>
        <!-- RUSH END -->
      <?php endif; ?>

      <!-- PAYMENT START -->
      <div class="row">
        <div id="payment-details" class="col-xs-12">
          <div class="panel panel-default credit-card-box">
            <div class="panel-heading">
              <h3 class="panel-title display-td">Payment Details</h3>
            </div>
            <div class="panel-body" data-form-state="<?php print $disabled; ?>" data-target="#credit-card-payment-form">
              <?php $form = _payment_creditcard(); ?>
              <img class="img-responsive pull-right" src="/<?php print path_to_theme() . '/css/images/accepted_c22e0.png'; ?>"/>
              <?php print drupal_render($form); ?>
              <INPUT TYPE="HIDDEN" NAME="x_relay_response" VALUE="true"/>
            </div>
          </div>
        </div>
      </div>
      <!-- PAYMENT END -->

    </div>
  </div>
</div>
