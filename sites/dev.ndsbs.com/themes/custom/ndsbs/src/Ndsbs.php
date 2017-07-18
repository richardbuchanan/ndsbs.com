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

  private function getUserName() {
    global $user;
    $user = user_load($user->uid);
    $username = $user->name;

    $first_name = isset($user->field_first_name['und']) ? $user->field_first_name['und'][0]['value'] : FALSE;
    $last_name = isset($user->field_first_name['und']) ? $user->field_last_name['und'][0]['value'] : FALSE;
    if ($first_name && $last_name) {
      $username = "$first_name $last_name";
    }

    return $username;
  }

  public static function getTitle() {
    global $user;
    $uid = $user->uid;
    $username = self::getUserName();
    $title = drupal_get_title();

    switch (current_path()) {
      case "user/$uid":
      case "user/$uid/edit":
      case "user/$uid/devel":
      case "user/$uid/devel/token":
      case "user/$uid/devel/load-by-uuid":
      case "user/$uid/devel/render":
      case "user/$uid/track":
      case "user/$uid/track/navigation":
        $title = $username;
        break;

      case "user/$uid/contact":
        $title = "Contact $username";
        break;
    }

    return $title;
  }

}
