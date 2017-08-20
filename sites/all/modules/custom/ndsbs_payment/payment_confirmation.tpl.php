<?php
$misc_service = FALSE;

$transactions = get_user_transactions(1);

foreach ($transactions as $transaction) {
  if ($transaction->nid == '3965') {
    $misc_service = TRUE;
    break;
  }
}

$assessment_node = node_load($transactions[0]->nid);
$assessment_user = user_load($transactions[0]->uid);
$assessment_title = $assessment_node->title;
$rush_cost = !(empty($_SESSION['ndsbs_payment']['rush_amount'])) ? $_SESSION['ndsbs_payment']['rush_amount'] : number_format(0, 2);

$payment['order_id'] = $transactions[0]->order_id;
$payment['user_email'] = $assessment_user->mail;
$payment['assessment'] = $assessment_title;
$payment['cost'] = $transactions[0]->cost;
$payment['rush_cost'] = number_format($rush_cost, 2);
$payment['total_cost'] = number_format($transactions[0]->cost + $rush_cost, 2);
$payment['misc_service'] = $misc_service;
?>
<h2>Order Details</h2>
<div class="uk-alert-success" uk-alert>
  <p>Payment has been successfully processed.</p>
</div>
<table class="uk-table uk-table-striped sticky-enabled">
  <thead>
    <tr>
      <th>Assessment</th>
      <th>Amount</th>
    </tr>
  </thead>
  <tbody>
  <tr class="assessment-row">
    <td class="assessment-title"><?php print $payment['assessment']; ?></td>
    <td class="assessment-total">$ <?php print $payment['cost']; ?></td>
  </tr>
  <tr class="rush-service-row">
    <td class="rush-service-title text-right">Rush Service Amount:</td>
    <td class="rush-service-amount">$ <?php print $payment['rush_cost']; ?></td>
  </tr>
  <tr class="cart-total-row">
    <td class="cart-total-title text-right">Total Amount:</td>
    <td class="cart-total-amount">$ <?php print $payment['total_cost']; ?></td>
  </tr>
  </tbody>
</table>

<?php if (!$payment['misc_service']): ?>
  <a href="/questionnaire/start/trans" class="uk-button uk-button-primary">Begin My Assessment</a>
<?php endif; ?>

<!-- Google Code for NDSBS Conversion Page -->
<script type="text/javascript">
  /* <![CDATA[ */
  var google_conversion_id = 1017904011;
  var google_conversion_language = "en";
  var google_conversion_format = "3";
  var google_conversion_color = "ffffff";
  var google_conversion_label = "PLjyCJWdoQwQi_ev5QM";
  var google_conversion_value = <?php print $payment['total_cost']; ?>;
  var google_conversion_currency = "USD";
  var google_remarketing_only = false;
  /* ]]> */
</script>
<script type="text/javascript" src="//www.googleadservices.com/pagead/conversion.js">
</script>
<noscript>
  <div style="display:none;">
    <img height="1" width="1" style="border-style:none;" alt="" src="//www.googleadservices.com/pagead/conversion/1017904011/?value=<?php print $payment['total_cost']; ?>&amp;currency_code=USD&amp;label=PLjyCJWdoQwQi_ev5QM&amp;guid=ON&amp;script=0"/>
  </div>
</noscript>
