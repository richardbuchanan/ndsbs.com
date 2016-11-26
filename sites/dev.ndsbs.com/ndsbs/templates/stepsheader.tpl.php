<?php
global $base_url;

//if($_SESSION['COMPLETE_MY_QUESTIONNAIRE'] == '') {
//    //  Used current_path() Drupal core function for getting the current path
//    $_SESSION['COMPLETE_MY_QUESTIONNAIRE'] = current_path();    //  questionnaire/start/259/trans/15
//}

//$_SESSION['SCHEDULE_MY_INTERVIEW'] = 'node/add/counseling-request';
//$_SESSION['UPLOAD_IMPORTANT_DOCUMENT'] = 'user/paperwork/list';

?>

<?php
//  Implemetation START for creating steps data  //
    //  Questionnaire Section
    $get_assessment_id = explode('/', $_SESSION['COMPLETE_MY_QUESTIONNAIRE']);
    $assessment_id = $get_assessment_id[2];
    $transid = $get_assessment_id[4];
    $termid = $get_assessment_id[6];
    //dpm($assessment_id);
    //dpm($transid);
    //dpm($termid);
    
    $question_info = get_total_attempted_times($assessment_id, $transid);
    $total_attempts = $question_info['total_attempts'];
    $total_time = $question_info['total_time'];
    $evaluation_status = $question_info['evaluation'];

    //  Get total number of attempts
    if($total_attempts <> '') {
        $times = $total_attempts;
    } else {
        $times = 0;
    }

    //  Paper work Section
    //  function defined to load the content type paper-work
    $val = get_paperwork_info_transid($transid);
    $nid_array = array();
    foreach ($val as $data) {
        $nid_array[] = $data->nid;
    }
    
    //  load the node data
    $result = node_load_multiple($nid_array);

    foreach($result as $rec_data_steps) {
        if($rec_data_steps->field_paperwork_status['und'][0]['value'] == 1) {
            $verified_date = date('m-d-Y', $rec_data_steps->changed);
        }
    }

    //  Scheduling counselin gsection
    $coun_data = get_counseling_request_info_transid($transid);
    $counseling_data = node_load($coun_data[0]->nid);

    //  
    $data_transaction = get_transaction_data_by_transid($transid);
    $order_date = date('m-d-Y', $data_transaction[0]->order_date);
//  Implemetation END for creating steps data  //
    $nid = node_load($assessment_id);

/**
 * BEGIN BDG DEVELOPMENT
 *
 * DO NOT MODIFY/REMOVE ANYTHING IN THIS SECTION WITHOUT CONTACTING ME FIRST!!!
 *
 * @contact Richard Buchanan <richard_buchanan@buchanandesigngroup.com>
 * @link http://www.buchanandesigngroup.com @endlink
 */
global $user;
$pdf = $user->uid . '.pdf';
$uri = 'public://reports/uploaded/' . $pdf;
/**
 * END BDG DEVELOPMENT
 */
?>

<?php
    //  Report download section
    $data = get_purchased_items_reports_trans($assessment_id, 1, 0, $termid, $transid);
    foreach($data as $report_info) {
        //  load the node data
        //$result111 = node_load($report_info->nid);
    }
?>

<h1><?php print $nid->field_assessment_title['und'][0]['value']; ?>
	<span>Date : <?php print $order_date; ?></span>
</h1>
<ul class="step_container">
	<li class="step1<?php if($evaluation_status == 1) print ' selected'; ?>">
  	<span></span>
  </li>
 	<li class="step2<?php if($counseling_data->field_attempted_on['und'][0]['value'] != 0) print ' selected'; ?>">
    <span></span>
  </li>
  <li class="step3<?php if($rec_data_steps->field_paperwork_status['und'][0]['value'] == 1) print ' selected'; ?>">
    <span></span>
  </li>
  <li class="step4<?php if($report_info->main_report <> '') print ' selected'; ?>">
    <span></span>
  </li>
  <li class="step5<?php if($report_info->main_report <> '') print ' selected'; ?>"></li>
</ul>
<div class="step_box_container">
	<!-- Questionnaire Start -->
  <div class="step_box">
    <?php
      if (arg(0) == 'questionnaire' &&
        arg(1) == 'start' &&
        arg(3) == 'trans') {
          $class = 'step_top selected';
      }
      else {
        $class = 'step_top';
      }
    ?>
    <a href="
      <?php
        print $base_url . '/' . $_SESSION['COMPLETE_MY_QUESTIONNAIRE'];
      ?>" class="<?php print $class; ?>">
      <h2 class="complete_icon">Complete<br/>My Questionnaire</h2>
    </a>
    <div class="step_bottom">
      <p>No. Of Attempts : <b><?php print $times; ?></b><br />Status : <b>
        <?php
          if($evaluation_status == 1)
            print 'Completed';
          else print 'Pending';
        ?></b><br /><!--Date : <b>04-17-2013</b>-->
      </p>
      <ul class="status_list"></ul>
    </div>
  </div>
  <!-- Questionnaire End -->

  <div class="step_box">
    <?php
      if (arg(0) == 'node' &&
        arg(1) == 'add' &&
        arg(2) == 'counseling-request') {
          $class = 'step_top selected';
      }
      else {
        $class = 'step_top';
      }
    ?>
    <a href="<?php print $base_url .
    '/node/add/counseling-request?destination=user/paperwork/list'; ?>" class="
    <?php print $class; ?>">
      <h2 class="schedule_icon">Schedule<br />My Interview</h2>
    </a>

    <?php
      if ($counseling_data->field_attempted_on['und'][0]['value'] != 0) { ?>
        <div class="step_bottom">
          <p>Status : <b>Attended</b></p>
        </div>
      <?php }
      else { ?>
        <div class="step_bottom">
          <p>Call Now to Schedule (9 a.m. – 5 p.m. EST) OR indicate & Save
           appt. request below</p>
        </div>
      <?php }
    ?>
  </div>

  <!-- Paper work section START -->
  <div class="step_box">
    <?php
      if ((arg(0) == 'user' && arg(1) == 'paperwork' && arg(2) == 'list') ||
        (arg(0) == 'node' && arg(2) == 'paper-work') ||
        (arg(0) == 'node' && arg(2) == 'edit')) {
        $class = 'step_top selected';
      }
      else {
        $class = 'step_top';
      }
    ?>
    <a href="<?php print $base_url . '/user/paperwork/list'; ?>"
      class="<?php print $class; ?>">
      <h2 class="doc_icon">Upload or Fax<br/>Necessary Documents</h2>
    </a>
    <?php
      if (!empty($verified_date)) { ?>
        <div class="step_bottom">
          <p>Verified On : <b><?php print $verified_date; ?></b></p>
        </div>
      <?php }
      else { ?>
        <div class="step_bottom">
          <p>Submit documents requested by your counselor</p>
        </div>
      <?php }
    ?>
  </div>
  <!-- Paper work section END -->

  <!--    Report Section    -->
  <div class="step_box mr_0">
    <?php
      if ((arg(0) == 'view' && arg(1) == 'assessment' && arg(2) == 'report') ||
        (arg(0) == 'user' && arg(1) == 'email' && arg(2) == 'report')) {
          $class = 'step_top selected';
      }
      else {
        $class = 'step_top';
      }
    ?>
    <a href="<?php print $base_url . '/view/assessment/report'; ?>"
      class="<?php print $class; ?>">
      <h2 class="assr_icon">View My<br/>Assessment Report</h2>
    </a>
      
    <div class="step_bottom">
      <?php
        if ($report_info->main_report == '') {
          print '<p>Status : <b>Under Progress</b><br />
          Must complete the 3 Steps to the left to receive a report.</p>';
        }
        else {
          print '<p>Status : <b>Completed</b></p>'; ?>
          <ul class="status_list">
            <li>
              <!--<a href="#" class="view-icon" title="View"></a>-->
              <?php
								// ------------------- BEGIN BDG DEVELOPMENT -------------------
								// ------------------ DO NOT MODIFY OR REMOVE ------------------
								if (file_exists($uri)) {
									print '<a href="'.$base_url .
									'/sites/ndsbs.com/files/reports/uploaded/' . $pdf.'"
                  class="view-icon" title="View" target="_blank"></a>';
								}
								// -------------------- END BDG DEVELOPMENT --------------------
                //  Report Download
                else if ($report_info->main_report <> '') {
                  $fname = $report_info->main_report;
                  print '<a href="'.$base_url .
                  '/sites/ndsbs.com/files/reports/' . $fname.'"
                  class="view-icon" title="View" target="_blank">
                  </a>';
                }
                else {
                  print '<a href="javascript:void(0);"
                  class="view-icon" title="View"></a>';
                }
              ?>
            </li>
                  
            <li>
              <!--<a href="" class="download-icon" title="Download"></a>-->
              <?php
								// ------------------- BEGIN BDG DEVELOPMENT -------------------
								// ------------------ DO NOT MODIFY OR REMOVE ------------------
								if (file_exists($uri)) {
									$fname_path = 'public://reports/uploaded/' . $pdf;
									print l(t(''), $base_url.'/download/report', array(
                    'query' => array(
                      'file_name_path' => $fname_path
                    ),
                    'attributes' => array(
                      'class' => 'download-icon',
                      'title' => 'Download'
                    )
                  ));
								}
								// -------------------- END BDG DEVELOPMENT --------------------
                //  Report Download
                else if ($report_info->main_report <> '') {
                  $fname = $report_info->main_report;
                  $file_name_path = 'public://reports/'.$fname;
                  print l(t(''), $base_url.'/download/report', array(
                    'query' => array(
                      'file_name_path' => $file_name_path
                    ),
                    'attributes' => array(
                      'class' => 'download-icon',
                      'title' => 'Download'
                    )
                  ));
                }
                else {
                  print '<a href="javascript:void(0);"
                    class="download-icon" title="Download"></a>';
                }
              ?>
            </li>

            <li>
              <?php
								// ------------------- BEGIN BDG DEVELOPMENT -------------------
								// ------------------ DO NOT MODIFY OR REMOVE ------------------
								if (file_exists($uri)) {
									print '<a href="'.$base_url .
									'/sites/ndsbs.com/files/reports/uploaded/' . $pdf.'"
                  class="print-icon" title="Print" target="_blank"></a>';
								}
								// -------------------- END BDG DEVELOPMENT --------------------
                //  Report Print
                else if ($report_info->main_report <> '') {
                  $fname = $report_info->main_report;
                  print '<a href="'.$base_url .
                    '/sites/ndsbs.com/files/reports/' . $fname.'"
                    class="print-icon" title="Print" target="_blank"></a>';
                }
                else {
                  print '<a href="javascript:void(0);" class="print-icon"
                  title="Print"></a>';
                }
              ?>
              <!--<a href="#" class="print-icon" title="Print"></a>-->
            </li>

            <li>
              <?php
								// ------------------- BEGIN BDG DEVELOPMENT -------------------
								// ------------------ DO NOT MODIFY OR REMOVE ------------------
								if (file_exists($uri)) {
									print '<a href="'.$base_url .	'/user/email/report/' . $pdf.'"
                   class="mail-icon4 mr_0" title="E-mail"></a>';
								}
								// -------------------- END BDG DEVELOPMENT --------------------
                //  Report Download
                else if ($report_info->main_report <> '') {
                  $fname = $report_info->main_report;
                  $file_name_path = 'public://reports/'.$fname;
                  
                  /*
                  //  Send Report in email
                 print l(t(''), $base_url.'/send/attachment', array(
                    'query' => array(
                      'file_name_path' => $file_name_path,
                      'file_name' => $fname,
                      'report_nid' => $report_nid,
                      'report_tid' => $report_tid,
                    ),
                    'attributes' => array(
                      'class' => 'mail-icon3 mr_0',
                      'title' => 'E-mail'
                    )
                  )); */
                 // print '<a href="'.$base_url.'/user/email/report/'
                  //  .$fname.'" class="mail-icon mr_0" title="E-mail"></a>';
                }
                else {
                //  print '<a href="javascript:void(0);" class="mail-icon1 mr_0"
                //  title="E-mail"></a>';
                }
              ?>
              <!--<a href="" class="mail-icon mr_0" title="E-mail"></a>-->
            </li>
          </ul>
      <div class="status-complete add-testimonial">
        <span>Would you like to <a href="https://www.ndsbs.com/testimonials/add?destination=<?php print bdg_ndsbs_get_steps_page_no_base_url(); ?>">add a testimonial</a>?</span>
      </div>
          <?php
        }
      ?>
    </div>
  </div>
</div>

<?php
/**
 * BDG DEVELOPMENT BEGINS HERE
 *
 * To separate some debugging tools and display database information while
 * developing, I have added this section to the dashboard page.
 * DO NOT MODIFY/REMOVE ANYTHING IN THIS SECTION WITHOUT CONTACTING ME FIRST!!!
 *
 * @contact Richard Buchanan <richard_buchanan@buchanandesigngroup.com> *
 * @link http://www.buchanandesigngroup.com @endlink
 */

/**
 * Check For User ID
 *
 * Check to make sure the user ID is 387, which is the user ID for Richard
 * Buchanan's client NDSBS account. This ensures the following does not  show up
 * on the dashboard if another user is logged in.
 *
$rcb = NULL;
if ($user->uid == 387) {
	$rcb = TRUE;
}

if ($rcb) {
	// Debug the file field for uploaded PDF files. Debug info will be printed into
	// a Kuomo element for easy debugging.
	$pdf_field_info = field_info_field(field_import_pdf_report);
	//dpm($pdf_field_info);
	
	// Print information about the reports transactions.
	$get_assessment_id = explode('/', $_SESSION['COMPLETE_MY_QUESTIONNAIRE']);
	$assessment_id = $get_assessment_id[2];
	$transid = $get_assessment_id[4];
	$termid = $get_assessment_id[6];
	dpm($assessment_id);
	//dpm($transid);
	//dpm($termid);
	$data = get_purchased_items_reports_trans($assessment_id,
		1, 0, $termid, $transid);
	
	foreach($data as $report_info) {
		//dpm($report_info);
	}
	$fname = $report_info->main_report;
	$f_name = $report_info->field_import_pdf_report;
	print '<code style="margin-bottom:2em;">';
	print 'ASSESSMENT ID INFO<br /><br />' . 
	'File Name: ' . $fname . '<br />' .
	'PDF File Upload: ' . $f_name . '<br />' .
	'0: ' . $get_assessment_id[0] . '<br />' .
	'1: ' . $get_assessment_id[1] . '<br />' .
	'2: ' . $get_assessment_id[2] . '<br />' .
	'3: ' . $get_assessment_id[3] . '<br />' .
	'4: ' . $get_assessment_id[4] . '<br />' .
	'5: ' . $get_assessment_id[5] . '<br />' .
	'6: ' . $get_assessment_id[6] . '<br />' .
	'7: ' . $get_assessment_id[7] . '<br />' .
	'8: ' . $get_assessment_id[8] . '<br />' .
	'9: ' . $get_assessment_id[9] . '<br />' .
	'10: ' . $get_assessment_id[10] . '<br />' .
	'11: ' . $get_assessment_id[11] . '<br />' .
	'12: ' . $get_assessment_id[12] .
	'</code>';
	
	// Get info from report_form node fields
	$entity_type = 'node';
	$bundle_name = 'report_format';
	$field_name = 'field_import_pdf_report';
	$info = field_info_instance($entity_type, $field_name, $bundle_name);
	$label = $info['label'];
	print '<code style="margin-bottom:2em;">';
	print 'REPORT_FORMAT FIELD_IMPORT_PDF_REPORT<br /><br />' .
	'Label: ' . $label .
	'</code>';
	
	
	$assessment_node = get_assessment_information(arg(1));
	$nid_array = array();
	foreach ($assessment_node as $data) {
    $nid_array[] = $data->nid;
	}

	//  load the node data
	$result_node = node_load_multiple($nid_array);
	foreach($result_node as $node_data) {
    $result = $node_data;
	}

	if ($result[628]->created >= 1388935751) {
		echo '<pre>';
		$reference = $result[628]->uid;
		print_r($reference);
		echo '</pre>';
	}
	$transactio_data = get_transactions_detail();
	foreach($transactio_data as $data) {
		$user_info = user_load($data->uid);
		$node_info = node_load($data->nid);
		echo '<pre>';
		print_r($data->transaction_id);
		print_r($node_info);
		print_r(get_transactions_detail());
		echo '</pre>';
	}
}
else {
	print 'Nothing to show here';
	print $uri;
} */
?>
