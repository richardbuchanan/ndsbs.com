<?php

/**
 * @file
 * Set up variables to be placed within the template (.tpl.php) files.
 *
 * The variables set up here apply to custom templates in
 * ndsbs/templates/custom.
 */

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

/**
 * Implements hook_preprocess_HOOK() for list_all_client.tpl.php.
 */
function ndsbs_preprocess_list_all_client(&$variables) {
  global $base_url, $user;
  $i = 0;

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
    $contacted = get_user_contacted_status($client->created);

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
