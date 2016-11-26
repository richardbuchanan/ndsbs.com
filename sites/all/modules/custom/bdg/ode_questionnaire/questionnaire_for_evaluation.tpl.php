<?php
    global $user, $base_url;
    $assessment_id = arg(3);
?>
<div class="wd_1">
    <!--contents starts here-->
    <?php
        $result = save_questionnaire_for_evaluation($assessment_id);
        if($result) {
            //  Email to therapist that questionnaire is completed
            ndsbs_questionnaire_email_to_therapist($assessment_id);
    ?>
        <b>Your answers will be reviewed by your evaluator.</b>
<!--        <br />
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
            when an unknown printer took a galley of type and scrambled it to make a type specimen book. -->
            
        <br />
        <br />
        <?php
            $options = array('query' => array('destination' => 'user/paperwork/list'),'attributes' => array('class' => 'brown'));
            print l(t('Go to the next step to schedule your interview.'), $base_url . '/node/add/counseling-request', $options);
        ?>    
        
    <?php
        } else {
    ?>
            <b>Before submitting to Evaluation all questionnaire must be attempted. Please complete the skipped questions.</b>
<!--            <br />
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
            when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
            It has survived not only five centuries, but also the leap into electronic typesetting.-->
            
            <br /><br />
            <b>Skipped Questions</b> - 
            <br /><br />
            <!-- Skipped questions list -->
            <?php
                print $skipped_questions = get_skipped_question_before_evaluation($assessment_id);
            ?>
            <!-- Skipped questions list -->
    <?php
        }
    ?>
</div>
