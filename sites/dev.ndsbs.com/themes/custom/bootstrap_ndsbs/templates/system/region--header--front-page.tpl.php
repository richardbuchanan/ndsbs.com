<?php

/**
 * @file
 * Bootstrap implementation to display the header region.
 *
 * Available variables:
 * - $content: The content for this region, typically blocks.
 * - $classes: String of classes that can be used to style contextually through
 *   CSS. It can be manipulated through the variable $classes_array from
 *   preprocess functions. The default values can be one or more of the following:
 *   - region: The current template type, i.e., "theming hook".
 *   - region-[name]: The name of the region with underscores replaced with
 *     dashes. For example, the page_top region would have a region-page-top class.
 * - $region: The name of the region variable as defined in the theme's .info file.
 *
 * Helper variables:
 * - $classes_array: Array of html class attribute values. It is flattened
 *   into a string within the variable $classes.
 * - $is_admin: Flags true when the current user is an administrator.
 * - $is_front: Flags true when presented in the front page.
 * - $logged_in: Flags true when the current user is a logged-in member.
 *
 * @see template_preprocess()
 * @see template_preprocess_region()
 * @see template_process()
 *
 * @ingroup themeable
 */
?>
<?php if ($content): ?>
  <header class="navbar navbar-default navbar-static-top header-brand pull-left" id="top" role="banner">
    <div class="navbar-header">
      <button class="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target="#header-navbar" aria-controls="header-navbar" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a href="<?php global $base_url; print $base_url; ?>" class="navbar-brand" title="<?php print t('Home'); ?>">
        <div itemprop="publisher" itemscope itemtype="https://schema.org/Organization">
          <meta itemprop="url" content="<?php print $base_url; ?>">
          <div itemprop="logo" itemscope itemtype="https://schema.org/ImageObject">
            <img src="<?php print theme_get_setting('logo'); ?>" alt="<?php print t('Home'); ?>" height="65" />
            <meta itemprop="url" content="<?php print theme_get_setting('logo'); ?>">
            <meta itemprop="width" content="203">
            <meta itemprop="height" content="65">
          </div>
          <meta itemprop="name" content="<?php print variable_get('site_name'); ?>">
        </div>
        <div itemprop="image" itemscope itemtype="https://schema.org/ImageObject">
          <img src="<?php print theme_get_setting('logo'); ?>" class="hidden" />
          <meta itemprop="url" content="<?php print theme_get_setting('logo'); ?>">
          <meta itemprop="width" content="203">
          <meta itemprop="height" content="60">
        </div>
      </a>
    </div>
    <div class="navbar-contact pull-right">
      <h3><span class="call-us"><?php print variable_get('SA_ADMIN_PHONE'); ?></span></h3>
    </div>
  </header>
  <div class="navbar navbar-default navbar-static-top header-nav pull-right">
    <nav id="header-navbar" class="navbar-collapse collapse">
      <?php print $content; ?>
    </nav>
  </div>
<?php endif; ?>
