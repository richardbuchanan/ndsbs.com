<?php
/**
 * @file
 * list_all_client_stateform_invoice.tpl.php
 */
global $base_url;
?>
<?php
if ($_REQUEST['search_text'] <> '' || $_REQUEST['assessment_status'] <> '') {
  $val = get_requested_stateform_custom_search();
}
else {
  //  function defined to load the content type paper-work
  $val = get_all_stateform_invoice();
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
<?php print search_requested_stateform(); ?>
<table class="uk-table uk-table-striped sticky-enabled">
  <tr>
    <th>Client</th>
    <th>Requested Service</th>
    <th>Comments</th>
    <th>Action</th>
  </tr>
  <?php $total_count = count($result); ?>
  <?php foreach ($result as $rec): ?>
    <?php $user_info = user_load($rec->uid); ?>
    <?php $phone = ndsbs_get_formatted_phone($rec->uid); ?>
    <tr>
      <td class="uk-text-nowrap">
        <?php $name = $user_info->field_first_name['und'][0]['value'] . ' ' . $user_info->field_middle_name['und'][0]['value'] . ' ' . $user_info->field_last_name['und'][0]['value']; ?>
        <div><?php print l(t($name), 'user/' . $user_info->uid . '/edit'); ?></div>
        <div><?php print $phone; ?></div>
        <div><?php print $user_info->mail; ?></div>
      </td>
      <td>
        <?php $count = count($rec->field_state_form_title['und']); ?>
        <?php for ($i = 0; $i < $count; $i++): ?>
          <div>
            <a href="<?php print $base_url; ?>/sites/ndsbs.com/files/stateform/<?php print $rec->field_state_form_upload['und'][$i]['filename']; ?>"><?php print $rec->field_state_form_title['und'][$i]['value']; ?></a>
          </div>
        <?php endfor; ?>
      </td>
      <td>
        <?php print $rec->field_state_form_comment['und'][0]['value']; ?>
      </td>
      <td class="uk-text-nowrap">
        <a href="javascript:void(0)" onclick="opencreate_invoice('<?php print $rec->nid; ?>');">Create Invoice</a>
      </td>
    </tr>
  <?php endforeach; ?>
  <?php if ($total_count <= 0) {
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
  print $output = theme('pager', array('quantity' => $total));
?>

<script>
  function opencreate_invoice(id) {
    myWindow = window.open('<?php print $base_url; ?>/request/stateform/createinvoice/' + id, 'createinvoice', 'scrollbars=1,width=400,height=500');
    myWindow.focus();
  }
</script>
