<?php

/**
 * @file
 * Modify structured content arrays.
 *
 * These hooks are called after the content has been assembled in a structured
 * array and may be used for doing processing which requires that the complete
 * content structure has been built.
 *
 * If the theme wishes to act on the rendered HTML of the content rather than
 * the structured content array, it may use this hook to add a #post_render
 * callback. Alternatively, it could also implement hook_preprocess_HOOK().
 *
 * @see drupal_render()
 * @see theme()
 */

/**
 * Implements hook_css_alter().
 */
function ndsbs_css_alter(&$css) {
  $ndsbs = drupal_get_path('theme', 'ndsbs');

  if (current_path() == 'node_two') {
    $css[$ndsbs . '/css/ndsbs.theme.css']['data'] = "$ndsbs/css/ndsbs.theme.demo_two.css";
  }
  elseif (current_path() == 'node_three') {
    $css[$ndsbs . '/css/ndsbs.theme.css']['data'] = "$ndsbs/css/ndsbs.theme.demo_three.css";
  }

  if (isset($css['modules/user/user.css'])) {
    $css['modules/user/user.css']['data'] = "$ndsbs/css/ndsbs.user.css";
  }
}

/**
 * Implements hook_js_alter().
 */
function ndsbs_js_alter(&$javascript) {
  unset($javascript['//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js']);
  unset($javascript['//cdnjs.cloudflare.com/ajax/libs/jquery-migrate/1.4.1/jquery-migrate.min.js']);
}

/**
 * Implements hook_form_alter().
 */
function ndsbs_form_alter(&$form, &$form_state, $form_id) {
  if (isset($form['captcha'])) {
    $form['captcha']['#weight'] = -100;
  }

  if (isset($form['actions'])) {
    $form['actions']['#attributes']['class'][] = 'uk-margin';
    $form['actions']['#weight'] = 100;
  }

  if (isset($form['form_build_id'])) {
    $form['form_build_id']['#weight'] = 101;
  }

  if (isset($form['form_token'])) {
    $form['form_token']['#weight'] = 102;
  }

  if (isset($form['form_id'])) {
    $form['form_id']['#weight'] = 103;
  }

  if ($form_id == 'user_register_form' || $form_id == 'user_profile_form') {
    $form['field_for_courts']['#states'] = array(
      'visible' => array(
        array(':input[name="field_reason_for_assessment[und][0]"]' => array('checked' => TRUE)),
        array(':input[name="field_reason_for_assessment[und][1]"]' => array('checked' => TRUE)),
        array(':input[name="field_reason_for_assessment[und][2]"]' => array('checked' => TRUE)),
      ),
    );
    $form['field_for_probation']['#states'] = array(
      'visible' => array(
        ':input[name="field_reason_for_assessment[und][7]"]' => array('checked' => TRUE),
      ),
    );
    $form['actions']['submit']['#states'] = array(
      'disabled' => array(
        ':input[name="field_terms_of_use[und]"]' => array('value' => 'I do not agree with NDSBS Terms of Use'),
      ),
    );
  }

  if ($form_id == 'user_profile_form') {
    unset($form['#fieldgroups']['group_terms_of_use']);
  }

  if ($form_id == 'user_login_block') {
    $markup = $form['links']['#markup'];
    $markup = str_replace('<ul class="uk-list">', '<ul class="uk-subnav uk-subnav-divided">', $markup);
    $markup = '<div class=uk-margin">' . $markup . '</div>';

    $form['links']['#markup'] = $markup;
    $form['remember_me']['#prefix'] = '<div class="uk-margin">';
    $form['remember_me']['#suffix'] = '</div>';
  }
}

/**
 * Implements hook_form_FORM_ID_alter() for bluepay_payment_form().
 */
function ndsbs_form_bluepay_payment_form_alter(&$form, &$form_state, $form_id) {
  // Attach the payment script to the form.
  $form['#attached']['js'] = array();
  $form['#attached']['js'][] = drupal_get_path('theme', 'ndsbs') . '/js/payment.js';
  $form['#attached']['js'][] = drupal_get_path('theme', 'ndsbs') . '/js/creditcard.js';
  $cart_items = get_cart_items();

  // BluePay's test mode requires an odd value for the total amount, so we set
  // the rush service to 75 in order to get an approved transaction response.
  $host = $_SERVER['HTTP_HOST'];
  $dev_env = $host == 'localhost.ndsbs' || $host == 'dev.ndsbs.com';
  $node = node_load($cart_items[0]->nid);

  if ($dev_env) {
    $title['#markup'] = $node->title;
  }
  else{
    $title = field_get_items('node', $node, 'field_assessment_title');
    $title = field_view_value('node', $node, 'field_assessment_title', $title[0]);
  }

  $amount = field_get_items('node', $node, 'field_primary_service_amount');
  $amount = field_view_value('node', $node, 'field_primary_service_amount', $amount[0]);
  $assessment_amount = (int)$amount['#markup'];

  foreach ($cart_items as $cart_item) {
    $node_id = $cart_item->nid;

    if ($cart_item->sub_report != 1) {
      $custom_special_amount = get_special_assessment_custom_amount($node_id);

      if ($_SESSION['misc_service_price'] > 0) {
        $assessment_amount = $_SESSION['misc_service_price'];
      }
      elseif ($custom_special_amount > 0) {
        $assessment_amount = $custom_special_amount;
      }
    }
  }

  $form['form_wrapper']['#attributes']['class'] = array('');
  $form['form_wrapper']['#attributes']['uk-grid'] = '';

  $rush_amount = isset($form_state['values']['rush_service']) ? $form_state['values']['rush_service'] : 0;
  $total = number_format($assessment_amount + $rush_amount, 2);

  $rush_prefix = '<div id="rush-details" class="uk-width-1-1 uk-width-1-2@m">';
  $rush_prefix .= '<div class="uk-card uk-card-default rush-service-box">';
  $rush_prefix .= '<div class="uk-card-header">';
  $rush_prefix .= '<h3 class="uk-card-title">Rush Services</h3>';
  $rush_prefix .= '</div>';
  $rush_prefix .= '<div class="uk-card-body" data-form-state="enabled">';

  $form['form_wrapper']['rush_service']['#prefix'] = $rush_prefix;
  $rush_suffix = '<p class="about-rush">Not sure if you need a rush order?<br>Call <a href="tel:6148887274">614-888-7274</a> or email <a href="mailto:support@ndsbs.com">support@ndsbs.com</a></p>';
  $rush_suffix .= '</div>';
  $rush_suffix .= '<div class="uk-card-footer">';
  $rush_suffix .= '<h4>About Rush Services</h4>';
  $rush_suffix .= '<p>We will make an effort to schedule you as soon as we can. The time frames for rush orders begin once your interview with the evaluator is completed.</p>';
  $rush_suffix .= '</div>';
  $rush_suffix .= '</div>';
  $rush_suffix .= '</div>';
  $form['form_wrapper']['rush_service']['#suffix'] = $rush_suffix;

  $summary_markup = '<div id="order-summary" class="uk-width-1-1 uk-width-1-2@m">';
  $summary_markup .= '<div class="uk-card uk-card-default rush-service-box">';
  $summary_markup .= '<div class="uk-card-header">';
  $summary_markup .= '<h3 class="uk-card-title">Order Summary</h3>';
  $summary_markup .= '</div>';
  $summary_markup .= '<div class="uk-card-body">';
  $summary_markup .= '<div uk-grid>';

  if ($assessment_amount) {
    $assessment_summary = '<div class="order-summary-assessment uk-width-1-1">';
    $assessment_summary .= '<span class="uk-float-left">' . $title['#markup'] . ':</span>';
    $assessment_summary .= '<span class="uk-float-right">$' . number_format($assessment_amount, 2) . '</span>';
    $assessment_summary .= '</div>';
  }

  $summary_markup .= $assessment_summary;
  $summary_markup .= '<div class="order-summary-rush-service uk-width-1-1">';
  $summary_markup .= '<span class="uk-float-left">Rush service:</span>';
  $summary_markup .= '<span class="uk-float-right">$' . number_format($rush_amount, 2) . '</span>';
  $summary_markup .= '</div>';
  $summary_markup .= '</div>';
  $summary_markup .= '</div>';
  $summary_markup .= '<div class="order-summary-total uk-card-footer">';
  $summary_markup .= '<span class="uk-float-left"><h4>Order Total:</h4></span>';
  $summary_markup .= '<span class="uk-float-right"><h4>$' . $total . '</h4></span>';
  $summary_markup .= '</div>';
  $summary_markup .= '</div>';
  $summary_markup .= '</div>';
  $form['form_wrapper']['summary']['#markup'] = $summary_markup;

  $cc_prefix = '<div id="payment-details" class="uk-width-1-1 uk-width-1-2@m">';
  $cc_prefix .= '<div class="uk-card uk-card-default credit-card-box">';
  $cc_prefix .= '<div class="uk-card-header">';
  $cc_prefix .= '<h3 class="uk-card-title display-td">Payment Details</h3>';
  $cc_prefix .= '</div>';
  $cc_prefix .= '<div class="uk-card-body">';
  $cc_prefix .= '<img class="img-responsive pull-right" src="/' . drupal_get_path('theme', 'ndsbs') . '/css/images/accepted.png" />';
  $form['form_wrapper']['cc']['#prefix'] = $cc_prefix;

  $form['form_wrapper']['submit']['#prefix'] = '<div class="uk-width-1-1">';
}
