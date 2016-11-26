<?php
/**
 * @file
 * user_all_other_reports.tpl.php
 */
global $base_url;
$report_nid = arg(3);
$report_tid = arg(5);
$record_not_found = 0;

//  Notary status defined on 29-03-2013 mail dated on 29-03-2013
$notary_status = 'inactive';        //  Change $notary_status from inactive to active to show the notary
//  Notary status defined on 29-03-2013

// Add sticky table header library.
drupal_add_js('misc/tableheader.js');

?>
<?php print search_all_other_services(); ?>
<table class="table table-striped table-responsive sticky-enabled">
  <thead>
  <tr class="bkg_b">
    <th>Client</th>
    <th>Requested Document</th>
    <th>Express Mail</th>
    <?php
    if ($notary_status == 'active') {
      ?>
      <th>Notary Request</th>
      <?php
    }
    ?>
    <th>Status</th>
  </tr>
  </thead>
  <tbody>
  <?php
  if ($_REQUEST['search_text'] <> '' || $_REQUEST['assessment_status'] <> '' || $_REQUEST['report_by']) {
    //////////////////////////    Search START    //////////////////////////
    $report_search_data = get_all_other_reports_custom_search();
    ?>

    <?php
    foreach ($report_search_data as $report_info) {
      $record_not_found = 1;
      $term_id_assessment = $report_info->termid;
      //  load the node data
      $result = node_load($report_info->nid);
      ?>
      <tr>
        <td>
          <?php
          $user_data = user_load($report_info->uid);
          print l(t($user_data->field_first_name['und'][0]['value'] . ' ' . $user_data->field_last_name['und'][0]['value']), $base_url . '/user/' . $user_data->uid . '/edit');
          print '<br />';
          print $user_data->mail;
          if ($user_data->field_phone['und'][0]['value'] <> '') {
            print '<br />';
            print $user_data->field_phone['und'][0]['value'];
          }
          ?>
        </td>
        <td>
          <?php
          if ($report_info->termid != $report_info->main_report_id) {
            $sub_term_info = taxonomy_term_load($report_info->termid);
            print $sub_term_info->name;
            //print '<pre>';
            //print_r($sub_term_info);
            //print '</pre>';
          }
          else {
            print 'Assessment Report';
          }
          ?>
        </td>
        <td>
          <?php
          if ($report_info->express_mail > 0) {
            print 'Yes';
            print '<br />';
            print 'Requested On-';
            print '<br />';
            print date('M d, Y', $report_info->order_date);
          }
          else {
            print 'No';
          }
          ?>
        </td>
        <?php
        if ($notary_status == 'active') {
          ?>
          <td>
            <?php
            if ($report_info->notary_cost > 0) {
              print 'Yes';
              print '<br />';
              print 'Requested On-';
              print '<br />';
              print date('M d, Y', $report_info->order_date);
            }
            else {
              print 'No';
            }
            ?>
          </td>
          <?php
        }
        ?>
        <td>
          <?php
          if ($report_info->report_status == 1) {
            print '<ul class="tr_actions">
                                                    <li class="completed_icon">Completed</li>
                                                </ul>';
            ?>
            <a
              href="<?php print $base_url ?>/users/other/report/orderid/<?php print $report_info->order_id; ?>/oid/<?php print $report_info->id; ?>">
              <ul class="tr_actions">
                <li class="createinvoice_icon">Create Report</li>
              </ul>
            </a>
            <?php
          }
          else {
            ?>
            <a
              href="<?php print $base_url ?>/users/other/report/orderid/<?php print $report_info->order_id; ?>/oid/<?php print $report_info->id; ?>">
              <ul class="tr_actions">
                <li class="createinvoice_icon">Create Report</li>
              </ul>
            </a>
            <?php
          }
          ?>

          <?php
          /*
              if($report_info->report_status == 1) {
                  print '<ul class="tr_actions">
                          <li class="completed_icon">Completed</li>
                      </ul>';
              } else {
                  print '<ul class="tr_actions">
                          <li class="pending_icon">Pending</li>
                      </ul>';
              }
           */
          ?>
        </td>
      </tr>
      <?php
    }
    ?>

    <?php
    //////////////////////////    Search END    //////////////////////////
  }
  else {
    ?>
    <?php
    //$report_nid, 1, 1, $report_tid
    $sub_data = get_subreports_basedon_mainreports($tmp_termid = NULL, $payment_status = 1, $subreport = 1);
//                    print '<pre>';
//                        print_r($sub_data);
//                    print '</pre>';

    foreach ($sub_data as $report_info) {
      $record_not_found = 1;
      ?>
      <tr>
        <td>
          <?php
          $user_data = user_load($report_info->uid);
          print l(t($user_data->field_first_name['und'][0]['value'] . ' ' . $user_data->field_last_name['und'][0]['value']), $base_url . '/user/' . $user_data->uid . '/edit');
          print '<br />';
          print $user_data->mail;

          if (print $user_data->field_phone['und'][0]['value'] <> '') {
            print '<br />';
            print $user_data->field_phone['und'][0]['value'];
          }
          ?>
        </td>
        <td>
          <?php
          $sub_term_info = taxonomy_term_load($report_info->termid);
          print $sub_term_info->name;
          ?>
        </td>
        <td>
          <?php
          if ($report_info->express_mail > 0) {
            print 'Yes';
            print '<br />';
            print 'Requested On-';
            print '<br />';
            print date('M d, Y', $report_info->order_date);
          }
          else {
            print 'No';
          }
          ?>
        </td>
        <?php
        if ($notary_status == 'active') {
          ?>
          <td>
            <?php
            if ($report_info->notary_cost > 0) {
              print 'Yes';
              print '<br />';
              print 'Requested On-';
              print '<br />';
              print date('M d, Y', $report_info->order_date);
            }
            else {
              print 'No';
            }
            ?>
          </td>
          <?php
        }
        ?>
        <td>
          <?php
          if ($report_info->report_status == 1) {
            print '<ul class="tr_actions">
                                                    <li class="completed_icon">Completed</li>
                                                </ul>';
            ?>
            <a
              href="<?php print $base_url ?>/users/other/report/orderid/<?php print $report_info->order_id; ?>/oid/<?php print $report_info->id; ?>">
              <ul class="tr_actions">
                <li class="createinvoice_icon">Create Report</li>
              </ul>
            </a>
            <?php
          }
          else {
            ?>
            <a
              href="<?php print $base_url ?>/users/other/report/orderid/<?php print $report_info->order_id; ?>/oid/<?php print $report_info->id; ?>">
              <ul class="tr_actions">
                <li class="createinvoice_icon">Create Report</li>
              </ul>
            </a>
            <?php
          }
          ?>
        </td>
      </tr>
      <?php
    }
    ?>
  <?php } ?>
  <?php
  if ($record_not_found == 0) {
    ?>
    <tr>
      <td class="txt_ac" colspan="5">Record not found.</td>
    </tr>
    <?php
  }
  ?>
  </tbody>
</table>
