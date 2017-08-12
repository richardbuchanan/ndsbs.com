<?php

/**
 * @file
 * Conditional logic and data processing for ndsbs.
 *
 * The functions below are just examples of the most common functions a
 * sub-theme can implement. Feel free to remove these functions or implement
 * other functions.
 */

/**
 * Loads an NDSBS include file.
 *
 * This function essentially does the same as Drupal core's
 * module_load_include() function, except targeting theme include files. It also
 * allows you to place the include files in a sub-directory of the theme for
 * better organization.
 *
 * Do not use this function in a global context since it requires Drupal to be
 * fully bootstrapped, use require_once DRUPAL_ROOT . '/path/file' instead.
 *
 * @param string $type
 *   The include file's type (file extension).
 * @param string $theme
 *   The theme to which the include file belongs.
 * @param string $name
 *   (optional) The base file name (without the $type extension). If omitted,
 *   $theme is used; i.e., resulting in "$theme.$type" by default.
 * @param string $sub_directory
 *   (optional) The sub-directory to which the include file resides.
 *
 * @return string
 *   The name of the included file, if successful; FALSE otherwise.
 */
function ndsbs_load_include($type, $theme, $name = NULL, $sub_directory = '') {
  static $files = array();

  if (isset($sub_directory)) {
    $sub_directory = '/' . $sub_directory;
  }

  if (!isset($name)) {
    $name = $theme;
  }

  $key = $type . ':' . $theme . ':' . $name . ':' . $sub_directory;

  if (isset($files[$key])) {
    return $files[$key];
  }

  if (function_exists('drupal_get_path')) {
    $file = DRUPAL_ROOT . '/' . drupal_get_path('theme', $theme) . "$sub_directory/$name.$type";
    if (is_file($file)) {
      require_once $file;
      $files[$key] = $file;
      return $file;
    }
    else {
      $files[$key] = FALSE;
    }
  }
  return FALSE;
}

/**
 * Load NDSBS's include files for theme processing.
 */
ndsbs_load_include('inc', 'ndsbs', 'preprocess', 'includes');
ndsbs_load_include('inc', 'ndsbs', 'preprocess_custom', 'includes');
ndsbs_load_include('inc', 'ndsbs', 'process', 'includes');
ndsbs_load_include('inc', 'ndsbs', 'theme', 'includes');
ndsbs_load_include('inc', 'ndsbs', 'alter', 'includes');
