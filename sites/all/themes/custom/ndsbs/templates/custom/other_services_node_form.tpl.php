<?php
/**
 * @file
 * other_services_node_form.tpl.php
 */
global $base_path, $base_url;
drupal_add_js(drupal_get_path('theme', 'bootstrap_ndsbs') . '/js/other-services.js');
//echo '<pre>';
//print_r($form);
//echo '</pre>';
?>
<h1>Other Services Pricing</h1>
<div class="wd_1 aeassessment_page">

  <div class="form-item_custum">
    <?php print drupal_render($form['field_progress_notes']); ?>
    <label id="field_progress_notes_amount" class="label_item"><?php print '$' . $form['#node']->field_progress_notes_amount['und'][0]['value']; ?></label>
  </div>

  <div class="form-item_custum" style='display:none;'>
    <?php print drupal_render($form['field_progress_notes_amount']); ?>
  </div>

  <div class="form-item_custum fw_fixed">
    <?php print drupal_render($form['field_proof_of_attendence']); ?>
    <label id="field_proof_of_attendence_amount" class="label_item">
      <?php print '$' . $form['#node']->field_proof_of_attendence_amount['und'][0]['value']; ?>
    </label>
  </div>

  <div class="form-item_custum" style='display:none;'>
    <?php print drupal_render($form['field_proof_of_attendence_amount']); ?>
  </div>

  <div class="form-item_custum">
    <?php print drupal_render($form['field_discharge_summaries']); ?>
    <label id="field_discharge_summaries_amount" class="label_item">
      <?php print '$' . $form['#node']->field_discharge_summaries_amount['und'][0]['value']; ?>
    </label>
  </div>

  <div class="form-item_custum" style='display:none;'>
    <?php print drupal_render($form['field_discharge_summaries_amount']); ?>
  </div>

  <div class="form-item_custum">
    <?php print drupal_render($form['field_notary_fee']); ?>
    <label id="field_notary_fee_amount" class="label_item">
      <?php print '$' . $form['#node']->field_notary_fee_amount['und'][0]['value']; ?>
    </label>
  </div>

  <div class="form-item_custum" style='display:none;'>
    <?php print drupal_render($form['field_notary_fee_amount']); ?>
  </div>

  <div class="form-item_custum">
    <?php print drupal_render($form['field_broken_appointment']); ?>
    <label id="field_broken_appointment_amount" class="label_item">
      <?php print '$' . $form['#node']->field_broken_appointment_amount['und'][0]['value']; ?>
    </label>
  </div>

  <div class="form-item_custum" style='display:none;'>
    <?php print drupal_render($form['field_broken_appointment_amount']); ?>
  </div>

  <div class="form-item_custum">
    <?php print drupal_render($form['field_state_form_1_3_page_']); ?>
    <label id="field_state_form_1_3_page_amount" class="label_item">
      <?php print '$' . $form['#node']->field_state_form_1_3_page_amount['und'][0]['value']; ?>
    </label>
  </div>

  <div class="form-item_custum" style='display:none;'>
    <?php print drupal_render($form['field_state_form_1_3_page_amount']); ?>
  </div>

  <div class="form-item_custum">
    <?php print drupal_render($form['field_state_form_4_6_page_']); ?>
    <label id="field_state_form_4_6_page_amount" class="label_item">
      <?php print '$' . $form['#node']->field_state_form_4_6_page_amount['und'][0]['value']; ?>
    </label>
  </div>

  <div class="form-item_custum" style='display:none;'>
    <?php print drupal_render($form['field_state_form_4_6_page_amount']); ?>
  </div>

  <div class="form-item_custum">
    <?php print drupal_render($form['field_state_form_7_9_page_']); ?>
    <label id="field_state_form_7_9_page_amount" class="label_item">
      <?php print '$' . $form['#node']->field_state_form_7_9_page_amount['und'][0]['value']; ?>
    </label>
  </div>

  <div class="form-item_custum" style='display:none;'>
    <?php print drupal_render($form['field_state_form_7_9_page_amount']); ?>
  </div>

  <div class="form-item_custum">
    <?php print drupal_render($form['field_state_form_10_12_page_']); ?>
    <label id="field_state_form_10_12_page_amou" class="label_item">
      <?php print '$' . $form['#node']->field_state_form_10_12_page_amou['und'][0]['value']; ?>
    </label>
  </div>

  <div class="form-item_custum" style='display:none;'>
    <?php print drupal_render($form['field_state_form_10_12_page_amou']); ?>
  </div>

  <div class="form-item_custum">
    <?php print drupal_render($form['actions']['submit']); ?>
  </div>

  <div style='display:none;'>
    <?php
    //  Use to render the drupal 7 form
    print drupal_render_children($form);
    ?>
  </div>
</div>
