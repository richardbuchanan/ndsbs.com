<?php
/**
 * @file
 * Process theme data for bootstrap_ndsbs_admin.
 */

/**
 * Implements template_preprocess_html().
 */
function bootstrap_ndsbs_admin_preprocess_html(&$variables) {
}

/**
 * Implements template_preprocess_page().
 */
function bootstrap_ndsbs_admin_preprocess_page(&$variables) {
  $variables['breadcrumb_attributes_array']['class'] = array();

  $links = array(
    'user' => array(
      'title' => t('My account'),
      'href' => 'user',
    ),
    'dashboard' => array(
      'title' => t('Staff dashboard'),
      'href' => 'user/clients/list',
    ),
    'performance' => array(
      'title' => t('Performance statistics'),
      'href' => 'admin/dashboard/performance',
    ),
    'logout' => array(
      'title' => t('Log out'),
      'href' => 'user/logout',
    ),
  );
  $variables['staff_tabs'] = array(
    '#theme' => 'links',
    '#links' => $links,
    '#attributes' => array('class' => array('nav', 'nav-tabs')),
  );
}

/**
 * Implements template_preprocess_block().
 */
function bootstrap_ndsbs_admin_preprocess_dashboard(&$variables) {
}

/**
 * Implements template_preprocess_dashboard_region().
 */
function bootstrap_ndsbs_admin_preprocess_dashboard_region(&$variables) {
  $region = $variables['element']['#dashboard_region'];
  $region_attributes = array('id' => 'region-' . str_replace('_', '-', $region));

  if ($region == 'dashboard_main') {
    //$region_attributes['class'] = array('row');
  }

  $variables['region_attributes_array'] = $region_attributes;
}

/**
 * Implements template_preprocess_block().
 */
function bootstrap_ndsbs_admin_preprocess_block(&$variables) {
  $region = $variables['block']->region;

  if ($region == 'dashboard_main') {
    if ($variables['elements']['#block']->delta != 'staff_transactions-block_1') {
      $variables['classes_array'][] = 'col-xs-12';
      $variables['classes_array'][] = 'col-md-6';
    }
    else {
      $variables['classes_array'][] = 'col-xs-12';
    }
  }

  if ($region == 'dashboard_sidebar') {
    //$variables['classes_array'][] = 'col-xs-12';
  }
}

/**
 * Implements template_preprocess_menu_tree().
 */
function bootstrap_ndsbs_admin_preprocess_menu_tree(&$variables) {
}

/**
 * Implements hook_js_alter().
 */
function bootstrap_ndsbs_admin_js_alter(&$javascript) {
  $theme = drupal_get_path('theme', 'bootstrap_ndsbs_admin');
  $google_charts = drupal_get_path('module', 'google_chart_tools');
  $dashboard = drupal_get_path('module', 'dashboard');

  // Replace Google Chart Tools' google_chart_tools.js with this theme's version.
  if (isset($javascript[$google_charts . '/google_chart_tools.js'])) {
    $gct = $theme . '/js/google_chart_tools.js';
    $javascript[$google_charts . '/google_chart_tools.js']['data'] = $gct;
  }

  // Replace Drupal core's dashboard.js with this theme's version.
  if (isset($javascript[$dashboard . '/dashboard.js'])) {
    $dash = $theme . '/js/dashboard.js';
    $javascript[$dashboard . '/dashboard.js']['data'] = $dash;
  }
}
