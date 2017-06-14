<?php

/**
 * @file
 * The NDSBS theme system, which controls the output of the NDSBS theme.
 *
 * The theme system allows for nearly all output of the Drupal system to be
 * customized by Bootstrap NDSBS.
 */

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
 * Implements theme_field__FIELD__CONTENT_TYPE() for field__carousel__front_page.
 */
function bootstrap_ndsbs_field__field_carousel__front_page($variables) {
  // Add our animation libraries, since we did not load it on every page.
  $path = drupal_get_path('theme', 'bootstrap_ndsbs');
  drupal_add_css($path . '/css/bootstrap-ndsbs.animate.css');
  drupal_add_js($path . '/js/bootstrap-ndsbs.animate.js');

  // Build the carousel field following the 'Bootstrap' way.
  $output = '<div id="front-page-carousel" class="carousel slide carousel-fade">';
  $output .= '<ol class="carousel-indicators">';

  foreach ($variables['items'] as $delta => $item) {
    if ($delta == 0) {
      $output .= '<li data-target="#front-page-carousel" data-slide-to="' . $delta . '" class="active"></li>';
    }
    else {
      $output .= '<li data-target="#front-page-carousel" data-slide-to="' . $delta . '"></li>';
    }

    $item['links']['#links']['edit']['title'] = 'Edit carousel';
  }

  $output .= '</ol>';

  // Render the label, if it's not hidden.
  if (!$variables['label_hidden']) {
    $variables['title_attributes']['class'][] = 'field-label';
    $output .= '<div' . $variables['title_attributes'] . '>' . $variables['label'] . ':&nbsp;</div>';
  }

  // Render the items.
  $output .= '<div class="carousel-inner" role="listbox">';
  foreach ($variables['items'] as $delta => $item) {
    if ($delta == 0) {
      $output .= '<div class="item active" data-carousel-item="' . $delta . '">' . drupal_render($item) . '</div>';
    }
    else {
      $output .= '<div class="item" data-carousel-item="' . $delta . '">' . drupal_render($item) . '</div>';
    }
  }
  $output .= '</div></div>';

  return $output;
}

/**
 * Implements theme_field__FIELD__CONTENT_TYPE() for field_welcome_image__front_page.
 */
function bootstrap_ndsbs_field__field_welcome_image__front_page($variables) {
  $output = '';

  // Render the label, if it's not hidden.
  if (!$variables['label_hidden']) {
    $variables['title_attributes']['class'][] = 'field-label';
    $output .= '<div' . $variables['title_attributes'] . '>' . $variables['label'] . ':&nbsp;</div>';
  }

  // Render the items.
  $output .= '<div class="field-items"' . $variables['content_attributes'] . '>';
  foreach ($variables['items'] as $delta => $item) {
    $classes = 'field-item ' . ($delta % 2 ? 'odd' : 'even');
    $output .= '<div class="' . $classes . '" ' . $variables['item_attributes'][$delta] . '>' . drupal_render($item) . '</div>';
  }
  $output .= '</div>';

  // Render the top-level DIV.
  $variables['attributes']['class'] = $variables['classes'];
  $output = '<div' . $variables['attributes'] . '>' . $output . '</div>';

  return $output;
}

/**
 * Implements theme_field__FIELD__CONTENT_TYPE() for field_welcome_message__front_page.
 */
function bootstrap_ndsbs_field__field_welcome_message__front_page($variables) {
  $output = '';

  // Render the label, if it's not hidden.
  if (!$variables['label_hidden']) {
    $variables['title_attributes']['class'][] = 'field-label';
    $output .= '<div' . $variables['title_attributes'] . '>' . $variables['label'] . ':&nbsp;</div>';
  }

  // Render the items.
  $output .= '<div class="field-items"' . $variables['content_attributes'] . '>';
  foreach ($variables['items'] as $delta => $item) {
    $classes = 'field-item ' . ($delta % 2 ? 'odd' : 'even');
    $output .= '<div class="' . $classes . '" ' . $variables['item_attributes'][$delta] . '>' . drupal_render($item) . '</div>';
  }
  $output .= '</div>';

  // Render the top-level DIV.
  $output = '<div class="' . $variables['classes'] . '" ' . $variables['attributes'] . '>' . $output . '</div>';

  return $output;
}

/**
 * Implements theme_field_collection_view().
 */
function bootstrap_ndsbs_field_collection_view($variables) {
  $element = $variables['element'];
  foreach ($element['entity']['field_collection_item'] as $item) {
    if (isset($item['#bundle']) && $item['#bundle'] == 'field-carousel') {
      $element['links']['#links']['edit']['title'] = 'Edit carousel';
    }
  }
  return '<div' . drupal_attributes($element['#attributes']) . '>' . $element['#children'] . '</div>';
}

/**
 * Implements theme_menu_tree() for menu_client_navigation.
 */
function bootstrap_ndsbs_menu_tree__menu_client_navigation(&$variables) {
  if ($variables['menu_parent'] == 'client-navigation-menu') {
    return '<ul class="nav nav-client-dropdown">' . $variables['tree'] . '</ul>';
  }
  else {
    return '<ul class="nav nav-client-tree">' . $variables['tree'] . '</ul>';
  }
}

/**
 * Implements theme_menu_tree() for menu_staff_navigation.
 */
function bootstrap_ndsbs_menu_tree__menu_staff_navigation(&$variables) {
  if ($variables['menu_parent'] == 'staff-navigation-menu') {
    return '<ul class="nav nav-staff-dropdown">' . $variables['tree'] . '</ul>';
  }
  else {
    return '<ul class="nav nav-staff-tree">' . $variables['tree'] . '</ul>';
  }
}

/**
 * Implements theme_menu_tree() for user_menu.
 */
function bootstrap_ndsbs_menu_tree__user_menu(&$variables) {
  if ($variables['menu_parent'] == 'user-navigation-menu') {
    return '<ul class="nav nav-user-tree">' . $variables['tree'] . '</ul>';
  }
  else {
    if (drupal_is_front_page()) {
      return '<ul class="nav navbar-nav">' . $variables['tree'] . '</ul>';
    }
    else {
      return '<ul class="nav navbar-nav navbar-right">' . $variables['tree'] . '</ul>';
    }
  }
}

/**
 * Implements theme_messages_alter_status_messages().
 *
 * The messages_alter module was installed by previous developers, but since we
 * are using Bootstrap we need to make sure the theming of messages is
 * correct. This basically duplicates status-messages.tpl.php from the base
 * theme.
 */
function bootstrap_ndsbs_messages_alter_status_messages($variables) {
  $display = '';
  $output = '';

  if (isset($variables['display'])) {
    $display = $variables['display'];
  }

  $status_heading = array(
    'status' => t('Status message'),
    'error' => t('Error message'),
    'warning' => t('Warning message'),
  );

  foreach (drupal_get_messages($display) as $type => $messages) {
    switch ($type) {
      case 'status':
        $type = 'success';
        break;

      case 'info':
        $type = 'info';
        break;

      case 'warning':
        $type = 'warning';
        break;

      case 'error':
        $type = 'danger';
        break;

      default:
        $type = 'info';
        break;
    }

    $output .= "<div class=\"alert alert-$type alert-dismissible\" role=\"alert\">";
    $output .= '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';

    if (!empty($status_heading[$type])) {
      $output .= '<h2 class="sr-only">' . $status_heading[$type] . "</h2>\n";
    }

    if (count($messages) > 1) {
      $output .= " <ul>\n";

      foreach ($messages as $message) {
        $output .= '  <li>' . $message . "</li>\n";
      }

      $output .= " </ul>\n";
    }
    else {
      $output .= reset($messages);
    }

    $output .= "</div>\n";
  }

  return $output;
}

/**
 * Implements theme_token_tree().
 */
function bootstrap_ndsbs_token_tree($variables) {
  if (!empty($variables['dialog'])) {
    return theme_token_tree_link($variables);
  }

  $token_types = $variables['token_types'];
  $info = token_get_info();

  if ($token_types == 'all') {
    $token_types = array_keys($info['types']);
  }
  elseif ($variables['global_types']) {
    $token_types = array_merge($token_types, token_get_global_token_types());
  }

  $element = array(
    '#cache' => array(
      'cid' => 'tree-rendered:' . hash('sha256', serialize(array('token_types' => $token_types, 'global_types' => NULL) + $variables)),
      'bin' => 'cache_token',
    ),
  );
  if ($cached_output = token_render_cache_get($element)) {
    return $cached_output;
  }

  $options = array(
    'flat' => TRUE,
    'restricted' => $variables['show_restricted'],
    'depth' => $variables['recursion_limit'],
  );
  $multiple_token_types = (count($token_types) > 1);
  $rows = array();

  foreach ($info['types'] as $type => $type_info) {
    if (!in_array($type, $token_types)) {
      continue;
    }

    if ($multiple_token_types) {
      $row = _token_token_tree_format_row($type, $type_info, TRUE);
      unset($row['data']['value']);
      $rows[] = $row;
    }

    $tree = token_build_tree($type, $options);
    foreach ($tree as $token => $token_info) {
      if (!empty($token_info['restricted']) && empty($variables['show_restricted'])) {
        continue;
      }
      if ($multiple_token_types && !isset($token_info['parent'])) {
        $token_info['parent'] = $type;
      }
      $row = _token_token_tree_format_row($token, $token_info);
      unset($row['data']['value']);
      $rows[] = $row;
    }
  }

  $element += array(
    '#theme' => 'tree_table',
    '#header' => array(
      t('Name'),
      t('Token'),
      t('Description'),
    ),
    '#rows' => $rows,
    '#attributes' => array('class' => array('token-tree')),
    '#empty' => t('No tokens available'),
    '#attached' => array(
      'js' => array(drupal_get_path('module', 'token') . '/token.js'),
      'css' => array(drupal_get_path('module', 'token') . '/token.css'),
      'library' => array(array('token', 'treeTable')),
    ),
  );

  if ($variables['click_insert']) {
    $element['#caption'] = t("Click a token to insert it into the field you've last clicked.");
    $element['#attributes']['class'][] = 'token-click-insert';
  }

  $output = drupal_render($element);
  token_render_cache_set($output, $element);
  return $output;
}

/**
 * Implements theme_token_tree_link().
 */
function bootstrap_ndsbs_token_tree_link($variables) {
  if (empty($variables['text'])) {
    $variables['text'] = t('Browse available tokens.');
  }

  if (!empty($variables['dialog'])) {
    drupal_add_library('token', 'dialog');
    $variables['options']['attributes']['class'][] = 'token-dialog';
  }

  $info = token_theme();
  $tree_variables = array_intersect_key($variables, $info['token_tree']['variables']);
  $tree_variables = drupal_array_diff_assoc_recursive($tree_variables, $info['token_tree']['variables']);
  if (!isset($variables['options']['query']['options'])) {
    $variables['options']['query']['options'] = array();
  }
  $variables['options']['query']['options'] += $tree_variables;

  // We should never pass the dialog option to theme_token_tree(). It is only
  // used for this function.
  unset($variables['options']['query']['options']['dialog']);

  // Add a security token so that the tree page should only work when used
  // when the dialog link is output with theme('token_tree_link').
  $variables['options']['query']['token'] = drupal_get_token('token-tree:' . serialize($variables['options']['query']['options']));

  // Because PHP converts query strings with arrays into a different syntax on
  // the next request, the options have to be encoded with JSON in the query
  // string so that we can reliably decode it for token comparison.
  $variables['options']['query']['options'] = drupal_json_encode($variables['options']['query']['options']);

  // Set the token tree to open in a separate window.
  $variables['options']['attributes']['target'] = '_blank';

  return l($variables['text'], 'token/tree', $variables['options']);
}

/**
 * Implements theme_tree_table().
 */
function bootstrap_ndsbs_tree_table($variables) {
  foreach ($variables['rows'] as &$row) {
    $row += array('class' => array());
    if (!empty($row['parent'])) {
      $row['class'][] = 'child-of-' . $row['parent'];
      unset($row['parent']);
    }
  }

  if (!empty($variables['rows'])) {
    drupal_add_library('token', 'treeTable');
  }

  return theme('table', $variables);
}
