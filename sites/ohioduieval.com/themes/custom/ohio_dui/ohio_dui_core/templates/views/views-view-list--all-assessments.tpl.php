<?php

/**
 * @file
 * Default simple view template to display a list of rows.
 *
 * - $title : The title of this group of rows.  May be empty.
 * - $options['type'] will either be ul or ol.
 * @ingroup views_templates
 */
?>
<?php $general = 'general-drug-alcohol'; ?>
<?php $dui = 'dui-alcohol'; ?>
<?php $demo = 'dui-alcohol-demo'; ?>
<?php print $wrapper_prefix; ?>
  <?php if (!empty($title)) : ?>
    <h3><?php print $title; ?></h3>
  <?php endif; ?>
  <?php print $list_type_prefix; ?>
    <?php foreach ($rows as $id => $row): ?>
      <?php
        // Begin custom li ID declaration.
        $view_id = '';
        $cl_id = $classes_array[$id];
        if ($view->result[$id]->nid == '82') {
          $view_id = 'view-row-general-assessment';
        }
        elseif ($view->result[$id]->nid == '83') {
          $view_id = 'view-row-dui-assessment';
        }
        elseif ($view->result[$id]->nid == '85') {
          $view_id = 'view-row-demo-assessment';
        }
        // End custom declaration.
      ?>
      <li id="<?php print $view_id; ?>" class="<?php print $cl_id; ?>">
        <?php print $row; ?>
      </li>
    <?php endforeach; ?>
  <?php print $list_type_suffix; ?>
<?php print $wrapper_suffix; ?>
