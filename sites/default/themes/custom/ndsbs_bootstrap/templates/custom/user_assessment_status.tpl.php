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
<style>
  .panel-default {
    border-color: #bf915b;
  }
  .panel-heading {
    background: #bf915b;
    background: -moz-linear-gradient(top, #bf915b 0%, #a87340 100%);
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #bf915b), color-stop(100%, #a87340));
    background: -webkit-linear-gradient(top, #bf915b 0%, #a87340 100%);
    background: -o-linear-gradient(top, #bf915b 0%, #a87340 100%);
    background: -ms-linear-gradient(top, #bf915b 0%, #a87340 100%);
    background: linear-gradient(to bottom, #bf915b 0%, #a87340 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#bf915b', endColorstr='#a87340', GradientType=0 );
  }
  .panel-title {
    color: #fdfdfd;
  }
  .panel-body {

  }
</style>
<h1 class="text-center">Welcome Back</h1>
<h2 class="text-center">What Type of Assessment Do You Need?</h2>
<div class="wd_1 left">
  <div id="pa-assessments">
    <div class="row">
      <div class="col-md-6">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title text-center"><?php print $dui_title; ?></h3>
          </div>
          <div class="panel-body text-center">
            <span><?php print $dui_description; ?></span>
            <h4>One-time Fee:</h4>
            <h2>$<?php print $dui_price; ?></h2>
            <a href="<?php print $base_url; ?>/assessments/dui-alcohol">Learn more</a><br />
            <a href="<?php print $base_url; ?>/user/cart/nid/259/tid/28" class="btn btn-primary">Purchase Now</a>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title text-center"><?php print $alcohol_title; ?></h3>
          </div>
          <div class="panel-body text-center">
            <span><?php print $alcohol_description; ?></span>
            <h4>One-time Fee:</h4>
            <h2>$<?php print $alcohol_price; ?></h2>
            <a href="<?php print $base_url; ?>/assessments/alcohol-assessment">Learn more</a><br />
            <a href="<?php print $base_url; ?>/user/cart/nid/328/tid/30" class="btn btn-primary">Purchase Now</a>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title text-center"><?php print $general_title; ?></h3>
          </div>
          <div class="panel-body text-center">
            <span><?php print $general_description; ?></span>
            <h4>One-time Fee:</h4>
            <h2>$<?php print $general_price; ?></h2>
            <a href="<?php print $base_url; ?>/assessments/general-drug-alcohol">Learn more</a><br />
            <a href="<?php print $base_url; ?>/user/cart/nid/272/tid/27" class="btn btn-primary">Purchase Now</a>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title text-center"><?php print $anger_title; ?></h3>
          </div>
          <div class="panel-body text-center">
            <span><?php print $anger_description; ?></span>
            <h4>One-time Fee:</h4>
            <h2>$<?php print $anger_price; ?></h2>
            <a href="<?php print $base_url; ?>/assessments/anger-management-evaluation">Learn more</a><br />
            <a href="<?php print $base_url; ?>/user/cart/nid/502/tid/34" class="btn btn-primary">Purchase Now</a>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title text-center"><?php print $employer_title; ?></h3>
          </div>
          <div class="panel-body text-center">
            <span><?php print $employer_description; ?></span>
            <h4>One-time Fee:</h4>
            <h2>$<?php print $employer_price; ?></h2>
            <a href="<?php print $base_url; ?>/assessments/employer-required-drug-alcohol">Learn more</a><br />
            <a href="<?php print $base_url; ?>/user/cart/nid/273/tid/29" class="btn btn-primary">Purchase Now</a>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="panel panel-default" style="height: 223px">
          <div class="panel-heading">
            <h3 class="panel-title text-center"><?php print $license_title; ?></h3>
          </div>
          <div class="panel-body text-center">
            <span><?php print $license_description; ?></span>
            <h4>One-time Fee:</h4>
            <h2>Varies Per State</h2>
            <a href="<?php print $base_url; ?>/assessments/license-reinstatement">Learn more</a>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title text-center"><?php print $underage_title; ?></h3>
          </div>
          <div class="panel-body text-center">
            <span><?php print $underage_description; ?></span>
            <h4>One-time Fee:</h4>
            <h2>$<?php print $underage_price; ?></h2>
            <a href="<?php print $base_url; ?>/assessments/underage-minor-possession">Learn more</a><br />
            <a href="<?php print $base_url; ?>/user/cart/nid/271/tid/1" class="btn btn-primary">Purchase Now</a>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <p class="text-center">You may contact us directly at 614-888-7274 (9-5 EST) or email us at <a href="mailto:info@ndsbs.com">info@ndsbs.com</a>.</p>
        <p class="text-center">We look forward to serving you!</p>
        <p class="text-center">Please review our <a href="<?php print $base_url; ?>/terms-of-service">Terms Of Services</a> and <a href="<?php print $base_url; ?>/hippa">Privacy Policy</a> here.</p>
      </div>
    </div>
  </div>
</div>
