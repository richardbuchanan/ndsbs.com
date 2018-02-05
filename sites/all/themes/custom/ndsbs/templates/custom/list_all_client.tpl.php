<?php
global $base_url, $user;
$i = 0;

// Add sticky table header library.
drupal_add_js('misc/tableheader.js');
?>
<?php print client_search(); ?>
<?php $columns = 4; ?>

<?php if (user_access('administer users')): ?>
  <?php $columns = 5; ?>
<?php endif; ?>

<table class="uk-table uk-table-striped sticky-enabled">
  <thead>
    <tr>
      <th>Client Details</th>
      <th>Contact Details</th>
      <?php if (user_access('administer users')): ?><th>Actions</th><?php endif; ?>
      <th>Notes</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <?php foreach ($clients as $client): ?>
      <tr>
        <td class="uk-width-medium">
          <div><strong>Name:</strong> <?php print $client['name']; ?></div>
          <div><strong>Registered:</strong> <?php print $client['registered']; ?></div>
          <div><strong>DOB:</strong> <?php print $client['dob']; ?></div>
          <div><strong>Referred by:</strong> <?php print $client['referred_by']; ?></div>
        </td>

        <td class="uk-width-medium">
          <address class="uk-margin-remove-top">
            <div><?php print $client['address']['street']; ?></div>
            <div><?php print $client['address']['city']; ?>, <?php print $client['address']['state']; ?> <?php print $client['address']['zip']; ?></div>
            <div><?php print $client['email']; ?></div>
            <div><?php print $client['phone']; ?></div>
          </address>
          <div><strong>Preferred contact method:</strong> <?php print $client['preferred_contact_method']; ?></div>
        </td>

        <?php if (user_access('administer users')): ?>
          <td class="uk-width-small">
            <div><?php print $client['edit_link']; ?></div>
            <div><?php print $client['password_link']; ?></div>
            <div><?php print $client['service_tabs_link']; ?></div>
          </td>
        <?php endif; ?>

        <td>
          <?php if ($client['notes']): ?>
            <div><?php print $client['notes']; ?></div>
          <?php endif; ?>
          <?php print $client['notes_link']; ?>
        </td>

        <td class="uk-width-medium">
          <?php print $client['transaction_status']; ?>
        </td>
      </tr>
      <?php $i++; ?>
    <?php endforeach; ?>

    <?php if ($count_record <= 0): ?>
      <tr>
        <td colspan="<?php print $columns; ?>">No records matched your search criteria.</td>
      </tr>
    <?php elseif ($i == 0): ?>
      <tr>
        <td colspan="<?php print $columns; ?>">You currently have no clients assigned to you. If you believe this is a mistake, please contact your staff administrator.</td>
      </tr>
    <?php endif; ?>
  </tbody>
</table>

<?php if ($i > 0): ?>
  <?php $total = 9; ?>
  <?php print $output = theme('pager', array('quantity' => $total)); ?>
<?php endif; ?>
