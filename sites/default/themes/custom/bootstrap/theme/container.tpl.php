<?php
$element = $variables['element'];
// Ensure #attributes is set.
$element += array('#attributes' => array());

// Special handling for form elements.
if (isset($element['#array_parents'])) {
  // Assign an html ID.
  if (!isset($element['#attributes']['id'])) {
    $element['#attributes']['id'] = $element['#id'];
  }
}
_form_set_class($element, array('form-wrapper'));

if (isset($element['#type'])) {
  switch ($element['#type']) {
    case 'actions':
      $element['#attributes']['class'][] = 'btn-group';
      break;
  }
}
if ($error = array_search('error', $element['#attributes']['class'])) {
  $element['#attributes']['class'][$error] = 'has-error';
}

print '<div' . drupal_attributes($element['#attributes']) . '>' . $element['#children'] . '</div>';
