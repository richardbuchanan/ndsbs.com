<?php
global $user;
global $base_url;
?>
<div class="layout fix_layout">
    <?php
        //  header included
        include_once 'header.tpl.php';
    ?>
    
   <div class="contents">
     <div class="contents_inner">
      <h1>Contact Us</h1>
      <div class="col2 border_n">
      <?php
          //  Print the body of the page
          //print $node->body['und'][0]['value'];
        if($messages <> '') {
            print $messages;
        }
          
          $cnfrm = get_contact_form();
          print drupal_render($cnfrm);
      ?>
      </div>
      <div class="col2 last border_n mt_20">
        <ul class="social_list">
            <li class="mail_icon"><a href="mailto:info@ndsbs.com">info@ndsbs.com</a></li>
            <li class="phone_icon">614.888.7274</li>
            <li class="home_icon">sdfdf</li>            
        </ul>
        <h2 class="clear pt_20">Map</h2>
        <div class="google_map">
          <iframe width="400" height="300" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.co.in/maps?hl=en&amp;ie=UTF8&amp;ll=27.141237,80.883382&amp;spn=11.073296,21.643066&amp;t=m&amp;z=6&amp;output=embed"></iframe><br /><small><a href="https://maps.google.co.in/maps?hl=en&amp;ie=UTF8&amp;ll=27.141237,80.883382&amp;spn=11.073296,21.643066&amp;t=m&amp;z=6&amp;source=embed" style="color:#0000FF;text-align:left">View Larger Map</a></small>
        </div>
      </div>
    </div>
   </div>

    <div class="footer">
        <?php
            //  footer included
            include_once 'footer_sub.tpl.php';
            //  footer included
            include_once 'footer.tpl.php';
        ?>
    </div>
</div>
