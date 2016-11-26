<?php
/**
 * @file
 * Process NDSBS's theme data.
 *
 * @see https://www.drupal.org/node/223430
 */

/**
 * Implements template_preprocess_html().
 */
function ndsbs_preprocess_html(&$variables) {
  global $user;

  if (arg(0) == 'node' && arg(1) == '941' && arg(2) != 'edit') {
    drupal_set_title('Counseling Session');
  }

  // Add body class based on user role.
  if (bdg_ndsbs_staff()) {
    $variables['classes_array'][] = 'ndsbs-staff';
  }
  if (bdg_ndsbs_roles_super_admin()) {
    $variables['classes_array'][] = 'ndsbs-super-admin';
  }
  if (bdg_ndsbs_roles_developer()) {
    $variables['classes_array'][] = 'ndsbs-developer';
  }
  if (bdg_ndsbs_roles_staff_admin()) {
    $variables['classes_array'][] = 'ndsbs-staff-admin';
  }
  if (bdg_ndsbs_roles_therapist()) {
    $variables['classes_array'][] = 'ndsbs-therapist';
  }

  // Gets the node object for the page, if present.
  $node = menu_get_object();
  if (isset($node->type)) {
    // If a testimonial, set the title correctly.
    $testimonials = $node->type == 'testimonials';
    if ($testimonials) {
      drupal_set_title('Testimonial');
      $variables['head_title'] = 'Testimonial | NDSBS.com';
    }
  }
}

/**
 * Implements template_preprocess_page().
 */
function ndsbs_preprocess_page(&$variables, $hook) {
  global $base_url, $user;

  // Create theme hook suggestions based on node ID, excluding node edit pages.
  if (arg(0) == 'node' && arg(2) != 'edit') {
    switch (arg(1)) {
      case '158':
        $variables['theme_hook_suggestions'][] = 'page__about';
        break;
      case '159':
        $variables['theme_hook_suggestions'][] = 'page__faq';
        break;
      case '161':
        $variables['theme_hook_suggestions'][] = 'page__staff';
        break;
      case '162':
        $variables['theme_hook_suggestions'][] = 'page__tnc';
        break;
      case '163':
        $variables['theme_hook_suggestions'][] = 'page__sitemap';
        break;
      case '164':
        $variables['theme_hook_suggestions'][] = 'page__contact';
        break;
      case '165':
        $variables['theme_hook_suggestions'][] = 'page__courts';
        break;
      case '166':
        $variables['theme_hook_suggestions'][] = 'page__employers';
        break;
      case '275':
        $variables['theme_hook_suggestions'][] = 'page__our_services';
        break;
      case '276':
        $variables['theme_hook_suggestions'][] = 'page__inperson_services';
        break;
      case '277':
        $variables['theme_hook_suggestions'][] = 'page__professional_staff';
        break;
      case '278':
        $variables['theme_hook_suggestions'][] = 'page__online_services';
        break;
      case '279':
        $variables['theme_hook_suggestions'][] = 'page__professional_service';
        break;
      case '280':
        $variables['theme_hook_suggestions'][] = 'page__choose_new_directions';
        break;
      case '281':
        $variables['theme_hook_suggestions'][] = 'page__map';
        break;
      case '352':
        $variables['theme_hook_suggestions'][] = 'page__hippa';
        break;
      case '372':
        $variables['theme_hook_suggestions'][] = 'page__testimonial';
        break;
    }
  }

  // Create theme hook suggestions for nodes, excluding node edit/delete/etc pages.
  $arg = arg(2);
  if (!empty($variables['node']) && !empty($variables['node']->type) && empty($arg)) {
    $variables['theme_hook_suggestions'][] = 'page__' . $variables['node']->type;
  }

  $main_menu_tree = menu_tree_all_data('main-menu');
  $variables['main_menu_expanded'] = menu_tree_output($main_menu_tree);

  if (drupal_is_front_page()) {
    $variables['schema_url'] = 'https://www.ndsbs.com';
  }
  else {
    $variables['schema_url'] = url(drupal_get_path_alias(current_path()), array('absolute' => TRUE));
  }

  if (isset($variables['node']->type) && $variables['node']->type == 'assessment') {
    $variables['node_title'] = $variables['node']->field_assessment_title['und'][0]['value'];
    $variables['node']->title = $variables['node']->metatags['und']['title']['value'];
    $node_arg = arg(1);

    // Load the assessment information.
    $assessment_node = get_assessment_information(arg(1));

    // Put the assessment information into an array.
    foreach ($assessment_node as $data) {
      $variables['nid_array'][] = $data->nid;
    }

    // Now load those into a new array.
    $result_node = node_load_multiple($variables['nid_array']);

    // Create a new array so we can use the data later.
    $result = array();

    foreach ($result_node as $node_data) {
      $result = $node_data;
    }

    // Build a URL with a destination to use when not logged in.
    $variables['link_path'] = drupal_lookup_path('alias', 'node/' . arg(1));

    // Assign the sections to variables.
    if (isset($result->field_asmentinfo_section_one['und'][0]['value'])) {
      $variables['section_one'] = $result->field_asmentinfo_section_one['und'][0]['value'];
    }
    if (isset($result->field_asmentinfo_section_two['und'][0]['value'])) {
      $variables['section_two'] = $result->field_asmentinfo_section_two['und'][0]['value'];
    }
    if (isset($result->field_asmentinfo_section_three['und'][0]['value'])) {
      $variables['section_three'] = $result->field_asmentinfo_section_three['und'][0]['value'];
    }
    if (isset($result->field_asmentinfo_section_four['und'][0]['value'])) {
      $variables['section_four'] = $result->field_asmentinfo_section_four['und'][0]['value'];
    }

    // Right image for assessment pages.
    if (isset($result->field_assessment_right_image['und'][0]['uri'])) {
      $variables['right_image'] = image_style_url('page_images', $result->field_assessment_right_image['und'][0]['uri']);
    }

    $variables['primary_service_amount'] = get_service_amount($result->field_primary_service['und'][0]['tid']);
    $variables['service_description'] = $result->field_service_description['und'][0]['value'];

    if ($user->uid) {
      $variables['redirect_url'] = $base_url . '/user/cart/nid/' . $node_arg . '/tid/' . $result->field_primary_service['und'][0]['tid'];
    }
    else {
      $variables['redirect_url'] = $base_url . '/user/login?destination=' . $variables['link_path'];
    }
  }

  $get_browser = browscap_get_browser();
  $mobile = $get_browser['ismobiledevice'] == 'true' ? 1 : 0;
  $tablet = $get_browser['istablet'] == 'true' ? 1 : 0;
  $device_pointing_method = strtolower(str_replace(' ', '-', $get_browser['device_pointing_method']));

  if (($mobile || $tablet) && $device_pointing_method == 'touchscreen') {
    $variables['touchscreen'] = TRUE;
  }
}

function ndsbs_js_alter(&$javascript) {
  // Load jQuery from authenticated source.
  $jQuery = 'https://code.jquery.com/jquery-1.5.2.js';
  if (isset($javascript['http://code.jquery.com/jquery-1.5.2.js'])) {
    $javascript['http://code.jquery.com/jquery-1.5.2.js']['data'] = $jQuery;
  }
}

/**
 * Implements theme_textfield().
 */
function ndsbs_textfield($variables) {
  $element = $variables['element'];
  $element['#attributes']['type'] = 'text';
  element_set_attributes($element, array('id', 'name', 'value', 'size', 'maxlength'));
  _form_set_class($element, array('form-text'));

  $extra = '';
  if ($element['#autocomplete_path'] && drupal_valid_path($element['#autocomplete_path'])) {
    drupal_add_library('system', 'drupal.autocomplete');
    $element['#attributes']['class'][] = 'form-autocomplete';

    $attributes = array();
    $attributes['type'] = 'hidden';
    $attributes['id'] = $element['#attributes']['id'] . '-autocomplete';
    $attributes['value'] = url($element['#autocomplete_path'], array('absolute' => TRUE));
    $attributes['disabled'] = 'disabled';
    $attributes['class'][] = 'autocomplete';
    $extra = '<input' . drupal_attributes($attributes) . ' />';
  }
  if (isset($element['#field_name']) && $element['#field_name'] === 'field_testimonial_user_name') {
    $element['#attributes']['size'] = '20';
  }

  $output = '<input' . drupal_attributes($element['#attributes']) . ' />';

  return $output . $extra;
}

/**
 * Implements theme_textarea().
 */
function ndsbs_textarea($variables) {
  $element = $variables['element'];
  element_set_attributes($element, array('id', 'name', 'cols', 'rows'));
  _form_set_class($element, array('form-textarea'));

  $wrapper_attributes = array(
    'class' => array('form-textarea-wrapper'),
  );

  // Add resizable behavior.
  if (!empty($element['#resizable'])) {
    drupal_add_library('system', 'drupal.textarea');
    $wrapper_attributes['class'][] = 'resizable';
  }

  $output = '<div' . drupal_attributes($wrapper_attributes) . '>';
  $output .= '<textarea' . drupal_attributes($element['#attributes']) . '>' . check_plain($element['#value']) . '</textarea>';
  $output .= '</div>';
  return $output;
}

function ndsbs_menu_tree($variables) {
  return '<ul class="menu">' . $variables ['tree'] . '</ul>';
}

function ndsbs_breadcrumb($variables) {
  $breadcrumb = $variables['breadcrumb'];
  $output = '';

  // Determine if we are to display the breadcrumb.
  $show_breadcrumb = theme_get_setting('zen_breadcrumb');
  if ($show_breadcrumb == 'yes' || $show_breadcrumb == 'admin' && arg(0) == 'admin') {

    // Optionally get rid of the homepage link.
    $show_breadcrumb_home = theme_get_setting('zen_breadcrumb_home');
    if (!$show_breadcrumb_home) {
      array_shift($breadcrumb);
    }

    // Return the breadcrumb with separators.
    if (!empty($breadcrumb)) {
      $breadcrumb_separator = filter_xss_admin(theme_get_setting('zen_breadcrumb_separator'));
      $trailing_separator = $title = '';
      if (theme_get_setting('zen_breadcrumb_title')) {
        $item = menu_get_item();
        $path = drupal_get_path_alias(request_uri());
        if (!empty($item['tab_parent'])) {
          // If we are on a non-default tab, use the tab's title.
          $breadcrumb[] = '<a href="' . $path . '" itemprop="url">' . check_plain($item['title']) . '</a>';
        }
        else {
          $breadcrumb[] = '<a href="' . $path . '" itemprop="url">' . drupal_get_title() . '</a>';
        }
      }
      elseif (theme_get_setting('zen_breadcrumb_trailing')) {
        $trailing_separator = $breadcrumb_separator;
      }

      // Provide a navigational heading to give context for breadcrumb links to
      // screen-reader users.
      if (empty($variables['title'])) {
        $variables['title'] = t('You are here');
      }
      // Unless overridden by a preprocess function, make the heading invisible.
      if (!isset($variables['title_attributes_array']['class'])) {
        $variables['title_attributes_array']['class'][] = 'element-invisible';
      }

      // Build the breadcrumb trail.
      $output = '<nav class="breadcrumb" role="navigation" style="display: none">';
      $output .= '<h2' . drupal_attributes($variables['title_attributes_array']) . '>' . $variables['title'] . '</h2>';
      $output .= '<ol vocab="http://schema.org/" typeof="BreadcrumbList"><li property="itemListElement" typeof="ListItem">' . implode($breadcrumb_separator . '</li><li property="itemListElement" typeof="ListItem">', $breadcrumb) . $trailing_separator . '</li></ol>';
      $output .= '</nav>';
    }
  }

  return $output;
}
