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

  if (isset($css['modules/user/user.css'])) {
    $css['modules/user/user.css']['data'] = "$ndsbs/css/ndsbs.user.css";
  }
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

  if ($form_id == 'user_profile_form') {
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
  global $base_url;
  // Attach the payment script to the form.
  $form['#attached']['js'] = array();
  $form['#attached']['js'][] = drupal_get_path('theme', 'ndsbs') . '/js/payment.js';
  $form['#attached']['js'][] = drupal_get_path('theme', 'ndsbs') . '/js/creditcard.js';

  $host = $_SERVER['HTTP_HOST'];
  $dev_env = $host == 'localhost.ndsbs' || $host == 'dev.ndsbs.com';

  /**
  if (!$dev_env) {
    $conversion = "goog_snippet_vars = function() {\n";
    $conversion .= "  var w = window;\n";
    $conversion .= "  w.google_conversion_id = 838747312;\n";
    $conversion .= "  w.google_conversion_label = \"FdXdCP70gnUQsIn5jwM\";\n";
    $conversion .= "  w.google_remarketing_only = false;\n";
    $conversion .= "};\n";
    $conversion .= "// DO NOT CHANGE THE CODE BELOW.\n";
    $conversion .= "goog_report_conversion = function(url) {\n";
    $conversion .= "  goog_snippet_vars();\n";
    $conversion .= "  window.google_conversion_format = \"3\";\n";
    $conversion .= "  var opt = new Object();\n";
    $conversion .= "  opt.onload_callback = function() {\n";
    $conversion .= "    if (typeof(url) != 'undefined') {\n";
    $conversion .= "      window.location = url;\n";
    $conversion .= "    }\n";
    $conversion .= "  };\n";
    $conversion .= "  var conv_handler = window['google_trackConversion'];\n";
    $conversion .= "  if (typeof(conv_handler) == 'function') {\n";
    $conversion .= "    conv_handler(opt);\n";
    $conversion .= "  }\n";
    $conversion .= "};";
    drupal_add_js($conversion, ['type' => 'inline']);
    drupal_add_js('//www.googleadservices.com/pagead/conversion_async.js', ['type' => 'external']);

    $url = $base_url . '/user/payment';
    $form['form_wrapper']['actions']['submit']['#attributes']['onclick'] = "goog_report_conversion ('" . $url . "')";
  }
  */
}

/**
 * Implements hook_form_FORM_ID_alter() for release_authorization_node_form().
 */
function ndsbs_form_release_authorization_node_form_alter(&$form, &$form_state, $form_id) {
  $form['title']['#prefix'] = '<h3 class="release-authorization-section uk-text-center">Personal Information</h3>';
  $form['title']['#prefix'] .= '<div class="uk-child-width-1-1 uk-child-width-1-2@m" uk-grid>';
  $form['title']['#prefix'] .= '<div>';
  $form['title']['#prefix'] .= '<div class="uk-display-inline-block uk-margin-small-right">Client\'s Name:</div>';
  $form['title']['#prefix'] .= '<div class="uk-display-inline-block">';
  $form['title']['#suffix'] = '</div>';
  $form['title']['#suffix'] .= '</div>';

  $form['field_client_dob']['#prefix'] = '<div>';
  $form['field_client_dob']['#prefix'] .= '<div class="uk-display-inline-block uk-margin-small-right">Client\'s DOB (mm/dd/yyyy):</div>';
  $form['field_client_dob']['#prefix'] .= '<div class="uk-display-inline-block">';
  $form['field_client_dob']['#suffix'] = '</div></div></div>';

  $form['field_parent_guardian_poa']['#prefix'] = '<div>
    <p class="uk-margin-remove">Check below if you are the parent of, guardian of, or power of attorney for the client:</p>
    <div class="uk-display-inline-block">';
  $form['field_parent_guardian_poa']['#suffix'] = '</div>';

  $form['field_parent_guardian_poa_name']['#prefix'] = '<div class="uk-display-inline-block uk-margin-left">
      <div class="uk-display-inline-block uk-margin-small-right">Your name:</div>
      <div class="uk-display-inline-block">';
  $form['field_parent_guardian_poa_name']['#suffix'] = '</div>
    </div>
  </div>';

  $form['field_clinician']['#prefix'] = '<h3 class="release-authorization-section uk-text-center">Authorization</h3>
  <div class="uk-width-1-1">
    <div class="uk-display-inline uk-margin-small-right">I authorize (clinician)</div>';
  $form['field_clinician']['#suffix'] = '</div>';

  $form['field_exchange_release_obtain']['#prefix'] = '<div>
    <div class="uk-display-inline">of Directions Counseling Group and ndsbs.com to:</div>
    <div class="uk-display-inline">';
  $form['field_exchange_release_obtain']['#suffix'] = '</div>
  </div>';

  $form['field_recipient_name']['#prefix'] = '<div class="uk-child-width-1-1 uk-child-width-1-2@m" uk-grid>
    <div>
      <div class="uk-display-inline-block uk-margin-small-right">Individual:</div>
      <div class="uk-display-inline-block">';
  $form['field_recipient_name']['#suffix'] = '</div>
    </div>';

  $form['field_recipient_company']['#prefix'] = '<div>
      <div class="uk-display-inline-block uk-margin-small-right">Company:</div>
      <div class="uk-display-inline-block">';
  $form['field_recipient_company']['#suffix'] = '</div>
    </div>
  </div>';

  $form['field_recipient_email']['#prefix'] = '<div class="uk-child-width-1-1 uk-child-width-1-3@m" uk-grid>
    <div>
      <div class="uk-display-inline-block uk-margin-small-right">Email:</div>
      <div class="uk-display-inline-block">';
  $form['field_recipient_email']['#suffix'] = '</div>
    </div>';

  $form['field_recipient_phone']['#prefix'] = '<div>
      <div class="uk-display-inline-block uk-margin-small-right">Phone:</div>
      <div class="uk-display-inline-block">';
  $form['field_recipient_phone']['#suffix'] = '</div>
    </div>';

  $form['field_recipient_fax']['#prefix'] = '<div>
      <div class="uk-display-inline-block uk-margin-small-right">Fax:</div>
      <div class="uk-display-inline-block">';
  $form['field_recipient_fax']['#suffix'] = '</div>
    </div>
  </div>';

  $form['field_information_provided']['#prefix'] = '<hr class="uk-divider-icon">
  <p class="uk-margin-remove">Please provide the following information to the individual/company above:</p>
  <div class="uk-child-width-1-1 uk-child-width-1-2@m" uk-grid>
    <div>';
  $form['field_information_provided']['#suffix'] = '</div>';

  $form['field_information_provided_other']['#prefix'] = '<div>
      <div class="uk-display-inline-block uk-margin-small-left uk-margin-small-right">If other:</div>
      <div class="uk-display-inline-block">';
  $form['field_information_provided_other']['#suffix'] = '</div>
    </div>
  </div>';

  $form['field_purpose']['#prefix'] = '<hr class="uk-divider-icon">
  <p class="uk-margin-remove">The general purpose of this request is for</p>
  <div class="uk-child-width-1-1 uk-child-width-1-2@m" uk-grid>
    <div>';
  $form['field_purpose']['#suffix'] = '</div>';

  $form['field_purpose_other']['#prefix'] = '<div>
      <div class="uk-display-inline-block uk-margin-small-left uk-margin-small-right">If other:</div>
      <div class="uk-display-inline-block">';
  $form['field_purpose_other']['#suffix'] = '</div>
    </div>
  </div>';

  $form['field_transfer_email_additional']['#prefix'] = '<h3 class="release-authorization-section uk-text-center">Method to Transfer Above</h3>
    <div>
      <div class="uk-display-inline-block uk-margin-small-right">Email Assessment to:</div>
      <div class="uk-display-inline-block">';
  $form['field_transfer_email_additional']['#suffix'] = '</div>
    </div>';

  $form['field_transfer_fax_additional']['#prefix'] = '<div>
      <div class="uk-display-inline-block uk-margin-small-right">Fax Assessment to:</div>
      <div class="uk-display-inline-block">';
  $form['field_transfer_fax_additional']['#suffix'] = '</div>
    </div>';

  $form['field_transfer_pickup_additional']['#prefix'] = '<div>
      <div class="uk-display-inline-block uk-margin-small-right">Picked up by:</div>
      <div class="uk-display-inline-block">';
  $form['field_transfer_pickup_additional']['#suffix'] = '</div>
    </div>';

  $form['field_method_of_transfer_initial']['#prefix'] = '<hr class="uk-divider-icon">
  <p class="uk-margin-remove">I am willing to have my PHI shared via unsecured email or fax and I have been made aware of the risks that are involved by using this form of unsecured communication means.</p>
  <div class="uk-display-inline-block uk-margin-small-right">Initials:</div>
  <div class="uk-display-inline-block">';
  $form['field_method_of_transfer_initial']['#suffix'] = '</div>';

  $form['field_revocation_agreement']['#prefix'] = '';
  $form['field_revocation_agreement']['#suffix'] = '';

  $form['field_revocation_date']['#prefix'] = '<div>
    <div class="uk-display-inline-block uk-margin-small-right">Revocation date (mm/dd/yyyy):</div>
    <div class="uk-display-inline-block">';
  $form['field_revocation_date']['#suffix'] = '</div>
  </div>';

  $form['field_conditions_agreement']['#prefix'] = '';
  $form['field_conditions_agreement']['#suffix'] = '';

  $form['field_disclosure_agreement']['#prefix'] = '';
  $form['field_disclosure_agreement']['#suffix'] = '';

  $form['field_redisclosure_agreement']['#prefix'] = '';
  $form['field_redisclosure_agreement']['#suffix'] = '';

  $form['field_digital_signature']['#prefix'] = '<p>I, the undersigned, authorize this release of information:</p>
  <div class="uk-child-width-1-1 uk-child-width-1-2@m" uk-grid>';
  $form['field_digital_signature']['#suffix'] = '';

  $form['field_date']['#prefix'] = '';
  $form['field_date']['#suffix'] = '</div>';

  $form['field_identifying_info_ssn']['#prefix'] = '<div>
    <div class="uk-display-inline-block uk-margin-small-right">First 3 numbers of client social security #:</div>
    <div class="uk-display-inline-block">';
  $form['field_identifying_info_ssn']['#suffix'] = '</div>
  </div>';

  $form['field_identifying_info_address']['#prefix'] = '<div>
    <div class="uk-display-inline-block uk-margin-small-right">Client Street Address #:</div>
    <div class="uk-display-inline-block">';
  $form['field_identifying_info_address']['#suffix'] = '</div>
  </div>';

  $form['field_identifying_info_dob']['#prefix'] = '<div>
    <div class="uk-display-inline-block uk-margin-small-right">Client Birth Date (mm/dd/yyyy):</div>
    <div class="uk-display-inline-block">';
  $form['field_identifying_info_dob']['#suffix'] = '</div>
  </div>';
}

/**
 * Implements hook_form_FORM_ID_alter() for user_register_form().
 */
function ndsbs_form_user_register_form_alter(&$form, &$form_state, $form_id) {
  global $base_url;

  $host = $_SERVER['HTTP_HOST'];
  $dev_env = $host == 'localhost.ndsbs' || $host == 'dev.ndsbs.com';

  /**
  if (!$dev_env) {
    $conversion = "goog_snippet_vars = function() {\n";
    $conversion .= "  var w = window;\n";
    $conversion .= "  w.google_conversion_id = 838747312;\n";
    $conversion .= "  w.google_conversion_label = \"Fil2CL_xgnUQsIn5jwM\";\n";
    $conversion .= "  w.google_remarketing_only = false;\n";
    $conversion .= "};\n";
    $conversion .= "// DO NOT CHANGE THE CODE BELOW.\n";
    $conversion .= "goog_report_conversion = function(url) {\n";
    $conversion .= "  goog_snippet_vars();\n";
    $conversion .= "  window.google_conversion_format = \"3\";\n";
    $conversion .= "  var opt = new Object();\n";
    $conversion .= "  opt.onload_callback = function() {\n";
    $conversion .= "    if (typeof(url) != 'undefined') {\n";
    $conversion .= "      window.location = url;\n";
    $conversion .= "    }\n";
    $conversion .= "  };\n";
    $conversion .= "  var conv_handler = window['google_trackConversion'];\n";
    $conversion .= "  if (typeof(conv_handler) == 'function') {\n";
    $conversion .= "    conv_handler(opt);\n";
    $conversion .= "  }\n";
    $conversion .= "};";
    drupal_add_js($conversion, ['type' => 'inline']);
    drupal_add_js('//www.googleadservices.com/pagead/conversion_async.js', ['type' => 'external']);

    $url = $base_url . '/' . current_path();
    $form['actions']['submit']['#attributes']['onclick'] = "goog_report_conversion ('" . $url . "')";
  }
   */

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
