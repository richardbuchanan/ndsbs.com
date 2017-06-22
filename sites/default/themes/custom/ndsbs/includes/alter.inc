<?php

/**
 * @file
 * Modify structured content arrays.
 *
 * These hooks are called after the content has been assembled in a structured
 * array and may be used for doing processing which requires that the complete
 * content structure has been built.
 *
 * If the theme wishes to act on the rendered HTML of the content rather than
 * the structured content array, it may use this hook to add a #post_render
 * callback. Alternatively, it could also implement hook_preprocess_HOOK().
 *
 * @see drupal_render()
 * @see theme()
 */

use Drupal\ndsbs\NDSBS;
use Drupal\uikit\UIkit;

function ndsbs_js_alter(&$javascript) {
  $fb = drupal_get_path('module', 'fb');

  $fb_js = $fb . '/fb.js';
  $fb_sdk = $fb . '/fb_sdk.js';
  if (isset($javascript[$fb_js])) {
    $javascript[$fb_js]['group'] = JS_THEME;
  }
  if (isset($javascript[$fb_sdk])) {
    $javascript[$fb_sdk]['group'] = JS_THEME;
  }
}
