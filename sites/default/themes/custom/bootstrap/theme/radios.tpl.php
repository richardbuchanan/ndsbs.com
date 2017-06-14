<?php
$element = $variables['element'];
$attributes = array();
if (isset($element['#id'])) {
  $attributes['id'] = $element['#id'];
}
$attributes['class'] = 'form-radios';
if (!empty($element['#attributes']['class'])) {
  $attributes['class'] .= ' ' . implode(' ', $element['#attributes']['class']);
}
if (isset($element['#attributes']['title'])) {
  $attributes['title'] = $element['#attributes']['title'];
}
print (!empty($element['#children']) ? $element['#children'] : '');
