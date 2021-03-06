<?php

/**
 * @file
 * UIkit's theme implementation to display a node.
 *
 * Available variables:
 * - $title: the (sanitized) title of the node.
 * - $content: An array of node items. Use render($content) to print them all,
 *   or print a subset such as render($content['field_example']). Use
 *   hide($content['field_example']) to temporarily suppress the printing of a
 *   given element.
 * - $user_picture: The node author's picture from user-picture.tpl.php.
 * - $date: Formatted creation date. Preprocess functions can reformat it by
 *   calling format_date() with the desired parameters on the $created variable.
 * - $name: Themed username of node author output from theme_username().
 * - $node_url: Direct URL of the current node.
 * - $display_submitted: Whether submission information should be displayed.
 * - $submitted: Submission information created from $name and $date during
 *   template_preprocess_node().
 * - $classes: String of classes that can be used to style contextually through
 *   CSS. It can be manipulated through the variable $classes_array from
 *   preprocess functions. The default values can be one or more of the
 *   following:
 *   - node: The current template type; for example, "theming hook".
 *   - node-[type]: The current node type. For example, if the node is a
 *     "Blog entry" it would result in "node-blog". Note that the machine
 *     name will often be in a short form of the human readable label.
 *   - node-teaser: Nodes in teaser form.
 *   - node-preview: Nodes in preview mode.
 *   The following are controlled through the node publishing options.
 *   - node-promoted: Nodes promoted to the front page.
 *   - node-sticky: Nodes ordered above other non-sticky nodes in teaser
 *     listings.
 *   - node-unpublished: Unpublished nodes visible only to administrators.
 * - $title_prefix (array): An array containing additional output populated by
 *   modules, intended to be displayed in front of the main title tag that
 *   appears in the template.
 * - $title_suffix (array): An array containing additional output populated by
 *   modules, intended to be displayed after the main title tag that appears in
 *   the template.
 *
 * Other variables:
 * - $node: Full node object. Contains data that may not be safe.
 * - $type: Node type; for example, story, page, blog, etc.
 * - $comment_count: Number of comments attached to the node.
 * - $uid: User ID of the node author.
 * - $created: Time the node was published formatted in Unix timestamp.
 * - $classes_array: Array of html class attribute values. It is flattened
 *   into a string within the variable $classes.
 * - $zebra: Outputs either "even" or "odd". Useful for zebra striping in
 *   teaser listings.
 * - $id: Position of the node. Increments each time it's output.
 *
 * Node status variables:
 * - $view_mode: View mode; for example, "full", "teaser".
 * - $teaser: Flag for the teaser state (shortcut for $view_mode == 'teaser').
 * - $page: Flag for the full page state.
 * - $promote: Flag for front page promotion state.
 * - $sticky: Flags for sticky post setting.
 * - $status: Flag for published status.
 * - $comment: State of comment settings for the node.
 * - $readmore: Flags true if the teaser content of the node cannot hold the
 *   main body content.
 * - $is_front: Flags true when presented in the front page.
 * - $logged_in: Flags true when the current user is a logged-in member.
 * - $is_admin: Flags true when the current user is an administrator.
 *
 * Field variables: for each field instance attached to the node a corresponding
 * variable is defined; for example, $node->body becomes $body. When needing to
 * access a field's raw values, developers/themers are strongly encouraged to
 * use these variables. Otherwise they will have to explicitly specify the
 * desired field language; for example, $node->body['en'], thus overriding any
 * language negotiation rule that was previously applied.
 *
 * @see template_preprocess()
 * @see template_preprocess_node()
 * @see template_process()
 * @see uikit_preprocess_node()
 *
 * @ingroup uikit_themeable
 */
?>
<article id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?>"<?php print $attributes; ?>>
  <?php print render($title_prefix); ?>
  <?php if (!$page): ?>
    <h2<?php print $title_attributes; ?>><a href="<?php print $node_url; ?>"><?php print $title; ?></a></h2>
  <?php endif; ?>
  <?php print render($title_suffix); ?>

  <div class="content"<?php print $content_attributes; ?>>
    <div uk-grid>

      <?php if (isset($content['field_asmentinfo_section_one'])): ?>
        <div id="assessment-section-one" class="uk-width-1-1">
          <?php print render($content['field_asmentinfo_section_one']); ?>
          <hr class="uk-divider-icon">
        </div>
      <?php endif; ?>

      <div id="assessment-section-two" class="uk-width-1-1 uk-width-1-1@s uk-width-2-3@m uk-width-2-3@l uk-width-3-4@xl">
        <?php if (isset($content['field_service_description'])): ?>
          <?php print render($content['field_service_description']); ?>
        <?php endif; ?>
      </div>

      <div id="puchase-card" class="uk-width-1-1 uk-width-1-1@s uk-width-1-3@m uk-width-1-3@l uk-width-1-4@xl">
        <div class="uk-card uk-card-primary uk-card-hover uk-card-body uk-text-center">

          <?php if ($service_amount): ?>
            <div class="service-amount">
              <?php print $service_amount; ?>
            </div>

            <div class="purchase-link">
              <?php print $purchase_link; ?>
            </div>
          <?php else: ?>
            <div class="call-for-service">
              <h3>Call for Service</h3>
            </div>
            <div class="toll-free">
              <a href="tel:+1-800-671-8589" class="uk-button uk-button-primary">1-800-671-8589</a>
            </div>
          <?php endif; ?>
        </div>
      </div>

      <?php if (isset($content['field_asmentinfo_section_two'])): ?>
        <div id="assessment-section-three" class="uk-width-1-1">
          <hr class="uk-divider-icon">
          <?php print render($content['field_asmentinfo_section_two']); ?>
        </div>
      <?php endif; ?>

      <?php if (isset($content['field_asmentinfo_section_three'])): ?>
        <div id="assessment-section-four" class="uk-width-1-1">
          <hr class="uk-divider-icon">
          <?php print render($content['field_asmentinfo_section_three']); ?>
        </div>
      <?php endif; ?>

    </div>
  </div>

</article>
