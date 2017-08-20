<?php
/**
 * @file
 * counseling_request_node_form.tpl.php
 */
include_once 'stepsheader.tpl.php';
?>

<?php if (true): ?>
  <?php print drupal_render($form['field_preferred_therapist']); ?>
  <?php print drupal_render($form['field_counselingrequest_comment']); ?>
  <?php print drupal_render($form['actions']['submit']); ?>

  <div class="uk-hidden">
    <?php print drupal_render($form['field_assess_trans_id']); ?>
    <?php print drupal_render_children($form); ?>
  </div>
<?php endif; ?>
