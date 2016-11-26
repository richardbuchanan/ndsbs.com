<section id="page-header" class="clearfix">
  <div id="page-title-search" class="clearfix">
    <div id="page-title-wrapper">
      <?php print render($title_prefix); ?>
      <h1 id="page-title"><?php print $title; ?></h1>
      <?php print render($title_suffix); ?>
    </div>
  </div>
  <?php if ($is_admin): ?>
  <div id="breadcrumb-wrapper">
    <?php print render($breadcrumb); ?>
  </div>
  <?php endif; ?>
</section>