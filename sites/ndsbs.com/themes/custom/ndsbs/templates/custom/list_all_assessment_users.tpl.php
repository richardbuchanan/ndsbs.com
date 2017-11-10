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
<table class="uk-table uk-table-striped sticky-enabled">
  <thead>
    <tr class="bkg_b">
      <th>Client</th>
      <th>Service & Status</th>
      <th>Questionnaire</th>
      <th>Letter Status</th>
      <th>Assign Counselor</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    <?php
    $total_count = count($data);
    $transactions = array();

    foreach ($data as $data_info):
      $has_refund = FALSE;
      $refund_query = new EntityFieldQuery();
      $entities = $refund_query->entityCondition('entity_type', 'node')
        ->entityCondition('bundle', 'refund_payment')
        ->propertyCondition('uid', $data_info->uid)
        ->execute();
      $nodes = node_load_multiple(array_keys($entities['node']));

      foreach ($nodes as $node) {
        if ($node->field_request_status['und'][0]['value']) {
          $has_refund = TRUE;
        }
      }

      if (!$has_refund):
        if (!in_array($data_info->transaction_id, $transactions)):
          $tran = get_transaction_info_orderid($data_info->order_id);
          $node_info = node_load($data_info->nid);
          //  Function called to get the main service and sub service title
          $service_title = get_mainservice_subservice_title($node_info, $data_info->termid);
          $explode_title = explode('||', $service_title);

          //  Get the details of attempted questionnaire
          $qinfo = questionnaire_attempted_details($data_info->nid, $data_info->uid, $data_info->order_id);
          $user_info = user_load($data_info->uid);

          $rush_amount = $tran[0]->rush_cost;
          $rush_order = $rush_amount != '0.00';
          $rush_title = '';

          switch ($rush_amount) {
            case '75.00':
              $rush_title = '2-3 business days';
              break;

            case  '150.00':
              $rush_title = 'Next business day';
              break;

            case '250.00':
              $rush_title = 'Same day';
              break;
          }

          if (isset($user_info->uid)): ?>
            <tr>
              <td class="user-info">
                <?php if (user_access('administer users')): ?>
                  <div><?php print l(t($user_info->field_first_name['und'][0]['value'] . ' ' . $user_info->field_last_name['und'][0]['value']), 'user/'.$user_info->uid.'/edit'); ?></div>
                <?php else: ?>
                  <div><?php print t($user_info->field_first_name['und'][0]['value'] . ' ' . $user_info->field_last_name['und'][0]['value']); ?></div>
                <?php endif; ?>

                <div><?php print $user_info->mail; ?></div>

                <?php if($user_info->field_phone['und'][0]['value'] <> ''): ?>
                  <?php $phone = ndsbs_get_formatted_phone($user_info->uid); ?>
                  <div><?php print $phone; ?></div>
                <?php endif; ?>
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
                <div><?php print $main_service; ?></div>

                <?php if ($sub_service <> 'NO'): ?>
                  <div>(<?php print $sub_service; ?>)</div>
                <?php endif; ?>
                <?php if ($data_info->report_status == 0): ?>
                  <div><b>Status: </b> In process</div>
                <?php else: ?>
                  <div><b>Status: </b> Completed</div>
                <?php endif; ?>
                <?php if ($rush_order): ?>
                  <div><b>Rush order: </b> <?php print $rush_title; ?></div>
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
                <div><b>Status:</b> <?php print $status; ?></div>
                <div><b>Attempted:</b> <?php print $total_attempted; ?> times</div>
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
                  </div>
                <?php endif; ?>
              </td>
              <td>
                <?php if ($data_info->service_completed): ?>
                  <div>Letter is ready</div>
                <?php else: ?>
                  <div>Awaiting letter</div>
                  <div><a href="/letter-ready/<?php print $data_info->order_id; ?>">Change letter status</a></div>
                <?php endif; ?>
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
                    print '<div>' . l(t('Assign therapist'), 'assign/therapist/oid/'.$data_info->order_id, $options) . '</div>';
                  }
                  else {
                    Print '<div>N/A</div>';
                  }
                }
                else {
                  if ($user->roles[3] == 'super admin' || $user->roles[5] == 'staff admin') {
                    $options = array('query' => array('destination' => 'all/assessment/users'));
                    print '<div>' . l(t($therapist), 'assign/therapist/oid/'.$data_info->order_id, $options) . '</div>';
                  }
                  else {
                    print '<div>' . $therapist . '</div>';
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
                  print '<div>' . l(t('Go to report'), $base_url . '/users/view/reports/'.$user_info->uid.'/tid/'.$data_info->termid.'/nid/'.$data_info->nid.'/transid/'.$data_info->order_id) . '</div>';
                ?>
              </td>
            </tr>
          <?php endif; ?>
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
