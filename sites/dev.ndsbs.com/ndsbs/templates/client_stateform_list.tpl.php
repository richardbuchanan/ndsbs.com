<?php
/**
 * @file
 * client_stateform_list.tpl.php
 */
global $base_url;
$path_theme = drupal_get_path('theme', 'ndsbs') . '/templates';
?>
<?php
    include_once $path_theme . '/headerstate.tpl.php';
?>
<!--<a href="<?php //print $base_url; ?>/node/add/state-form-request?destination=user/stateform/list" class="brown_btn">ADD</a>-->

<div class="table_wrap">
    <table class="schedule_table">
        <tr class="bkg_b">
            <th>Title</th>
            <th>Selected File</th>
            <th>Report</th>
            <th>Action</th>
        </tr>
        <?php
            $i = 1;
            $total_count = count($result);
            foreach($result as $rec) {
        ?>
            <tr>
                <td>
                    <?php
                        foreach($rec->field_state_form_title['und'] as $data) {
                            print $data['value'];
                            print '<br />';
                        }
                    ?>
                </td>
                <td>
                    <?php
                        foreach($rec->field_state_form_upload['und'] as $data) {
                            print l(t($data['filename']), $base_url.'/download/report', array('query' => array('file_name_path' => $data['uri'])));
                            print '<br />';
                        }
                    ?>
                </td>
                <td>
                    <?php
                        if($rec->field_report_state_form['und'][0]['value'] <> '') {
                            $fname = $rec->field_report_state_form['und'][0]['value'];
                            $file_name_path = 'public://reports/'.$fname;
                            print 'Completed';
                            print '<br />';
                            print l(t($fname), $base_url.'/download/report', array('query' => array('file_name_path' => $file_name_path)));
                        } else {
                            print 'In-Process';
                        }
                    ?>
                </td>
                <td>
                    <?php
                        if($rec->field_state_form_payment_status['und'][0]['value'] == 1) {
                            print '<ul class="tr_actions">
                                     <li class="edit_icon">Edit</li>
                                     <li class="delete_icon">Delete</li>
                                   </ul>';
                        } else {
                    ?>
                            <a href="<?php print $base_url; ?>/node/<?php print $rec->nid; ?>/edit?destination=user/stateform/list" class="edit_icon">Edit</a>
                            <a href="<?php print $base_url; ?>/node/<?php print $rec->nid; ?>/delete?destination=user/stateform/list" class="delete_icon">Delete</a>
                    <?php
                        }
                    ?>
                </td>
            </tr>
        <?php
            $i++;
            }
            if($total_count <= 0) {
        ?>
                <tr>
                    <td class="txt_ac" colspan="4">
                        Record not found.
                    </td>
                </tr>
        <?php
            }
        ?>
    </table>
</div>