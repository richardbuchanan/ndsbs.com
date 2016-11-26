<?php
/**
 * @file
 * list_all_client.tpl.php
 */
$clients_id = get_all_staff();
?>
<h1>All Staff</h1>
<div class="table_wrap">
    <table class="schedule_table">
        <tr class="bkg_b">
            <th>Profile Picture</th>
            <th>Name</th>
            <th>Profile Details</th>
            <th>Contact Details</th>
            <th>Action</th>
        </tr>
        <?php
            $record_not_found = count($clients_id);
            foreach($clients_id as $rec) {
                $user_info = user_load($rec->uid);
                //echo '<pre>';
                //print_r($user_info);
        ?>
            <tr>
                <td>
                    <a href="/user/<?php print $user_info->uid; ?>/edit">
                        <?php if($user_info->field_profile_picture['und'][0]['uri'] <> '') { ?>
                            <img src="<?php print image_style_url('thumbnail', $user_info->field_profile_picture['und'][0]['uri']) ?>">
                        <?php } else { ?>
                            <img src="<?php print image_style_url('thumbnail', 'public://default_images/UserDefault.jpg') ?>">
                        <?php } ?>
                    </a>
                </td>
                <td>
                    <b>First Name-</b> <?php print l(t($user_info->field_first_name['und'][0]['value']), 'user/'.$user_info->uid.'/edit'); ?>
                    <br />
                    <b>Middle Name-</b> <?php print $user_info->field_middle_name['und'][0]['value']; ?>
                    <br />
                    <b>Last Name-</b> <?php print $user_info->field_last_name['und'][0]['value']; ?>
                </td>
                <td>
                    <b>Gender-</b> <?php print $user_info->field_gender['und'][0]['value']; ?>
                    <br />
                    <b>Date of Birth-</b> <?php print $user_info->field_month['und'][0]['value']; ?>-<?php print $user_info->field_dobdate['und'][0]['value']; ?>-<?php print $user_info->field_year['und'][0]['value']; ?>
                    <br />
                    <b>Status-</b> <?php if($user_info->status == 1) print 'Active'; else print 'Blocked'; ?>
                </td>
                <td>
                    <b>Email-</b> <?php print $user_info->mail; ?>
                    <br />
                    <b>Address-</b> <?php print $user_info->field_address['und'][0]['value']; ?>, 
                              <?php print $user_info->field_city['und'][0]['value']; ?>, 
                              <?php print $user_info->field_state['und'][0]['value']; ?>, 
                              <?php print $user_info->field_zip['und'][0]['value']; ?>
                    <br />
                    <b>Phone-</b> <?php print $user_info->field_phone['und'][0]['value']; ?>
                </td>
                <td>
                    <?php
                        $options = array('query' => array('destination' => 'user/staff/list'), 'attributes' => array('class' => 'edit_icon'));
                    ?>
                    <?php print l(t('Edit'), 'user/'.$user_info->uid.'/edit', $options); ?>
                    
                    <?php
                        $time = time();
                        $options = array('attributes' => array('class' => 'edit_icon'));
                    ?>
                    <?php print l(t('Reset Password'), 'reset/users/password/'.$user_info->uid.'/'.$time, $options); ?>
                </td>
            </tr>
        <?php
            }
        ?>
        <?php
            if($record_not_found <= 0) {
        ?>
                <tr><td class="txt_ac" colspan="5">Record not found.</td></tr>
        <?php
            }
        ?>
    </table>
</div>
<?php
    $total = 3;
    //pager_default_initialize($total, 1, $element = 0);
    print $output = theme('pager', array('quantity' => $total));
?>
