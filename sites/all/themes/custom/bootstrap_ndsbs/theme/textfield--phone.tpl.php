<?php

/**
 * @file
 * Outputs html for a phone number field.
 */

drupal_add_js(drupal_get_path('theme', 'bootstrap_ndsbs') . '/js/bootstrap-ndsbs.phone.js');
$element = $variables['element'];
$element['#attributes']['type'] = 'tel';
//$element['#attributes']['pattern'] = '\d{3}[\-]\d{3}[\-]\d{4}';
$element['#attributes']['title'] = 'Format: (999) 999-9999';
$element['#attributes']['onkeydown'] = 'javascript:backspacerDOWN(this,event);';
$element['#attributes']['onkeyup'] = 'javascript:backspacerUP(this,event);';

element_set_attributes($element, array(
  'id',
  'name',
  'value',
  'size',
  'maxlength',
));

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
  $output .= '<div class="has-autocomplete has-feedback">';
}

$output .= '<input' . drupal_attributes($element['#attributes']) . ' />';

if ($element['#autocomplete_path'] && drupal_valid_path($element['#autocomplete_path'])) {
  $output .= '<span class="glyphicon glyphicon-refresh form-control-feedback" aria-hidden="true"></span></div>';
}

print $output . $extra;
