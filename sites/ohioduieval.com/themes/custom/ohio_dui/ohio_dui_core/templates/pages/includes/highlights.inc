<?php if ($messages || $page['highlighted'] || $page['help']): ?>
<section id="highlights" class="container_12 clearfix <?php if ($admin) { print 'content-wrap'; } ?>">
  <?php //if ($messages /*&& $is_admin*/): ?>
    <?php //if (arg(1) != 'register'): ?>
    <div id="site-messages"><?php print $messages; ?></div>
    <?php //endif; ?>
  <?php //endif; ?>

  <?php if ($page['highlighted']): ?>
    <div id="highlighted"><?php print render($page['highlighted']); ?></div>
  <?php endif; ?>

  <?php if ($page['help'] && $is_admin): ?>
    <div id="help"><?php print render($page['help']); ?></div>
  <?php endif; ?>
</section>
<?php endif; ?>