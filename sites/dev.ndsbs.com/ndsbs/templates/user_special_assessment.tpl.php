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
            print drupal_render(special_assessment_form_selection());
        ?>
        <br />
        After you have requested a special assessment rate or rush order invoice our administrator will send an email invoice to you as soon possible and between the hours of 9-5 EST.
    </div>
</div>
