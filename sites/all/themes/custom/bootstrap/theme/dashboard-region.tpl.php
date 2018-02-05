<?php
extract($variables);
$output = '<div' . drupal_attributes($variables['attributes_array']) . '>';
$output .= '<div' . drupal_attributes($variables['region_attributes_array']) . '>';
$output .= $element['#children'];
// Closing div.region
$output .= '</div>';
// Closing div.dashboard-region
$output .= '</div>';
print $output;
