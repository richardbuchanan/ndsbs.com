<?php
/**
 * @file
 * list_all_requested_transaction.tpl.php
 */
if ($_REQUEST['search_text'] <> '' || $_REQUEST['assessment_status'] <> '') {
  $transactio_data = get_all_failed_requested_transaction_custom_search();
}
else {
  $transactio_data = get_all_requested_transactions();
}

// Add sticky table header library.
drupal_add_js('misc/tableheader.js');

$title = arg(3) == 'transaction' ? 'Process Fund Requests' : '';
drupal_set_title($title);
?>
<?php print search_failed_requested_transactions(); ?>
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
  //  Creating the serial number for listing count
  if ($_REQUEST['page'] == '') {
    $i = 0;
  }
  else {
    $i = ($_REQUEST['page'] * 10);
  }
  $record_not_found = count($transactio_data);
  foreach ($transactio_data as $data) {
    $user_info = user_load($data->uid);
    $node_info = node_load($data->nid);
    // echo '<pre>';
    // print_r($node_info);
    // echo '</pre>';
    ?>
    <tr>
      <td>
        <?php
        print ++$i;
        ?>
      </td>
      <td>
        <?php print $data->transaction_id; ?>
      </td>
      <td>
        Service User -
        <?php
        $options = array('query' => array('destination' => 'all/transactions/list/' . arg(3)));
        ?>
        <?php print l(t($user_info->field_first_name['und'][0]['value']), 'user/' . $user_info->uid . '/edit', $options); ?>
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
        <?php print '$' . $data->cost; ?>
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
        $options = array('attributes' => array('class' => 'details_icon'));
        print l(t('Detail'), 'transactions/detail/' . $data->order_id . '/' . arg(3), $options);
        ?>
      </td>
    </tr>
    <?php
  }
  ?>
  <?php
  if ($record_not_found <= 0) {
    ?>
    <tr>
      <td class="txt_ac" colspan="8">Record not found</td>
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
