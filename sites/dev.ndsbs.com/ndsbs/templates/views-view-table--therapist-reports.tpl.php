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
 * @ingroup views_templates
 */
?>
<?php drupal_add_js('//code.jquery.com/jquery-1.11.1.min.js', array(
  'type' => 'external',
  'group' => JS_THEME,
  'weight' => -36
)); ?>
<?php drupal_add_js($GLOBALS['base_url'] . '/' . drupal_get_path('module', 'jquery_update') . '/replace/ui/ui/jquery.ui.core.js', array(
  'type' => 'file',
  'group' => JS_THEME,
  'weight' => -35
)); ?>
<?php drupal_add_js($GLOBALS['base_url'] . '/' . drupal_get_path('module', 'jquery_update') . '/replace/ui/ui/jquery.ui.datepicker.js', array(
  'type' => 'file',
  'group' => JS_THEME,
  'weight' => -34
)); ?>
<?php drupal_add_js($GLOBALS['base_url'] . '/' . drupal_get_path('theme', 'ndsbs') . '/js/jquery.dataTables.min.js', array(
  'type' => 'file',
  'group' => JS_THEME,
  'weight' => -33
)); ?>
<?php drupal_add_js($GLOBALS['base_url'] . '/' . drupal_get_path('theme', 'ndsbs') . '/js/jquery.currency.js', array(
  'type' => 'file',
  'group' => JS_THEME,
  'weight' => -32
)); ?>
<?php drupal_add_js($GLOBALS['base_url'] . '/' . drupal_get_path('theme', 'ndsbs') . '/js/jquery.dataTables.columnFilter.js', array(
  'type' => 'file',
  'group' => JS_THEME,
  'weight' => -31
)); ?>
<?php drupal_add_js($GLOBALS['base_url'] . '/' . drupal_get_path('theme', 'ndsbs') . '/js/bdg.dataTables.js', array(
  'type' => 'file',
  'group' => JS_THEME,
  'weight' => -30
)); ?>
<?php drupal_add_css('//cdn.datatables.net/1.10.2/css/jquery.dataTables.min.css', 'external'); ?>
<?php //bdg_ndsbs_therapist_reports_refund_amount('471'); ?>
<div class="table_wrap therapist-reports">
  <table class="schedule_table<?php if ($classes) { print ' ' . $classes; } ?>" <?php print $attributes; ?>>
     <?php if (!empty($title) || !empty($caption)) : ?>
       <caption><?php print $caption . $title; ?></caption>
    <?php endif; ?>
    <?php if (!empty($header)) : ?>
      <thead>
        <tr class="dataTables_header">
          <th rowspan="1" colspan="3"></th>
          <th rowspan="1" colspan="1" class="date-header"></th>
          <th rowspan="1" colspan="2"></th>
          <th rowspan="1" colspan="1" class="therapist-header"></th>
        </tr>
        <tr class="bkg_b">
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
            <td <?php if ($field_classes[$field][$row_count]) { print 'class="'. $field_classes[$field][$row_count] . '" '; } ?><?php print drupal_attributes($field_attributes[$field][$row_count]); ?> <?php if (empty($content) && $field_classes[$field][$row_count] == 'views-field views-field-php-3') { print 'data-active="No"'; } ?>><?php print $content; ?></td>
          <?php endforeach; ?>
        </tr>
      <?php endforeach; ?>
    </tbody>
    <tfoot class="dataTable-footer">
      <tr>
        <th colspan="3" style="text-align:right">Totals:</th>
        <th class="dataTabe-total" colspan="2"></th>
        <th class="dataTabe-refund-total" colspan="2"></th>
      </tr>
    </tfoot>
  </table>
</div>
