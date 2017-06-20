<?php

if (isset($variables['options']['attributes']['id']) && $variables['options']['attributes']['id'] == 'edit-cancel') {
  $variables['options']['attributes']['class'][] = 'btn';
  $variables['options']['attributes']['class'][] = 'btn-warning';
}
if (isset($variables['options']['query']['destination']) && $variables['path'] != 'node/1948/edit' && $variables['options']['query']['destination'] == 'node/1670' && $variables['text'] == 'Edit') {
  $variables['text'] = 'Edit slide';
}
if (isset($variables['options']['query']['destination']) && $variables['options']['query']['destination'] == 'node/1670' && $variables['text'] == 'Add') {
  $variables['text'] = 'Add slide';
}
print '<a href="' . check_plain(url($variables['path'], $variables['options'])) . '"' . drupal_attributes($variables['options']['attributes']) . '>' . ($variables['options']['html'] ? $variables['text'] : check_plain($variables['text'])) . '</a>';
