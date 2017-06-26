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
  // Add the 'form-wrapper' class.
  $element['#attributes']['class'][] = 'form-wrapper';
}

if (isset($element['#type'])) {
  switch ($element['#type']) {
    case 'actions':
      $element['#attributes']['class'][] = 'btn-group';
      break;
  }
}

print '<div' . drupal_attributes($element['#attributes']) . '>' . $element['#children'] . '</div>';
