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

use Drupal\ndsbs\Ndsbs;
use Drupal\ndsbs\NdsbsBlock;

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

  $variables['head_title_array']['title'] = NDSBS::getTitle();
  $variables['head_title'] = implode(' | ', $variables['head_title_array']);

  $user_role_classes = NDSBS::getUserRoleClasses();

  foreach ($user_role_classes as $class) {
    $variables['classes_array'][] = $class;
  }
}

/**
 * Implements hook_preprocess_HOOK() for page.tpl.php.
 */
function ndsbs_preprocess_page(&$variables) {
  if (drupal_is_front_page()) {
    $variables['header_attributes_array']['uk-parallax'] = 'bgy: -200;';
  }

  $variables['navbar_attributes_array']['class'][] = 'uk-navbar-transparent';
  $variables['navbar_attributes_array']['class'][] = 'uk-container';
  $variables['navbar_attributes_array']['class'][] = 'ie9-gradient';
  $variables['navbar_attributes_array']['uk-navbar'] = 'mode: click; boundary: #page-header';

  $variables['highlighted_attributes_array'] = array(
    'id' => 'page-highlighted',
    'uk-parallax' => 'bgy: -200',
  );

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
    ),
    'phone' => array(
      '#markup' => $phone,
    ),
  );

  // Create a description variable for node pages.
  if (isset($variables['node'])) {
    $node = $variables['node'];
    $subtitle = isset($node->field_sub_title['und']) ? $node->field_sub_title['und'][0]['value'] : FALSE;

    if ($subtitle) {
      $variables['page_description'] = $subtitle;
    }
  }
  elseif (!isset($variables['page_description'])) {
    $variables['page_description'] = FALSE;
  }

  drupal_set_title(NDSBS::getTitle());
}

/**
 * Implements hook_preprocess_HOOK() for block.tlp.php.
 */
function ndsbs_preprocess_block(&$variables) {
  $delta = str_replace('-', '_', $variables['elements']['#block']->delta);
  $region = str_replace('-', '_', $variables['elements']['#block']->region);
  $classes = NdsbsBlock::getBlockClasses($region, $delta);
  $title = $variables['block']->subject;

  if ($classes) {
    foreach ($classes as $class) {
      $variables['classes_array'][] = $class;
    }
  }

  $variables['title_attributes_array']['class'][] = 'block-title';

  if ($region == 'header') {
    $variables['classes_array'][] = 'ie9-gradient';
  }

  if (!empty($title)) {
    $title = explode('&lt;br&gt;', $title);
    $title = implode(' <wbr>', $title);

    if ($region == 'header') {
      $title = str_replace('Trusted Court ', '<span class="highlight">Trusted Court </span>', $title);
      $title = str_replace('Assessment', '<span class="highlight">Assessment</span>', $title);
    }
  }

  $block_title = array(
    '#markup' => $title,
  );

  $variables['block_title'] = render($block_title);
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

/**
 * Implements hook_preprocess_HOOK() for theme_button().
 */
function ndsbs_preprocess_button(&$variables) {
  $value = $variables['element']['#value'];
  $variables['element']['#attributes']['class'] = array('uk-button');

  switch ($value) {
    case 'Create new account':
    case 'E-mail new password':
    case 'Log in':
    case 'Save':
    case 'Upload':
    $variables['element']['#attributes']['class'][] = 'uk-button-primary';
      break;

    case 'Cancel account':
      $variables['element']['#attributes']['class'][] = 'uk-button-danger';
      break;
  }
}

/**
 * Implements template_preprocess_fieldset().
 */
function ndsbs_preprocess_fieldset(&$variables) {
  $terms_of_use = isset($variables['element']['field_terms_of_use']);

  if ($terms_of_use) {
    $variables['theme_hook_suggestions'][] = 'fieldset__terms_of_use';
    $variables['terms'] = render($variables['element']['field_terms_of_use_register']);
    $variables['terms_agree'] = render($variables['element']['field_terms_of_use']);
  }
}

/**
 * Implements template_preprocess_image().
 */
function ndsbs_preprocess_image(&$variables) {
  $style = isset($variables['style_name']) ? $variables['style_name'] : FALSE;

  if ($style == 'staff_resize') {
    $variables['attributes']['uk-cover'] = '';
    $variables['theme_hook_suggestions'][] = 'image__staff_resize';
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
 * Implements hook_preprocess_HOOK() for theme_links().
 */
function ndsbs_preprocess_links(&$variables) {
  $node_links = isset($variables['theme_hook_suggestion']) && $variables['theme_hook_suggestion'] == 'links__node';

  if ($node_links && !empty($variables['links']) && current_path() == 'node') {
    $variables['links'] = array();
  }
}

/**
 * Implements hook_preprocess_HOOK() for node.tpl.php.
 */
function ndsbs_preprocess_node(&$variables) {
  $type = $variables['type'];
  $teaser = $variables['teaser'];
  $display_submitted = $variables['display_submitted'];

  $variables['theme_hook_suggestions'] = array(
    'node',
    'node__' . $type,
  );

  if ($teaser) {
    $variables['theme_hook_suggestions'][] = 'node__teaser';
    $variables['theme_hook_suggestions'][] = 'node__' . $type . '__teaser';
  }

  if ($display_submitted) {
    $variables['theme_hook_suggestions'][] = 'node__display_submitted';
    $variables['theme_hook_suggestions'][] = 'node__' . $type . '__display_submitted';

    if ($teaser) {
      $variables['theme_hook_suggestions'][] = 'node__teaser__display_submitted';
      $variables['theme_hook_suggestions'][] = 'node__' . $type . '__teaser__display_submitted';
    }
  }

  // Create the service amount variable.
  $service_amount = $variables['field_primary_service_amount'][0]['value'];
  $variables['service_amount'] = '<h3>$'. $service_amount . '</h3>';

  // Create the purchase link variable.
  $nid = $variables['nid'];
  $tid = $variables['field_primary_service']['und'][0]['tid'];
  $cart_url = "/user/cart/nid/$nid/tid/$tid";
  $cart_url_options = array('attributes' => array('class' => array('uk-button', 'uk-button-primary')));
  $variables['purchase_link'] = l(t('Purchase Now'), $cart_url, $cart_url_options);
}

/**
 * Implements template_preprocess_user_profile().
 */
function ndsbs_preprocess_user_profile(&$variables) {
  $variables['attributes_array']['id'] = 'user-profile';
  $variables['attributes_array']['class'] = array(
    'uk-section',
    'uk-section-muted',
  );

  $user_name = array();
  $user_name['first'] = $variables['user_profile']['field_first_name'][0]['#markup'];
  $user_name['last'] = $variables['user_profile']['field_last_name'][0]['#markup'];
  $variables['user_name'] = implode(' ', $user_name);

  $variables['user_email'] = $variables['elements']['#account']->mail;
  $variables['user_gender'] = $variables['user_profile']['field_gender'][0]['#markup'];

  $dob = array();
  $month = $variables['user_profile']['field_month'][0]['#markup'];
  $date = $variables['user_profile']['field_dobdate'][0]['#markup'];
  $dob['month_date'] = "$month $date";
  $dob['year'] = $variables['user_profile']['field_year'][0]['#markup'];
  $variables['user_dob'] = implode(', ', $dob);

  $variables['user_phone'] = $variables['user_profile']['field_phone'][0]['#markup'];

  $variables['user_street'] = $variables['user_profile']['field_address'][0]['#markup'];
  $address = array();
  $city = $variables['user_profile']['field_city'][0]['#markup'];
  $state = $variables['user_profile']['field_state'][0]['#markup'];
  $address['city_state'] = "$city, $state";
  $address['zip'] = $variables['user_profile']['field_zip'][0]['#markup'];
  $variables['user_address'] = implode(' ', $address);
}

/**
 * Implements template_process_views_view().
 */
function ndsbs_preprocess_views_view(&$variables) {
  $view_name = $variables['view']->name;
  $current_display = $variables['view']->current_display;

  if ($view_name == 'homepage_switcher' && $current_display == 'block') {

    switch (current_path()) {
      case 'node_two':
      case 'node_three':
        $variables['theme_hook_suggestions'][] = 'views_view__homepage_switcher__block__' . current_path();
        $variables['theme_hook_suggestion'] = 'views_view__homepage_switcher__block__' . current_path();
        break;
    }

    $result = $variables['view']->result;
    $items = array();

    foreach ($result as $index => $item) {
      $node = node_load($item->nid);
      $direct_link = isset($node->field_direct_link_to_assessment['und']);

      if ($direct_link) {
        $link_assessment = drupal_get_path_alias('node/' . $node->field_assessment_link['und'][0]['target_id']);
      }
      else {
        $link_assessment = FALSE;
      }

      $items[$index] = array(
        'title' => t($item->node_title),
        'content' => $item->field_body[0]['rendered']['#markup'],
        'direct_link' => $link_assessment,
      );
    }

    $variables['items'] = $items;
  }
}

/**
 * Implements template_preprocess_views_view_field().
 */
function ndsbs_preprocess_views_view_field(&$variables) {
  $view_name = $variables['view']->name;
  $current_display = $variables['view']->current_display;

  if ($view_name == 'faq_videos' && $current_display == 'frontpage_block') {
    $output = $variables['output'];
    preg_match("/<div>(.*?)<\/div>/", $output, $output_array);

    if ($output_array) {
      $search = $output_array[0];
      $video_id = explode('https://vimeo.com/', $output_array[1]);
      $replace = '<div class="uk-cover-container">';
      $replace .= '<iframe src="https://player.vimeo.com/video/' . $video_id[1] . '?title=0&byline=0&portrait=0" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
      $replace .= '</div>';
      $variables['output'] = str_replace($search, $replace, $output);
    }
  }
}
