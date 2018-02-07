<?php

/**
 * @file
 * Default print module template
 *
 * @ingroup print
 */
?>
<!DOCTYPE html>
<html lang="<?php print $print['language']; ?>">
  <head>
    <?php print $print['head']; ?>
    <?php print $print['base_href']; ?>
    <title><?php print $print['title']; ?></title>
    <?php print $print['scripts']; ?>
    <?php print $print['sendtoprinter']; ?>
    <?php print $print['robots_meta']; ?>
    <?php print $print['favicon']; ?>
    <link type="text/css" rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.27/css/uikit.min.css">
    <?php print $print['css']; ?>
  </head>
  <body>
    <div class="uk-container">
      <div class="uk-child-width-1-1" uk-grid>
        <?php if (!empty($print['message'])): ?>
          <div class="uk-alert"><?php print $print['message']; ?></div>
        <?php endif; ?>

        <div class="print-content">
          <?php print $print['content']; ?>
        </div>
      </div>
    </div>

    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js"></script>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.27/js/uikit.min.js"></script>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.27/js/uikit-icons.min.js"></script>
    <?php print $print['footer_scripts']; ?>
  </body>
</html>
