<?php
/**
 * @file
 * left_admin.tpl.php
 */
?>
<?php if($_SESSION['user_verified'] != 'no') { ?>
<!--left column starts here-->
<div class="left_column left_menu admin_menu">
    <h1>Dashboard</h1>
    <ul>
        <li>
            <span class="main_link">Appointments</span>
            <ul>
                <li><a href="">All Appointments</a></li>
                <li><a href="">Appointment History</a></li>
            </ul>
        </li>
        <li>
            <span class="main_link">All Clients & Paper works</span>
            <ul>
                <li><a href="<?php print $base_url; ?>/user/clients/list" <?php if(arg(1) == 'clients') echo $class = 'class="selected"';?>>All Clients</a></li>
                <li><a href="<?php print $base_url; ?>/request/paperwork/list" <?php if(arg(1) == 'paperwork') echo $class = 'class="selected"';?>>Paperwork Requests</a></li>
            </ul>
        </li>
        <li>
            <span class="main_link">Service User & Reports</span>
            <ul>
                <li><a href="<?php print $base_url; ?>/all/assessment/users" <?php if(arg(0) == 'all' && arg(1) == 'assessment') echo $class = 'class="selected"';?>>All Assessment Users</a></li>
                <li><a href="">All Counseling Users</a></li>
                <li><a href="">Counseling Invoices</a></li>
                <li><a href="<?php print $base_url; ?>/request/counseling/list" <?php if(arg(1) == 'counseling') echo $class = 'class="selected"';?>>Counseling Requests</a></li>
            </ul>
        </li>
        <li>
            <span class="main_link">Other Report Requests</span>
            <ul>
                <li><a href="">All Other Reports</a></li>
            </ul>
        </li>
        <li>
            <span class="main_link">State form Requests</span>
            <ul>
                <li><a href="<?php print $base_url; ?>/request/stateform/requestedinvoice" <?php if(arg(2) == 'requestedinvoice') echo $class = 'class="selected"';?>>All State form Requests</a></li>
                <li><a href="<?php print $base_url; ?>/request/stateform/pendinginvoice" <?php if(arg(2) == 'pendinginvoice') echo $class = 'class="selected"';?>>Pending Invoice</a></li>
            </ul>
        </li>
        <li>
            <span class="main_link">Third Party Requests</span>
            <ul>
                <li><a href="<?php print $base_url; ?>/request/thirdparty/list" <?php if(arg(1) == 'thirdparty') echo $class = 'class="selected"';?>>Third Party Requests</a></li>
            </ul>
        </li>
        <li>
            <span class="main_link">Transactions</span>
            <ul>
                <li><a href="<?php print $base_url; ?>/all/transactions/list/1" <?php if(arg(1) == 'transactions' && arg(3) == 1) echo $class = 'class="selected"';?>>All Transaction</a></li>
                <li><a href="<?php print $base_url; ?>/all/transactions/list/0" <?php if(arg(1) == 'transactions' && arg(3) == 0) echo $class = 'class="selected"';?>>All Failed Transaction</a></li>
                <li><a href="<?php print $base_url; ?>/all/failed/requested/transaction" <?php if(arg(2) == 'requested' && arg(3) == 'transaction') echo $class = 'class="selected"';?>>All Failed Requests</a></li>
                <li><a href="<?php print $base_url; ?>/request/paymentrefund/list" <?php if(arg(1) == 'paymentrefund') echo $class = 'class="selected"';?>>All Refund Requests</a></li>
            </ul>
        </li>
        <?php if(in_array('super admin', $user->roles)) { ?>
            <li>
                <span class="main_link">Manage Staff Members</span>
                <ul>
                    <li><a href="<?php print $base_url; ?>/user/staff/list" <?php if(arg(1) == 'staff') echo $class = 'class="selected"';?>>All Staff Member</a></li>
                    <li><a href="<?php print $base_url; ?>/admin/people/create" <?php if(arg(1) == 'people' && arg(2) == 'create') echo $class = 'class="selected"';?>>Add a Staff Member</a></li>
                </ul>
            </li>
            <li>
                <span class="main_link">Manage Assessment</span>
                <ul>
                    <li><a href="<?php print $base_url; ?>/admin/all/assessment" <?php if(arg(1) == 'all' && arg(2) == 'assessment') echo $class = 'class="selected"';?>>All Assessment</a></li>
                    <li><a href="<?php print $base_url; ?>/node/add/assessment?destination=admin/all/assessment" <?php if(arg(2) == 'add' && arg(2) == 'assessment') echo $class = 'class="selected"';?>>Add an Assessment</a></li>
                </ul>
            </li>
            <li>
                <span class="main_link">Manage Pricing</span>
                <ul>
                    <li><a href="<?php print $base_url; ?>/node/157/edit?destination=node/157/edit" <?php if(arg(1) == '157' && arg(2) == 'edit') echo $class = 'class="selected"';?>>Other Services</a></li>
                </ul>
            </li>
        <?php } ?>
        <li>
            <span class="main_link">My Account</span>
            <ul>
                <li><a href="<?php print $base_url; ?>/user/<?php print $user->uid; ?>" <?php if(arg(1) == $user->uid) echo $class = 'class="selected"';?>>Profile</a></li>
                <li><a href="<?php print $base_url; ?>/user/change/password" <?php if(arg(1) == 'change') echo $class = 'class="selected"';?>>Change Password</a></li>
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
            <li>
                <span class="main_link">Appointments</span>
                <ul>
                    <li><a href="javascript:void(0);">All Appointments</a></li>
                    <li><a href="javascript:void(0);">Appointment History</a></li>
                </ul>
            </li>
            <li>
                <span class="main_link">All Clients & Paper works</span>
                <ul>
                    <li><a href="javascript:void(0);">All Clients</a></li>
                    <li><a href="javascript:void(0);">Paperwork Requests</a></li>
                </ul>
            </li>
            <li>
                <span class="main_link">Service User & Reports</span>
                <ul>
                    <li><a href="javascript:void(0);">All Assessment Users</a></li>
                    <li><a href="javascript:void(0);">All Counseling Users</a></li>
                    <li><a href="javascript:void(0);">Counseling Invoices</a></li>
                    <li><a href="javascript:void(0);">Counseling Requests</a></li>
                </ul>
            </li>
            <li>
                <span class="main_link">Other Report Requests</span>
                <ul>
                    <li><a href="javascript:void(0);">All Other Reports</a></li>
                </ul>
            </li>
            <li>
                <span class="main_link">State form Requests</span>
                <ul>
                    <li><a href="javascript:void(0);">All State form Requests</a></li>
                    <li><a href="javascript:void(0);">Pending Invoice</a></li>
                </ul>
            </li>
            <li>
                <span class="main_link">Third Party Requests</span>
                <ul>
                    <li><a href="javascript:void(0);">Third Party Requests</a></li>
                </ul>
            </li>
            <li>
                <span class="main_link">Transactions</span>
                <ul>
                    <li><a href="javascript:void(0);">All Transaction</a></li>
                    <li><a href="javascript:void(0);">All Failed Transaction</a></li>
                    <li><a href="javascript:void(0);">All Failed Requests</a></li>
                    <li><a href="javascript:void(0);">All Refund Requests</a></li>
                </ul>
            </li>
            <?php if(in_array('super admin', $user->roles)) { ?>
                <li>
                    <span class="main_link">Manage Staff Members</span>
                    <ul>
                        <li><a href="javascript:void(0);">All Staff Member</a></li>
                        <li><a href="javascript:void(0);">Add a Staff Member</a></li>
                    </ul>
                </li>
                <li>
                    <span class="main_link">Manage Assessment</span>
                    <ul>
                        <li><a href="javascript:void(0);">All Assessment</a></li>
                        <li><a href="javascript:void(0);">Add an Assessment</a></li>
                    </ul>
                </li>
                <li>
                    <span class="main_link">Manage Pricing</span>
                    <ul>
                        <li><a href="javascript:void(0);">Other Services</a></li>
                    </ul>
                </li>
            <?php } ?>
            <li>
                <span class="main_link">Profile</span>
                <ul>
                    <li><a href="javascript:void(0);">My Account</a></li>
                    <li><a href="javascript:void(0);">Change Password</a></li>
                </ul>
            </li>

        </ul>
    </div>
    <!--left column ends here-->
<?php } ?>