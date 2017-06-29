<?php

/**
 * @file
 * Set up variables to be placed within the template (.tpl.php) files.
 *
 * The variables set up here apply to both templates (.tpl.php) files and
 * functions (theme_HOOK). These are also used for providing
 * @link https://www.drupal.org/node/223440 template suggestions @endlink.
 *
 * @see process.inc
 */

use Drupal\ndsbs\NDSBS;
use Drupal\uikit\UIkit;

/**
 * Implements template_preprocess().
 */
function ndsbs_preprocess(&$variables) {
  drupal_add_js('//cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js', array(
    'type' => 'external',
    'group' => JS_THEME,
    'every_page' => TRUE,
    'weight' => -10,
    'version' => '1.4.1',
  ));
}

/**
 * Implements template_preprocess_page().
 */
function ndsbs_preprocess_page(&$variables) {
  $variables['navbar_attributes_array']['class'][] = 'uk-navbar-transparent';
  $variables['navbar_attributes_array']['class'][] = 'uk-container';

  $variables['faq_videos'] = array();

  if (function_exists('faq_videos_embed_promoted')) {
    $variables['faq_videos']['#markup'] = faq_videos_embed_promoted();
  }

  $godaddy_seal = '<span id="siteseal"><script async type="text/javascript" src="https://seal.godaddy.com/getSeal?sealID=fPzyBVTYzEKessk4HA9jDt9ALuaThCsopCkEyyRc7mBTdwENhjRNDi"></script></span>';
  $mcafee_seal = '<script type="text/javascript" src="https://cdn.ywxi.net/js/1.js" async></script>';
  $variables['site_seals'] = $godaddy_seal . $mcafee_seal;
}
