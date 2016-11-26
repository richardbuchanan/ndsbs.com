<?php
/**
 * @file
 * assessment_questionnaire_form.tpl.php
 */
//  http://dev.newndsbs.com/admin/questionnaire/258/uid/118    Admin Panel Link for questionnaire
?>
<div class="wd_1">
    <div class="form-item_custum" style="width:100%;">
        <input type="button" value="Print this page" onClick="window.print()">
        <br />
        <br />
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
        <input type="button" value="Print this page" onClick="window.print()">
    </div>
</div>