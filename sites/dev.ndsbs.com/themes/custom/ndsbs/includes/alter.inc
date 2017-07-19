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

  if ($form_id == 'user_register_form') {
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
}
