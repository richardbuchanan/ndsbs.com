<?php

/**
 * @file
 * user_view_assessment_report.tpl.php
 */
include_once 'stepsheader.tpl.php';

$get_assessment_id = explode('/', $_SESSION['COMPLETE_MY_QUESTIONNAIRE']);
$assessment_id = $get_assessment_id[2];
$transid = $get_assessment_id[4];
$termid = $get_assessment_id[6];
$client_reports = get_all_client_reports($transid);
$host = str_replace('www.', '', $_SERVER['HTTP_HOST']);

// Add sticky table header library.
drupal_add_js('misc/tableheader.js');
?>
<table class="table table-striped table-responsive sticky-enabled">
  <thead>
  <tr>
    <th>Assessment</th>
    <th>Report</th>
    <th>Links</th>
  </tr>
  </thead>
  <tbody>
    <?php foreach ($client_reports as $report): ?>
      <?php $links = array(); ?>
      <?php $options = array('html' => TRUE); ?>

      <?php $view = '/sites/' . $host . '/files/reports/' . $report['report']; ?>
      <?php $links[] = "<a href='$view' target='_blank' title='View report'><span class='glyphicon glyphicon-eye-open' aria-hidden='true'></span></a>"; ?>

      <?php $download = '/download/report?file_name_path=%20public://reports/' . $report['report']; ?>
      <?php $links[] = "<a href='$download' title='Download report'><span class='glyphicon glyphicon-download' aria-hidden='true'></span></a>"; ?>

      <?php $print = '/sites/' . $host . '/files/reports/' . $report['report']; ?>
      <?php $links[] = "<a href='$print' target='_blank' title='Print report'><span class='glyphicon glyphicon-print' aria-hidden='true'></span></a>"; ?>

      <tr>
        <td><?php print $report['assessment']; ?></td>
        <td><?php print $report['report']; ?></td>
        <td><span class="client-reports-links"><?php print implode('', $links); ?></span></td>
      </tr>
    <?php endforeach; ?>
  </tbody>
</table>
