<?php
/**
 * @file
 * list_all_client_counseling_request.tpl.php
 */
//  Request Status 0 mean Open And 1 Mean Close
?>
<?php
if ($_REQUEST['search_text'] <> '' || $_REQUEST['assessment_status'] <> '') {
  $val = get_client_paymentrefund_custom_search();
}
else {
  //  function defined to load the content type refund payment
  $val = get_payment_refund_request_info();
}
$nid_array = array();
foreach ($val as $data) {
  $nid_array[] = $data->nid;
}

//  load the node data
$result = node_load_multiple($nid_array);

// Add sticky table header library.
drupal_add_js('misc/tableheader.js');
?>
<?php print search_client_paymentrefund(); ?>
<table class="table table-striped table-responsive sticky-enabled">
  <thead>
  <tr class="bkg_b">
    <th>S. No.</th>
    <th>User Details</th>
    <th>Refund for Service</th>
    <th>Reason</th>
    <th>Requesting Date</th>
    <th>Action</th>
  </tr>
  </thead>
  <tbody>
  <?php
  $i = 0;
  $record_not_found = count($result);
  foreach ($result as $rec) {
    $user_info = user_load($rec->uid);
    //echo '<pre>';
    //print_r($user_info);
    ?>
    <tr>
      <td>
        <?php print ++$i; ?>
      </td>
      <td>
        <?php $name = $user_info->field_first_name['und'][0]['value'] . ' ' . $user_info->field_middle_name['und'][0]['value'] . ' ' . $user_info->field_last_name['und'][0]['value']; ?>
        Service
        User- <?php print l(t($name), 'user/' . $user_info->uid . '/edit'); ?>
      </td>
      <td>
        <?php
        $term = taxonomy_term_load($rec->field_refund_for_service['und'][0]['tid']);
        print $term->name;
        ?>
      </td>
      <td>
        <?php print $rec->field_refund_reason['und'][0]['value']; ?>
      </td>
      <td>
        <?php print date('M d Y h:i A', $rec->created); ?>
      </td>
      <td>
        <?php
        if ($rec->field_request_status['und'][0]['value'] == 0) {
          //  0 mean Open And 1 Mean Close
          $options = array('attributes' => array('class' => 'closer_icon'));
          print l(t('Close Request'), 'request/paymentrefund/update/' . $rec->nid, $options);
        }
        else {
          print '<ul class="tr_actions">
                                        <li class="close_icon">Request Closed</li>
                                    </ul>';
        }
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
      <td class="txt_ac" colspan="6">Record not found.</td>
    </tr>
    <?php
  }
  ?>
  </tbody>
</table>
<?php
$total = 10;
print $output = theme('pager', array('quantity' => $total)); ?>
