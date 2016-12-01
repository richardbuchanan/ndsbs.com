<?php
/**
 * @file
 * user_profile_form.tpl.php
 */
?>
<?php $script = drupal_get_path('theme', 'bootstrap_ndsbs') . '/js/user-register.js'; ?>
<?php drupal_add_js($script); ?>
<?php
hide($form['mimemail']);
hide($form['contact']);
hide($form['htmlmail_plaintext']);
hide($form['field_terms_of_use_register']);
?>

<div class="row">
  <div class="col-sm-12 col-md-4">
    <?php print drupal_render($form['field_first_name']); ?>
  </div>

  <div class="col-sm-12 col-md-4">
    <?php print drupal_render($form['field_middle_name']); ?>
  </div>

  <div class="col-sm-12 col-md-4">
    <?php print drupal_render($form['field_last_name']); ?>
  </div>
</div>

<?php print drupal_render_children($form); ?>
<?php print drupal_render($form['actions']['submit']); ?>
