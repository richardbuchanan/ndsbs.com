<?php

/**
 * @file
 *
 * template.php
 *
 * Lead developer: Richard Buchanan <richard_buchanan@buchanandesigngroup.com>
 * Lead designer: Matt Simmons <matt@simmonsdesign.co>
 *
 * Theme functions tell the PHPTemplate engine about functions not included in a basic
 * list. You can find a list of these in the API documentation.
 *
 * In order to override Drupal's default theme functions, be sure to replace the default
 * function name with our theme name, ohio_dui. See the documentation before each
 * function below to better understand this.
 *
 * @see http://api.drupal.org/api/group/themeable
 */

/**
 * Implements hook_html_head_alter().
 *
 * Alter XHTML HEAD tags before they are rendered by drupal_get_html_head().
 *
 * @param array $head_elements
 *   An array of renderable elements. Generally the values of the #attributes array will
 * be the most likely target for changes.
 */
function ohio_dui_html_head_alter(&$head_elements) {
  if ((!isset($head_elements['head_title']) || !isset($head_elements['rdf_node_title']['#attributes']['content'])) && !drupal_is_front_page()) {
    $head_title = strip_tags(drupal_get_title()) . ' | OhioDUIEval.com';
    $head_elements['head_title'] = array(
      '#type' => 'html_tag',
      '#tag' => 'title',
      '#value' => $head_title
    );
  }
}

/**
 * Implements hook_preprocess().
 *
 * Preprocess theme variables for templates.
 *
 * @param array $variables
 *   The variables array (modify in place).
 * @param string $hook
 *   The name of the theme hook.
 */
function ohio_dui_preprocess(&$variables, $hook) {
  // Set status message if anonymous user is redirected to registration page.
  if (arg(0) == 'user' && arg(1) == 'register') {
    if (isset($_GET['destination'])) {
      if ($_GET['destination'] == 'node/83') {
        $variables['register_message'] = 'DUI Alcohol Assessment successfully added to your cart. Please register an account to continue to checkout. If you already have an account, please login <a href="https://ohioduieval.com/user/login">here</a>.';
      }
      if ($_GET['destination'] == 'node/82') {
        $variables['register_message'] = 'DUI Drug & Alcohol Assessment successfully added to your cart. Please register an account to continue to checkout. If you already have an account, please login <a href="https://ohioduieval.com/user/login">here</a>.';
      }
    }
  }
}

/**
 * Implements template_preprocess_page().
 *
 * Preprocess variables for page.tpl.php.
 *
 * @see drupal_render_page()
 * @see template_process_page()
 * @see page.tpl.php
 */
function ohio_dui_preprocess_page(&$vars) {
  // Check if primary tabs exist.
  if (isset($vars['tabs']['#primary'])) {
    // For each primary tab.
    if (is_array($vars['tabs']['#primary'])) {
      foreach ($vars['tabs']['#primary'] as $key => $tab) {
        // If tab is set for the developer token path
        if ($tab['#link']['path'] == 'user/%/devel/token') {
          // Unset tab
          unset($vars['tabs']['#primary'][$key]);
        }
      }
    }
  }
  // Setup our globals for later use.
  global $user, $base_url, $theme_key;

  // Declare new strings.
  $server = '/var/www/drupal/public_html/';
  $theme_path = drupal_get_path('theme', $GLOBALS['theme']);

  // Include our page.tpl.php variables file for later use.
  if ($theme_key == 'ohio_dui') {
    include($server . $theme_path . '/templates/pages/includes/variables.inc');
  }

  // Custom variables created in our variables file need some information.
  $orders = ode_verify_order($user);
  $questionnaire = ode_verify_questionnaire($user);
  $int_nid = ode_verify_interview($user);
  $int_status = ode_verify_interview_status();
  $doc_nid = ode_verify_necessary_docs($user);
  $doc_status = ode_verify_necessary_docs_status();
  $report_client_id = ode_verify_client_report_client();
  $client_match = FALSE;
  $step_null = '/user/' . $user->uid . '/my-assessment?step=null';
  $step_one = '/user/'.$user->uid.'/my-assessment?step=questionnaire';
  $step_two = '/user/'.$user->uid.'/my-assessment?step=interview';
  $step_three = '/user/'.$user->uid.'/my-assessment?step=necessary-documents';
  $step_four = '/user/'.$user->uid.'/my-assessment?step=assessment-report';

  // Tell the variables which step the client is on in the assessment process.
  if (request_uri() == $step_null) {
    if ($steps_completed == 0) {
      drupal_goto($base_url . $step_one);
    }
    if ($steps_completed == 1) {
      drupal_goto($base_url . $step_two);
    }
    if ($steps_completed == 2) {
      drupal_goto($base_url . $step_three);
    }
    if ($steps_completed >= 3) {
      drupal_goto($base_url . $step_four);
    }
  }

  // Add the node title into the theme_hook_suggestions array, but only for the
  // page's view URL. We want to ommit theme_hook_suggestions for the URL arguments
  // listed.
  if (isset($vars['node'])) {
    if (arg(0) == 'node' &&
      arg(1) != 'add' &&
      arg(2) != 'devel' &&
      arg(2) != 'edit' &&
      arg(2) != 'webform-results') {
      $node_title = $vars['node']->title;
      if ($node_title != NULL) {
        $node_title = 'page__'. str_replace(' ', '_', $node_title);
        $node_title = strtolower($node_title);
        $vars['theme_hook_suggestions'][] = $node_title;
      }
    }
  }

  // Edit the /user/%/my-transaction page title to be friendlier.
  if (arg(0) == 'user' && arg(2) == 'my-transactions') {
    $new_title = $user->name . '\'s Transactions';
    drupal_set_title($new_title);
  }

  // Nifty way of letting our custom JavaScript code know which user is currently logged
  // in.
  if ($user->uid) {
    drupal_add_js(array(
      'ohio_dui' => array(
        'my_questionnaire_url' => '/user/' . $user->uid . '/my-assessment?step=questionnaire',
      ),
    ), 'setting');
  }

  // Change title of questionnaire submissions to include client's name.
  if (isset($vars['page']['content']['system_main']['#mode'])) {
    if ($vars['page']['content']['system_main']['#mode'] == 'display') {
      if (isset($vars['page']['content']['system_main']['#submission']->nid)) {
        $sub_nid = $vars['page']['content']['system_main']['#submission']->nid;
        if ($sub_nid == '87' || $sub_nid == '88' || $sub_nid == '112') {
          $sname = $vars['page']['content']['system_main']['#submission']->name;
          $ques_title = $vars['page']['content']['system_main']['#node']->title;
          drupal_set_title($sname . '\'s ' . $ques_title);
        }
      }
    }
  }
}

/**
 * Implements theme_button().
 *
 * Returns HTML for a button form element.
 *
 * @param array $variables
 *  An associative array containing:
 *    element: An associative array containing the properties of the element. Properties
 *    used: #attributes, #button_type, #name, #value.
 */
function ohio_dui_button($variables) {
  $element = $variables['element'];
  $element['#attributes']['type'] = 'submit';
  element_set_attributes($element, array('id', 'name', 'value'));

  // Add classes to our buttons.
  $element['#attributes']['class'][] = 'form-' . $element['#button_type'];
  if (!empty($element['#attributes']['disabled'])) {
    $element['#attributes']['class'][] = 'form-button-disabled';
  }

  // Replace the default HTML for the one-time login request button. We want to wrap this
  // button inside a fieldset.
  if (substr($element['#value'], 0, 14) == 'Send login one') {
    $user_being_viewed = user_load(arg(1));
    $name = $user_being_viewed->name;
    return '<fieldset><input' . drupal_attributes($element['#attributes']) . ' /><br />
    <span style="float: left; clear: both; margin: 6px 0; font-size: 15px;">This will send an email to ' . $name . ' with instructions on how to reset their password.</span></fieldset>';
  }

  else {
    // No fieldset needed for other button elements.
    return '<input' . drupal_attributes($element['#attributes']) . ' />';
  }
}

function ohio_dui_preprocess_panels_pane(&$variables) {
  //dpm($variables['content']);
  $variables['content']['login_one_time']['#weight'] = 10;
  $variables['content']['login_one_time']['#title'] = 'Reset Password';
  $variables['content']['login_one_time']['#attributes']['class'][] = 'test';
}

function ohio_dui_form_alter(&$form, $form_state, $form_id) {
  // Setup global variables for later use.
  global $base_url, $user;

  if ($form['form_id']['#id'] == 'edit-user-profile-form' ) {
    $roles = $form['#user']->roles;
    // We do not need the overlay control settings shown on ANY user profile
    // edit form.
    unset($form['overlay_control']);
  }

  if ($form['#form_id'] == 'views_form_all_clients_panel_pane_2') {
    unset($form['actions']['submit']);
  }

  if (isset($form['#node']->type)) {

    if ($form['#node']->type == 'webform') {

      if (isset($form['actions']['next'])) {
        $input = "Next Question &#187;";
        $output = preg_replace_callback("/(&#[0-9]+;)/", function($m) { return mb_convert_encoding($m[1], "UTF-8", "HTML-ENTITIES"); }, $input); 
        $form['actions']['next']['#value'] = $output;
      }

      if (isset($form['actions']['previous'])) {
        $input = "&#171; Previous Question";
        $output = preg_replace_callback("/(&#[0-9]+;)/", function($m) { return mb_convert_encoding($m[1], "UTF-8", "HTML-ENTITIES"); }, $input); 
        $form['actions']['previous']['#value'] = $output;
      }
    }
  }

  if ($form_id == 'webform_client_form_99') {

    if (in_array('client', $user->roles)) {
      drupal_add_js('jQuery(".webform-component--status").addClass("element-invisible")', 'inline', 'footer');
    }
  }

  if ($form_id == 'client_report_node_form' || $form_id == 'user-profile-form') {
    $form['#attributes']['class'][] = 'content-wrap';
  }

  if ($form_id == 'user_profile_form') {
    $form['#groups']['group_personal_info']->weight = -1005;
    $form['#groups']['group_login']->weight = -1004;
    $form['#groups']['group_rush_service']->weight = -1003;
    $form['#groups']['group_primary_phone']->weight = -1002;
    $form['#groups']['group_secondary_phone']->weight = -1001;

    // Edit the email field description and place this field at the top.
    $form['account']['mail']['#weight'] = -2;
    $form['account']['mail']['#description'] = 'Email address must be a valid e-mail address. All emails from OhioDUIeval.com will be sent to this address. The e-mail address is not made public and will only be used to receive notifications and messages from OhioDUIeval.com';

    // Edit the password field description and put it below the email field.
    $form['account']['pass']['#weight'] = -1;

    // Edit the current password field description and move it to the bottom.
    $form['account']['current_pass']['#weight'] = 0;
    $form['account']['current_pass']['#description'] = 'Enter your current password to change the email address or password. <a href="/user/password">Request new password</a>.';
  }
}

function ohio_dui_menu_alter(&$items) {
  $items['file/ajax']['file path'] = drupal_get_path('module', 'node');
  $items['file/ajax']['file'] = 'node.pages.inc';
  $items['system/ajax']['file path'] = drupal_get_path('module', 'node');
  $items['system/ajax']['file'] = 'node.pages.inc';
}

function ohio_dui_page_alter(&$page) {
  global $user;

  if (isset($user->name)) {
    $username = $user->name;
  }

  // Change webform submission page title.
  if (isset($page['content']['system_main']['#submission']->sid)) {
    $submission = $page['content']['system_main']['#node']->title;
    $submission_title = $username . '\'s ' . $submission;
    drupal_set_title($submission_title);
  }
}

function ohio_dui_get_node_count($content_type) {
     $query = "SELECT COUNT(*) amount FROM {node} n ".
              "WHERE n.type = :type";
     $result = db_query($query, array(':type' => $content_type))->fetch();
     return $result->amount;
}

function ohio_dui_uc_product_add_to_cart($vars) {
  $form = $vars['form'];
  $node_url = $_GET['q'];

  if ($node_url == 'node/129') {
    $form['actions']['submit']['#attributes']['class'][] = 'pa-purchase-now';
    $form['actions']['submit']['#value'] = 'Purchase Now';
  }

  $output = '<div class="add-to-cart">';
  $output .= drupal_render($form);
  $output .= '</div>';

  return $output;
}

function ohio_dui_css_alter (&$css) {
  // Instead of using Drupal's default stylesheets, we placed all of the styles from the
  // following stylesheets into our global.styles.css file. We can unset these
  // stylesheets since they will never be needed again.
  unset($css[drupal_get_path('module','aggregator').'/aggregator.css']);
  unset($css[drupal_get_path('module','block').'/block.css']);
  unset($css[drupal_get_path('module','book').'/book.css']);
  unset($css[drupal_get_path('module','comment').'/comment.css']);
  unset($css[drupal_get_path('module','field').'/theme/field.css']);
  unset($css[drupal_get_path('module','field_ui').'/field_ui.css']);
  unset($css[drupal_get_path('module','filter').'/filter.css']);
  unset($css[drupal_get_path('module','help').'/help.css']);
  unset($css[drupal_get_path('module','image').'/image.css']);
  unset($css[drupal_get_path('module','menu').'/menu.css']);
  unset($css[drupal_get_path('module','node').'/node.css']);
  //unset($css[drupal_get_path('module','overlay').'/overlay-child.css']);
  //unset($css[drupal_get_path('module','overlay').'/overlay-parent.css']);
  unset($css[drupal_get_path('module','profile').'/profile.css']);
  unset($css[drupal_get_path('module','search').'/search.css']);
  unset($css[drupal_get_path('module','shortcut').'/shortcut.css']);
  unset($css[drupal_get_path('module','system').'/system.base.css']);
  unset($css[drupal_get_path('module','system').'/system.maintenance.css']);
  unset($css[drupal_get_path('module','system').'/system.menus.css']);
  unset($css[drupal_get_path('module','system').'/system.messages.css']);
  unset($css[drupal_get_path('module','system').'/system.theme.css']);
  unset($css[drupal_get_path('module','taxonomy').'/taxonomy.css']);
  unset($css[drupal_get_path('module','tracker').'/tracker.css']);
  unset($css[drupal_get_path('module','user').'/user.css']);
}

/**
 * Implements theme_form().
 */
function ohio_dui_form($variables) {
  $element = $variables['element'];

  if (isset($element['#action'])) {
    $element['#attributes']['action'] = drupal_strip_dangerous_protocols($element['#action']);
  }

  element_set_attributes($element, array('method', 'id'));

  if (empty($element['#attributes']['accept-charset'])) {
    $element['#attributes']['accept-charset'] = "UTF-8";
  }

  if ($variables['element']['#form_id'] == 'uc_cart_checkout_form') {
    // Anonymous DIV to satisfy XHTML compliance. We add an edit cart link for this form.
    return '<form' . drupal_attributes($element['#attributes']) . '><div><a href="/cart">Edit your cart</a> to make changes to your order.' . $element['#children'] . '</div></form>';
  }

  else {
    // Anonymous DIV to satisfy XHTML compliance.
    return '<form' . drupal_attributes($element['#attributes']) . '><div>' . $element['#children'] . '</div></form>';
  }
}
