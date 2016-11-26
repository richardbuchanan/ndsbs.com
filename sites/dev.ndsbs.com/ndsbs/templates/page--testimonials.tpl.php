<?php global $base_url; ?>
<span itemprop="name" style="display: none"><?php print $title; ?></span>
<div id="breadcrumb" style="display: none;" itemscope itemtype="http://schema.org/BreadcrumbList">
  <ol>
    <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
      <a itemprop="item" href="<?php print $base_url; ?>">
        <span itemprop="name">NDSBS</span>
      </a>
      <meta itemprop="position" content="1" />
    </li>
    <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
      <a itemprop="item" href="<?php print $base_url; ?>/testimonials">
        <span itemprop="name">Testimonials</span>
      </a>
      <meta itemprop="position" content="2" />
    </li>
  </ol>
</div>
<div class="layout fix_layout">
  <?php include_once 'header.tpl.php'; ?>

  <div class="contents fix_contents">
    <div class="contents_inner">
      <h1 class="tag_tittle">Testimonials</h1>
      <?php include_once 'right_block.tpl.php'; ?>
      <div class="right_column">

        <?php if ($messages): ?>
          <?php print $messages; ?>
        <?php endif; ?>

        <?php print render($page['content']); ?>
      </div>
    </div>
  </div>
  <div class="footer">
    <?php include_once 'footer_sub.tpl.php'; ?>
    <?php include_once 'footer.tpl.php'; ?>
  </div>
</div>
