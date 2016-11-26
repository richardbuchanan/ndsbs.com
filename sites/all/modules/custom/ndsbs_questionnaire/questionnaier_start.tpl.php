<?php
global $user;
global $base_url;
$path_theme = drupal_get_path('theme', 'bootstrap_ndsbs') . '/templates';

//  Used current_path() Drupal core function for getting the current path
$_SESSION['COMPLETE_MY_QUESTIONNAIRE'] = current_path();    //  questionnaire/start/259/trans/15


$assessment_id = arg(2);
$transid = arg(4);

//  Function called to move questionnaire
questionnaire_move();
?>

<?php
/*
    $question_info = get_total_attempted_times($assessment_id);
    $total_attempts = $question_info['total_attempts'];
    $total_time = $question_info['total_time'];

    //  Get total number of attempts
    if($total_attempts <> '') {
        $times = $total_attempts;
    } else {
        $times = 0;
    }
*/
?>

<?php
    //  Include the theme steps header
    include_once $path_theme . '/stepsheader.tpl.php';
?>

<div class="wd_1">
    <!--contents starts here-->
    <b>Questionnaire Instructions:</b>
    <br />
<!--    <br />
    This questionnaire is designed to provide you with a professional and accurate assessment of your use
    of a substance(s). You will benefit most if your answers are honest and direct. Don’t over-think your
    answers. There are no trick questions. You must enter a response for each question for completion
    before your interview. You will be able to discuss details, change answers or explain your answers when
    you speak to your evaluator.
    <br />
    <br />
    People often complete the questionnaire in 15 minutes but you have 90 minutes to complete it in one
    sitting. If you run over the 90 minute time limit – don’t worry- your answers will be saved and you may log
    in again to resume the questionnaire where you left off.
    <br /><br />
    <b>Questions in red have not been attempted or submitted.</b>
    <br />
    <b>Questions marked green indicate you successfully completed and submitted an answer.</b>
    <br /><br />-->
<br />
         <b>
         ***  CLICK “SAVE & NEXT” BUTTON TO SAVE EACH ANSWER ***
         <br />
         Questions in red have not been saved to your account yet. 
         <br />
         Questions marked green indicate you have saved your answer.
         <br />
         <!-- You may change an answer anytime before clicking on the “submit all/finish” button -->
         </b>
<br />
<br />
    <b>Assessment</b> - 
    <?php
        print $nid->field_assessment_title['und'][0]['value'];
    ?>
    <br />
    <b>Total Questions</b> - 
    <?php
        //  Get total number of questions
        print $total_questions = get_total_questions_numbers($assessment_id, $transid);
    ?>
    <br />
    <!-- <b>Total given time</b> - 90 minutes allowed (15-20 min. average needed) -->
    <br />
    <b>Attempted</b> - 
    <?php
        print $times;
    ?>
    times
    <br />
    
    <!-- Custom Form for the confirm to attempt the questionnaire -->
    <?php
        $cnfrm = get_assessment_confirmation_form();
        print drupal_render($cnfrm);
    ?>
    
    <?php
        // print l(t('Start Questionnaire >'), 'user/questionnaire/' . $assessment_id);
    ?>
    
    
    <!--contents ends here-->
</div>
<script>
    //  Delete the last cookie if exist for first or new attempt
    $.cookie('preserveTime', null, { path: '/'});
    //alert($.cookie("preserveTime"));
    //$.cookie("preserveTime", 0, { path:'/'});
</script>