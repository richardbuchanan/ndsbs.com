<?php

namespace Drupal\ndsbs;

/**
 * Class NdsbsNode.
 *
 * Provides helper node functions for the NDSBS theme.
 *
 * @package Drupal\ndsbs
 */
class NdsbsNode {

  public static function getMetaTags($node) {
    $meta_tags = array();

    foreach ($node->metatags as $metatag) {
      if ($metatag['title']['value']) {
        $meta_tags['title'] = $metatag['title']['value'];
      }
      if ($metatag['description']['value']) {
        $meta_tags['description'] = $metatag['description']['value'];
      }
    }

    return $meta_tags;
  }
}
