<?php
/**
 * @file
 *
 * Custom Variables
 *
 * This file is used to create variables that will be used in page templates.
 * By moving the definition of variables to this file will reduce the amount
 * of code needed in page templates.
 *
 * NOTE: These variables can only be called in page templates found in
 * /templates/pages.
 */

global $user, $base_url;
$logged_in = FALSE;
$user_name = '';
$user_uid = '';
$account_link = '';
$includes = base_path().path_to_theme().'/templates/includes/';

$is_staff = FALSE;
if (in_array('therapist', $user->roles) || in_array('staff admin', $user->roles)) {
  $is_staff = TRUE;
}

$is_client = FALSE;
if (in_array('client', $user->roles)) {
  $is_client = TRUE;
}

$is_temp_user = FALSE;
if (in_array('authenticated user', $user->roles) && !in_array('therapist', $user->roles) && !in_array('staff admin', $user->roles) && !in_array('developer', $user->roles) && !in_array('administrator', $user->roles)) {
  $is_temp_user = TRUE;
}

$admin = false;

// Directions Counseling link ($dc_anchor).
$dc_prefix = '<a href="';
$dc_suffix = '" target="_blank">';
$dc_url = 'http://www.directionscounseling.com/';
$dc_text = 'Directions Counseling Group</a>';
$dc_anchor = $dc_prefix.$dc_url.$dc_suffix.$dc_text;

// Creates links for client progress and user menu.
if ($user->uid) {
  $logged_in = TRUE;
  $user_name = $user->name;
  $user_uid = $user->uid;
  $a_prefix = '<a href="' . $base_url . '/user/' . $user_uid;
  $staff_dashboard_href = '<a href="' . $base_url . '/staff-dashboard">';

  // User menu links.
  $assessment_link = $a_prefix . '/my-assessment?step=null">My Assessment</a>';
  $account_link = $a_prefix . '/edit">My Account</a>';
  $transactions_link = $a_prefix . '/my-transactions">My Transactions</a>';
  $staff_dash_link = $staff_dashboard_href . 'Staff Dashboard</a>';
  $logout_link = '<a href="' . $base_url . '/user/logout">Logout</a>';

  // Client progress links.
  if (isset($_GET['step'])) {
    $a_prefix = '<a href="'.$base_url.'/user/'.$user_uid.'/my-assessment?step=';
    $step = $_GET['step'];
    $class_quest = '';
    $class_int = '';
    $class_docs = '';
    $class_report = '';

    if ($step == 'questionnaire') {
      $class_quest = ' class="active"';
    }

    if ($step == 'interview') {
      $class_int = ' class="active"';
    }

    if ($step == 'necessary-documents') {
      $class_docs = ' class="active"';
    }

    if ($step == 'assessment-report') {
      $class_report = ' class="active"';
    }

    $questionnaire_link = $a_prefix . 'questionnaire"'.$class_quest.'><i class="fa fa-comments-o"></i><span>Complete My <strong>Questionnaire</strong></span></a>';
    $interview_link = $a_prefix . 'interview"'.$class_int.'><i class="fa fa-calendar"></i><span>Schedule an <strong>Interview</strong></span></a>';
    $necessary_docs_link = $a_prefix . 'necessary-documents"'.$class_docs.'><i class="fa fa-file-text"></i><span>Upload My <strong>Documents</strong></span></a>';
    $assessment_report_link = $a_prefix . 'assessment-report"'.$class_report.'><i class="fa fa-download"></i><span>View My <strong>Report</strong></span></a>';
  }
}

if (arg(0) == 'admin') {
  $admin = true;
}

// Path to base theme for public site.
$theme_path = base_path().path_to_theme();

// Image path for stylesheets.
$img_src = $theme_path.'/css/images/';

// Social networking links.
$fb_id = 'Directions-Counseling-Group/156596217711558';
$fb_link = 'https://www.facebook.com/pages/'.$fb_id;
$gp_link = 'https://plus.google.com/+DirectionsCounseling';
$tw_link = 'https://twitter.com/dcgcounselors';

// Social networking images.
$fb_img = $img_src.'fb.png';
$gp_img = $img_src.'gp.png';
$tw_img = $img_src.'tw.png';

// Main menu links.
if (!empty($main_menu)) {
  $menu_main = theme('links__system_main_menu', array(
    'links' => $main_menu,
    'attributes' => array(
      'id' => 'main-menu',
      'class' => array(
        'footer-menu-50',
        'links',
        'clearfix',
      ),
    ),
    'heading' => array(
      'text' => t('MAP'),
      'level' => 'h3',
      'class' => array(
        'footer-menu-heading',
      ),
    ),
  ));
}

// Second level of main menu links.
$menu_main_level_2 = theme('links', array(
  'links' => menu_navigation_links('menu-main-menu-level-2'),
  'attributes' => array(
    'class'=> array(
      'footer-menu-50',
      'right',
      'links',
      'clearfix',
    ),
  ),
  'heading' => array(
    'text' => t('MAP'),
    'level' => 'h3',
    'class' => array(
      'footer-menu-heading',
      'element-invisible',
    ),
  ),
));

// Agreements menu links.
$menu_agreements = theme('links', array(
  'links' => menu_navigation_links('menu-agreements-level-2'),
  'attributes' => array(
    'class'=> array(
      'footer-menu-100',
      'links',
      'clearfix',
    )
  ),
  'heading' => array(
    'text' => t('AGREEMENTS'),
    'level' => 'h3',
    'class' => array(
      'footer-menu-heading',
    ),
  ),
));

// Login URL.
$login_url = $base_url . '/user/login';

// Message to register before purchasing an assessment.
$register_first = t('You must first register to purchase an assessment. If you already have an account, you can login <a href="'. $login_url .'">here</a>.');

/**
 * Client Progress Logic
 *
 * Defines a default progress class to each list item in the progress bar.
 * Logic updates the status when a step has been completed.
 */
// Default status classes.
$questionnaire_status = 'step-not-complete';
$interview_status = 'step-not-complete';
$docs_status = 'step-not-complete';
$report_status = 'step-not-complete';
$steps_completed = 0;

// Questionnaire logic to test against. $orders defines the user how made a
// purchase, $questionnaire defines when the questionnaire has been completed
// and is not a saved draft.
$orders = ode_verify_order($user);
$questionnaire = ode_verify_questionnaire($user);
if (isset($orders[0]->order_id) && isset($questionnaire[0]->sid)) {
  if ($questionnaire[0]->is_draft != '1') {
    $questionnaire_status = 'step-complete';
    $steps_completed = 1;
  }
}

// Interview logic to test against. $int_nid defines the node ID if a user has
// submitted an interview request. $int_status defines the current status of
// the request, updated only by administrators and staff roles.
$int_nid = ode_verify_interview($user);
$int_status = ode_verify_interview_status();
if (isset($int_nid[0]->nid)) {
  if ($int_nid[0]->nid == $int_status[0]->entity_id) {
    if ($int_status[0]->field_interview_status_tid == 22) {
      $interview_status = 'step-complete';
      $steps_completed = 2;
    }
  }
}

// Necessary documents logic to test against. $doc_nid defines the node ID if a
// user has submitted a document. $doc_status defines the current status of
// the document, updated only by administrators and staff roles.
$doc_nid = ode_verify_necessary_docs($user);
$doc_status = ode_verify_necessary_docs_status();
$items = array();
if (isset($doc_nid[0]->nid)) {
  foreach($doc_nid as $doc_id) {
    if ($doc_id->nid == $doc_status[0]->entity_id) {
      if ($doc_status[0]->field_document_status_value == 1) {
        $items[] = 'complete';
      }
      else {
        $items[] = 'incomplete';
      }
    }
  }
}
if (isset($items)) {
  foreach ($items as $status_value) {
    if ($status_value == 'incomplete') {
      $docs_status = 'step-not-complete';
      break;
    }
    else {
      $docs_status = 'step-complete';
      $steps_completed = 3;
    }
  }
}

// Client report logic to test against. $report_nid defines the node ID's of
// returned nodes. $report_client_id defines the client ID's of returned nodes.
$report_client_id = ode_verify_client_report_client();
if (isset($report_client_id)) {
  foreach ($report_client_id as $r_uid) {
    if ($r_uid->field_client_name_target_id == $user_uid) {
      $report_status = 'step-complete';
      $steps_completed = 4;
    }
  }
}

// Each following message is dependent on the step determined above. We add a message
// to the client dashboard so they are aware of what to do next.
$step_message = '';
if ($steps_completed == 0) {
  $step_message = 'To begin the assessment process, please complete the questionnaire in step one below, "Complete Questionnaire".';
}
if ($steps_completed == 1) {
  $step_message = 'You have successfully completed the questionnaire. Please continue to step two below, "Schedule Interview".';
}
elseif ($steps_completed == 2) {
  $step_message = 'Your interview has been completed. Please continue to step three below, "Necessary Documents", if required. Your counselor/evaluator will notify you if any documents are needed. If no documents are required, please continue to step four below, "My Assessment Report".';
}
elseif ($steps_completed == 3) {
  $step_message = 'Your necessary documents have been verified. Please continue to step four below, "My Assessment Report".';
}
elseif ($steps_completed == 4) {
  $step_message = 'Congratulations, your assessment report has been uploaded by your counselor/evaluator. Please review "My Assessment Report" below for further details.';
}

// These variables are used for the page--user--%.tpl.php template.
if (arg(0) == 'user' && $logged_in) {
  $user_fields = user_load(arg(1));
  $edit_url = $base_url . '/user/' . arg(1) . '/edit';
  if (isset($user_fields->field_name['und'][0]['given'])) {
    $fname = $user_fields->field_name['und'][0]['given'];
    $lname = ' ' . $user_fields->field_name['und'][0]['family'];
  }
  $mname = '';
  $gname = '';
  if (isset($user_fields->uid))
    $uid = $user_fields->uid;
  if (isset($user_fields->created))
    $register_date = date('F j, Y', $user_fields->created);
  if (isset($user_fields->mail))
    $email = $user_fields->mail;
  if (isset($user_fields->field_gender['und'][0]['value']))
    $gender = $user_fields->field_gender['und'][0]['value'];
  if (isset($user_fields->field_address['und'][0])) {
    $address = $user_fields->field_address['und'][0];
    $street = $address['thoroughfare'];
    $second_street = '';
    $city = $address['locality'] . ', ';
    $state = $address['administrative_area'] . ' ';
    $zipcode = $address['postal_code'];
  }
  if (isset($user_fields->field_referral))
    $refferal = $user_fields->field_referral;
  if (isset($user_fields->field_recipient_information['und'][0])) {
    $recipient_address = $user_fields->field_recipient_information['und'][0];
    $recipient_name = $recipient_address['name_line'];
    $recipient_company = $recipient_address['organisation_name'];
    $recipient_street = $recipient_address['thoroughfare'];
    $recipient_second_street = '';
    $recipient_city = $recipient_address['locality'] . ', ';
    $recipient_state = $recipient_address['administrative_area'] . ' ';
    $recipient_zipcode = $recipient_address['postal_code'];
  }
  if (isset($user_fields->field_date_of_birth['und'][0]['value'])) {
    $bdate = explode(' ', $user_fields->field_date_of_birth['und'][0]['value']);
    $birth_date = date('F j, Y', strtotime($bdate[0]));
  }
  if (isset($user_fields->field_rush_order_service['und'][0]['value'])) {
    $rush_order = $user_fields->field_rush_order_service['und'][0]['value'];
  }
  $rush_order_date = '';
  $rush_order_time = '';
  $therapist = '';
  $phone = '';

  if (isset($user_fields->field_assigned_counselor['und'][0]['target_id'])) {
    $therapist_fields = user_load($user_fields->field_assigned_counselor['und'][0]['target_id']);
    $therapist_fname = $therapist_fields->field_name['und'][0]['given'];
    $therapist_lname = ' ' . $therapist_fields->field_name['und'][0]['family'];
    $therapist = implode(' ', array($therapist_fname, $therapist_lname));
  }
  else {
    $therapist = 'Not assigned';
  }

  if (isset($user_fields->field_area_code_primary['und'][0]['value'])) {
    $phone = '(' . $user_fields->field_area_code_primary['und'][0]['value'] . ') ';
  }

  if (isset($user_fields->field_prefix_primary['und'][0]['value'])) {
    $phone .= $user_fields->field_prefix_primary['und'][0]['value'] . '-';
  }

  if (isset($user_fields->field_line_number_primary['und'][0]['value'])) {
    $phone .= $user_fields->field_line_number_primary['und'][0]['value'];
  }
  
  if (isset($user_fields->field_name['und'][0]['middle'])) {
    $mname = ' ' .$user_fields->field_name['und'][0]['middle'];
  }
  
  if ($user_fields->field_name['und'][0]['generational'] != '') {
    $gname = ', ' . $user_fields->field_name['und'][0]['generational'];
  }
  
  if ($gender == '0') {
    $gender = 'Male';
  }
  
  elseif ($gender == '1') {
    $gender = 'Female';
  }
  
  if (isset($address['premise'])) {
    $second_street = $address['premise'];
  }
  
  if (isset($recipient_address['premise'])) {
    $recipient_second_street = $recipient_address['premise'];
  }
  
  if ($rush_order == '0') {
    $rush_order = 'Yes';
    $rush_date = explode(' ', $user_fields->field_rush_service_date['und'][0]['value']);
    $rush_order_date = date('F j, Y', strtotime($rush_date[0]));
    $rush_order_time = date('g:i a', strtotime($rush_date[1]));
  }
  
  elseif ($rush_order == '1') {
    $rush_order = 'No';
  }
  
  $fullname = $fname . $mname . $lname . $gname;
}
