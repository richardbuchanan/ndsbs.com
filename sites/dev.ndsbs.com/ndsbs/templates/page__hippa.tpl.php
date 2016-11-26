<?php
global $user;
global $base_url;
/*
echo '<pre>';
    print_r($user);
echo '</pre>';
*/
//  custom image path defined
$path_image = $base_path . path_to_theme() . '/' . 'images';
?>

<?php
/*
    echo '<pre>';
        print_r($node);
    echo '</pre>';
*/
?>
<span itemprop="name" style="display: none"><?php print $title; ?></span>
<div id="breadcrumb" style="display: none;" itemscope
     itemtype="http://schema.org/BreadcrumbList">
  <ol>
    <li itemprop="itemListElement" itemscope
        itemtype="http://schema.org/ListItem">
      <a itemprop="item" href="<?php print $base_url; ?>">
        <span itemprop="name">NDSBS</span>
      </a>
      <meta itemprop="position" content="1" />
    </li>
    <li itemprop="itemListElement" itemscope
        itemtype="http://schema.org/ListItem">
      <a itemprop="item" href="<?php print $base_url; ?>/hippa">
        <span itemprop="name"><?php print drupal_get_title(); ?></span>
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

      <?php print $node->body['und'][0]['value']; ?>
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