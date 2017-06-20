<?php
$display = $variables['display'];
$output = '';

$status_heading = array(
  'status' => t('Status message'),
  'error' => t('Error message'),
  'warning' => t('Warning message'),
);

foreach (drupal_get_messages($display) as $type => $messages) {
  switch ($type) {
    case 'status':
      $type = 'success';
      break;

    case 'info':
      $type = 'info';
      break;

    case 'warning':
      $type = 'warning';
      break;

    case 'error':
      $type = 'danger';
      break;

    default:
      $type = 'info';
      break;
  }

  $output .= "<div class=\"alert alert-$type alert-dismissible\" role=\"alert\">";
  $output .= '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';

  if (!empty($status_heading[$type])) {
    $output .= '<h2 class="sr-only">' . $status_heading[$type] . "</h2>\n";
  }

  if (count($messages) > 1) {
    $output .= " <ul>\n";

    foreach ($messages as $message) {
      $output .= '  <li>' . $message . "</li>\n";
    }

    $output .= " </ul>\n";
  }
  else {
    $output .= reset($messages);
  }

  $output .= "</div>\n";
}

print $output;
