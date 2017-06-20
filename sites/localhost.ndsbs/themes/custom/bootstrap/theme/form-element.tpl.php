<?php
$element = &$variables['element'];

// This function is invoked as theme wrapper, but the rendered form element
// may not necessarily have been processed by form_builder().
$element += array(
  '#title_display' => 'before',
);

// Add element #id for #type 'item'.
if (isset($element['#markup']) && !empty($element['#id'])) {
  $attributes['id'] = $element['#id'];
}
// Add element's #type and #name as class to aid with JS/CSS selectors.
$attributes['class'] = array('form-group', 'form-item');
if (!empty($element['#type'])) {
  if ($element['#type'] == 'checkbox') {
    $attributes['class'] = array('checkbox');
  }
  if ($element['#type'] == 'radio') {
    $attributes['class'] = array('radio');
  }
  $attributes['class'][] = 'form-type-' . strtr($element['#type'], '_', '-');
}
if (!empty($element['#name'])) {
  $attributes['class'][] = 'form-item-' . strtr($element['#name'], array(' ' => '-', '_' => '-', '[' => '-', ']' => ''));
}
// Add a class for disabled elements to facilitate cross-browser styling.
if (!empty($element['#attributes']['disabled'])) {
  $attributes['class'][] = 'form-disabled';
}
$output = '<div' . drupal_attributes($attributes) . '>' . "\n";

// If #title is not set, we don't display any label or required marker.
if (!isset($element['#title'])) {
  $element['#title_display'] = 'none';
}
$prefix = isset($element['#field_prefix']) ? '<span class="field-prefix">' . $element['#field_prefix'] . '</span> ' : '';
$suffix = isset($element['#field_suffix']) ? ' <span class="field-suffix">' . $element['#field_suffix'] . '</span>' : '';

if (!empty($element['#description'])) {
  $id = 'help-' . $element['#id'];
}

if ((isset($element['#title']) && !empty($element['#type'])) && ($element['#type'] == 'checkbox' || $element['#type'] == 'radio')) {
  $output .= '<label>' . $prefix . $element['#children'] . $suffix . $element['#title'] .  "</label>\n";
}
else {
  switch ($element['#title_display']) {
    case 'before':
    case 'invisible':
      $output .= ' ' . theme('form_element_label', $variables);
      $output .= ' ' . $prefix . $element['#children'] . $suffix;
      break;

    case 'after':
      $output .= ' ' . $prefix . $element['#children'] . $suffix;
      $output .= ' ' . theme('form_element_label', $variables) . "\n";
      break;

    case 'none':
    case 'attribute':
      // Output no label and no required marker, only the children.
      $output .= ' ' . $prefix . $element['#children'] . $suffix . "\n";
      break;
  }
}

if (!empty($element['#description'])) {
  $output .= '<span id="' . $id . '" class="help-block">' . $element['#description'] . "</span>\n";
}

$output .= "</div>\n";

print $output;
