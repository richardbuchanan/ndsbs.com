<?php
global $base_path, $base_url, $user; ?>

<?php $total_ass_questions = get_total_questions_numbers($assessment_id = arg(2), $transid = arg(4)); ?>
<?php $total_attempted_questions = get_total_attempted_questions_numbers($assessment_id = arg(2), $transid = arg(4)); ?>
<?php $page = isset($_GET['page']) ? $_GET['page'] + 1 : '1'; ?>
<?php $last_question = $total_attempted_questions == $total_ass_questions ? 1 : 0; ?>
<?php $last_question_answered = $last_question && !empty($form['data_answer']['#value']); ?>
<?php $ready_for_evaluation = $form['validate_evaluation_status']['#value'] == 'ready' ? 1 : 0; ?>

<?php if ($last_question): ?>
  <div class="uk-alert-success" uk-alert>
    <p>You have answered all questions. Thank you! Please click the Submit All Answers for Evaluator Review button, then provide us with your preferred time to complete your interview. Someone from our support team will contact you to schedule.</p>
  </div>
<?php else: ?>
<?php endif; ?>

<?php if (!$ready_for_evaluation && $page != $total_ass_questions && $last_question_answered): ?>
<?php elseif (!$ready_for_evaluation && $page == $total_ass_questions): ?>
  <?php $assessment_node_id = arg(2); ?>
  <?php $transid = arg(4); ?>
  <?php $qlist = get_skipped_question_before_evaluation($assessment_node_id, $transid); ?>
  <div class="uk-alert-warning" uk-alert>
    <p>There are questions you need to answer before submitting your questionnaire. Please review the list of questions below.</p>
  </div>
  <?php print $qlist; ?>
<?php endif; ?>

<div id="questions-remaining"><?php print $total_attempted_questions; ?> out of <?php print $total_ass_questions; ?> answers saved</div>
<?php print drupal_render($form['question_title']); ?>
<?php print drupal_render($form['data_answer']); ?>
<?php print drupal_render($form['data_answer_other']); ?>
<?php print drupal_render($form['data_answer_month']); ?>
<?php print drupal_render($form['data_answer_year']); ?>

<?php $build['pager'] = array('#theme' => 'pager'); ?>
<?php print drupal_render($build); ?>

<?php $sub_eva_classes = array('uk-button', 'uk-button-primary'); ?>

<?php if ($last_question): ?>
  <?php $form['submit']['#attributes']['class'][] = 'uk-hidden'; ?>
<?php else: ?>
  <?php $sub_eva_classes[] = 'uk-hidden'; ?>
<?php endif; ?>

<?php if($user->roles[6] == 'client'): ?>
  <?php print drupal_render($form['submit']); ?>
<?php endif; ?>

<?php $sub_eva = array(
  'attributes' => array(
    'id' => 'submit-all-questionnaire-answers',
    'class' => $sub_eva_classes,
    'title' => 'Submit all answers and finish questionnaire'
  ));
?>

<?php print l(t('Submit All Answers for Evaluator Review'), 'user/evaluation/questionnaire/'.arg(2).'/trans/'.arg(4), $sub_eva); ?>

<div class="uk-hidden">
  <?php print drupal_render($form['data_question_id']); ?>
  <?php print drupal_render($form['question_sequesce']); ?>
  <?php print drupal_render($form['textarea_ans_id']); ?>
  <?php print drupal_render($form['month_year_ans_id']); ?>
  <?php print drupal_render($form['view_questionnaire']); ?>
  <?php print drupal_render($form['month_year_ans_id']); ?>
  <?php print drupal_render_children($form); ?>
</div>
