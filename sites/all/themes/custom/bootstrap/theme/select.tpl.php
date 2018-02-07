<?php
$element = $variables['element'];
element_set_attributes($element, array('id', 'name', 'size'));
_form_set_class($element, array('form-control'));

// Add aria-describedby attribute for screen readers.
if (!empty($element['#description'])) {
  $element['#attributes']['aria-describedby'] = 'help-' . $element['#id'];
}

print '<select' . drupal_attributes($element['#attributes']) . '>' . form_select_options($element) . '</select>';
