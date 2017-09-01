<?php

/**
 * @file
 * Default theme implementation to display a single Drupal page while offline.
 *
 * All the available variables are mirrored in html.tpl.php and page.tpl.php.
 * Some may be blank but they are provided for consistency.
 *
 * @see template_preprocess()
 * @see template_preprocess_maintenance_page()
 *
 * @ingroup themeable
 */

$head_title = 'Site-offline | New Directions Substance and Behavioral Services';
$site_name = 'New Directions Substance and Behavioral Services';
$logo = 'sites/ndsbs.com/themes/custom/ndsbs/logo.png';
?>
<!DOCTYPE html>
<html lang="<?php print $language->language ?>" dir="<?php print $language->dir ?>" class="uk-height-1-1">
<head>
  <title><?php print $head_title; ?></title>
  <?php print $head; ?>
  <?php print $styles; ?>
  <?php print $scripts; ?>
</head>
<body class="<?php print $classes; ?>">
  <header id="page-header--maintenance">
    <nav id="page-navbar" class="uk-navbar-container uk-navbar" uk-navbar>
      <div class="uk-navbar-center">
        <?php if ($logo): ?>
          <a href="<?php print $front_page; ?>" id="site-logo" class="uk-navbar-item uk-logo" title="<?php print t('Home'); ?>" rel="home">
            <img class="uk-margin-small-right" src="<?php print $logo; ?>" alt="<?php print t('Home'); ?>" />
          </a>
        <?php elseif ($site_name): ?>
          <span class="uk-navbar-item" style="color: #fff;"><?php print $site_name; ?></span>
        <?php endif; ?>
      </div>
    </nav>
  </header>

  <div id="page" class="uk-container uk-margin">
    <div uk-grid>

      <div<?php print $content_attributes; ?>>
        <h1 id="page-title" class="uk-article-title uk-text-center"><?php print $site_name; ?></h1>

        <?php if ($messages): ?>
          <?php print $messages; ?>
        <?php endif; ?>

        <div class="content">
          <div class="uk-text-center">
            <p class="uk-text-lead">The website encountered an unexpected error. Please try again later.</p>
          </div>
        </div>
      </div>

      <?php if (!empty($sidebar_first)): ?>
        <div<?php print $sidebar_first_attributes; ?>>
          <?php print $sidebar_first; ?>
        </div>
      <?php endif; ?>

      <?php if (!empty($sidebar_second)): ?>
        <div<?php print $sidebar_second_attributes; ?>>
          <?php print $sidebar_second; ?>
        </div>
      <?php endif; ?>

    </div>
  </div>

  <?php if (!empty($footer)): ?>
    <div class="uk-grid" uk-grid>
      <div id="footer" class="uk-width-1-1">
        <?php print $footer; ?>
      </div>
    </div>
  <?php endif; ?>

</body>
</html>
