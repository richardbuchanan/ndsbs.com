<?php
/**
 * @file
 * client_stateform_list.tpl.php
 */
global $base_url;
include_once 'headerstate.tpl.php';

// Add sticky table header library.
drupal_add_js('misc/tableheader.js');
?>
<table class="uk-table uk-table-striped sticky-enabled">
  <thead>
  <tr>
    <th>Title</th>
    <th>Selected File</th>
    <th>Report</th>
    <th>Action</th>
  </tr>
  </thead>
  <tbody>
    <?php $i = 1; ?>
    <?php $total_count = count($result); ?>
    <?php foreach ($result as $rec): ?>
      <tr>
        <td>
          <?php foreach ($rec->field_state_form_title['und'] as $data): ?>
            <?php print $data['value']; ?><br/>
          <?php endforeach; ?>
        </td>
        <td>
          <?php foreach ($rec->field_state_form_upload['und'] as $data): ?>
            <?php print l(t($data['filename']), $base_url . '/download/report', array('query' => array('file_name_path' => $data['uri']))); ?>
            <br/>
          <?php endforeach; ?>
        </td>
        <td>
          <?php if (!empty($rec->field_report_state_form['und'][0]['value'])): ?>
            <?php $fname = $rec->field_report_state_form['und'][0]['value']; ?>
            <?php $file_name_path = 'public://reports/' . $fname; ?>
            <span>Completed</span><br/>
            <?php print l(t($fname), $base_url . '/download/report', array('query' => array('file_name_path' => $file_name_path))); ?>
          <?php else: ?>
            <span>In-Process</span>
          <?php endif; ?>
        </td>
        <td>
          <?php if ($rec->field_state_form_payment_status['und'][0]['value']): ?>
            <ul>
              <li>Edit</li>
              <li>Delete</li>
            </ul>
          <?php else: ?>
            <?php $edit_url = $base_url . '/node/' . $rec->nid . '/edit?destination=user/stateform/list'; ?>
            <?php $delete_url = $base_url . '/node/' . $rec->nid . '/delete?destination=user/stateform/list'; ?>
            <a href="<?php print $edit_url; ?>">Edit</a>
            <a href="<?php print $delete_url; ?>">Delete</a>
          <?php endif; ?>
        </td>
      </tr>
      <?php $i++; ?>
    <?php endforeach; ?>
    <?php if (!$total_count): ?>
      <tr>
        <td colspan="4">Record not found.</td>
      </tr>
    <?php endif; ?>
  </tbody>
</table>
