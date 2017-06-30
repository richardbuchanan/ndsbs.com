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

use Drupal\ndsbs\NdsbsBlock;

/**
 * Implements hook_preprocess_HOOK() for page.tpl.php.
 */
function ndsbs_preprocess_page(&$variables) {
  $variables['navbar_attributes_array']['class'][] = 'uk-navbar-transparent';
  $variables['navbar_attributes_array']['class'][] = 'uk-container';

  $variables['faq_videos'] = array();

  if (function_exists('faq_videos_embed_promoted')) {
    $variables['faq_videos']['#markup'] = faq_videos_embed_promoted();
  }

  // Create a more compact user menu.
  $variables['navbar_secondary_compact'] = FALSE;
  if ($variables['secondary_menu']) {
    // Secondary navbar compact user menu.
    $navbar_secondary_compact = menu_tree(variable_get('menu_secondary_links_source', 'user-menu'));
    $navbar_secondary_compact['#theme_wrappers'] = array('menu_tree__navbar__user_compact');

    foreach ($navbar_secondary_compact as $index => $item) {
      if (is_array($item) && isset($item['#theme'])) {
        $navbar_secondary_compact[$index]['#title'] = '<span uk-icon="icon: user"></span>';
        $navbar_secondary_compact[$index]['#localized_options']['html'] = TRUE;
      }
    }
    $variables['navbar_secondary_compact'] = $navbar_secondary_compact;
  }

  // Add a variable for markup of NDSBS phone number.
  $phone = '<span>' . SA_ADMIN_PHONE . '</span>';
  $variables['company_info'] = array(
    '#type' => 'container',
    '#attributes' => array('class' => array('company-info-container')),
  );
  $variables['company_info']['phone'] = array(
    '#markup' => $phone,
  );
}

function ndsbs_preprocess_link(&$variables) {
  if ($variables['text'] == '<span uk-icon=" user"></span>') {
    $variables['text'] = '<span uk-icon="icon: user; ratio: 2"></span>';
  }
}

/**
 * Implements hook_preprocess_HOOK() for block.tlp.php.
 */
function ndsbs_preprocess_block(&$variables) {
  $delta = str_replace('-', '_', $variables['elements']['#block']->delta);
  $region = str_replace('-', '_', $variables['elements']['#block']->region);
  $classes = NdsbsBlock::getBlockClasses($region, $delta);

  if ($classes) {
    foreach ($classes as $class) {
      $variables['classes_array'][] = $class;
    }
  }

  $variables['title_attributes_array']['class'][] = 'block-title';
}

/**
 * Implements hook_preprocess_HOOK() for region.tpl.php.
 */
function ndsbs_preprocess_region(&$variables) {
  switch ($variables['region']) {
    case 'footer':
      $variables['attributes_array']['uk-grid'] = '';
  }
}
