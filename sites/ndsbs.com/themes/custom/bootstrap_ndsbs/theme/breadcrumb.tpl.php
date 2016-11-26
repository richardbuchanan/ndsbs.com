<?php
$breadcrumb = $variables['breadcrumb'];
$output = '';

if (!empty($breadcrumb)) {

  $output = '<ol' . $attributes . '>';
  $a = 1;

  foreach ($breadcrumb as $crumb) {
    $crumb = $crumb . '<meta property="position" content="' . $a . '">';
    $output .= '<li' . $list_item_attributes . '>' . $crumb . '</li>';
    $a++;
  }

  $output .= '</ol>';
}

print $output;
