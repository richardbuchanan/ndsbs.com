<?php
/**
 * @file
 * user_profile_form.tpl.php
 */
global $base_path, $user;

//  Load the user to show counsellor information
$edit_user_id = arg(1);
$edit_user_load = user_load($edit_user_id);
?>
<?php print drupal_render($form['field_first_name']); ?>
<?php print drupal_render($form['field_middle_name']); ?>
<?php print drupal_render($form['field_last_name']); ?>
<?php print drupal_render($form['account']['mail']); ?>
<?php print drupal_render($form['field_gender']); ?>
<style>
  .page-user-edit #accordion,
  .page-user-edit .field-name-field-referred-by,
  .page-user-edit .field-name-field-assessment-assigned,
  .page-user-edit .field-name-field-terms-of-use-register,
  .page-user-edit .field-name-field-terms-of-use,
  .page-user-edit .field-name-field-reason-for-assessment,
  .page-user-edit .form-item-htmlmail-plaintext,
  .page-user-edit .field-name-field-profile-picture {
    display: none;
  }
</style>
<div id="register-dob">
  <label class="block">Date Of Birth</label>
  <div class="form-items-inline">
    <?php print drupal_render($form['field_month']); ?>
    <?php print drupal_render($form['field_dobdate']); ?>
    <?php print drupal_render($form['field_year']); ?>
  </div>
</div>

<?php print drupal_render($form['field_phone']); ?>
<?php print drupal_render($form['field_second_phone']); ?>
<?php print drupal_render($form['field_address']); ?>
<?php print drupal_render($form['field_city']); ?>
<?php print drupal_render($form['field_state']); ?>
<?php print drupal_render($form['field_zip']); ?>

<?php if (isset($user->roles[4]) || isset($edit_user_load->roles[4])): ?>
  <?php print drupal_render($form['field_profile_picture']); ?>
  <?php print drupal_render($form['field_therapist_large_image']); ?>
  <?php print drupal_render($form['field_therapist_degree']); ?>
  <?php print drupal_render($form['field_biography_sub']); ?>
  <?php print drupal_render($form['field_biography_desc']); ?>
  <?php print drupal_render($form['field_education_sub']); ?>
  <?php print drupal_render($form['field_education_desc']); ?>
  <?php print drupal_render($form['field_assessments_sub']); ?>
  <?php print drupal_render($form['field_assessments_desc']); ?>
  <?php print drupal_render($form['field_get_in_touch_sub']); ?>
  <?php print drupal_render($form['field_get_in_touch_desc']); ?>
  <?php print drupal_render($form['field_upload_report_signature']); ?>
  <?php print drupal_render($form['field_assessment_assigned']); ?>
<?php endif; ?>

<?php print drupal_render($form['account']['roles']); ?>
<?php print drupal_render($form['account']['status']); ?>

<?php if (isset($user->roles[3])): ?>
  <?php print drupal_render_children($form); ?>
<?php endif; ?>

<?php print drupal_render($form['actions']['submit']); ?>

<?php if (!isset($user->roles[3])): ?>
  <div style='display:none;'>
    <?php print drupal_render_children($form); ?>
  </div>
<?php endif; ?>
