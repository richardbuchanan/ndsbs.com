<?php
/**
 * @file
 */

include_once 'headerspecial_assessment.tpl.php';
$form = drupal_get_form('list_all_assessments_for_special_user');
print drupal_render($form);
?>
<p>After you have requested a special assessment rate or rush order invoice our administrator will send an email invoice to you as soon as possible and between the hours of 9-5 EST.</p>
