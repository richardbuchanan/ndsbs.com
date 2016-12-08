<?php
/**
 * @file
 * user_profile_form.tpl.php
 */
?>
<?php $script = drupal_get_path('theme', 'bootstrap_ndsbs') . '/js/user-register.js'; ?>
<?php drupal_add_js($script); ?>
<?php
hide($form['contact']);
hide($form['mimemail']);
hide($form['account']['mail']['htmlmail_plaintext']);
hide($form['ckeditor']);
hide($form['field_profile_picture']);
hide($form['redirect']);
hide($form['metatags']);
hide($form['field_terms_of_use']);
hide($form['field_terms_of_use_register']);
?>

<div class="row">
  <div class="col-xs-12 col-md-4">
    <?php print drupal_render($form['field_first_name']); ?>
  </div>

  <div class="col-xs-12 col-md-4">
    <?php print drupal_render($form['field_middle_name']); ?>
  </div>

  <div class="col-xs-12 col-md-4">
    <?php print drupal_render($form['field_last_name']); ?>
  </div>
</div>

<div class="row">
  <div class="col-xs-12 col-md-3">
    <?php print drupal_render($form['field_gender']); ?>
  </div>
  <div class="col-xs-12 col-md-9">
    <div class="visible-xs-inline-block visible-sm-inline-block visible-md-inline-block visible-lg-inline-block">
      <?php print drupal_render($form['field_month']); ?>
    </div>
    <div class="visible-xs-inline-block visible-sm-inline-block visible-md-inline-block visible-lg-inline-block">
      <?php print drupal_render($form['field_year']); ?>
    </div>
    <div class="visible-xs-inline-block visible-sm-inline-block visible-md-inline-block visible-lg-inline-block">
      <?php print drupal_render($form['field_dobdate']); ?>
    </div>
  </div>
</div>

<div class="row">
  <div class="col-xs-12">
    <?php print drupal_render($form['field_address']); ?>
  </div>
  <div class="col-xs-12">
    <?php print drupal_render($form['field_city']); ?>
  </div>
  <div class="col-xs-12">
    <?php print drupal_render($form['field_state']); ?>
  </div>
  <div class="col-xs-12">
    <?php print drupal_render($form['field_zip']); ?>
  </div>
  <div class="col-xs-12 col-md-3">
    <?php print drupal_render($form['field_phone']); ?>
  </div>
  <div class="col-xs-12 col-md-3">
    <?php print drupal_render($form['field_second_phone']); ?>
  </div>
</div>

<?php print drupal_render_children($form); ?>
<?php print drupal_render($form['actions']['submit']); ?>
