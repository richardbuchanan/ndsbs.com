<?php
$element = $variables['element'];
$element['#attributes']['type'] = 'text';
element_set_attributes($element, array('id', 'name', 'value', 'size', 'maxlength'));
_form_set_class($element, array('form-control'));

$extra = '';
if ($element['#autocomplete_path'] && drupal_valid_path($element['#autocomplete_path'])) {
  drupal_add_library('system', 'drupal.autocomplete');
  $element['#attributes']['class'][] = 'form-autocomplete';

  $attributes = array();
  $attributes['type'] = 'hidden';
  $attributes['id'] = $element['#attributes']['id'] . '-autocomplete';
  $attributes['value'] = url($element['#autocomplete_path'], array('absolute' => TRUE));
  $attributes['disabled'] = 'disabled';
  $attributes['class'][] = 'autocomplete';
  $extra = '<input' . drupal_attributes($attributes) . ' />';
}

// Add aria-describedby attribute for screen readers.
if (!empty($element['#description'])) {
  $element['#attributes']['aria-describedby'] = 'help-' . $element['#id'];
}

$output = '';

if ($element['#autocomplete_path'] && drupal_valid_path($element['#autocomplete_path'])) {
  $output .= '<div class="has-feedback">';
}

$output .= '<input' . drupal_attributes($element['#attributes']) . ' />';

if ($element['#autocomplete_path'] && drupal_valid_path($element['#autocomplete_path'])) {
  $output .= '<span class="glyphicon glyphicon-refresh form-control-feedback" aria-hidden="true"></span></div>';
}

print $output . $extra;
