<?php

/**
 * @file
 * Theme implentation of the checkout completed page. The countdown js is used
 * to automatically redirect the user to their dashboard after completing a
 * purchase.
 */
?>
<script type="text/javascript">
(function () {
  var url = Drupal.settings.ohio_dui.my_questionnaire_url;
  var timeLeft = 10,
  cinterval;

  var timeDec = function (){
    timeLeft--;
    document.getElementById('countdown').innerHTML = timeLeft;
    if(timeLeft === 0){
      clearInterval(cinterval);
      document.location = url;
    }
  };

  cinterval = setInterval(timeDec, 1000);
})();
</script>
<?php global $user; ?>
<div id="page-container">
  <?php include('includes/top-header.inc'); ?>
  <?php include('includes/sub-header.inc'); ?>
  <?php include('includes/highlights.inc'); ?>
  <section id="content-section" class="clearfix sub-header-padding">
    <a id="main-content"></a>
    <?php include('includes/admin-actions.inc'); ?>
    <div id="content">
      <article id="page-content">
        <?php print render($page['content']); ?>
        <!--<p>Redirecting in <span id="countdown">10</span>.<br>-->
        <span>Click <a href="/user/<?php print $user->uid; ?>/my-assessment?step=questionnaire">here</a> to go to your dashboard.</span></p>
      </article>
    </div>
  </section>
  <?php include('includes/footer.inc'); ?>
</div>
