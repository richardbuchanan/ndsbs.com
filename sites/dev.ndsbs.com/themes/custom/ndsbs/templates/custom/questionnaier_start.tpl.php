<?php
questionnaire_move();

include 'stepsheader.tpl.php';
?>
<?php print drupal_render($assessment_select_form); ?>
<?php print $questionnaire_instructions; ?>
<?php print drupal_render($questionnaire_form); ?>
