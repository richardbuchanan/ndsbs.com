<?php
    global $base_url;
    
    $imp_data = users_important_documents();
    $nid_array = array();
    foreach($imp_data as $data) {
        $nid_array[] = $data->nid;
    }
    
    //  load the node data
    $impacc_data = node_load_multiple($nid_array);
//    echo '<pre>';
//    print_r($impacc_data);
//    echo '</pre>';
    
    //  Creating the tmp array for getting the latest imp doc and acc doc status
    $tmp_impacc_data = $impacc_data;
    $im_loop_in = 1;
    $acc_loop_in = 1;
    foreach($tmp_impacc_data as $tmp_data_ia) {
        if($tmp_data_ia->type == 'important_document' && $im_loop_in == 1) {
            $status_imp = $tmp_data_ia->field_imp_status['und'][0]['value'];
            $creation_date_imp = $tmp_data_ia->created;
            $updated_on_imp = $tmp_data_ia->changed;
            $im_loop_in = 0;
        }
        if($tmp_data_ia->type == 'account_verification' && $acc_loop_in == 1) {
            $status_acc = $tmp_data_ia->field_acc_status['und'][0]['value'];
            $creation_date_acc = $tmp_data_ia->created;
            $updated_on_acc = $tmp_data_ia->changed;
            $acc_loop_in = 0;
        }
    }
?>
<h1>My Necessary Documents</h1>
<ul class="step_container">
    <!--    Use selected for green color strip    -->
    <li class="step1 <?php if($creation_date_imp <> '') print 'selected'; ?>"><span></span></li>
<!--    <li class="step2 <?php //if($creation_date_acc <> '') print 'selected'; ?>"><span></span></li>-->
    <!--
    <li class="step3"><span></span></li>
    -->
    <li class="step4 <?php if($status_imp == 1 && $status_acc == 1) { print 'selected'; } ?>"><span></span></li>
    <li class="step5 <?php if($status_imp == 1 && $status_acc == 1) { print 'selected'; } ?>"></li>
</ul>
<div class="step_box_container">
    <div class="step_box">
        <?php
            if(arg(0) == 'node' && arg(1) == 'add' && arg(2) == 'important-document') {
                $class = 'step_top selected';
            } else {
                $class = 'step_top';
            }
        ?>
        <a href="<?php print $base_url . '/node/add/important-document?destination=list/verification/document'; ?>" class="<?php print $class; ?>">
            <h2 class="doc_icon">Upload Important<br/>Document</h2>
        </a>
        <div class="step_bottom">
            <p>
                <?php
                    if($status_imp == 1) {
                ?>
                        Document upload date : <b><?php if($creation_date_imp <> '') print date('m-d-Y', $creation_date_imp); ?></b><br />
                <?php
                        print 'Verification date : <b>'.date('m-d-Y', $updated_on_imp).'</b><br/>';
                        print 'Status : <b>Verified</b><br />';
                    } elseif($status_imp == 0 && $creation_date_imp <> '') {
                ?>
                        Document upload date : <b><?php if($creation_date_imp <> '') print date('m-d-Y', $creation_date_imp); ?></b><br />
                <?php
                        print 'Status : <b>Pending</b><br/>';
                    } else {
                        print 'Please upload documents requested by NDSBS';
                    }
                ?>
            </p>
            <ul class="status_list"></ul>
        </div>
    </div>

    <?php
    /*
    <div class="step_box">
        <?php
            if(arg(0) == 'node' && arg(1) == 'add' && arg(2) == 'account-verification') {
                $class = 'step_top selected';
            } else {
                $class = 'step_top';
            }
        ?>
        <a href="<?php print $base_url . '/node/add/account-verification?destination=list/verification/document'; ?>" class="<?php print $class; ?>">
            <h2 class="doc_icon">Account<br/>Verification</h2>
        </a>
        <div class="step_bottom">
            <p>
                <?php
                    if($status_acc == 1) {
                ?>
                        Document upload date : <b><?php if($creation_date_acc <> '') print date('m-d-Y', $creation_date_acc); ?></b><br />
                <?php
                        print 'Verification date : <b>'.date('m-d-Y', $updated_on_acc).'</b><br/>';
                        print 'Status : <b>Verified</b><br />';
                    } elseif($status_acc == 0 && $creation_date_acc <> '') {
                ?>
                        Document upload date : <b><?php if($creation_date_acc <> '') print date('m-d-Y', $creation_date_acc); ?></b><br />
                <?php
                        print 'Status : <b>Pending</b>';
                    } else {
                        print 'Please upload documents requested by NDSBS';
                    }
                ?>
            </p>
            <ul class="status_list"></ul>
        </div>
    </div>
    */
    ?>
    
    <div class="step_box mr_0">
        <?php
            if(arg(0) == 'list' && arg(1) == 'verification' && arg(2) == 'document') {
                $class = 'step_top selected';
            } else {
                $class = 'step_top';
            }
        ?>
        <a href="<?php print $base_url . '/list/verification/document'; ?>" class="<?php print $class; ?>">
            <h2 class="assr_icon">View My<br/>Documents</h2>
        </a>
        <?php
        if($creation_date_imp <> '' || $creation_date_acc <> '') {
        ?>
        <div class="step_bottom">
            <p>
                Status : <b><?php if($status_imp == 1 && $status_acc == 1) { print 'Verified'; } else { print 'In-Process'; } ?></b>
            </p>
        </div>
        <?php } else { ?>
            <div class="step_bottom">
                <p>
                    View your documents
                </p>
            </div>
        <?php } ?>
    </div>
    
</div>
<b>Necessary Documents needed by New Directions to provide you service may include:</b>  a copy of your photo ID, police report, motor vehicle history, drug test results, or other documents. Your evaluator/counselor will provide you with the items needed. You may upload on this page or fax them to 614-888-3239.