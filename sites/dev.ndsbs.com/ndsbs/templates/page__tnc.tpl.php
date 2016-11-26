<span itemprop="name" style="display: none"><?php print drupal_get_title(); ?></span>
<div id="breadcrumb" style="display: none;" itemscope itemtype="http://schema.org/BreadcrumbList">
  <ol>
    <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
      <a itemprop="item" href="<?php print $base_url; ?>">
        <span itemprop="name">NDSBS</span>
      </a>
      <meta itemprop="position" content="1" />
    </li>
    <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
      <a itemprop="item" href="<?php print $base_url . '/terms-of-service'; ?>">
        <span itemprop="name"><?php print drupal_get_title(); ?></span>
      </a>
      <meta itemprop="position" content="2" />
    </li>
  </ol>
</div>
<?php
//  header included
include_once 'header.tpl.php';
?>
<div class="contents fix_contents">
  <div class="contents_inner">
<?php
    //  Print the body of the page
    print $node->body['und'][0]['value'];
?>
    </div>
  </div>