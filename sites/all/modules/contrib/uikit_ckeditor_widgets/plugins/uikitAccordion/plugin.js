/**
 * @file
 * Defines the UIkit Accordion CKEditor plugin and its behavior.
 */

(function () {
  // Register the plugin within the editor.
  CKEDITOR.plugins.add('uikitAccordion', {
    // This plugin requires the Widgets System defined in the 'widget' plugin.
    requires: 'widget',

    // Register the icon used for the toolbar button. It must be the same
    // as the name of the widget.
    icons: 'uikitAccordion',

    // The plugin initialization logic goes inside this method.
    init: function (editor) {
      // Register the uikitAccordion widget.
      editor.widgets.add('uikitAccordion', {
        // Allow all HTML elements and classes that this widget requires.
        // Read more about the Advanced Content Filter here:
        // * http://docs.ckeditor.com/#!/guide/dev_advanced_content_filter
        // * http://docs.ckeditor.com/#!/guide/plugin_sdk_integration_with_acf
        allowedContent: 'div(!uk-accordion); div(!uk-accordion-content); h3(!uk-accordion-title)',

        // Minimum HTML which is required by this widget to work.
        requiredContent: 'div(uk-accordion)',

        // Define two nested editable areas.
        editables: {
          title: {
            // Define a CSS selector used for finding the element inside the
            // widget element.
            selector: '.uk-accordion-title',

            // Define content allowed in this nested editable. Its content will
            // be filtered accordingly and the toolbar will be adjusted when
            // this editable is focused.
            allowedContent: 'br strong em'
          },
          content: {
            selector: '.uk-accordion-content',
            allowedContent: 'div h1 h2 h3 h4 h5 h6 ol ul li pre code address blockquote dl dt dd fieldset hr table thead tbody tfoot tr th td caption details summary a strong em i span cite'
          }
        },

        // Define the template of a new UIkit Accordion widget.
        // The template will be used when creating new instances of the widget.
        template: '<div class="uk-accordion" uk-accordion>' +
        '<h3 class="uk-accordion-title">Title</h3>' +
        '<div class="uk-accordion-content">Content...</div>' +
        '</div>',

        // Define the label for a widget toolbar button which will be
        // automatically created by the Widgets System. This button will insert
        // a new widget instance created from the template defined above, or
        // will edit selected widget. In order to be able to translate the
        // widget we use the Drupal.t() property.
        button: Drupal.t('Insert UIkit Accordion'),

        // Check the elements that need to be converted to widgets.
        //
        // Note: The "element" argument is an instance of
        // http://docs.ckeditor.com/#!/api/CKEDITOR.htmlParser.element so it is
        // not a real DOM element yet. This is caused by the fact that upcasting
        // is performed during data processing which is done on DOM represented
        // by JavaScript objects.
        upcast: function (element) {
          // Return "true" (that element needs to converted to a UIkit Accordion
          // widget) for all <ul> elements with a "uk-accordion" class.
          return element.name === 'div' && element.hasClass('uk-accordion');
        }
      });

      // Create the toolbar button.
      editor.ui.addButton('uikitAccordion', {
        label: 'Insert UIkit Accordion',
        command: 'uikitAccordion',
        toolbar: 'list',
        icon: this.path + '/icons/uikitAccordion.png'
      });

      // Add the stylesheet for a better user experience.
      var pluginDirectory = this.path;
      editor.addContentsCss( pluginDirectory + 'styles/contents.css' );
    }
  });
})();
