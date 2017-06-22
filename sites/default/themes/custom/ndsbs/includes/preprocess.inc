<?php

/**
 * @file
 * Set up variables to be placed within the template (.tpl.php) files.
 *
 * The variables set up here apply to both templates (.tpl.php) files and
 * functions (theme_HOOK). These are also used for providing
 * @link https://www.drupal.org/node/223440 template suggestions @endlink.
 *
 * @see process.inc
 */

use Drupal\ndsbs\NDSBS;
use Drupal\uikit\UIkit;

/**
 * Implements template_preprocess().
 */
function ndsbs_preprocess(&$variables) {
  drupal_add_js('//cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js', array(
    'type' => 'external',
    'group' => JS_THEME,
    'every_page' => TRUE,
    'weight' => -10,
    'version' => '1.4.1',
  ));
}

/**
 * Implements template_preprocess_page().
 */
function ndsbs_preprocess_page(&$variables) {
  $variables['navbar_attributes_array']['class'][] = 'uk-navbar-transparent';
  $variables['navbar_attributes_array']['class'][] = 'uk-container';
}
