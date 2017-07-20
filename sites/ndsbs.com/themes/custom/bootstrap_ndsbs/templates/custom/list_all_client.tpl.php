<?php
/**
 * @file
 * list_all_client.tpl.php
 */
global $base_url, $user;
$i = 0;
$clients_id = get_all_clients();

if (isset($_REQUEST['search_text'])) {
  $search_text = $_REQUEST['search_text'];
  if ($search_text <> '') {
    $clients_id = get_all_clients_custom_search();
  }
}

// Add sticky table header library.
drupal_add_js('misc/tableheader.js');
?>
<?php print client_search(); ?>
<table class="table table-striped table-responsive sticky-enabled">
  <thead>
    <tr>
      <th>Name</th>
      <th>Profile Details</th>
      <th>Contact Details</th>
      <?php if (user_access('administer users')): ?><th>Action</th><?php endif; ?>
      <th>Notes</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <?php $count_record = count($clients_id); ?>
    <?php foreach ($clients_id as $rec): ?>
      <?php $user_info = user_load($rec->uid); ?>
      <tr>
        <?php $name = t($user_info->field_first_name['und'][0]['value']); ?>
        <?php if (isset($user_info->field_middle_name['und'][0]['value'])): ?>
        <?php $name .= ' ' . t($user_info->field_middle_name['und'][0]['value']); ?>
        <?php endif; ?>
        <?php $name .= ' ' . t($user_info->field_last_name['und'][0]['value']); ?>
        <?php $created = $user_info->created; ?>
        <td>
          <span><?php print $name; ?></span><br />
          <span><b>Registered: </b><?php print date('D, F j, Y', $created); ?> at <?php print date('g:i A', $created); ?></span><br />
        </td>
        <td style="width: 16%">
          <?php if (isset($user_info->field_gender['und'])): ?>
            <span><?php print $user_info->field_gender['und'][0]['value']; ?></span><br />
          <?php endif; ?>
          <span><b>DOB:</b> <?php print $user_info->field_month['und'][0]['value']; ?>-<?php print $user_info->field_dobdate['und'][0]['value']; ?>-<?php print $user_info->field_year['und'][0]['value']; ?></span><br />
          <?php $status = 'Blocked'; ?>
          <?php if($user_info->status == 1): ?>
            <?php $status = 'Active'; ?>
          <?php endif; ?>
          <span><b>Status:</b> <?php print $status; ?></span>
          <?php $referred_by = 'N/A'; ?>
          <?php if (isset($user_info->field_who_referred_you['und'])): ?>
            <?php $referred_by = $user_info->field_who_referred_you['und'][0]['value']; ?>
          <?php endif; ?>
          <span><b>Referred by:</b> <?php print $referred_by; ?></span>
        </td>
        <td>
          <span><?php print $user_info->mail; ?></span><br />
          <span><?php print $user_info->field_address['und'][0]['value']; ?>, <?php print $user_info->field_city['und'][0]['value']; ?>, <?php print $user_info->field_state['und'][0]['value']; ?>, <?php print $user_info->field_zip['und'][0]['value']; ?></span><br />
          <span><?php print $user_info->field_phone['und'][0]['value']; ?></span><br />
          <?php $preferred_contact = 'N/A'; ?>
          <?php if (!empty($user_info->field_preferred_contact)): ?>
            <?php $preferred_contact = $user_info->field_preferred_contact['und'][0]['value']; ?>
          <?php endif; ?>
          <span><strong>Preferred contact method:</strong> <?php print $preferred_contact; ?></span>
        </td>
        <?php if (user_access('administer users')): ?>
          <td style="width: 15%">
            <?php $options = array('html' => TRUE);

            $options['query']['destination'] = 'user/clients/list';
            print l('<span class="glyphicon glyphicon-edit glyphicon-padding-right" aria-hidden="true"></span>' . t('Edit'), 'user/'.$user_info->uid.'/edit', $options) . '<br />';

            $time = time();

            unset($options['query']);

            print l('<span class="glyphicon glyphicon-lock glyphicon-padding-right" aria-hidden="true"></span>' . t('Reset password'), 'reset/users/password/'.$user_info->uid.'/'.$time, $options);

            $options['query']['assessment_status'] = "All Status";
            $options['query']['search_by'] = "";
            $options['query']['search_text'] = $user_info->mail;
            $service_url = "/all/assessment/users";
            print '<br />' . l('<span class="glyphicon glyphicon-folder-open glyphicon-padding-right" aria-hidden="true"></span>' . t('Service tabs'), $service_url, $options); ?>
          </td>
        <?php endif; ?>
        <td>
          <?php
            $query = new EntityFieldQuery();
            $node_entities = $query
              ->entityCondition('entity_type', 'node')
              ->entityCondition('bundle', 'notes')
              ->fieldCondition('field_client_name', 'target_id', $user_info->uid)
              ->execute();
            if ($node_entities) {
              $client_notes = array_keys($node_entities['node']);
              $notes_node = node_load($client_notes[0]);
              print $notes_node->body['und'][0]['value'];
              print '<a href="/node/' . $client_notes[0] . '/edit?destination=user/clients/list">Edit</a>';
            }
            else {
              print 'No notes found. <a href="/node/add/notes?field_client_name=' . $user_info->uid . '">Add notes</a>?';
            }
          ?>
        </td>
        <td>
          <?php $more_than_three_hours = get_user_created_compared($user_info->created, time(), 10800); ?>
          <?php $contacted = get_user_contacted_status($user_info->uid); ?>

          <?php if (get_user_transaction_status($user_info->uid)): ?>
            <?php $transaction_date = get_user_transaction_date($user_info->uid); ?>
            <?php print t('Transaction completed'); ?>
            <br>
            <?php print t('<strong>Date</strong>: @date', array('@date' => $transaction_date)); ?>
          <?php elseif ($more_than_three_hours && !$contacted): ?>
            <?php print t('3+ hrs., <a href="/call-user/@uid">call user</a>?', array('@uid' => $user_info->uid)); ?>
          <?php else: ?>
            <?php print t('User has been contacted about purchasing a service.'); ?>
          <?php endif; ?>
        </td>
      </tr>
      <?php $i++; ?>
    <?php endforeach; ?>
    <?php if($count_record <= 0) { ?>
      <tr>
        <td colspan="5">Record not found</td>
      </tr>
    <?php } ?>
    <?php if ($i == 0): ?>
      <tr>
        <td colspan="5">You currently have no clients assigned to you. If you believe this is a mistake, please contact your staff administrator.</td>
      </tr>
    <?php endif; ?>
  </tbody>
</table>

<?php if ($i > 0): ?>
  <?php $total = 9; ?>
  <?php print $output = theme('pager', array('quantity' => $total)); ?>
<?php endif; ?>
