<?php
/**
 * @file
 * appointment_preference_node_form.tpl.php
 */
global $base_path;
?>
<!-- Begin appointment_preference_node_form.tpl.php -->
<h1>Appointment Preference</h1>
<div class="wd_1 appointment_page appointment_page_fixed">
  <div class="form-item_custum">
    <?php print str_replace(',', '', drupal_render($form['group_appointment_group'])); ?>
  </div>
    
  <div class="form-item_custum">
    <?php print drupal_render($form['actions']['submit']); ?>
  </div>

  <div style='display:none;'>
    <?php print drupal_render_children($form); ?>
  </div>
</div>
<!-- End appointment_preference_node_form.tpl.php -->
