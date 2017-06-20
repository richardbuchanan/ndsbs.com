<?php
$element = $variables['element'];

if (isset($element['#action'])) {
  $element['#attributes']['action'] = drupal_strip_dangerous_protocols($element['#action']);
}

element_set_attributes($element, array('method', 'id'));

if (empty($element['#attributes']['accept-charset'])) {
  $element['#attributes']['accept-charset'] = "UTF-8";
}

print '<form' . drupal_attributes($element['#attributes']) . '>' . $element['#children'] . '</form>';
