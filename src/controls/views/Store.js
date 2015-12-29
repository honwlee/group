define([
    "./AppPage",
    "center/products/utilhub.com/system/1.0.0/UtilStore/App",
    "qscript/lang/Class"
], function(AppPage, UtilStoreApp, Class) {
    return Class.declare({
        "-parent-": AppPage,
        "-protected-": {
            "-methods-": {
                init: function() {
                    var store = new UtilStoreApp({});
                    store.start({}).then(Function.hitch(this, function() {
                        this.addChild(store.mainLayout);
                    }));
                }
            }
        },

        "-public-": {
            "-attributes-": {

            },

            "-methods-": {

            }
        },

        "-constructor-": {
            initialize: function(params, srcNodeRef) {
                this.overrided(params, srcNodeRef);
                this.init();
                // var self = this;
                // GroupServer.initFeed(this.groupId).then(function(feedMemory) {
                //     self.init(feedMemory);
                // });
            }
        }
    });
});
