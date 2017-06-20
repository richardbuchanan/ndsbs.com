<?php
$element = $variables['element'];
$sub_menu = '';
global $user, $base_url;

$staff_nav = $element['#original_link']['menu_name'] == 'menu-staff-navigation' ? TRUE : FALSE;
$client_nav = $element['#original_link']['menu_name'] == 'menu-client-navigation' ? TRUE : FALSE;
$user_nav = $element['#original_link']['menu_name'] == 'user-menu' ? TRUE : FALSE;
//$assessment_url = is_array(get_purchased_questionnaire_assessment_list_leftpanel()) ? str_replace($base_url . '/', '', bdg_ndsbs_get_steps_page()) : 'view/assessment/status';

if ($element['#href'] == 'questionnaire/start/trans') {
  //$element['#href'] = $assessment_url;

  if (is_array(get_purchased_questionnaire_assessment_list_leftpanel())) {
    if ($client_nav) {
      $element['#title'] = bdg_ndsbs_therapist_reports_service_title($user->uid);
      if (arg(0) == 'questionnaire' && arg(1) == 'start') {
        $element['#attributes']['class'][] = 'active';
      }
    }
  }
}

if ($element['#href'] == 'user') {
  if (user_is_logged_in()) {
    $element['#href'] = 'user/' . $user->uid;
  }
}

if ($staff_nav) {
  $depth = 'staff-navigation';

  if ($element['#original_link']['depth'] != '1') {
    $element['#attributes']['data-menu-parent'] = 'staff-navigation-menu';
  }
  else {
    $class = strtolower(preg_replace('/\PL/u', '-', $variables['element']['#title']));
    $element['#attributes']['class'][] = $class;
  }
}

if ($client_nav) {
  $depth = 'client-navigation';

  if ($element['#original_link']['depth'] != '1') {
    $element['#attributes']['data-menu-parent'] = 'client-navigation-menu';
  }
  else {
    $class = strtolower(preg_replace('/\PL/u', '-', $variables['element']['#title']));
    $element['#attributes']['class'][] = $class;
  }
}

if ($user_nav) {
  $depth = 'user-navigation';

  if ($element['#original_link']['depth'] != '1') {
    $element['#attributes']['data-menu-parent'] = 'user-navigation-menu';
  }
  else {
    $class = strtolower(preg_replace('/\PL/u', '-', $variables['element']['#title']));
    $element['#attributes']['class'][] = $class;
  }
}

if ($element['#below']) {
  $sub_menu = drupal_render($element['#below']);
  $element['#attributes']['class'][] = 'dropdown';
}

if ($staff_nav && $element['#original_link']['depth'] != '1') {
  switch ($element['#href']) {
    case '<front>':
      if (drupal_is_front_page()) {
        $element['#attributes']['class'][] = 'active';
      }
      break;

    case 'user':
      if (current_path() == 'user' || current_path() == 'user/' . $user->uid) {
        $element['#attributes']['class'][] = 'active';
      }
      break;

    default:
      if ($element['#href'] == current_path()) {
        $element['#attributes']['class'][] = 'active';
      }
      break;
  }
}

if (isset($element['#localized_options']['attributes']['class'])) {
  unset($element['#localized_options']['attributes']['class']);
}
if (isset($element['#localized_options']['attributes']['title'])) {
  unset($element['#localized_options']['attributes']['title']);
}

if ($staff_nav || $client_nav) {
  if ($element['#original_link']['depth'] == '1') {
    $output = '<a class="dropdown-link">' . $element['#title'] . '</a>';
  }
  else {
    $output = l($element['#title'], $element['#href'], $element['#localized_options']);
  }
}
else {
  $output = l($element['#title'], $element['#href'], $element['#localized_options']);
}

print '<li' . drupal_attributes($element['#attributes']) . '>' . $output . $sub_menu . "</li>\n";
