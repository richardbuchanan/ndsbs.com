<?php
/**
 * @file
 * user_transactions.tpl.php
 */
$payment_status = arg(3);
$transactio_data = get_user_transactions($payment_status);
?>
<h1>
  <?php if (arg(3) == 1) {
    print 'Transaction History';
  }
  else {
    print 'Failed Transaction';
  } ?>
</h1>
<table class="uk-table uk-table-striped sticky-enabled">
  <thead>
  <tr class="bkg_b">
    <th>S. No.</th>
    <th>Transaction Id</th>
    <th>Service Details</th>
    <th>Transaction Date</th>
    <th>Transaction Amount</th>
    <th>Payment System</th>
    <th>Transaction Status</th>
    <th>Action</th>
  </tr>
  </thead>
  <tbody>
  <?php
  $i = 0;
  $total_count = count($transactio_data);
  foreach ($transactio_data as $data) {
    $user_info = user_load($data->uid);
    $node_info = node_load($data->nid);
    // echo '<pre>';
    // print_r($node_info);
    // echo '</pre>';
    ?>
    <tr>
      <td><?php print ++$i; ?></td>
      <td>
        <?php print $data->transaction_id; ?>
      </td>
      <td>
        Service User -
        <?php print $user_info->field_first_name['und'][0]['value']; ?>
        <?php print $user_info->field_middle_name['und'][0]['value']; ?>
        <?php print $user_info->field_last_name['und'][0]['value']; ?>
        <br/>
        For service
        - <?php print get_purchased_service_title($node_info, $data->termid); ?>
      </td>
      <td>
        <?php print date('M d, Y', $data->order_date); ?>
      </td>
      <td>
        <?php print $data->cost; ?>
      </td>
      <td>
        <?php print ucwords($data->payment_method); ?>
      </td>
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
      <td>
        <?php
        if ($data->payment_status == '1') {
          $options = array('attributes' => array('class' => 'details_icon'));
          print l(t('Detail'), 'user/transactions/detail/' . $data->order_id, $options);
        }
        else {
          //  client_request  1 mean client requested
          //  transaction_action  1 mean confirmed and 0 mean not confirmed
          if ($data->transaction_action == 1) {
            print '<ul class="tr_actions">
                                        <li class="confirm_icon">Confirmed</li>
                                    </ul>';
          }
          elseif ($data->transaction_action == 0 && $data->client_request == 1) {
            print '<ul class="tr_actions">
                                        <li class="notconfirm_icon">Not Confirmed</li>
                                    </ul>';
          }
          else {
            $options = array('attributes' => array('class' => 'makerequest_icon'));
            print l(t('Make Request'), 'transactions/request/' . $data->order_id, $options);
          }
        }
        ?>
      </td>
    </tr>
    <?php
  }
  if ($total_count <= 0) {
    ?>
    <tr>
      <td colspan="8" class="txt_ac">
        Record not found.
      </td>
    </tr>
    <?php
  }
  ?>
  </tbody>
</table>
<?php
$total = 10;
//pager_default_initialize($total, 1, $element = 0);
print $output = theme('pager', array('quantity' => $total)); ?>
