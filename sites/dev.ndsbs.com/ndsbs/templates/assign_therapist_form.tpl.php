<?php
/**
 * @file
 * user_transactions.tpl.php
 */
global $base_url;
?>
<!-- Begin assign_therapist_form.tpl.php -->
<h1>Assign Counselor</h1>
<div id="assign_therapist_frm">
  <div class="wd_1">
    <div class="form-item_custum">
      <?php print drupal_render($form['therapist_list']); ?>
    </div>
    <div class="form-item_custum">
      <?php print drupal_render($form['therapist_submit']); ?>
    </div>
    <div style='display:none;'>
      <?php print drupal_render_children($form); ?>
    </div>
  </div>
</div>
<!-- End assign_therapist_form.tpl.php -->
