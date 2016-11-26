<?php
/**
 * @file
 * left_admin.tpl.php
 */
?>
<?php if($_SESSION['user_verified'] != 'no') { ?>
<!--left column starts here-->
<div class="left_column left_menu admin_menu">
    <!--<h1><?php //print l(t('Dashboard'), $base_url . '/admin/dashboard'); ?></h1>-->
    <h1>Dashboard</h1>
    <ul>
        <!--
        <li>
            <span class="main_link">Appointments</span>
            <ul>
                <li><a href="">All Appointments</a></li>
                <li><a href="">Appointment History</a></li>
            </ul>
        </li>
        -->
        <li>
            <?php
                if((arg(1) == 'clients') || (arg(1) == 'paperwork') || (arg(2) == 'edit' && arg(0) == 'user' && $_REQUEST['destination'] == 'user/clients/list')) {
                    $expand = 'expanded';
                    $ul = '<ul style="display: block;">';
                } else {
                    $expand = '';
                    $ul = '<ul>';
                }
            ?>
            <span class="main_link <?php print $expand; ?>"><span class="clients_micon">Clients</span></span>
            <?php print $ul; ?>
                <li><a href="<?php print $base_url; ?>/user/clients/list" <?php if((arg(1) == 'clients') || (arg(2) == 'edit' && arg(0) == 'user' && $_REQUEST['destination'] == 'user/clients/list')) echo $class = 'class="selected"';?>>All Clients</a></li>
                <!--<li><a href="<?php //print $base_url; ?>/request/paperwork/list" <?php //if(arg(1) == 'paperwork') echo $class = 'class="selected"';?>>Client Requests</a></li>-->
            </ul>
        </li>
        <li>
            <?php
                if((arg(0) == 'all' && arg(1) == 'assessment') || (arg(1) == 'view' && arg(2) == 'reports') || (arg(2) == 'report-format')) {
                    $expand = 'expanded';
                    $ul = '<ul style="display: block;">';
                } else {
                    $expand = '';
                    $ul = '<ul>';
                }
            ?>
            <span class="main_link <?php print $expand; ?>"><span class="services_micon">Services</span></span>
            <?php print $ul; ?>
                <li><a href="<?php print $base_url; ?>/all/assessment/users" <?php if(arg(0) == 'all' && arg(1) == 'assessment' && arg(2) == 'users') echo $class = 'class="selected"';?>>All Assessment Users</a></li>
                <!--
                <li><a href="">All Counseling Users</a></li>
                -->
            </ul>
        </li>
        <li>
            <?php
                if((arg(0) == 'all' && arg(1) == 'other' && arg(2) == 'reports') || (arg(0) == 'user' && arg(1) == 'verification' && arg(2) == 'document') || (arg(1) == 'other' && arg(2) == 'report')) {
                    $expand = 'expanded';
                    $ul = '<ul style="display: block;">';
                } else {
                    $expand = '';
                    $ul = '<ul>';
                }
            ?>
            <span class="main_link <?php print $expand; ?>"><span class="reports_micon">Documents</span></span>
            <?php print $ul; ?>
                <!--
                <li><a href="">Counseling Invoices</a></li>
                <li><a href="<?php print $base_url; ?>/request/counseling/list" <?php if(arg(1) == 'counseling') echo $class = 'class="selected"';?>>Counseling Requests</a></li>
                -->
				<!--changes made to verification document to neccessary document on 27/5/2013 by sachin maithani-->
                <!--<li><a href="<?php print $base_url; ?>/user/verification/document" <?php if(arg(0) == 'user' && arg(1) == 'verification' && arg(2) == 'document') echo $class = 'class="selected"';?>>Verification Documents</a></li>-->
                <li><a href="<?php print $base_url; ?>/user/verification/document" <?php if(arg(0) == 'user' && arg(1) == 'verification' && arg(2) == 'document') echo $class = 'class="selected"';?>>Necessary Documents</a></li>
                <li><a href="<?php print $base_url; ?>/all/other/reports/356" <?php if((arg(0) == 'all' && arg(1) == 'other' && arg(2) == 'reports') || (arg(1) == 'other' && arg(2) == 'report')) echo $class = 'class="selected"';?>>All Other Documents</a></li>
            </ul>
        </li>
        <li>
            <?php
                if(arg(1) == 'thirdparty') {
                    $expand = 'expanded';
                    $ul = '<ul style="display: block;">';
                } else {
                    $expand = '';
                    $ul = '<ul>';
                }
            ?>
            <span class="main_link <?php print $expand; ?>"><span class="request_micon">Requests</span></span>
            <?php print $ul; ?>
                <!--
                <li><a href="">Counseling Invoices</a></li>
                <li><a href="">Counseling Requests</a></li>
                -->
<!--                <li><a href="">Other Reports Requests</a></li>-->
                <li><a href="<?php print $base_url; ?>/request/thirdparty/list" <?php if(arg(1) == 'thirdparty') echo $class = 'class="selected"';?>>Third Party Requests</a></li>
            </ul>
        </li>
        <li>
            <?php
                if((arg(1) == 'transactions' && arg(3) == 1) || (arg(1) == 'transactions' && arg(3) == 0) || (arg(2) == 'requested' && arg(3) == 'transaction') || (arg(1) == 'paymentrefund') || (arg(3) == 1) || arg(1) == 'therapist-reports') {
                    $expand = 'expanded';
                    $ul = '<ul style="display: block;">';
                } else {
                    $expand = '';
                    $ul = '<ul>';
                }
            ?>
            <span class="main_link <?php print $expand; ?>"><span class="transaction_micon">Transactions</span></span>
            <?php print $ul; ?>
                <li><a href="<?php print $base_url; ?>/all/transactions/list/1" <?php if((arg(1) == 'transactions' && arg(3) == 1) || (arg(3) == 1)) echo $class = 'class="selected"';?>>Successful Transactions</a></li>
                <li><a href="<?php print $base_url; ?>/all/transactions/list/0" <?php if(arg(1) == 'transactions' && arg(3) == 0) echo $class = 'class="selected"';?>>Failed Transactions</a></li>
                <li><a href="<?php print $base_url; ?>/all/failed/requested/transaction" <?php if(arg(2) == 'requested' && arg(3) == 'transaction') echo $class = 'class="selected"';?>>Process Fund Requests</a></li>
                <li><a href="<?php print $base_url; ?>/request/paymentrefund/list" <?php if(arg(1) == 'paymentrefund') echo $class = 'class="selected"';?>>Refund Requests</a></li>
                <?php if (user_access('view therapist reports')): ?>
                  <li><a href="<?php print $base_url; ?>/request/therapist-reports/list" <?php if(arg(1) == 'therapist-reports') echo $class = 'class="selected"';?>>Therapist Reports</a></li>
                <?php endif; ?>
            </ul>
        </li>

        <li>
            <?php
                if((arg(2) == 'requestedinvoice') || (arg(2) == 'pendinginvoice') || (arg(1) == 'stateform' && arg(2) == 'report')) {
                    $expand = 'expanded';
                    $ul = '<ul style="display: block;">';
                } else {
                    $expand = '';
                    $ul = '<ul>';
                }
            ?>
            <span class="main_link <?php print $expand; ?>"><span class="state_micon">State Forms</span></span>
            <?php print $ul; ?>
                <li><a href="<?php print $base_url; ?>/request/stateform/requestedinvoice" <?php if(arg(2) == 'requestedinvoice' || (arg(1) == 'stateform' && arg(2) == 'report')) echo $class = 'class="selected"';?>>Forms Requests</a></li>
                <li><a href="<?php print $base_url; ?>/request/stateform/pendinginvoice" <?php if(arg(2) == 'pendinginvoice') echo $class = 'class="selected"';?>>Pending Invoices</a></li>
            </ul>
        </li>

        <?php if(in_array('super admin', $user->roles)) { ?>
          <?php if (user_access('manage staff accounts')): ?>
            <li>
                <?php
                    if((arg(1) == 'staff') || (arg(1) == 'people' && arg(2) == 'create') || (arg(2) == 'edit' && arg(0) == 'user' && $_REQUEST['destination'] == 'user/staff/list')) {
                        $expand = 'expanded';
                        $ul = '<ul style="display: block;">';
                    } else {
                        $expand = '';
                        $ul = '<ul>';
                    }
                ?>
                <span class="main_link <?php print $expand; ?>"><span class="staff_micon">Staff Member</span></span>
                <?php print $ul; ?>
                    <li><a href="<?php print $base_url; ?>/user/staff/list" <?php if(arg(1) == 'staff' || (arg(2) == 'edit' && arg(0) == 'user' && $_REQUEST['destination'] == 'user/staff/list')) echo $class = 'class="selected"';?>>All Staff</a></li>
                    <li><a href="<?php print $base_url; ?>/admin/people/create" <?php if(arg(1) == 'people' && arg(2) == 'create') echo $class = 'class="selected"';?>>Add New</a></li>
                </ul>
            </li>
          <?php endif; ?>
          <?php if (user_access('manage assessments')): ?>
            <li>
                <?php
                    if((arg(1) == 'all' && arg(2) == 'assessment') || (arg(1) == 'add' && arg(2) == 'assessment') || (arg(1) == '157' && arg(2) == 'edit') || (arg(0) == 'clients' && arg(1) == 'testimonials' && arg(2) == 'unpublished')) {
                        $expand = 'expanded';
                        $ul = '<ul style="display: block;">';
                    } else {
                        $expand = '';
                        $ul = '<ul>';
                    }
                ?>
                <span class="main_link <?php print $expand; ?>"><span class="manage_micon">Manage</span></span>
                <?php print $ul; ?>
                    <li><a href="<?php print $base_url; ?>/admin/all/assessment" <?php if(arg(1) == 'all' && arg(2) == 'assessment') echo $class = 'class="selected"';?>>All Assessments</a></li>
                    <li><a href="<?php print $base_url; ?>/node/add/assessment?destination=admin/all/assessment" <?php if(arg(1) == 'add' && arg(2) == 'assessment') echo $class = 'class="selected"';?>>Add New Assessments</a></li>
                    <li><a href="<?php print $base_url; ?>/node/157/edit?destination=node/157/edit" <?php if(arg(1) == '157' && arg(2) == 'edit') echo $class = 'class="selected"';?>>Other Services Pricing</a></li>
                    <li><a href="<?php print $base_url; ?>/clients/testimonials/unpublished" <?php if(arg(0) == 'clients' && arg(1) == 'testimonials' && arg(2) == 'unpublished') echo $class = 'class="selected"';?>>Unpublished Testimonials</a></li>
                </ul>
            </li>
          <?php endif; ?>
        <?php } ?>
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
                <li><a href="<?php print $base_url; ?>/user/<?php print $user->uid; ?>" <?php if(arg(1) == $user->uid) echo $class = 'class="selected"';?>>My Profile </a></li>
                <li><a href="<?php print $base_url; ?>/user/change/password" <?php if(arg(1) == 'change') echo $class = 'class="selected"';?>>Change Password</a></li>
            </ul>
        </li>
        <li>
            <?php
                if (arg(1) == 'assessment' && arg(2) == 'invoice') {
                    $expand = 'expanded';
                    $ul = '<ul style="display: block;">';
                } else {
                    $expand = '';
                    $ul = '<ul>';
                }
            ?>
            <span class="main_link <?php print $expand; ?>"><span class="reports_micon">Special Assessment</span></span>
            <?php print $ul; ?>
                <li><a href="<?php print $base_url; ?>/request/assessment/invoice" <?php if(arg(0) == 'request' && arg(1) == 'assessment' && arg(2) == 'invoice') echo $class = 'class="selected"';?>>Invoice Special or Rush</a></li>
            </ul>
        </li>
    </ul>
</div>
<!--left column ends here-->
<?php } elseif($_SESSION['user_verified'] == 'no') { ?>
    <!--left column starts here-->
    <div class="left_column left_menu admin_menu">
        <h1>Dashboard</h1>
        <ul>
<!--            <li>
                <span class="main_link"><span class="clients_micon">Appointments</span></span>
                <ul>
                    <li><a href="javascript:void(0);">All Appointments</a></li>
                    <li><a href="javascript:void(0);">Appointment History</a></li>
                </ul>
            </li>-->
            <li>
                <span class="main_link"><span class="clients_micon">Clients</span></span>
                <ul>
                    <li><a href="javascript:void(0);">All Clients</a></li>
                    <li><a href="javascript:void(0);">Client Requests</a></li>
                </ul>
            </li>
            <li>
                <span class="main_link"><span class="services_micon">Services</span></span>
                <ul>
                    <li><a href="javascript:void(0);">All Assessments Users</a></li>
                    <!--
                    <li><a href="javascript:void(0);">All Counseling Users</a></li>
                    -->
                </ul>
            </li>
            <li>
                <span class="main_link"><span class="reports_micon">Reports</span></span>
                <ul>
                    <!--
                    <li><a href="javascript:void(0);">Counseling Invoices</a></li>
                    <li><a href="javascript:void(0);">Counseling Requests</a></li>
                    -->
                    <li><a href="javascript:void(0);">All Other Reports</a></li>
                </ul>
            </li>
            <li>
                <span class="main_link"><span class="request_micon">Requests</span></span>
                <ul>
                    <!--
                    <li><a href="javascript:void(0);">Counseling Invoices</a></li>
                    <li><a href="javascript:void(0);">Counseling Requests</a></li>
                    -->
<!--                    <li><a href="javascript:void(0);">Other Reports Requests</a></li>-->
                    <li><a href="javascript:void(0);">Third Party Requests</a></li>
                </ul>
            </li>
            <li>
                <span class="main_link"><span class="transaction_micon">Transactions</span></span>
                <ul>
                    <li><a href="javascript:void(0);">Successful Transactions</a></li>
                    <li><a href="javascript:void(0);">Failed Transactions</a></li>
                    <li><a href="javascript:void(0);">Process Fund Requests</a></li>
                    <li><a href="javascript:void(0);">Refund Requests</a></li>
                    <li><a href="javascript:void(0);">Therapist Reports</a></li>
                </ul>
            </li>

            <li>
                <span class="main_link"><span class="state_micon">State Forms</span></span>
                <ul>
                    <li><a href="javascript:void(0);">Forms Requests</a></li>
                    <li><a href="javascript:void(0);">Pending Invoices</a></li>
                </ul>
            </li>

            <?php if(in_array('super admin', $user->roles)) { ?>
                <li>
                    <span class="main_link"><span class="staff_micon">Staff Member</span></span>
                    <ul>
                        <li><a href="javascript:void(0);">All Staff</a></li>
                        <li><a href="javascript:void(0);">Add New</a></li>
                    </ul>
                </li>
                <li>
                    <span class="main_link"><span class="manage_micon">Manage</span></span>
                    <ul>
                        <li><a href="javascript:void(0);">Assessments Type</a></li>
                        <li><a href="javascript:void(0);">Add New</a></li>
                        <li><a href="javascript:void(0);">Other Services Pricing</a></li>
                    </ul>
                </li>
            <?php } ?>
            <li>
                <span class="main_link"><span class="myaccount_micon">My Account</span></span>
                <ul>
                    <li><a href="javascript:void(0);">My Profile </a></li>
                    <li><a href="javascript:void(0);">Change Password</a></li>
                </ul>
            </li>
        </ul>
    </div>
    <!--left column ends here-->
<?php } ?>
