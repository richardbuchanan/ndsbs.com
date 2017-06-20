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
?>
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <title><?php print $head_title; ?></title>
  <?php print $head; ?>
  <?php print $styles; ?>
  <?php print $scripts; ?>
</head>
<body class="<?php print $classes; ?>">
  <div id="page" class="container">
    <div id="header" class="row">

      <div id="logo-title" class="col-md-12">
        <div class="center-block">
          <?php if (!empty($logo)): ?>
            <a href="<?php print $base_path; ?>" title="<?php print t('Home'); ?>" rel="home" id="logo" class="center">
              <img src="<?php print $logo; ?>" alt="<?php print t('Home'); ?>" />
            </a>
          <?php endif; ?>
        </div>

        <?php if (!empty($header)): ?>
          <div id="header-region">
            <?php print $header; ?>
          </div>
        <?php endif; ?>

      </div>
    </div>

    <div id="content" class="row">
      <div class="col-sm-12 col-md-6 col-md-offset-3">
        <?php if (!empty($title)): ?>
          <h1 class="title" id="page-title"><?php print $title; ?></h1>
        <?php endif; ?>

        <?php if (!empty($messages)): ?>
            <?php print $messages; ?>
        <?php endif; ?>

        <div class="alert alert-warning" role="alert">
          <?php print $content; ?>
        </div>

        <?php if (user_is_logged_in()): ?>
          <?php $destination = drupal_get_destination(); ?>
          <?php $path = $destination['destination']; ?>
          <?php print l(t('Return to previous page'), $path); ?>
        <?php else: ?>
          <?php $login_form = drupal_get_form('user_login_block'); ?>
          <?php hide($login_form['links']); ?>
          <?php hide($login_form['remember_me']); ?>

          <div class="center-block">
            <div class="panel panel-default">
              <div class="panel-heading">
                <h3 class="panel-title">Site administrators</h3>
              </div>
              <div class="panel-body">
                <h3>If you are a site administrator, please login below.</h3>
                <div class="help-block">All other users will be denied login access.</div>

                <?php print render($login_form); ?>
              </div>
            </div>
          </div>
        <?php endif; ?>

      </div>
    </div>

  </div>

</body>
</html>
