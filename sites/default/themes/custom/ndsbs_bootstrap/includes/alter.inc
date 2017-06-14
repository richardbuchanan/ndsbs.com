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
 * Implements hook_block_view_alter().
 */
function bootstrap_ndsbs_block_view_alter(&$data, $block) {
  $module = $block->module;

  switch ($module) {
    case 'menu':
      $data['content']['#content']['#theme_wrappers'] = array($block->delta);
      break;
  }
}

/**
 * Implements hook_form_alter().
 */
function bootstrap_ndsbs_form_alter(&$form, &$form_state, $form_id) {
  drupal_add_js(drupal_get_path('theme', 'bootstrap_ndsbs') . '/js/jquery.mask.min.js');

  if (isset($form['#entity_type'])) {
    if ($form['#entity_type'] == 'comment' && isset($form['author']['homepage'])) {
      $form['author']['homepage']['#access'] = FALSE;
    }
  }
}

/**
 * Implements hook_form_FORM_ID_alter() for contact_site_form.
 */
function bootstrap_ndsbs_form_contact_site_form_alter(&$form, &$form_state, $form_id) {
  global $user;
  $user_name = ($user->uid > 0) ? 'NDSBS | Message from ' . $user->name : 'NDSBS | Message from contact form';

  // Set up variables so we can attach them to the form as files.
  // The first one is the required Google Maps API JavaScript file.
  // The second one is our maps configuration file.
  $maps_api = array(
    'data' => 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCDcHtkegKuJiiMTxt-k0go1vRXhOK0eFA&sensor=false',
    'options' => array(
      'type' => 'file',
    ),
  );
  $ndsbs_maps = drupal_get_path('theme', 'bootstrap_ndsbs') . '/js/ndsbs.google.maps.js';

  // Build array for the assessment type checkboxes.
  $options = array(
    'Criminal Court or Attorney Requested (e.g. DUI, Underage, Assault, DV, Possession, Disorderly Conduct, Public Intox, etc.)',
    'Domestic Court or Attorney Requested (e.g. Custody, Divorce, etc.)',
    'State Motor Vehicle Bureau  (BMV/ DMV License Reinstatement Process)',
    'Employer',
    'FAA',
    'Professional Board (Nursing, Medical, Pharmacy)',
    'Personal Reasons',
  );

  // Since we are adding Google Maps API to our form builder, drupal_add_js
  // is not the recommended way to include the required JavaScript files.
  // Instead, we attach them to the form.
  // @see https://www.drupal.org/node/304255
  $form['#attached']['js'] = array(
    $maps_api,
    $ndsbs_maps,
  );

  // Add a phone field to the form.
  // @see https://api.drupal.org/api/drupal/developer!topics!forms_api_reference.html/7
  // @see http://zufelt.ca/blog/adding-fields-contact-form-drupal-7
  $form['phone'] = array(
    '#type' => 'textfield',
    '#title' => t('Your phone'),
    '#size' => 60,
    '#maxlength' => 255,
    '#required' => FALSE,
    '#weight' => 0.002,
  );

  // Add assessment type checklist.
  $form['assessment_type'] = array(
    '#type' => 'checkboxes',
    '#options' => drupal_map_assoc($options),
    '#title' => t('Please indicate why you need this assessment (Check all that apply).'),
    '#weight' => 0.003,
  );

  $contact = array(
    'phone' => 'Phone',
    'email' => 'Email',
    'text' => 'Text',
  );

  $form['preferred_contact'] = array(
    '#type' => 'checkboxes',
    '#title' => 'Preferred way for us to follow up with you',
    '#options' => drupal_map_assoc($contact),
  );

  // Alter the subject field for our needs.
  $form['subject']['#attributes']['disabled'] = 'disabled';
  $form['subject']['#default_value'] = $user_name;
  $form['subject']['#weight'] = 0.003;
  $form['#submit'][] = 'bootstrap_ndsbs_contact_form_submit';
}

/**
 * Submit handler for contact_site_form.
 */
function bootstrap_ndsbs_contact_form_submit($form, &$form_state) {
  drupal_goto('contact');
}

/**
 * Implements hook_form_FORM_ID_alter() for system_site_maintenance_mode.
 */
function bootstrap_ndsbs_form_system_site_maintenance_mode_alter(&$form, &$form_state, $form_id) {
  $destination = drupal_get_destination();
  $messages = drupal_get_messages();
  $form['#submit'][] = 'bootstrap_ndsbs_maintenance_mode_submit';

  $form['actions']['flush_cache'] = array(
    '#type' => 'markup',
    '#markup' => l(t('Flush cache'), 'admin_menu/flush-cache', array(
      'attributes' => array(
        'class' => array('btn', 'btn-primary'),
      ),
      'query' => array(
        'token' => drupal_get_token('admin_menu/flush-cache'),
        'destination' => $destination['destination'],
      ),
    )),
  );

  $maintenance_mode = variable_get('maintenance_mode', 0);

  $maintenance_message = array();

  if ($maintenance_mode) {
    $maintenance_message['maintenance_mode'] = t('The site is currently in maintenance mode.');
  }

  $maintenance_message['back_online'] = t('To put the site back online, make sure <b>Put the site into maintenance mode</b> is UNCHECKED and select <b>Save configuration</b>.');
  $maintenance_message['flush_cache'] = t('Once the page finishes reloading please select <b>Flush cache</b> to be sure the site\'s cache has been completely flushed.');

  foreach ($messages as $type => $message_array) {
    if ($type == 'status') {
      foreach ($message_array as $key => $message) {
        if ($message == $maintenance_message['maintenance_mode'] || $message == $maintenance_message['back_online'] || $message == $maintenance_message['flush_cache']) {
          unset($messages['status'][$key]);
        }
        elseif ($message != 'The configuration options have been saved.' && $message != 'The site is currently in maintenance mode.') {
          drupal_set_message($message, 'status');
        }
      }
    }
    else {
      foreach ($message_array as $message) {
        drupal_set_message($message, $type);
      }
    }
  }

  if ($maintenance_mode) {
    foreach ($maintenance_message as $message) {
      drupal_set_message($message, 'status');
    }
  }
}

/**
 * Submit handler for the system_site_maintenance_mode form.
 */
function bootstrap_ndsbs_maintenance_mode_submit($form, &$form_state) {
  $maintenance_mode = $form_state['values']['maintenance_mode'];

  if (!$maintenance_mode) {
    drupal_set_message('The site has been taken out of maintenance mode. Please select <b>Flush cache</b> to be sure the site\'s cache has been cleared.');
  }
}

/**
 * Implements hook_form_FORM_ID_alter() for user_register_form.
 */
function bootstrap_ndsbs_form_user_register_form_alter(&$form, &$form_state, $form_id) {
  $form['#attached']['js'] = array(
    drupal_get_path('theme', 'bootstrap_ndsbs') . '/js/user-register.js',
  );
}

/**
 * Implements hook_html_head_alter().
 */
function bootstrap_ndsbs_html_head_alter(&$head_elements) {
  $head_elements['google_site_verification'] = array(
    '#type' => 'html_tag',
    '#tag' => 'meta',
    '#attributes' => array(
      'name' => 'google-site-verification',
      'content' => 'SFy4_6Ra_aEpRwby2mY9BtBG-IAzJYtqADMr8cTEbpU',
    ),
  );
  $head_elements['metatag_canonical']['#attributes']['itemprop'] = 'url';
}

/**
 * Implements hook_js_alter().
 */
function bootstrap_ndsbs_js_alter(&$javascript) {
  $theme = drupal_get_path('theme', 'bootstrap_ndsbs');
  $ckeditor = drupal_get_path('module', 'ckeditor');
  $metatag = drupal_get_path('module', 'metatag');
  $google_charts = drupal_get_path('module', 'google_chart_tools');

  // Replace Drupal's ajax.js with this theme's version.
  if (isset($javascript['misc/ajax.js'])) {
    $javascript['misc/ajax.js']['data'] = $theme . '/js/ajax.js';
  }

  // Replace Bootstrap's vertical-tabs.js with this theme's version and add
  // the stylesheet for development purposes.
  if (isset($javascript['misc/vertical-tabs.js'])) {
    $javascript['misc/vertical-tabs.js']['data'] = $theme . '/js/vertical-tabs.js';
    drupal_add_css('misc/vertical-tabs.css');
  }

  // Replace CkEditor's utilities script with this theme's. Need to set the ajax
  // async option to true.
  // @see: http://xhr.spec.whatwg.org/
  if (isset($javascript[$ckeditor . '/includes/ckeditor.utils.js'])) {
    $cke = $theme . '/js/ckeditor.utils.js';
    $javascript[$ckeditor . '/includes/ckeditor.utils.js']['data'] = $cke;
  }
  if (isset($javascript['sites/all/modules/contrib/auto_nodetitle/auto_nodetitle.js'])) {
    unset($javascript['sites/all/modules/contrib/auto_nodetitle/auto_nodetitle.js']);
  }

  // Replace metatag's metatag.admin.js with this theme's version.
  if (isset($javascript[$metatag . '/metatag.admin.js'])) {
    $mt = $theme . '/js/metatag.admin.js';
    $javascript[$metatag . '/metatag.admin.js']['data'] = $mt;
  }

  // Replace Google Chart Tools google_chart_tools.js with this theme's version.
  if (isset($javascript[$google_charts . '/google_chart_tools.js'])) {
    $gct = $theme . '/js/google_chart_tools.js';
    $javascript[$google_charts . '/google_chart_tools.js']['data'] = $gct;
  }
}

/**
 * Implements hook_mail_alter().
 */
function bootstrap_ndsbs_mail_alter(&$message) {
  $default_from = variable_get('site_mail', ini_get('sendmail_from'));
  $message['headers']['Sender'] = $message['headers']['Return-Path'] = $default_from;
  $message['headers']['From'] = variable_get('site_name', 'Drupal') . ' <' . $default_from . '>';

  // We only want to alter the email if it's being
  // generated by the site-wide contact form page.
  if ($message['id'] == 'contact_page_mail'
    || $message['id'] == 'contact_page_copy') {
    if (isset($message['params']['phone']) && $message['params']['phone'] != '') {
      $phone = $message['params']['phone'];
      $message['body'][] = t('Phone: @phone', array('@phone' => $phone));
    }

    if (isset($message['params']['assessment_type']) && $message['params']['assessment_type'] != '') {
      $assessments = array();

      foreach ($message['params']['assessment_type'] as $key => $value) {
        if ($value != '0') {
          $assessments[] = $value;
        }
      }

      $needs = implode(', ', $assessments);
      $message['body'][] = t('Assessment needs: @needs', array('@needs' => $needs));
    }

    if (isset($message['params']['preferred_contact']) && $message['params']['preferred_contact'] != '') {
      $contacts = array();

      foreach ($message['params']['preferred_contact'] as $key => $value) {
        if ($value != '0') {
          $contacts[] = $value;
        }
      }

      $contact = implode(', ', $contacts);
      $message['body'][] = t('Preferred contact: @contact', array('@contact' => $contact));
    }
  }
}

/**
 * Implements hook_menu_breadcrumb_alter().
 */
function bootstrap_ndsbs_menu_breadcrumb_alter(&$active_trail, $item) {
  $home = isset($active_trail[0]) ? $active_trail[0] : 0;
  $about = isset($active_trail[1]) && isset($active_trail[1]['link_title']) && $active_trail[1]['link_title'] == 'About';

  if ($home) {
    $active_trail[0]['title'] = 'NDSBS';
  }

  if ($about) {
    unset($active_trail[1]);

    if (isset($active_trail[2])) {
      unset($active_trail[2]);
    }
  }
}

/**
 * Implements hook_node_view_alter().
 */
function bootstrap_ndsbs_node_view_alter(&$build) {
  $title = $build['#node']->title;

  foreach ($build['links']['node']['#links'] as $module => $link) {
    if ($module == 'node-readmore') {
      $link_title = 'Read More <span class="sr-only">' . $title . '</span>';
      $build['links']['node']['#links']['node-readmore']['title'] = $link_title;
    }
  }
}
