<style>
  .form-item_custum .form-item {
    margin-bottom: 5px;
  }

  .form-item_custum label {
    width: auto;
    font-weight: bold;
  }

  .form-item_custum .form-text, .form-textarea-wrapper textarea {
    width: auto;
  }
</style>
<?php
/**
 * @file
 * assessment_questionnaire_form.tpl.php
 */
global $base_path, $base_url, $user;
?>
<div class="wd_1">
  <div class="form-item_custum" style="width:100%;">
    <?php print drupal_render($form['question_title']); ?>

    <?php print drupal_render($form['data_answer']); ?>

    <?php print drupal_render($form['data_answer_other']); ?>
    <?php print drupal_render($form['data_answer_month']); ?>
    <?php print drupal_render($form['data_answer_year']); ?>
  </div>

  <div style='display:none;'>
    <?php print drupal_render($form['data_question_id']); ?>
    <?php print drupal_render($form['question_sequesce']); ?>
    <?php print drupal_render($form['textarea_ans_id']); ?>
    <?php print drupal_render($form['view_questionnaire']); ?>
    <?php print drupal_render($form['month_year_ans_id']); ?>
    <?php
    // Use to render the drupal 7 form.
    print drupal_render_children($form);
    ?>
  </div>
  <div class="form-item_custum left" style="margin-top:6px;">
    <?php $build['pager'] = array(
      '#theme' => 'pager'
    ); ?>
    <?php print drupal_render($build); ?>
  </div>
</div>
