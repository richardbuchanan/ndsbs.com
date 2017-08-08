<?php

namespace Drupal\uikit_components;

/**
 * Provides helper functions for the UIkit Components module.
 */
class UIkitComponents {

  /**
   * Determines whether the admin theme is a UIkit sub-theme.
   *
   * @return bool
   *   Returns TRUE if the admin theme is a UIkit sub-theme, otherwise returns
   *   FALSE.
   */
  private function isAdminThemeUIkitSubtheme() {
    $admin_theme = variable_get('admin_theme','none');
    $admin_theme_info_file = drupal_get_path('theme', $admin_theme) . "/$admin_theme.info";
    $admin_theme_info = drupal_parse_info_file($admin_theme_info_file);

    if (isset($admin_theme_info['base theme']) && $admin_theme_info['base theme'] == 'uikit') {
      return TRUE;
    }
    else {
      return FALSE;
    }
  }
}
