<?php
$element = $variables['element'];
$element['#attributes']['type'] = 'submit';
element_set_attributes($element, array('id', 'name', 'value'));

// Add icons before or after the value.
// @see https://drupal.org/node/2219965
$value = $element['#value'];
if (!empty($element['#icon'])) {
  if ($element['#icon_position'] === 'before') {
    $value = $element['#icon'] . ' ' . $value;
  }
  elseif ($element['#icon_position'] === 'after') {
    $value .= ' ' . $element['#icon'];
  }
}

if (!empty($element['#attributes']['disabled'])) {
  $element['#attributes']['class'][] = 'form-button-disabled';
}

print '<button' . drupal_attributes($element['#attributes']) . '>' . $element['#attributes']['value'] . '</button>';
