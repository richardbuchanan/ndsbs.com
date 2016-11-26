<?php

/**
 * @file
 * Theme implementation of the site-wide FAQ page.
 */
?>

<div id="page-container">
<?php include('includes/top-header.inc'); ?>
<?php include('includes/sub-header.inc'); ?>
<?php include('includes/highlights.inc'); ?>
  <section id="content-section" class="clearfix sub-header-padding">
    <a id="main-content"></a>
    <?php include('includes/admin-actions.inc'); ?>
    <div id="content">
      <article id="page-content">
        <?php global $base_url;
          drupal_add_library('system', 'drupal.collapse'); ?>
        <div id="node-faq" class="node clearfix"<?php print $attributes; ?>>
          <div class="content"<?php print $content_attributes; ?>>
            <div class="content-wrap">
              <h1>FAQs</h1>
              <fieldset class=" collapsible collapsed">
                <legend><span class="fieldset-legend"><h2>How does an online assessment work?</h2></span></legend>
                <div class="fieldset-wrapper"> <span>Online assessments require 5 steps to complete:</span>
                  <ul>
                    <li>get started/ register - directly online or call our office</li>
                    <li>completion of our online questionnaire (average 15 minutes)</li>
                    <li>complete an interview with an evaluator by secure webcam or in- person (45-50 min.)</li>
                    <li>provide your evaluator with necessary documents for your situation (upload, email or fax)</li>
                    <li>receive a court ready report in your secure account</li>
                  </ul>
                </div>
              </fieldset>
              <fieldset class=" collapsible collapsed">
                <legend><span class="fieldset-legend"><h2>How much will my assessment cost?</h2></span></legend>
                <div class="fieldset-wrapper">
                  <p>Click on the assessment drop down menu to find the appropriate assessment for your situation and the fee. Rush order fees vary according to the completion timeframe you request. Speak with our customer service representative to discuss a rush order.</p>
                </div>
              </fieldset>
              <fieldset class=" collapsible collapsed">
                <legend><span class="fieldset-legend"><h2>Will my health insurance reimburse or pay for an assessment or counseling?</h2></span></legend>
                <div class="fieldset-wrapper">
                  <h3>Online Assessments</h3>
                  <p>Insurance companies generally will not pay for or reimburse you for services obtained online. Check with your plan administrator to find out if you can submit your expenses for reimbursement from your Health Savings Account.</p>
                  <h3>In-Person Assessments</h3>
                  <p>OhioDUIeval.com is not contracted as an in-network provider with any insurance company. Some out-of-network plans will reimburse you for our services. We encourage you to call your insurance company to find out what benefits you are eligible for. Regardless of your plan, you will need to pay the fee prior to receiving services. You can obtain an insurance receipt for in-person services and submit it to your HSA or insurance company for reimbursement according to the terms of your specific plan.</p>
                </div>
              </fieldset>
              <fieldset class=" collapsible collapsed">
                <legend>
                  <span class="fieldset-legend"><h2>What are the advantages of online service as compared to in-person service?</h2></span>
                </legend>
                <div class="fieldset-wrapper"> <span>Assessments conducted online provide multiple benefits:</span>
                  <ul>
                    <li>in case your driver’s license has been suspended you can obtain a professional assessment completely you’re your home</li>
                    <li>avoid traffic jams, save time and fuel expense</li>
                    <li>the ultimate in privacy, as users do not need to enter a mental health facility and all service is provided via encrypted and secure electronic connections.</li>
                    <li>assessments can be completed in a short timeframe. Our customer service model is built upon our ability to provide an approved professional report when you need it.</li>
                  </ul>
                </div>
              </fieldset>
              <fieldset class=" collapsible collapsed">
                <legend>
                  <span class="fieldset-legend"><h2>Can I find out before paying for my assessment if it will be accepted?</h2></span>
                </legend>
                <div class="fieldset-wrapper">
                  <p>Our assessments are accepted in nearly all cases because requesting parties (courts, employers, schools, etc.) can clearly see from our high quality reporting quality that you obtained a professional and meaningful assessment. In rare cases a court or employer will insist that the evaluation be performed by their own evaluator. If you are concerned about acceptance we recommend you first speak directly to the requesting authority that is asking for the assessment. If they wish to call us before you begin services with us we will be happy to discuss our credentials, experience and provide professional references to them. Once they understand the extent of our capability we rarely have an assessment turned down. You can also refer them to our <a href="http://ohioduieval.com/legal" target="_blank">legal</a> information pages for detailed information if they prefer to look us up online.</p>
                </div>
              </fieldset>
              <fieldset class=" collapsible collapsed">
                <legend>
                  <span class="fieldset-legend"><h2>Will you send the assessment report directly to me when it is completed?</h2></span>
                </legend>
                <div class="fieldset-wrapper">
                  <p>Your evaluation will be available online in your secure account once your evaluator has it completed. This eliminates the risk of someone finding or accessing your assessment in your email account. From your account you can access your report and then forward to the person of your choice.</p>
                </div>
              </fieldset>
              <fieldset class=" collapsible collapsed">
                <legend>
                  <span class="fieldset-legend"><h2>Will my fees be refunded if my assessment is not accepted?</h2></span>
                </legend>
                <div class="fieldset-wrapper">
                  <p>Fees are refundable when requesting parties will not accept our assessment. Some limits and exceptions apply. Please read our <a href="#">refund</a> policy carefully before requesting a refund.</p>
                </div>
              </fieldset>
              <fieldset class=" collapsible collapsed">
                <legend>
                  <span class="fieldset-legend"><h2>Do you have references that I can check before I decide whether to register for an assessment?</h2></span>
                </legend>
                <div class="fieldset-wrapper">
                  <p>Yes. Please contact us by phone and we will be happy to provide you with professional references.</p>
                </div>
              </fieldset>
              <fieldset class=" collapsible collapsed">
                <legend>
                  <span class="fieldset-legend"><h2>Will you help me complete my state BMV/DMV forms?</h2></span>
                </legend>
                <div class="fieldset-wrapper">
                  <p>Yes. Many states require that portions of the paperwork be completed by the substance abuse evaluator while other portions can only be completed by you. We will assist you in any way we can. Speak with your evaluator about the exact fee for your state forms.</p>
                </div>
              </fieldset>
              <fieldset class=" collapsible collapsed">
                <legend>
                  <span class="fieldset-legend"><h2>I need my assessment quickly, can you meet my deadline?</h2></span>
                </legend>
                <div class="fieldset-wrapper">
                  <p>We provide rush order services for an additional fee. If you need your assessment quickly, please contact us first to assure that we can provide you with the full service by the date you need.</p>
                </div>
              </fieldset>
              <fieldset class=" collapsible collapsed">
                <legend>
                  <span class="fieldset-legend"><h2>What payment methods do you accept?</h2></span>
                </legend>
                <div class="fieldset-wrapper">
                  <p>We accept PayPal and major credit cards (online or over the phone).</p>
                </div>
              </fieldset>
              <fieldset class=" collapsible collapsed">
                <legend>
                  <span class="fieldset-legend"><h2>Will my information be kept private?</h2></span>
                </legend>
                <div class="fieldset-wrapper">
                  <p>OhioDUIeval recognizes the legal and ethical importance of keeping client records private and confidential. Please read our <a href="http://ohioduieval.com/terms-conditions" target="_blank">Consent for Service and Terms of Agreement</a> for a detailed description of our privacy terms, including limits to confidentiality as governed by federal law. In addition:</p>
                  <ul>
                    <li>- all records are stored on SSL encrypted servers</li>
                    <li>- account passwords are set to health industry standards to include appropriate length and sufficient variation in characters to minimize chances of access by any third party</li>
                    <li>- paper records are in locked cabinets in our offices</li>
                    <li>- - sessions conducted via webcam/video are not recorded by OhioDUIeval.com</li>
                    <li>- OhioDUIeval.com is a division of Directions Counseling Group, Inc.; which has a 20 year history of providing professional assessments and counseling without complaints or legal actions for privacy or ethical violations of any kind. We are also members of the Better Business Bureau and hold an A+ rating.</li>
                  </ul>
                </div>
              </fieldset>
              <fieldset class=" collapsible collapsed">
                <legend>
                  <span class="fieldset-legend"><h2>Will the treatment centers and alcohol/drug education programs in my area accept an OhioDUIeval.com assessment?</h2></span>
                </legend>
                <div class="fieldset-wrapper">
                  <p>Every treatment center and program determines their own policy regarding the acceptance of assessments done by a third party. If you have a concern about this please speak with the center or program you are considering working with. They may also contact us directly for more detailed information and professional references.</p>
                </div>
              </fieldset>
              <fieldset class=" collapsible collapsed">
                <legend>
                  <span class="fieldset-legend"><h2>What documents would I need to provide my evaluator for an online assessment?</h2></span>
                </legend>
                <div class="fieldset-wrapper">
                  <p>Necessary documents for your situation will depend on your case. Your evaluator will determine what is needed after completing the interview. Possible documents needed for a professional report are: police report, BMV history, collateral questionnaire completed by someone who knows you well.</p>
                </div>
              </fieldset>
              <fieldset class=" collapsible collapsed">
                <legend>
                  <span class="fieldset-legend"><h2>How do I get a copy of my police report?</h2></span>
                </legend>
                <div class="fieldset-wrapper">
                  <p>Contact your attorney or the court clerk to make this request.</p>
                </div>
              </fieldset>
              <fieldset class=" collapsible collapsed">
                <legend>
                  <span class="fieldset-legend"><h2>Will the court, DMV/BMV or my employer accept an assessment completed online?</h2></span>
                </legend>
                <div class="fieldset-wrapper">
                  <p>Our professional reputation has been built on providing thorough, timely and professional reports to our clients. Our online assessments are regularly accepted by judges, attorneys, probation officers, large corporations, and government agencies. If you have a concern about your assessment being accepted please email or call us to discuss your situation so that we can advise you before beginning your assessment.</p>
                </div>
              </fieldset>
            </div>
            <div id="faq-pre-footer-wrap">
              <div class="content-wrap">
                <h6>Still have questions? <a href="/contact">Get in Touch</a></h6>
              </div>
            </div>
          </div>
        </div>
        <div id="page-count">
        <?php //$total = ohio_dui_get_node_count('product'); ?>
        <?php //$total += ohio_dui_get_node_count('page'); ?>
        <?php //$total += ohio_dui_get_node_count('client_report'); ?>
        <?php //$total += ohio_dui_get_node_count('interview_request'); ?>
        <?php //$total += ohio_dui_get_node_count('necessary_document'); ?>
        <?php //$total += ohio_dui_get_node_count('refund_request'); ?>
        <?php //$total += ohio_dui_get_node_count('webform'); ?>
        <!-- <p>Total Number of pages are <b><?php //print $total; ?></b></p></div> -->
      </article>
    </div>
  </section>
  <?php include('includes/footer.inc'); ?>
</div>
