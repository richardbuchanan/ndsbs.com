<?php

/**
 * @file
 * Theme implementation of the assessments page.
 */
?>

<div id="page-container">
  <?php include('includes/top-header.inc'); ?>
  <?php include('includes/sub-header.inc'); ?>
  <?php include('includes/highlights.inc'); ?>
  <section id="content-section" class="clearfix">
    <a id="main-content"></a>
    <?php include('includes/admin-actions.inc'); ?>
    <div id="content">
      <article id="page-content">
        <?php print render($page['content']); ?>
        <div id="pa-post-header">
          <div class="content-wrap">
            <h1>What Type of Assessment Do You Need?</h1>
          </div>
        </div>
        <div id="pa-assessments">
          <div class="content-wrap">
            <div id="pa-left">
              <h1>DUI Alcohol Assessment</h1>
              <h4>Description:</h4>
              <span>DUI related to alcohol consumption</span>
              <span><a href="https://ohioduieval.com/assessments/dui-alcohol">Learn More</a></span>
              <h4>One-time Fee:</h4>
              <h2>$250.00</h2>
              <?php
                $query = new EntityFieldQuery();
                $entities = $query->entityCondition('entity_type', 'node')
                  ->propertyCondition('type', 'product')
                  ->propertyCondition('title', 'DUI Alcohol')
                  ->propertyCondition('status', 1)
                  ->range(0,1)
                  ->execute();
                if (!empty($entities['node'])) {
                  $node = node_load(array_shift(array_keys($entities['node'])));
                  $add_to_cart = array(
                    '#theme' => 'uc_product_add_to_cart',
                    '#form' => drupal_get_form('uc_product_add_to_cart_form_' . $node->nid, $node),
                  );
                  print drupal_render($add_to_cart);
                }
              ?>
            </div>
            <div id="pa-right">
              <h1>DUI Drug & Alcohol Assessment</h1>
              <h4>Description:</h4>
              <span>DUI related to use of a substance other than alcohol</span>
              <span><a href="https://ohioduieval.com/assessments/dui-drug-alcohol">Learn More</a></span>
              <h4>One-time Fee:</h4>
              <h2>$325.00</h2>
              <?php
                $query = new EntityFieldQuery();
                $entities = $query->entityCondition('entity_type', 'node')
                  ->propertyCondition('type', 'product')
                  ->propertyCondition('title', 'DUI Drug & Alcohol')
                  ->propertyCondition('status', 1)
                  ->range(0,1)
                  ->execute();
                if (!empty($entities['node'])) {
                  $node = node_load(array_shift(array_keys($entities['node'])));
                  $add_to_cart = array(
                    '#theme' => 'uc_product_add_to_cart',
                    '#form' => drupal_get_form('uc_product_add_to_cart_form_' . $node->nid, $node),
                  );
                  print drupal_render($add_to_cart);
                }
              ?>
            </div>
            <div id="pa-disclaimer">
              <h3>For substance abuse assessments related to something other than a DUI or impaired driving charge please visit us at <a href="https://www.ndsbs.com/" target="_blank">www.ndsbs.com</a>.</h3>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
  <?php include('includes/footer.inc'); ?>
</div>
