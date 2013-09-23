function rzadmin_one_assoc(options) {
//   this.options = options;
    this.id = options.id;
    this.admin = options.admin;
    this.field_dialog = options.field_dialog;
    this.field_widget = options.field_widget;
    this.field_container = options.field_container;
    this.sonata_ba_field_container = options.sonata_ba_field_container;
    this.url_sonata_admin_append_form_element = options.url_sonata_admin_append_form_element;
    this.init();
}

rzadmin_one_assoc.prototype = {

    init: function() {
        this.admin.log(sprintf('initinitialize %s', this.id));
    },

    // handle the add link
    fieldAdd:  function(event) {

        var self = event.data.ref;

        event.preventDefault();
        event.stopPropagation();

        jQuery.blockUI({ message: self.admin.loadingMessage(null)});

        var form = jQuery(this).closest('form');

        // the ajax post
        jQuery(form).ajaxSubmit({
            url: self.url_sonata_admin_append_form_element,
            type: "POST",
            dataType: 'html',
            data: { _xml_http_request: true },
            success: function(html) {
                jQuery(sprintf('#%s',self.field_container)).replaceWith(html); // replace the html
                if(jQuery('input[type="file"]', form).length > 0) {
                    jQuery(form).attr('enctype', 'multipart/form-data');
                    jQuery(form).attr('encoding', 'multipart/form-data');
                }
                jQuery(sprintf('#%s', self.sonata_ba_field_container)).trigger('sonata.add_element');
                jQuery(sprintf('#%s', self.field_container)).trigger('sonata.add_element');
            }
        });

        return false;
    },

    // this function initialize the popup
    // this can be only done this way has popup can be cascaded
    startFieldRetrieve: function(link) {

        link.onclick = null;
        var div = sprintf("<div class='rz-modal modal hide fade' data-backdrop='static' id='%s' aria-hidden='false'></div>",this.field_widget);
        // initialize component
        this.field_dialog = jQuery(div);

        // add the jQuery event to the a element
        jQuery(link).on('click', {ref:this}, this.fieldAdd)
                    .trigger('click');

        return false;
    }
}
