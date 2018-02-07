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
<table class="uk-table uk-table-striped sticky-enabled">
  <thead>
  <tr class="bkg_b">
    <th class="uk-text-nowrap">Client</th>
    <th class="uk-text-nowrap">Refund for Service</th>
    <th class="uk-text-nowrap">Reason</th>
    <th class="uk-text-nowrap">Requesting Date</th>
    <th class="uk-text-nowrap">Action</th>
  </tr>
  </thead>
  <tbody>
  <?php $record_not_found = count($result); ?>
  <?php foreach ($result as $rec): ?>
    <?php $user_info = user_load($rec->uid); ?>
    <tr>
      <td class="uk-text-nowrap">
        <?php $name = $user_info->field_first_name['und'][0]['value'] . ' ' . $user_info->field_middle_name['und'][0]['value'] . ' ' . $user_info->field_last_name['und'][0]['value']; ?>
        <div><?php print l(t($name), 'user/' . $user_info->uid . '/edit'); ?></div>
      </td>
      <td class="uk-text-nowrap">
        <?php $term = taxonomy_term_load($rec->field_refund_for_service['und'][0]['tid']); ?>
        <div><?php print $term->name; ?></div>
      </td>
      <td>
        <?php print $rec->field_refund_reason['und'][0]['value']; ?>
      </td>
      <td class="uk-text-nowrap">
        <div><?php print date('M d, Y @ h:i A', $rec->created); ?></div>
      </td>
      <td class="uk-text-nowrap">
        <?php if ($rec->field_request_status['und'][0]['value'] == 0): ?>
          <div><?php print l(t('Close request'), 'request/paymentrefund/update/' . $rec->nid); ?></div>
        <?php else: ?>
          <div>Request closed</div>
        <?php endif; ?>
      </td>
    </tr>
  <?php endforeach; ?>
  <?php if ($record_not_found <= 0): ?>
    <tr>
      <td colspan="5">Record not found.</td>
    </tr>
  <?php endif; ?>
  </tbody>
</table>
<?php $total = 10; ?>
<?php print $output = theme('pager', array('quantity' => $total)); ?>
