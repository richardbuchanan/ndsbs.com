<?php
global $user;
global $base_url;
?>
<div class="layout fix_layout">
    <?php
        //  header included
        include_once 'header.tpl.php';
    ?>
    <!--contents starts here-->
    <div class="contents faq_contents">
        <div class="contents_inner">

          <?php if (isset($breadcrumb)): ?>
            <?php print $breadcrumb; ?>
          <?php endif; ?>
            <h1 class="tittile">Map</h1>
            <?php
                //  Print the body of the page
                //print $node->body['und'][0]['value'];
            ?>
        </div>
    </div>
    <!--contents ends here-->
    <div class="footer">
        <?php
            //  footer included
            include_once 'footer_sub.tpl.php';
            //  footer included
            include_once 'footer.tpl.php';
        ?>
    </div>
</div>