<?php
global $user, $base_url;
$path_image = $base_path . path_to_theme() . '/' . 'images';
$testimonial = get_all_testimonial_list();
$node_testimonial = array();
foreach($testimonial as $testidata) {
    $node_testimonial[] = node_load($testidata->nid);
}
?>
<span itemprop="name" style="display: none"><?php print $title; ?></span>
<div id="breadcrumb" style="display: none;" itemscope itemtype="http://schema.org/BreadcrumbList">
  <ol>
    <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
      <a itemprop="item" href="<?php print $base_url; ?>">
        <span itemprop="name">NDSBS</span>
      </a>
    </li>
    <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
      <a itemprop="item" href="<?php print $base_url; ?>/testimonials">
        <span itemprop="name">Testimonials</span>
      </a>
    </li>
  </ol>
</div>
<div class="layout fix_layout">
  <?php include_once 'header.tpl.php'; ?>
  <div class="contents faq_contents">
  	<div class="contents_inner">
      <h1 class="tittile">Testimonial</h1>
        <?php $i = 1; ?>
        <?php foreach ($node_testimonial as $testimonial_data): ?>
        <p><?php print $i; ?>. <?php print $testimonial_data->field_testimonial_description['und'][0]['value']; ?>
          <br />
          <b><?php print $testimonial_data->field_testimonial_user_name['und'][0]['value']; ?></b>
        </p>
        <?php $i++; ?>
        <?php endforeach; ?>
</div>


    <?php //print render($page['content']); ?>

    <div class="footer">
        <?php
            //  footer included
            include_once 'footer_sub.tpl.php';
            //  footer included
            include_once 'footer.tpl.php';
        ?>
    </div>
</div>