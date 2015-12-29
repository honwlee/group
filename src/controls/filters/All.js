define([
    "qfacex/dijit/ITemplated",
    "utilhub/ItemsControl",
    "qscript/lang/Class"
], function(ITemplated, ItemsControl, Class) {
    return Class.declare({
        "-parent-": ItemsControl,
        "-interfaces-": [ITemplated],
        "-protected-": {
            "-fields-": {
                templateString: "<div></div>"
            },
            "-methods-": {

            }
        },
        "-public-": {
            "-attributes-": {

            },
            "-methods-": {
                initAllBtnOpts: function() {

                }
            }
        },
        "-constructor-": {
            initialize: function(params, srcNodeRef) {
                this.overrided(params, srcNodeRef);
            }
        }
    });
});
