<?php
/**
 * @file
 * users_other_report.tpl.php
 */
global $base_url;
$record_not_found = 0;

//  Notary status defined on 29-03-2013 mail dated on 29-03-2013
$notary_status = 'inactive';        //  Change $notary_status from inactive to active to show the notary
//  Notary status defined on 29-03-2013
?>
<h1>
    All other documents
</h1>
<div class="table_wrap">
    <form id="other-report-frm" method="post" action="<?php print $base_url; ?>/generate/other/report" enctype="multipart/form-data">
        <table class="schedule_table">
            <tr class="bkg_b">
                <th>Requested Document</th>
                <th>Upload</th>
            </tr>
            <?php
            $sub_data = get_others_report(arg(4), arg(6));
            foreach ($sub_data as $report_info) {
                $record_not_found = 1;
                ?>
                <tr>
                    <td>
                        <?php
                        $sub_term_info = taxonomy_term_load($report_info->termid);
                        print $sub_term_info->name;
                        ?>
                    </td>
                    <td>
                        <?php
                        /*
                        if ($report_info->report_status == 1) {
                            print '<ul class="tr_actions">
                                                    <li class="completed_icon">Completed</li>
                                                </ul>';
                        } else {
                        */
                            ?>
                            <input type="file" name="file" />
                            <br />
                            <?php
                                if($report_info->main_report <> '') {
                                    $fname = $report_info->main_report;
                                    $file_name_path = 'public://reports/'.$fname;
                                    print l(t($fname), $base_url.'/download/report', array('query' => array('file_name_path' => $file_name_path)));
                                }                            
                            ?>
                            
                            <?php
                        //}
                        ?>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <input type="hidden" name="orderid" value="<?php print arg(4); ?>" />
                        <input type="hidden" name="oid" value="<?php print arg(6); ?>" />
                        <input type="submit" name="submit" value="submit" id="generate_other_report" class="form-submit" />
                    </td>
                </tr>
                <?php
            }
            ?>
            <?php
            if ($record_not_found == 0) {
                ?>
                <tr><td class="txt_ac" colspan="2">Record not found.</td></tr>
                <?php
            }
            ?>
        </table>
    </form>
</div>