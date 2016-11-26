<?php
    global $base_url;
?>
<?php
//  function defined to load the content type paper-work
$val = get_stateform_info();
//print_r($val);
//echo $val[0]->nid;
$nid_array = array();
foreach ($val as $data) {
    $nid_array[] = $data->nid;
}

//  load the node data
$result = node_load_multiple($nid_array);
//echo '<pre>';
//print_r($result);
//echo '</pre>';

$steps_data = $result;
?>
<h1>My State/DMV Forms</h1>
<?php
    $i = 1;
    foreach($steps_data as $stepsdata1) {
        if($i == 1) {
            $stepsdata = $stepsdata1;
        }
        $i++;
    }
?>
<ul class="step_container">
    <!--    Use selected for green color strip    -->
    <?php
        if($stepsdata->field_state_form_title['und'][0]['value'] <> '') {
            print '<li class="step1 selected"><span></span></li>';
        } else {
            print '<li class="step1"><span></span></li>';
        }
    ?>
    
    <?php
        if($stepsdata->field_state_form_payment_status['und'][0]['value'] > 0) {
            print '<li class="step2 selected"><span></span></li>';
        } else {
            print '<li class="step2"><span></span></li>';
        }
    ?>
    <?php
        if($stepsdata->field_report_state_form['und'][0]['value'] <> '') {
            print '<li class="step4 selected"><span></span></li>
                   <li class="step5 selected"></li>';
        } else {
            print '<li class="step4"><span></span></li>
                   <li class="step5"></li>';
        }
    ?>
</ul>
<div class="step_box_container">
    <div class="step_box">
        <?php
            if(arg(0) == 'node' && arg(1) == 'add' && arg(2) == 'state-form-request') {
                $class = 'step_top selected';
            } else {
                $class = 'step_top';
            }
        ?>
        <a href="<?php print $base_url . '/node/add/state-form-request?destination=node/add/state-form-request'; ?>" class="<?php print $class; ?>">
            <h2 class="doc_icon">Upload My State<br/>DMV Forms</h2>
        </a>
        <div class="step_bottom">
            <p>
                <?php
                    if($stepsdata->field_state_form_title['und'][0]['value'] <> '') {
                        print 'Status : <b>Completed</b><br/>
                               Date : <b>'.date('m-d-Y', $stepsdata->changed).'</b>';
                    } else {
                        if($stepsdata->created <> '') {
                            print 'Status : <b>Pending</b><br/>
                                   Date : <b>'.date('m-d-Y', $stepsdata->created).'</b>';
                        } else {
                            print 'Please upload the document requested by your counselor to complete the assessment process.';
                        }
                    }
                ?>
            </p>
            <ul class="status_list"></ul>
        </div>
    </div>
    <div class="step_box">
        <?php
            if((arg(0) == 'node' && arg(1) == 'add' && arg(2) == 'police-report') || ($_REQUEST['reptype'] == 'statefrm')) {
                $class = 'step_top selected';
            } else {
                $class = 'step_top';
            }
        ?>
        <a href="<?php print $base_url . '/user/report/request?reptype=statefrm'; ?>" class="<?php print $class; ?>">
            <h2 class="doc_icon">Make<br/>Payment</h2>
        </a>
        <div class="step_bottom">
            <p>
                <?php
                    if($stepsdata->field_state_form_payment_status['und'][0]['value'] > 0) {
                        print 'Status : <b>Completed</b><br/>
                               Date : <b>'.date('m-d-Y', $stepsdata->changed).'</b>';
                    } else {
                        if($stepsdata->created <> '') {
                            if($stepsdata->field_invoice_created_by['und'][0]['value'] > 0) {
                                print 'Invoice sent by counselor <br />';
                            }
                            print 'Status : <b>Pending</b><br/>
                                   Payment Status : <b>Not Paid</b>';
                        } else {
                            print 'Please make payment.';
                        }
//                        print 'Status : <b>Pending</b><br/>
//                               Payment Status : <b>Not Paid</b>';
                    }
                ?>
            </p>
            <ul class="status_list"></ul>
        </div>
    </div>

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
            <?php
            /*
                if($view_status == 1) {
            ?>
                <ul class="status_list">
                    <li>
                        <?php
                            print l(t($fname), $base_url.'/download/report', array('query' => array('file_name_path' => $file_name_path), 'attribute' => array('class' => 'view-icon')));
                        ?>
                        <a href="" class="view-icon" title="View"></a>
                    </li>
                    <li><a href="" class="download-icon" title="Download"></a></li>
                    <li><a href="" class="print-icon" title="Print"></a></li>
                    <!--<li><a href="" class="mail-icon mr_0" title="E-mail"></a></li>-->
                </ul>
            <?php 
                }
             */
            ?>
        </div>
    </div>
    <?php
//            }
//            $i++;
//        }
    ?>
</div>
<!--<b>If you are the returning customer then you can start the process again.</b>-->
