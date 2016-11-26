<?php
global $user;
global $base_url;
?>
<?php
/*
    echo '<pre>';
        print_r($node);
    echo '</pre>';
*/
?>
<span itemprop="name" style="display: none">Our Services</span>
<div id="breadcrumb" style="display: none;" itemscope itemtype="http://schema.org/BreadcrumbList">
  <ol>
    <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
      <a itemprop="item" href="<?php print $base_url; ?>">
        <span itemprop="name">NDSBS</span>
      </a>
      <meta itemprop="position" content="1" />
    </li>
    <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
      <a itemprop="item" href="<?php print $base_url; ?>/our-services">
        <span itemprop="name">Our Services</span>
      </a>
      <meta itemprop="position" content="2" />
    </li>
  </ol>
</div>
<div class="layout fix_layout">
    <?php
        //  header included
        include_once 'header.tpl.php';
    ?>
    <div class="contents fix_contents">
    <div class="contents_inner">
        <?php
            //  Include right panel block
            include_once 'right_block.tpl.php';
        ?>
        <div class="right_column">
          <?php print $messages; ?>
            <?php
                //  Print the body of the page
                print $node->body['und'][0]['value'];
            ?>
        </div>
    </div>
    </div>
    <div class="footer">
        <?php
            //  footer included
            include_once 'footer_sub.tpl.php';
            //  footer included
            include_once 'footer.tpl.php';
        ?>
    </div>
</div>