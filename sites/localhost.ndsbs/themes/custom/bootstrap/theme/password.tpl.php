<?php
$reset = '';

//if (current_path() == 'user' || current_path() == 'user/login') {
  //$reset = '<div class="reset-password">' . l(t('Forgot your Password?'), 'user/password') . '</div>';
//}

$element = $variables['element'];
$element['#attributes']['type'] = 'password';
element_set_attributes($element, array('id', 'name', 'size', 'maxlength'));
_form_set_class($element, array('form-control'));

//print $reset . '<input' . drupal_attributes($element['#attributes']) . ' />';
print '<input' . drupal_attributes($element['#attributes']) . ' />';
