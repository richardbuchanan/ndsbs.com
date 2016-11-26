<?php
/**
 * @file
 * user_transactions.tpl.php
 */

$transactio_data = get_transactions_detail();
?>
<table class="table table-striped table-responsive sticky-enabled">
  <?php
  $i = 0;
  foreach ($transactio_data as $data) {
    $user_info = user_load($data->uid);
    $node_info = node_load($data->nid);
  ?>
  <tr>
    <td class="bold">Name:</td>
    <td>
      <?php print $user_info->field_first_name['und'][0]['value']; ?>
      <?php print $user_info->field_middle_name['und'][0]['value']; ?>
      <?php print $user_info->field_last_name['und'][0]['value']; ?>
    </td>
  </tr>
  <tr>
    <td class="bold">Email:</td>
    <td><?php print $user_info->mail; ?></td>
  </tr>
  <?php
  if ($data->shipping_info <> '') {
    ?>
    <tr>
      <td class="bold">Shipping Address:</td>
      <td>
        <?php print $data->shipping_info; ?>
      </td>
    </tr>
    <?php
  }
  ?>
  <tr>
    <td class="bold">Phone:</td>
    <td><?php print $user_info->field_phone['und'][0]['value']; ?></td>
  </tr>
  <tr>
    <td class="bold">Transaction Id:</td>
    <td><?php print $data->transaction_id; ?></td>
  </tr>
  <tr>
    <td class="bold">Transaction Time:</td>
    <td><?php print date('M d, Y h:i A', $data->order_date); ?></td>
  </tr>
  <tr>
    <td class="bold">Transaction Status:</td>
    <td>
      <?php
      if ($data->payment_status == '1') {
        print 'Success';
      }
      else {
        print 'Failed';
      }
      ?>
    </td>
  </tr>
</table>
<div class="pro_wrapinn">
  <div class="table_wrap">
    <table class="table table-striped table-responsive sticky-enabled">
      <tr class="bkg_b">
        <th>Service</th>
        <th>Details</th>
        <th>Amount</th>
      </tr>
      <tr>
        <td><?php print ucwords($node_info->type); ?></td>
        <td><?php print get_purchased_service_title($node_info, $data->termid); ?></td>
        <td><?php print '$' . $data->cost; ?></td>
      </tr>
      <tr>
        <td></td>
        <td class="bold">Rush Total</td>
        <td><?php print '$' . $data->rush_cost; ?></td>
      </tr>
      <?php $grand_total = $data->rush_cost + $data->cost; ?>
      <tr>
        <td></td>
        <td class="bold">Grand Total</td>
        <td><?php print '$' . number_format($grand_total, 2); ?></td>
      </tr>
    </table>
  </div>
</div>
<div class="pl_14">
  <?php if (arg(3) == 0) { ?>
    <?php
    global $user;
    $user_info = user_load($data->action_by);
    $action_date = date('M d Y h:i A', $data->action_date);
    ?>
    <?php if ($data->action_by > 0) { ?>
      <b>Comment</b>:<br/>
      Action performed by:
      <b><?php print $user_info->field_first_name['und'][0]['value'] . ' ' . $user_info->field_last_name['und'][0]['value']; ?></b> on <?php print $action_date; ?>
      <br/>
      <?php print $data->reason; ?>
    <?php } ?>
    <?php print $form = action_on_transaction(); ?>
  <?php } ?>
  <?php
  }
  ?>
</div>
