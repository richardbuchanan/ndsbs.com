<?php include 'stepsheader.tpl.php'; ?>

<?php if ($interview_requested): ?>
  <table class="uk-table uk-table-striped uk-table-divider">
    <thead>
      <tr>
        <th>Date requested</th>
        <th>Date attended</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><?php print $date_requested; ?></td>
        <td><?php print $date_attended; ?></td>
      </tr>
    </tbody>
  </table>
<?php else: ?>
  <?php module_load_include('inc', 'node', 'node.pages'); ?>
  <?php $form = node_add('counseling_request'); ?>
  <?php print drupal_render($form); ?>
<?php endif; ?>
