<?php

/**
 * @file
 * Process theme data for bootstrap_ndsbs.
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
 * Implements template_preprocess_html().
 */
function bootstrap_ndsbs_preprocess_html(&$variables) {
  date_default_timezone_set('America/New_York');
  if ($variables['user']) {
    foreach ($variables['user']->roles as $key => $role) {
      $role_class = 'role-' . str_replace(' ', '-', $role);
      $variables['classes_array'][] = $role_class;
    }
  }
  $node = node_load('1670');
  $front_page_title = $node->metatags['und']['title']['value'];

  if (drupal_is_front_page() && !empty($front_page_title)) {
    $variables['head_title'] = $front_page_title;
  }
}

/**
 * Implements template_preprocess_page().
 */
function bootstrap_ndsbs_preprocess_page(&$variables) {
  $path = current_path();
  $left_col = array('col-xs-12', 'col-sm-12', 'col-md-12');
  $right_col = array('col-xs-12', 'col-sm-12', 'col-md-4');
  $nav_col = array('col-xs-12', 'col-sm-12', 'col-md-3', 'sidebar-offcanvas');

  if ($path == 'contact') {
    $left_col = array('col-xs-12', 'col-sm-12', 'col-md-7');
    $right_col = array('col-xs-12', 'col-sm-12', 'col-md-5');
    unset($variables['page']['navigation_sidebar']);
  }

  if ($path != 'contact' && (!empty($variables['page']['sidebar']) || !empty($variables['page']['navigation_sidebar']))) {
    if ($variables['page']['sidebar'] && $variables['page']['navigation_sidebar']) {
      $left_col = array('col-xs-12', 'col-sm-12', 'col-md-5');
    }
    elseif ($variables['page']['sidebar'] && !$variables['page']['navigation_sidebar']) {
      $left_col = array('col-xs-12', 'col-sm-12', 'col-md-8');
    }
    else {
      $left_col = array('col-xs-12', 'col-sm-12', 'col-md-9');
    }
  }

  $left_col_attr = array(
    'id' => 'left-content',
    'class' => $left_col,
    'role' => 'main',
  );

  $right_col_attr = array(
    'id' => 'right-content',
    'class' => $right_col,
    'role' => 'complementary',
  );

  $nav_col_attr = array(
    'id' => 'navigation-content',
    'class' => $nav_col,
    'role' => 'complementary',
  );

  $variables['left_col_attributes'] = drupal_attributes($left_col_attr);
  $variables['right_col_attributes'] = drupal_attributes($right_col_attr);
  $variables['nav_col_attributes'] = drupal_attributes($nav_col_attr);

  switch ($path) {
    case 'contact':
      drupal_set_title('Contact us');
      break;
  }

  if ($variables['is_front']) {
    $variables['page']['navigation_sidebar'] = array();
    $variables['page']['sidebar'] = array();

    $left_col_attr = array(
      'id' => 'left-content',
      'class' => array('col-xs-12', 'col-sm-12', 'col-md-12'),
      'role' => 'main',
    );

    $variables['left_col_attributes'] = drupal_attributes($left_col_attr);

    foreach ($variables['page']['content']['system_main']['nodes'] as $key => $node) {
      if (is_array($node['field_carousel'])) {
        $variables['page']['field_carousel'] = $node['field_carousel'];
      }
      if (is_array($node['field_welcome_image'])) {
        $variables['page']['field_welcome_image'] = $node['field_welcome_image'];
      }
      if (is_array($node['field_welcome_message'])) {
        $variables['page']['field_welcome_message'] = $node['field_welcome_message'];
      }
      if (is_array($node['field_our_team_image'])) {
        $variables['page']['field_our_team_image'] = $node['field_our_team_image'];
      }
      if (is_array($node['field_our_team_message'])) {
        $variables['page']['field_our_team_message'] = $node['field_our_team_message'];
      }
      if (is_array($node['field_our_services_image'])) {
        $variables['page']['field_our_services_image'] = $node['field_our_services_image'];
      }
      if (is_array($node['field_our_services_message'])) {
        $variables['page']['field_our_services_message'] = $node['field_our_services_message'];
      }
      if (is_array($node['field_better_business_bureau'])) {
        $variables['page']['field_better_business_bureau'] = $node['field_better_business_bureau'];
      }
      if (is_array($node['field_accepted_payments'])) {
        $variables['page']['field_accepted_payments'] = $node['field_accepted_payments'];
      }
      if (is_array($node['field_choose_us'])) {
        $variables['page']['field_choose_us'] = $node['field_choose_us'];
      }
    }
    $variables['page']['front_main_menu'] = menu_tree(variable_get('menu_main_links_source', 'main-menu'));

    $breadcrumb = array();
    $breadcrumb[] = l('New Directions Substance and Behavioral Services', '<front>');

    // Set Breadcrumbs
    drupal_set_breadcrumb($breadcrumb);
  }

  if ($path == 'user/payment/confirmation') {
    $transactions = get_user_transactions(1);
    $assessment_node = node_load($transactions[0]->nid);
    $assessment_user = user_load($transactions[0]->uid);
    $assessment_title = $assessment_node->title;
    $rush_cost = !(empty($_SESSION['ndsbs_payment']['rush_amount'])) ? $_SESSION['ndsbs_payment']['rush_amount'] : number_format(0, 2);
    $variables['payment']['order_id'] = $transactions[0]->order_id;
    $variables['payment']['user_email'] = $assessment_user->mail;
    $variables['payment']['assessment'] = $assessment_title;
    $variables['payment']['cost'] = $transactions[0]->cost;
    $variables['payment']['rush_cost'] = number_format($rush_cost, 2);
    $variables['payment']['total_cost'] = number_format($transactions[0]->cost + $rush_cost, 2);
  }

  $variables['breadcrumb_attributes_array']['class'] = array('hidden');
}

/**
 * Implements template_process_page().
 */
function bootstrap_ndsbs_process_page(&$variables) {
  $variables['breadcrumb_attributes'] = drupal_attributes($variables['breadcrumb_attributes_array']);
}

/**
 * Implements template_preprocess_node().
 */
function bootstrap_ndsbs_preprocess_node(&$variables) {
  global $user, $base_url;
  $path = drupal_get_path_alias(current_path());
  $node = $variables['node'];

  if ($variables['type'] == 'assessment') {
    $node_arg = arg(1);
    $service_tid = $variables['field_primary_service']['und'][0]['tid'];
    $link_path = drupal_lookup_path('alias', 'node/' . arg(1));

    if ($user->uid && $path != 'assessment/special/rush-order') {
      $variables['redirect_url'] = $base_url . '/user/cart/nid/' . $node_arg . '/tid/' . $service_tid;
    }
    elseif ($path == 'assessment/special/rush-order') {
      $variables['redirect_url'] = $base_url . '/user/cart/nid/' . $node_arg . '/tid/' . $service_tid;
    }
    else {
      $variables['redirect_url'] = $base_url . '/user/login?destination=' . $link_path;
    }
  }

  if ($node->type == 'blog') {
    $author = user_load($variables['uid']);
    $name = isset($author->field_first_name['und'][0]['value']) ? $author->field_first_name['und'][0]['value'] : '';
    $name .= isset($author->field_middle_name['und'][0]['value']) ? ' ' . $author->field_middle_name['und'][0]['value'] : '';
    $name .= isset($author->field_last_name['und'][0]['value']) ? ' ' . $author->field_last_name['und'][0]['value'] : '';
    $name .= isset($author->field_therapist_degree['und'][0]['value']) ? ' ' . $author->field_therapist_degree['und'][0]['value'] : '';

    $created = $variables['created'];
    $date = format_date($created, $type = 'blog_date');
    $variables['submitted'] = t('<span class="glyphicon glyphicon-calendar" aria-hidden="true"></span> !datetime by !username', array('!username' => $variables['name'], '!datetime' => $date));

    $variables['content']['links']['blog']['#links']['blog_usernames_blog']['title'] = $name . '\'s blog';
    $variables['content']['links']['blog']['#links']['blog_usernames_blog']['href'] = 'blog';

    if ($variables['teaser'] && !drupal_is_front_page()) {
      unset($variables['content']['links']['blog']);
    }
  }
  if ($variables['title'] == 'Rush order') {
    $variables['theme_hook_suggestions'][] = 'node__assessment__rush_order';
  }
  if ($variables['nid'] == '3965') {
    $variables['theme_hook_suggestions'][] = 'node__assessment__misc_services';
  }
}

/**
 * Implements template_preprocess_breadcrumb().
 */
function bootstrap_ndsbs_preprocess_breadcrumb(&$variables) {
  $attributes_array = array(
    'id' => 'ndsbs-breadcrumbs',
    'class' => array(
      'breadcrumb',
    ),
    'vocab' => 'http://schema.org/',
    'typeof' => 'BreadcrumbList',
  );

  $list_item_attributes_array = array(
    'property' => 'itemListElement',
    'typeof' => 'ListItem',
  );

  $variables['attributes'] = drupal_attributes($attributes_array);
  $variables['list_item_attributes'] = drupal_attributes($list_item_attributes_array);

  foreach ($variables['breadcrumb'] as $key => $crumb) {
    $assessments = '<a href="/" title="">Assessments</a>';
    $rush = '<a href="/" title="">Rush order</a>';

    if ($crumb == $assessments || $crumb == $rush) {
      $crumb = '<a href="/view/assessment/status" title="">Assessments</a>';
    }

    $new_crumb = str_replace('<a href', '<a property="item" typeof="WebPage" href', $crumb);
    $new_crumb = str_replace('">', '"><span property="name">', $new_crumb);
    $new_crumb = str_replace('</a>', '</span></a>', $new_crumb);

    $variables['breadcrumb'][$key] = $new_crumb;

    if (preg_match('/briantdavis/', $new_crumb)) {
      unset($variables['breadcrumb'][$key]);
    }
  }

  // Add the current page to the breadcrumb for structured data.
  $title = '<span property="name">' . drupal_get_title() . '</span>';
  $options = array(
    'html' => TRUE,
    'attributes' => array(
      'property' => 'item',
      'typeof' => 'WebPage',
    ),
  );

  if (!drupal_is_front_page()) {
    $variables['breadcrumb'][] = l($title, drupal_get_path_alias(), $options);
  }
}

/**
 * Implements hook_menu_breadcrumb_alter().
 */
function bootstrap_ndsbs_menu_breadcrumb_alter(&$active_trail, $item) {
  $home = isset($active_trail[0]) ? $active_trail[0] : 0;
  $about = isset($active_trail[1]) && $active_trail[1]['link_title'] == 'About';

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
 * Implements template_preprocess_HOOK().
 */
function bootstrap_ndsbs_preprocess_link(&$variables) {
  $current_path = explode('/', current_path());
  $path = explode('/', $variables['path']);
  $questionnaire_path = $path[0] == 'user' && $path[1] == 'questionnaire';
  $questionnaire_page = $current_path[0] == 'user' && $current_path[1] == 'questionnaire';

  if ($questionnaire_path && $questionnaire_page) {
    foreach ($variables['options']['attributes']['class'] as $key => $class) {
      if ($class == 'active') {
        unset($variables['options']['attributes']['class'][$key]);
      }
    }
  }
}

/**
 * Implements template_preprocess_username().
 */
function bootstrap_ndsbs_preprocess_username(&$variables) {
  $type = isset($variables['account']->type) ? $variables['account']->type : '';

  if ($type == 'blog') {
    $author = user_load($variables['uid']);
    $name = isset($author->field_first_name['und'][0]['value']) ? $author->field_first_name['und'][0]['value'] : '';
    $name .= isset($author->field_middle_name['und'][0]['value']) ? ' ' . $author->field_middle_name['und'][0]['value'] : '';
    $name .= isset($author->field_last_name['und'][0]['value']) ? ' ' . $author->field_last_name['und'][0]['value'] : '';
    $name .= isset($author->field_therapist_degree['und'][0]['value']) ? ' ' . $author->field_therapist_degree['und'][0]['value'] : '';

    $variables['name'] = $name;
    $variables['name_raw'] = $name;
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

/**
 * Implements template_preprocess_block().
 */
function bootstrap_ndsbs_preprocess_block(&$variables) {
  $elements = $variables['elements'];
  switch ($variables['block_html_id']) {
    case 'block-system-main-menu':
      $assessments = str_replace('Assessments</a><ul id="main-menu"', 'Assessments</a><ul id="main-menu-assessments"', $variables['content']);
      $about = str_replace('About</a><ul id="main-menu"', 'About</a><ul id="main-menu-about"', $assessments);
      $content = str_replace('class="nav navbar-nav"', 'class="nav navbar-nav nav-justified"', $about);
      $variables['content'] = $content;
      break;
  }
}

/**
 * Implements template_preprocess_menu_tree().
 */
function bootstrap_ndsbs_preprocess_menu_tree(&$variables) {
  $tree = new DOMDocument();
  @$tree->loadHTML($variables['tree']);
  $links = $tree->getElementsByTagName('li');
  $parent = '';

  foreach ($links as $link) {
    $parent = $link->getAttribute('data-menu-parent');
    break;
  }

  $variables['menu_parent'] = $parent;
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
 * Implements hook_form_alter().
 */
function bootstrap_ndsbs_form_alter(&$form, &$form_state, $form_id) {
  global $user;
  drupal_add_js(drupal_get_path('theme', 'bootstrap_ndsbs') . '/js/jquery.mask.min.js');

  if (isset($form['#entity_type'])) {
    if ($form['#entity_type'] == 'comment' && isset($form['author']['homepage'])) {
      $form['author']['homepage']['#access'] = FALSE;
    }
  }
}

/**
 * Implements hook_form_FORM_ID_alter().
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
 * Processes contact form submissions.
 */
function bootstrap_ndsbs_contact_form_submit($form, &$form_state) {
  drupal_goto('contact');
}

/**
 * Implements hook_mail_alter().
 */
function bootstrap_ndsbs_mail_alter(&$message) {
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
 * Implements hook_form_FORM_ID_alter().
 */
function bootstrap_ndsbs_form_user_register_form_alter(&$form, &$form_state, $form_id) {
  $form['#attached']['js'] = array(
    drupal_get_path('theme', 'bootstrap_ndsbs') . '/js/user-register.js',
  );
}

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
 * Implements hook_menu_tree().
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
 * Implements hook_menu_tree().
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
 * Implements hook_menu_tree().
 */
function bootstrap_ndsbs_menu_tree__user_menu(&$variables) {
  if ($variables['menu_parent'] == 'user-navigation-menu') {
    return '<ul class="nav nav-user-tree">' . $variables['tree'] . '</ul>';
  }
  else {
    return '<ul class="nav navbar-nav navbar-right">' . $variables['tree'] . '</ul>';
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
 * Implements template_preprocess_views_view_fields().
 */
function bootstrap_ndsbs_preprocess_views_view_fields(&$variables) {
  $view = $variables['view']->name;

  if ($view == 'staff_profiles') {
  }
}

/**
 * Implements theme_field__FIELD__CONTENT_TYPE().
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
    $output .= '<div class="field-label"' . $variables['title_attributes'] . '>' . $variables['label'] . ':&nbsp;</div>';
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
 * Implements theme_field__FIELD__CONTENT_TYPE().
 */
function bootstrap_ndsbs_field__field_welcome_image__front_page($variables) {
  $output = '';

  // Render the label, if it's not hidden.
  if (!$variables['label_hidden']) {
    $output .= '<div class="field-label"' . $variables['title_attributes'] . '>' . $variables['label'] . ':&nbsp;</div>';
  }

  // Render the items.
  $output .= '<div class="field-items"' . $variables['content_attributes'] . '>';
  foreach ($variables['items'] as $delta => $item) {
    $classes = 'field-item ' . ($delta % 2 ? 'odd' : 'even');
    $output .= '<div class="' . $classes . '"' . $variables['item_attributes'][$delta] . '>' . drupal_render($item) . '</div>';
  }
  $output .= '</div>';

  // Render the top-level DIV.
  $output = '<div class="' . $variables['classes'] . '"' . $variables['attributes'] . '>' . $output . '</div>';

  return $output;
}

/**
 * Implements theme_field__FIELD__CONTENT_TYPE().
 */
function bootstrap_ndsbs_field__field_welcome_message__front_page($variables) {
  $output = '';

  // Render the label, if it's not hidden.
  if (!$variables['label_hidden']) {
    $output .= '<div class="field-label"' . $variables['title_attributes'] . '>' . $variables['label'] . ':&nbsp;</div>';
  }

  // Render the items.
  $output .= '<div class="field-items"' . $variables['content_attributes'] . '>';
  foreach ($variables['items'] as $delta => $item) {
    $classes = 'field-item ' . ($delta % 2 ? 'odd' : 'even');
    $output .= '<div class="' . $classes . '"' . $variables['item_attributes'][$delta] . '>' . drupal_render($item) . '</div>';
  }
  $output .= '</div>';

  // Render the top-level DIV.
  $output = '<div class="' . $variables['classes'] . '"' . $variables['attributes'] . '>' . $output . '</div>';

  return $output;
}

/**
 * Implements hook_field_collection_view().
 */
function bootstrap_ndsbs_field_collection_view($variables) {
  $element = $variables['element'];
  foreach ($element['entity']['field_collection_item'] as $item) {
    if ($item['#bundle'] == 'field-carousel') {
      $element['links']['#links']['edit']['title'] = 'Edit carousel';
    }
  }
  return '<div' . drupal_attributes($element['#attributes']) . '>' . $element['#children'] . '</div>';
}

/**
 * Implements hook_token_tree_link().
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
 * Theme a tree table.
 *
 * @ingroup themeable
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

/**
 * Provide a 'tree' display of nested tokens.
 *
 * @ingroup themeable
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

function bootstrap_ndsbs_preprocess_payment(&$variables) {
  drupal_add_js(drupal_get_path('theme', 'bootstrap_ndsbs') . '/js/payment.js');
}
