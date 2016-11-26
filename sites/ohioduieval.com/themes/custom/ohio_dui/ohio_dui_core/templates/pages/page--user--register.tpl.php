<?php

/**
 * @file
 * Theme implementation of the user login page.
 */
?>
<div id="page-container">
  <?php include('includes/top-header.inc'); ?>
  <?php include('includes/sub-header.inc'); ?>
  <?php include('includes/highlights.inc'); ?>
  <?php if (isset($register_message)): ?>
  <section id="highlights" class="container_12 clearfix ">
    <div id="site-messages">
      <div class="messages status">
        <h2 class="element-invisible">Status message</h2>
        <?php print $register_message; ?>
      </div>
    </div>
  </section>
  <?php endif; ?>
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