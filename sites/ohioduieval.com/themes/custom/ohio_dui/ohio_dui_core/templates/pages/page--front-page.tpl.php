<?php

/**
 * @file
 * Default theme implementation to display the site's front page.
 *
 * This page (ohioduieval.com/front-page) is used as the site's home page. This setting
 * can be changed by navigation to ohioduieval.com/admin/config/system/site-information
 * and changing the 'Default front page' setting.
 *
 * The reason we are using a custom template here is due to the default theme page
 * template inserting section elements that are unneeded on this page. This includes
 * the #highlights and #page-header elements. We also needed to adjust the top property
 * for the #content-section element so the content was not being rendered below the
 * visible screen after loading, especially on smaller screens.
 *
 * You can edit the content for this page by navigating to:
 * ohioduieval.com/node/136/edit
 *
 * A copy of the original front page template has been saved in this directory as
 * page--front.tpl.php.backup. This was the original content structure, and has been
 * saved as a backup in case the content structure needs to be verified.
 */
?>
<?php
$wrap = false;
if (arg(0) == 'admin' || arg(0) == 'user') {
  $wrap = true;
} ?>
<div id="page-container">
  <?php include('includes/top-header.inc'); ?>
  <section id="content-section" class="clearfix" style="width: 100%; top: 0;">
    <a id="main-content"></a>
    <div id="content">
      <article id="page-content">
        <?php print render($page['content']); ?>
      </article>
    </div>
  </section>
  <?php include('includes/footer.inc'); ?>
</div>
