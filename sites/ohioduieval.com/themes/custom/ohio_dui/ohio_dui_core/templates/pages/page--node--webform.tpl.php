<?php
$wrap = false;
if (arg(0) == 'admin' || arg(0) == 'user') {
  $wrap = true;
} ?>
<div id="page-container">
  <?php include('includes/top-header.inc'); ?>
  <?php include('includes/sub-header.inc'); ?>
  <?php include('includes/highlights.inc'); ?>
  <section id="content-section" class="clearfix sub-header-padding content-wrap" style="width: 90%; max-width: 1440px;">
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
