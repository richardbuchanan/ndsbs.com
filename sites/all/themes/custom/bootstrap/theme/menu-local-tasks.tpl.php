<?php
$output = '';

if (!empty($variables['primary'])) {
  $variables['primary']['#prefix'] = '<div id="primary-tasks">';
  $variables['primary']['#prefix'] .= '<h2 class="sr-only">' . t('Primary tabs') . '</h2>';
  $variables['primary']['#prefix'] .= '<ul class="nav nav-tabs">';
  $variables['primary']['#suffix'] = '</ul></div>';
  $output .= drupal_render($variables['primary']);
}
if (!empty($variables['secondary'])) {
  $variables['secondary']['#prefix'] = '<div id="secondary-tasks">';
  $variables['secondary']['#prefix'] .= '<h2 class="sr-only">' . t('Secondary tabs') . '</h2>';
  $variables['secondary']['#prefix'] .= '<ul class="nav nav-pills">';
  $variables['primary']['#suffix'] = '</ul></div>';
  $output .= drupal_render($variables['secondary']);
}

print $output;

