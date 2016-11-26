<?php
/**
 * @file
 * footer.tpl.php
 */
?>
<!--footer starts here-->      
<div class="footer_bkg">        
    <div class="footer_inner">
        <div class="foot_col3">
            <h2>Why Clients Choose Us?</h2>
            <?php
                $block = module_invoke('block', 'block_view', '1');
                print $block['content'];
            ?>
        </div>
        <div class="foot_col3 child_mid">
            <h2>Assessments</h2>
            <ul class="bullet_list2">
                <?php
                //  Get the all assessment and create the assessment Link
                //  function defined to load the content type third party request
                $val = get_all_assessment();
                $nid_array = array();
                foreach ($val as $data) {
                    $nid_array[] = $data->nid;
                }
                //  load the node data
                $result = node_load_multiple($nid_array);
                foreach ($result as $rec) {
                    if ($rec->field_assessment_status['und'][0]['value'] == 'Active') {
                        $assessment_alias = drupal_lookup_path('alias', "node/".$rec->nid);
                        print '<li class="li_width"><a href="' . $base_url . '/' . $assessment_alias . '">' . $rec->field_assessment_title['und'][0]['value'] . '</a></li>';
                        //print '<li class="li_width"><a href="' . $base_url . '/node/160/nid/' . $rec->nid . '">' . $rec->field_assessment_title['und'][0]['value'] . '</a></li>';
                    }
                }
                ?>
                
            </ul>
        </div>
        <div class="foot_col3">
            <h2>Contact Us</h2>
            <ul class="social_list">
                <li class="mail_icon">
                    <a href="mailto:<?php print variable_get('SA_ADMIN_EMAIL'); ?>"><?php print variable_get('SA_ADMIN_EMAIL'); ?></a>, 
                    <a href="mailto:support@ndsbs.com">support@ndsbs.com</a>
                </li>
                <li class="phone_icon"><?php print variable_get('SA_ADMIN_PHONE'); ?></li>
                <li class="print_icon"><?php print variable_get('SA_ADMIN_FAX'); ?></li>

<!--<script type="text/javascript" src="https://w.sharethis.com/button/buttons.js"></script>
<script type="text/javascript">stLight.options({publisher: "4fc4dc1e-83ff-4013-b29b-6449fa82bb11", doNotHash: false, doNotCopy: false, hashAddressBar: false});</script>-->

<!--<span class='st_facebook' displayText='Facebook'></span>
<span class='st_twitter' displayText='Tweet'></span>-->

<!--<li class="facebook_icon">
    <span class='st_facebook' displayText='Facebook'></span>
</li>
<li class="twitter_icon">
    <span class='st_twitter' displayText='Twitter'></span>
</li>-->

                <li class="facebook_icon"><a href="https://www.facebook.com/onlinealcoholdrugassessment" target="_blank">Facebook</a></li>
                <li class="twitter_icon"><a href="https://twitter.com/DUIevaluation" target="_blank">Twitter</a></li>
                <li class="google_plus_icon"><a href="https://plus.google.com/100444795766134346734" rel="publisher" target="_blank">Google+</a></li>

                <li class="map_btn"><a href="<?php print $base_url; ?>/contact">Map</a></li>

            </ul>
        </div>
    </div>
</div>
