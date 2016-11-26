<?php include('variables.inc'); ?>
<div id="site-messages">
  <div class="messages status">
    <h2 class="element-invisible">Status message</h2>
    <?php print $step_message; ?>
  </div>
</div>
<div id="client-progress">
  <div class="content-wrap">
    <div id="progress-bar-holder">
      <ul id="progress-bar">
        <li class="bar-1 <?php print $questionnaire_status; ?>"></li>
        <li class="bar-2 <?php print $interview_status; ?>"></li>
        <li class="bar-3 <?php print $docs_status; ?>"></li>
        <li class="bar-4 <?php print $report_status; ?>"></li>
      </ul>
    </div>
    <ul id="steps">
      <li class="step-questionnaire <?php print $questionnaire_status; ?>">
        <?php print $questionnaire_link; ?>
      </li>
      <li class="step-interview <?php print $interview_status; ?>">
        <?php print $interview_link; ?>
      </li>
      <li class="step-necessary-documents <?php print $docs_status; ?>">
        <?php print $necessary_docs_link; ?>
      </li>
      <li class="step-assessment-report <?php print $report_status; ?>">
        <?php print $assessment_report_link; ?>
      </li>
    </ul>
    <div style="width: 1px; height: 30px; clear: both; display: block;"></div>
  </div>
</div>
