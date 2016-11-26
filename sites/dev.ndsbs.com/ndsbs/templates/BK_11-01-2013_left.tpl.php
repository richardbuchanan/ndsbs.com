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
                <span class="main_link">Assessments</span>
                <ul>
                    <li><a href="<?php print $base_url; ?>/user/purchased/assessment" <?php if(arg(1) == 'purchased' && arg(2) == 'assessment') echo $class = 'class="selected"'; ?>>Purchased Assessments</a></li>
                    <li><a href="">Current Schedule</a></li>
                </ul>
            </li>
            <li>
                <span class="main_link">Counseling</span>
                <ul>
                    <li><a href="">Purchased Counseling</a></li>
                    <li><a href="">Counseling Session</a></li>
                    <li><a href="">Current Schedule</a></li>
                </ul>
            </li>
            <li>
                <span class="main_link">All Reports</span>
                <ul>
                    <li><a href="">Requested Report</a></li>
                    <li><a href="<?php print $base_url; ?>/user/report/request" <?php if(arg(1) == 'report' && arg(2) == 'request') echo $class = 'class="selected"'; ?>>Request for report</a></li>
                </ul>
            </li>
            <li>
                <span class="main_link">Requests</span>
                <ul>
                    <li><a href="<?php print $base_url; ?>/user/allrequest/list" <?php if (arg(1) == 'allrequest') echo $class = 'class="selected"'; ?>>All Request</a></li>
                    <li><a href="<?php print $base_url; ?>/node/add/appointment-preference?destination=user/allrequest/list" <?php if (arg(2) == 'appointment-preference') echo $class = 'class="selected"'; ?>>Appointment Preference</a></li>
                    <li><a href="<?php print $base_url; ?>/node/add/counseling-request?destination=user/allrequest/list" <?php if (arg(2) == 'counseling-request') echo $class = 'class="selected"'; ?>>Counseling Request</a></li>
                    <li><a href="<?php print $base_url; ?>/user/stateform/list" <?php if (arg(1) == 'stateform') echo $class = 'class="selected"'; ?>>State from Request</a></li>
                    <li><a href="<?php print $base_url; ?>/node/add/refund-payment?destination=user/allrequest/list" <?php if (arg(2) == 'refund-payment') echo $class = 'class="selected"'; ?>>Refund Payment</a></li>
                </ul>
            </li>
            <li>
                <span class="main_link">Account</span>
                <ul>
                    <!--<li><a href="">My Account</a></li>-->
                    <li><a href="<?php print $base_url . '/user/' . $user->uid; ?>" <?php if (arg(1) == $user->uid) echo $class = 'class="selected"'; ?>>Profile</a></li>
                    <li><a href="<?php print $base_url; ?>/user/change/password" <?php if (arg(1) == 'change') echo $class = 'class="selected"'; ?>>Change Password</a></li>
                    <li><a href="<?php print $base_url; ?>/user/paperwork/list" <?php if (arg(1) == 'paperwork') echo $class = 'class="selected"'; ?>>Paperwork</a></li>
                </ul>
            </li>
            <li>
                <span class="main_link">Appointments</span>
                <ul>
                    <li><a href="">Appointment History</a></li>
                </ul>
            </li>
            <li>
                <span class="main_link">Transactions</span>
                <ul>
                    <li><a href="<?php print $base_url; ?>/user/transactions/list/1" <?php if (arg(3) == 1 && arg(1) == 'transactions') echo $class = 'class="selected"'; ?>">Transaction History</a></li>
                    <li><a href="<?php print $base_url; ?>/user/transactions/list/0" <?php if (arg(3) == 0 && arg(1) == 'transactions') echo $class = 'class="selected"'; ?>">Failed Transaction</a></li>
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
                <span class="main_link">Assessments</span>
                <ul>
                    <li><a href="javascript:void(0);">Purchased Assessments</a></li>
                    <li><a href="javascript:void(0);">Current Schedule</a></li>
                </ul>
            </li>
            <li>
                <span class="main_link">Counseling</span>
                <ul>
                    <li><a href="javascript:void(0);">Purchased Counseling</a></li>
                    <li><a href="javascript:void(0);">Counseling Session</a></li>
                    <li><a href="javascript:void(0);">Current Schedule</a></li>
                </ul>
            </li>
            <li>
                <span class="main_link">All Reports</span>
                <ul>
                    <li><a href="javascript:void(0);">Requested Report</a></li>
                    <li><a href="javascript:void(0);">Request for report</a></li>
                </ul>
            </li>
            <li>
                <span class="main_link">Requests</span>
                <ul>
                    <li><a href="javascript:void(0);">All Request</a></li>
                    <li><a href="javascript:void(0);">Appointment Preference</a></li>
                    <li><a href="javascript:void(0);">Counseling Request</a></li>
                    <li><a href="javascript:void(0);">State from Request</a></li>
                    <li><a href="javascript:void(0);">Refund Payment</a></li>
                </ul>
            </li>
            <li>
                <span class="main_link">Account</span>
                <ul>
                    <li><a href="javascript:void(0);">My Account</a></li>
                    <li><a href="javascript:void(0);">Profile</a></li>
                    <li><a href="javascript:void(0);">Change Password</a></li>
                    <li><a href="javascript:void(0);">Paperwork</a></li>
                </ul>
            </li>
            <li>
                <span class="main_link">Appointments</span>
                <ul>
                    <li><a href="javascript:void(0);">Appointment History</a></li>
                </ul>
            </li>
            <li>
                <span class="main_link">Transactions</span>
                <ul>
                    <li><a href="javascript:void(0);">Transaction History</a></li>
                </ul>
            </li>
        </ul>
    </div>
    <!--left column ends here-->
<?php } ?>