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

/**
 * Implements template_preprocess_html().
 */
function bootstrap_ndsbs_preprocess_html(&$variables) {
  date_default_timezone_set('America/New_York');
  if ($variables['user']) {
    foreach ($variables['user']->roles as $key => $role) {
      $role_class = 'role-' . str_replace(' ', '-', $role);
      $variables['classes_array'][] = $role_class;
    }
  }
  $node = node_load('1670');
  $front_page_title = $node->metatags['und']['title']['value'];

  if (drupal_is_front_page() && !empty($front_page_title)) {
    $variables['head_title'] = $front_page_title;
  }
}

/**
 * Implements template_preprocess_page().
 */
function bootstrap_ndsbs_preprocess_page(&$variables) {
  $path = current_path();
  $left_col = array('col-xs-12', 'col-sm-12', 'col-md-12');
  $right_col = array('col-xs-12', 'col-sm-12', 'col-md-4');
  $nav_col = array('col-xs-12', 'col-sm-12', 'col-md-3', 'sidebar-offcanvas');
  $maintenance_mode = variable_get('maintenance_mode', 0);

  if ($maintenance_mode) {
    $messages = drupal_get_messages();

    foreach ($messages as $type => $messages_array) {
      if ($type == 'status') {
        foreach ($messages_array as $key => $message) {
          if ($message == 'Operating in maintenance mode. <a href="/admin/config/development/maintenance">Go online.</a>') {
            unset($messages['status'][$key]);
          }
        }

        if (empty($messages['status'])) {
          unset($messages['status']);
        }
      }

      if (!empty($messages[$type])) {
        foreach ($messages[$type] as $message) {
          drupal_set_message($message, $type);
        }
      }
    }

    $maintenance_message = array();
    $maintenance_link = l(t('Maintenance mode'), '/admin/config/development/maintenance');
    $maintenance_message[] = t('The site is currently in maintenance mode. To put the site back online:');
    $maintenance_message[] = t('Go to ') . $maintenance_link . t(' and follow the instructions given.');

    if ($path != 'admin/config/development/maintenance') {
      foreach ($maintenance_message as $message) {
        drupal_set_message($message, 'status');
      }
    }
  }

  if ($path == 'contact') {
    $left_col = array('col-xs-12', 'col-sm-12', 'col-md-7');
    $right_col = array('col-xs-12', 'col-sm-12', 'col-md-5');
    unset($variables['page']['navigation_sidebar']);
  }

  if ($path != 'contact' && (!empty($variables['page']['sidebar']) || !empty($variables['page']['navigation_sidebar']))) {
    if ($variables['page']['sidebar'] && $variables['page']['navigation_sidebar']) {
      $left_col = array('col-xs-12', 'col-sm-12', 'col-md-5');
    }
    elseif ($variables['page']['sidebar'] && !$variables['page']['navigation_sidebar']) {
      $left_col = array('col-xs-12', 'col-sm-12', 'col-md-8');
    }
    else {
      $left_col = array('col-xs-12', 'col-sm-12', 'col-md-9');
    }
  }

  $left_col_attr = array(
    'id' => 'left-content',
    'class' => $left_col,
    'role' => 'main',
  );

  $right_col_attr = array(
    'id' => 'right-content',
    'class' => $right_col,
    'role' => 'complementary',
  );

  $nav_col_attr = array(
    'id' => 'navigation-content',
    'class' => $nav_col,
    'role' => 'complementary',
  );

  $variables['left_col_attributes'] = drupal_attributes($left_col_attr);
  $variables['right_col_attributes'] = drupal_attributes($right_col_attr);
  $variables['nav_col_attributes'] = drupal_attributes($nav_col_attr);

  switch ($path) {
    case 'contact':
      drupal_set_title('Contact us');
      break;
  }

  if ($variables['is_front']) {
    drupal_add_css(drupal_get_path('theme', 'bootstrap_ndsbs') . '/css/bootstrap-ndsbs.frontpage.css');
    $variables['page']['navigation_sidebar'] = array();
    $variables['page']['sidebar'] = array();

    $left_col_attr = array(
      'id' => 'left-content',
      'class' => array('col-xs-12', 'col-sm-12', 'col-md-12'),
      'role' => 'main',
    );

    $variables['left_col_attributes'] = drupal_attributes($left_col_attr);

    foreach ($variables['page']['content']['system_main']['nodes'] as $key => $node) {
      if (is_array($node['field_carousel'])) {
        $variables['page']['field_carousel'] = $node['field_carousel'];
      }
      if (is_array($node['field_welcome_image'])) {
        $variables['page']['field_welcome_image'] = $node['field_welcome_image'];
      }
      if (is_array($node['field_welcome_message'])) {
        $variables['page']['field_welcome_message'] = $node['field_welcome_message'];
      }
      if (is_array($node['field_our_team_image'])) {
        $variables['page']['field_our_team_image'] = $node['field_our_team_image'];
      }
      if (is_array($node['field_our_team_message'])) {
        $variables['page']['field_our_team_message'] = $node['field_our_team_message'];
      }
      if (is_array($node['field_our_services_image'])) {
        $variables['page']['field_our_services_image'] = $node['field_our_services_image'];
      }
      if (is_array($node['field_our_services_message'])) {
        $variables['page']['field_our_services_message'] = $node['field_our_services_message'];
      }
      if (is_array($node['field_better_business_bureau'])) {
        $variables['page']['field_better_business_bureau'] = $node['field_better_business_bureau'];
      }
      if (is_array($node['field_accepted_payments'])) {
        $variables['page']['field_accepted_payments'] = $node['field_accepted_payments'];
      }
      if (is_array($node['field_choose_us'])) {
        $variables['page']['field_choose_us'] = $node['field_choose_us'];
      }
    }
    $variables['page']['front_main_menu'] = menu_tree(variable_get('menu_main_links_source', 'main-menu'));

    $breadcrumb = array();
    $breadcrumb[] = l('New Directions Substance and Behavioral Services', '<front>');

    // Set Breadcrumbs
    drupal_set_breadcrumb($breadcrumb);
  }

  if ($path == 'user/payment/confirmation') {
    $misc_service = FALSE;

    $transactions = get_user_transactions(1);

    foreach ($transactions as $transaction) {
      if ($transaction->nid == '3965') {
        $misc_service = TRUE;
        break;
      }
    }

    $assessment_node = node_load($transactions[0]->nid);
    $assessment_user = user_load($transactions[0]->uid);
    $assessment_title = $assessment_node->title;
    $rush_cost = !(empty($_SESSION['ndsbs_payment']['rush_amount'])) ? $_SESSION['ndsbs_payment']['rush_amount'] : number_format(0, 2);

    $variables['payment']['order_id'] = $transactions[0]->order_id;
    $variables['payment']['user_email'] = $assessment_user->mail;
    $variables['payment']['assessment'] = $assessment_title;
    $variables['payment']['cost'] = $transactions[0]->cost;
    $variables['payment']['rush_cost'] = number_format($rush_cost, 2);
    $variables['payment']['total_cost'] = number_format($transactions[0]->cost + $rush_cost, 2);
    $variables['payment']['misc_service'] = $misc_service;
  }

  $variables['breadcrumb_attributes_array']['class'] = array('hidden');

  $variables['faq_videos'] = array();

  if (function_exists('faq_videos_embed_promoted')) {
    $variables['faq_videos']['#markup'] = faq_videos_embed_promoted();
  }

  $godaddy_seal = '<span id="siteseal"><script async type="text/javascript" src="https://seal.godaddy.com/getSeal?sealID=fPzyBVTYzEKessk4HA9jDt9ALuaThCsopCkEyyRc7mBTdwENhjRNDi"></script></span>';
  $mcafee_seal = '<script type="text/javascript" src="https://cdn.ywxi.net/js/1.js" async></script>';
  $variables['site_seals'] = $godaddy_seal . $mcafee_seal;
}

/**
 * Implements template_preprocess_block().
 */
function bootstrap_ndsbs_preprocess_block(&$variables) {
  switch ($variables['block_html_id']) {
    case 'block-system-main-menu':
      $assessments = str_replace('Assessments</a><ul id="main-menu"', 'Assessments</a><ul id="main-menu-assessments"', $variables['content']);
      $about = str_replace('About</a><ul id="main-menu"', 'About</a><ul id="main-menu-about"', $assessments);
      if (!drupal_is_front_page()) {
        $content = str_replace('class="nav navbar-nav"', 'class="nav navbar-nav nav-justified"', $about);
      }
      else {
        $content = $about;
      }
      $variables['content'] = $content;
      break;
  }
}

/**
 * Implements hook_preprocess_HOOK() for theme_breadcrumb().
 */
function bootstrap_ndsbs_preprocess_breadcrumb(&$variables) {
  $attributes_array = array(
    'id' => 'ndsbs-breadcrumbs',
    'class' => array(
      'breadcrumb',
    ),
    'vocab' => 'http://schema.org/',
    'typeof' => 'BreadcrumbList',
  );

  $list_item_attributes_array = array(
    'property' => 'itemListElement',
    'typeof' => 'ListItem',
  );

  $variables['attributes'] = drupal_attributes($attributes_array);
  $variables['list_item_attributes'] = drupal_attributes($list_item_attributes_array);

  foreach ($variables['breadcrumb'] as $key => $crumb) {
    $assessments = '<a href="/" title="">Assessments</a>';
    $rush = '<a href="/" title="">Rush order</a>';

    if ($crumb == $assessments || $crumb == $rush) {
      $crumb = '<a href="/view/assessment/status" title="">Assessments</a>';
    }

    $new_crumb = str_replace('<a href', '<a property="item" typeof="WebPage" href', $crumb);
    $new_crumb = str_replace('">', '"><span property="name">', $new_crumb);
    $new_crumb = str_replace('</a>', '</span></a>', $new_crumb);

    $variables['breadcrumb'][$key] = $new_crumb;

    if (preg_match('/briantdavis/', $new_crumb)) {
      unset($variables['breadcrumb'][$key]);
    }
  }

  // Add the current page to the breadcrumb for structured data.
  $title = '<span property="name">' . drupal_get_title() . '</span>';
  $options = array(
    'html' => TRUE,
    'attributes' => array(
      'property' => 'item',
      'typeof' => 'WebPage',
    ),
  );

  if (!drupal_is_front_page()) {
    $variables['breadcrumb'][] = l($title, drupal_get_path_alias(), $options);
  }
}

/**
 * Implements hook_preprocess_HOOK() for theme_link().
 */
function bootstrap_ndsbs_preprocess_link(&$variables) {
  $current_path = explode('/', current_path());
  $path = explode('/', $variables['path']);
  $questionnaire_path = $path[0] == 'user' && (isset($path[1]) && $path[1] == 'questionnaire');
  $questionnaire_page = $current_path[0] == 'user' && $current_path[1] == 'questionnaire';

  if ($questionnaire_path && $questionnaire_page) {
    foreach ($variables['options']['attributes']['class'] as $key => $class) {
      if ($class == 'active') {
        unset($variables['options']['attributes']['class'][$key]);
      }
    }
  }
}

/**
 * Implements template_preprocess_menu_tree().
 */
function bootstrap_ndsbs_preprocess_menu_tree(&$variables) {
  $tree = new DOMDocument();
  @$tree->loadHTML($variables['tree']);
  $links = $tree->getElementsByTagName('li');
  $parent = '';

  foreach ($links as $link) {
    $parent = $link->getAttribute('data-menu-parent');
    break;
  }

  $variables['menu_parent'] = $parent;
}

/**
 * Implements template_preprocess_node().
 */
function bootstrap_ndsbs_preprocess_node(&$variables) {
  global $user, $base_url;
  $path = drupal_get_path_alias(current_path());
  $node = $variables['node'];

  if ($variables['type'] == 'assessment') {
    $node_arg = arg(1);
    $service_tid = $variables['field_primary_service']['und'][0]['tid'];
    $link_path = drupal_lookup_path('alias', 'node/' . arg(1));

    if ($user->uid && $path != 'assessment/special/rush-order') {
      $variables['redirect_url'] = $base_url . '/user/cart/nid/' . $node_arg . '/tid/' . $service_tid;
    }
    elseif ($path == 'assessment/special/rush-order') {
      $variables['redirect_url'] = $base_url . '/user/cart/nid/' . $node_arg . '/tid/' . $service_tid;
    }
    else {
      $variables['redirect_url'] = $base_url . '/user/login?destination=' . $link_path;
    }
  }

  if ($node->type == 'blog') {
    $author = user_load($variables['uid']);
    $name = isset($author->field_first_name['und'][0]['value']) ? $author->field_first_name['und'][0]['value'] : '';
    $name .= isset($author->field_middle_name['und'][0]['value']) ? ' ' . $author->field_middle_name['und'][0]['value'] : '';
    $name .= isset($author->field_last_name['und'][0]['value']) ? ' ' . $author->field_last_name['und'][0]['value'] : '';
    $name .= isset($author->field_therapist_degree['und'][0]['value']) ? ' ' . $author->field_therapist_degree['und'][0]['value'] : '';

    $created = $variables['created'];
    $date = format_date($created, $type = 'blog_date');
    $variables['submitted'] = t('<span class="glyphicon glyphicon-calendar" aria-hidden="true"></span> !datetime by !username', array('!username' => $variables['name'], '!datetime' => $date));

    $variables['content']['links']['blog']['#links']['blog_usernames_blog']['title'] = $name . '\'s blog';
    $variables['content']['links']['blog']['#links']['blog_usernames_blog']['href'] = 'blog';

    if ($variables['teaser'] && !drupal_is_front_page()) {
      unset($variables['content']['links']['blog']);
    }
  }
  if ($variables['title'] == 'Rush order') {
    $variables['theme_hook_suggestions'][] = 'node__assessment__rush_order';
  }
  if ($variables['nid'] == '3965') {
    $variables['theme_hook_suggestions'][] = 'node__assessment__misc_services';
  }
  if ($variables['nid'] == '2622') {
    $variables['theme_hook_suggestions'][] = 'node__assessment__general_mental_health';
  }
}

/**
 * Implements template_preprocess_region().
 */
function bootstrap_ndsbs_preprocess_region(&$variables) {
  if (drupal_is_front_page() && $variables['region'] == 'header') {
    $variables['theme_hook_suggestions'][] = 'region__header__' . 'front_page';
  }
}

/**
 * Implements template_preprocess_views_view_fields().
 */
function bootstrap_ndsbs_preprocess_views_view_fields(&$variables) {
  $view = $variables['view']->name;

  if ($view == 'staff_profiles') {
  }
}

/**
 * Implements hook_preprocess_HOOK() for theme_payment().
 */
function bootstrap_ndsbs_preprocess_payment(&$variables) {
  drupal_add_js(drupal_get_path('theme', 'bootstrap_ndsbs') . '/js/payment.js');
}

/**
 * Implements template_preprocess_username().
 */
function bootstrap_ndsbs_preprocess_username(&$variables) {
  $type = isset($variables['account']->type) ? $variables['account']->type : '';

  if ($type == 'blog') {
    $author = user_load($variables['uid']);
    $name = isset($author->field_first_name['und'][0]['value']) ? $author->field_first_name['und'][0]['value'] : '';
    $name .= isset($author->field_middle_name['und'][0]['value']) ? ' ' . $author->field_middle_name['und'][0]['value'] : '';
    $name .= isset($author->field_last_name['und'][0]['value']) ? ' ' . $author->field_last_name['und'][0]['value'] : '';
    $name .= isset($author->field_therapist_degree['und'][0]['value']) ? ' ' . $author->field_therapist_degree['und'][0]['value'] : '';

    $variables['name'] = $name;
    $variables['name_raw'] = $name;
  }
}

/**
 * Implements hook_preprocess_HOOK() for theme_views_bootstrap_carousel_plugin_style().
 */
function bootstrap_ndsbs_preprocess_views_bootstrap_carousel_plugin_style(&$variables) {
  $name = $variables['view']->name;
  $display = $variables['view']->current_display;
  $professional_reviews = $name == 'professional_reviews';
  $professional_reviews_block = $professional_reviews && $display == 'block';

  if ($professional_reviews_block) {
    $variables['classes_array'][] = 'container';
  }
}

/**
 * Implements template_preprocess_views_view_list().
 */
function bootstrap_ndsbs_preprocess_views_view_list(&$variables) {
  $rows = $variables['rows'];

  foreach ($rows as $key => $row) {
    if (empty($row)) {
      $variables['title'] = '';
      unset($variables['rows'][$key]);
    }
  }
}
