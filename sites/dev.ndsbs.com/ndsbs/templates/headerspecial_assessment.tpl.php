<?php
    global $base_url;
    $stepsdata = get_special_assessment_data_status();
    $stepsdata = isset($stepsdata[0]) ? $stepsdata[0] : 0;
?>
<h1>Special Assessments or Rush order requests</h1>
<ul class="step_container">
    <!--    Use selected for green color strip START    -->
    <?php
        if($stepsdata && isset($stepsdata->payment_status) && $stepsdata->payment_status == 0) {
            print '<li class="step1 selected"><span></span></li>';
        } else {
            print '<li class="step1"><span></span></li>';
        }
    ?>
    <?php
//        if($stepsdata->field_state_form_payment_status['und'][0]['value'] > 0) {
//            print '<li class="step2 selected"><span></span></li>';
//        } else {
//            print '<li class="step2"><span></span></li>';
//        }
    ?>
    <?php
        //if($stepsdata->status == 1 && $stepsdata->payment_status != 1) {
          if(false) {
            print '<li class="step4 selected"><span></span></li>
                   <li class="step5 selected"></li>';
        } else {
            print '<li class="step4"><span></span></li>
                   <li class="step5"></li>';
        }
    ?>
    <!--    Use selected for green color strip END    -->
</ul>
<div class="step_box_container">
    <div class="step_box">
        <?php
            if(arg(0) == 'user' && arg(1) == 'special' && arg(2) == 'assessment') {
                $class = 'step_top selected';
            } else {
                $class = 'step_top';
            }
        ?>
        <a href="<?php print $base_url . '/user/special/assessment?destination=special/assessment/payment'; ?>" class="<?php print $class; ?>">
            <h2 class="doc_icon">Request Special or <br/>Rush Order Services</h2>
        </a>
        <div class="step_bottom">
            <p>
                <?php
                    if($stepsdata && $stepsdata->status <> 0) {
                        print 'Date Requested : <b>'.date('m-d-Y', $stepsdata->updated_on).'</b><br/>Status : <b>Completed</b>';
                    } else {
                        if($stepsdata && $stepsdata->status == 0 && isset($stepsdata->status)) {
                            print '
                                   Date Requested: <b>'.date('m-d-Y', $stepsdata->requested_on).'</b><br/>Status : <b>Pending</b>';
                        } else {
                            print 'Please select assessment below Click Submit and Await email invoice to make payment from.';
                        }
                    }
                ?>
            </p>
            <ul class="status_list"></ul>
        </div>
    </div>
    <div class="step_box">
        <?php
            if((arg(0) == 'special' && arg(1) == 'assessment' && arg(2) == 'payment')) {
                $class = 'step_top selected';
            } else {
                $class = 'step_top';
            }
        ?>
        <a href="<?php print $base_url . '/special/assessment/payment'; ?>" class="<?php print $class; ?>">
            <h2 class="doc_icon">Make<br/>Payment</h2>
        </a>
        <div class="step_bottom">
            <p>
                <?php
                    if($stepsdata && $stepsdata->status) {
                        print 'Invoice sent by counselor,select assesment below to make payment. <br />';
                        print 'Status : <b>Pending</b><br/>
                        Payment Status : <b>Not Paid</b>';
                    } else {
                        print 'Click here to make payment.';
                    }
                ?>
            </p>
            <ul class="status_list"></ul>
        </div>
    </div>

    <?php
    /*
    <div class="step_box mr_0">
        <?php
            if(arg(0) == 'user' && arg(1) == 'stateform' && arg(2) == 'list') {
                $class = 'step_top selected';
            } else {
                $class = 'step_top';
            }
        ?>
        <a href="<?php print $base_url . '/user/stateform/list'; ?>" class="<?php print $class; ?>">
            <h2 class="assr_icon">View My completed<br/>DMV forms</h2>
        </a>
        <div class="step_bottom">
            <p>
                <?php
                    $view_status = 0;
                    if($stepsdata->field_report_state_form['und'][0]['value'] <> '') {
                        $view_status = 1;
                        print 'Status : <b>Completed</b>';
                        $fname = $rec->field_report_state_form['und'][0]['value'];
                        $file_name_path = 'public://reports/'.$fname;
                        print l(t($fname), $base_url.'/download/report', array('query' => array('file_name_path' => $file_name_path)));
                    } else {
                        $view_status = 0;
                        if($stepsdata->created <> '') {
                            print 'Status : <b>Pending</b><br/>
                                   Date : <b>'.date('m-d-Y', $stepsdata->created).'</b>';
                        } else {
                            print 'View your report.';
                        }
                    }
                ?>
            </p>
        </div>
    </div>
    <?php
     */
    ?>
</div>
