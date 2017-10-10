<?php

/**
 * @file
 * The NDSBS theme system, which controls the output of the NDSBS theme.
 *
 * The theme system allows for nearly all output of the Drupal system to be
 * customized.
 */

/**
 * Implements theme_breadcrumb().
 */
function ndsbs_breadcrumb($variables) {
  $breadcrumb = $variables['breadcrumb'];
  $output = '';

  if (!empty($breadcrumb)) {
    $output .= '<ul class="uk-breadcrumb uk-hidden" vocab="http://schema.org/" typeof="BreadcrumbList">';

    foreach ($breadcrumb as $index => $crumb) {
      $position = $index + 1;
      $output .= '<li property="itemListElement" typeof="ListItem">';
      $output .= $crumb;
      $output .= '<meta property="position" content="' . $position . '">';
      $output .= '</li>';
    }

    $output .= '</ul>';
  }

  return $output;
}

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
  $id = isset($element['#id']) ? $element['#id'] : FALSE;

  // Special handling for form elements.
  if (isset($element['#array_parents'])) {
    // Assign an html ID.
    if (!isset($element['#attributes']['id']) && $id) {
      $element['#attributes']['id'] = $element['#id'];
    }

    // Add the 'form-wrapper' class.
    $element['#attributes']['class'][] = 'form-wrapper';
  }

  if ($id) {
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
 * Implements theme_form().
 */
function ndsbs_form($variables) {
  $element = $variables['element'];

  $horizontal_forms = array(
    'node_admin_content',
  );

  $inline_forms = array(
    'search_assessment_client_form',
    'user_client_search_form',
  );

  if (in_array($element['#form_id'], $horizontal_forms)) {
    $element['#attributes']['class'][] = 'uk-form-horizontal';
  }
  else {
    $element['#attributes']['class'][] = 'uk-form-stacked';
  }

  if (in_array($element['#form_id'], $inline_forms)) {
    $element['#attributes']['class'][] = 'ndsbs-inline-form';
  }

  if (isset($element['#action'])) {
    $element['#attributes']['action'] = drupal_strip_dangerous_protocols($element['#action']);
  }

  element_set_attributes($element, array('method', 'id'));

  if (empty($element['#attributes']['accept-charset'])) {
    $element['#attributes']['accept-charset'] = "UTF-8";
  }

  return '<form' . drupal_attributes($element['#attributes']) . '>' . $element['#children'] . '</form>';
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
  $form_error = form_get_error($element);

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
  if ($form_error) {
    $wrapper_attributes['class'][] = 'uk-text-danger';
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
        $dropper = '<span class="uk-icon uk-margin-small-left">';
        $dropper .= '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" ratio="1">';
        $dropper .= '<polyline fill="none" stroke="#e5e5e5" stroke-width="1.03" points="16 7 10 13 4 7" style="stroke: #e5e5e5;"></polyline>';
        $dropper .= '</svg>';
        $dropper .= '</span>';
      }

      return '<a href="#" ' . drupal_attributes($variables['options']['attributes']) . '>' . $text . $dropper . '</a>';

    case '<uk-nav-divider>':
      return '';

    default:
      return '<a href="' . check_plain(url($path, $options)) . '" ' . drupal_attributes($variables['options']['attributes']) . '>' . $text . '</a>';
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
      return '<li' . drupal_attributes($attributes) . '>' . $title . '</li>';

    case '<uk-nav-divider>':
      $attributes['class'][] = 'uk-nav-divider';
      return '<li' . drupal_attributes($attributes) . '>' . l($title, $href, $options) . $sub_menu . '</li>';

    case 'questionnaire/start/trans':
      if (isset($_SESSION['QUESTIONNAIRE_START_PAGE'])) {
        $href = $_SESSION['QUESTIONNAIRE_START_PAGE'];
      }
      return '<li' . drupal_attributes($attributes) . '>' . l($title, $href, $options) . $sub_menu . '</li>';

    default:
      return '<li' . drupal_attributes($attributes) . '>' . l($title, $href, $options) . $sub_menu . '</li>';
  }
}

/**
 * Implements theme_menu_link() for client dashboard.
 */
function ndsbs_menu_link__menu_client_navigation($variables) {
  $element = $variables['element'];
  $element['#attributes']['class'] = array();
  $depth = $element['#original_link']['depth'];
  $count = 0;
  $sub_menu = '';

  if ($element['#below']) {
    foreach ($element['#below'] as $below) {
      if (is_array($below) && isset($below['#theme'])) {
        $count++;
      }
    }

    unset($element['#below']['#theme_wrappers']);
    $sub_menu = '<div class="uk-accordion-content"><ul class="uk-list">';
    $sub_menu .= drupal_render($element['#below']);
    $sub_menu .= '</ul></div>';
  }

  if (current_path() == $element['#href']) {
    $attributes['class'][] = 'uk-open';
  }

  if ($depth == 1) {
    $attributes = array();

    if ($element['#href'] != '<front>') {
      $output = '<h3 class="uk-accordion-title">';
      $output .= l($element['#title'], $element['#href'], $element['#localized_options']);
      $output .= '</h3>';
      $attributes['class'][] = 'no-icon';
    }
    else {
      $output = '<h3 class="uk-accordion-title">' . $element['#title'] . '</h3>';
    }

    return '<li' . drupal_attributes($attributes) . '>' . $output . $sub_menu . '</li>';
  }
  else {
    $output = l($element['#title'], $element['#href'], $element['#localized_options']);
    return '<li>' . $output . '</li>';
  }
}

/**
 * Implements theme_menu_link() for staff dashboard.
 */
function ndsbs_menu_link__menu_staff_navigation($variables) {
  $element = $variables['element'];
  $element['#attributes']['class'] = array();
  $depth = $element['#original_link']['depth'];
  $count = 0;
  $sub_menu = '';

  if ($element['#below']) {
    foreach ($element['#below'] as $below) {
      if (is_array($below) && isset($below['#theme'])) {
        $count++;
      }
    }

    unset($element['#below']['#theme_wrappers']);
    $sub_menu = '<div class="uk-accordion-content"><ul class="uk-list">';
    $sub_menu .= drupal_render($element['#below']);
    $sub_menu .= '</ul></div>';
  }

  if (current_path() == $element['#href']) {
    $attributes['class'][] = 'uk-open';
  }

  if ($depth == 1) {
    $attributes = array();

    if ($element['#href'] != '<front>') {
      $output = '<h3 class="uk-accordion-title">';
      $output .= l($element['#title'], $element['#href'], $element['#localized_options']);
      $output .= '</h3>';
      $attributes['class'][] = 'no-icon';
    }
    else {
      $output = '<h3 class="uk-accordion-title">' . $element['#title'] . '</h3>';
    }

    return '<li' . drupal_attributes($attributes) . '>' . $output . $sub_menu . '</li>';
  }
  else {
    $output = l($element['#title'], $element['#href'], $element['#localized_options']);
    return '<li>' . $output . '</li>';
  }
}

/**
 * Implements theme_menu_tree() for client dashboard.
 */
function ndsbs_menu_tree__menu_client_navigation($variables) {
  return '<ul id="client-navigation" class="ndsbs-navigation-accordion" uk-accordion>' . $variables['tree'] . '</ul>';
}

/**
 * Implements theme_menu_tree() for client dashboard.
 */
function ndsbs_menu_tree__menu_staff_navigation($variables) {
  return '<ul id="staff-navigation" class="ndsbs-navigation-accordion" uk-accordion>' . $variables['tree'] . '</ul>';
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
 * Implements theme_pager().
 */
function ndsbs_pager($variables) {
  global $pager_page_array;
  global $pager_total;
  $element = $variables['element'];
  $parameters = $variables['parameters'];
  $quantity = $variables['quantity'];
  $tags = $variables['tags'];
  $output = '';

  // Middle is used to "center" pages around the current page.
  $pager_middle = ceil($quantity / 2);

  // Current is the page we are currently paged to.
  $pager_current = $pager_page_array[$element] + 1;

  // First is the first page listed by this pager piece (re quantity).
  $pager_first = $pager_current - $pager_middle + 1;

  // Last is the last page listed by this pager piece (re quantity).
  $pager_last = $pager_current + $quantity - $pager_middle;

  // Max is the maximum page number.
  $pager_max = $pager_total[$element];

  // Prepare for generation loop.
  $i = $pager_first;

  if ($pager_last > $pager_max) {
    // Adjust "center" if at end of query.
    $i = $i + ($pager_max - $pager_last);
    $pager_last = $pager_max;
  }

  if ($i <= 0) {
    // Adjust "center" if at start of query.
    $pager_last = $pager_last + (1 - $i);
    $i = 1;
  }

  $li_first = theme('pager_first', array(
    'text' => (isset($tags[0]) ? $tags[0] : t('First')),
    'element' => $element,
    'parameters' => $parameters,
  ));

  $li_previous = theme('pager_previous', array(
    'text' => (isset($tags[1]) ? $tags[1] : t('Previous')),
    'element' => $element,
    'interval' => 1,
    'parameters' => $parameters,
  ));

  $li_next = theme('pager_next', array(
    'text' => (isset($tags[3]) ? $tags[3] : t('Next')),
    'element' => $element,
    'interval' => 1,
    'parameters' => $parameters,
  ));

  $li_last = theme('pager_last', array(
    'text' => (isset($tags[4]) ? $tags[4] : t('Last')),
    'element' => $element,
    'parameters' => $parameters,
  ));

  if ($pager_total[$element] > 1) {
    if ($li_first) {
      $items[] = array(
        'class' => array('pager-first'),
        'data' => $li_first,
      );
    }

    if ($li_previous) {
      $items[] = array(
        'class' => array('pager-previous'),
        'data' => $li_previous,
      );
    }

    // When there is more than one page, create the pager list.
    if ($i != $pager_max) {
      if ($i > 1) {
        $items[] = array(
          'class' => array('pager-ellipsis'),
          'data' => '…',
        );
      }

      // Now generate the actual pager piece.
      for (; $i <= $pager_last && $i <= $pager_max; $i++) {
        if ($i < $pager_current) {
          $items[] = array(
            'class' => array('pager-item'),
            'data' => theme('pager_previous', array(
              'text' => $i,
              'element' => $element,
              'interval' => ($pager_current - $i),
              'parameters' => $parameters,
            )),
          );
        }

        if ($i == $pager_current) {
          $items[] = array(
            'class' => array('pager-current', 'uk-active'),
            'data' => '<span>' . $i . '</span>',
          );
        }

        if ($i > $pager_current) {
          $items[] = array(
            'class' => array('pager-item'),
            'data' => theme('pager_next', array(
              'text' => $i,
              'element' => $element,
              'interval' => ($i - $pager_current),
              'parameters' => $parameters,
            )),
          );
        }
      }

      if ($i < $pager_max) {
        $items[] = array(
          'class' => array('pager-ellipsis'),
          'data' => '<span>…</span>',
        );
      }
    }

    if ($li_next) {
      $items[] = array(
        'class' => array('pager-next'),
        'data' => $li_next,
      );
    }

    if ($li_last) {
      $items[] = array(
        'class' => array('pager-last'),
        'data' => $li_last,
      );
    }

    $pagination = theme('item_list', array(
      'items' => $items,
      'attributes' => array(
        'class' => array(
          'uk-pagination',
          'uk-flex-center',
        ),
      ),
      'pagination' => TRUE,
    ));

    $output = '<h2 class="element-invisible">' . t('Pages') . '</h2>' . $pagination;
  }

  return $output;
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

/**
 * Implements theme_status_messages().
 */
function ndsbs_status_messages($variables) {
  $display = $variables['display'];
  $output = '';

  foreach (drupal_get_messages($display) as $type => $messages) {
    $class = 'uk-alert-';

    switch ($type) {
      case 'status':
        $class .= 'success';
        break;

      case 'error':
        $class .= 'danger';
        break;

      case 'warning':
        $class .= 'warning';
        break;

    }

    $output .= "<div id='messages--$type' class='uk-alert $class'>";
    $output .= '<button class="uk-alert-close" type="button" uk-close></button>';

    if (count($messages) > 1) {
      $output .= '<ul class="uk-list">';

      foreach ($messages as $message) {
        $output .= '<li>' . decode_entities($message) . '</li>';
      }

      $output .= '</ul>';
    }
    else {
      $messages = reset($messages);
      $output .= decode_entities($messages);
    }

    $output .= '</div>';
  }

  return $output;
}

/**
 * Implements theme_telfield().
 */
function ndsbs_telfield($variables) {
  $element = $variables['element'];
  $element['#attributes']['type'] = 'tel';
  element_set_attributes($element, array('id', 'name', 'value', 'size', 'maxlength', 'placeholder'));
  _form_set_class($element, array('form-text', 'form-tel', 'uk-input'));

  $extra = elements_add_autocomplete($element);
  $output = '<input' . drupal_attributes($element['#attributes']) . ' />';

  return $output . $extra;
}
