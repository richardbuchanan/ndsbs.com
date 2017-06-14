<?php
/**
 * @file
 * user_list_verification_document.tpl.php
 */
global $base_url;
?>
<?php
$val = get_all_impdoc_acc_verification_document();

$nid_array = array();
foreach ($val as $data) {
  $nid_array[] = $data->nid;
}

//  load the node data
$result = node_load_multiple($nid_array);

// Add sticky table header library.
drupal_add_js('misc/tableheader.js');
?>
<table class="table table-striped table-responsive sticky-enabled">
  <thead>
    <tr class="bkg_b">
      <th>Client</th>
      <th>Document Type</th>
      <th>Uploaded Document</th>
      <th>Status</th>
      <th>Comments</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    <?php
    $total_count = count($result);
    foreach ($result as $rec) {
      $user_info = user_load($rec->uid);
      $user_name = array(
        'first' => $user_info->field_first_name['und'][0]['value'],
        'middle' => isset($user_info->field_middle_name['und']) ? $user_info->field_middle_name['und'][0]['value'] : '',
        'last' => $user_info->field_last_name['und'][0]['value'],
      );
      ?>
      <tr>
        <td>
          <?php $name = implode(' ', $user_name); ?>
          <b>Name-</b> <?php print l(t($name), 'user/' . $user_info->uid . '/edit'); ?>
          <br/>
          <b>Phone-</b> <?php print $user_info->field_phone['und'][0]['value']; ?>
          <br/>
          <b>Email-</b> <?php print $user_info->mail; ?>
        </td>
        <td>
          <?php
          if ($rec->type == 'important_document') {
            print 'Important Document';
          }
          if ($rec->type == 'account_verification') {
            print 'Account Verification';
          }
          ?>
        </td>
        <td>
          <?php
          if ($rec->type == 'important_document') {
            $explode = explode('.', $rec->field_pr_upload['und'][0]['filename']);
            $file_extension = $explode[1];
            print '<a href="' . $base_url . '/sites/ndsbs.com/files/paperwork/' . $rec->field_pr_upload['und'][0]['filename'] . '" type="application/' . $file_extension . '; length=' . $rec->field_pr_upload['und'][0]['filesize'] . '" target="_blank" class="details_icon">' . $rec->field_tittle['und'][0]['value'] . '</a>';
          }
          if ($rec->type == 'account_verification') {
            $explode = explode('.', $rec->field_pa_upload['und'][0]['filename']);
            $file_extension = $explode[1];
            print '<a href="' . $base_url . '/sites/ndsbs.com/files/paperwork/' . $rec->field_pa_upload['und'][0]['filename'] . '" type="application/' . $file_extension . '; length=' . $rec->field_pa_upload['und'][0]['filesize'] . '" target="_blank" class="details_icon">' . $rec->field_pa_title['und'][0]['value'] . '</a>';
          }
          ?>
        </td>
        <td>
          <?php
          if ($rec->type == 'important_document') {
            $imp_status = isset($rec->field_imp_status['und']) && $rec->field_imp_status['und'][0]['value'] == 1;
            if ($imp_status) {
              print 'Verified';
            }
            else {
              print 'Not Verified';
            }
          }
          if ($rec->type == 'account_verification') {
            $field_acc_status = isset($rec->field_acc_status['und']) && $rec->field_acc_status['und'][0]['value'] == 1;
            if ($field_acc_status) {
              print 'Verified';
            }
            else {
              print 'Not Verified';
            }
          }
          ?>
        </td>

        <td>
          <?php
          if ($rec->type == 'important_document' && isset($rec->field_pr_description['und'])) {
            print $rec->field_pr_description['und'][0]['value'];
          }
          if ($rec->type == 'account_verification' && isset($rec->field_pa_description['und'])) {
            print $rec->field_pa_description['und'][0]['value'];
          }
          ?>
        </td>

        <td>
          <?php
          if ($rec->type == 'important_document') {
            //  verify/document/nid/%/%
            $field_imp_status = isset($rec->field_imp_status['und']) && $rec->field_imp_status['und'][0]['value'] == 1;
            if ($field_imp_status) {
              print '<a href="' . $base_url . '/verify/document/nid/' . $rec->nid . '/imp/0" class="edit_icon">Not Verify</a>';
            }
            else {
              print '<a href="' . $base_url . '/verify/document/nid/' . $rec->nid . '/imp/1" class="edit_icon">Verify</a>';
            }
            if (user_access('delete necessary documents')) {
              print '<a href="' . $base_url . '/node/' . $rec->nid . '/delete?destination=list/verification/document" class="delete_icon">Delete</a>';
            }
          }
          if ($rec->type == 'account_verification') {
            $_field_acc_status = isset($rec->field_acc_status['und']) && $rec->field_acc_status['und'][0]['value'] == 1;
            if ($_field_acc_status) {
              print '<a href="' . $base_url . '/verify/document/nid/' . $rec->nid . '/acc/0" class="edit_icon">Not Verify</a>';
            }
            else {
              print '<a href="' . $base_url . '/verify/document/nid/' . $rec->nid . '/acc/1" class="edit_icon">Verify</a>';
            }
            if (user_access('delete necessary documents')) {
              print '<a href="' . $base_url . '/node/' . $rec->nid . '/delete?destination=list/verification/document" class="delete_icon">Delete</a>';
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
        <td class="txt_ac" colspan="5">
          Record not found.
        </td>
      </tr>
      <?php
    }
    ?>
  </tbody>
</table>
<?php
$total = 3;
//pager_default_initialize($total, 1, $element = 0);
print $output = theme('pager', array('quantity' => $total)); ?>
