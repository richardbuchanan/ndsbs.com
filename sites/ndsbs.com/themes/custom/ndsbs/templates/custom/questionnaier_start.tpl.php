<?php
questionnaire_move();

include 'stepsheader.tpl.php';
?>
<?php print $questionnaire_instructions; ?>
<?php print drupal_render($form); ?>

