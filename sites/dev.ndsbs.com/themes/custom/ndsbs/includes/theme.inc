<?php

/**
 * @file
 * The NDSBS theme system, which controls the output of the NDSBS theme.
 *
 * The theme system allows for nearly all output of the Drupal system to be
 * customized.
 */

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
