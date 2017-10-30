<?php

/**
 * @file
 * Set up variables to be placed within the template (.tpl.php) files.
 *
 * The variables set up here apply to custom templates in
 * ndsbs/templates/custom.
 */

/**
 * Implements hook_preprocess_HOOK() for assessment_questionnaire_form.tpl.php.
 */
function ndsbs_preprocess_assessment_questionnaire_form(&$variables) {
  global $user;
  $nid = arg(2);
  $tid = arg(4);
  $page = isset($_GET['page']) ? $_GET['page'] + 1 : '1';
  $variables['submit_message'] = FALSE;

  $total_ass_questions = get_total_questions_numbers($nid, $tid);
  $total_attempted_questions = get_total_attempted_questions_numbers($nid, $tid);
  $last_question = $total_attempted_questions == $total_ass_questions ? 1 : 0;
  $skipped_questions = get_skipped_question_before_evaluation($nid, $tid);

  // $last_question_answered = $last_question && !empty($form['data_answer']['#value']);
  $ready_for_evaluation = $variables['form']['validate_evaluation_status']['#value'] == 'ready' ? 1 : 0;

  if ($last_question) {
    $submit_message = '<div class="uk-alert-success" uk-alert>';
    $submit_message .= t('<p>You have answered all questions. Thank you! Please click the Submit All Answers for Evaluator Review button, then provide us with your preferred time to complete your interview. Someone from our support team will contact you to schedule.</p>');
    $submit_message .= '</div>';

    $variables['submit_message'] = array(
      '#markup' => $submit_message,
    );
  }

  if (!$ready_for_evaluation && $page == $total_ass_questions) {
    $submit_message = '<div class="uk-alert-warning" uk-alert>';
    $submit_message .= t('<p><strong>There are questions you need to answer before submitting your questionnaire. Please review the list of questions below.</strong></p>');
    $submit_message .= $skipped_questions;
    $submit_message .= '</div>';

    $variables['submit_message'] = array(
      '#markup' => $submit_message,
    );
  }

  $questions_remaining_attributes = array(
    'id' => 'questions-remaining',
  );

  if ($total_attempted_questions == $total_ass_questions) {
    $questions_remaining_attributes['class'][] = 'completed';
  }

  $questions_remaining = '<div' . drupal_attributes($questions_remaining_attributes) . '>';
  $questions_remaining .= t('<span class="uk-badge uk-float-right uk-margin-bottom uk-margin-left">@attempted out of @questions answers saved</span>', array(
    '@attempted' => $total_attempted_questions,
    '@questions' => $total_ass_questions,
  ));
  $questions_remaining .= '</div>';

  $variables['questions_remaining'] = array(
    '#markup' => $questions_remaining,
  );

  $variables['pager'] = array(
    '#theme' => 'pager',
  );

  $review_attributes = array(
    'id' => 'submit-all-questionnaire-answers',
    'class' => array(
      'uk-button',
      'uk-button-primary',
    ),
    'title' => t('Submit all answers and finish questionnaire'),
  );

  $variables['print_submit'] = FALSE;

  if ($user->roles[6] == 'client') {
    $variables['print_submit'] = TRUE;
  }

  if ($page == $total_ass_questions && $last_question) {
    $variables['print_submit'] = FALSE;
  }

  if (!$last_question) {
    $review_attributes['class'][] = 'uk-hidden';
  }

  $review_options = array(
    'attributes' => $review_attributes,
  );

  $review_path = 'user/evaluation/questionnaire/' . $nid . '/trans/' . $tid;
  $variables['submit_for_review'] = l(t('Submit All Answers for Evaluator Review'), $review_path, $review_options);
}

/**
 * Implements hook_preprocess_HOOK() for list_all_client.tpl.php.
 */
function ndsbs_preprocess_list_all_client(&$variables) {
  $clients = get_all_clients();

  if (isset($_REQUEST['search_text'])) {
    $search_text = $_REQUEST['search_text'];

    if ($search_text <> '') {
      $clients = get_all_clients_custom_search();
    }
  }

  $variables['count_record'] = count($clients);

  foreach ($clients as $index => $client) {
    $user_info = user_load($client->uid);
    $email_path = 'mailto:' . $user_info->mail;
    $email = l($user_info->mail, $email_path);
    $phone_path = 'tel:' . ndsbs_get_formatted_phone($client->uid);
    $phone = l(ndsbs_get_formatted_phone($client->uid), $phone_path);
    $name = ndsbs_get_formatted_name($client->uid);
    $created = $user_info->created;
    $registered = date('F j, Y', $created);

    $dob_array = array(
      $user_info->field_month['und'][0]['value'],
      $user_info->field_dobdate['und'][0]['value'],
      $user_info->field_year['und'][0]['value'],
    );

    $dob = implode('-', $dob_array);
    $referred_by = 'N/A';

    if (isset($user_info->field_who_referred_you['und'])) {
      $referred_by = $user_info->field_who_referred_you['und'][0]['value'];
    }

    $preferred_contact = 'N/A';

    if (!empty($user_info->field_preferred_contact)) {
      $preferred_contact = $user_info->field_preferred_contact['und'][0]['value'];
    }

    $options = array(
      'query' => array(
        'destination' => 'user/clients/list',
      ),
    );

    $edit_path = 'user/' . $client->uid . '/edit';
    $edit_link = l(t('Edit'), $edit_path, $options);

    $time = time();
    $password_path = 'reset/users/password/' . $client->uid . '/' . $time;
    $password_link = l(t('Reset password'), $password_path, $options);

    $options = array(
      'query' => array(
        'assessment_status' => 'All Status',
        'search_by' => '',
        'search_text' => $client->mail,
      ),
    );

    $service_tabs_path = '/all/assessment/users';
    $service_tabs_link = l(t('Service tabs'), $service_tabs_path, $options);

    $notes = FALSE;
    $query = new EntityFieldQuery();
    $node_entities = $query
      ->entityCondition('entity_type', 'node')
      ->entityCondition('bundle', 'notes')
      ->fieldCondition('field_client_name', 'target_id', $client->uid)
      ->execute();

    if ($node_entities) {
      $client_notes = array_keys($node_entities['node']);
      $notes_node = node_load($client_notes[0]);
      $notes = $notes_node->body['und'][0]['value'];
      $client_notes_path = '/node/' . $client_notes[0] . '/edit';

      $options = array(
        'query' => array(
          'destination' => 'user/clients/list',
        ),
      );

      $notes_link = l(t('Edit note'), $client_notes_path, $options);
    }
    else {
      $options = array(
        'query' => array(
          'field_client_name' => $client->uid,
          'destination' => 'user/clients/list',
        ),
      );

      $client_notes_path = '/node/add/notes';
      $notes_link = '<div>No notes found. ' . l(t('Add notes'), $client_notes_path, $options) . '?</div>';
    }

    $more_than_three_hours = get_user_created_compared($client->created, time(), 10800);
    $contacted = get_user_contacted_status($client->uid);

    if (get_user_transaction_status($client->uid)) {
      $transaction_date = get_user_transaction_date($client->uid);
      $transaction_status = t('<div>Transaction completed</div>');
      $transaction_status .= t('<strong>Date</strong>: @date', array('@date' => $transaction_date));
    }
    elseif ($more_than_three_hours && !$contacted) {
      $transaction_status = t('3+ hrs., <a href="/call-user/@uid">call user</a>?', array('@uid' => $client->uid));
    }
    else {
      $transaction_status = t('User has been contacted about purchasing a service.');
    }


    $clients[$index] = array(
      'uid' => $client->uid,
      'name' => $name,
      'email' => $email,
      'registered' => $registered,
      'dob' => $dob,
      'address' => array(
        'street' => $user_info->field_address['und'][0]['value'],
        'city' => $user_info->field_city['und'][0]['value'],
        'state' => $user_info->field_state['und'][0]['value'],
        'zip' => $user_info->field_zip['und'][0]['value'],
      ),
      'phone' => $phone,
      'preferred_contact_method' => $preferred_contact,
      'referred_by' => $referred_by,
      'edit_link' => $edit_link,
      'password_link' => $password_link,
      'service_tabs_link' => $service_tabs_link,
      'notes_link' => $notes_link,
      'notes' => $notes,
      'transaction_status' => $transaction_status,
    );
  }

  $variables['clients'] = $clients;
}

/**
 * Implements hook_preprocess_HOOK() for questionnaire_start.tpl.php
 */
function ndsbs_preprocess_questionnaier_start(&$variables) {
  $_SESSION['COMPLETE_MY_QUESTIONNAIRE'] = current_path();

  if (!isset($_SESSION['QUESTIONNAIRE_START_PAGE']) || $_SESSION['QUESTIONNAIRE_START_PAGE'] != current_path()) {
    $_SESSION['QUESTIONNAIRE_START_PAGE'] = current_path();
    menu_cache_clear_all();
  }

  $assessment_id = arg(2);
  $transid = arg(4);
  $total_questions = get_total_questions_numbers($assessment_id, $transid);
  $questionnaire_info = get_total_attempted_times($assessment_id, $transid);
  $total_attempts = $questionnaire_info['total_attempts'] ? $questionnaire_info['total_attempts'] : '0';

  $items = array(
    '<strong>Total Questions</strong> - ' . $total_questions,
    '<strong>Estimated Time to Complete</strong> - 15 minutes / your saved answers remain in your account if you need to stop and resume at another time.',
    '<strong>Attempted</strong> - ' . $total_attempts . ' times',
    '<strong>Instructions</strong> - Use text boxes where provided and write as much detail as you would like. You may explain any of your answers in detail during your interview.',
  );

  $variables['questionnaire_instructions'] = theme('item_list', array(
    'items' => $items,
  ));

  $variables['assessment_select_form'] = drupal_get_form('ndsbs_assessment_client_assessments_select_form');
  $variables['questionnaire_form'] = get_assessment_confirmation_form();
  questionnaire_move($assessment_id, $transid);
}

/**
 * Implements hook_preprocess_HOOK() for schedule_interview.tpl.php.
 */
function ndsbs_preprocess_schedule_interview(&$variables) {
  global $user;

  $assessment_data = explode('/', $_SESSION['COMPLETE_MY_QUESTIONNAIRE']);
  $trans_id = $assessment_data[4];

  $query = new EntityFieldQuery();
  $entities = $query->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'counseling_request')
    ->propertyCondition('uid', $user->uid)
    ->execute();
  $nodes = node_load_multiple(array_keys($entities['node']));

  $interview_requested = FALSE;
  $date_requested = t('No interview requests were found');
  $date_attended = t('Not attended');

  foreach ($nodes as $node) {
    if ($node->field_assess_trans_id['und'][0]['value'] == $trans_id) {
      $interview_requested = TRUE;
      $date_requested = date('l, F j, Y', $node->created);

      if ($node->field_attempted_on['und'][0]['value']) {
        $date_attended = date('l, F j, Y', $node->field_attempted_on['und'][0]['value']);
      }
    }
  }

  $variables['interview_requested'] = $interview_requested;
  $variables['date_requested'] = $date_requested;
  $variables['date_attended'] = $date_attended;
}
