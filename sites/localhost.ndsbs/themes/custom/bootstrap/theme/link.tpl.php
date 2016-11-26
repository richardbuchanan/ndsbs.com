<?php

if (isset($variables['options']['attributes']['id']) && $variables['options']['attributes']['id'] == 'edit-cancel') {
  $variables['options']['attributes']['class'][] = 'btn';
  $variables['options']['attributes']['class'][] = 'btn-warning';
}
print '<a href="' . check_plain(url($variables['path'], $variables['options'])) . '"' . drupal_attributes($variables['options']['attributes']) . '>' . ($variables['options']['html'] ? $variables['text'] : check_plain($variables['text'])) . '</a>';
