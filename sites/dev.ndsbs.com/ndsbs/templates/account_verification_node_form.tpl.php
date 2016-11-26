<?php
/**
 * @file
 * account_verification_node_form.tpl.php
 */
global $user, $base_path;
$path_theme = drupal_get_path('theme', 'ndsbs') . '/templates';
if($user->roles[6] == 'client') {
  include_once $path_theme . '/headerimpdoc.tpl.php';
}
?>
<!-- Begin account_verification_node_form.tpl.php -->
<div class="wd_1 appointment_page">
  <div class="form-item_custum fw_fixed">
    <?php print drupal_render($form['field_pa_title']); ?>
  </div>
  <div class="form-item_custum crequest_fixed">
    <?php print drupal_render($form['field_pa_description']); ?>
  </div>
  <div class="form-item_custum fw_fixed">
    <?php print drupal_render($form['field_pa_upload']); ?>
  </div>
  <div class="form-item_custum fw_fixed">
    <?php print drupal_render($form['actions']['submit']); ?>
  </div>
  <div style='display:none;'>
    <?php print drupal_render_children($form); ?>
  </div>
</div>
<!-- End account_verification_node_form.tpl.php -->
