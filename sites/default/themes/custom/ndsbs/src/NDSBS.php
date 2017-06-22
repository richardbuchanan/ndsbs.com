<?php

namespace Drupal\ndsbs;

/**
 * Class NDSBS.
 *
 * Provides helper functions for the NDSBS theme.
 *
 * @package Drupal\ndsbs
 */
class NDSBS {

  public static function loadUIkitClass() {
    include_once drupal_get_path('theme', 'uikit') . '/src/UIkit.php';
  }
}
