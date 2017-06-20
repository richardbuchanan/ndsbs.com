<?php

/**
 * @file
 * Template to display a view as a table.
 *
 * - $title : The title of this group of rows.  May be empty.
 * - $header: An array of header labels keyed by field id.
 * - $caption: The caption for this table. May be empty.
 * - $header_classes: An array of header classes keyed by field id.
 * - $fields: An array of CSS IDs to use for each field id.
 * - $classes: A class or classes to apply to the table, based on settings.
 * - $row_classes: An array of classes to apply to each row, indexed by row
 *   number. This matches the index in $rows.
 * - $rows: An array of row items. Each row is an array of content.
 *   $rows are keyed by row number, fields within rows are keyed by field ID.
 * - $field_classes: An array of classes to apply to each field, indexed by
 *   field id, then row number. This matches the index in $rows.
 * - $responsive: A flag indicating whether table is responsive.
 * @ingroup views_templates
 */
?>

<?php if (!empty($title)): ?>
  <h3><?php print $title ?></h3>
<?php endif ?>

<?php if ($responsive): ?>
  <div class="table-responsive">
<?php endif ?>

  <table <?php if ($classes) { print 'class="'. $classes . '" '; } ?><?php print $attributes; ?>>
    <?php if (!empty($title) || !empty($caption)) : ?>
      <caption><?php print $caption . $title; ?></caption>
    <?php endif; ?>
    <?php if (!empty($header)) : ?>
      <thead>
      <tr>
        <?php foreach ($header as $field => $label): ?>
          <th <?php if ($header_classes[$field]) { print 'class="'. $header_classes[$field] . '" '; } ?>>
            <?php print $label; ?>
          </th>
        <?php endforeach; ?>
      </tr>
      </thead>
    <?php endif; ?>
    <tbody>
    <?php foreach ($rows as $row_count => $row): ?>
      <tr <?php if ($row_classes[$row_count]) { print 'class="' . implode(' ', $row_classes[$row_count]) .'"';  } ?>>
        <?php foreach ($row as $field => $content): ?>
          <td <?php if ($field_classes[$field][$row_count]) { print 'class="'. $field_classes[$field][$row_count] . '" '; } ?><?php print drupal_attributes($field_attributes[$field][$row_count]); ?>>
            <?php print $content; ?>
          </td>
        <?php endforeach; ?>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>

<?php if ($responsive): ?>
  </div>
<?php endif ?>

<?php
$rush_services = taxonomy_get_tree(5);
$i = 0;
?>


<div class="row">
  <p class="h2 text-center">Rush Services</p>

  <?php foreach ($rush_services as $rush_service): ?>
    <?php $tid = $rush_service->tid; ?>
    <?php $term = taxonomy_term_load($tid); ?>
    <?php $name = $term->name; ?>
    <?php $price = $term->field_rush_amount['und'][0]['value']; ?>
    <div class="col-xs-12 col-sm-6 col-md-3">
      <div class="panel panel-<?php print ($i%2 ? 'alabaster' : 'putty'); ?>">
        <div class="panel-heading text-center"><?php print $name; ?></div>
        <div class="panel-body text-center">
          <p><strong>$<?php print $price; ?></strong></p>
        </div>
      </div>
    </div>
    <?php $i++; ?>
  <?php endforeach; ?>

  <div class="col-xs-12 col-sm-6 col-md-3">
    <div class="panel panel-alabaster">
      <div class="panel-heading text-center">Standard 4-5 business days</div>
      <div class="panel-body text-center">
        <p><strong>$0.00</strong></p>
      </div>
    </div>
  </div>
</div>
