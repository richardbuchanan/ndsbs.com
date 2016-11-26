<?php
/**
 * @file
 * footer.tpl.php
 */
?>
<!--footer starts here-->      
    <div class="footer_inner">
        <?php
        if($view_status) {
        ?>
        <ul class="foot_nav">
            <li><a href="<?php print $base_url; ?>/about" class="first" title="About">About</a></li>
            <li><a href="<?php print $base_url; ?>/assessments/alcohol-assessment" title="Assessments">Assessments</a></li>
            <li><a href="<?php print $base_url; ?>/courts" title="Courts">Courts</a></li>
            <li><a href="<?php print $base_url; ?>/employers" title="Employers">Employers</a></li>
            <li><a href="<?php print $base_url; ?>/staff/briantdavis" title="Staff">Staff</a></li>
            <li><a href="<?php print $base_url; ?>/contact" title="Contact">Contact</a></li>
            <li><a href="<?php print $base_url; ?>/faq" title="FAQ">FAQ</a></li>
            <li><a href="<?php print $base_url; ?>/terms-of-service" title="Terms of use">Terms of Use</a></li>
            <li><a href="<?php print $base_url; ?>/sitemap" title="Sitemap" class="last">Sitemap</a></li>
        </ul>
        <?php
        }
        ?>
        <p>Copyright © 2012 www.ndsbs.com, All rights reserved.</p>
    </div>
<!--footer ends here-->
