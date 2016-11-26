<?php
global $user;
global $base_url;
//  custom image path defined
$path_image = $base_path . path_to_theme() . '/' . 'images';

//  function call to get the staff
$staff = get_staff();
$data = array();
$anita = FALSE;
foreach($staff as $staff_data) {
    //print $staff_data->uid;
    //print '<br />';
    $data[] = user_load($staff_data->uid);
}
if (arg(1) == 'anitamcleod') {
  $anita = TRUE;
}
if (drupal_get_path_alias(current_path()) == 'staff') {
  $argument = 'briantdavis';
}
else {
    $argument = arg(1);
}
//$staff_description = user_load($argument);
$staff_description = user_load_by_name($argument);

//  Get the testimonials
    $testimonial = get_all_testimonial();
    
    $node_testimonial = array();
    foreach($testimonial as $testidata) {
        $node_testimonial[] = node_load($testidata->nid);
    }
?>
<?php
  if ($messages) {
    print $messages;
  }
?>
<span itemprop="name" style="display: none"><?php print $title; ?></span>
<div id="breadcrumb" style="display: none;" itemscope itemtype="http://schema.org/BreadcrumbList">
  <ol>
    <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
      <a itemprop="item" href="<?php print $base_url; ?>">
        <span itemprop="name">NDSBS</span>
      </a>
      <meta itemprop="position" content="1" />
    </li>
    <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
      <a itemprop="item" href="<?php print $base_url; ?>/staff">
        <span itemprop="name">Staff</span>
      </a>
      <meta itemprop="position" content="2" />
    </li>
  </ol>
</div>
<div class="layout fix_layout">
    <?php
    //  header included
    include_once 'header.tpl.php';
    ?>
    <!--slide starts here-->
    <div class="slides">
        <div class="slides_inner">
            <div class="li01">
                <?php if($staff_description->field_therapist_large_image['und'][0]['uri'] <> '') { ?>
                    <img src="<?php print image_style_url('staff_image_resize_large', $staff_description->field_therapist_large_image['und'][0]['uri']) ?>">
                <?php } else { ?>
                    <img src="<?php print image_style_url('staff_image_resize_large', 'public://default_images/UserDefault.jpg') ?>">
                <?php } ?>
            </div>
            
            <div class="li1">
                <?php /* if($staff_description->field_therapist_large_image['und'][0]['uri'] <> '') { ?>
                    <img src="<?php print image_style_url('staff_image_resize_large', $staff_description->field_therapist_large_image['und'][0]['uri']) ?>">
                <?php } else { ?>
                    <img src="<?php print image_style_url('staff_image_resize_large', 'public://default_images/UserDefault.jpg') ?>">
                <?php } */ ?>
                <!--<img src="<?php //print image_style_url('staff_image_resize_large', $staff_description->field_therapist_large_image['und'][0]['uri']) ?>" width="515px" height="381px">-->
                <div class="message">
                    <h1>
                        <?php print $staff_description->field_first_name['und'][0]['value'] . ' ' . $staff_description->field_last_name['und'][0]['value']; ?>
                        <?php if($staff_description->field_therapist_degree['und'][0]['value'] <> '') print $staff_description->field_therapist_degree['und'][0]['value']; ?>
                    </h1>
                    <span>
                        <p>
                            <?php print $staff_description->field_education_sub['und'][0]['value']; ?>
                        </p>
                        <small>d</small>
                    </span>
                    
                    <?php
                        if($staff_description->field_education_desc['und'][0]['value'] <> '') {
                    ?>
                    <div class="message_scroll">
                        <p>
                            <?php print $staff_description->field_education_desc['und'][0]['value']; ?>
                        </p>
                    </div>
                    <?php
                        }
                    ?>
                </div>            
            </div>
            <div class="li2">
                <!-- <img src="<?php //print $path_image . '/staff.png'; ?>">  -->
                <div class="message">
                    <h1>
                        <?php print $staff_description->field_first_name['und'][0]['value'] . ' ' . $staff_description->field_last_name['und'][0]['value']; ?>
                        <?php if($staff_description->field_therapist_degree['und'][0]['value'] <> '') print $staff_description->field_therapist_degree['und'][0]['value']; ?>
                    </h1>
                    <span>
                        <p>
                            <?php print $staff_description->field_biography_sub['und'][0]['value']; ?>
                        </p>
                        <small>d</small>
                    </span>
                    <?php
                        if($staff_description->field_biography_desc['und'][0]['value'] <> '') {
                    ?>
                    <div class="message_scroll" id="test1b">
                        <p>
                            <?php print $staff_description->field_biography_desc['und'][0]['value']; ?>
                        </p>
                    </div>
                    <?php
                        }
                    ?>
                </div>
            </div>            
            <?php /* ?>
            <div class="li3">
                <div class="message">
                    <h1><?php print $staff_description->field_first_name['und'][0]['value'] . ' ' . $staff_description->field_last_name['und'][0]['value']; ?></h1>
                    <span>
                        <p>
                            <?php //print $staff_description->field_assessments_sub['und'][0]['value']; ?>
                            Assessments
                        </p>
                        <small>d</small>
                    </span>
                    <div class="message_scroll">
                        <?php //print $staff_description->field_assessments_desc['und'][0]['value']; ?>
                        <ul class="bullet_list3">
                        <?php
                            foreach($staff_description->field_assessment_assigned['und'] as $assessment) {
                                $asment_tid = $assessment['tid'];
                                print '<li>' . get_service_title($asment_tid) . '</li>';
                            }
                        ?>
                        </ul>
                    </div>
                </div>            
            </div>
            <?php */ ?>
            <div class="li4">
                <?php /* if($staff_description->field_therapist_large_image['und'][0]['uri'] <> '') { ?>
                    <img src="<?php print image_style_url('staff_image_resize_large', $staff_description->field_therapist_large_image['und'][0]['uri']) ?>">
                <?php } else { ?>
                    <img src="<?php print image_style_url('staff_image_resize_large', 'public://default_images/UserDefault.jpg') ?>">
                <?php } */ ?>
                <!-- <img src="<?php //print image_style_url('staff_image_resize_large', $staff_description->field_therapist_large_image['und'][0]['uri']) ?>" width="515px" height="381px">-->
                <div class="message">
                    <h1>
                        <?php print $staff_description->field_first_name['und'][0]['value'] . ' ' . $staff_description->field_last_name['und'][0]['value']; ?>
                        <?php if($staff_description->field_therapist_degree['und'][0]['value'] <> '') print $staff_description->field_therapist_degree['und'][0]['value']; ?>
                    </h1>
                    <span>
                        <p>
                            <?php //print $staff_description->field_get_in_touch_sub['und'][0]['value']; ?>
                            Get in touch
                        </p>
                        <small>d</small>
                    </span>
                    <div class="message_scroll">
                        <?php //print $staff_description->field_get_in_touch_desc['und'][0]['value']; ?>
                        <ul class="social_list">
                            <li class="mail_icon"><a href="mailto:<?php print $staff_description->mail; ?>"><?php print $staff_description->mail; ?></a></li>
                            <?php if ($anita): ?>
                            <li class="phone_icon">585.939.7531</li>
                            <li class="print_icon">585.939.7501</li>
                            <?php else: ?>
                            <li class="phone_icon">614.888.7274</li>
                            <li class="print_icon">614.888.3239</li>
                            <?php endif; ?>
                        </ul>                        
                    </div>
                </div>            
            </div>
        </div>        
    </div>
    <div class="slides_b">
        <ul>
            <li id="li1" class="active"><span>01.</span>Summary</li>
            <li id="li2"><span>02.</span>Biography</li>
            <!--<li id="li3"><span>03.</span>Assessments</li>-->
            <li id="li4"><span>04.</span>Get In touch</li>
        </ul>
    </div>
    <!--slide ends here-->
    <!--contents starts here-->
    <div class="contents profile_contents">
        <div class="contents_inner">
            <!--left column starts here-->
            <div class="left_columns">
                <h2>Testimonials</h2>
                <?php
                    foreach($node_testimonial as $testimonial_data) {
                        $testimonial_user = user_load($testimonial_data->field_testimonial_by['und'][0]['uid']);
                ?>
                    <div class="gery_bkg">
                        <?php /* ?>
                        <div class="testimonial_thumb">
                            <?php if($testimonial_user->field_profile_picture['und'][0]['uri'] <> '') { ?>
                                <img src="<?php print image_style_url('thumbnail', $testimonial_user->field_profile_picture['und'][0]['uri']) ?>" width="48px" height="49px">
                            <?php } else { ?>
                                <img src="<?php print image_style_url('thumbnail', 'public://default_images/UserDefault.jpg') ?>" width="48px" height="49px">
                            <?php } ?>
                        </div>
                        <?php */ ?>
                        <div class="testimonial_contents">
                            <p>
                                <?php print $testimonial_data->field_testimonial_description['und'][0]['value']; ?>.
                                <br />
                                <?php print l(t('more...'), $base_url . '/testimonial'); ?>
                            </p>
                            <b><?php print $testimonial_data->field_testimonial_user_name['und'][0]['value']; ?></b>
                            <br />
                            <?php print $testimonial_data->field_testimonial_user_place['und'][0]['value']; ?>
                        </div>
                    </div>
                <?php
                    }
                ?>
            </div>
            <!--left column ends here-->
            <!--right column starts here-->
            <div class="right_columns">
                <!--<h1 class="tittile">Other Counselors</h1>-->
                <?php
                    $i = 0;
                    foreach($data as $user_data) {
                      if ($user_data->name != 'richardbuchanan') {
                        if($user_data->uid != 171 && $user_data->uid != 866) {
                            if($i % 2 == 0) {
                                $cls = 'right';
                            } else {
                                $cls = 'left';
                            }
                            $i++;
                ?>
                        <div class="csr_col <?php print $cls; ?>">
                            <?php //print $base_url . '/node/161/sid/' . $user_data->uid; ?>
                            <a href="<?php print $base_url . '/staff/' . $user_data->name; ?>">
                                <?php if($user_data->field_profile_picture['und'][0]['uri'] <> '') { ?>
                                    <img src="<?php print image_style_url('staff_image_resize', $user_data->field_profile_picture['und'][0]['uri']) ?>">
                                <?php } else { ?>
                                    <img src="<?php print image_style_url('staff_image_resize', 'public://default_images/UserDefault.jpg') ?>">
                                <?php } ?>
                            </a>
                            <div class="csr_contents">
                                <h2><?php print $user_data->field_first_name['und'][0]['value'] . ' ' . $user_data->field_last_name['und'][0]['value'];?> <span> <?php if($user_data->field_therapist_degree['und'][0]['value'] <> '') print $user_data->field_therapist_degree['und'][0]['value']; ?></span></h2>
                                <p>
                                <?php
                                    print substr($user_data->field_biography_desc['und'][0]['value'], 0, 70);
                                    print '<br />';

                                    print '<a href="' . $base_url . '/staff/' . $user_data->name . '">More...</a>';
                                /*
                                    foreach($user_data->field_assessment_assigned['und'] as $staff_assessment) {
                                        $assessment_tid = $staff_assessment['tid'];
                                        print get_service_title($assessment_tid);
                                        print '<br />';
                                    }
                                 */
                                ?>
                                </p>
                            </div>
                        </div>
                <?php
                        }
                      }
                    }
                ?>
            </div>
            <!--right column ends here-->
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
