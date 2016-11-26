<?php
global $user;
global $base_url;
$path_theme = drupal_get_path('theme', 'ndsbs') . '/templates';

//  Used current_path() Drupal core function for getting the current path
$_SESSION['COMPLETE_MY_QUESTIONNAIRE'] = current_path();
$assessment_id = arg(2);
$transid = arg(4);

//  Function called to move questionnaire
questionnaire_move();

include 'stepsheader.tpl.php';
?>
<div class="wd_1">
  <h2 style="color: #000; font-weight: 700;"><?php print $nid->field_assessment_title['und'][0]['value']; ?> Questionnaire</h2>
  <ul style="padding-left: 0; list-style: none !important;">
    <li><strong>Total Questions</strong> - <?php print $total_questions = get_total_questions_numbers($assessment_id, $transid); ?></li>
    <li><strong>Estimated Time to Complete</strong> - 15 minutes / your saved answers remain in your account if you need to stop and resume at another time.</li>
    <li><strong>Attempted</strong> - <?php print $times; ?> times</li>
    <li><strong>Instructions</strong> - Use text boxes where provided and write as much detail as you would like. You may explain any of your answers in detail during your interview.</li>
  </ul>
  <?php $cnfrm = get_assessment_confirmation_form(); ?>
  <?php print drupal_render($cnfrm); ?>
</div>
