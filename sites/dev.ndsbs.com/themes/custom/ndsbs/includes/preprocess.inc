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
use Drupal\ndsbs\NdsbsNode;

/**
 * Implements hook_preprocess_HOOK() for html.tpl.php.
 */
function ndsbs_preprocess_html(&$variables) {
  drupal_add_css(path_to_theme() . '/css/ndsbs.ie-fix.css', array(
    'weight' => CSS_THEME,
    'browsers' => array(
      'IE' => 'gte IE 9',
      '!IE' => FALSE,
    ),
    'preprocess' => FALSE,
  ));
  //drupal_add_css('//fonts.googleapis.com/css?family=Raleway:300,300i,400,400i,500,500i,600,600i,700,700i', array('type' => 'external'));
  //drupal_add_css('//fonts.googleapis.com/css?family=Ubuntu:300,300i,400,400i,500,500i,700,700i', array('type' => 'external'));
}

/**
 * Implements hook_preprocess_HOOK() for page.tpl.php.
 */
function ndsbs_preprocess_page(&$variables) {
  $variables['header_attributes_array']['uk-parallax'] = 'bgy: -200;';
  $variables['navbar_attributes_array']['class'][] = 'uk-navbar-transparent';
  $variables['navbar_attributes_array']['class'][] = 'uk-container';
  $variables['navbar_attributes_array']['class'][] = 'ie9-gradient';
  $variables['navbar_attributes_array']['uk-navbar'] = 'mode: click';

  $variables['highlighted_attributes_array'] = array(
    'id' => 'page-highlighted',
    'uk-parallax' => 'bgy: -200',
  );

  $variables['faq_videos'] = array();

  if (function_exists('faq_videos_embed_promoted')) {
    $variables['faq_videos']['#markup'] = faq_videos_embed_promoted();
  }

  if (drupal_is_front_page()) {
    unset($variables['page']['content']['system_main']['default_message']);
  }

  if ($variables['main_menu']) {
    $variables['navbar_primary']['#theme_wrappers'] = array('menu_tree__navbar__primary');
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
    '#attributes' => array(
      'id' => 'company-info-container',
      'class' => array('uk-visible@l'),
    ),
    'phone' => array(
      '#markup' => $phone,
    ),
  );
  $variables['company_info_small'] = array(
    '#type' => 'container',
    '#attributes' => array(
      'id' => 'company-info-container--small',
      'class' => array('uk-hidden@l'),
    ),
    'phone' => array(
      '#markup' => $phone,
    ),
  );

  // Create a description variable for node pages.
  $variables['page_description'];

  if (isset($variables['node'])) {
    $node = $variables['node'];
    $meta_tags = NdsbsNode::getMetaTags($node);

    if ($meta_tags && $meta_tags['title']) {
      $variables['page_description'] = $meta_tags['title'];
    }
  }
}

/**
 * Implements hook_preprocess_HOOK() for block.tlp.php.
 */
function ndsbs_preprocess_block(&$variables) {
  $delta = str_replace('-', '_', $variables['elements']['#block']->delta);
  $region = str_replace('-', '_', $variables['elements']['#block']->region);
  $classes = NdsbsBlock::getBlockClasses($region, $delta);
  $title = $variables['block']->subject;

  if (!empty($title)) {
    $title = explode('&lt;br&gt;', $title);
    $title = implode('<br>', $title);
  }

  $block_title = array(
    '#markup' => $title,
  );

  $variables['block_title'] = render($block_title);

  if ($classes) {
    foreach ($classes as $class) {
      $variables['classes_array'][] = $class;
    }
  }

  $variables['title_attributes_array']['class'][] = 'block-title';

  if ($region == 'header') {
    $variables['classes_array'][] = 'ie9-gradient';
  }
}

/**
 * Implements template_preprocess_link().
 */
function ndsbs_preprocess_link(&$variables) {
  // @todo Research why Drupal strips "icon:" from the uk-icon attribute.
  if ($variables['text'] == '<span uk-icon=" user"></span>') {
    $variables['text'] = '<span uk-icon="icon: user; ratio: 2"></span>';
  }
}

/**
 * Implements hook_preprocess_HOOK() for region.tpl.php.
 */
function ndsbs_preprocess_region(&$variables) {
  switch ($variables['region']) {
    case 'header':
      $variables['attributes_array']['class'][] = 'uk-width-1-1';
      $variables['attributes_array']['class'][] = 'uk-position-relative';
      break;

    case 'footer':
      $variables['attributes_array']['uk-grid'] = '';
      break;
  }
}
