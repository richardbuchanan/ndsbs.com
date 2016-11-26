<?php

include_once drupal_get_path('theme', 'coeus') .
  '/includes/browser-detection.inc';

/**
 * Prepares variables for HTML templates.
 *
 * Default template: html.tpl.php.
 *
 * @param array $vars
 *   An associative array containing:
 *   - drupal_add_css: An associative array containing the properties of
 *     css files being added to the HTML head element.
 *     Properties used: #type, #group, #every_page, and #browsers.
 */
function coeus_preprocess_html(&$vars) {
  $browser_name = browser_detection('browser_name');
  // Adds the Open Sans Google Font as external stylesheets. We want Drupal to 
  // keep track of our stylesheets for us.
  drupal_add_css('https://fonts.googleapis.com/css?family=Open+Sans', array(
    'type' => 'external',
    'group' => CSS_THEME,
    'every_page' => TRUE
  ));

	// Adds our custom minified version of modernizr script. We only selected
	// HTML5 elements for our script, which will add classes to the HTML tag to
	// target HTML5 compatible browsers.
  drupal_add_js(path_to_theme() . '/js/modernizr.custom.min.js');

  // HTML element attributes.
  $vars['html_attributes_array'] = array(
    'class' => array($browser_name),
    'lang' => $vars['language']->language,
    'dir' => $vars['language']->dir,
  );

  // Serialize RDF Namespaces into an RDFa 1.1 prefix attribute.
  if ($vars['rdf_namespaces'] && function_exists('rdf_get_namespaces')) {
    $vars['rdf'] = array('prefix' => '');
    foreach (rdf_get_namespaces() as $prefix => $uri) {
      $vars['rdf']['prefix'] .= $prefix . ': ' . $uri . ' ';
    }
    $vars['rdfa_namespaces'] = drupal_attributes($vars['rdf']);
  }
  
  // Define variable to be called for html lang and dir tags.
  $vars['html_attributes'] = drupal_attributes(
    $vars['html_attributes_array']);
}

/**
 * Prepares variables for HTML templates.
 *
 * Default template: html.tpl.php.
 *
 * @param array $vars
 *   An associative array containing:
 *   - element: An associative array containing the properties of
 *     unneeded HTML tags.
 *     Properties used: #attributes, #value_prefix, and #value_suffix.
 */
function coeus_preprocess_html_tag(&$vars) {
  $el = &$vars['element'];

  // Remove type="..." attributes from style, script, and link elements.
  if (in_array($el['#tag'], array('script', 'link', 'style'))) {
    unset($el['#attributes']['type']);
  }

  // Remove CDATA prefix comments.
  if (isset($el['#value_prefix'])
    && ($el['#value_prefix'] == "\n<!--//--><![CDATA[//><!--\n"
    || $el['#value_prefix'] == "\n<!--/*--><![CDATA[/*><!--*/\n")) {
      unset($el['#value_prefix']);
  }

  // Remove CDATA suffix comments.
  if (isset($el['#value_suffix'])
    && ($el['#value_suffix'] == "\n//--><!]]>\n"
    || $el['#value_suffix'] == "\n/*]]>*/-->\n")) {
      unset($el['#value_suffix']);
  }

  // Remove media="all" attributes, leaving others alone.
  if (isset($el['#attributes']['media']) &&
    $el['#attributes']['media'] === 'all') {
      unset($el['#attributes']['media']);
  }
  
  // xml:lang alone is invalid in HTML5. Use the lang attribute instead.
  if (isset($vars['attributes_array']['lang'])) {
    $vars['attributes_array']['lang'] = '';
  }
  unset($vars['attributes_array']['xml:lang']);
  unset($vars['attributes_array']['property']);
  unset($vars['attributes_array']['rel']);
}

/**
 * Implements hook_html_head_alter()
 *
 * @todo Detect the which Apple device is being used and select the correct
 *   touch icon and add it to the head. Also verify the head element is
 *   is following the W3C semantic guidelines outlined at
 *   @link http://tinyurl.com/w3c-html5-semantics-head @endlink.
 */
function coeus_html_head_alter(&$head_elements) {
  // Create browser name variable from the browser_detection script.
  $browser_name = browser_detection('browser_name');
  // Set some variables for page title, site name, and site slogan.
  $page_title = drupal_get_title();
  $site_name = variable_get('site_name');
  $site_slogan = variable_get('site_slogan');

  // Check if the page title is empty.
  if ($page_title != '') {
    // If true, set a default title using site name.
    $page_title = implode(' | ', array(
      $page_title,
      $site_name
    ));
  }
  
  else {
    $page_title = $site_name;
  }

	// If site slogan is given, add this to our head title.
  if ($site_slogan != '') {
    $page_title = implode(' - ', array(
      $page_title,
      $site_slogan
    ));
  }
	// Strip all tags from our new head title. We do this so " " is removed from
	// the head title.
  $coeus_title = strip_tags($page_title);

	// Remove Drupal's 'Generator' and the 'Content-Type' attributes.
  unset($head_elements['system_meta_generator']);
  unset($head_elements['system_meta_content_type']);

  // Add the utf-8 character set to all browsers.
  $head_elements['character_set'] = array(
    '#type' => 'html_tag',
    '#tag' => 'meta',
    '#attributes' => array(
      'charset' => 'utf-8'
    ),
    '#weight' => -10
  );

  // Set head title using the custom strings above.
  //$head_elements['head_title'] = array(
    //'#type' => 'html_tag',
    //'#tag' => 'title',
    //'#value' => $coeus_title,
    //'#weight' => -9
  //);

  // Uses the latest IE rendering engine and Google Chrome Frame for IE.
	// Setting this here results in no <!-- --> comments in our HTML.
  if ($browser_name == 'msie') {
    $head_elements['chrome_frame'] = array(
      '#type' => 'html_tag',
      '#tag' => 'meta',
      '#attributes' => array(
        'http-equiv' => 'X-UA-Compatible',
        'content' => 'IE=edge,chrome=1'
      ),
      '#weight' => -8
    );
  }

  // Ensure proper rendering and touch zooming.
  $head_elements['view_port'] = array(
    '#type' => 'html_tag',
    '#tag' => 'meta',
    '#attributes' => array(
      'name' => 'viewport',
      'content' => 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
    ),
    '#weight' => -7
  );
}

/**
 * Preprocess variables for page.tpl.php
 */
function coeus_preprocess_page(&$vars) {
  // Set some variables for page title, site name, and site slogan.
  $page_title = drupal_get_title();
  $site_name = variable_get('site_name');
  $site_slogan = variable_get('site_slogan');
  
  // Change common page titles.
  global $user;
  // Set annonymous user page titles.
  if (!$user->uid) {
    if (((arg(0) == 'user') && (arg(1) == '')) || (arg(1) == 'login')) {
      // Set login page title.
      drupal_set_title('Login');
    }
    if (arg(1) == 'password') {
      // Set password reset page title.
      drupal_set_title('Request New Password');
    }
    if (arg(1) == 'register') {
      // Set password reset page title.
      drupal_set_title('Register');
    }
  }
  
  // Set global page titles.
  if (arg(0) == 'contact') {
    drupal_set_title('Contact Us');
  }

  // If site slogan does not exist, use just the site name for logo title.
  //if (empty($site_slogan)) {
    //$page_title = $site_name;
  //}

	// If site slogan exists, add this to our logo title.
  //if ($site_slogan != NULL) {
    //$page_title = implode(' - ', array(
      //$page_title,
      //$site_slogan
    //));
  //}

  // Set up logo element with the logo path, alt tag, and attributes.
  global $base_root;
  $logo_path = str_replace($base_root."/", "", $vars['logo']);
  $logo_details = image_get_info($logo_path);
  $logo_alt = $site_name;
  $logo_vars = array(
    'path' => $logo_path,
    'alt' => $logo_alt,
    'attributes' => array(
      'class' => 'site-logo'
    ),
    'width'  => $logo_details['width'],
    'height' => $logo_details['height'],
  );

  // Override the default logo element with custom variables set above.
  $vars['logo_img'] = theme('image', $logo_vars);
  $vars['site_logo'] = $vars['logo_img'] ? l($vars['logo_img'],
    '<front>', array(
      'attributes' => array(
        'title' => check_plain($logo_alt)
      ),
      'html' => TRUE
    )
  ) : '';
}

/**
* Changes the search form to use the "search" input element of HTML5.
*/
function coeus_preprocess_search_block_form(&$vars) {
  $vars['search_form'] = str_replace(
    'type="text"',
    'type="search"',
    $vars['search_form']
  );
}

/* Put Breadcrumbs in a ul li structure */
function coeus_breadcrumb($vars) {
  $bc = $vars['breadcrumb'];
  if (!empty($bc)) {
    // Provide a navigational heading to give context for breadcrumb links to
    // screen-reader users. Make the heading invisible with 
    // .element-invisible.
    $output = '<h2 class="element-invisible">' . t('You are here') . '</h2>';
    $bc_separator = '<span class="breadcrumb-separator"> / </span>';
    $cpage = '<span class="breadcrumb-separator"> / </span>'.drupal_get_title();
    $output .= '<div class="breadcrumb">'.implode
      ($bc_separator, $bc).$cpage.'</div>';
    return $output;
  }
}

function region_empty($sidebar) {
  /* Check to see if a region is occupied
   * returns 1 if it's empty
   */
  $test_empty = 1;
  $result = db_query_range('SELECT n.pages, n.visibility FROM {blocks} n WHERE n.region="%s" AND n.theme="%s"', $sidebar, $GLOBALS['theme'], 0, 10);
  if (count($result) > 0) {
    while ($node = db_fetch_object($result))
    {
      if ($node->visibility < 2) {
        $path = drupal_get_path_alias($_GET['q']);
        // Compare with the internal and path alias (if any).
        $page_match = drupal_match_path($path, $node->pages);
        if ($path != $_GET['q']) {
          $page_match = $page_match || drupal_match_path($_GET['q'], $node->pages);
        }
        // When $block->visibility has a value of 0, the block is displayed on
        // all pages except those listed in $block->pages. When set to 1, it
        // is displayed only on those pages listed in $block->pages.
        $page_match = !($node->visibility xor $page_match);
      } else {
        $page_match = drupal_eval($block->pages);
      }
      if ($page_match)
        $test_empty = 0;
    }
  }
  return $test_empty;
}

function coeus_form_alter(&$form, &$form_state, $form_id) {
  if ($form_id == 'search_block_form') {
    // Define size of the textfield 
    $form['search_block_form']['#size'] = 20;
    // Alternative (HTML5) placeholder attribute instead of using the javascript
    $form['search_block_form']['#attributes']['placeholder'] = t('Search');
  }
}

/**
 * Implements hook_preprocess_username().
 */
function coeus_preprocess_username(&$vars) {
  // xml:lang alone is invalid in HTML5. Use the lang attribute instead.
  if (empty($vars['attributes_array']['lang'])) {
    $vars['attributes_array']['lang'] = '';
  }
  unset($vars['attributes_array']['xml:lang']);
  unset($vars['attributes_array']['property']);
  unset($vars['attributes_array']['rel']);
}
