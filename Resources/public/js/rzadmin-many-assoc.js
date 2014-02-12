function rzadmin_many_assoc(options) {
//   this.options = options;
   this.id = options.id;
   this.admin = options.admin;
   this.field_dialog = options.field_dialog;
   this.field_widget = options.field_widget;
   this.field_container = options.field_container;
   this.sonata_admin_edit = options.sonata_admin_edit;
   this.url_sonata_admin_retrieve_form_element = options.url_sonata_admin_retrieve_form_element;
   this.url_sonata_admin_short_object_information = options.url_sonata_admin_short_object_information;
   this.url_ajax_loading = options.url_ajax_loading;
   this.ajax_loading_description = options.ajax_loading_description;

   this.init();
}

rzadmin_many_assoc.prototype = {

    init: function() {
        this.admin.log(sprintf('initinitialize %s', this.id));
    },

    initializePopup: function() {
        if (!this.field_dialog) {
           var div = sprintf("<div class='rzcms rz-cms-admin modal hide fade' data-backdrop='static' id='%s' aria-hidden='false'></div>",this.field_widget);
           this.field_dialog = jQuery(div);
           // move the dialog as a child of the root element, nested form breaks html ...
           jQuery(document.body).append(self.field_dialog);
           this.admin.log(sprintf('[%s|initializePopup()] move dialog container as a document child', this.id));
        }
    },

    /*
     handle link click in a list :
     - if the parent has an objectId defined then the related input get updated
     - if the parent has NO object then an ajax request is made to refresh the popup
     */

    fieldDialogFormListLink: function(event) {
       var self = event.data.ref;

        self.initializePopup();

        event.preventDefault();
        event.stopPropagation();

        jQuery.blockUI({ message:self.admin.loadingMessage(null)});

        self.admin.log(sprintf('[%s|fieldDialogFormListLink()] handle link click in a list', self.id));

        var element = jQuery(this).parents(sprintf('#%s .sonata-ba-list-field',self.field_widget));

        // the user does click on a row column
        if (element.length == 0) {
            // make a recursive call (ie: reset the filter)
            jQuery.ajax({
                type: 'GET',
                url: jQuery(this).attr('href')
            })
            .done(function(html, textStatus, jqXHR) {
               self.admin.log(sprintf('[%s|fieldDialogFormListLink] ajax done',self.field_dialog), self.id);
               self.field_dialog.html(html);
               self.admin.addFilters(self.field_dialog);
               self.admin.initElements(jQuery(self.field_dialog));
               /* capture the submit event to make an ajax call, ie : POST data to the
                 related create admin */
                jQuery('a:not([class*="admin-ajax-ignore-event"], [class*="admin-ajax-ignore-tabbable"], [class*="fileupload-exists"], ul.dropdown-menu li > a), a[class*="rz-admin-filter-reset-button"], ul.tabdrop li > a',self.field_dialog).on('click',{ ref:self},self.fieldDialogFormListLink);
                jQuery('form, a:not([class*="rz-admin-filter-reset-button"])',self.field_dialog).on('submit', {ref:self}, self.fieldDialogFormListFilter);
            })
            .fail(function(jqXHR, textStatus, errorThrown){
                self.admin.log(sprintf('[%s|field_dialog_form_list] ajax fail', self.id),self.field_dialog);
                self.admin.log(sprintf('[%s|field_dialog_form_list] error message', self.id), errorThrown);
            })
            .always(function() {
                self.admin.log(sprintf('[%s|field_dialog_form_list] ajax always', self.id),self.field_dialog);
            });
            return;
        }

        jQuery(sprintf('#%s',self.id)).val(element.attr('objectId'));
        jQuery(sprintf('#%s',self.id)).trigger('change');

       self.field_dialog.modal('hide');
    },

    // handle filter
    fieldDialogFormListFilter: function(event) {
        var self = event.data.ref;
        event.preventDefault();
        event.stopPropagation();

        jQuery.blockUI({ message:self.admin.loadingMessage(null)});

        self.admin.log(sprintf('[%s|fieldDialogFormListFilter] submit filter', self.id));

        var form = jQuery(this);

        jQuery(form).ajaxSubmit({
            type: form.attr('method'),
            url: form.attr('action'),
            dataType: 'html',
            data: {_xml_http_request: true},
            success: function(html) {
               self.field_dialog.html(html);
               self.admin.addFilters(self.field_dialog);
               self.admin.initElements(jQuery(self.field_dialog));
                /* capture the submit event to make an ajax call, ie : POST data to the
                    related create admin */
                jQuery('a:not([class*="admin-ajax-ignore-event"], [class*="admin-ajax-ignore-tabbable"], [class*="fileupload-exists"], ul.dropdown-menu li > a), a[class*="rz-admin-filter-reset-button"], ul.tabdrop li > a',self.field_dialog).on('click', {ref:self}, self.fieldDialogFormListLink);
                jQuery('form, a:not([class*="rz-admin-filter-reset-button"])',self.field_dialog).on('submit', {ref:self}, self.fieldDialogFormListFilter);
            }
        });
    },

    // handle the add link
    fieldDialogFormList: function(event) {
        var self = event.data.ref;
        self.initializePopup();

        event.preventDefault();
        event.stopPropagation();

        jQuery.blockUI({ message:self.admin.loadingMessage(null)});

        self.admin.log(sprintf('[%s|fieldDialogFormList] open the list modal', self.id));

        var a = jQuery(this);

        self.field_dialog.empty();

        // retrieve the form element from the related admin generator
        jQuery.ajax({
            url: a.attr('href'),
            dataType: 'html'
        })
        .done(function(html, textStatus, jqXHR) {

            self.admin.log(sprintf('[%s|fieldDialogFormList] retrieving the list content', self.id));

            /* populate the popup container */
            self.field_dialog.html(html);
            /* capture the submit event to make an ajax call, ie : POST data to the
                related create admin */
            jQuery('a:not([class*="admin-ajax-ignore-event"], [class*="admin-ajax-ignore-tabbable"],  [class*="fileupload-exists"],  ul.dropdown-menu li > a), a[class*="rz-admin-filter-reset-button"], ul.tabdrop li > a',self.field_dialog).on('click', {ref:self}, self.fieldDialogFormListLink);
            jQuery('form, a:not([class*="rz-admin-filter-reset-button"])',self.field_dialog).on('submit', {ref:self}, self.fieldDialogFormListFilter);

            /* open the dialog in modal mode */
            var init_width = Math.round(jQuery(window).width() - (jQuery(window).width() * .2));
            init_width = (init_width > 980) ? 980 :  init_width;
            self.field_dialog.modal({'width': init_width });
            self.field_dialog.on('hidden', function (event) {
                if (jQuery(event.target).hasClass('admin-filter-ajax')) {
                    return false;
                } else {
                    self.admin.log(sprintf('[%s|fieldDialogFormList] modal hidden - removing `on` events', self.id));
                    /* make sure we have a clean state */
                    jQuery('a:not([class*="admin-ajax-ignore-event"], [class*="admin-ajax-ignore-tabbable"],  [class*="fileupload-exists"], ul.dropdown-menu li > a), a[class*="rz-admin-filter-reset-button"], ul.tabdrop li > a', jQuery(this)).off('click');
                    jQuery('form, a:not([class*="rz-admin-filter-reset-button"])', jQuery(this)).off('submit');
                    jQuery(this).empty();
                    self.field_dialog = null;
                }
            });

            self.field_dialog.on('shown', function (event) {
                self.admin.addFilters(jQuery(this));
                self.admin.initElements(jQuery(this));
            });

        })
        .fail(function(jqXHR, textStatus, errorThrown){
           self.admin.log(sprintf('[%s|fieldDialogFormList] ajax fail', self.id),self.field_dialog);
           self.admin.log(sprintf('[%s|fieldDialogFormList] Error Message', self.id), errorThrown);
        })
        .always(function() {
           self.admin.log(sprintf('[%s|fieldDialogFormList] ajax always', self.id) ,self.field_dialog);
        });
    },

    fieldDialogFormAdd: function(event) {

        var self = event.data.ref;

        self.initializePopup();

        event.preventDefault();
        event.stopPropagation();

        var a = jQuery(this);
        self.field_dialog.empty();

        jQuery.blockUI({ message:self.admin.loadingMessage(null)});

        self.admin.log(sprintf('[%s|fieldDialogFormAdd] add link action', self.id));

        /* retrieve the form element from the related admin generator */
        jQuery.ajax({
            url: a.attr('href'),
            dataType: 'html'
        })
        .done(function(html, textStatus, jqXHR) {
            /* populate the popup container */
            self.field_dialog.html(html);
            jQuery('a:not([data-toggle="tab"],[data-toggle="pill"],[class*="fileupload-exists"])', self.field_dialog).on('click', { ref: self }, self.fieldDialogFormAction);
            jQuery('form', self.field_dialog).on('submit', { ref: self }, self.fieldDialogFormAction);

            /* open the dialog in modal mode */
            var init_width = Math.round(jQuery(window).width() - (jQuery(window).width() * .2));
            init_width = (init_width > 980) ? 980 :  init_width;
            self.field_dialog.modal({'width': init_width });

            self.field_dialog.on('hidden', function () {
                self.admin.log(sprintf('[%s|fieldDialogFormAdd] modal hidden - removing `on` events', self.id));
                /* make sure we have a clean state */
                jQuery('a:not([data-toggle="tab"],[data-toggle="pill"],[class*="fileupload-exists"])', jQuery(this)).off('click');
                jQuery('form', jQuery(this)).off('submit');
                jQuery(this).empty();
                self.field_dialog = null;
            });

            self.field_dialog.on('shown', function () {
                /* capture the submit event to make an ajax call, ie : POST data to the
                    related create admin */
                self.admin.initElements(jQuery(this));
            });
        })
        .fail(function(jqXHR, textStatus, errorThrown){
            self.admin.log(sprintf('[%s|fieldDialogFormAdd] ajax fail', self.id),self.field_dialog);
            self.admin.log(sprintf('[%s|fieldDialogFormAdd] Error Message', self.id), errorThrown);
        })
        .always(function() {
            self.admin.log(sprintf('[%s|fieldDialogFormAdd] ajax always', self.id),self.field_dialog);
        });
    },


    /*
     This code is used to defined the "add" popup
     this function initialize the popup
     this can be only done this way has popup can be cascaded
     */
    startFieldDialogFormAdd: function(link) {

        /* remove thstartFieldDialogFormAdde html event */
        link.onclick = null;

        this.initializePopup();

        this.attachListeners();

        /* add the jQuery event to the a element */
        jQuery(link).on('click', { ref: this }, this.fieldDialogFormAdd)
                    .trigger('click')
        ;
        return false;
    },

    // handle the post data
    fieldDialogFormAction: function(event) {

        var self = event.data.ref;

        event.preventDefault();
        event.stopPropagation();

        self.admin.log(sprintf('[%s|fieldDialogFormAction] action catch', self.id), this);

        self.initializePopup();

        var element = jQuery(this);

        if (this.nodeName == 'FORM') {
            var url  = element.attr('action');
            var type = element.attr('method');
            var dataType = 'json';
        } else if (this.nodeName == 'A') {
            var url  = element.attr('href');
            var type = 'GET';
            var dataType = null;
        } else {
            alert('unexpected element : @' + this.nodeName + '@');
            return;
        }

        if (element.hasClass('sonata-ba-action')) {
            self.admin.log(sprintf('[%s|fieldDialogFormAction] reserved action stop catch all events', self.id));
            return;
        }

        jQuery.blockUI({ message:self.admin.loadingMessage(null)});

        var data = {_xml_http_request: true}
        var form = jQuery(this);

        self.admin.log(sprintf('[%s|fieldDialogFormAction] execute ajax call', self.id));

        // the ajax post
        jQuery(form).ajaxSubmit({
            url: url,
            type: type,
            data: data,
            dataType: dataType,
            success: function(data) {

                self.admin.log(sprintf('[%s|fieldDialogFormAction] ajax success', self.id));

                if (typeof data == 'string') {
                    self.field_dialog.html(data);
                    /* reattach the event */
                    jQuery('a:not([data-toggle="tab"],[data-toggle="pill"],[class*="fileupload-exists"])',self.field_dialog).on('click', {ref: self}, self.fieldDialogFormAction);
                    jQuery('form',self.field_dialog).on('submit', {ref:self}, self.fieldDialogFormAction);
                    self.admin.initElements(jQuery(self.field_dialog));
                    return;
                };

                /*
                    if the crud action return ok, then the element has been added
                    so the widget container must be refresh with the last option available
                    */
                if (data.result == 'ok') {

                    self.field_dialog.modal('hide');

                    /*
                        in this case we update the hidden input, and call the change event to
                        retrieve the post information
                    */

                    if (self.sonata_admin_edit == 'list') {
                        jQuery(sprintf('#%s',self.id)).val(data.objectId);
                        jQuery(sprintf('#%s',self.id)).change();

                    } else { /* reload the form element */

                        jQuery(sprintf('#%s',self.field_widget)).closest('form').ajaxSubmit({
                                url:self.url_sonata_admin_retrieve_form_element,
                                data: {_xml_http_request: true },
                                type: 'POST',
                                success: function(html) {
                                    jQuery(sprintf('#%s',self.field_container)).replaceWith(html);
                                    var newElement = jQuery(sprintf('#%s [value="%s"]',self.field_widget, data.objectId));
                                    if (newElement.is("input")) {
                                        newElement.attr('checked', 'checked');
                                    } else {
                                        newElement.attr('selected', 'selected');
                                    }

                                    self.admin.initElements(jQuery(sprintf('#%s',self.field_widget)));

                                    jQuery(sprintf('#%s',self.field_widget)).trigger('sonata-admin-append-form-element');
                                }
                        });
                    }

                    return;
                }

                self.admin.log(sprintf('[%s|fieldDialogFormAction] ajax bypass checks', self.id));

                /* otherwise, display form error */
                self.field_dialog.html(data);

                self.admin.addPrettyErrors(self.field_dialog);

                /* reattach the event */
                jQuery('a:not([data-toggle="tab"],[data-toggle="pill"],[class*="fileupload-exists"])',self.field_dialog).on('click', {ref:self}, self.fieldDialogFormAction);
                jQuery('form',this.field_dialog).on('submit', { ref:self }, self.fieldDialogFormAction);
                self.admin.initElements(jQuery(self.field_dialog));
            },
            error: function(html) {
                self.field_dialog.html(html.responseText);
                self.admin.log(sprintf('[%s|fieldDialogFormAction] ajax error', self.id));

                self.admin.addPrettyErrors(self.field_dialog);

                self.admin.log(sprintf('[%s|fieldDialogFormAction] reatttach events', self.id));
                /* reattach the event */
                jQuery('a:not([data-toggle="tab"],[data-toggle="pill"],[class*="fileupload-exists"])',self.field_dialog).on('click', {ref:self}, self.fieldDialogFormAction);
                jQuery('form',this.field_dialog).on('submit', { ref:self }, self.fieldDialogFormAction);
                self.admin.initElements(jQuery(self.field_dialog));
                return false;
            }
        });

        return false;
    },

    startFieldDialogFormList: function(link) {

        this.admin.log(sprintf('[%s] startFieldDialogFormList', this));

        link.onclick = null;

       this.initializePopup();

       this.attachListeners();

        // add the jQuery event to the a element
        jQuery(link).on('click', {ref:this}, this.fieldDialogFormList)
                    .trigger('click');
        return false;
    },

    removeSelectedElement: function(link) {
        link.onclick = null;

        this.attachListeners();

        jQuery(link).on('click', {ref:this}, this.fieldRemoveElement)
                    .trigger('click');

        return false;
    },

    fieldRemoveElement: function(event) {

        var self = event.data.ref;

        event.preventDefault();

        if (jQuery(sprintf('#%s option',self.id)).get(0)) {
            jQuery(sprintf('#%s',self.id)).attr('selectedIndex', '-1').children("option:selected").attr("selected", false);
        }
        jQuery(sprintf('#%s',self.id)).val('');
        jQuery(sprintf('#%s',self.id)).trigger('change');

        return false;
    },

    /*
     * attach onchange event on the input refactored will be removed from
     */

    attachListeners: function() {
        var self = this;

        self.admin.log(sprintf('[%s] attachListeners', self.id));

        if (self.sonata_admin_edit == 'list') {
            // update the label
            jQuery(sprintf('#%s',self.id)).on('change', function(event) {
                self.admin.log(sprintf('[%s] update the label', self.id));
                if(jQuery(this).val() !== '') {
                    jQuery(sprintf('#%s', self.field_widget)).html(sprintf("<span><img src=\"%s\" style=\"vertical-align: middle; margin-right: 10px\"/>%s</span>",self.url_ajax_loading,self.ajax_loading_description));
                    jQuery.ajax({
                        type: 'GET',
                        url: self.url_sonata_admin_short_object_information.replace('OBJECT_ID', jQuery(this).val()),
                        success: function(html) {
                            jQuery(sprintf('#%s',self.field_widget)).html(html);
                        }
                    });
                } else {
                    jQuery(sprintf('#%s',self.field_widget)).html('');
                }
            });
        }
    }
}
