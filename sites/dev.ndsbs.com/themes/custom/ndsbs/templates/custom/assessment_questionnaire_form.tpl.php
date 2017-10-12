<?php if ($submit_message): ?>
  <?php print drupal_render($submit_message); ?>
<?php endif; ?>

<?php print drupal_render($questions_remaining); ?>
<?php print drupal_render($form['question_title']); ?>
<?php print drupal_render($form['data_answer']); ?>
<?php print drupal_render($form['data_answer_other']); ?>
<?php print drupal_render($form['data_answer_month']); ?>
<?php print drupal_render($form['data_answer_year']); ?>

<div id="questionnaire-actions" class="uk-margin">
  <?php if ($print_submit): ?>
    <?php print drupal_render($form['submit']); ?>
  <?php endif; ?>

  <?php print $submit_for_review; ?>
</div>

<div class="uk-hidden">
  <?php print drupal_render($form['data_question_id']); ?>
  <?php print drupal_render($form['question_sequesce']); ?>
  <?php print drupal_render($form['textarea_ans_id']); ?>
  <?php print drupal_render($form['month_year_ans_id']); ?>
  <?php print drupal_render($form['view_questionnaire']); ?>
  <?php print drupal_render($form['month_year_ans_id']); ?>
  <?php print drupal_render_children($form); ?>
</div>

<?php print drupal_render($pager); ?>
