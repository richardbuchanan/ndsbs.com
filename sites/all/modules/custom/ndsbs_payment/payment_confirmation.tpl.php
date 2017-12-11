<?php
global $user;
$misc_service = FALSE;

$transactions = get_user_transactions(1);

foreach ($transactions as $transaction) {
  if ($transaction->nid == '3965') {
    $misc_service = TRUE;
    break;
  }
  if ($transaction->payment_status) {
    $role = user_role_load_by_name('client');
    user_multiple_role_edit(array($user->uid), 'add_role', $role->rid);
  }
}

$assessment_node = node_load($transactions[0]->nid);
$assessment_user = user_load($transactions[0]->uid);
$assessment_title = $assessment_node->title;
$transaction_cost = $transactions[0]->cost;
$rush_cost = !(empty($_SESSION['ndsbs_payment']['rush_amount'])) ? $_SESSION['ndsbs_payment']['rush_amount'] : number_format(0, 2);
$total_cost = $transaction_cost + $rush_cost;

$payment['order_id'] = $transactions[0]->order_id;
$payment['user_email'] = $assessment_user->mail;
$payment['assessment'] = $assessment_title;
$payment['cost'] = $transactions[0]->cost;
$payment['rush_cost'] = number_format($rush_cost, 2);
$payment['total_cost'] = number_format($total_cost, 2);
$payment['misc_service'] = $misc_service;

$payment_confirmation_status = ndsbs_payment_get_payment_confirmation_status($user->uid, $transactions[0]->transaction_id);

?>
<?php if ($payment_confirmation_status): ?>
  <h2>Order Details</h2>
  <div class="uk-alert-warning" uk-alert>
    <p>Payment has already been processed.</p>
  </div>

  <a href="/questionnaire/start/trans" class="uk-button uk-button-primary"><?php print t('Return to dashboard'); ?></a>
<?php else: ?>
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

  <?php $url = url('/questionnaire/start/trans', array(
    'query' => array(
      'payment_confirmation' => '1',
      'uid' => $user->uid,
      'tid' => $transactions[0]->transaction_id,
    ),
  )); ?>
  <?php $text = !$payment['misc_service'] ? t('Begin my assessment') : t('Return to dashboard'); ?>
  <a href="<?php print $url; ?>" class="uk-button uk-button-primary"><?php print $text; ?></a>

  <!-- INSERT GOOGLE CONVERSION CODE HERE! -->
<?php endif; ?>
