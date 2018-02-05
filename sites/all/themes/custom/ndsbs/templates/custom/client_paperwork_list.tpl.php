<?php
/**
 * @file
 * client_paperwork_list.tpl.php
 */
global $base_url;
include_once 'stepsheader.tpl.php';
$upload_url = $base_url . '/node/add/paper-work';

$upload_link = l('Submit new document', $upload_url, array(
  'query' => array(
    'destination' => 'view/assessment/report'
  ),
  'attributes' => array(
    'class' => array(
      'uk-button',
      'uk-button-primary',
    )
  )
));
$i = 1;
$total_count = count($result);

// Add sticky table header library.
drupal_add_js('misc/tableheader.js');
?>
<p>Fax your important document at 614.888.3239, or:</p>
<p><?php print $upload_link; ?></p>

<table class="uk-table uk-table-striped sticky-enabled">
  <thead>
  <tr>
    <th>S.No.</th>
    <th>Title</th>
    <th>Selected File</th>
    <th>Status</th>
    <th>Note</th>
    <th>Action</th>
  </tr>
  </thead>
  <tbody>
  <?php foreach ($result as $rec): ?>
    <?php $explode = explode('.', $rec->field_upload['und'][0]['filename']); ?>
    <?php $file_type = 'application/' . $explode[1]; ?>
    <?php $file_name = $rec->field_upload['und'][0]['filename']; ?>
    <?php $file_size = 'length=' . $rec->field_upload['und'][0]['filesize']; ?>
    <?php $file_url = $base_url . '/sites/ndsbs.com/files/paperwork/' . $file_name; ?>
    <?php $file_link = l($file_name, $file_url, array(
      'attributes' => array(
        'type' => $file_type . '; ' . $file_size
      )
    )); ?>
    <?php $old_file_link = '<a href="'.$base_url.'/sites/ndsbs.com/files/paperwork/' . $rec->field_upload['und'][0]['filename'] . '" type="application/' . $file_extension . '; length=' . $rec->field_upload['und'][0]['filesize'] . '">' . $rec->field_upload['und'][0]['filename'] . '</a>'; ?>
    <?php if ($rec->field_paperwork_status['und'][0]['value'] == 1): ?>
      <?php $verified =  'Verified'; ?>
    <?php else: ?>
      <?php $verified = 'Not Verified'; ?>
    <?php endif; ?>
    <?php if($rec->field_paperwork_status['und'][0]['value'] == 1): ?>
      <?php $actions = '<ul class="tr_actions">'; ?>
      <?php $actions .= '<li class="edit_icon">Edit</li>'; ?>
      <?php $actions .= '<li class="delete_icon">Delete</li>'; ?>
      <?php $actions .= '</ul>'; ?>
    <?php else: ?>
      <?php $edit = $base_url . '/node/' . $rec->nid . '/edit'; ?>
      <?php $delete = $base_url . '/node/' . $rec->nid . '/delete'; ?>
      <?php $edit_link = l('Edit', $edit, array(
        'query' => array(
          'destination' => 'user/paperwork/list'
        ),
        'attributes' => array(
          'class' => array(
            'edit_icon'
          )
        )
      )); ?>
      <?php $delete_link = l('Delete', $delete, array(
        'query' => array(
          'destination' => 'user/paperwork/list'
        ),
        'attributes' => array(
          'class' => array(
            'delete_icon'
          )
        )
      )); ?>
      <?php $actions = $edit_link; ?>
      <?php $actions .= $delete_link; ?>
    <?php endif; ?>
    <tr>
      <td><?php print $i; ?></td>
      <td><?php print $rec->field_title['und'][0]['value']; ?></td>
      <td><?php print $file_link; ?></td>
      <td><?php print $verified; ?></td>
      <td><?php print $rec->field_paperwork_note['und'][0]['value']; ?></td>
      <td><?php print $actions; ?></td>
    </tr>
    <?php $i++; ?>
  <?php endforeach; ?>
  <?php if ($total_count <= 0): ?>
    <tr><td class="txt_ac" colspan="6">Record not found.</td></tr>
  <?php endif; ?>
  </tbody>
</table>
