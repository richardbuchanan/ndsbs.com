<?php
/**
 * @file
 * user_view_questionnaire.tpl.php
 */
?>
<h1>
    Complete/Resume questionnaire
</h1>
<div class="wd_1">
    <div class="form-item_custum request4">
        <?php
            print drupal_render(complete_resume_questionnaire());
        ?>
    </div>
</div>