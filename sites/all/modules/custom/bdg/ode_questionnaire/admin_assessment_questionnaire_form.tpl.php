<?php
/**
 * @file
 * assessment_questionnaire_form.tpl.php
 */
//  http://dev.newndsbs.com/admin/questionnaire/258/uid/118    Admin Panel Link for questionnaire
?>
<div class="wd_1">
    
    <?php
        $uid = arg(6);
        $user_info = user_load($uid);
    ?>
    
    <div class="table_wrap">
        <table class="schedule_table">
            <tr>
                <td>
                    <b>Name-</b> <?php print l(t($user_info->field_first_name['und'][0]['value'] . ' ' . $user_info->field_last_name['und'][0]['value']), 'user/'.$user_info->uid.'/edit'); ?>
                    <br />
                    <br />

                    <b>Date of Birth-</b> <?php print t($user_info->field_month['und'][0]['value'] . '/' . $user_info->field_dobdate['und'][0]['value'] . '/' . $user_info->field_year['und'][0]['value']); ?>
                    <br />
                    <br />


                    <?php if($user_info->field_phone['und'][0]['value'] <> '') { ?>
                    
                    <b>Phone-</b> <?php print $user_info->field_phone['und'][0]['value']; ?>
                    <br />
                    <br />
                    <?php } ?>
                    <b>Email-</b> <?php print $user_info->mail; ?>

                    <br />
                    <br />
                    <b>Service-</b> <?php print arg(8); ?>

                </td>
            </tr>
        </table>
    </div>

    <div class="form-item_custum" style="width:100%;">
        <?php
            $data = admin_assessment_questionnaire_ques_ans_list();
            //echo '<pre>';
            //print_r($data);
            //echo '</pre>';
            
            foreach($data as $qdata) {
                print '<b>' . $qdata['question'] . '</b>';
                print '<br />';
                foreach($qdata['answer'] as $qans) {
                    if($qans <> '') {
                        print '&nbsp;&nbsp;&nbsp;&nbsp;' . $qans;
                        print '<br />';
                    }
                }
                print '<br />';
                print '<br />';
            }
        ?>
    </div>
</div>
