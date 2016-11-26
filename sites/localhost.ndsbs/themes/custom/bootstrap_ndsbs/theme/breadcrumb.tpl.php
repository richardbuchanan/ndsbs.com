<?php
$breadcrumb = $variables['breadcrumb'];
$output = '';

if (!empty($breadcrumb)) {
  // Provide a navigational heading to give context for breadcrumb links to
  // screen-reader users. Make the heading invisible with .element-invisible.
  $output = '<h2 class="sr-only">' . t('You are here') . '</h2>';
  $output .= '<ol' . $attributes . '>';
  $a = 1;

  foreach ($breadcrumb as $crumb) {
    $crumb = $crumb . '<meta property="position" content="' . $a . '">';
    $output .= '<li' . $list_item_attributes . '>' . $crumb . '</li>';
    $a++;
  }

  $output .= '</ol>';
}

print $output;
