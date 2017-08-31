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
  <h2>Authorization to Release Substance Abuse Assessment Treatment and/or Mental Health Information</h2>
  <p>This form, when completed and digitally signed by you or a personal representative having legal authority to execute this authorization on your behalf, authorizes Directions Counseling Group (ndsbs.com) to release <strong>protected health information (PHI)</strong> from your clinical record to the person/agency you designate.</p>
  <div class="uk-display-inline-block uk-width-1-1">
    <div class="uk-float-right"><?php print render($content['links']); ?></div>
  </div>

  <div class="content"<?php print $content_attributes; ?>>
    <h3 class="release-authorization-section uk-text-center">Personal Information</h3>
    <div uk-grid>
      <div class="uk-width-1-2">
        <span>Client's Name:</span> <span class="text-underline uk-h4"><?php print $title; ?></span>
      </div>
      <div class="uk-width-1-2">
        <span>Client's DOB:</span> <span class="text-underline uk-h4"><?php print $client_dob; ?></span>
      </div>

      <div class="uk-width-1-1">
        <span>Parent of, guardian of, or power of attorney for the client:</span> <span class="text-underline uk-h4"><?php print $parent_guardian_poa_name; ?> </span>
        <?php if ($parent_guardian_poa): ?>
          <span class="text-underline uk-h4">(<?php print $parent_guardian_poa; ?>)</span>
        <?php endif; ?>
      </div>
    </div>

    <h3 class="release-authorization-section uk-text-center">Authorization</h3>

    <p class="uk-margin-remove">I authorize <span class="text-underline uk-h4"><?php print $clinician; ?></span> of Directions Counseling Group and ndsbs.com to:</p>
    <ul class="uk-margin-remove-top">
      <?php foreach ($exchange_release_obtain as $value): ?>
        <li><span class="text-underline uk-h4"><?php print $value; ?></li>
      <?php endforeach; ?>
    </ul>

    <address>
      <?php if ($recipient): ?><span class="uk-h4"><?php print $recipient; ?></span><br><?php endif; ?>
      <?php if ($recipient_company): ?><span class="uk-h4"><?php print $recipient_company; ?></span><br><?php endif; ?>
      <?php if ($recipient_address): ?><span class="uk-h4"><?php print $recipient_address; ?></span><br><?php endif; ?>
      <?php if ($recipient_address_additional): ?><span class="uk-h4"><?php print $recipient_address_additional; ?></span><br><?php endif; ?>
      <?php if ($recipient_email): ?><span class="uk-h4">Email: <?php print $recipient_email; ?></span><br><?php endif; ?>
      <?php if ($recipient_phone): ?><span class="uk-h4">Phone: <?php print $recipient_phone; ?></span><br><?php endif; ?>
      <?php if ($recipient_fax): ?><span class="uk-h4">Fax: <?php print $recipient_fax; ?></span><br><?php endif; ?>
    </address>

    <p class="uk-margin-remove">Please provide the following information to the individual/company above:</p>
    <ul class="uk-margin-remove-top">
      <?php foreach ($provided_information as $information): ?>
        <li><span class="text-underline uk-h4"><?php print $information; ?></span></li>
      <?php endforeach; ?>
    </ul>

    <p class="uk-margin-remove">The general purpose of this request is for:</p>
    <ul class="uk-margin-remove-top">
      <?php foreach ($purposes as $purpose): ?>
        <li><span class="text-underline uk-h4"><?php print $purpose; ?></span></li>
      <?php endforeach; ?>
    </ul>

    <h3 class="release-authorization-section uk-text-center">Method of Transfer</h3>
    <?php if ($method_of_transfer['method'] != 'mail'): ?>
      <div class="uk-width-1-1">
        <span><?php print $method_of_transfer['method']; ?></span> <span class="text-underline uk-h4"><?php print $method_of_transfer['value']; ?></span>
      </div>
    <?php else: ?>
      <p class="uk-margin-remove">Mail to:</p>
      <address class="uk-margin-remove">
        <?php if ($recipient): ?><span class="uk-h4"><?php print $recipient; ?></span><br><?php endif; ?>
        <?php if ($recipient_company): ?><span class="uk-h4"><?php print $recipient_company; ?></span><br><?php endif; ?>
        <?php if ($recipient_address): ?><span class="uk-h4"><?php print $recipient_address; ?></span><br><?php endif; ?>
        <?php if ($recipient_address_additional): ?><span class="uk-h4"><?php print $recipient_address_additional; ?></span><br><?php endif; ?>
      </address>
    <?php endif; ?>

    <p class="uk-margin-remove-bottom">I am willing to have my PHI shared via unsecured email or fax and I have been made aware of the risks that are involved by using this form of unsecured communication means.</p>
    <p class="uk-margin-remove-top">Initials: <span class="text-underline uk-h4"><?php print $initials; ?></span></p>

    <h3 class="release-authorization-section uk-text-center">Revocation</h3>
    <p class="uk-margin-remove-bottom">I understand that I have a right to revoke this authorization at any time by sending written notification to Directions Counseling Group. I further understand that a revocation of the authorization is not effective to the extent that action has been taken in reliance on the authorization. This consent will automatically expire one (1) year after the date of my signature as it appears below, unless indicated otherwise here:</p>
    <p class="uk-margin-remove-top">Revocation date: <span class="text-underline uk-h4"><?php if ($revocation_date): ?><?php print $revocation_date; ?><?php else: ?>N/A<?php endif; ?></span></p>

    <h3 class="release-authorization-section uk-text-center">Conditions</h3>
    <p>I understand that in some circumstances, by not signing this agreement, my therapist may condition providing me mental health services.</p>

    <h3 class="release-authorization-section uk-text-center">Form of Disclosure</h3>
    <p>Unless you have specifically requested in writing that the disclosure be made in a certain format, we reserve the right to disclose information as permitted by this authorization in any manner that we deem to be appropriate and consistent with applicable law, including, but not limited to, verbally, in paper format, or electronically.</p>

    <h3 class="release-authorization-section uk-text-center">Redisclosure</h3>
    <p><strong>Substance Abuse Information being Released:</strong> Federal law prohibits the person or organization to whom disclosure is made from making any further disclosure of substance abuse treatment information unless further disclosure is expressly permitted by the written authorization of the person to whom it pertains or as otherwise permitted by 42 C.F.R. Part 2. I will be given a copy of this authorization for my records.</p>
    <p><strong>Mental Health Information being Released:</strong> I understand that there is the potential that the protected health information that is disclosed pursuant to this authorization may be redisclosed by the recipient and the protected health information will no longer be protected by the HIPAA privacy regulations, unless a state law applies that is more strict than HIPAA and provides additional privacy protections.</p>
    <p>I, the undersigned, authorize this release of information:</p>
    <div class="uk-child-width-1-2" uk-grid>
      <div>
        <span>Digital Signature:</span> <span class="text-underline uk-h4"><?php print $digital_signature; ?></span>
      </div>
      <div>
        <span>Date:</span> <span class="text-underline uk-h4"><?php print $digital_signature_date; ?></span>
      </div>
    </div>

    <h3 class="release-authorization-section uk-text-center">Identifying Information</h3>
    <div>
      <span>First 3 numbers of client social security #:</span> <span class="text-underline uk-h4"><?php print $client_ssn; ?></span>
    </div>
    <div>
      <span>Client Street Address #:</span> <span class="text-underline uk-h4"><?php print $client_street; ?></span>
    </div>
    <div>
      <span>Client Birth Date:</span> <span class="text-underline uk-h4"><?php print $client_dob_verify; ?></span>
    </div>

    <div class="uk-display-inline-block uk-width-1-1">
      <div class="uk-float-right"><?php print render($content['links']); ?></div>
    </div>
  </div>

</article>
