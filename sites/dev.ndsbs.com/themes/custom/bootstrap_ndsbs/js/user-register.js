jQuery(document).ready(function ($) {
  var year = $('#edit-field-year-und');

  //$('#edit-field-gender-und').find('[value="_none"]').attr('value', '').text('- Select your gender -');
  $('#edit-field-month-und').find('[value="_none"]').attr('value', '').text('- Month -');
  $('#edit-field-dobdate-und').find('[value="_none"]').attr('value', '').text('- Day -');
  year.find('[value="_none"]').attr('value', '').text('- Year -');
  $('#edit-field-state-und').find('[value="_none"]').attr('value', '').text('- State -');
  $('#edit-field-zip-und-0-value').attr('maxlength', '5');

  //$('#edit-field-middle-name-und-0-value').val('Middle Name');
  $('#edit-field-first-name-und-0-value').attr('value', '');
  $('#edit-field-last-name-und-0-value').attr('value', '');
  $('#edit-field-state-und-0-value').attr('value', '');

  //  Date of birth calculation called
  year.unbind('change').bind("change", function () {
    var date_user = $('#edit-field-dobdate-und').val();
    var month_user = $('#edit-field-month-und').val();
    var year_user = $('#edit-field-year-und').val();
    var user_age = getAge(month_user + '/' + date_user + '/' + year_user);

    if ((date_user && month_user && year_user) && user_age > 0) {
      $('#user-dob').show().html('Your are ' + user_age + ' years old.');
    }
    else {
      $('#user-dob').hide();
    }
  });

  $('#edit-submit').attr('disabled', 'disabled').after('<small class="help-block edit-submit-help" style="display: none; clear: both;">WARNING: You must agree to the Terms of Use to continue.</small>');
  //$('#edit-submit').attr('disabled', 'disabled').after('<br><br><p class="help-block edit-submit-help" style="display: none;">WARNING: You must agree to the Terms of Use to continue.</p>');
  $('[value="I do not agree with NDSBS Terms of Use"]').prop('checked', true);
  $('.edit-submit-help').show();
  var required = $('.required');

  // Terms of use acceptance.
  $('.field-name-field-terms-of-use .radio input[name="field_terms_of_use[und]"]').click(function() {
    if ($(this).attr('value') == 'I agree with NDSBS Terms of Use') {
      required.each(function() {
        if ($(this).val()) {
          $('.edit-submit-help').hide();
          $('#edit-submit').removeAttr('disabled');
        }
      });
    }
    else {
      $('.edit-submit-help').show();
      $('#edit-submit').attr('disabled', '');
    }
  });

  // Reason for assessment.
  var checkedOne = false;
  var checkedTwo = false;
  var checkedThree = false;

  $('#edit-field-reason-for-assessment-und-0').change(function() {
    checkedOne = this.checked ? true : false;
    forCourts(checkedOne, checkedTwo, checkedThree);
  });
  $('#edit-field-reason-for-assessment-und-1').change(function() {
    checkedTwo = this.checked ? true : false;
    forCourts(checkedOne, checkedTwo, checkedThree);
  });
  $('#edit-field-reason-for-assessment-und-2').change(function() {
    checkedThree = this.checked ? true : false;
    forCourts(checkedOne, checkedTwo, checkedThree);
  });

  // Enable for courts.
  function forCourts(first, second, third) {
    var forCourts = $('.field-name-field-for-courts');
    if (first || second || third) {
      forCourts.show();
    }
    else {
      forCourts.hide();
    }
  }

  $('#edit-field-reason-for-assessment-und-3').change(function() {
    var checkedProbation = !!this.checked;
    forProbation(checkedProbation);
  });

  // Enable for probation.
  function forProbation(first) {
    var forProbation = $('.field-name-field-for-probation');
    if (first) {
      forProbation.show();
    }
    else {
      forProbation.hide();
    }
  }

  // Form validation.
  $('#user-register-form').formValidation({
    framework: 'bootstrap',
    icon: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      'field_first_name[und][0][value]': {
        row: '.form-item-field-first-name-und-0-value',
        validators: {
          notEmpty: {
            message: 'Please enter your first name.'
          }
        }
      },
      'field_last_name[und][0][value]': {
        row: '.form-item-field-last-name-und-0-value',
        validators: {
          notEmpty: {
            message: 'Please enter your last name.'
          }
        }
      },
      'mail': {
        validators: {
          notEmpty: {
            message: 'Please enter your email address.'
          },
          emailAddress: {
            message: 'Please enter a valid email address.'
          }
        }
      },
      'conf_mail': {
        validators: {
          notEmpty: {
            message: 'Please confirm your email address.'
          },
          emailAddress: {
            message: 'Please enter a valid email address.'
          }
        }
      },
      'pass[pass1]': {
        enabled: false
      },
      'pass[pass2]': {
        enabled: false
      },
      'field_month[und]': {
        row: '.form-item-field-month-und',
        validators: {
          notEmpty: {
            message: 'Select a month.'
          }
        }
      },
      'field_dobdate[und]': {
        row: '.form-item-field-dobdate-und',
        validators: {
          notEmpty: {
            message: 'Select a day.'
          }
        }
      },
      'field_year[und]': {
        row: '.form-item-field-year-und',
        validators: {
          notEmpty: {
            message: 'Select a year.'
          }
        }
      },
      'field_address[und][0][value]': {
        row: '.form-item-field-address-und-0-value',
        validators: {
          notEmpty: {
            message: 'Please enter your street.'
          }
        }
      },
      'field_city[und][0][value]': {
        row: '.form-item-field-city-und-0-value',
        validators: {
          notEmpty: {
            message: 'Please enter your city.'
          }
        }
      },
      'field_state[und]': {
        row: '.form-item-field-state-und',
        validators: {
          notEmpty: {
            message: 'Please select your state.'
          }
        }
      },
      'field_zip[und][0][value]': {
        row: '.form-item-field-zip-und-0-value',
        validators: {
          notEmpty: {
            message: 'Please enter your zip code.'
          },
          stringLength: {
            min: '5',
            max: '5',
            message: 'Please enter a valid zip code.'
          },
          integer: {
            message: 'A zip code can only contain numbers.',
            thousandsSeparator: '',
            decimalSeparator: ''
          }
        }
      },
      'field_referred_by[und]': {
        enabled: false
      },
      'field_reason_for_assessment[und][0]': {
        enabled: false
      },
      'field_reason_for_assessment[und][1]': {
        enabled: false
      },
      'field_reason_for_assessment[und][2]': {
        enabled: false
      },
      'field_reason_for_assessment[und][3]': {
        enabled: false
      },
      'field_reason_for_assessment[und][4]': {
        enabled: false
      },
      'field_reason_for_assessment[und][5]': {
        enabled: false
      },
      'field_reason_for_assessment[und][6]': {
        enabled: false
      },
      'field_phone[und][0][value]': {
        enabled: false
      },
      'field_second_phone[und][0][value]': {
        enabled: false
      }
    }
  });
});


//  Function defined to calculate the age of the Client
function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}