CONTENTS OF THIS FILE
---------------------
   
 * Introduction
 * Requirements
 * Installation
 * Configuration
 * Troubleshooting
 * FAQ
 * Maintainers

INTRODUCTION
------------
The Registration Validation module allows site administrators to configure
custom validation rules for the user registration form. Why would we need this?
There are plenty of modules available to thwart spam bots from successfully
registering an account on Drupal website installations, but human spammers are
a breed of their own. This module was created to add additional validation
rules for the most commonly known human spammers at one of our client's website.


 * For a full description of the module, visit the sandbox page or GitHub repo:
   https://www.drupal.org/sandbox/rbuchanan0130/2459415
   https://github.com/richardbuchanan/registration_validation


 * To submit bug reports and feature suggestions, or to track changes:
   https://www.drupal.org/project/issues/2459415
   https://github.com/richardbuchanan/registration_validation/issues

REQUIREMENTS
------------
This module does not have requirements beyond Drupal core.

INSTALLATION
------------
 * Install as you would normally install a contributed Drupal module. See:
   https://drupal.org/documentation/install/modules-themes/modules-7
   for further information.

CONFIGURATION
-------------
 * Configure user permissions in Administration » People » Permissions:


   - Administer registration validation rules


     This permission is required to perform administration tasks for how data
     should be validated when a new user creates an account using the user
     registration form.


 * Customize the validation settings in Administration » Configuration »
   People » Registration validtion.

TROUBLESHOOTING
---------------
 * If the default error message does not appear and validation fails to work as
   expected, check the following:


   - Are there any e-mail domain names entered in the "Blacklisted e-mail
     domains" textarea?


   - Are the e-mail domains entered in the "Blacklisted e-mail domains" textarea
     entered one per line?


 * If the above are true, try saving the form again and retest validation.

FAQ
---
Q: The only options available is to validate the user's e-mail domain and set
   an error message to display when validation fails. Will there be more rules
   available in the future?


A: Yes, this is a very young project that was initially created for a client.
   We do plan to add additional functionality in the future, and are seeking
   co-maintainers to join our project.

MAINTAINERS
-----------
Current maintainers:
 * Richard Buchanan (Richard Buchanan) - https://www.drupal.org/user/2638993

 We are currently seeking co-maintainers.


This project has been sponsored by:
 * Buchanan Design Group, LLC
   We specialize in consulting and planning of Drupal powered sites, and offer
   installation, development, theming, customization, and hosting
   to get you started. Visit http://www.buchanandesigngroup.com for more
   information.
