<?php
/**
 * @file
 * list_all_assessment.tpl.php
 */

//  function defined to load the content type third party request
$val = get_all_assessment();
$nid_array = array();

foreach ($val as $data) {
  $nid_array[] = $data->nid;
}

//  load the node data
$result = node_load_multiple($nid_array);

// Add sticky table header library.
drupal_add_js('misc/tableheader.js');
?>
<div id="action-links" class="panel panel-default">
  <div class="panel-body">
    <a href="/node/add/assessment"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Add assessment</a>
  </div>
</div>
<table class="table table-striped table-responsive sticky-enabled">
  <thead>
    <tr>
      <th>Assessment Details</th>
      <th>Online Questionnaire?</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
  <?php
  $total_count = count($result);
  foreach ($result as $rec) {
    ?>
    <tr>
      <td>
        <?php
        print $rec->field_assessment_title['und'][0]['value'];
        print '<br />';
        print '<b>Cost:</b> $' . get_service_amount($rec->field_primary_service['und'][0]['tid']);
        print '<br />';
        print '<b>Status:</b> ' . $rec->field_assessment_status['und'][0]['value'];
        ?>
      </td>
      <td>
        <?php print $rec->field_online_questionnaire['und'][0]['value']; ?>
        <br/>
        <?php
        if ($rec->field_online_questionnaire['und'][0]['value'] == 'Available') {
          print l(t('View Questionnaire'), 'questionnaire/preview/' . $rec->nid . '/trans/1/uid/1');
        }
        ?>
      </td>
      <td>
        <?php
        $options = array(
          'query' => array('destination' => 'admin/content/assessments'),
          'attributes' => array('class' => 'edit_icon')
        );
        print l(t('Edit'), 'node/' . $rec->nid . '/edit', $options);
        ?>
      </td>
    </tr>
    <?php
  }

  if ($total_count <= 0) { ?>
    <tr>
      <td class="txt_ac" colspan="5">
        Record not found.
      </td>
    </tr>
  <?php } ?>
  </tbody>
</table>
