<?php
/**
 * @file
 * list_verification_document.tpl.php
 */
global $base_url;
include_once 'headerimpdoc.tpl.php';

// Add sticky table header library.
drupal_add_js('misc/tableheader.js');
?>
<table class="table table-striped table-responsive sticky-enabled">
  <thead>
    <tr>
      <th>Document Type</th>
      <th>Title</th>
      <th>Status</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
  <?php
  $i = 1;
  $total_count = count($impacc_data);
  foreach ($impacc_data as $rec) {
    ?>
    <tr>
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
          print $rec->field_tittle['und'][0]['value'];
        }
        if ($rec->type == 'account_verification') {
          print $rec->field_pa_title['und'][0]['value'];
        }
        ?>
      </td>
      <td>
        <?php
        if ($rec->type == 'important_document') {
          if ($rec->field_imp_status['und'][0]['value'] == 1) {
            print 'Verified';
          }
          else {
            print 'Not Verified';
          }
        }
        if ($rec->type == 'account_verification') {
          if ($rec->field_acc_status['und'][0]['value'] == 1) {
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
        if ($rec->type == 'important_document') {
          $explode = explode('.', $rec->field_pr_upload['und'][0]['filename']);
          $file_extension = $explode[1];
          print '<a href="' . $base_url . '/sites/ndsbs.com/files/paperwork/' . $rec->field_pr_upload['und'][0]['filename'] . '" type="application/' . $file_extension . '; length=' . $rec->field_pr_upload['und'][0]['filesize'] . '" target="_blank" class="edit_icon">View</a>';
          if ($rec->field_imp_status['und'][0]['value'] != 1) {
            print '<a href="' . $base_url . '/node/' . $rec->nid . '/delete?destination=list/verification/document" class="delete_icon">Delete</a>';

          }
          else {
            print '<ul class="tr_actions">
                                         <li class="delete_icon">Delete</li>
                                       </ul>';
          }
        }
        if ($rec->type == 'account_verification') {
          $explode = explode('.', $rec->field_pa_upload['und'][0]['filename']);
          $file_extension = $explode[1];
          print '<a href="' . $base_url . '/sites/ndsbs.com/files/paperwork/' . $rec->field_pa_upload['und'][0]['filename'] . '" type="application/' . $file_extension . '; length=' . $rec->field_pa_upload['und'][0]['filesize'] . '" target="_blank" class="edit_icon">View</a>';
          if ($rec->field_acc_status['und'][0]['value'] != 1) {
            print '<a href="' . $base_url . '/node/' . $rec->nid . '/delete?destination=list/verification/document" class="delete_icon">Delete</a>';

          }
          else {
            print '<ul class="tr_actions">
                                         <li class="delete_icon">Delete</li>
                                       </ul>';
          }
        }
        ?>
      </td>
    </tr>
    <?php
    $i++;
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
  </tbody>
</table>
