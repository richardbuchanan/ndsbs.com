jQuery(document).ready(function ($) {
  var body = $('body');
  var formWrapper = $('.panel-body');
  var formItem = $('.form-item');
  var formInput = $('.form-item input');
  var formSelect = $('.form-item select');
  var formSubmit = $('[type=submit]');
  var creditCardSubmit = $('#credit_card_submit');
  var rush = $('#rush-details');
  var rushOffset = rush.offset();
  var orderSummary = $('#order-summary');
  var orderSummaryWidth = orderSummary.outerWidth(true);
  var orderSummaryLeft = orderSummary.offset().left;

  formWrapper.each(function () {
    if ($(this).data('form-state') == 'disabled') {
      var target = $(this).data('target');

      $(target).find(formItem).addClass('form-disabled');
      $(target).find(formInput).prop('disabled', true);
      $(target).find(formSelect).prop('disabled', true);
      $(target).find(formSubmit).prop('disabled', true);
      $('#form-state-message').show();
    }
  });

  creditCardSubmit.unbind('click').bind('click', function () {
    var credit_card = $('#edit-credit-card').val();
    var cc_number = $('#edit-card-number').val();
    var expiration_month = $('#edit-expiration-month').val();
    var expiration_year = $('#edit-expiration-year').val();
    var cvv_code = $('#edit-cvv').val();

    if (credit_card == '') {
      alert('Please select your card.');
      return false;
    }
    if (cc_number == '') {
      alert('Please enter your credit card number.');
      return false;
    }

    //  Credit Card number validation function called
    if (!checkCreditCard(cc_number, credit_card)) {
      alert(ccErrors[ccErrorNo]);
      return false;
    }

    if (expiration_month == '') {
      alert('Please select your card expiration month.');
      return false;
    }

    if (expiration_year == '') {
      alert('Please select your card expiration year.');
      return false;
    }

    if (cvv_code == '') {
      alert('Please enter the card\'s CVC number.');
      return false;
    }
  });

  if (body.width() > 991) {
    //orderSummary.css('width', orderSummaryWidth);
    //orderSummary.css('left', orderSummaryLeft);
    //var offset = rushOffset.top;

    if (body.hasClass('adminimal-menu')) {
      //offset = offset - 29
    }

    /*orderSummary.affix({
      offset: {
        top: offset
      }
    });*/
  }
});