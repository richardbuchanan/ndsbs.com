<?php

namespace Drupal\ndsbs;

/**
 * Class NdsbsBlocks.
 *
 * Provides helper functions for blocks in the NDSBS theme.
 *
 * @package Drupal\ndsbs
 */

class NdsbsBlock {

  /**
   * Provides classes to assign to a block.
   *
   * @param string $region
   *   The region assigned to the block.
   * @param string $delta
   *   The delta assigned to the block.
   *
   * @return array
   *   Returns an array of classes for the block.
   */
  public static function getBlockClasses($region, $delta) {
    $classes = array();

    switch ($region) {
      case 'footer':
        $classes = self::getFooterClasses($delta);
        break;

      case 'header':
        $classes[] = 'uk-width-1-1';
        $classes[] = 'uk-width-1-1@m';
        $classes[] = 'uk-width-4-5@l';
        break;
    }

    return $classes;
  }

  /**
   * Provides classes assigned to blocks in the footer region.
   *
   * @param $delta
   * @param string $delta
   *   The delta assigned to the block.
   *
   * @return array
   *   Returns an array of classes for footer blocks.
   */
  private function getFooterClasses($delta) {
    $classes = array();

    switch ($delta) {
      case 'ndsbs_main_menu':
        $classes[] = 'uk-width-1-1';
        $classes[] = 'uk-width-2-3@m';
        break;

      case 'ndsbs_copyright':
        $classes[] = 'uk-width-1-1';
        $classes[] = 'uk-width-1-3@m';
        break;

      case 'ndsbs_site_seals':
        $classes[] = 'uk-width-1-1';
        break;
    }

    return $classes;
  }
}