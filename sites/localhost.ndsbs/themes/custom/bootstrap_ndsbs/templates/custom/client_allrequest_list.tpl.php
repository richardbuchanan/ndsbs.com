<?php

/**
 * @file
 * client_allrequest_list.tpl.php
 */
$val = get_client_all_request_info();
$nid_array = array();
foreach ($val as $data) {
  $nid_array[] = $data->nid;
}
$result = node_load_multiple($nid_array);
$trans_data = get_failed_requested_transaction();

// Add sticky table header library.
drupal_add_js('misc/tableheader.js');
?>
<table class="table table-striped table-responsive sticky-enabled">
  <caption>All Requests</caption>
  <thead>
    <tr>
      <th>Reason</th>
      <th>Description</th>
      <th>Request Timing</th>
      <th>Action by Staff Member</th>
    </tr>
  </thead>
  <tbody>
  <?php $count = count($result); ?>

  <?php foreach ($result as $rec): ?>
    <?php switch ($rec->type): ?><?php case 'refund_payment': ?>
      <?php $purchased_service_name = get_purchased_service_dropdown(); ?>
      <?php $refund_service = $purchased_service_name[$rec->field_refund_for_service['und'][0]['tid']]; ?>
      <?php $refund_reason = $rec->field_refund_reason['und'][0]['value']; ?>
      <?php if ($rec->created != $rec->changed): ?>
        <?php $attempted_on = 'Attempted On ' . date('M d Y h:i A', $rec->changed); ?>
      <?php else: ?>
        <?php $attempted_on = '<ul class="tr_actions"><li class="pending_icon">Pending</li></ul>'; ?>
      <?php endif; ?>
      <tr>
        <td>Refund Payment</td>
        <td><b>Refund for Service - </b>
          <?php print $refund_service; ?>
          <br/>
          <b>Reason - </b><?php print $refund_reason; ?>
        </td>
        <td><?php print date('M d Y h:i A', $rec->created); ?></td>
        <td><?php print $attempted_on; ?></td>
      </tr>
      <?php break; ?>
    <?php case 'state_form_request': ?>
      <?php if ($rec->field_invoice_created_on['und'][0]['value'] != 0): ?>
        <?php $state_form_date = $rec->field_invoice_created_on['und'][0]['value']; ?>
        <?php $attempted_on = 'Attempted On ' . date('M d Y h:i A', $state_form_date); ?>
      <?php else: ?>
        <?php $attempted_on = '<ul class="tr_actions"><li class="pending_icon">Pending</li></ul>'; ?>
      <?php endif; ?>
      <tr>
        <td>State Form</td>
        <td>
          <b>State Forms - </b>
          <?php foreach ($rec->field_state_form_title['und'] as $title): ?>
            <?php print $title['value'] . ', '; ?>
          <?php endforeach; ?>
          <br/>
          <b>Comments - </b>
          <?php print $rec->field_state_form_comment['und'][0]['value']; ?>
        </td>
        <td><?php print date('M d Y h:i A', $rec->created); ?></td>
        <td><?php print $attempted_on; ?></td>
      </tr>
      <?php break; ?>
    <?php case 'counseling_request': ?>
      <?php if ($rec->created != $rec->changed): ?>
        <?php $attempted_on = 'Attempted On ' . date('M d Y h:i A', $rec->changed); ?>
      <?php else: ?>
        <?php $attempted_on = '<ul class="tr_actions"><li class="pending_icon">Pending</li></ul>'; ?>
      <?php endif; ?>
      <tr>
        <td>Counseling</td>
        <td>
          <b>Preferred Counselor - </b>
          <?php $user_info = user_load($rec->field_preferred_therapist['und'][0]['uid']); ?>
          <?php $counselor_fn = $user_info->field_first_name['und'][0]['value']; ?>
          <?php $counselor_ln = $user_info->field_last_name['und'][0]['value']; ?>
          <?php print $counselor_fn . ' ' . $counselor_ln; ?>
          <br/>
          <b>No. of Sessions
            - </b><?php print $rec->field_no_of_sessions_required['und'][0]['value']; ?>
          <br/>
          <b>Availability required
            - </b><?php print $rec->field_availability_required['und'][0]['value']; ?>
          <br/>
          <b>Comments
            - </b><?php print $rec->field_counselingrequest_comment['und'][0]['value']; ?>
        </td>
        <td><?php print date('M d Y h:i A', $rec->created); ?></td>
        <td><?php print $attempted_on; ?></td>
      </tr>
      <?php break; ?>
    <?php case 'appointment_preference': ?>
      <?php if ($rec->created != $rec->changed): ?>
        <?php $attempted_on = 'Attempted On ' . date('M d Y h:i A', $rec->changed); ?>
      <?php else: ?>
        <?php $attempted_on = '<ul class="tr_actions"><li class="pending_icon">Pending</li></ul>'; ?>
      <?php endif; ?>
      <tr>
        <td>Appointment Preference</td>
        <td>
          <b>Preferred Appointment Dates - </b>
          <?php foreach ($rec->field_appointment_date['und'] as $date_data): ?>
            <?php print date('M d Y', strtotime($date_data['value'])) . ', '; ?>
          <?php endforeach; ?>
          <br/>
          <b>Preferred Counselor - </b>
          <?php foreach ($rec->field_prefererred_therapist['und'] as $data): ?>
            <?php $therapist_info = user_load($data['uid']); ?>
            <?php $counselor_fn = $therapist_info->field_first_name['und'][0]['value']; ?>
            <?php $counselor_ln = $therapist_info->field_last_name['und'][0]['value']; ?>
            <?php print $counselor_fn . ' ' . $counselor_ln . ', '; ?>
          <?php endforeach; ?>
        </td>
        <td><?php print date('M d Y h:i A', $rec->created); ?></td>
        <td><?php print $attempted_on; ?></td>
      </tr>
      <?php break; ?>
    <?php default: ?>
      <?php break; ?>
    <?php endswitch; ?>
  <?php endforeach; ?>

  <?php $tran_count = count($trans_data); ?>
  <?php foreach ($trans_data as $transdata): ?>
    <?php if ($transdata->action_date > 0): ?>
      <?php $actions = date('M d, Y h:i A', $transdata->action_date); ?>
    <?php else: ?>
      <?php $actions = '<ul class="tr_actions"><li class="pending_icon">Pending</li></ul>'; ?>
    <?php endif; ?>
    <tr>
      <td>Failed Transaction</td>
      <td>
        <b>Transaction Id - </b><?php print $transdata->transaction_id; ?>
        <br/>
        <b>Transaction Date
          - </b><?php print date('M d, Y', $transdata->order_date); ?>
      </td>
      <td><?php print date('M d, Y h:i A', $transdata->requested_on); ?></td>
      <td><?php print $actions; ?></td>
    </tr>
  <?php endforeach; ?>
  <?php if ($count <= 0 && $tran_count <= 0): ?>
    <tr>
      <td colspan="4"> No Record found.</td>
    </tr>
  <?php endif; ?>
  </tbody>
</table>
