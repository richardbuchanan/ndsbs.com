<?php
$output = '<div class="progress">';
$output .= '<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="' . $variables ['percent'] . '" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em; width: ' . $variables ['percent'] . '%">' . $variables ['percent'] . '%<span class="message"></span></div>';
$output .= '</div>';

print $output;
