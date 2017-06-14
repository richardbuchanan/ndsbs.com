<?php
$element = $variables ['element'];
// Add required JavaScript and Stylesheet.
drupal_add_library('system', 'drupal.vertical-tabs');

$output = '<h2 class="sr-only">' . t('Vertical Tabs') . '</h2>';
$output .= '<div class="vertical-tabs-panes">' . $element ['#children'] . '</div>';
print $output;
