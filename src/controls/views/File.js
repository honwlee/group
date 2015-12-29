define([
    "./AppPage",
    "qscript/lang/Class"
], function(AppPage, Class) {
    return Class.declare({
        "-parent-": AppPage,
        "-protected-": {
            "-methods-": {
                init: function() {
                    var filebrowser = new FileBrowserApp({});
                    filebrowser.start({}).then(Function.hitch(this, function() {
                        this.addChild(filebrowser.mainLayout);
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
