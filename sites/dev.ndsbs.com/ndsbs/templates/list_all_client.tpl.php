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
?>

<h1>All Clients</h1>
<div  class="field_fixed full_width left"><?php print client_search(); ?></div>
<div class="table_wrap">
  <table class="schedule_table list-all-clients">
    <tr class="bkg_b">
      <th>Name</th>
      <th>Profile Details</th>
      <th>Contact Details</th>
      <?php if (user_access('administer users')): ?><th>Action</th><?php endif; ?>
      <th>Notes</th>
    </tr>
    <?php
      $count_record = count($clients_id);
      foreach ($clients_id as $rec) {
        $user_info = user_load($rec->uid);
    ?>
    <tr>
      <?php $name = t($user_info->field_first_name['und'][0]['value']); ?>
      <?php if (isset($user_info->field_middle_name['und'][0]['value'])): ?>
      <?php $name .= ' ' . t($user_info->field_middle_name['und'][0]['value']); ?>
      <?php endif; ?>
      <?php $name .= ' ' . t($user_info->field_last_name['und'][0]['value']); ?>
      <?php $created = $user_info->created; ?>
      <td class="user-name user-registeration-date">
        <?php if (user_access('administer users')): ?>
          <?php print l($name, 'user/'.$user_info->uid.'/edit'); ?>
        <?php else: ?>
          <?php print $name; ?>
        <?php endif; ?>
        <br />
        <b>Registered: </b><?php print date('D, F j, Y', $created); ?> at <?php print date('g:i A', $created); ?><br />
      </td>
      <td class="user-gender user-dob user-status">
        <b>Gender: </b> <?php print $user_info->field_gender['und'][0]['value']; ?> <br />
        <b>Date of Birth: </b> <?php print $user_info->field_month['und'][0]['value']; ?>-<?php print $user_info->field_dobdate['und'][0]['value']; ?>-<?php print $user_info->field_year['und'][0]['value']; ?> <br />
        <b>Status: </b>
        <?php if($user_info->status == 1) print 'Active'; else print 'Blocked'; ?>
      </td>
      <td class="user-addresses">
        <b>Email: </b> <?php print $user_info->mail; ?> <br />
        <b>Address: </b> <?php print $user_info->field_address['und'][0]['value']; ?>, <?php print $user_info->field_city['und'][0]['value']; ?>, <?php print $user_info->field_state['und'][0]['value']; ?>, <?php print $user_info->field_zip['und'][0]['value']; ?> <br />
        <b>Phone: </b> <?php print $user_info->field_phone['und'][0]['value']; ?>
      </td>
      <?php if (user_access('administer users')): ?>
      <td class="user-admin-actions">
        <?php
        $options = array(
          'query' => array(
            'destination' => 'user/clients/list'
          ),
          'attributes' => array(
            'class' => 'edit_icon'
          )
        );
        print l(t('Edit'), 'user/'.$user_info->uid.'/edit', $options);
        $time = time();
        $options = array(
          'attributes' => array(
            'class' => 'edit_icon'
          )
        );
        print l(t('Reset Password'), 'reset/users/password/'.$user_info->uid.'/'.$time, $options);
        ?>
      </td>
      <?php endif; ?>
      <td class="client-notes">
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
    </tr>
    <?php $i++; }
     //}
    if($count_record <= 0) {
    ?>
    <tr>
      <td class="txt_ac" colspan="5">Record not found</td>
    </tr>
    <?php } ?>
    <?php if ($i == 0): ?>
    <tr>
      <td class="txt_ac" colspan="5">You currently have no clients assigned to you. If you believe this is a mistake, please contact your staff administrator.</td>
    </tr>
    <?php endif; ?>
  </table>
</div>
<?php if ($i > 0): ?>
<?php
$total = 3;
print $output = theme('pager', array('quantity' => $total));
endif; ?>
