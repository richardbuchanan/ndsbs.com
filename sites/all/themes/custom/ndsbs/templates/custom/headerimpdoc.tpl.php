<?php
global $base_url;

$imp_data = users_important_documents();
$nid_array = array();

foreach ($imp_data as $data) {
  $nid_array[] = $data->nid;
}

//  load the node data
$impacc_data = node_load_multiple($nid_array);

//  Creating the tmp array for getting the latest imp doc and acc doc status
$tmp_impacc_data = $impacc_data;
$im_loop_in = 1;
$acc_loop_in = 1;

foreach ($tmp_impacc_data as $tmp_data_ia) {
  if ($tmp_data_ia->type == 'important_document' && $im_loop_in == 1) {
    $status_imp = $tmp_data_ia->field_imp_status['und'][0]['value'];
    $creation_date_imp = $tmp_data_ia->created;
    $updated_on_imp = $tmp_data_ia->changed;
    $im_loop_in = 0;
  }
  if ($tmp_data_ia->type == 'account_verification' && $acc_loop_in == 1) {
    $status_acc = $tmp_data_ia->field_acc_status['und'][0]['value'];
    $creation_date_acc = $tmp_data_ia->created;
    $updated_on_acc = $tmp_data_ia->changed;
    $acc_loop_in = 0;
  }
}

$creation_date = empty($creation_date_imp);
$doc_status = !$status_imp && !$status_acc;

$step_one_class = $creation_date ? 'step step-one' : 'step step-one active';
$step_two_class = $doc_status ? 'step step-two' : 'step step-two active';
$complete_class = !$creation_date && !$doc_status ? 'steps' : 'steps active';
?>
<div id="steps-container" class="steps-container-col-2">
  <nav id="steps-wrapper">
    <ul class="<?php print $complete_class; ?>">
      <li class="<?php print $step_one_class; ?>">
        <div class="shift"><span>1</span></div>
      </li>
      <li class="<?php print $step_two_class; ?>">
        <div class="shift"><span>2</span></div>
      </li>
    </ul>
  </nav>

  <div id="steps-badge-wrapper" class="row">
    <div class="steps-col col-xs-6 col-sm-6 col-md-6">
      <?php $badge_class = arg(1) == 'add' && arg(2) == 'important-document' ? 'badge-link active' : 'badge-link'; ?>
      <?php $request_url = $base_url . '/node/add/important-document?destination=list/verification/document'; ?>
      <h3 class="badge-heading">
        <a href="<?php print $request_url; ?>" class="<?php print $badge_class; ?>">Upload Important<br />Documents</a>
      </h3>

      <div class="step-badge-bottom">
        <?php if ($status_imp): ?>
          <?php if (!empty($creation_date_imp)): ?>
            <span>Document upload date: <b><?php print date('m-d-Y', $creation_date_imp); ?></b></span>
          <?php endif; ?>
          <span>Verification date: <b><?php print date('m-d-Y', $updated_on_imp); ?></b></span>
          <span>Status: <b>Verified</b></span>
        <?php elseif (!$status_imp): ?>
          <?php if (!empty($creation_date_imp)): ?>
            <span>Document upload date: <b><?php  print date('m-d-Y', $creation_date_imp); ?></b></span>
            <span>Status : <b>Pending</b></span>
          <?php else: ?>
            <span>Please upload documents requested by NDSBS</span>
          <?php endif; ?>
        <?php endif; ?>
      </div>
    </div>

    <div class="steps-col col-xs-6 col-sm-6 col-md-6">
      <?php $badge_class = arg(0) == 'list' && arg(1) == 'verification' && arg(2) == 'document' ? 'badge-link active' : 'badge-link'; ?>
      <?php $request_url = $base_url . '/list/verification/document'; ?>
      <h3 class="badge-heading">
        <a href="<?php print $request_url; ?>" class="<?php print $badge_class; ?>">View My<br />Documents</a>
      </h3>

      <div class="step-badge-bottom">
        <?php if (!empty($creation_date_imp) || !empty($creation_date_acc)): ?>
          <?php $status = $status_imp && $status_acc ? 'Verified' : 'In-Process'; ?>
          <span>Status: <b><?php print $status; ?></b></span>
        <?php else: ?>
          <span>View your documents</span>
        <?php endif; ?>
      </div>
    </div>
  </div>

  <p><b>Necessary Documents needed by New Directions to provide you service may include:</b> a copy of your photo ID, police report, motor vehicle history, drug test results, or other documents. Your evaluator/counselor will provide you with the items needed. You may upload on this page or fax them to 614-888-3239.</p>

</div>
