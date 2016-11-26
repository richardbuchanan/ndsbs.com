<?php
$element = $variables['element'];

// Add CSS classes to hide the links from most sighted users, while keeping
// them accessible to screen-reader users and keyboard-only users. To assist
// screen-reader users, this message appears in both the parent and child
// documents, but only the one in the child document is part of the tab order.
foreach (array('profile_link', 'dismiss_message_link') as $key) {
  $element[$key]['#options']['attributes']['class'][] = 'sr-only';
  if (overlay_get_mode() == 'child') {
    $element[$key]['#options']['attributes']['class'][] = 'sr-only-focusable';
  }
}

// Render the links.
$output = drupal_render($element['profile_link']) . ' ' . drupal_render($element['dismiss_message_link']);

// Add a heading for screen-reader users. The heading doesn't need to be seen
// by sighted users.
$output = '<h3 class="sr-only">' . t('Options for the administrative overlay') . '</h3>' . $output;

// Wrap in a container for styling.
$output = '<div id="overlay-disable-message" class="clearfix">' . $output . '</div>';

print $output;
