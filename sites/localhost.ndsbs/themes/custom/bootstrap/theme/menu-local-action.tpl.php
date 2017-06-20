<?php
$link = $variables['element']['#link'];
$path = explode('/', $link['path']);
$output = '';

if (in_array('add', $path)) {
  $link['localized_options']['html'] = true;
  $link['title'] = '<span class="glyphicon glyphicon-plus" aria-hidden="true"></span> ' . $link['title'];
}

if (isset($link['href'])) {
  $output .= l($link['title'], $link['href'], isset($link['localized_options']) ? $link['localized_options'] : array());
}
elseif (!empty($link['localized_options']['html'])) {
  $output .= $link['title'];
}
else {
  $output .= check_plain($link['title']);
}

print $output;
