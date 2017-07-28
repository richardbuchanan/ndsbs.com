<?php

/**
 * @file
 * Set up variables to be placed within the template (.tpl.php) files.
 *
 * The variables set up here apply to custom templates in
 * ndsbs/templates/custom.
 */

/**
 * Implements hook_preprocess_HOOK() for stepsheader.tpl.php.
 */
function ndsbs_preprocess_stepsheader(&$variables) {
  dpm($variables);
}

/**
 * Implements hook_preprocess_HOOK() for questionnaire_start.tpl.php
 */
function ndsbs_preprocess_questionnaier_start(&$variables) {
  $_SESSION['COMPLETE_MY_QUESTIONNAIRE'] = current_path();
  $assessment_id = arg(2);
  $transid = arg(4);
  $total_questions = get_total_questions_numbers($assessment_id, $transid);
  $assessment_node = node_load($assessment_id);
  $assessment_title = $assessment_node->title;

  $questionnaire_info = get_total_attempted_times($assessment_id, $transid);
  $total_attempts = $questionnaire_info['total_attempts'] ? $questionnaire_info['total_attempts'] : '0';

  $items = array(
    '<strong>Total Questions</strong> - ' . $total_questions,
    '<strong>Estimated Time to Complete</strong> - 15 minutes / your saved answers remain in your account if you need to stop and resume at another time.',
    '<strong>Attempted</strong> - ' . $total_attempts . ' times',
    '<strong>Instructions</strong> - Use text boxes where provided and write as much detail as you would like. You may explain any of your answers in detail during your interview.',
  );

  $variables['questionnaire_instructions'] = theme('item_list', array(
    'title' => $assessment_title . ' Questionnaire',
    'items' => $items,
  ));

  $variables['form'] = get_assessment_confirmation_form();
}
