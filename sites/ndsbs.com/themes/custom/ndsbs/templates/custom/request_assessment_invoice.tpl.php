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
  <tr class="bkg_b">
    <th>Client</th>
    <th>Requested Service</th>
    <th>Status</th>
    <th>Action</th>
  </tr>
  <?php
  $total_count = count($val);
  foreach ($val as $rec) {
    $user_info = user_load($rec->request_by);
    ?>
    <tr>
      <td>
        <?php $name = $user_info->field_first_name['und'][0]['value'] . ' ' . $user_info->field_middle_name['und'][0]['value'] . ' ' . $user_info->field_last_name['und'][0]['value']; ?>
        <b>Name-</b> <?php print l(t($name), 'user/' . $user_info->uid . '/edit'); ?>
        <br/>
        <b>Phone-</b> <?php print $user_info->field_phone['und'][0]['value']; ?>
        <br/>
        <b>Email-</b> <?php print $user_info->mail; ?>
      </td>
      <td>
        <?php
        $assessment_info = node_load($rec->nid);
        print $assessment_info->field_assessment_title['und'][0]['value'];
        print '<br />';
        print 'Cost';
        print '  $';
        print number_format($rec->special_amount, 2);
        ?>
      </td>
      <td>
        <?php
        print 'Invoice Requested On: ' . date('M, d-Y', $rec->requested_on);
        if ($rec->updated_on > 0) {
          print '<br />';
          print 'Invoice Processed On: ' . date('M, d-Y', $rec->updated_on);
        }

        //
        if ($rec->action_by > 0) {
          print '<br />';
          $staff_info = user_load($rec->action_by);
          print 'Invoice Processed By: ' . $staff_info->field_first_name['und'][0]['value'] . ' ' . $user_info->field_last_name['und'][0]['value'];
        }

        //
        if ($rec->payment_status == 0) {
          print '<br />';
          print 'Payment Status: Pending';
        }
        else {
          print '<br />';
          print 'Payment Status: Paid';
        }
        ?>
      </td>
      <td>
        <a href="javascript:void(0)"
           onclick="opencreate_invoice('<?php print $rec->nid; ?>', '<?php print $rec->request_by; ?>', '<?php print $rec->id; ?>');">
          <?php
          print '<ul class="tr_actions">';
          print '<li class="createinvoice_icon">Create Invoice</li>';
          print '</ul>';
          ?>
        </a>
      </td>
    </tr>
    <?php
  }
  if ($total_count <= 0) {
    ?>
    <tr>
      <td class="txt_ac" colspan="4">
        Record not found.
      </td>
    </tr>
    <?php
  }
  ?>
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
