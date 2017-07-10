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

function ndsbs_css_alter(&$css) {
  $ndsbs = drupal_get_path('theme', 'ndsbs');
  if (current_path() == 'node_two') {
    $css[$ndsbs . '/css/ndsbs.theme.css']['data'] = $ndsbs . '/css/ndsbs.theme.demo_two.css';
  }
  elseif (current_path() == 'node_three') {
    $css[$ndsbs . '/css/ndsbs.theme.css']['data'] = $ndsbs . '/css/ndsbs.theme.demo_three.css';
  }
}

function ndsbs_js_alter(&$javascript) {
  unset($javascript['//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js']);
  unset($javascript['//cdnjs.cloudflare.com/ajax/libs/jquery-migrate/1.4.1/jquery-migrate.min.js']);
}
