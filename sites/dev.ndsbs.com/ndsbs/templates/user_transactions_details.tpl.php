<?php
/**
 * @file
 * user_transactions.tpl.php
 */

$transactio_data = get_user_transactions_detail();
//echo '<pre>';
//print_r($transactio_data);
//echo '</pre>';
global $base_path;

?>
<h1>
    Transaction Report
</h1>
<div class="pro_wrap">
<div class="gray_border_box">
<div class="gray_white_bkg">
    <table class="schedule_table schedule_table_fixed">
        <?php
            $i = 0;
            foreach($transactio_data as $data) {
                $user_info = user_load($data->uid);
                $node_info = node_load($data->nid);
//                echo '<pre>';
//                print_r($node_info);
//                echo '</pre>';
        ?>
                <tr>
                    <td>Name</td>
                    <td>
                        <?php print $user_info->field_first_name['und'][0]['value']; ?> 
                        <?php print $user_info->field_middle_name['und'][0]['value']; ?> 
                        <?php print $user_info->field_last_name['und'][0]['value']; ?>
                    </td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td><?php print $user_info->mail; ?></td>
                </tr>
                <?php
                    if($data->shipping_info <> '') {
                ?>
                    <tr>
                        <td>Shipping Address</td>
                        <td>
                            <?php  print $data->shipping_info; ?>
                        </td>
                    </tr>
                <?php
                    }
                ?>
                <tr>
                    <td>Phone</td>
                    <td><?php print $user_info->field_phone['und'][0]['value']; ?></td>
                </tr>
                <tr>
                    <td>Transaction Id</td>
                    <td><?php print $data->transaction_id; ?></td>
                </tr>
                <tr>
                    <td>Transaction Time</td>
                    <td><?php print date('M d, Y h:i A', $data->order_date); ?></td>
                </tr>
                <tr>
                    <td>Transaction Status</td>
                    <td>
                    <?php
                        if($data->payment_status == '1') {
                            print 'Success';
                        } else {
                            print 'Failed';
                        }
                    ?>
                    </td>
                </tr>
    </table>
                <div class="pro_wrapinn">
                        <div class="table_wrap">
                            <table class="schedule_table schedule_table_fixed">
                                <tr class="bkg_b">
                                    <th>Service</th>
                                    <th>Details</th>
                                    <th>Amount</th>
                                </tr>
                                <tr>
                                    <td><?php print ucwords($node_info->type); ?></td>
                                    <td><?php print get_purchased_service_title($node_info, $data->termid); ?></td>
                                    <td><?php print '$' . $data->cost; ?></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td class="bold">Grand Total</td>
                                    <td><?php print '$' . $data->cost; ?></td>
                                </tr>
                            </table>
                            </div>
                        </div>
                   
        <?php
            }
        ?>
    </table>
</div></div></div>
<div class=""><img src="<?php print $base_path . path_to_theme() . '/images/print_icon.gif'; ?>" onclick="printPage();" /></div>
<script>
    function printPage() {
        window.print();
    }
</script>