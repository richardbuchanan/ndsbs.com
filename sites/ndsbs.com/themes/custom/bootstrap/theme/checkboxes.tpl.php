<?php
$element = $variables['element'];
$attributes = array();
if (isset($element['#id'])) {
  $attributes['id'] = $element['#id'];
}
$attributes['class'][] = 'form-checkboxes';
if (!empty($element['#attributes']['class'])) {
  $attributes['class'] = array_merge($attributes['class'], $element['#attributes']['class']);
}
if (isset($element['#attributes']['title'])) {
  $attributes['title'] = $element['#attributes']['title'];
}
print '<div' . drupal_attributes($attributes) . '>' . (!empty($element['#children']) ? $element['#children'] : '') . '</div>';
