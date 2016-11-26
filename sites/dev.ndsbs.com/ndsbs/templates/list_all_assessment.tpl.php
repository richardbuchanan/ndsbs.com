<?php
/**
 * @file
 * list_all_assessment.tpl.php
 */
?>
<?php
//  function defined to load the content type third party request
$val = get_all_assessment();
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
?>
<h1>All Assessment</h1>
<div class="table_wrap">
    <table class="schedule_table">
        <tr class="bkg_b">
            <th>Assessment Details</th>
            <th>
                Rush Order Services
                <br />
                <!--Title-------------------Cost---------Status-->
                <div class="subcontent">
                    <div class="subcontent-left" style="width: 45%;">
                        Title
                    </div>
                    <div class="subcontent-left">
                        Cost
                    </div>
                    <div class="subcontent-right">
                        Status
                    </div>
                </div>
            </th>
            <th>Online Questionnaire?</th>
            <th>Action</th>
        </tr>
        <?php
            $total_count = count($result);
            foreach($result as $rec) {
        ?>
            <tr>
                <td>
                    <?php
                        print $rec->field_assessment_title['und'][0]['value'];
                        print '<br />';
                        print '<b>Cost:</b> $' . get_service_amount($rec->field_primary_service['und'][0]['tid']);
                        print '<br />';
                        print '<b>Status:</b> ' . $rec->field_assessment_status['und'][0]['value'];
                    ?>
                </td>
                <td>
                    <?php if($rec->field_rush_order_title_one['und'][0]['value'] <> '') { ?>
                        <div class="subcontent">
                            <div class="subcontent-left" style="width: 60%;">
                                <?php print $rec->field_rush_order_title_one['und'][0]['value']; ?>
                            </div>
                            <div class="subcontent-left">
                                <?php print '$' . get_service_amount($rec->field_rush_order_service_one['und'][0]['tid']); ?>
                            </div>
                            <div class="subcontent-right">
                                <?php print $rec->field_rush_order_status_one['und'][0]['value']; ?>
                            </div>
                        </div>
                        <br />
                    <?php } ?>
                        
                    <?php if($rec->field_rush_order_title_two['und'][0]['value'] <> '') { ?>
                        <div class="subcontent">
                            <div class="subcontent-left" style="width: 60%;">
                                <?php print $rec->field_rush_order_title_two['und'][0]['value']; ?>
                            </div>
                            <div class="subcontent-left">
                                <?php print '$' . get_service_amount($rec->field_rush_order_service_two['und'][0]['tid']); ?>
                            </div>
                            <div class="subcontent-right">
                                <?php print $rec->field_rush_order_status_two['und'][0]['value']; ?>
                            </div>
                        </div>
                        <br />
                    <?php } ?>
                    
                    <?php if($rec->field_rush_order_title_three['und'][0]['value'] <> '') { ?>
                        <div class="subcontent">
                            <div class="subcontent-left" style="width: 60%;">
                                <?php print $rec->field_rush_order_title_three['und'][0]['value']; ?>
                            </div>
                            <div class="subcontent-left">
                                <?php print '$' . get_service_amount($rec->field_rush_order_service_three['und'][0]['tid']); ?>
                            </div>
                            <div class="subcontent-right">
                                <?php print $rec->field_rush_order_status_three['und'][0]['value']; ?>
                            </div>
                        </div>
                        <br />
                    <?php } ?>
                        
                    <?php if($rec->field_rush_order_title_four['und'][0]['value'] <> '') { ?>
                        <div class="subcontent">
                            <div class="subcontent-left" style="width: 60%;">
                                <?php print $rec->field_rush_order_title_four['und'][0]['value']; ?>
                            </div>
                            <div class="subcontent-left">
                                <?php print '$' . get_service_amount($rec->field_rush_order_service_four['und'][0]['tid']); ?>
                            </div>
                            <div class="subcontent-right">
                                <?php print $rec->field_rush_order_status_four['und'][0]['value']; ?>
                            </div>
                        </div>
                    <?php } ?>
                </td>
                
                <td>
                    <?php print $rec->field_online_questionnaire['und'][0]['value']; ?>
                    <br />
                    <?php
                        if($rec->field_online_questionnaire['und'][0]['value'] == 'Available') {
                            print l(t('View Questionnaire'), 'questionnaire/preview/'.$rec->nid.'/trans/1/uid/1');
                        }
                    ?>
                </td>
                <td>
                    <?php
                        $options = array('query' => array('destination' => 'admin/all/assessment'), 'attributes' => array('class' => 'edit_icon'));
                        print l(t('Edit'), 'node/'.$rec->nid.'/edit', $options);
                    ?>
                </td>
            </tr>
        <?php
            }
            
            if($total_count <= 0) {
        ?>
                <tr>
                    <td class="txt_ac" colspan="5">
                        Record not found.
                    </td>
                </tr>
        <?php
            }
        ?>
    </table>
</div>
