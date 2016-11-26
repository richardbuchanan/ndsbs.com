<?php

/**
 * Override or insert variables into the html template.
 */
function ohio_dui_admin_preprocess_html(&$vars) {
  $ohio_dui_admin_path = drupal_get_path('theme', 'ohio_dui_admin');
  // Add theme name to body class.
  $vars['classes_array'][] = 'ohio-dui-admin-theme';

  // Add icons to the admin configuration page.
  drupal_add_css($ohio_dui_admin_path . '/css/icons-config.css', array(
    'group' => CSS_THEME,
    'weight' => 10,
    'preprocess' => FALSE
  ));
  if (current_path() === 'admin/modules') {
    drupal_add_js($ohio_dui_admin_path . '/js/dynamic_position.js', array(
      'group' => JS_THEME,
      'every_page' => FALSE,
    ));
  }
}

function ohio_dui_admin_breadcrumb($variables) {
  $sep = ' <span>»</span> ';
  if (count($variables['breadcrumb']) > 0) {
    return '<div class="breadcrumb clearfix">'.implode($sep, $variables['breadcrumb']).'</div>';
  }
  else {
    return t('Home');
  }
}

/**
 * Override or insert variables into the page template.
 */
function ohio_dui_admin_preprocess_page(&$variables) {
  $variables['primary_local_tasks'] = $variables['tabs'];
  unset($variables['primary_local_tasks']['#secondary']);
  $variables['secondary_local_tasks'] = array(
    '#theme' => 'menu_local_tasks',
    '#secondary' => $variables['tabs']['#secondary'],
  );
}

/**
 * Implements hook_js_alter().
 */
function ohio_dui_admin_js_alter(&$javascript) {
  if (isset($javascript['sites/all/modules/contrib/other/module_filter/js/dynamic_position.js'])) {
    unset($javascript['sites/all/modules/contrib/other/module_filter/js/dynamic_position.js']);
    drupal_add_js('sites/ohioduieval.com/themes/ohio_dui/ohio_dui_admin/js/dynamic_position.js');
  }
}

/**
 * Override of theme_admin_block().
 * Adding classes to the administration blocks see issue #1869690.
 */
function ohio_dui_admin_admin_block($variables) {
  $block = $variables['block'];
  $output = '';

  // Don't display the block if it has no content to display.
  if (empty($block['show'])) {
    return $output;
  }

  if (!empty($block['path'])) {
    $output .= '<div class="admin-panel ' . check_plain(str_replace("/"," ",$block['path'])) . '">';
  }
  else if (!empty($block['title'])) {
    $output .= '<div class="admin-panel ' . check_plain(strtolower($block['title'])) . '">';
  }
  else {
    $output .= '<div class="admin-panel">';
  }

  if (!empty($block['title'])) {
    $output .= '<h3 class="title">' . $block['title'] . '</h3>';
  }

  if (!empty($block['content'])) {
    $output .= '<div class="body">' . $block['content'] . '</div>';
  }
  else {
    $output .= '<div class="description">' . $block['description'] . '</div>';
  }

  $output .= '</div>';

  return $output;
}

/**
 * Override of theme_admin_block_content().
 * Adding classes to the administration blocks see issue #1869690.
 */
function ohio_dui_admin_admin_block_content($variables) {
  $content = $variables['content'];
  $output = '';

  if (!empty($content)) {
    $class = 'admin-list';
    $output .= '<dl class="' . $class . '">';

    foreach ($content as $item) {
      $output .= '<div class="admin-block-item ' . check_plain(str_replace("/","-",$item['path'])) . '"><dt>' . l($item['title'], $item['href'], $item['localized_options']) . '</dt>';

      if (isset($item['description'])) {
        $output .= '<dd class="description">' . filter_xss_admin($item['description']) . '</dd>';
      }
      $output .= '</div>';
    }
    $output .= '</dl>';
  }
  return $output;
}
