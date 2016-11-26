<?php
/**
 * @file
 * payment.tpl.php
 */
// NOTE: this will be changed for Purchasing Request for report.
global $base_path, $user;
// Notary status defined on 29-03-2013 mail dated on 29-03-2013.

$notary_status = 'inactive';

$data = get_cart_items();

$confirm_status = chk_confirm_status();
$cstatus = $confirm_status[0]->confirm_status;
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
<h1>Payment</h1>
<div class="wd_1">
  <div class="table_wrap">
    <table class="schedule_table">
      <?php
      $i = 1;
      $total_amount = 0;
      //$count = count($cart_data);
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
        //if(in_array($carddata->tid, $sub_purchased_term)) {
        //  $service_amount = 0;
        // } else {
        $service_amount = 0;
        if ($term_data->vocabulary_machine_name == 'stateform_vocab') {
          $service_amount = $term_data->field_stateformamount['und'][0]['value'];
        }
        elseif (isset($term_data->field_other_service_amount['und'][0]['value'])) {
          $service_amount = $term_data->field_other_service_amount['und'][0]['value'];
        }
        //  }

        $shipping_amount = $carddata->express_mail;
        $notary_amount = $carddata->notary_amount;
        $tmp_amount = $service_amount_main_service + $service_amount + $carddata->notary_amount;
        $tmp_amount_display = $service_amount_main_service + $service_amount;
        //  Amount Calculation END

        if ($tmp_amount > 0) {
          //if(true) {
          if ($i == 1) {
            ?>
            <tr class="bkg_b">
              <th>S.No.</th>
              <th>Title</th>
              <th>Amount</th>
              <?php
              if ($notary_status == 'active') {
                ?>
                <?php if ($shipping_amount > 0 || $notary_amount > 0) { ?>
                  <th>Notary Amount</th>
                  <th>Sub Total</th>
                <?php } ?>
              <?php
              }
              ?>
            </tr>
          <?php
          }
          ?>
          <tr>
            <td>
              <?php print $i; ?>
            </td>
            <td>
              <?php
              if ($term_data->vocabulary_machine_name != 'assessment') {
                if ($term_data->vocabulary_machine_name == 'stateform_vocab') {
                  print $term_data->field_stateformtitle['und'][0]['value'];
                }
                else {
                  print $term_data->name;
                }
              }
              else {
                $result = node_load($node_id);
                switch ($term_data->tid) {
                  case $result->field_primary_service['und'][0]['tid']:
                    $report_title = $result->field_assessment_title['und'][0]['value'];
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
                print $report_title;
              }
              ?>
            </td>
            <td>
              $<?php print number_format($tmp_amount_display, 2); ?>
            </td>
            <?php
            if ($notary_status == 'active') {
              ?>
              <?php if ($shipping_amount > 0 || $notary_amount > 0) { ?>
                <td>
                  $<?php print number_format($carddata->notary_amount, 2); ?>
                </td>
                <td>
                  <?php print $sub_total = number_format(($tmp_amount_display + $carddata->notary_amount), 2); ?>
                </td>
              <?php } ?>
            <?php
            }
            ?>
          </tr>
          <?php
          $i++;
        }
        $total_amount = $total_amount + $tmp_amount;
      }
      ?>
      <tr>
        <?php if ($shipping_amount > 0 || $notary_amount > 0) { ?>
          <td></td>
          <td class="bold">Shipping Amount:</td>
          <td><?php print '$' . number_format($shipping_amount, 2); ?></td>
          <?php
          if ($notary_status == 'active') {
            ?>
            <td>--</td>
            <td
              class="bold"><?php print '$' . number_format($shipping_amount, 2); ?></td>
          <?php
          }
          ?>
        <?php } ?>
      </tr>
      <?php $rush_amount = number_format($_SESSION['ndsbs_payment']['rush_amount'], 2); ?>
      <tr>
        <td></td>
        <td class="bold">Rush Service Amount:</td>
        <td class="bold"><?php print '$' . $rush_amount; ?></td>
      </tr>
      <tr>
        <?php
        if ($notary_status == 'active') {
          ?>
          <?php if ($shipping_amount > 0 || $notary_amount > 0) { ?>
            <td></td>
            <td class="bold">Total Amount:</td>
            <td colspan="2"></td>
          <?php }
          else { ?>
            <td></td>
            <td class="bold">Total Amount:</td>
          <?php } ?>
        <?php
        }
        else {
          ?>
          <td></td>
          <td class="bold">Total Amount:</td>
        <?php
        }
        ?>
        <?php $total_with_rush = $total_amount + $shipping_amount + $rush_amount; ?>
        <td
          class="bold"><?php print '$' . number_format($total_with_rush, 2); ?></td>
      </tr>
    </table>
  </div>


  <!-- PAYMENT START -->
  <div class="select-payment-method">
    <br/>
    <b>Please Select Payment method</b>
    <br/><br/>
    <!--<div class="paypalcls">
            <span>  <input type="radio" name="payment_method" class="payment_method" id="payment-paypal" value="paypal" <?php //print $filed_disable; ?> />&nbsp;Paypal&nbsp;&nbsp;</span>
              <img src="<?php //print $base_path . path_to_theme() . '/images/paypal.png'; ?>" />
        </div>
        <br />-->
    <div class="paypalcls">
      <span><input type="radio" name="payment_method" class="payment_method"
                   id="payment-creditcard"
                   value="creditcard" />&nbsp;Credit Card&nbsp;&nbsp;</span>
      <img
        src="<?php print $base_path . path_to_theme() . '/images/master-card.png'; ?>"/>
    </div>
  </div>
  <?php print drupal_render(drupal_get_form('_payment_rush_service')); ?>

  <!-- <div id="paypal-payment" style='display:none;'>
        <b><br />Pay using Paypal:</b>
        <br /><br />
        <?php
  //  Payment Using Paypal
  //get_paypal_button_for_payment($node_id);
  ?>
    </div> -->

  <div id="creditcard-payment" style='display:none;'>
    <b><br/>Pay using Credit Card:</b>
    <br/><br/>
    <?php
    //  Payment Using Credit Card
    $form = _payment_creditcard();
    ?>
    <div class="form-item_custum">
      <?php print drupal_render($form); ?>
      <INPUT TYPE="HIDDEN" NAME="x_relay_response" VALUE="true"/>
    </div>
  </div>
  <!-- PAYMENT END -->

</div>
<script>
  (function ($) {
    $(document).ready(function () {

      //bind the click event to the radio buttons
      $(':radio').click(function () {
        var radioID = $(this).attr('id');
        if (radioID == 'payment-paypal') {
          $('#creditcard-payment').hide();
          $('#paypal-payment').show();
        }
        else if (radioID == 'payment-creditcard') {
          $('#paypal-payment').hide();
          $('#creditcard-payment').show();
        }
      });

      $('#credit_card_submit').unbind('click');
      $('#credit_card_submit').bind('click', function () {
        var credit_card = $('#edit-credit-card').val();
        var cc_number = $('#edit-card-number').val();
        var expiration_month = $('#edit-expiration-month').val();
        var expiration_year = $('#edit-expiration-year').val();
        var cvv_code = $('#edit-cvv').val();

        if (credit_card == '') {
          alert('Please select your card.');
          return false;
        }
        if (cc_number == '') {
          alert('Please enter your credit card number.');
          return false;
        }

        //  Credit Card number validation function called
        if (!checkCreditCard(cc_number, credit_card)) {
          alert(ccErrors[ccErrorNo]);
          return false;
        }

        if (expiration_month == '') {
          alert('Please select your card expiration month.');
          return false;
        }
        if (expiration_year == '') {
          alert('Please select your card expiration year.');
          return false;
        }
        if (cvv_code == '') {
          alert('Please enter cvv number.');
          return false;
        }

      });// Bind function closed

    });
  }(jQuery));// Main function closed
</script>
