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
      <a itemprop="item" href="<?php print $base_url . '/assessments'; ?>">
        <span itemprop="name">Assessments</span>
      </a>
      <meta itemprop="position" content="2" />
    </li>
    <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
      <a itemprop="item" href="<?php print $schema_url; ?>">
        <span itemprop="name"><?php print $node_title; ?></span>
      </a>
      <meta itemprop="position" content="3" />
    </li>
  </ol>
</div>

<div class="layout fix_layout">
  <?php include_once 'header.tpl.php'; ?>
  
  <!--contents starts here-->
  <div class="contents assessments_contents">
    <div class="contents_inner">
      <?php if ($user->uid == '354'): ?>
        <?php print render($tabs); ?>
      <?php endif; ?>

      <?php if (isset($messages)): ?>
        <?php print $messages; ?>
      <?php endif; ?>

      <?php if (isset($section_one)): ?>
        <div class="section-one"><?php print $section_one; ?></div>
      <?php endif; ?>

      <?php if (isset($right_image)): ?>
        <img src="<?php print $right_image; ?>" class="thick right text-wrap" alt="Assessment image">
      <?php endif; ?>

      <div class="dashed_wrap_wrapper">
        <?php if (isset($primary_service_amount) && $primary_service_amount > 0): ?>
          <div class="dashed_wrap">

            <?php if (isset($service_description)): ?>
              <div class="as_contents">
                <?php print $service_description; ?>
              </div>
            <?php endif; ?>

            <div class="order_bg right">
              <div class="price">$ <?php print $primary_service_amount; ?></div>

              <div class="opg">
                <a href="<?php print $redirect_url; ?>" class="grey_btn">Purchase Now</a>
              </div>
            </div>
          </div>
        <?php endif; ?>

        <?php if (isset($section_two)) { ?>
          <div class="dashed_wrap"> <?php print $section_two; ?> </div>
        <?php } ?>

        <?php if (isset($section_three)) { ?>
          <div class="dashed_wrap"> <?php print $section_three; ?> </div>
        <?php } ?>

        <?php if (isset($section_four)) { ?>
          <div class="dashed_wrap"> <?php print $section_four; ?></div>
        <?php } ?>
      </div>
    </div>
  </div>
  <!--contents ends here-->

  <!-- Schema.org structured data -->
  <div class="element-invisible">
    <?php print render($page['content']); ?>
  </div>
  
  <div class="footer">
    <?php include_once 'footer_sub.tpl.php'; ?>
    <?php include_once 'footer.tpl.php'; ?>
  </div>
</div>

<!-- Google Code for NDSBS Conversion Page -->
<?php $conversion_label = ''; ?>
<?php if (isset($node_title)): ?>
  <?php $conversion_label = $node_title . ' - '; ?>
<?php endif; ?>
<script type="text/javascript">
var google_conversion_id = 1017904011;
var google_conversion_language = "en";
var google_conversion_format = "2";
var google_conversion_color = "ffffff";
var google_conversion_label = "<?php print $conversion_label; ?>PLjyCJWdoQwQi_ev5QM";
var google_conversion_value = 0;
var google_remarketing_only = false;
</script>

<script type="text/javascript" src="//www.googleadservices.com/pagead/conversion.js"></script>

<noscript>
  <div style="display:inline;">
    <img height="1" width="1" style="border-style:none;" alt="" src="//www.googleadservices.com/pagead/conversion/1017904011/?value=0&amp;label=PLjyCJWdoQwQi_ev5QM&amp;guid=ON&amp;script=0"/>
  </div>
</noscript>
