<?php
/**
 * @file
 * left.tpl.php
 */
?>
<?php if($_SESSION['user_verified'] != 'no') { ?>
    <!--left column starts here-->
    <div class="left_column left_menu">
        <h1>Dashboard</h1>
        <ul>
            <li>
                <?php
                    if((arg(1) == 'purchased' && arg(2) == 'assessment') || (arg(0) == 'user' && arg(2) == 'resume') || (arg(0) == 'questionnaire')
                            || (arg(2) == 'appointment-preference') || (arg(2) == 'counseling-request') || (arg(1) == 'paperwork') || (arg(0) == 'view' && arg(2) == 'report')
                            ) {
                        $expand = 'expanded';
                        $ul = '<ul style="display: block;">';
                    } else {
                        $expand = '';
                        $ul = '<ul>';
                    }
                ?>
                <span class="main_link <?php print $expand; ?>"><span class="myassessment_micon">My Assessment</span></span>
                <?php print $ul; ?>
                
                <?php
                /*
                    <li><a href="<?php print $base_url; ?>/user/purchased/assessment" <?php if(arg(1) == 'purchased' && arg(2) == 'assessment') echo $class = 'class="selected"'; ?>>Purchased Assessments</a></li>
                    <li><a href="<?php print $base_url; ?>/user/complete/resume/questionnaire" <?php if(arg(0) == 'user' && arg(2) == 'resume') echo $class = 'class="selected"'; ?>><b>Complete/Resume Questionnaire</b></a></li>
                 */
                ?>
                    <!--<li><a href="">Currently Schedule</a></li>-->
                    <?php
                        $get_assessment_id = explode('/', $_SESSION['COMPLETE_MY_QUESTIONNAIRE']);
                        $transid_selected = $get_assessment_id[4];
                        
                        $data_left_asment = get_purchased_questionnaire_assessment_list_leftpanel();
                        
                        foreach($data_left_asment as $dataleft_asment) {
                            //$dataleft_asment['title'];
                            //$dataleft_asment['assessment_node_id'];
                            //$dataleft_asment['transaction_id'];
                            //$dataleft_asment['availability'];
                            //$dataleft_asment['term_id'];
                            //  http://dev.newndsbs.com/questionnaire/start/259/trans/15
                    ?>
                            <li><a href="<?php print $base_url . '/questionnaire/start/'.$dataleft_asment['assessment_node_id'].'/trans/'.$dataleft_asment['transaction_id'].'/termid/'.$dataleft_asment['term_id']; ?>" <?php if($transid_selected == $dataleft_asment['transaction_id']) echo $class = 'class="selected"'; ?>><?php print $dataleft_asment['title']; ?></a></li>
                    <?php
                        }
                        //echo '<pre>';
                            //print_r($data);
                        //echo '</pre>';
                    ?>
                </ul>
            </li>
            <!--<li>
                <span class="main_link">Counseling</span>
                <ul>
                    <li><a href="">Purchased Counseling</a></li>
                    <li><a href="">Counseling Session</a></li>
                    <li><a href="">Current Schedule</a></li>
                </ul>
            </li>-->
            <li>
                <?php
                    if((arg(1) == 'requested' && arg(2) == 'reports')) {
                        $expand = 'expanded';
                        $ul = '<ul style="display: block;">';
                    } else {
                        $expand = '';
                        $ul = '<ul>';
                    }
                ?>
                <span class="main_link <?php print $expand; ?>"><span class="reports_micon">My Documents</span></span>
                <?php print $ul; ?>
                    <li><a href="<?php print $base_url; ?>/user/requested/reports" <?php if(arg(1) == 'requested' && arg(2) == 'reports') echo $class = 'class="selected"'; ?>>Requested Documents</a></li>
                    <!--<li><a href="">Download Reports</a></li>-->
                </ul>
            </li>
            <li>
                <?php
                    //if((arg(1) == 'allrequest') || (arg(2) == 'appointment-preference') || (arg(2) == 'counseling-request') || (arg(1) == 'report' && arg(2) == 'request') || (arg(1) == 'expressmail') || (arg(1) == 'paperwork')) {
                    if((arg(1) == 'allrequest') || (arg(1) == 'report' && arg(2) == 'request') || (arg(1) == 'expressmail')) {
                        $expand = 'expanded';
                        $ul = '<ul style="display: block;">';
                    } else {
                        $expand = '';
                        $ul = '<ul>';
                    }
                ?>
                <span class="main_link <?php print $expand; ?>"><span class="request_micon">Service Requests</span></span>
                <?php print $ul; ?>
                    <li><a href="<?php print $base_url; ?>/user/report/request" <?php if(arg(1) == 'report' && arg(2) == 'request') echo $class = 'class="selected"'; ?>>Request A report</a></li>
                    
                    
                    <li><a href="<?php print $base_url; ?>/user/allrequest/list" <?php if (arg(1) == 'allrequest') echo $class = 'class="selected"'; ?>>All Requests</a></li>
                    <?php
                    /*
                    <li><a href="<?php print $base_url; ?>/node/add/appointment-preference?destination=user/allrequest/list" <?php if (arg(2) == 'appointment-preference') echo $class = 'class="selected"'; ?>>Appointment Preference</a></li>
                    <li><a href="<?php print $base_url; ?>/node/add/counseling-request?destination=user/allrequest/list" <?php if (arg(2) == 'counseling-request') echo $class = 'class="selected"'; ?>>Appointment Request</a></li>
                    */
                    ?>
                    <li><a href="<?php print $base_url; ?>/user/report/request" <?php if(arg(1) == 'report' && arg(2) == 'request') echo $class = 'class="selected"'; ?>>Completion letter</a></li>
                    <li><a href="<?php print $base_url; ?>/user/expressmail" <?php if (arg(1) == 'expressmail') echo $class = 'class="selected"'; ?>>Express Mail</a></li>
                    <li><a href="<?php print $base_url; ?>/user/report/request" <?php if(arg(1) == 'report' && arg(2) == 'request') echo $class = 'class="selected"'; ?>>Progress letter</a></li>
                    
                    <!--<li><a href="">Notarization of Documents</a></li>-->
                    <!--<li><a href="<?php print $base_url; ?>/node/add/refund-payment?destination=user/allrequest/list" <?php if (arg(2) == 'refund-payment') echo $class = 'class="selected"'; ?>>Refund Payment</a></li>-->
                    <?php
                    /*
                    <li><a href="<?php print $base_url; ?>/user/paperwork/list" <?php if (arg(1) == 'paperwork') echo $class = 'class="selected"'; ?>>Proof of Service Letter</a></li>
                    */
                    ?>
                </ul>
            </li>

            <li>
                <?php
                    if(arg(2) == 'state-form-request') {
                        $expand = 'expanded';
                        $ul = '<ul style="display: block;">';
                    } else {
                        $expand = '';
                        $ul = '<ul>';
                    }
                ?>
                <span class="main_link <?php print $expand; ?>"><span class="reports_micon">Upload Important Docs</span></span>
                <?php print $ul; ?>
                    <li><a href="<?php print $base_url; ?>/node/add/state-form-request?destination=user/stateform/list" <?php if (arg(2) == 'state-form-request') echo $class = 'class="selected"'; ?>>Upload My State DMV Forms</a></li>
                </ul>
            </li>

            <li>
                <?php
                    if((arg(1) == $user->uid) || (arg(1) == 'change')) {
                        $expand = 'expanded';
                        $ul = '<ul style="display: block;">';
                    } else {
                        $expand = '';
                        $ul = '<ul>';
                    }
                ?>
                <span class="main_link <?php print $expand; ?>"><span class="myaccount_micon">My Account</span></span>
                <?php print $ul; ?>
                    <!--<li><a href="">My Account</a></li>-->
                    <li><a href="<?php print $base_url . '/user/' . $user->uid; ?>" <?php if (arg(1) == $user->uid) echo $class = 'class="selected"'; ?>>My Profile</a></li>
                    <li><a href="<?php print $base_url; ?>/user/change/password" <?php if (arg(1) == 'change') echo $class = 'class="selected"'; ?>>Change Password</a></li>
                    <!--<li><a href="<?php print $base_url; ?>/user/paperwork/list" <?php if (arg(1) == 'paperwork') echo $class = 'class="selected"'; ?>>Paperwork</a></li>-->
                    <!--<li><a href="<?php print $base_url; ?>/user/paperwork/list" <?php if (arg(1) == 'paperwork') echo $class = 'class="selected"'; ?>>Verification Document</a></li>-->
                    <li><a href="#">Service agreement</a></li>
                </ul>
            </li>
            <li>
                <span class="main_link"><span class="myappointment_micon">My Appointments</span></span>
                <ul>
                    <li><a href="#">Appointment History</a></li>
                </ul>
            </li>
            <li>
                <?php
                    if((arg(3) == 1 && arg(1) == 'transactions') || (arg(3) == 0 && arg(1) == 'transactions') || (arg(2) == 'refund-payment')) {
                        $expand = 'expanded';
                        $ul = '<ul style="display: block;">';
                    } else {
                        $expand = '';
                        $ul = '<ul>';
                    }
                ?>
                <span class="main_link <?php print $expand; ?>"><span class="transaction_micon">My Transactions</span></span>
                <?php print $ul; ?>
                    <li><a href="<?php print $base_url; ?>/user/transactions/list/1" <?php if (arg(3) == 1 && arg(1) == 'transactions') echo $class = 'class="selected"'; ?>>Transaction History</a></li>
                    <li><a href="<?php print $base_url; ?>/user/transactions/list/0" <?php if (arg(3) == 0 && arg(1) == 'transactions') echo $class = 'class="selected"'; ?>>Failed Transaction</a></li>
                    <li><a href="<?php print $base_url; ?>/node/add/refund-payment?destination=user/allrequest/list" <?php if (arg(2) == 'refund-payment') echo $class = 'class="selected"'; ?>>Refund Requests</a></li>
                </ul>
            </li>
        </ul>
    </div>
    <!--left column ends here-->
<?php } elseif($_SESSION['user_verified'] == 'no') { ?>
    <!--left column starts here-->
    <div class="left_column left_menu">
        <h1>Dashboard</h1>
        <ul>
            <li>
                <span class="main_link"><span class="myassessment_micon">My Assessments</span></span>
                <ul>
                    <li><a href="javascript:void(0);">Purchased Assessments</a></li>
                    <li><a href="javascript:void(0);">Complete/Resume Questionnaire</a></li>
                    <!--<li><a href="javascript:void(0);">Currently Schedule</a></li>-->
                </ul>
            </li>
            <li>
                <span class="main_link"><span class="reports_micon">My Documents</span></span>
                <ul>
                    <li><a href="javascript:void(0);">Requested Documents</a></li>
                </ul>
            </li>
            <li>
                <span class="main_link"><span class="request_micon">Service Requests</span></span>
                <ul>
                    <li><a href="javascript:void(0);">Request A report</a></li>
                    <li><a href="javascript:void(0);">All Requests</a></li>
                    <li><a href="javascript:void(0);">Appointment Preference</a></li>
                    <li><a href="javascript:void(0);">Appointment Request</a></li>
                    
                    <li><a href="javascript:void(0);">Completion Letter</a></li>
                    <li><a href="javascript:void(0);">Express Mail</a></li>
                    <li><a href="javascript:void(0);">Progress Letter</a></li>
                    <li><a href="javascript:void(0);">Proof of Service Letter</a></li>
                    <!--<li><a href="javascript:void(0);">Notarization of Documents</a></li>-->
                </ul>
            </li>
            <li>
                <span class="main_link"><span class="reports_micon">Upload Important Docs</span></span>
                <ul>
                    <li><a href="javascript:void(0);">Upload My State DMV Forms</a></li>
                </ul>
            </li>
            <li>
                <span class="main_link"><span class="myaccount_micon">My Account</span></span>
                <ul>
                    <li><a href="javascript:void(0);">My Profile</a></li>
                    <li><a href="javascript:void(0);">Change Password</a></li>
                    <li><a href="javascript:void(0);">Service agreement</a></li>
                </ul>
            </li>
            <li>
                <span class="main_link"><span class="myappointment_micon">Appointments</span></span>
                <ul>
                    <li><a href="javascript:void(0);">Appointment History</a></li>
                </ul>
            </li>
            <li>
                <span class="main_link"><span class="transaction_micon">Transactions</span></span>
                <ul>
                    <li><a href="javascript:void(0);">Transaction History</a></li>
                    <li><a href="javascript:void(0);">Failed Transaction</a></li>
                    <li><a href="javascript:void(0);">Refund Requests</a></li>
                </ul>
            </li>
        </ul>
    </div>
    <!--left column ends here-->
<?php } ?>