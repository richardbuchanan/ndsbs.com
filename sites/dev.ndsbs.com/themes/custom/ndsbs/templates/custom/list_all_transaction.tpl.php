<?php
/**
 * @file
 * list_all_transaction.tpl.php
 */
$search_text = isset($_REQUEST['search_text']) && $_REQUEST['search_text'];
$assessment_status = isset($_REQUEST['assessment_status']) && $_REQUEST['assessment_status'] <> '';
if ($search_text || $assessment_status) {
  $transactio_data = get_all_transaction_custom_search();
}
else {
  $transactio_data = get_all_user_transactions();
}

// Add sticky table header library.
drupal_add_js('misc/tableheader.js');

$title = arg(3) == 1 ? 'Successful Transactions' : 'Failed Transactions';
drupal_set_title($title);
?>
<?php print search_transactions(); ?>
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
    $page = isset($_REQUEST['page']);
    if (!$page) {
      $i = 0;
    }
    else {
      $i = ($_REQUEST['page'] * 10);
    }
    $record_not_found = count($transactio_data);
    $transactions = array();
    foreach ($transactio_data as $data) {
      if (!in_array($data->transaction_id, $transactions)) {
        $user_info = user_load($data->uid);
        $node_info = node_load($data->nid);
        ?>
        <tr>
          <td data-test>
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
            <?php $name = array(
              'first' => $user_info->field_first_name['und'][0]['value'],
              'middle' => isset($user_info->field_middle_name['und']) ? $user_info->field_middle_name['und'][0]['value'] : '',
              'last' => $user_info->field_last_name['und'][0]['value'],
            ); ?>
            <?php print l(implode(' ', $name), 'user/' . $user_info->uid . '/edit', $options); ?>
            <br/>
            For service
            - <?php print get_purchased_service_title($node_info, $data->termid); ?>
          </td>
          <td>
            <?php print date('M d, Y', $data->order_date); ?>
          </td>
          <td>
            <?php $cost = $data->cost + $data->rush_cost; ?>
            <?php print '$' . number_format($cost, 2); ?>
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
            print l(t('Detail'), 'transactions/detail/' . $data->order_id . '/' . arg(3));
            ?>
            <?php
            $destination = url(current_path(), array(
              'query' => drupal_get_query_parameters(),
            ));

            $options = array(
              'query' => array(
                'destination' => $destination,
              ),
            );

            print l(t('Delete'), 'transaction/' . $data->transaction_id . '/delete', $options);
            ?>
          </td>
        </tr>
        <?php $transactions[] = $data->transaction_id; ?>
      <?php
    }}
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