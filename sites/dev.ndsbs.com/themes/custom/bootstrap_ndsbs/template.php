<?php

/**
 * @file
 * Process theme data for bootstrap_ndsbs.
 */

<<<<<<< HEAD
include 'src/NDSBS.php';
use Drupal\ndsbs\NDSBS;
=======
/**
 * Implements hook_theme().
 */
function bootstrap_ndsbs_theme() {
  $items = array();

  // Previous developer loved templates. We simplified things by using this
  // to reset all templates to the theme's default page template.
  $page = array(
    'render element' => 'form',
    'path' => drupal_get_path('theme', 'bootstrap_ndsbs') . '/templates/system',
    'template' => 'page',
  );

  // Other forms that need to have the template variables changed.
  $items['assessment_node_form'] = array(
    'render element' => 'form',
    'path' => drupal_get_path('theme', 'bootstrap_ndsbs') . '/templates/node',
    'template' => 'node--assessment-form',
  );

  $items['page__about'] = $page;
  $items['page__faq'] = $page;
  $items['page__tnc'] = $page;
  $items['page__sitemap'] = $page;
  $items['page__courts'] = $page;
  $items['page__employers'] = $page;
  $items['page__our_services'] = $page;
  $items['page__professional_service'] = $page;
  $items['page__online_services'] = $page;
  $items['page__inperson_services'] = $page;
  $items['page__professional_staff'] = $page;
  $items['page__choose_new_directions'] = $page;
  $items['page__map'] = $page;
  $items['page__hippa'] = $page;
  $items['page__testimonial'] = $page;

  return $items;
}

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
 * Implements template_process_page().
 */
function bootstrap_ndsbs_process_page(&$variables) {
  $variables['breadcrumb_attributes'] = drupal_attributes($variables['breadcrumb_attributes_array']);
}
>>>>>>> a02849feafe4c0f6a9e9ccf0988273e3396708c8

/**
 * Load NDSBS's include files for theme processing.
 */
NDSBS::ndsbs_load_include('inc', 'bootstrap_ndsbs', 'preprocess', 'includes');
NDSBS::ndsbs_load_include('inc', 'bootstrap_ndsbs', 'process', 'includes');
NDSBS::ndsbs_load_include('inc', 'bootstrap_ndsbs', 'theme', 'includes');
NDSBS::ndsbs_load_include('inc', 'bootstrap_ndsbs', 'alter', 'includes');
