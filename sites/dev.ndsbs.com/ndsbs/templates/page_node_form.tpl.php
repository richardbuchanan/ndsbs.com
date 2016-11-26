<?php
/**
 * @file
 * page_node_form.tpl.php
 */
//echo '<pre>';
//print_r($form);
//echo '</pre>';
?>
<h1>Page</h1>
<div class="wd_1 left">

    <div class="form-item_custum">
        <?php print drupal_render($form['title']); ?>
    </div>
    <div class="form-item_custum">
        <?php print drupal_render($form['body']); ?>
    </div>
    <div class="form-item_custum">
        <?php print drupal_render($form['field_page_images']); ?>
    </div>
    
    <div class="form-item_custum">
        <?php print drupal_render($form['field_page_images_2']); ?>
    </div>
    
    <div class="form-item_custum">
        <?php print drupal_render($form['actions']['submit']); ?>
    </div>

    <div style='display:none;'>
        <?php
        //  Use to render the drupal 7 form
        print drupal_render_children($form);
        ?>
    </div>
</div>