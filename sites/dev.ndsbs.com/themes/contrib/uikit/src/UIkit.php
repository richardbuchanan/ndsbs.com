<?php

namespace Drupal\uikit;

/**
 * Provides helper functions for the UIkit base theme.
 */
class UIkit {

  /**
   * The UIkit library project page.
   *
   * @var string
   */
  const UIKIT_LIBRARY = 'https://getuikit.com/';

  /**
   * The UIkit library version supported in the UIkit base theme.
   *
   * @var string
   */
  const UIKIT_LIBRARY_VERSION = '3.0.0-beta.30';

  /**
   * The Drupal project page for the UIkit base theme.
   *
   * @var string
   */
  const UIKIT_PROJECT = 'https://www.drupal.org/project/uikit';

  /**
   * The Drupal project branch for the UIkit base theme.
   *
   * @var string
   */
  const UIKIT_PROJECT_BRANCH = '7.x-3.x';

  /**
   * The Drupal project API site for the UIkit base theme.
   *
   * @var string
   */
  const UIKIT_PROJECT_API = 'http://uikit-drupal.com/api/uikit/7.x-3.x';

  /**
   * The jQuery library version UIkit supports.
   *
   * @var string
   */
  const UIKIT_JQUERY_VERSION = '2.1.4';

  /**
   * The jQuery Migrate library version UIkit supports.
   *
   * @var string
   */
  const UIKIT_JQUERY_MIGRATE_VERSION = '1.4.1';

  /**
   * Checks whether the given path is the current path.
   *
   * @param string $path
   *   The path to check against the current path.
   *
   * @return bool
   *   Returns true if the given path is the current path, false if otherwise.
   */
  public static function getActivePath($path) {
    $active_path = FALSE;

    // Checks if the path is the current page.
    $current_page = $path == $_GET['q'];

    // Checks if the path and current page are the front page.
    $front_page = $path == '<front>' && drupal_is_front_page();

    // Checks if the path and current page are both a user page.
    $exploded_path = explode('/', $_GET['q']);
    $user_page = is_array($exploded_path) && $exploded_path[0] == 'user' && $exploded_path[0] == $path;

    // Change $active_path to true if the given path is the current path.
    if ($current_page || $front_page || $user_page) {
      $active_path = TRUE;
    }

    return $active_path;
  }

  /**
   * Retrieves the active theme.
   *
   * @return
   *   The active theme's machine name.
   */
  public static function getActiveTheme() {
    global $theme;
    return $theme;
  }

  /**
   * Retrieves UIkit, jQuery, jQuery Migrate and Font Awesome CDN assets.
   */
  public static function getCdnAssets() {
    // Add the UIkit stylesheet.
    drupal_add_css('//cdnjs.cloudflare.com/ajax/libs/uikit/' . self::UIKIT_LIBRARY_VERSION . '/css/uikit.min.css', array(
      'type' => 'external',
      'group' => CSS_THEME,
      'every_page' => TRUE,
      'weight' => -100,
      'version' => self::UIKIT_LIBRARY_VERSION,
    ));

    // Add the jQuery script.
    drupal_add_js('//cdnjs.cloudflare.com/ajax/libs/jquery/' . self::UIKIT_JQUERY_VERSION . '/jquery.min.js', array(
      'type' => 'external',
      'group' => JS_THEME,
      'every_page' => TRUE,
      'weight' => -20,
      'version' => self::UIKIT_JQUERY_VERSION,
    ));

    // Add the jQuery Migrate script so we can use multiple jQuery versions
    // simultaneously.
    drupal_add_js('//cdnjs.cloudflare.com/ajax/libs/jquery-migrate/' . self::UIKIT_JQUERY_MIGRATE_VERSION . '/jquery-migrate.min.js', array(
      'type' => 'external',
      'group' => JS_THEME,
      'every_page' => TRUE,
      'weight' => -20,
      'version' => self::UIKIT_JQUERY_MIGRATE_VERSION,
    ));

    // Add the UIkit script.
    drupal_add_js('//cdnjs.cloudflare.com/ajax/libs/uikit/' . self::UIKIT_LIBRARY_VERSION . '/js/uikit.min.js', array(
      'type' => 'external',
      'group' => JS_THEME,
      'every_page' => TRUE,
      'weight' => -20,
      'version' => self::UIKIT_LIBRARY_VERSION,
    ));

    // Add the UIkit icons script.
    drupal_add_js('//cdnjs.cloudflare.com/ajax/libs/uikit/' . UIkit::UIKIT_LIBRARY_VERSION . '/js/uikit-icons.min.js', array(
      'type' => 'external',
      'group' => JS_THEME,
      'every_page' => TRUE,
      'weight' => -20,
      'version' => self::UIKIT_LIBRARY_VERSION,
    ));
  }

  /**
   * Retrieves a theme setting.
   *
   * @param null $setting
   *   The machine-name of the theme setting to retrieve.
   * @param $theme
   *   The theme to retrieve the setting for. Defaults to the active theme.
   *
   * @return mixed
   *   The theme setting's value.
   */
  public static function getThemeSetting($setting, $theme = NULL) {
    if (empty($theme)) {
      $theme = self::getActiveTheme();
    }

    if (!empty($setting)) {
      return theme_get_setting($setting, $theme);
    }
    else {
      throw new \LogicException('Missing argument $setting');
    }
  }

  /**
   * Retrieves the current page title.
   *
   * @return string
   *   The current page title.
   */
  public static function getPageTitle() {
    return drupal_get_title();
  }
}
