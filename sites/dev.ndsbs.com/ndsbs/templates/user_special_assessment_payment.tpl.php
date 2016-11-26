<?php
/**
 * @file
 */
global $base_path;
$path_theme = drupal_get_path('theme', 'ndsbs') . '/templates';
?>

<?php
    include_once $path_theme . '/headerspecial_assessment.tpl.php';
?>

<div class="wd_1 appointment_page">
    <div class="form-item_custum p_10">
        <?php
            //  Print the assessment listing for creating invoice
            print drupal_render(get_invoiced_form());
        ?>
    </div>
</div>