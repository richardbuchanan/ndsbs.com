<?php
/**
 * @file
 * Process theme data.
 */

/**
 * Implements template_preprocess_html().
 */
function bootstrap_preprocess_html(&$variables) {
  // Remove sidebar classes.
  foreach ($variables['classes_array'] as $key => $class) {
    if (strpos($class, 'sidebar')) {
      unset($variables['classes_array'][$key]);
    }
  }

  // Setup viewport meta tag.
  $meta_viewport = array(
    '#type' => 'html_tag',
    '#tag' => 'meta',
    '#attributes' => array(
      'name' => 'viewport',
      'content' => 'width=device-width, initial-scale=1, maximum-scale=1',
    ),
    '#weight' => -100,
  );

  // Setup IE meta tag to force IE rendering mode.
  $meta_ie_render_engine = array(
    '#type' => 'html_tag',
    '#tag' => 'meta',
    '#attributes' => array(
      'http-equiv' => 'X-UA-Compatible',
      'content' => 'IE=edge',
    ),
  );

  // Add new header tags.
  drupal_add_html_head($meta_ie_render_engine, 'system_meta_ie_render_engine');

  // The Adminimal admin menu adds the viewport metatag, so check for the
  // Adminimal admin menu module first.
  if (!module_exists('adminimal_admin_menu') || user_is_anonymous()) {
    drupal_add_html_head($meta_viewport, 'system_meta_viewport');
  }
}

/**
 * Implements template_preprocess_page().
 */
function bootstrap_preprocess_page(&$variables) {
  $left_col = array('col-xs-12', 'col-sm-12', 'col-md-12');

  if (isset($variables['page']['sidebar']) && $variables['page']['sidebar']) {
    $left_col = array('col-xs-12', 'col-sm-8', 'col-md-8');
  }

  $breadcrumb_attr = array(
    'id' => 'breadcrumbs',
    'class' => array('col-xs-12', 'col-sm-12', 'col-md-12'),
  );

  $left_col_attr = array(
    'id' => 'left-content',
    'class' => $left_col,
    'role' => 'main',
  );

  $right_col_attr = array(
    'id' => 'right-content',
    'class' => array('col-xs-12', 'col-sm-4', 'col-md-3'),
    'role' => 'complementary',
  );

  $variables['breadcrumb_attributes_array'] = $breadcrumb_attr;
  $variables['breadcrumb_attributes'] = drupal_attributes($breadcrumb_attr);
  $variables['left_col_attributes'] = drupal_attributes($left_col_attr);
  $variables['right_col_attributes'] = drupal_attributes($right_col_attr);

  global $user;
  $path = current_path();

  if (user_is_anonymous()) {
    switch ($path) {
      case 'user':
      case 'user/login':
        drupal_set_title(t('Log in'));
        $variables['title'] = t('Log in');
        break;

      case 'user/register':
        drupal_set_title(t('Create new account'));
        $variables['title'] = t('Create new account');
        break;

      case 'user/password':
        drupal_set_title(t('Request new password'));
        $variables['title'] = t('Request new password');
        break;
    }
  }
  else {
    switch ($path) {
      case 'user':
      case 'user/' . $user->uid . '/edit':
        //drupal_set_title('My profile');
        break;

      case 'user/' . $user->uid . '/shortcuts':
        drupal_set_title('My shortcuts');
        break;

      case 'user/' . $user->uid . '/devel':
      case 'user/' . $user->uid . '/devel/load':
        drupal_set_title('User devel load');
        break;

      case 'user/' . $user->uid . '/devel/render':
        drupal_set_title('User devel render');
        break;
    }
  }
}

/**
 * Implements template_preprocess_block().
 */
function bootstrap_preprocess_block(&$variables) {
  switch ($variables['block_html_id']) {
    case 'block-system-main-menu':
      $content = str_replace('class="menu"', 'id="main-menu" class="nav navbar-nav"', $variables['content']);
      $variables['content'] = $content;
      break;

    case 'block-system-user-menu':
      $content = str_replace('class="menu"', 'id="user-menu" class="nav navbar-nav navbar-right"', $variables['content']);
      $variables['content'] = $content;
      break;
  }
}

/**
 * Implements hook_preprocess_button().
 */
function bootstrap_preprocess_button(&$variables) {
  $variables['element']['#attributes']['class'][] = 'btn';

  if (isset($variables['element']['#value'])) {
    $classes = array(
      // Specifics.
      t('Save and add') => 'btn-info',
      t('Add another item') => 'btn-info',
      t('Add effect') => 'btn-primary',
      t('Add and configure') => 'btn-primary',
      t('Update style') => 'btn-primary',
      t('Download feature') => 'btn-primary',
      t('Change set') => 'btn-primary',
      t('Send message') => 'btn-primary',
      t('E-mail new password') => 'btn-primary',
      t('Log in') => 'btn-primary',

      // Generals.
      t('Save') => 'btn-primary',
      t('Apply') => 'btn-primary',
      t('Create') => 'btn-primary',
      t('Confirm') => 'btn-primary',
      t('Submit') => 'btn-primary',
      t('Export') => 'btn-primary',
      t('Import') => 'btn-primary',
      t('Restore') => 'btn-primary',
      t('Rebuild') => 'btn-primary',
      t('Search') => 'btn-primary',
      t('Add') => 'btn-info',
      t('Update') => 'btn-info',
      t('Upload') => 'btn-primary',
      t('Preview') => 'btn-info',
      t('Delete') => 'btn-danger',
      t('Remove') => 'btn-danger',
    );

    foreach ($classes as $search => $class) {
      if (strpos($variables['element']['#value'], $search) !== FALSE) {
        $variables['element']['#attributes']['class'][] = $class;
        break;
      }
      else {
        $variables['element']['#attributes']['class'][] = 'btn-default';
        break;
      }
    }
  }
  else {
    $variables['element']['#attributes']['class'][] = 'btn-default';
  }
}

/**
 * Implements template_preprocess_HOOK().
 */
function bootstrap_preprocess_links(&$variables) {
  foreach ($variables['attributes']['class'] as $class) {
    if ($class == 'rules-operations-add') {
      foreach ($variables['links'] as $key => $link) {
        $glyph = '<span class="glyphicon glyphicon-plus"></span> ';
        $title = $glyph . $variables['links'][$key]['title'];
        $variables['links'][$key]['title'] = $title;
        $variables['links'][$key]['html'] = TRUE;
        $variables['links'][$key]['attributes']['class'][] = 'btn';
        $variables['links'][$key]['attributes']['class'][] = 'btn-default';
        $variables['links'][$key]['attributes']['class'][] = 'btn-sm';
      }
    }
  }
}

/**
 * Implements template_process_HOOK().
 */
function bootstrap_process_dashboard_region(&$variables) {
  $region = $variables['element']['#dashboard_region'];
  $variables['classes_array'][] = 'dashboard-region';

  switch ($region) {
    case 'dashboard_main':
      $variables['classes_array'][] = 'col-xs-12';
      $variables['classes_array'][] = 'col-md-9';
      break;

    case 'dashboard_sidebar':
      $variables['classes_array'][] = 'col-xs-12';
      $variables['classes_array'][] = 'col-md-3';
      break;
  }

  $variables['attributes_array']['id'] = str_replace('_', '-', $region);
  $variables['attributes_array']['class'] = $variables['classes_array'];
}

/**
 * Implements template_preprocess_table().
 */
function bootstrap_preprocess_table(&$variables) {
  // Prepare classes array if necessary.
  if (!isset($variables['attributes']['class'])) {
    $variables['attributes']['class'] = array();
  }
  // Convert classes to an array.
  elseif (isset($variables['attributes']['class']) && is_string($variables['attributes']['class'])) {
    $variables['attributes']['class'] = explode(' ', $variables['attributes']['class']);
  }

  $variables['attributes']['class'][] = 'table';
  $variables['attributes']['class'][] = 'table-striped';
  $variables['attributes']['class'][] = 'table-responsive';
}

/**
 * Implements hook_html_head_alter().
 */
function bootstrap_html_head_alter(&$head_elements) {
  $head_elements['system_meta_content_type']['#attributes'] = array(
    'charset' => 'utf-8',
  );
}

/**
 * Implements hook_css_alter().
 */
function bootstrap_css_alter(&$css) {
  // Since Bootstrap is a complete HTML5/CSS3 framework, we really do not need
  // the base styles Drupal ships with. This will recursively scan the modules
  // directory (but not site modules) for all .css files and unset them.
  $base = realpath('.');
  $path = $base . '/modules';
  $directory = new RecursiveDirectoryIterator($path, RecursiveDirectoryIterator::SKIP_DOTS);
  $iterator = new RecursiveIteratorIterator($directory, RecursiveIteratorIterator::LEAVES_ONLY);
  $extensions = array("css");

  foreach ($iterator as $fileinfo) {
    if (in_array($fileinfo->getExtension(), $extensions)) {
      $file = str_replace($base . '/', '', $fileinfo->getPathname());

      if (isset($css[$file])) {
        unset($css[$file]);
      }
    }
  }
}

/**
 * Implements hook_js_alter().
 */
function bootstrap_js_alter(&$javascript) {
  // Get path to the Bootstrap theme.
  $theme = drupal_get_path('theme', 'bootstrap');

  if (isset($javascript['misc/autocomplete.js'])) {
    // Replace Drupal core's autocomplete script with the theme's.
    $autocomplete = $theme . '/js/autocomplete.js';
    $javascript['misc/autocomplete.js']['data'] = $autocomplete;
  }

  if (isset($javascript['misc/jquery.ba-bbq.js'])) {
    // Replace Drupal core's ba-bbq script with the theme's.
    $ba_bbq = $theme . '/js/ba-bbq.js';
    $javascript['misc/jquery.ba-bbq.js']['data'] = $ba_bbq;
  }

  if (isset($javascript['misc/machine-name.js'])) {
    // Replace Drupal core's machine-name script with the theme's.
    $machine_name = $theme . '/js/machine-name.js';
    $javascript['misc/machine-name.js']['data'] = $machine_name;
  }

  if (isset($javascript['misc/progress.js'])) {
    // Replace Drupal core's progress script with the theme's.
    $progress = $theme . '/js/progress.js';
    $javascript['misc/progress.js']['data'] = $progress;
  }

  if (isset($javascript['misc/tabledrag.js'])) {
    // Replace Drupal core's tabledrag script with the theme's.
    $tabledrag = $theme . '/js/tabledrag.js';
    $javascript['misc/tabledrag.js']['data'] = $tabledrag;
  }

  if (isset($javascript['misc/vertical-tabs.js'])) {
    // Replace Drupal core's vertical tabs script with the theme's.
    $vertical_tabs = $theme . '/js/vertical-tabs.js';
    $javascript['misc/vertical-tabs.js']['data'] = $vertical_tabs;
  }

  if (isset($javascript['modules/block/block.js'])) {
    // Replace Drupal core's block script with the theme's.
    $block = $theme . '/js/block.js';
    $javascript['modules/block/block.js']['data'] = $block;
  }

  if (isset($javascript['modules/field_ui/field_ui.js'])) {
    // Replace Drupal core's field UI script with the theme's.
    $field_ui = $theme . '/js/field-ui.js';
    $javascript['modules/field_ui/field_ui.js']['data'] = $field_ui;
  }

  if (isset($javascript['modules/field/modules/text/text.js'])) {
    // Replace Drupal core's text script with theme's.
    $text = $theme . '/js/text.js';
    $javascript['modules/field/modules/text/text.js']['data'] = $text;
  }

  if (isset($javascript['modules/user/user.js'])) {
    // Replace Drupal core's user script with theme's.
    $user = $theme . '/js/user.js';
    $javascript['modules/user/user.js']['data'] = $user;
  }

  if (isset($javascript['profiles/commerce_kickstart/libraries/jquery_ui_spinner/ui.spinner.min.js'])) {
    // Replace Drupal Commerce spinner script with theme's.
    $spinner = $theme . '/js/ui.spinner.min.js';
    $javascript['profiles/commerce_kickstart/libraries/jquery_ui_spinner/ui.spinner.min.js']['data'] = $spinner;
  }

  $token = drupal_get_path('module', 'token') . '/token.js';
  if (isset($javascript[$token])) {
    // Replace Token's token script with theme's.
    $bs_token = $theme . '/js/token.js';
    $javascript[$token]['data'] = $bs_token;
  }
}

/**
 * Implements hook_form_FORM_ID_alter().
 */
function bootstrap_form_page_node_form_alter(&$form, &$form_state, $form_id) {
  $form['additional_settings']['#attached'] = array(
    'library' => array(
      array('system', 'ui.accordion'),
    ),
  );
}
