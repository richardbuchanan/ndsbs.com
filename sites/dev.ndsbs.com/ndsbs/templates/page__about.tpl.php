<?php
global $user;
global $base_url;
?>
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
      <a itemprop="item" href="<?php print $base_url; ?>/how-assessments-work">
        <span itemprop="name"><?php print drupal_get_title(); ?></span>
      </a>
      <meta itemprop="position" content="2" />
    </li>
  </ol>
</div>
<div class="layout fix_layout">
    <?php include_once 'header.tpl.php'; ?>
    <div class="contents faq_contents fix_contents">
      <div class="contents_inner">
        <?php include_once 'right_block.tpl.php'; ?>
        <div class="right_column">
          <?php print $node->body['und'][0]['value']; ?>
        </div>
      </div>
    </div>
    <div class="footer">
      <?php include_once 'footer_sub.tpl.php'; ?>
      <?php include_once 'footer.tpl.php'; ?>
    </div>
</div>