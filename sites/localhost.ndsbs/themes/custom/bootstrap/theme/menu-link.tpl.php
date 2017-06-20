<?php
$element = $variables['element'];
$sub_menu = '';
global $user;

if ($element['#below']) {
  $sub_menu = drupal_render($element['#below']);
  $element['#attributes']['class'] = array('dropdown');
}

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

if (isset($element['#localized_options']['attributes']['class'])) {
  unset($element['#localized_options']['attributes']['class']);
}
if (isset($element['#localized_options']['attributes']['title'])) {
  unset($element['#localized_options']['attributes']['title']);
}

$output = l($element['#title'], $element['#href'], $element['#localized_options']);
print '<li' . drupal_attributes($element['#attributes']) . '>' . $output . $sub_menu . "</li>\n";
