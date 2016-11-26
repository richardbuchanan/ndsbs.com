<?php
$element = $variables['element'];
$element['#attributes']['type'] = 'checkbox';
element_set_attributes($element, array('id', 'name', '#return_value' => 'value'));

// Unchecked checkbox has #value of integer 0.
if (!empty($element['#checked'])) {
  $element['#attributes']['checked'] = 'checked';
}
_form_set_class($element, array('form-checkbox'));

print '<input' . drupal_attributes($element['#attributes']) . ' />';
