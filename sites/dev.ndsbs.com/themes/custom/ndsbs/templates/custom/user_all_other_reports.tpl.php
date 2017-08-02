<?php

/**
 * @file
 * user_all_other_reports.tpl.php
 */
global $base_url;
$report_nid = arg(3);
// $report_tid = arg(5);
$record_not_found = 0;
$notary_status = 'inactive';

$search_text = isset($_REQUEST['search_text']) && $_REQUEST['search_text'] <> '';
$assessment_status = isset($_REQUEST['assessment_status']) && $_REQUEST['assessment_status'] <> '';
$report_by = isset($_REQUEST['report_by']);

drupal_add_js('misc/tableheader.js');

print search_all_other_services();
?>

<table class="uk-table uk-table-striped sticky-enabled">
  <thead>
    <tr class="bkg_b">
      <th>Client</th>
      <th>Requested Document</th>
      <th>Express Mail</th>
      <th>Status</th>
    </tr>
  </thead>

  <tbody>
  <?php if ($search_text || $assessment_status || $report_by): ?>
    <?php $report_search_data = get_all_other_reports_custom_search(); ?>

    <?php foreach ($report_search_data as $report_info): ?>
      <?php $record_not_found = 1; ?>
      <?php $term_id_assessment = $report_info->termid; ?>
      <?php $result = node_load($report_info->nid); ?>
      <tr>
        <td>
          <?php $user_data = user_load($report_info->uid); ?>
          <?php print l(t($user_data->field_first_name['und'][0]['value'] . ' ' . $user_data->field_last_name['und'][0]['value']), $base_url . '/user/' . $user_data->uid . '/edit'); ?>
          <br />
          <?php print $user_data->mail; ?>

          <?php if ($user_data->field_phone['und'][0]['value'] <> ''): ?>
            <br />
            <?php print $user_data->field_phone['und'][0]['value']; ?>
          <?php endif; ?>
        </td>

        <td>
          <?php if ($report_info->termid != $report_info->main_report_id): ?>
            <?php $sub_term_info = taxonomy_term_load($report_info->termid); ?>
            <?php print $sub_term_info->name; ?>
          <?php else: ?>
            <?php print 'Assessment Report'; ?>
          <?php endif; ?>
        </td>

        <td>
          <?php if ($report_info->express_mail > 0): ?>
            <?php print 'Yes'; ?>
            <?php print '<br />'; ?>
            <?php print 'Requested On-'; ?>
            <?php print '<br />'; ?>
            <?php print date('M d, Y', $report_info->order_date); ?>
          <?php else: ?>
            <?php print 'No'; ?>
          <?php endif; ?>
        </td>

        <?php if ($notary_status == 'active'): ?>
          <td>
            <?php if ($report_info->notary_cost > 0): ?>
              <?php print 'Yes'; ?>
              <?php print '<br />'; ?>
              <?php print 'Requested On-'; ?>
              <?php print '<br />'; ?>
              <?php print date('M d, Y', $report_info->order_date); ?>
            <?php else: ?>
              <?php print 'No'; ?>
            <?php endif; ?>
          </td>
        <?php endif; ?>

        <td>
          <?php if ($report_info->report_status == 1): ?>
            <ul class="tr_actions">
              <li class="completed_icon">Completed</li>
            </ul>
            <a href="<?php print $base_url ?>/users/other/report/orderid/<?php print $report_info->order_id; ?>/oid/<?php print $report_info->id; ?>">
              <ul class="tr_actions">
                <li class="createinvoice_icon">Create Report</li>
              </ul>
            </a>
          <?php else: ?>
            <a href="<?php print $base_url ?>/users/other/report/orderid/<?php print $report_info->order_id; ?>/oid/<?php print $report_info->id; ?>">
              <ul class="tr_actions">
                <li class="createinvoice_icon">Create Report</li>
              </ul>
            </a>
          <?php endif; ?>
        </td>
      </tr>
    <?php endforeach; ?>
  <?php else: ?>
    <?php $sub_data = get_subreports_basedon_mainreports($tmp_termid = NULL, $payment_status = 1, $subreport = 1); ?>

    <?php foreach ($sub_data as $key => $report_info): ?>
      <?php $user_data = user_load($report_info->uid); ?>
      <?php if (!empty($user_data)): ?>
        <?php $record_not_found = 1; ?>
        <tr>
          <td>
            <?php print l(t($user_data->field_first_name['und'][0]['value'] . ' ' . $user_data->field_last_name['und'][0]['value']), $base_url . '/user/' . $user_data->uid . '/edit'); ?>
            <?php print '<br />'; ?>
            <?php print $user_data->mail; ?>

            <?php if (print $user_data->field_phone['und'][0]['value'] <> ''): ?>
              <?php print '<br />'; ?>
              <?php print $user_data->field_phone['und'][0]['value']; ?>
            <?php endif; ?>
          </td>

          <td>
            <?php $sub_term_info = taxonomy_term_load($report_info->termid); ?>
            <?php print $sub_term_info->name; ?>
          </td>

          <td>
            <?php if ($report_info->express_mail > 0): ?>
              <?php print 'Yes'; ?>
              <?php print '<br />'; ?>
              <?php print 'Requested On-'; ?>
              <?php print '<br />'; ?>
              <?php print date('M d, Y', $report_info->order_date); ?>
            <?php else: ?>
              <?php print 'No'; ?>
            <?php endif; ?>
          </td>

          <?php if ($notary_status == 'active'): ?>
            <td>
              <?php if ($report_info->notary_cost > 0): ?>
                <?php print 'Yes'; ?>
                <?php print '<br />'; ?>
                <?php print 'Requested On-'; ?>
                <?php print '<br />'; ?>
                <?php print date('M d, Y', $report_info->order_date); ?>
              <?php else: ?>
                <?php print 'No'; ?>
              <?php endif; ?>
            </td>
          <?php endif; ?>

          <td>
            <?php if ($report_info->report_status == 1): ?>
              <ul class="tr_actions">
                <li class="completed_icon">Completed</li>
              </ul>
              <a href="<?php print $base_url ?>/users/other/report/orderid/<?php print $report_info->order_id; ?>/oid/<?php print $report_info->id; ?>">
                <ul class="tr_actions">
                  <li class="createinvoice_icon">Create Report</li>
                </ul>
              </a>
            <?php else: ?>
              <a href="<?php print $base_url ?>/users/other/report/orderid/<?php print $report_info->order_id; ?>/oid/<?php print $report_info->id; ?>">
                <ul class="tr_actions">
                  <li class="createinvoice_icon">Create Report</li>
                </ul>
              </a>
            <?php endif; ?>
          </td>
        </tr>
      <?php endif; ?>
    <?php endforeach; ?>
  <?php endif; ?>

  <?php if ($record_not_found == 0): ?>
    <tr>
      <td class="txt_ac" colspan="5">Record not found.</td>
    </tr>
  <?php endif; ?>
  </tbody>
</table>
