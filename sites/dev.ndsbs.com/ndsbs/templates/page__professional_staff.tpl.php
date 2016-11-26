<?php
global $user;
global $base_url;
?>
<?php
/*
    echo '<pre>';
        print_r($node);
    echo '</pre>';
*/
?>
<span itemprop="name" style="display: none">Professional Staff</span>
<div id="breadcrumb" style="display: none;" itemscope itemtype="http://schema.org/BreadcrumbList">
  <ol>
    <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
      <a itemprop="item" href="<?php print $base_url; ?>">
        <span itemprop="name">NDSBS</span>
      </a>
      <meta itemprop="position" content="1" />
    </li>
    <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
      <a itemprop="item" href="<?php print $base_url; ?>/professional-staff">
        <span itemprop="name"><?php print drupal_get_title(); ?></span>
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
    <div class="contents fix_contents">
    <div class="contents_inner">
        <?php
            //  Include right panel block
            include_once 'right_block.tpl.php';
        ?>
        <div class="right_column">
            <?php
                //  Print the body of the page
                print $node->body['und'][0]['value'];
            ?>
            <?php
            //  function call to get the staff
            $staff = get_staff();
            $data = array();
            foreach($staff as $staff_data) {
                //print $staff_data->uid;
                //print '<br />';
                $data[] = user_load($staff_data->uid);
            }
            ?>
            <?php foreach($data as $user_data): ?>
                <ul class="bullet_list">
                    <li>
                        <a href="<?php print $base_url . '/staff/' . $user_data->name; ?>">
                            <?php print $user_data->field_first_name['und'][0]['value'] . ' ' . $user_data->field_last_name['und'][0]['value'];?> <?php if($user_data->field_therapist_degree['und'][0]['value'] <> '') print ', ' . $user_data->field_therapist_degree['und'][0]['value']; ?>
                        </a>
                    </li>
                </ul>
            <?php endforeach; ?>
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
