<?php
global $user;
global $base_url;
/*
echo '<pre>';
    print_r($user);
echo '</pre>';
*/
//  custom image path defined
$path_image = $base_path . path_to_theme() . '/' . 'images';
?>

<?php
/*
    echo '<pre>';
        print_r($node);
    echo '</pre>';
*/
?>
<div class="layout fix_layout">
    <?php
        //  header included
        include_once 'header.tpl.php';
    ?>
    
    <?php
        //  Print the body of the page
        print $node->body['und'][0]['value'];
    ?>
    
    <?php /* if($node->field_page_images['und'][0]['uri'] <> '') { ?>
        <img src="<?php print image_style_url('page_images', $node->field_page_images['und'][0]['uri']); ?>">
    <?php } ?>
        
    <?php 
        if($node->field_page_images_2['und'][0]['uri'] <> '') {
     ?>
        <img src="<?php print image_style_url('page_images', $node->field_page_images_2['und'][0]['uri']); ?>">
    <?php } */ ?>
    
    
    <?php //print render($page['content']); ?>
    
    
    
    <div class="footer">
        <?php
            //  footer included
            include_once 'footer_sub.tpl.php';
            //  footer included
            include_once 'footer.tpl.php';
        ?>
    </div>
</div>