<?php
/**
 * @file tpl
 */
global $base_url;
$val = get_all_assessment_invoice();

// Add sticky table header library.
drupal_add_js('misc/tableheader.js');
?>
<table class="uk-table uk-table-striped sticky-enabled">
  <tr>
    <th>Client</th>
    <th>Requested Service</th>
    <th>Status</th>
    <th>Action</th>
  </tr>
  <?php $total_count = count($val); ?>
  <?php foreach ($val as $rec): ?>
    <?php $user_info = user_load($rec->request_by); ?>
    <?php $phone = ndsbs_get_formatted_phone($user_info->uid); ?>
    <tr>
      <td>
        <?php $name = $user_info->field_first_name['und'][0]['value'] . ' ' . $user_info->field_middle_name['und'][0]['value'] . ' ' . $user_info->field_last_name['und'][0]['value']; ?>
        <div><?php print l(t($name), 'user/' . $user_info->uid . '/edit'); ?></div>
        <div><?php print $phone; ?></div>
        <div><?php print $user_info->mail; ?></div>
      </td>
      <td>
        <?php $assessment_info = node_load($rec->nid); ?>
        <div><?php print $assessment_info->title; ?></div>
        <div>Cost $<?php print number_format($rec->special_amount, 2); ?></div>
      </td>
      <td>
        <div>Requested On: <?php print date('M d, Y', $rec->requested_on); ?></div>

        <?php if ($rec->updated_on > 0): ?>
          <div>Processed On: <?php print date('M d, Y', $rec->updated_on); ?></div>
        <?php endif; ?>

        <?php if ($rec->action_by > 0): ?>
          <?php $staff_info = user_load($rec->action_by); ?>
          <div>Processed By: <?php print $staff_info->field_first_name['und'][0]['value'] . ' ' . $staff_info->field_last_name['und'][0]['value']; ?></div>
        <?php endif; ?>

        <?php if ($rec->payment_status == 0): ?>
          <div>Payment Status: Pending</div>
        <?php else: ?>
          <div>Payment Status: Paid</div>
        <?php endif; ?>
      </td>
      <td>
        <a href="javascript:void(0)" onclick="opencreate_invoice('<?php print $rec->nid; ?>', '<?php print $rec->request_by; ?>', '<?php print $rec->id; ?>');">Create Invoice</a>
      </td>
    </tr>
  <?php endforeach; ?>
  <?php if ($total_count <= 0): ?>
    <tr>
      <td colspan="4">Record not found.</td>
    </tr>
  <?php endif; ?>
</table>

<?php
$total = 3;
//pager_default_initialize($total, 1, $element = 0);
print $output = theme('pager', array('quantity' => $total));
?>

<script>
  function opencreate_invoice(id, uid, aid) {
    myWindow = window.open('<?php print $base_url; ?>/request/assessment/createinvoice/' + id + '/' + uid + '/' + aid, 'createinvoice', 'scrollbars=1,width=400,height=500');
    myWindow.focus();
  }
</script>
