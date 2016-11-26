<?php
$breadcrumb = $variables['breadcrumb'];
$output = '';

if (!empty($breadcrumb)) {
  array_unique($breadcrumb);
  // Provide a navigational heading to give context for breadcrumb links to
  // screen-reader users. Make the heading invisible with .element-invisible.
  $lastitem = sizeof($breadcrumb);
  $output = '<h2 class="sr-only">' . t('You are here') . '</h2>';
  $output .= '<ol class="breadcrumb">';
  $a = 1;

  foreach ($breadcrumb as $crumb) {
    if ($a != $lastitem) {
      $output .= '<li>' . $crumb . '</li>';
      $a++;
    }
    else {
      $output .= '<li>' . $crumb . '</li>';
    }
  }

  $output .= '<li class="active">' . drupal_get_title() . '</li>';
  $output .= '</ol>';
}

print $output;
