<?php
/**
 * @file
 * right_block.tpl.php
 */
?>
<!--left column starts here-->
<div class="left_column">
    <?php
        //  Content getting from Custom created block
        $block_content_register = block_get_blocks_by_region('registration_right');
        
        //print '<h1>' . $block_content_register['ndsbs_custom_block_registartion_block']['#block']->title . '</h1>';
        
        print $block_content_register['ndsbs_custom_block_registartion_block']['image']['#markup'];
        
        print $block_content_register['ndsbs_custom_block_registartion_block']['message']['#markup'];
    ?>
</div>
<!--left column ends here-->