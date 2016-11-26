<?php
/**
 * @file
 * Zen theme's implementation to display the basic html structure of a single
 * Drupal page.
 *
 * Variables:
 * - $css: An array of CSS files for the current page.
 * - $language: (object) The language the site is being displayed in.
 *   $language->language contains its textual representation. $language->dir
 *   contains the language direction. It will either be 'ltr' or 'rtl'.
 * - $html_attributes: String of attributes for the html element. It can be
 *   manipulated through the variable $html_attributes_array from preprocess
 *   functions.
 * - $html_attributes_array: Array of html attribute values. It is flattened
 *   into a string within the variable $html_attributes.
 * - $rdf_namespaces: All the RDF namespace prefixes used in the HTML document.
 * - $grddl_profile: A GRDDL profile allowing agents to extract the RDF data.
 * - $head_title: A modified version of the page title, for use in the TITLE
 *   tag.
 * - $head_title_array: (array) An associative array containing the string parts
 *   that were used to generate the $head_title variable, already prepared to be
 *   output as TITLE tag. The key/value pairs may contain one or more of the
 *   following, depending on conditions:
 *   - title: The title of the current page, if any.
 *   - name: The name of the site.
 *   - slogan: The slogan of the site, if any, and if there is no title.
 * - $head: Markup for the HEAD section (including meta tags, keyword tags, and
 *   so on).
 * - $default_mobile_metatags: TRUE if default mobile metatags for responsive
 *   design should be displayed.
 * - $styles: Style tags necessary to import all CSS files for the page.
 * - $scripts: Script tags necessary to load the JavaScript files and settings
 *   for the page.
 * - $skip_link_anchor: The HTML ID of the element that the "skip link" should
 *   link to. Defaults to "main-menu".
 * - $skip_link_text: The text for the "skip link". Defaults to "Jump to
 *   Navigation".
 * - $page_top: Initial markup from any modules that have altered the
 *   page. This variable should always be output first, before all other dynamic
 *   content.
 * - $page: The rendered page content.
 * - $page_bottom: Final closing markup from any modules that have altered the
 *   page. This variable should always be output last, after all other dynamic
 *   content.
 * - $classes: String of classes that can be used to style contextually through
 *   CSS. It should be placed within the <body> tag. When selecting through CSS
 *   it's recommended that you use the body tag, e.g., "body.front". It can be
 *   manipulated through the variable $classes_array from preprocess functions.
 *   The default values can contain one or more of the following:
 *   - front: Page is the home page.
 *   - not-front: Page is not the home page.
 *   - logged-in: The current viewer is logged in.
 *   - not-logged-in: The current viewer is not logged in.
 *   - node-type-[node type]: When viewing a single node, the type of that node.
 *     For example, if the node is a Blog entry, this would be "node-type-blog".
 *     Note that the machine name of the content type will often be in a short
 *     form of the human readable label.
 *   The following only apply with the default sidebar_first and sidebar_second
 *   block regions:
 *     - two-sidebars: When both sidebars have content.
 *     - no-sidebars: When no sidebar content exists.
 *     - one-sidebar and sidebar-first or sidebar-second: A combination of the
 *       two classes when only one of the two sidebars have content.
 *
 * @see template_preprocess()
 * @see template_preprocess_html()
 * @see zen_preprocess_html()
 * @see template_process()
 */
global $base_url;
$favicon = $base_url . '/' . drupal_get_path('theme', 'ndsbs') . '/favicon.ico';
?>
<!DOCTYPE html>

<!--[if IEMobile 7] ><html class="iem7" <?php print $html_attributes; ?> itemscope itemtype="http://schema.org/WebPage"><![endif]-->
<!--[if lte IE 6] ><html class="lt-ie9 lt-ie8 lt-ie7" <?php print $html_attributes; ?> itemscope itemtype="http://schema.org/WebPage"><![endif]-->
<!--[if (IE 7)&(!IEMobile)] ><html class="lt-ie9 lt-ie8" <?php print $html_attributes; ?> itemscope itemtype="http://schema.org/WebPage"><![endif]-->
<!--[if IE 8] ><html class="lt-ie9" <?php print $html_attributes; ?> itemscope itemtype="http://schema.org/WebPage"><![endif]-->
<html <?php print $html_attributes . $rdf_namespaces; ?>>
<head itemscope itemtype="http://schema.org/WebSite" profile="<?php print $grddl_profile; ?>">
  <?php print $head; ?>
  <meta content="<?php print $favicon; ?>" itemprop="image">
  <?php $ndsbs_title = $head_title; ?>
  <?php
  if(arg(0) == 'staff') {
    $meta_info = user_load_by_name(arg(1));
    $head_title = $meta_info->metatags['und']['title']['value'] .
      ' | ' . variable_get('site_name');
  }

  $steps_page = 'error';

  if (function_exists('bdg_ndsbs_get_steps_page')) {
    $steps_page = bdg_ndsbs_get_steps_page();
  }
  else {
    $steps_page = $base_url . '/view/assessment/status';
  } ?>
  <title><?php print $head_title; ?></title>
  <meta http-equiv="cleartype" content="on" />
  <meta itemprop="name" content="NDSBS" />
  <meta user-assessment="<?php print $steps_page; ?>" />
  <meta name="google-site-verification" content="MDhPfhcp_76Pxa8YriUC0biEmbwVJnmta8hcrGFxP-Y" />
  <?php print $styles; ?>
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js"></script>
</head>
<body class="<?php print $classes; ?>" <?php print $attributes;?> itemscope itemtype="http://schema.org/WebPage">
  <?php if ($skip_link_text && $skip_link_anchor): ?>
    <span id="skip-link">
      <a href="#<?php print $skip_link_anchor; ?>" class="element-invisible element-focusable"><?php print $skip_link_text; ?></a>
    </span>
  <?php endif; ?>
  <?php print $page_top; ?>
  <?php print $page; ?>
  <?php if ($add_respond_js): ?>
    <!--[if lt IE 9] >
    <script src="<?php print $base_path . $path_to_zen; ?>/js/html5-respond.js"></script>
    <![endif]-->
  <?php elseif ($add_html5_shim): ?>
    <!--[if lt IE 9] >
    <script src="<?php print $base_path . $path_to_zen; ?>/js/html5.js"></script>
    <![endif]-->
  <?php endif; ?>
  <?php print $scripts; ?>
  <script>
    (function() {
      var cx = '004481906494809831981:pcokzjw2d0m';
      var gcse = document.createElement('script');
      gcse.type = 'text/javascript';
      gcse.async = true;
      gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') +
      '//cse.google.com/cse.js?cx=' + cx;
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(gcse, s);
    })();
  </script>
  <?php print $page_bottom; ?>

  <!-- Schema markup for search engines -->
  <div itemscope itemtype="http://schema.org/Organization" class="element-invisible">
    <a itemprop="url" href="https://www.ndsbs.com">
      <div itemprop="name">New Directions Substance and Behavioral Services</div>
    </a>
    <div itemprop="description">Online professional alcohol, drug and anger management assessments accepted by courts and employers in all 50 states.</div>
    <div itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">
      <span itemprop="streetAddress">6797 N High Street Suite 350</span><br>
      <span itemprop="addressLocality">Worthington</span><br>
      <span itemprop="addressRegion">Ohio</span><br>
      <span itemprop="postalCode">43085</span><br>
      <span itemprop="addressCountry">United States</span><br>
    </div>
  </div>

  <div itemscope itemtype="http://schema.org/WebSite" class="element-invisible">
    <meta itemprop="url" content="https://www.ndsbs.com/"/>
    <form itemprop="potentialAction" itemscope itemtype="http://schema.org/SearchAction">
      <meta itemprop="target" content="https://www.ndsbs.com/search/node/{search_term_string}"/>
      <input itemprop="query-input" type="text" name="search_term_string" required/>
      <input type="submit"/>
    </form>
  </div>
  <div class="element-invisible">
    <gcse:search class="element-invisible"></gcse:search>
  </div>
</body>
</html>
