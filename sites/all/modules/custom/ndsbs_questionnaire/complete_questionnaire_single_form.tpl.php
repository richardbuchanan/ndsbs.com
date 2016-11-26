<?php
/**
 * @file
 * complete_questionnaire_single_form.tpl.php
 */
global $base_path, $base_url, $user;

//echo '<pre>';
//print_r($form);
//echo '</pre>';
$transid = arg(4);
$total_count = get_total_questions_numbers(arg(2), $transid);

?>
<div id="single_questionnaire_view">
    <div class="wd_1">
        <div class="opg"><b>FOR VIEWING ONLY - Do not mark answers in the single page format</b></div>
        <div class="form-item_custum">
            <br />
        <?php
            for($i=1; $i<=$total_count; $i++) {
                print drupal_render($form['question_title_'.$i]);
                print drupal_render($form['data_answer_'.$i]);
                print drupal_render($form['data_answer_other_'.$i]);
                print drupal_render($form['data_answer_month_'.$i]);
                print drupal_render($form['data_answer_year_'.$i]);
                print '<br />';
            }
        ?>
        </div>

        <div class="form-item_custum" id="user_registration_frm_validation">
            <?php //print drupal_render($form['submit']); ?>	<!-- Button to submit the form -->
        </div>

        <div style='display:inline;'>
            <?php
                //  Use to render the drupal 7 form
                print drupal_render_children($form);
            ?>
        </div>
    </div>
</div>