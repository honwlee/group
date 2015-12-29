define([
    "dojo/on",
    "dojo/mouse",
    "dojo/topic",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "qscript/lang/Array",
    "i18n!../../nls/app",
    "text!../../templates/views/activities.html",
    "qscript/lang/Class",
    "qfacex/dijit/ITemplated",
    "utilhub/ItemsControl"
], function(on, mouse, topic, domClass, domStyle, domConstruct, array, nlsApp, template, Class, ITemplated, ItemsControl) {
    return Class.declare({
        "-parent-": ItemsControl,
        "-interfaces-": [ITemplated],

        "-protected-": {
            "-fields-": {
                nls: nlsApp,
                templateString: template,
                fontAwesome: FontAwesome
            },
            "-methods-": {
                init: function() {
                    // this.eventBind();
                    // this.initActions();
                }
            }
        },

        "-public-": {
            "-attributes-": {},

            "-methods-": {}
        },

        "-constructor-": {
            initialize: function(params) {
                this.overrided(params);
                this.init();
            }
        }
    });
});
