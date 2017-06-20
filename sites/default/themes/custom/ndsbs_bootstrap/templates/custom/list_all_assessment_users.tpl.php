<?php

/**
 * @file
 * user_transactions.tpl.php
 */

global $base_url, $user;
$i = 0;

if ((isset($_REQUEST['search_text']) && $_REQUEST['search_text'] <> '') || (isset($_REQUEST['assessment_status']) && $_REQUEST['assessment_status'] <> '')) {
  $data = get_all_assessment_clients_custom_search();
}
else {
  $data = get_all_assessment_users();
}

// Add sticky table header library.
drupal_add_js('misc/tableheader.js');

print search_assessment_client();
?>
<table class="table table-striped table-responsive sticky-enabled">
  <thead>
    <tr class="bkg_b">
      <th>Client</th>
      <th>Service & Status</th>
      <th>Questionnaire</th>
      <th>Service Duration</th>
      <th>Assign Counselor</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    <?php
    $total_count = count($data);
    $transactions = array();
    foreach($data as $data_info):
      if (!in_array($data_info->transaction_id, $transactions)):
        $node_info = node_load($data_info->nid);
        //  Function called to get the main service and sub service title
        $service_title = get_mainservice_subservice_title($node_info, $data_info->termid);
        $explode_title = explode('||', $service_title);

        //  Get the details of attempted questionnaire
        $qinfo = questionnaire_attempted_details($data_info->nid, $data_info->uid, $data_info->order_id);
        $user_info = user_load($data_info->uid);

        if (isset($user_info->uid)): ?>
          <tr>
            <td class="user-info">
              <?php if (user_access('administer users')): ?>
                <span class="table-cell-clear"><?php print l(t($user_info->field_first_name['und'][0]['value'] . ' ' . $user_info->field_last_name['und'][0]['value']), 'user/'.$user_info->uid.'/edit'); ?></span>
              <?php else: ?>
              <span class="table-cell-clear"><?php print t($user_info->field_first_name['und'][0]['value'] . ' ' . $user_info->field_last_name['und'][0]['value']); ?></span>
              <?php endif; ?>

              <?php if($user_info->field_phone['und'][0]['value'] <> ''): ?>
              <span class="table-cell-clear"><b>Phone:</b> <?php print $user_info->field_phone['und'][0]['value']; ?></span>
              <?php endif; ?>
                  <span class="table-cell-clear"><b>Email:</b> <?php print $user_info->mail; ?></span>
            </td>
            <td>
              <?php
              //  Main Service and Sub service title
              $main_service = $explode_title[0];
              if (isset($explode_title[1])) {
                $sub_service = $explode_title[1];
              }
              else {
                $sub_service = 'NO';
              }
              ?>
              <span class="table-cell-clear"><?php print $main_service; ?></span>

              <?php if ($sub_service <> 'NO'): ?>
                <span class="table-cell-clear">(<?php print $sub_service; ?>)</span>
              <?php endif; ?>
              <?php if ($data_info->report_status == 0): ?>
                <span class="table-cell-clear"><b>Status: </b> In process</span>
              <?php else: ?>
                <span class="table-cell-clear"><b>Status: </b> Completed</span>
              <?php endif; ?>
            </td>
            <td>
              <?php
              $status = 'Pending';
              $total_attempted = 0;
              foreach($qinfo as $ques_data) {
                if($ques_data->evaluation == 1) {
                  $status = 'Completed';
                } else {
                  $status = 'Pending';
                }
                $total_attempted = $ques_data->total_attempts;
              }
              ?>
              <span class="table-cell-clear"><b>Status:</b> <?php print $status; ?></span>
              <span class="table-cell-clear"><b>Attempted:</b> <?php print $total_attempted; ?> times</span>
              <?php if($total_attempted > 0): ?>
                <?php $view_option = array('attributes' => array(
                  'class' => 'form-submit'
                )); ?>
                <div class="form-actions" style="clear: both;">
                  <?php print l(t('View/Print'), $base_url.'/admin/questionnaire/'.$data_info->nid.'/trans/'.$data_info->order_id.'/uid/' . $data_info->uid . '/service/' . $main_service, $view_option); ?>
                  <?php $print_option = array(
                    'attributes' => array(
                      'class' => 'form-submit'
                  )); ?>
                  <?php //print l(t('Print'), $base_url.'/questionnaire/print/'.$data_info->nid.'/trans/'.$data_info->order_id.'/uid/' . $data_info->uid, $print_option); ?>
                </div>
              <?php endif; ?>
            </td>
            <td>
              <span class="table-cell-clear"><b>Start:</b> <?php print date('M d, Y', $data_info->order_date); ?></span>
              <?php $next_date = strtotime(date("Y-m-d", $data_info->order_date) . " +10 days"); ?>
              <span class="table-cell-clear"><b>End: </b> <?php print $end_date = date('M d, Y', $next_date); ?></span>
            </td>
            <td>
              <?php
              $get_therapist = 0;
              if (isset($data_info->therapist)) {
                $get_therapist = get_assigned_therapist($data_info->therapist);
              }
              $therapist = trim($get_therapist);
              if (empty($therapist)) {
                if ($user->roles[3] == 'super admin' || $user->roles[5] == 'staff admin') {
                  $options = array(
                    'query' => array(
                      'destination' => 'all/assessment/users'
                  ));
                  print '<span class="table-cell-clear">' . l(t('Assign therapist'), 'assign/therapist/oid/'.$data_info->order_id, $options) . '</span>';
                }
                else {
                  Print '<span class="table-cell-clear">N/A</span>';
                }
              }
              else {
                if ($user->roles[3] == 'super admin' || $user->roles[5] == 'staff admin') {
                  $options = array('query' => array('destination' => 'all/assessment/users'));
                  print '<span class="table-cell-clear">' . l(t($therapist), 'assign/therapist/oid/'.$data_info->order_id, $options) . '</span>';
                }
                else {
                  print '<span class="table-cell-clear">' . $therapist . '</span>';
                }
              }
              ?>
            </td>
            <td>
              <?php
                $options = array(
                  'attributes' => array(
                    'name' => 'user_report',
                    'class' => array('simple-dialog'),
                    'title' => 'Client Reports',
                    'rel' => array('width:900;height:550;resizable:true;position:[center,60]')
                ));
                print '<span class="table-cell-clear">' . l(t('Go to report'), $base_url . '/users/view/reports/'.$user_info->uid.'/tid/'.$data_info->termid.'/nid/'.$data_info->nid.'/transid/'.$data_info->order_id) . '</span>';
              ?>
            </td>
          </tr>
        <?php endif; ?>
      <?php endif; ?>
      <?php $i++; ?>
      <?php $transactions[] = $data_info->transaction_id; ?>
    <?php endforeach; ?>
    <?php if($total_count <= 0): ?>
    <tr>
      <td colspan="6" class="txt_ac">Record not found.</td>
    </tr>
    <?php endif; ?>
  </tbody>
</table>

<?php if ($i > 0): ?>
  <?php print $output = theme('pager', array('quantity' => 9)); ?>
<?php endif; ?>
