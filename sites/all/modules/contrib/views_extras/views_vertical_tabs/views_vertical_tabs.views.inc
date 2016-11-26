<?php
/**
 * @file
 * Views integration for the views_vertical_tabs module.
 */

/**
 * Implements hook_views_plugins().
 */
function views_vertical_tabs_views_plugins() {
  $plugins = array();

  $plugins['style']['vertical_tabs'] = array(
    'title' => t('Vertical Tabs'),
    'help' => t('Renders the full views output in a vertical tabs'),
    'handler' => 'views_plugin_style_vertical_tabs',
    'theme' => 'views_view_vertical_tabs',
    'uses row plugin' => TRUE,
    'uses fields' => TRUE,
    'uses row class' => TRUE,
    'uses grouping' => FALSE,
    'uses options' => TRUE,
    'type' => 'normal',
  );

  return $plugins;
}
