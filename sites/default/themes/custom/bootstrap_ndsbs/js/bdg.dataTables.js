/**
 * Custom jQuery DataTables
 *
 * License: GNU General Public License, version 2
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 *
 * Buchanan Design Group
 * http://buchanandesigngroup.com
 */
jQuery(document).ready(function($) {
  $("[data-active=No]").parent('tr').hide();

  // Search for duplicate records and add classes to the row. This way
  // we can remove the rows later on, but before the jQuery DataTables plugin
  // does its work.
  var tableRows = $(".schedule_table tbody tr"),
    // We know exactly how large to make it, so don't use []
    htmlStrings = new Array(tableRows.length),
    i, j, current, comparing;
  
  for (i = 0; i < tableRows.length; i++) {
    current = htmlStrings[i];
    // Get each innerHTML just once.
    if (!current) {
      current = {
        html: tableRows.get(i).innerHTML,
        isDup: false
      };
      htmlStrings[i] = current;
    }
  
    // If we already know it's a duplicate, we're done. So just move on.
    if (current.isDup) continue;
  
    // start j at i+1 since we've already looked at the previous i rows
    for (j = i + 1; j < tableRows.length; j++) {
      // Could stay DRY and put this into a function;
      // doing so may decrease performance (not benchmarked)
      comparing = htmlStrings[j];
      if (!comparing) {
        comparing = {
          html: tableRows.get(j).innerHTML,
          isDup: false
        };
        htmlStrings[j] = comparing;
      }
  
      if (comparing.isDup) continue;
  
      // It comes to this: we must actually compare now.
      if (current.html === comparing.html) {
        current.isDup = true;
        comparing.isDup = true;
  
        // Mark each additional record found for the duplicates.
        tableRows.eq(j).addClass('duplicate-record');
      }
    }
  
    if (current.isDup) {
      // Mark the first record found for the duplicates.
      tableRows.eq(i).addClass('parent-duplicate-record');
    }
  }

  // Remove the duplicate records, leaving only the parent duplicate record.
  // This will keep the refunded transactions in the table.
  $('.schedule_table > tbody  > tr').each(function() {
    if ($(this).hasClass('duplicate-record')) {
      $(this).remove();
    }
  });

  // We also need to add a class to the transaction amount if the row
  // is for a refunded transaction. This is done before the jQuery DataTables
  // plugin does its work, so our totals in the tfoot are correct.
  $('.schedule_table > tbody  > tr').each(function() {
    var refundTD = 'td.views-field-field-refund-for-service';
    if ($(this).children(refundTD).text() != '$0.00') {
      $(this).children('td.views-field-php-3').addClass('refunded');
    }
  });

  // And here we actually remove the transaction amount from the row.
  $('.schedule_table > tbody  > tr').each(function() {
    if ($(this).children().hasClass('refunded')) {
      $(this).children('td.refunded').empty();
    }
  });
  
  // Now we define our table as a DataTable.
  var table = $('.view-therapist-reports .views-table').dataTable({
    "pagingType": "full",
    "lengthMenu": [[-1, 10, 25, 50], ["All", 10, 25, 50]],
    "order": [[3, "desc"]],
    "footerCallback": function ( row, data, start, end, display ) {
      var api = this.api(), data;
  
      // Remove the formatting to get integer data for summation
      var intVal = function (i) {
        return typeof i === 'string' ?
          i.replace(/[\$,]/g, '')*1 :
          typeof i === 'number' ?
            i : 0;
      };
  
      // Total over all pages.
      data = api.column( 4 ).data();
      total = data.length ?
        data.reduce( function (a, b) {
          return intVal(a) + intVal(b);
        }):
        0;
  
      // Total over this page.
      data = api.column(4, { page: 'current'}).data();
      pageTotal = data.length ?
        data.reduce( function (a, b) {
          return intVal(a) + intVal(b);
        } ) :
        0;
  
      // Total refunds over all pages
      data = api.column( 5 ).data();
      refundTotal = data.length ?
        data.reduce( function (a, b) {
          return intVal(a) + intVal(b);
        }):
        0;
  
      // Total refunds over this page.
      data = api.column(5, { page: 'current'}).data();
      refundPageTotal = data.length ?
        data.reduce( function (a, b) {
          return intVal(a) + intVal(b);
        } ) :
        0;

      // Total for this page, with refunds added in.
      totalWithRefunds = pageTotal + refundPageTotal;
  
      // Update footer
      $( api.column( 4 ).footer() ).html(
        'Orders Total: <br><span class="orders-total">$'+parseFloat(pageTotal, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString() +' ($'+ parseFloat(total, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString() +' total)</span>' + '<br><br>Orders Total (including refunds): <br><span class="orders-total-with-refunds">$'+parseFloat(totalWithRefunds, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString()
      );
  
      // Update footer
      $( api.column( 5 ).footer() ).html(
        'Refunds Total: <br><span class="refunds-total">$'+parseFloat(refundPageTotal, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString() +' ($'+ parseFloat(refundTotal, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString() +' total)</span>'
      );
    }
  })

  // Define where the search box will go using sPlaceHolder.
  // We also set a type to each column, using aoColumns. The nulls tell the
  // search box not to include that column's text during searches.
  .columnFilter({
    sPlaceHolder: "head:before",
    aoColumns: [
      { type: "null" },
      { type: "null" },
      { type: "null" },
      { type: "date-range" },
      { type: "null" },
      { type: "null" },
      { type: "text" }
    ]
  });

  // Tells the datepicker text fields to open a date picker popup using jQuery.
  $("#datepicker").datepicker();
  $.datepicker.regional[""].dateFormat = 'mm/dd/yy';
  $.datepicker.setDefaults($.datepicker.regional['']);

  // Adds a label to the search box so staff knows to enter the therapist name.
  $( "input.search_init.text_filter" ).before( "Therapist" );

  // This is just to add a class to the td that has refunds. If the td has a
  // value above $0.00, then we want to make it stand out through CSS.
  $('tr').each(function() {
    $('td.views-field-field-refund-for-service', this).each(function() {
      if ($(this).text() === '$0.00') {
        // Remove the text, we do not need to show zero dollars.
        $(this).empty();
      }
      else {
        // Add class so we can make it bold and red.
        $(this).addClass('refund');
      }
    });
  });
});