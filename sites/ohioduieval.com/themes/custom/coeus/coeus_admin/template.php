<?php

/**
 * Implements template_preprocess_html().
 *
 * Override or insert variables into the html template.
 */
function coeus_admin_preprocess_html(&$variables) {
}

/**
 * Implements template_preprocess_page().
 *
 * Override or insert variables into the page template.
 */
function coeus_admin_preprocess_page(&$variables) {
  $variables['primary_local_tasks'] = $variables['tabs'];
  unset($variables['primary_local_tasks']['#secondary']);
  $variables['secondary_local_tasks'] = array(
    '#theme' => 'menu_local_tasks',
    '#secondary' => $variables['tabs']['#secondary'],
  );

  if (module_exists('overlay')) {
    if (overlay_get_mode() == 'child') {
      $variables['breadcrumb'] = '';
    }
  }
}

/**
 * Implements template_preprocess_overlay().
 *
 * Preprocesses template variables for overlay.tpl.php
 * @see overlay.tpl.php
 */
function coeus_admin_preprocess_overlay(&$variables) {
  if (module_exists('crumbs')) {
    $breadcrumb_data = crumbs_get_breadcrumb_data();
    $variables['crumbs_trail'] = $breadcrumb_data['trail'];
    $variables['breadcrumb'] = $breadcrumb_data['html'];
  }

  else {
    $variables['breadcrumb'] = theme('breadcrumb', array(
      'breadcrumb' => drupal_get_breadcrumb()
    ));
  }
}

/**
 * Implements theme_breadcrumb().
 *
 * Returns HTML for a breadcrumb trail.
 */
function coeus_admin_breadcrumb($variables) {
  $sep = ' <span></span> ';
  if (count($variables['breadcrumb']) > 0) {
    return '<div class="breadcrumb clearfix">' . implode($sep, $variables['breadcrumb']) . '</div>';
  }
  else {
    return t("Home");
  }
}

/**
 * Implements theme_tablesort_indicator().
 *
 * Returns HTML for a sort icon.
 */
function coeus_admin_tablesort_indicator($variables) {
  $style = $variables['style'];
  $theme_path = drupal_get_path('theme', 'coeus_admin');
  if ($style == 'asc') {
    return theme('image', array(
      'path' => $theme_path . '/images/arrow-asc.png',
      'alt' => t('sort ascending'),
      'width' => 13,
      'height' => 13,
      'title' => t('sort ascending')
    ));
  }

  else {
    return theme('image', array(
      'path' => $theme_path . '/images/arrow-desc.png',
      'alt' => t('sort descending'),
      'width' => 13,
      'height' => 13,
      'title' => t('sort descending')
    ));
  }
}