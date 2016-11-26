<?php
// This is also used in the installer, pre-database setup.
$t = get_t();
$attributes = array(
  'class' => 'text-danger',
  'title' => $t('This field is required.'),
);
print '<span' . drupal_attributes($attributes) . '>*</span>';
