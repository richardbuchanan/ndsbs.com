<?php

/**
 * @file
 * The NDSBS theme system, which controls the output of the NDSBS theme.
 *
 * The theme system allows for nearly all output of the Drupal system to be
 * customized.
 */

/**
 * Implements theme_checkboxes().
 */
function ndsbs_checkboxes($variables) {
  $element = $variables['element'];
  $attributes = array();

  if (isset($element['#id'])) {
    $attributes['id'] = $element['#id'];
  }

  $attributes['class'][] = 'form-checkboxes';
  $attributes['class'][] = 'uk-form-controls';

  if (!empty($element['#attributes']['class'])) {
    $attributes['class'] = array_merge($attributes['class'], $element['#attributes']['class']);
  }
  if (isset($element['#attributes']['title'])) {
    $attributes['title'] = $element['#attributes']['title'];
  }

  return '<div' . drupal_attributes($attributes) . '>' . (!empty($element['#children']) ? $element['#children'] : '') . '</div>';
}

/**
 * Implements theme_container().
 */
function ndsbs_container($variables) {
  $element = $variables['element'];
  // Ensure #attributes is set.
  $element += array('#attributes' => array());
  $prefix = '';
  $suffix = '';

  // Special handling for form elements.
  if (isset($element['#array_parents'])) {
    // Assign an html ID.
    if (!isset($element['#attributes']['id'])) {
      $element['#attributes']['id'] = $element['#id'];
    }

    // Add the 'form-wrapper' class.
    $element['#attributes']['class'][] = 'form-wrapper';
  }

  $field_first_name = $element['#id'] == 'edit-field-first-name';
  $field_middle_name = $element['#id'] == 'edit-field-middle-name';
  $field_last_name = $element['#id'] == 'edit-field-last-name';
  if ($field_first_name || $field_middle_name || $field_last_name) {
    $element['#attributes']['class'][] = 'uk-float-left';
    $element['#attributes']['class'][] = 'uk-width-1-1';
    $element['#attributes']['class'][] = 'uk-width-1-3@m';
  }

  $field_gender = $element['#id'] == 'edit-field-gender';
  if ($field_gender) {
    $element['#attributes']['class'][] = 'uk-width-1-1';
    $element['#attributes']['class'][] = 'uk-width-1-3@m';
  }

  $field_month = $element['#id'] == 'edit-field-month';
  $field_dobdate = $element['#id'] == 'edit-field-dobdate';
  $field_year = $element['#id'] == 'edit-field-year';
  if ($field_month || $field_dobdate || $field_year) {
    $element['#attributes']['class'][] = 'uk-float-left';
  }

  return '<div' . drupal_attributes($element['#attributes']) . '>' . $prefix . $element['#children'] . $suffix . '</div>';
}

/**
 * Implements theme_container().
 */
function ndsbs_container__form_element__form_controls($variables) {
  $element = $variables['element'];
  $children = str_replace('<label ', '<label class="uk-display-block" ', $element['#children']);
  return $children;
}

/**
 * Implements theme_credit_card().
 */
function ndsbs_credit_card($variables) {
  $element = $variables['element'];
  $element['#attributes']['type'] = 'number';
  $element['#attributes']['maxlength'] = '19';
  element_set_attributes($element, array('id', 'name', 'value', 'size'));
  _form_set_class($element, array('form-control', 'form-credit-card', 'uk-input'));

  $output = '<div class="input-group">';
  $output .= '<input' . drupal_attributes($element['#attributes']) . ' />';
  $output .= '<span class="input-group-addon"><i class="fa fa-credit-card"></i></span>';
  $output .= '</div>';

  return $output;
}

/**
 * Implements theme_fieldset().
 */
function ndsbs_fieldset__terms_of_use($variables) {
  $element = $variables['element'];
  element_set_attributes($element, array('id'));
  $element['#attributes']['class'] = array(
    'group-terms-of-use',
    'form-wrapper',
  );

  $output = '<div' . drupal_attributes($element['#attributes']) . '>';
  $output .= '<label class="uk-form-label">' . $element['#title'] . '</label>';

  if (!empty($element['#description'])) {
    $output .= '<p class="uk-text-small uk-text-muted uk-margin-small-top">' . $element['#description'] . '</p>';
  }

  $output .= '<div class="uk-overflow-auto uk-height-large">';
  $output .= $variables['terms'];
  $output .= '</div><div class="uk-margin-top">';
  $output .= $variables['terms_agree'];
  $output .= '</div>';

  if (isset($element['#value'])) {
    $output .= $element['#value'];
  }

  $output .= '</div>';

  return $output;
}

/**
 * Implements theme_form_element().
 */
function ndsbs_form_element($variables) {
  $element = &$variables['element'];
  $name = !empty($element['#name']) ? $element['#name'] : FALSE;
  $type = !empty($element['#type']) ? $element['#type'] : FALSE;
  $prefix = isset($element['#field_prefix']) ? $element['#field_prefix'] : '';
  $suffix = isset($element['#field_suffix']) ? $element['#field_suffix'] : '';
  $checkbox = $type && $type === 'checkbox';
  $radio = $type && $type === 'radio';

  // Create an attributes array for the wrapping container.
  if (empty($element['#wrapper_attributes'])) {
    $element['#wrapper_attributes'] = array();
  }

  $wrapper_attributes = &$element['#wrapper_attributes'];

  // This function is invoked as theme wrapper, but the rendered form element
  // may not necessarily have been processed by form_builder().
  $element += array(
    '#title_display' => 'before',
  );

  // Add wrapper ID for 'item' type.
  if ($type && $type === 'item' && !empty($element['#markup']) && !empty($element['#id'])) {
    $wrapper_attributes['id'] = $element['#id'];
  }

  // Add necessary classes to wrapper container.
  if ($name) {
    $wrapper_attributes['class'][] = 'form-item-' . drupal_html_class($name);
  }
  if ($type) {
    $wrapper_attributes['class'][] = 'form-type-' . drupal_html_class($type);
  }
  if (!empty($element['#attributes']['disabled'])) {
    $wrapper_attributes['class'][] = 'form-disabled';
  }
  if (!empty($element['#autocomplete_path']) && drupal_valid_path($element['#autocomplete_path'])) {
    $wrapper_attributes['class'][] = 'form-autocomplete';
  }

  if (!$checkbox && !$radio) {
    $wrapper_attributes['class'][] = 'uk-margin';
  }

  // TODO: Add advanced password options in theme settings.
  // Add a space before the labels of checkboxes and radios.
  if (($checkbox || $radio) && isset($element['#title'])) {
    $variables['element']['#title'] = ' ' . $element['#title'];
  }

  // Create a render array for the form element.
  if ($checkbox || $radio) {
    $build = [
      '#theme_wrappers' => ['container__form_element__form_controls'],
    ];
  }
  else {
    $build = [
      '#theme_wrappers' => ['container__form_element'],
      '#attributes' => $wrapper_attributes,
    ];
  }

  // Render the label for the form element.
  $build['label'] = array(
    '#markup' => theme('form_element_label', $variables),
  );

  // Increase the label weight if it should be displayed after the element.
  if ($element['#title_display'] === 'after') {
    $build['label']['#weight'] = 10;
  }

  // Checkboxes and radios render the input element inside the label. If the
  // element is neither of those, then the input element must be rendered here.
  if (!$checkbox && !$radio) {

    if ((!empty($prefix) || !empty($suffix))) {
      if (!empty($element['#field_prefix'])) {
        $prefix = '<span class="form-item-prefix">' . $prefix . '</span>';
      }
      if (!empty($element['#field_suffix'])) {
        $suffix = '<span class="form-item-suffix">' . $suffix . '</span>';
      }

      // Add a wrapping container around the elements.
      $prefix .= '<div>' . $prefix;
      $suffix .= '</div>';
    }

    // Build the form element.
    $build['element'] = array(
      '#markup' => $element['#children'],
      '#prefix' => !empty($prefix) ? $prefix : NULL,
      '#suffix' => !empty($suffix) ? $suffix : NULL,
    );
  }

  // Construct the element's description markup.
  if (!empty($element['#description'])) {
    $build['description'] = array(
      '#type' => 'container',
      '#attributes' => array(
        'class' => array(
          'uk-text-small',
          'uk-text-muted',
          'uk-margin-small-top',
        ),
      ),
      '#weight' => 20,
      0 => array('#markup' => $element['#description']),
    );
  }

  // Print the form element build array.
  return drupal_render($build);
}

/**
 * Implements theme_image().
 */
function ndsbs_image__staff_resize($variables) {
  $attributes = $variables['attributes'];
  $attributes['src'] = file_create_url($variables['path']);
  $height = $variables['height'] / 4;
  $width = $variables['width'] / 4;

  foreach (array('width', 'height', 'alt', 'title') as $key) {
    if (isset($variables[$key])) {
      $attributes[$key] = $variables[$key];
    }
  }

  $output = '<img' . drupal_attributes($attributes) . ' />';
  $output .= '<canvas width="' . $width . '" height="' . $height . '"></canvas>';

  return $output;
}

/**
 * Implements theme_link().
 */
function ndsbs_link($variables) {
  $path = $variables['path'];
  $options = $variables['options'];
  $attributes = $variables['options']['attributes'];
  $text = $variables['options']['html'] ? $variables['text'] : check_plain($variables['text']);

  switch ($path) {
    case '<uk-nav-header>':
      return $text;

    case '<uk-parent>':
      $identifier = isset($variables['options']['identifier']) ? $variables['options']['identifier'] : '';
      $pattern = '/^main-menu/';
      preg_match($pattern, substr($identifier,0), $matches, PREG_OFFSET_CAPTURE);
      $dropper = '';

      if ($matches) {
        $dropper = '<span class="uk-margin-small-left" uk-icon="icon: chevron-down"></span>';
      }

      return '<a href="#" ' . drupal_attributes($attributes) . '>' . $text . $dropper . '</a>';

    case '<uk-nav-divider>':
      return '';

    default:
      return '<a href="' . check_plain(url($path, $options)) . '" ' . drupal_attributes($attributes) . '>' . $text . '</a>';
  }
}

/**
 * Implements theme_menu_link().
 */
function ndsbs_menu_link(array $variables) {
  global $user;
  $element = $variables['element'];
  $sub_menu = '';

  $options = !empty($element['#localized_options']) ? $element['#localized_options'] : array();

  // Check plain title if "html" is not set, otherwise, filter for XSS attacks.
  $title = empty($options['html']) ? check_plain($element['#title']) : filter_xss_admin($element['#title']);

  // Ensure "html" is now enabled so l() doesn't double encode. This is now
  // safe to do since both check_plain() and filter_xss_admin() encode HTML
  // entities. See: https://www.drupal.org/node/2854978
  $options['html'] = TRUE;

  $href = $element['#href'];
  $attributes = !empty($element['#attributes']) ? $element['#attributes'] : array();

  $front_page = $href == '<front>' && drupal_is_front_page();
  $user_profile = $href === 'user' && $_GET['q'] === "user/$user->uid";

  if ($href == $_GET['q'] || $front_page || $user_profile) {
    $attributes['class'][] = 'uk-active';
  }

  // Remove expanded classes.
  if (isset($attributes['class']) && ($key = array_search('expanded', $attributes['class'])) !== FALSE) {
    unset($attributes['class'][$key]);
  }

  if ($element['#below']) {
    $offcanvas = in_array('menu_tree__offcanvas__below', $element['#below']['#theme_wrappers']);

    // Prevent dropdown functions from being added to management menu so it
    // does not affect the navbar module.
    if (($element['#original_link']['menu_name'] == 'management') && (module_exists('navbar'))) {
      $sub_menu = drupal_render($element['#below']);
    }
    elseif ($offcanvas) {
      $sub_menu = drupal_render($element['#below']);

      // Generate as standard dropdown.
      $attributes['class'][] = 'uk-parent';
      $attributes['aria-expanded'] = 'false';
    }
    elseif (!empty($element['#original_link']['depth']) && $element['#original_link']['depth'] == 1) {
      // Use our own theme wrapper.
      unset($element['#below']['#theme_wrappers']);
      $sub_menu = '<div class="uk-navbar-dropdown ie9-gradient">';

      if ($element['#original_link']['menu_name'] == 'main-menu') {
        $sub_menu .= '<ul class="uk-nav uk-navbar-dropdown-nav uk-child-width-1-3" uk-grid>' . drupal_render($element['#below']) . '</ul>';
      }
      elseif ($element['#original_link']['menu_name'] == 'user-menu') {
        $sub_menu .= '<ul class="uk-nav uk-navbar-dropdown-nav uk-child-width-expand" uk-grid>' . drupal_render($element['#below']) . '</ul>';
      }
      else {
        $sub_menu .= '<ul class="uk-nav uk-navbar-dropdown-nav">' . drupal_render($element['#below']) . '</ul>';
      }

      $sub_menu .= '</div>';
    }
    elseif ((!empty($element['#original_link']['depth'])) && ($element['#original_link']['depth'] == 2)) {
      // Use our own theme wrapper.
      unset($element['#below']['#theme_wrappers']);
      $sub_menu .= '<ul>' . drupal_render($element['#below']) . '</ul>';
    }
  }

  switch ($href) {
    case '<uk-nav-header>':
      $attributes['class'][] = 'uk-nav-header';
      return '<li' . drupal_attributes($attributes) . '>' . $title . "</li>\n";

    case '<uk-nav-divider>':
      $attributes['class'][] = 'uk-nav-divider';
      return '<li' . drupal_attributes($attributes) . '>' . l($title, $href, $options) . $sub_menu . "</li>\n";

    default:
      return '<li' . drupal_attributes($attributes) . '>' . l($title, $href, $options) . $sub_menu . "</li>\n";
  }
}

/**
 * Implements theme_menu_tree() for navbar menus.
 */
function ndsbs_menu_tree__navbar($variables) {
  return '<ul class="uk-navbar-nav uk-visible@l">' . $variables['tree'] . '</ul>';
}

/**
 * Implements theme_menu_tree() for the primary navbar menu.
 */
function ndsbs_menu_tree__navbar__primary($variables) {
  return '<ul id="primary-menu" class="uk-navbar-nav uk-visible@l">' . $variables['tree'] . '</ul>';
}

/**
 * Implements theme_menu_tree() for menu_footer_menu.
 */
function ndsbs_menu_tree__menu_footer_menu($variables) {
  return '<ul id="footer-menu" class="uk-subnav uk-flex uk-flex-center uk-flex-left@m">' . $variables['tree'] . '</ul>';
}

/**
 * Implements theme_menu_tree() for the compact user navbar menu.
 */
function ndsbs_menu_tree__navbar__user_compact($variables) {
  return '<ul id="user-compact" class="uk-navbar-nav uk-visible@l">' . $variables['tree'] . '</ul>';
}

/**
 * Implements theme_radios().
 */
function ndsbs_radios($variables) {
  $element = $variables['element'];
  $attributes = array();

  if (isset($element['#id'])) {
    $attributes['id'] = $element['#id'];
  }

  $attributes['class'][] = 'form-radios';
  $attributes['class'][] = 'uk-form-controls';

  if (!empty($element['#attributes']['class'])) {
    $attributes['class'] .= ' ' . implode(' ', $element['#attributes']['class']);
  }
  if (isset($element['#attributes']['title'])) {
    $attributes['title'] = $element['#attributes']['title'];
  }

  return '<div' . drupal_attributes($attributes) . '>' . (!empty($element['#children']) ? $element['#children'] : '') . '</div>';
}
