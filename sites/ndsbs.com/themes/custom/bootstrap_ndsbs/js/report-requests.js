jQuery(document).ready(function ($) {
  $('.saveintocartcls').change(function () {
    //  alert(this.value);
    var postdata = this.value;
    var data = postdata.split("|");
    var notary_status = data[0];
    var cart_id = data[1];
    var service_amount = data[2];
    var notary_amount = data[3];
    ajaxRequest(notary_status, cart_id, service_amount, notary_amount);
  });

  //  function called to save the shipping data
  $('#makepaymentnow').unbind('click');
  $('#makepaymentnow').bind('click', function () {
    var shipping;
    //var address = $('#shippingaddress').val();
    var adrs = $('#edit-user-shipping-address').val();
    var cty = $('#edit-user-shipping-city').val();
    var state = $('#edit-user-shipping-state').val();
    var zip = $('#edit-user-shipping-zip').val();
    //  Concatenate the complete address
    var address = adrs + ' ' + cty + ' ' + state + ' ' + zip;
    //alert(address);

    var shipMethod = $('#shipping_method').val();

    //  Original Service
    var original_service = $('#get_main_reports').val();

    /*
     if(original_service == '') {
     alert('Please select Original Service.');
     return false;
     }
     */

    if ($('#shipping_method').is(":checked")) {
      if (address == '') {
        alert('Please enter shipping address.');
        return false;
      } else {
        shipping = 1;
      }
    } else {
      //alert('Please select shipping method.');
      //return false;
      shipping = 0;
    }

    makeAjaxRequest(address, shipping);
  });// Bind function closed

  //  Hide the dropdown Primary Service Dropdown
  $('.form-item-get-main-reports').hide();

});// Main function closed

function ajaxRequest(notary_status, cart_id, service_amount, notary_amount) {
  // Fire the ajax request
  $.ajax({
    url: '<?php print $base_url;  ?>/reports/terminfo',
    type: 'post',
    data: {
      notary_status: notary_status,
      cart_id: cart_id,
      service_amount: service_amount,
      notary_amount: notary_amount
    },
    success: function (response) {
      //alert(response);
      var response_data = $.parseJSON(response);
      var subamount = response_data.sub_total;
      var amount = response_data.total;
      $('#sub_current_amount' + cart_id).html(subamount + '.00');
      $('#total_amount_id').html(amount + '.00');
      //  alert(subamount);
      //  alert(amount);
    }
  });//  Ajax function closed
}

//  Function used in for saving the shipping adddress
function makeAjaxRequest(address, shipping) {
  // Fire the ajax request
  $.ajax({
    url: '<?php print $base_url; ?>/reports/saveaddress',
    type: 'post',
    data: {address: address, shipping: shipping},
    success: function (response) {
      //alert(response);
      if (response == 'success') {
        window.location.href = '<?php print $base_url;  ?>/user/payment';
      }
    }
  });//  Ajax function closed
}