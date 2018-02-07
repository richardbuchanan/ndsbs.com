<?php
/**
 * @file
 * user_stateform_report.tpl.php
 */
global $base_url;
drupal_add_js(drupal_get_path('theme', 'bootstrap_ndsbs') . '/js/stateform-reports.js');
//  Notary status defined on 29-03-2013 mail dated on 29-03-2013
$notary_status = 'inactive';        //  Change $notary_status from inactive to active to show the notary
//  Notary status defined on 29-03-2013

$user_id = arg(3);
$user_info = user_load($user_id);
//  Show the tab selected

// Add sticky table header library.
drupal_add_js('misc/tableheader.js');
?>
<h1>
  Client State/DMV Form Reports
</h1>
<div class="table_wrap">
  <span id="success_msg_statfrm"></span>

  <form id="stateform-frm" method="post"
        action="<?php print $base_url; ?>/save/stateform/verification"
        enctype="multipart/form-data">
    <table class="table table-striped table-responsive sticky-enabled">
      <thead>
      <tr class="bkg_b">
        <th>Requested State/DMV forms</th>
        <!--<th>Preferred therapist</th>-->
        <th>Express Mail</th>
        <?php
        if ($notary_status == 'active') {
          ?>
          <th>Notary Request</th>
          <?php
        }
        ?>
        <th>Comments</th>
        <th>Action</th>
      </tr>
      </thead>
      <tbody>
      <?php
      //  Get the user's paper work assigned to this term (Purchased Term)
      //            $val = get_client_stateform_info_report($userid = arg(3), $tid = arg(5));
      //            $nid_array = array();
      //            foreach ($val as $data) {
      //                $nid_array[] = $data->nid;
      //            }
      //            //  load the node data
      //            $result = node_load_multiple($nid_array);

      $result_node_data = node_load(arg(5));
      $result[0] = $result_node_data;
      //            print '<pre>';
      //                print_r($result);
      //            print '</pre>';

      $i = 0;
      $count = count($result);
      if ($count > 0) {
        foreach ($result as $rec) {
          if ($rec->field_state_form_payment_status['und'][0]['value'] == 1) {
            //print '<pre>';
            //print_r($rec);
            //print '</pre>';
            ?>
            <tr>
              <td>
                <?php
                $total_count = count($rec->field_state_form_title['und']);
                for ($j = 0; $j < $total_count; $j++) {
                  ?>
                  <?php
                  $explode = explode('.', $rec->field_state_form_upload['und'][$j]['filename']);
                  $file_extension = $explode[1];
                  $fname = drupal_basename($rec->field_state_form_upload['und'][$j]['uri']);
                  print '<a href="' . $base_url . '/sites/ndsbs.com/files/stateform/' . $fname . '" type="application/' . $file_extension . '; length=' . $rec->field_state_form_upload['und'][$j]['filesize'] . '">' . $rec->field_state_form_title['und'][$j]['value'] . '</a>';
                  ?>
                  <br/>
                  <?php
                }
                //  Code for stateform title pages
                ?>
              </td>

              <!--<td>
                                <?php
              //$prefrered_therapist = user_load($rec->field_state_form_user_reference['und'][0]['uid']);
              //print $prefrered_therapist->field_first_name['und'][0]['value'] . ' ' . $prefrered_therapist->field_last_name['und'][0]['value'];
              ?>
                            </td>-->

              <td>
                <?php
                $report_updated_by = user_load($rec->field_report_updated_by['und'][0]['value']);
                if ($rec->field_express_mail_status['und'][0]['value'] == 2) {
                  print 'Dispatched on ' . date('M d, Y', $rec->field_report_updated_on['und'][0]['value']);
                  print '<br />';
                  print 'Updated by - ' . $report_updated_by->field_first_name['und'][0]['value'] . ' ' . $report_updated_by->field_last_name['und'][0]['value'];
                }
                else {
                  $express_mail_status = get_express_mail_request($rec->field_state_form_transid['und'][0]['value']);
                  $express_mail = $express_mail_status[0]->express_mail;
                  if ($express_mail > 0) {
                    $requested = 1;
                  }
                  else {
                    $requested = 0;
                  }
                  ?>
                  <select name="express_mail_status_<?php print $i; ?>"
                          id="express_mail_status">
                    <option value="0">-Select-</option>
                    <option value="1" <?php if ($requested == 1) {
                      print 'selected';
                    } ?>>Requested
                    </option>
                    <option value="2">Dispatched</option>
                    <!-- 2 stand for Dispatched -->
                  </select>
                  <?php
                }
                ?>
                <br/>
              </td>
              <?php
              if ($notary_status == 'active') {
                ?>
                <td>
                  <?php
                  if ($rec->field_notary_status['und'][0]['value'] == 2) {
                    print 'Attached <br />';
                    print 'Updated by - ' . $report_updated_by->field_first_name['und'][0]['value'] . ' ' . $report_updated_by->field_last_name['und'][0]['value'];
                  }
                  else {
                    ?>
                    <select name="notary_status_<?php print $i; ?>"
                            id="notary_status">
                      <option value="0">-Select-</option>
                      <!--                                                            <option value="1">Requested</option> 1 stand for Requested -->
                      <option value="2">Attached</option>
                      <!-- 1 stand for Attached -->
                    </select>
                    <?php
                  }
                  ?>
                </td>
                <?php
              }
              ?>
              <td>
                <?php
                print $rec->field_state_form_comment['und'][0]['value'];
                ?>
                <!-- USED to pass the node id -->
                <input type="hidden" name="stateform_node_id_<?php print $i; ?>"
                       value="<?php print $rec->nid; ?>"/>
              </td>
              <td>
                <!-- State from node id used  -->
                <input type="hidden" name="statenid_<?php print $i; ?>"
                       value="<?php print $rec->nid; ?>"/>
                <input type="file" name="file_<?php print $i; ?>"/>
                <br/>
                <?php
                if ($rec->field_report_state_form['und'][0]['value'] <> '') {
                  $fname = $rec->field_report_state_form['und'][0]['value'];
                  $file_name_path = 'public://reports/' . $fname;
                  print l(t($fname), $base_url . '/download/report', array('query' => array('file_name_path' => $file_name_path)));
                }
                else {
                  print 'NA';
                }
                ?>
              </td>
            </tr>
            <?php
            $i++;
          }
        }
        ?>
        <tr>
          <td colspan="4">
            <input type="hidden" name="total_count" value="<?php print $i; ?>"/>
            <input type="hidden" name="uid" value="<?php print arg(3); ?>"/>
            <!--                        <input type="hidden" name="tid" value="<?php print arg(5); ?>" />-->
            <input type="hidden" name="nid" value="<?php print arg(5); ?>"/>
            <input type="submit" name="submit" value="submit"
                   id="save_stateform_verification" class="form-submit" style="float: right;"/>
          </td>
        </tr>
        <?php
      }
      else {
        ?>
        <tr>
          <td colspan="4">
            No Stateform found.
          </td>
        </tr>
        <?php
      }
      ?>
      </tbody>
    </table>
  </form>
</div>
