<?php

global $base_url;
$type = 'assessment';
$nodes = node_load_multiple(array(), array('type' => $type));

foreach ($nodes as $node) {
  $term = taxonomy_term_load($node->field_primary_service['und'][0]['tid']);

  if ($term->tid === '28') {
    $dui_title = $term->name;
    $dui_price = $term->field_assessment_amount['und'][0]['value'];
    $dui_description = $term->description;
  }
  if ($term->tid === '30') {
    $alcohol_title = $term->name;
    $alcohol_price = $term->field_assessment_amount['und'][0]['value'];
    $alcohol_description = $term->description;
  }
  if ($term->tid === '27') {
    $general_title = $term->name;
    $general_price = $term->field_assessment_amount['und'][0]['value'];
    $general_description = $term->description;
  }
  if ($term->tid === '34') {
    $anger_title = $term->name;
    $anger_price = $term->field_assessment_amount['und'][0]['value'];
    $anger_description = $term->description;
  }
  if ($term->tid === '29') {
    $employer_title = $term->name;
    $employer_price = $term->field_assessment_amount['und'][0]['value'];
    $employer_description = $term->description;
  }
  if ($term->tid === '26') {
    $license_title = $term->name;
    $license_description = $term->description;
  }
  if ($term->tid === '1') {
    $underage_title = $term->name;
    $underage_price = $term->field_assessment_amount['und'][0]['value'];
    $underage_description = $term->description;
  }
}

?>
<div class="container">
  <h1 class="h_bt_bod upper_c">Welcome Back</h1>
  <div class="wd_1 left">
    <div id="pa-post-header">
      <h1>What Type of Assessment Do You Need?</h1>
    </div>
    <div id="pa-assessments">
      <div id="pa-left">
        <h1><?php print $dui_title; ?></h1>
        <span><?php print $dui_description; ?></span>
        <h4>One-time Fee:</h4>
        <h2>$<?php print $dui_price; ?></h2>
        <div class="opg">
          <span><a href="<?php print $base_url; ?>/assessments/dui-alcohol">Learn more</a></span>
          <a href="<?php print $base_url; ?>/user/cart/nid/259/tid/28" class="grey_btn">Purchase Now</a>
        </div>
      </div>
      <div id="pa-right">
        <h1><?php print $alcohol_title; ?></h1>
        <span><?php print $alcohol_description; ?></span>
        <h4>One-time Fee:</h4>
        <h2>$<?php print $alcohol_price; ?></h2>
        <div class="opg">
          <span><a href="<?php print $base_url; ?>/assessments/alcohol-assessment">Learn more</a></span>
          <a href="<?php print $base_url; ?>/user/cart/nid/328/tid/30" class="grey_btn">Purchase Now</a> 
        </div>
      </div>
      <div id="pa-left">
        <h1><?php print $general_title; ?></h1>
        <span><?php print $general_description; ?></span>
        <h4>One-time Fee:</h4>
        <h2>$<?php print $general_price; ?></h2>
        <div class="opg">
          <span><a href="<?php print $base_url; ?>/assessments/general-drug-alcohol">Learn more</a></span>
          <a href="<?php print $base_url; ?>/user/cart/nid/272/tid/27" class="grey_btn">Purchase Now</a> 
        </div>
      </div>
      <div id="pa-right">
        <h1><?php print $anger_title; ?></h1>
        <span><?php print $anger_description; ?></span>
        <h4>One-time Fee:</h4>
        <h2>$<?php print $anger_price; ?></h2>
        <div class="opg">
          <span><a href="<?php print $base_url; ?>/assessments/Anger-Management-Evaluation">Learn more</a></span>
          <a href="<?php print $base_url; ?>/user/cart/nid/502/tid/34" class="grey_btn">Purchase Now</a> 
        </div>
      </div>
      <div id="pa-left">
        <h1><?php print $employer_title; ?></h1>
        <span><?php print $employer_description; ?></span>
        <h4>One-time Fee:</h4>
        <h2>$<?php print $employer_price; ?></h2>
        <div class="opg">
          <span><a href="<?php print $base_url; ?>/assessments/employer-required-drug-alcohol">Learn more</a></span>
          <a href="<?php print $base_url; ?>/user/cart/nid/273/tid/29" class="grey_btn">Purchase Now</a> 
        </div>
      </div>
      <div id="pa-right">
        <h1><?php print $license_title; ?></h1>
        <span><?php print $license_description; ?></span>
        <h4>One-time Fee:</h4>
        <h2>Varies Per State</h2>
        <div class="opg">
          <span><a href="<?php print $base_url; ?>/assessments/license-reinstatement">Learn more</a></span>
        </div>
      </div>
      <div id="pa-left" class="pa-centered">
        <h1><?php print $underage_title; ?></h1>
        <span><?php print $underage_description; ?></span>
        <h4>One-time Fee:</h4>
        <h2>$<?php print $underage_price; ?></h2>
        <div class="opg">
          <span><a href="<?php print $base_url; ?>/assessments/underage-minor-possession">Learn more</a></span>
          <a href="<?php print $base_url; ?>/user/cart/nid/271/tid/1" class="grey_btn">Purchase Now</a> 
        </div>
      </div>
      <div id="pa-disclaimer">
        <p>You may contact us directly at 614-888-7274 (9-5 EST) or email us at <a href="mailto:info@ndsbs.com">info@ndsbs.com</a>.</p>
        <p>We look forward to serving you!</p>
        <p>Please review our <a href="<?php print $base_url; ?>/terms-of-service">Terms Of Services</a> and <a href="<?php print $base_url; ?>/hippa">Privacy Policy</a> here.</p>
      </div>
    </div>
  </div>
</div>