<?php

/**
 * @file
 * Theme implementation to display the user's My Assessment page.
 */
?>
<?php include('includes/functions.inc'); ?>
<?php include('includes/variables.inc'); ?>
<div id="page-container">
  <?php include('includes/top-header.inc'); ?>
  <?php include('includes/sub-header.inc'); ?>
  <?php include('includes/highlights.inc'); ?>
  <section id="content-section" class="clearfix content-wrap">
    <a id="main-content"></a>
    <?php include('includes/admin-actions.inc'); ?>
    <div id="content" class="full-width">
      <?php include('includes/client-progress.inc') ?>
      <div id="current-line-holder">
        <div id="current-line">
          <div class="current-<?php echo htmlentities($_GET['step']); ?> current-line">
            <div class="box"></div>
          </div>
        </div>
      </div>
      <article id="page-content">

      <?php if (isset($_GET["step"]) && $_GET["step"] == 'questionnaire'): ?>
        <!-- Begin My Questionnaire -->
        <div class="my-questionnaire-wrapper">
          <h1 class="assessment-title">My Questionnaire</h1>
          <?php $orders = ode_verify_order($user); ?>
          <?php if (isset($orders[0]->order_id)): ?>
            <div class="my-questionnaire-header">
              <h3>Questionnaire Instructions</h3>
              <ul>
                <li><strong>Click "Next Question" to save each answer.</strong></li>
                <li><strong>You may change the previous answer by selecting "Previous Question".</strong></li>
                <li><strong>When completed, select "Submit Questionnaire".</strong></li>
              </ul>
            </div><br />
  
            <!-- Begin DUI Drug & Alcohol Clients -->
            <?php if ($orders[0]->nid == '82'): ?>
              <ul>
                <li><strong>Assessment</strong>: DUI Drug & Alcohol</li>
                <li><strong>Total Questions</strong>: 69</li>
                <li><strong>Average Completion Time</strong>: 15 minutes</li>
              </ul>
              <?php $questionnaire = ode_verify_questionnaire($user); ?>
              <?php if (!isset($questionnaire[0]->sid)): ?>
                <div class="start-questionnaire">
                  <p><span class="questionnaire-incomplete">To begin click the button below.<br />If you need to return at a later date to finish the questionnaire, you can select "Save Draft" at any time.</span></p>
                  <a href="/assessments/dui-drug-alcohol/questionnaire">Start Questionnaire</a>
                </div>
              <?php endif; ?>
              <?php if (isset($questionnaire[0]->sid)): ?>
                <?php if ($questionnaire[0]->is_draft == '1'): ?>
                  <p><span class="questionnaire-incomplete">Your questionnaire was saved as a draft. You can complete your questionnaire <a href="/node/112/submission/<?php print $questionnaire[0]->sid; ?>/edit">here</a>.</span></p>
                <?php endif; ?>
                <?php if ($questionnaire[0]->is_draft != '1'): ?>
                  <p><span class="questionnaire-complete">You have already completed your questionnaire. You can review your answers <a href="/node/112/submission/<?php print $questionnaire[0]->sid; ?>">here</a>.</span></p>
                <?php endif; ?>
              <?php endif; ?>
            <?php endif; ?>
            <!-- End DUI Drug & Alcohol Clients -->
  
            <!-- Begin DUI Alcohol Clients -->
            <?php if ($orders[0]->nid == '83'): ?>
              <ul>
                <li><strong>Assessment</strong>: DUI Alcohol</li>
                <li><strong>Total Questions</strong>: 30</li>
                <li><strong>Average Completion Time</strong>: 15 minutes</li>
              </ul>
              <br />
              <?php $questionnaire = ode_verify_questionnaire($user); ?>
              <?php if (!isset($questionnaire[0]->sid)): ?>
                <div class="start-questionnaire">
                  <p><span class="questionnaire-incomplete">To begin your questionnaire, click the button below.<br />If you need to return at a later date to finish the questionnaire, you can select "Save Draft" at any time during the quesitonnaire.</span></p>
                  <a href="/assessments/dui-alcohol/questionnaire">Start Questionnaire</a>
                </div>
              <?php endif; ?>
              <?php if (isset($questionnaire[0]->sid)): ?>
                <?php if ($questionnaire[0]->is_draft == '1'): ?>
                  <p><span class="questionnaire-incomplete">Your questionnaire was saved as a draft. You can complete your questionnaire <a href="/node/88/submission/<?php print $questionnaire[0]->sid; ?>/edit">here</a>.</span></p>
                <?php endif; ?>
                <?php if ($questionnaire[0]->is_draft != '1'): ?>
                  <p><span class="questionnaire-complete">You have already completed your questionnaire. You can review your answers <a href="/node/88/submission/<?php print $questionnaire[0]->sid; ?>">here</a>.</span></p>
                <?php endif; ?>
              <?php endif; ?>
            <?php endif; ?>
            <!-- End DUI Alcohol Clients -->
  
            <!-- Begin DEMO Clients -->
            <?php if ($orders[0]->nid == '85'): ?>
              <ul>
                <li><strong>Assessment</strong>: DEMO</li>
                <li><strong>Total Questions</strong>: 3</li>
                <li><strong>Average Completion Time</strong>: 15 minutes</li>
              </ul>
              <br />
              <?php $questionnaire = ode_verify_questionnaire($user); ?>
              <?php if (!isset($questionnaire[0]->sid)): ?>
                <div class="start-questionnaire">
                  <p><span class="questionnaire-incomplete">To begin your questionnaire, click the button below.<br />If you need to return at a later date to finish the questionnaire, you can select "Save Draft" at any time during the quesitonnaire.</span></p>
                  <a href="/assessments/demo-assessment/questionnaire">Start Questionnaire</a>
                </div>
              <?php endif; ?>
              <?php if (isset($questionnaire[0]->sid)): ?>
                <?php if ($questionnaire[0]->is_draft == '1'): ?>
                  <p><span class="questionnaire-incomplete">Your questionnaire was saved as a draft. You can complete your questionnaire <a href="/node/87/submission/<?php print $questionnaire[0]->sid; ?>/edit">here</a>.</span></p>
                <?php endif; ?>
                <?php if ($questionnaire[0]->is_draft != '1'): ?>
                  <p><span class="questionnaire-complete">You have already completed your questionnaire. You can review your answers <a href="/node/87/submission/<?php print $questionnaire[0]->sid; ?>">here</a>.</span></p>
                <?php endif; ?>
              <?php endif; ?>
            <?php endif; ?>
            <!-- End DEMO Clients -->
  
            <!-- All Clients -->
            
            <!-- End All Clients -->
          <?php endif; ?>
  
          <!-- Begin Clients Without Orders -->
          <?php if (!isset($orders[0]->order_id)): ?>
            <?php // Redirect these users to the assessments page. ?>
            <?php drupal_goto($base_url.'/assessments'); ?>
          <?php endif; ?>
          <!-- End Clients Without Orders -->
        </div>
        <!-- End My Questionnaire -->
      <?php endif; ?>

      <?php if (isset($_GET["step"]) && $_GET["step"] == 'interview'): ?>
        <!-- Begin My Interview -->
        <div class="my-interview-wrapper">
          <h1 class="assessment-title">My Interview</h1>
          <?php $viewName = 'my_interview'; ?>
          <?php print views_embed_view($viewName); ?>
        </div>
        <!-- End My Interview -->
      <?php endif; ?>

      <?php if(isset($_GET["step"]) && $_GET["step"]=='necessary-documents'): ?>
        <!-- Begin My Documents -->
        <div class="my-documents-wrapper">
          <h1 class="assessment-title">My Necessary Documents</h1>
          <?php $viewName = 'my_necessary_documents'; ?>
          <?php print views_embed_view($viewName); ?>
        </div>
        <!-- End My Documents -->
      <?php endif; ?>

      <?php if(isset($_GET["step"]) && $_GET["step"] == 'assessment-report'): ?>
        <!-- Begin My Report -->
        <div class="my-report-wrapper">
          <h1 class="assessment-title">My Assessment Report</h1>
          <?php $viewName = 'my_assessment_report'; ?>
          <?php print views_embed_view($viewName); ?>
        </div>
        <!-- End My Report -->
      <?php endif; ?>
      </article>
    </div>
  </section>
  <?php include('includes/footer.inc'); ?>
</div>
