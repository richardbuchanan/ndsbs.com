<?php

/**
 * @file
 * Examples page to demonstrate UIkit components.
 */
?>
<div id="examples" class="uk-child-width-1-1@m" uk-grid active-color-scheme="default">
  <div>
    <p class="uk-text-lead">Select a color scheme to preview that scheme with common components.</p>
    <button class="uk-button uk-button-primary" type="button">Color Schemes</button>
    <div class="color-scheme-dropdown" uk-dropdown="mode: click">
      <ul class="uk-nav uk-dropdown-nav">
        <li><a href="" color-scheme="default"><span style="margin-right: 10px;padding:0 8px;background-color:#1e87f0"></span>Default</a></li>
        <li><a href="" color-scheme="alt-one"><span style="margin-right: 10px;padding:0 8px;background-color:#5faaf2"></span>Alternative one</a></li>
        <li><a href="" color-scheme="alt-two"><span style="margin-right: 10px;padding:0 8px;background-color:#5a8fc3"></span>Alternative two</a></li>
        <li><a href="" color-scheme="alt-three"><span style="margin-right: 10px;padding:0 8px;background-color:#356089"></span>Alternative three</a></li>
        <li><a href="" color-scheme="alt-four"><span style="margin-right: 10px;padding:0 8px;background-color:#2a4d6e"></span>Alternative four</a></li>
        <li><a href="" color-scheme="alt-five"><span style="margin-right: 10px;padding:0 8px;background-color:#0c5aa6"></span>Alternative five</a></li>
      </ul>
    </div>
  </div>
  <div>
    <h2>Homepage</h2>
    <div id="header-below">

      <div id="region-header-wrapper" class="region-wrapper uk-grid uk-grid-stack" uk-grid="">
        <div id="region-header" class="uk-width-1-1 uk-position-relative uk-first-column">
          <div id="block-views-homepage-switcher-block" class="block block-views contextual-links-region uk-width-1-1 uk-width-1-2@m uk-width-2-5@l ie9-gradient">

            <h2 class="block-title">America's <span class="highlight">Trusted Court </span><wbr><span class="highlight">Assessment</span> Service</h2>
            <div class="content">
              <div class="view view-homepage-switcher view-id-homepage_switcher view-display-id-block view-dom-id-172c7c3d2c49b5ff10247c6a76541f6b">

                <ul id="assessments-switcher" class="uk-switcher">
                  <li class="uk-active">
                    <div class="uk-width-1-1 switcher-left">

                      <div class="uk-flex uk-flex-center">
                        <button class="uk-button uk-button-default" type="button" uk-toggle="target: #switcher-modal-0">Alcohol Assessments</button>

                        <div id="switcher-modal-0" uk-modal="center: true" class="uk-modal">
                          <div class="uk-modal-dialog uk-modal-body">
                            <button class="uk-modal-close-default uk-close uk-icon" type="button" uk-close="">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" ratio="1">
                                <line fill="none" stroke="#000" stroke-width="1.1" x1="1" y1="1" x2="13" y2="13"></line>
                                <line fill="none" stroke="#000" stroke-width="1.1" x1="13" y1="1" x2="1" y2="13"></line>
                              </svg>
                            </button>
                            <h2 class="uk-modal-title">Alcohol Assessments</h2>
                            <p>SELECT ASSESSMENT TYPE</p>
                            <ul>
                              <li>
                                <a href="/assessment/alcohol-assessment">Basic Alcohol Assessment</a>
                              </li>
                              <li>
                                <a href="/assessment/dui-alcohol-assessment-0">DUI Alcohol Assessment</a>
                              </li>
                              <li>
                                <a href="/assessment/underageminor-possession-assessment">Underage/Minor Possession</a>
                              </li>
                            </ul>
                          </div>
                        </div>

                      </div>
                      <div class="uk-flex uk-flex-center uk-margin">
                        <button class="uk-button uk-button-default" type="button" uk-toggle="target: #switcher-modal-1">Drug and Alcohol Assessments</button>

                        <div id="switcher-modal-1" uk-modal="center: true" class="uk-modal">
                          <div class="uk-modal-dialog uk-modal-body">
                            <button class="uk-modal-close-default uk-close uk-icon" type="button" uk-close="">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" ratio="1">
                                <line fill="none" stroke="#000" stroke-width="1.1" x1="1" y1="1" x2="13" y2="13"></line>
                                <line fill="none" stroke="#000" stroke-width="1.1" x1="13" y1="1" x2="1" y2="13"></line>
                              </svg>
                            </button>
                            <h2 class="uk-modal-title">Drug and Alcohol Assessments</h2>
                            <p>SELECT ASSESSMENT TYPE</p>
                            <ul>
                              <li>
                                <a href="/assessment/general-drug-alcohol-assessment">General Drug and Alcohol Assessment</a>
                              </li>
                              <li>
                                <a href="/assessment/child-custody-alcohol-assessment">Child Custody Alcohol Assessment</a>
                              </li>
                              <li>
                                <a href="/assessment/child-custody-drug-alcohol-assessment">Child Custody Drug &amp; Alcohol Assessment</a>
                              </li>
                              <li>
                                <a href="/assessment/nursing-professionals-substance-assessment-0">Nursing &amp; Professionals Substance Assessment</a>
                              </li>
                            </ul>
                          </div>
                        </div>

                      </div>
                      <div class="uk-flex uk-flex-center uk-margin">
                        <a href="/assessment/general-mental-health-assessment" class="uk-button uk-button-default">Mental Health Assessment</a>

                      </div>
                      <div class="uk-flex uk-flex-center uk-margin">
                        <a href="/assessment/anger-management-evaluation" class="uk-button uk-button-default">Anger Management Assessment</a>

                      </div>

                    </div>
                  </li>
                </ul>

                <div id="state-acceptance" class="uk-margin-top">
                  <hr style="border-top-width:3px;">
                  <h3 class="uk-margin-top">Not Sure About Acceptance in Your State?</h3>
                  <a href="/state-map" class="uk-display-inline-block">
                    <span class="uk-margin-small-right uk-icon" uk-icon="icon: world"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" ratio="1"><path fill="none" stroke="#000" d="M1,10.5 L19,10.5"></path><path fill="none" stroke="#000" d="M2.35,15.5 L17.65,15.5"></path><path fill="none" stroke="#000" d="M2.35,5.5 L17.523,5.5"></path><path fill="none" stroke="#000" d="M10,19.46 L9.98,19.46 C7.31,17.33 5.61,14.141 5.61,10.58 C5.61,7.02 7.33,3.83 10,1.7 C10.01,1.7 9.99,1.7 10,1.7 L10,1.7 C12.67,3.83 14.4,7.02 14.4,10.58 C14.4,14.141 12.67,17.33 10,19.46 L10,19.46 L10,19.46 L10,19.46 Z"></path><circle fill="none" stroke="#000" cx="10" cy="10.5" r="9"></circle></svg></span>
                    <span style="vertical-align:middle">Check My State</span>
                  </a>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <hr class="uk-divider-icon">
  </div>

  <div>
    <h2>Alert</h2>
    <div uk-alert>
      <a class="uk-alert-close" uk-close></a>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    </div>

    <div class="uk-alert-primary" uk-alert>
      <a class="uk-alert-close" uk-close></a>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
    </div>

    <div class="uk-alert-success" uk-alert>
      <a class="uk-alert-close" uk-close></a>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
    </div>

    <div class="uk-alert-warning" uk-alert>
      <a class="uk-alert-close" uk-close></a>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
    </div>

    <div class="uk-alert-danger" uk-alert>
      <a class="uk-alert-close" uk-close></a>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
    </div>

    <hr class="uk-divider-icon">
  </div>

  <div>
    <h2>Badge</h2>
    <span class="uk-badge">1</span> <span class="uk-badge">100</span>

    <hr class="uk-divider-icon">
  </div>

  <div>
    <h2>Button</h2>
    <p uk-margin>
      <button class="uk-button uk-button-default">Default</button>
      <button class="uk-button uk-button-primary">Primary</button>
      <button class="uk-button uk-button-secondary">Secondary</button>
      <button class="uk-button uk-button-danger">Danger</button>
      <button class="uk-button uk-button-text">Text</button>
      <button class="uk-button uk-button-link">Link</button>
      <button class="uk-button uk-button-default" disabled>Disabled</button>
    </p>

    <hr class="uk-divider-icon">
  </div>

  <div>
    <h2>Card</h2>
    <div class="uk-child-width-1-3@m uk-grid-small uk-grid-match" uk-grid>
      <div>
        <div class="uk-card uk-card-default uk-card-body">
          <h3 class="uk-card-title">Default</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        </div>
      </div>
      <div>
        <div class="uk-card uk-card-primary uk-card-body">
          <h3 class="uk-card-title">Primary</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        </div>
      </div>
      <div>
        <div class="uk-card uk-card-secondary uk-card-body">
          <h3 class="uk-card-title">Secondary</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        </div>
      </div>
    </div>

    <hr class="uk-divider-icon">
  </div>

  <div>
    <h2>Comment</h2>
    <ul class="uk-comment-list">
      <li>
        <article class="uk-comment uk-visible-toggle">
          <header class="uk-comment-header uk-position-relative">
            <div class="uk-grid-medium uk-flex-middle" uk-grid>
              <div class="uk-width-auto">
                <img class="uk-comment-avatar" src="https://getuikit.com/docs/images/avatar.jpg" width="80" height="80" alt="">
              </div>
              <div class="uk-width-expand">
                <h4 class="uk-comment-title uk-margin-remove">
                  <a class="uk-link-reset" href="">Author</a></h4>
                <p class="uk-comment-meta uk-margin-remove-top">
                  <a class="uk-link-reset" href="">12 days ago</a></p>
              </div>
            </div>
            <div class="uk-position-top-right uk-position-small uk-hidden-hover">
              <a class="uk-link-muted" href="">Reply</a></div>
          </header>
          <div class="uk-comment-body">
            <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
          </div>
        </article>
        <ul>
          <li>
            <article class="uk-comment uk-comment-primary uk-visible-toggle">
              <header class="uk-comment-header uk-position-relative">
                <div class="uk-grid-medium uk-flex-middle" uk-grid>
                  <div class="uk-width-auto">
                    <img class="uk-comment-avatar" src="https://getuikit.com/docs/images/avatar.jpg" width="80" height="80" alt="">
                  </div>
                  <div class="uk-width-expand">
                    <h4 class="uk-comment-title uk-margin-remove">
                      <a class="uk-link-reset" href="">Author</a></h4>
                    <p class="uk-comment-meta uk-margin-remove-top">
                      <a class="uk-link-reset" href="">12 days ago</a></p>
                  </div>
                </div>
                <div class="uk-position-top-right uk-position-small uk-hidden-hover">
                  <a class="uk-link-muted" href="">Reply</a></div>
              </header>
              <div class="uk-comment-body">
                <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
              </div>
            </article>
          </li>
        </ul>
      </li>
    </ul>

    <hr class="uk-divider-icon">
  </div>

  <div>
    <h2>Label</h2>
    <span class="uk-label">Default</span>
    <span class="uk-label uk-label-success">Success</span>
    <span class="uk-label uk-label-warning">Warning</span>
    <span class="uk-label uk-label-danger">Danger</span>

    <hr class="uk-divider-icon">
  </div>

  <div>
    <h2>Pagination</h2>
    <ul class="uk-pagination uk-flex-center" uk-margin>
      <li><a href=""><span uk-pagination-previous></span></a></li>
      <li><a href="">1</a></li>
      <li class="uk-disabled"><span>...</span></li>
      <li><a href="">5</a></li>
      <li><a href="">6</a></li>
      <li class="uk-active"><span>7</span></li>
      <li><a href="">8</a></li>
      <li><a href=""><span uk-pagination-next></span></a></li>
    </ul>

    <hr class="uk-divider-icon">
  </div>

  <div>
    <h2>Progress</h2>
    <progress id="progressbar" class="uk-progress" value="10" max="100"></progress>

    <hr class="uk-divider-icon">
  </div>

  <div>
    <h2>Section</h2>
    <div class="uk-section uk-section-default">
      <div class="uk-container uk-margin">
        <h3>Section Default</h3>
        <div class="uk-grid-match uk-child-width-1-3@m" uk-grid>
          <div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
          </div>
          <div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
          </div>
          <div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
          </div>
        </div>

      </div>
    </div>

    <div class="uk-section uk-section-muted uk-margin">
      <div class="uk-container">
        <h3>Section Muted</h3>
        <div class="uk-grid-match uk-child-width-1-3@m" uk-grid>
          <div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
          </div>
          <div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
          </div>
          <div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
          </div>
        </div>

      </div>
    </div>

    <div class="uk-section uk-section-primary uk-light uk-margin">
      <div class="uk-container">
        <h3>Section Primary</h3>
        <div class="uk-grid-match uk-child-width-1-3@m" uk-grid>
          <div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
          </div>
          <div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
          </div>
          <div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
          </div>
        </div>

      </div>
    </div>

    <div class="uk-section uk-section-secondary uk-light uk-margin">
      <div class="uk-container">
        <h3>Section Secondary</h3>
        <div class="uk-grid-match uk-child-width-1-3@m" uk-grid>
          <div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
          </div>
          <div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
          </div>
          <div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
          </div>
        </div>

      </div>
    </div>

    <div class="uk-section uk-section-media uk-light uk-background-cover uk-margin" style="background-image: url(https://getuikit.com/docs/images/dark.jpg)">
      <div class="uk-container">
        <h3>Section Media</h3>
        <div class="uk-grid-match uk-child-width-1-3@m" uk-grid>
          <div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
          </div>
          <div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
          </div>
          <div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
          </div>
        </div>
      </div>
    </div>

    <hr class="uk-divider-icon">
  </div>

  <div>
    <h2>Subnav</h2>
    <ul class="uk-subnav" uk-margin>
      <li class="uk-active"><a href="">Active</a></li>
      <li><a href="">Item</a></li>
      <li><a href="">Item</a></li>
      <li><span>Disabled</span></li>
    </ul>

    <h3>Divider Modifier</h3>
    <ul class="uk-subnav uk-subnav-divider" uk-margin>
      <li class="uk-active"><a href="">Active</a></li>
      <li><a href="">Item</a></li>
      <li><a href="">Item</a></li>
    </ul>

    <h3>Pill Modifier</h3>
    <ul class="uk-subnav uk-subnav-pill" uk-margin>
      <li class="uk-active"><a href="">Active</a></li>
      <li><a href="">Item</a></li>
      <li><a href="">Item</a></li>
    </ul>

    <hr class="uk-divider-icon">
  </div>

  <div>
    <h2>Switcher</h2>
    <ul class="uk-subnav uk-subnav-pill" uk-switcher>
      <li><a href="">Item</a></li>
      <li><a href="">Item</a></li>
      <li><a href="">Item</a></li>
    </ul>
    <ul class="uk-switcher uk-margin">
      <li>Hello!</li>
      <li>Hello again!</li>
      <li>Bazinga!</li>
    </ul>

    <h3>Switcher with Tab</h3>
    <ul uk-tab>
      <li><a href="">Item</a></li>
      <li><a href="">Item</a></li>
      <li><a href="">Item</a></li>
    </ul>
    <ul class="uk-switcher uk-margin">
      <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
      <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
      <li>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur, sed do eiusmod.</li>
    </ul>

    <h3>Switcher and Nav</h3>
    <div uk-grid>
      <div class="uk-width-small@m">
        <ul class="uk-nav uk-nav-default" uk-switcher="connect: #component-nav; animation: uk-animation-fade; toggle: > :not(.uk-nav-header)">
          <li><a href="">Active</a></li>
          <li><a href="">Item</a></li>
          <li><a href="">Item</a></li>
        </ul>
      </div>
      <div class="uk-width-expand@m">
        <ul id="component-nav" class="uk-switcher">
          <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
          <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
          <li>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur, sed do eiusmod.</li>
        </ul>
      </div>
    </div>

    <hr class="uk-divider-icon">
  </div>

  <div>
    <h2>Tab</h2>
    <ul uk-tab>
      <li class="uk-active"><a href="">Left</a></li>
      <li><a href="">Item</a></li>
      <li><a href="">Item</a></li>
      <li class="uk-disabled"><a href="">Disabled</a></li>
    </ul>

    <h3>Bottom Modifier</h3>
    <ul class="uk-tab-bottom" uk-tab>
      <li class="uk-active"><a href="">Left</a></li>
      <li><a href="">Item</a></li>
      <li><a href="">Item</a></li>
    </ul>

    <h3>Left/Right Modifier</h3>
    <div class="uk-child-width-1-2@s" uk-grid>
      <div>
        <ul class="uk-tab-left" uk-tab>
          <li class="uk-active"><a href="">Left</a></li>
          <li><a href="">Item</a></li>
          <li><a href="">Item</a></li>
        </ul>
      </div>
      <div>
        <ul class="uk-tab-right" uk-tab>
          <li class="uk-active"><a href="">Right</a></li>
          <li><a href="">Item</a></li>
          <li><a href="">Item</a></li>
        </ul>
      </div>
    </div>

    <h3>Center</h3>
    <div class="uk-margin-medium-top">
      <ul class="uk-flex-center" uk-tab>
        <li class="uk-active"><a href="">Center</a></li>
        <li><a href="">Item</a></li>
        <li><a href="">Item</a></li>
      </ul>
    </div>

    <h3>Right</h3>
    <div>
      <ul class="uk-flex-right" uk-tab>
        <li class="uk-active"><a href="">Right</a></li>
        <li><a href="">Item</a></li>
        <li><a href="">Item</a></li>
      </ul>
    </div>

    <h3>Justify</h3>
    <div>
      <ul class="uk-child-width-expand" uk-tab>
        <li class="uk-active"><a href="">Justify</a></li>
        <li><a href="">Item</a></li>
        <li><a href="">Item</a></li>
        <li><a href="">Item</a></li>
      </ul>
    </div>

    <hr class="uk-divider-icon">
  </div>

  <div>
    <h2>Table</h2>
    <table class="uk-table uk-table-divider uk-table-striped uk-table-hover">
      <caption>Table Caption</caption>
      <thead>
      <tr>
        <th>Table Heading</th>
        <th>Table Heading</th>
        <th>Table Heading</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>Table Data</td>
        <td>Table Data</td>
        <td>Table Data</td>
      </tr>
      <tr>
        <td>Table Data</td>
        <td>Table Data</td>
        <td>Table Data</td>
      </tr>
      <tr>
        <td>Table Data</td>
        <td>Table Data</td>
        <td>Table Data</td>
      </tr>
      </tbody>
    </table>

    <hr class="uk-divider-icon">
  </div>

  <div>
    <h2>Tile</h2>
    <div class="uk-child-width-1-2@s uk-grid-collapse uk-text-center" uk-grid>
      <div>
        <div class="uk-tile uk-tile-default">
          <p class="uk-h4">Default</p>
        </div>
      </div>
      <div>
        <div class="uk-tile uk-tile-muted">
          <p class="uk-h4">Muted</p>
        </div>
      </div>
      <div>
        <div class="uk-tile uk-tile-primary">
          <p class="uk-h4">Primary</p>
        </div>
      </div>
      <div>
        <div class="uk-tile uk-tile-secondary">
          <p class="uk-h4">Secondary</p>
        </div>
      </div>
    </div>

    <hr class="uk-divider-icon">
  </div>

  <div>
    <h2>Text</h2>
    <h3>Text Lead</h3>
    <p class="uk-text-lead">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

    <h3>Text Small</h3>
    <p class="uk-text-small">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

    <h3>Text Large</h3>
    <p class="uk-text-large">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

    <h3>Text Bold</h3>
    <p class="uk-text-bold">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

    <h3>Text Uppercase</h3>
    <p class="uk-text-uppercase">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

    <h3>Text Capitalize</h3>
    <p class="uk-text-capitalize">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

    <h3>Text Lowercase</h3>
    <p class="uk-text-lowercase">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

    <h3>Text Muted</h3>
    <p class="uk-text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

    <h3>Text Primary</h3>
    <p class="uk-text-primary">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

    <h3>Text Success</h3>
    <p class="uk-text-success">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

    <h3>Text Warning</h3>
    <p class="uk-text-warning">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

    <h3>Text Danger</h3>
    <p class="uk-text-danger">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  </div>

</div>
