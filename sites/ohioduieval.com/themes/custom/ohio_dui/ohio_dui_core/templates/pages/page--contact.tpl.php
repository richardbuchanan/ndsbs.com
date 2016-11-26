<?php

/**
 * @file
 * Theme implementation of the site-wide contact page.
 */
?>
<div id="page-container">
  <?php $page['content']['metatags']['global']['title']['#attached']['metatag_set_preprocess_variable'][0][2] = 'Contact Us | OhioDUIEval.com'; ?>
  <?php include('includes/top-header.inc'); ?>
  <?php include('includes/sub-header.inc'); ?>
  <?php include('includes/highlights.inc'); ?>
  <section id="content-section" class="clearfix sub-header-padding" style="top: 110px;">
    <a id="main-content"></a>
    <div id="map_canvas" style="width:100%; height:250px;"></div>
    <?php include('includes/admin-actions.inc'); ?>
    <div id="content">
      <article id="page-content">
        <!-- BEGIN CONTACT FORM -->
        <div class="content-wrap contact-page">
          <div id="contact-left">
            <h2>Send us a Message</h2>
            <?php print render($page['content']); ?>
          </div>
          <div id="contact-right">
            <h2>Get in Touch</h2>
            <div class="contact-right-left">
              <span class="contact-label">Office</span>
            </div>
            <div class="contact-right-right">
              <span class="contact-line">6797 N. High Street</span>
              <span class="contact-line">Columbus, OH 43085</span>
            </div>
            <div class="contact-right-left">
              <span class="contact-label">Phone</span>
            </div>
            <div class="contact-right-right">
              <span class="contact-line">614.888.7274</span>
            </div>
            <div class="contact-right-left">
              <span class="contact-label">Fax</span>
            </div>
            <div class="contact-right-right">
              <span class="contact-line">614.888.3239</span>
            </div>
            <div class="contact-right-left">
              <span class="contact-label">Email</span>
            </div>
            <div class="contact-right-right">
              <span class="contact-line">support@ohioduieval.com</span>
            </div>
          </div>
        </div>
        <!-- END CONTACT FORM -->
      </article>
      <!-- EXAMPLE SIDEBAR WRAPPER
      <aside id="sidebar">
      </aside>
      END SIDEBAR EXAMPLE -->
    </div>
  </section>
  <?php include('includes/footer.inc'); ?>
  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBrif7tiyxLI9f0PIMhsInLk0FWl6I4x4g&sensor=false"></script>
</div>
