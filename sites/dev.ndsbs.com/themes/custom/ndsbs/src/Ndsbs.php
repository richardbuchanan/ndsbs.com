<?php

namespace Drupal\ndsbs;

/**
 * Class Ndsbs.
 *
 * Provides helper functions for the NDSBS theme.
 *
 * @package Drupal\ndsbs
 */
class Ndsbs {

  public static function loadUIkitClass() {
    include_once drupal_get_path('theme', 'uikit') . '/src/UIkit.php';
  }
}
