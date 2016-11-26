<?php

/**
 * @file
 * Theme implementation of the staff dashboard page
 * (ohioduieval.com/staff-dashboard).
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
  <section id="content-section" class="clearfix sub-header-padding">
    <a id="main-content"></a>
    <?php include('includes/admin-actions.inc'); ?>
    <div id="content">
      <article id="page-content">
        <div class="content-wrap">
          <?php print render($page['content']); ?>
        </div>
      </article>
    </div>
  </section>
  <?php include('includes/footer.inc'); ?>
</div>
