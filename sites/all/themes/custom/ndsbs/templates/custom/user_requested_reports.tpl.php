<?php
/**
 * @file
 * user_requested_reports.tpl.php
 */
global $base_url;
//  Notary status defined on 29-03-2013 mail dated on 29-03-2013
$notary_status = 'inactive';        //  Change $notary_status from inactive to active to show the notary
//  Notary status defined on 29-03-2013

$report_nid = arg(3);
$record_not_found = 0;
//  Function call to get the Subreports only
$subreport_data = get_purchased_items_subreports();

// Add sticky table header library.
drupal_add_js('misc/tableheader.js');
?>
<table class="uk-table uk-table-striped sticky-enabled">
  <thead>
  <tr class="bkg_b">
    <th>Report Type</th>
    <th>Status</th>
    <th>Express Mail</th>
    <?php
    if ($notary_status == 'active') {
      ?>
      <th>Notary Request</th>
      <?php
    }
    ?>
    <th>Action</th>
  </tr>
  </thead>
  <tbody>
  <?php
  //        echo '<pre>';
  //            print_r($subreport_data);
  //        echo '</pre>';
  //  Sub Report for display main price of subreport and shipping and notary information for sub reports only START
  foreach ($subreport_data as $sub_info) {
    $record_not_found = 1;
    $term_id_assessment = $sub_info->termid;
    $sub_report = taxonomy_term_load($sub_info->termid);
    //echo '<pre>';
    //print_r($sub_report);
    //echo '</pre>';
    ?>
    <tr>
      <td>
        <?php
        print $sub_report->name;
        ?>
      </td>
      <td>
        <?php
        print 'EM:';    //  Express Mail
        if ($sub_info->express_mail > 0 && $sub_info->main_report <> '' && $sub_info->updated_on > 0) {
          print 'Dispatched on ' . date('M d, Y', $sub_info->updated_on);
        }
        elseif ($sub_info->express_mail > 0 && $sub_info->main_report == '') {
          print 'Pending';
        }
        else {
          print 'Not Requested';
        }
        ?>
      </td>
      <td>
        <?php
        if ($sub_info->express_mail > 0) {
          print 'Yes';
          print '<br />';
          print 'Requested On-';
          print '<br />';
          print date('M d, Y', $sub_info->order_date);
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
          if ($sub_info->notary_cost > 0) {
            print 'Yes';
            print '<br />';
            print 'Requested On-';
            print '<br />';
            print date('M d, Y', $sub_info->order_date);
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
        $notavailable = 0;
        //  Report Download
        if ($sub_info->main_report <> '') {
          $fname = $sub_info->main_report;
          $file_name_path = 'public://reports/' . $fname;
          print l(t('Download Doc'), $base_url . '/download/report', array(
            'query' => array('file_name_path' => $file_name_path),
            'attributes' => array('class' => 'download_icon')
          ));

          //  Send report in email
          print l(t('Email Doc'), $base_url . '/send/attachment', array(
            'query' => array(
              'file_name_path' => $file_name_path,
              'file_name' => $fname,
              'report_nid' => $report_nid,
            ),
            'attributes' => array('class' => 'email_icon')
          ));
        }
        else {
          print 'NA';
        }
        ?>
      </td>
    </tr>
    <?php
  }
  //  Sub Report for display main price of subreport and shipping and notary information for sub reports only END
  ?>
  <?php
  if ($record_not_found == 0) {
    ?>
    <tr>
      <td class="txt_ac" colspan="4">No record found.</td>
    </tr>
    <?php
  }
  ?>
  </tbody>
</table>
