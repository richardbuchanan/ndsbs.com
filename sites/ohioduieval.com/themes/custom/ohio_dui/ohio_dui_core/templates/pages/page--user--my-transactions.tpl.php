<?php

/**
 * @file
 * Theme implementation to display the user's My Transactions page.
 */
?>
<?php
$wrap = false;
if (arg(0) == 'admin' || arg(0) == 'user') {
  $wrap = true;
} ?>
<div id="page-container">
  <?php include('includes/top-header.inc'); ?>
  <?php include('includes/sub-header.inc'); ?>
  <?php include('includes/highlights.inc'); ?>
  <section id="content-section" class="clearfix sub-header-padding <?php if ($wrap) { print 'content-wrap'; } ?>" <?php if ($wrap) { print 'style="width: 90%; max-width: 1440px;"'; } ?>>
    <a id="main-content"></a>
    <?php include('includes/admin-actions.inc'); ?>
    <div id="content">
      <article id="page-content">
        <?php print render($page['content']); ?>
      </article>
    </div>
  </section>
  <?php include('includes/footer.inc'); ?>
</div>
