define([
    "dojo/dom-geometry",
    "qfacex/dijit/ITemplated",
    "utilhub/ItemsControl",
    "qscript/lang/Class"
], function(domGeom, ITemplated, ItemsControl, Class) {
    return Class.declare({
        "-parent-": ItemsControl,
        "-interfaces-": [ITemplated],
        "-protected-": {
            "-fields-": {
                templateString: "<div></div>",
                groupId: null,
                box: null
            },
            "-methods-": {}
        },

        "-public-": {
            "-attributes-": {

            },

            "-methods-": {
                addChild: function(child, index) {
                    this.overrided(child, index);
                    // child.resize();
                }
            }
        },

        "-constructor-": {
            initialize: function(params, srcNodeRef) {
                this.box = params.box;
                this.overrided(params, srcNodeRef);
            }
        }
    });
});
