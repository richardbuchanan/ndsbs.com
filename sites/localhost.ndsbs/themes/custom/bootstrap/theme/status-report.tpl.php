<?php
$requirements = $variables ['requirements'];
$severities = array(
  REQUIREMENT_INFO => array(
    'title' => t('Info'),
    'class' => 'alert-info',
  ),
  REQUIREMENT_OK => array(
    'title' => t('OK'),
    'class' => 'alert-success',
  ),
  REQUIREMENT_WARNING => array(
    'title' => t('Warning'),
    'class' => 'alert-warning',
  ),
  REQUIREMENT_ERROR => array(
    'title' => t('Error'),
    'class' => 'alert-danger',
  ),
);
$output = '<table class="table table-condensed system-status-report">';

foreach ($requirements as $requirement) {
  if (empty($requirement ['#type'])) {
    $severity = $severities [isset($requirement ['severity']) ? (int) $requirement ['severity'] : REQUIREMENT_OK];
    $severity ['icon'] = '<div title="' . $severity ['title'] . '"><span class="sr-only">' . $severity ['title'] . '</span></div>';

    // Output table row(s)
    if (!empty($requirement ['description'])) {
      $output .= '<tr class="' . $severity ['class'] . ' merge-down"><td class="status-icon">' . $severity ['icon'] . '</td><td class="status-title">' . $requirement ['title'] . '</td><td class="status-value">' . $requirement ['value'] . '</td></tr>';
      $output .= '<tr class="' . $severity ['class'] . ' merge-up"><td colspan="3" class="status-description">' . $requirement ['description'] . '</td></tr>';
    }
    else {
      $output .= '<tr class="' . $severity ['class'] . '"><td class="status-icon">' . $severity ['icon'] . '</td><td class="status-title">' . $requirement ['title'] . '</td><td class="status-value">' . $requirement ['value'] . '</td></tr>';
    }
  }
}

$output .= '</table>';
print $output;
