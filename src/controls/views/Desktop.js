define([
    "./AppPage",
    "utilhub/front/scenes/Scene",
    "utilhub/front/areas/WindowedAppArea",
    "qscript/lang/Class"
], function(AppPage, Scene, Area, Class) {
    return Class.declare({
        "-parent-": AppPage,
        "-protected-": {
            "-methods-": {
                init: function() {
                    var scene = new Scene({});
                    var area = new WindowedAppArea({});
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
