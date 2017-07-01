<?php

/**
 * @file
 * Set up variables to be placed within the template (.tpl.php) files.
 *
 * The variables set up here apply to both templates (.tpl.php) files and
 * functions (theme_HOOK). See preprocess.inc for providing
 * @link https://www.drupal.org/node/223440 template suggestions @endlink.
 *
 * @see preprocess.inc
 */

/**
 * Implements hook_preprocess_HOOK() for page.tpl.php.
 */
function ndsbs_process_page(&$variables) {
  $highlighted_attributes_array = $variables['highlighted_attributes_array'];
  $variables['highlighted_attributes'] = drupal_attributes($highlighted_attributes_array);
}
