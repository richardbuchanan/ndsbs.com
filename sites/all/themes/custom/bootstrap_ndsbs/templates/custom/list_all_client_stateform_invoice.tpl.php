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
<table class="table table-striped table-responsive sticky-enabled">
  <tr class="bkg_b">
    <th>Client</th>
    <th>Requested Service</th>
    <th>Comments</th>
    <th>Action</th>
  </tr>
  <?php
  $total_count = count($result);
  foreach ($result as $rec) {
    $user_info = user_load($rec->uid);
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
        $count = count($rec->field_state_form_title['und']);
        for ($i = 0; $i < $count; $i++) {
          //print $rec->field_state_form_title['und'][0]['value'] . '-' . $rec->field_state_form_upload['und'][0]['filename'];
          //print '<br />';
          print '<a href="' . $base_url . '/sites/ndsbs.com/files/stateform/' . $rec->field_state_form_upload['und'][$i]['filename'] . '">' . $rec->field_state_form_title['und'][$i]['value'] . '</a>';
          print '<br />';
        }
        ?>
      </td>
      <td>
        <?php print $rec->field_state_form_comment['und'][0]['value']; ?>
      </td>
      <td>
        <!--<a href="<?php //print '/request/stateform/createinvoice/'.$rec->nid; ?>?width=500&height=400" class="colorbox-load">Create Invoice</a>-->
        <a href="javascript:void(0)"
           onclick="opencreate_invoice('<?php print $rec->nid; ?>');">
          <?php
          print '<ul class="tr_actions">
                                    <li class="createinvoice_icon">Create Invoice</li>
                                </ul>';
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
</div>
<?php
$total = 3;
//pager_default_initialize($total, 1, $element = 0);
print $output = theme('pager', array('quantity' => $total));
?>

<script>
  function opencreate_invoice(id) {
    myWindow = window.open('<?php print $base_url; ?>/request/stateform/createinvoice/' + id, 'createinvoice', 'scrollbars=1,width=400,height=500');
    myWindow.focus();
  }
</script>
