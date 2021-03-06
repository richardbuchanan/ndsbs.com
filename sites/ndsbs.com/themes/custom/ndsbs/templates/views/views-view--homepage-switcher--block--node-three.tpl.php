<?php

/**
 * @file
 * Main view template.
 *
 * Variables available:
 * - $classes_array: An array of classes determined in
 *   template_preprocess_views_view(). Default classes are:
 *     .view
 *     .view-[css_name]
 *     .view-id-[view_name]
 *     .view-display-id-[display_name]
 *     .view-dom-id-[dom_id]
 * - $classes: A string version of $classes_array for use in the class attribute
 * - $css_name: A css-safe version of the view name.
 * - $css_class: The user-specified classes names, if any
 * - $header: The view header
 * - $footer: The view footer
 * - $rows: The results of the view query, if any
 * - $empty: The empty text to display if the view is empty
 * - $pager: The pager next/prev links to display, if any
 * - $exposed: Exposed widget form/info to display
 * - $feed_icon: Feed icon to display, if any
 * - $more: A link to view more, if any
 *
 * @ingroup views_templates
 */
?>
<div class="<?php print $classes; ?>">
  <?php print render($title_prefix); ?>
  <?php if ($title): ?>
    <?php print $title; ?>
  <?php endif; ?>
  <?php print render($title_suffix); ?>
  <?php if ($header): ?>
    <div class="view-header">
      <?php print $header; ?>
    </div>
  <?php endif; ?>

  <?php if ($rows): ?>
    <ul id="assessments-switcher" class="uk-switcher switcher-demo-three">
      <li class="uk-active">

        <div class="uk-width-1-1 switcher-left" uk-switcher="active: -1">
          <?php foreach ($items as $index => $item): ?>
            <div class="uk-flex uk-flex-center<?php if ($index) print ' uk-margin'; ?>">
              <button class="uk-button uk-button-default" type="button" aria-expanded="false"><?php print $item['title']; ?></button>
            </div>
          <?php endforeach; ?>
          <div class="switcher-init uk-hidden"></div>
        </div>

        <ul class="uk-switcher uk-margin switcher-right">
          <?php foreach ($items as $index => $item): ?>
            <li class="switcher-animate">
              <div class="uk-margin-bottom">
                <span class="close-switcher" uk-icon="icon: chevron-left; ratio: 2"></span>
              </div>
              <?php print $item['content']; ?>
            </li>
          <?php endforeach; ?>
          <li class="switcher-init uk-hidden"></li>
        </ul>

      </li>
    </ul>
  <?php endif; ?>

  <div id="state-acceptance" class="uk-margin-top">
    <hr style="border-top-width:3px;">
    <h3 class="uk-margin-top">Not Sure About Acceptance in Your State?</h3>
    <a href="/state-map" class="uk-display-inline-block">
      <span class="uk-margin-small-right" uk-icon="icon: world"></span>
      <span style="vertical-align:middle">Check My State</span>
    </a>
  </div>

</div><?php /* class view */ ?>
