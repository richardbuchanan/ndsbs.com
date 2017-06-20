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
 * Implements template_process_page().
 */
function bootstrap_ndsbs_process_page(&$variables) {
  $variables['breadcrumb_attributes'] = drupal_attributes($variables['breadcrumb_attributes_array']);
}
