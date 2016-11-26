
<style>
.form-item_custum .form-item{ margin-bottom:5px;}
.form-item_custum label{ width:auto; font-weight:bold;}
.form-item_custum .form-text, .form-textarea-wrapper textarea{ width:auto;}
</style>
<?php
/**
 * @file
 * assessment_questionnaire_form.tpl.php
 */
//  http://dev.ndsbs.com/user/questionnaire/258/uid/118    Admin Panel Link for questionnaire
global $base_path, $base_url, $user;

$left_time = get_left_questionnaire_time();

if($left_time <= 0 && $user->roles[6] == 'client') {
    //  Logout the user if he has exceed the time limit
    user_logout_exceed_time_limit();
    print '<script>$.cookie("preserveTime", 0, { path:"/"});</script>';
}
?>

<?php
    //  Display the timer to client user only
    if($user->roles[6] == 'client') {
?>
<script>
    onload = function() {
        var tmpValue = $.cookie("preserveTime");
        //  Assigning the value into the span id
        if(tmpValue > 0) {
            $("#timer").html($.cookie("preserveTime"));
            var timeTmpUp = $.cookie("preserveTime");
        } else {
            var timeFirst = <?php print $left_time; ?>;
            $("#timer").html(timeFirst);
            var timeTmpUp = timeFirst;
        }
        
        //  Convert the timer into minute and seconds
        var minutes = Math.floor(timeTmpUp / 60);
        var seconds = timeTmpUp % 60;
        minutes = minutes <= 9 ? "0"+minutes : minutes;
        seconds = seconds <= 9 ? "0"+seconds : seconds;
        //alert(minutes+":"+seconds);
        $("#timerMinuteSec").html(minutes+":"+seconds);
        
        //  Block the mouse right click
        document.oncontextmenu=function(){return false;}
    }
    var settimer = '1';
    $(function() {
        //  Create the cookie expiration time that is 90 minute
        var expires = new Date();
        var allotted_seconds = 10800;   //  Cookie expiration time 3 hr = 10800
        expires.setTime(expires.getTime() + (allotted_seconds * 1000));
        
        var timer = window.setInterval(function() {
                var tmpValue = $.cookie("preserveTime");
                //  Code moved in onload section

                //  Decrease the count down by 1
                var timeCounter = $("#timer").html();
                if(settimer == '1') {
                    //  $.cookie("preserveTime", null, { path:'/'});
                    var updateTime = eval(timeCounter)- eval(1);
                    $.cookie("preserveTime", updateTime, {expires: expires, path:'/'});
                } else {
                        var updateTime = eval(timeCounter);
                        $.cookie("preserveTime", updateTime, {expires: expires, path:'/'});
                }
                //  $("#timer").html(updateTime);

                if(tmpValue > 0) {
                    $("#timer").html($.cookie("preserveTime"));
                    //  Convert the timer into minute and seconds
                    var timeTmp = $.cookie("preserveTime");
                    var minutes = Math.floor(timeTmp / 60);
                    var seconds = timeTmp % 60;
                    minutes = minutes <= 9 ? "0"+minutes : minutes;
                    seconds = seconds <= 9 ? "0"+seconds : seconds;
                    //alert(minutes+":"+seconds);
                    $("#timerMinuteSec").html(minutes+":"+seconds);
                }
//                else {
//                    alert('here');
//                    ///$("#timer").html(updateTime);
//                    //  AJAX Request for logout
//                    ajaxRequest();
//                }

                if(updateTime <= 0){
                    clearInterval(timer);
                    ajaxRequest();
                }
            }, 1000);
    });
</script>
<?php
    }
?>

<div class="wd_1">
<?php
    if($user->roles[6] == 'client') {
?>
        <div class="questionnaire_upper">
         <div class="timer_icon">
          <span class="questionnaire_upper_timer1" id="timer"><?php //print $left_time; ?></span>
          <span class="questionnaire_upper_timer2" id="timerMinuteSec"><?php //print $left_time; ?></span>
          <span class="questionnaire_upper_timer2">(MM:SS)</span>
        </div>
        <b style="float:right;">
            <?php
                $options = array('attributes' => array('name' => 'single_questionnaire_view', 
                                                       'class' => array('simple-dialog', 'brown_btn'), 
                                                       'title' => 'See complete questionnaire', 
                                                       'rel' => array('width:900;height:550;resizable:true;position:[center,60]')));
                print l(t('See complete questionnaire in a single page'), 'questionnaire/list/'.arg(2).'/trans/'.arg(4), $options);
            ?>

            <?php
                    $sub_eva = array('attributes' => array('class' => array('brown_btn'), 
                                                   'title' => 'Pause and return to My Account', ));
                    //$sub_eva = array('attributes' => array('class' => 'evaluation_btn'));
                    print l(t('Pause and return to My Account'), 'user/'.$user->uid, $sub_eva);
            ?>
            </b>
        </div>
        
<?php
    }
?>      <h2 class="qcdotted">
                <?php
                    $total_ass_questions = get_total_questions_numbers($assessment_id = arg(2), $transid = arg(4));
                    $total_attempted_questions = get_total_attempted_questions_numbers($assessment_id = arg(2), $transid = arg(4));
                ?>
                <?php print $total_attempted_questions; ?> out of <?php print $total_ass_questions; ?> answers saved

                <?php
                        $sub_eva = array('attributes' => array('class' => array('lgrey_btn'), 
                                                       'title' => 'Submit for evaluation', ));
                        print l(t('Submit all answers/finish questionnaire'), 'user/evaluation/questionnaire/'.arg(2).'/trans/'.arg(4), $sub_eva);
                ?>
        </h2>
    <div class="form-item_custum" style="width:100%;">
        <?php print drupal_render($form['question_title']); ?>
        
        <?php print drupal_render($form['data_answer']); ?>
        
        <?php print drupal_render($form['data_answer_other']); ?>
        
        <?php print drupal_render($form['data_answer_month']); ?>
        <?php print drupal_render($form['data_answer_year']); ?>
    </div>

    
    <div class="form-item_custum left" style="margin-top:20px;">
        <?php
            // Show the pager START
            /////////////////////////////////////////////////////
            /*
                $data = str_replace('first', '', theme('pager'));
                $data1 = str_replace('last', '', $data);
                $data2 = str_replace('«', '', $data1);
                print $data3 = str_replace('»', '', $data2);
            */
            /////////////////////////////////////////////////////
            // Show the pager END
            
            //  Custom pager START
                print $pager_data = questionnaire_custom_pager(arg(2));
            //  Custom pager END
        ?>
    </div>
    
    
<?php
    if($user->roles[6] == 'client') {
?>
    <div class="form-item_custum left form-submit_adj" id="user_registration_frm_validation" style="margin:14px 0 0; ">
        <?php print drupal_render($form['submit']); ?>	<!-- Button to submit the form -->
    </div>
<?php
    }
?>
    <div style='display:none;'>
        <?php print drupal_render($form['data_question_id']); ?>
        <?php print drupal_render($form['question_sequesce']); ?>
        <?php print drupal_render($form['textarea_ans_id']); ?>
        <?php print drupal_render($form['month_year_ans_id']); ?>
        <?php print drupal_render($form['view_questionnaire']); ?>
        <?php print drupal_render($form['month_year_ans_id']); ?>
        <?php
            //  Use to render the drupal 7 form
            print drupal_render_children($form);
        ?>
    </div>
</div>
<script>
    function ajaxRequest() {
        // Fire the ajax request
        jQuery.ajax({
            url: '<?php print $base_url; ?>/user/expire/questionnaire',
            type: 'post',
            ///data: { postdata: postdata },
            success: function(response) {
                alert('Your assigned time has expired to attempt the question, You will be logout.');
                window.location = '<?php print $base_url; ?>/user/login';
            }
        });//  Ajax function closed
    }
</script>
