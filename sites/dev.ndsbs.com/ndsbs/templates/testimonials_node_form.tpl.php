<?php
/**
 * @file
 * appointment_preference_node_form.tpl.php
 */
global $base_path;
global $user;
$logged_user_id = $user->uid;
drupal_set_title('Send Us Your Testimonial');
?>
<h1>Send Us Your Testimonial</h1>
<div class="testimonial-node">
  <div class="form-item form-item-testimonial-description">
    <?php print drupal_render($form['field_testimonial_description']); ?>
  </div>
  <?php if (user_access('edit testimonial user name')): ?>
    <div class="form-item form-item-testimonial-by">
      <?php print drupal_render($form['field_testimonial_user_name']); ?>
      <div class="description">We value your privacy. Please use only your first and last initial or you may use alias initials.</div>
    </div>
  <?php endif; ?>
  <?php if (user_access('manage testimonial statuses')): ?>
    <div class="form-item form-item-testimonial-public-status">
      <?php print drupal_render($form['field_public_status']); ?>
    </div>
  <?php endif; ?>

  <?php print drupal_render_children($form); ?>

  <div class="form-item form-type-submit form-item-testimonial-submit">
    <?php print drupal_render($form['actions']); ?>
  </div>
</div>
