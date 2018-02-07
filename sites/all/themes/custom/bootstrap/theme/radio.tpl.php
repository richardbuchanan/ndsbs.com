<?php
$element = $variables['element'];
$element['#attributes']['type'] = 'radio';
element_set_attributes($element, array('id', 'name', '#return_value' => 'value'));

if (isset($element['#return_value']) && $element['#value'] !== FALSE && $element['#value'] == $element['#return_value']) {
  $element['#attributes']['checked'] = 'checked';
}

// Add aria-describedby attribute for screen readers.
if (!empty($element['#description'])) {
  $element['#attributes']['aria-describedby'] = 'help-' . $element['#id'];
}

print '<input' . drupal_attributes($element['#attributes']) . ' />';
