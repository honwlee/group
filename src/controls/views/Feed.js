define([
    "./AppPage",
    "qscript/lang/Class"
], function(AppPage, Class) {
    return Class.declare({
        "-parent-": AppPage,
        "-protected-": {
            "-methods-": {
                init: function(feedMemory) {
                    var feedViewer = new FeedViewerApp({});
                    feedViewer.start({
                        data: feedMemory
                    });
                    this.addChild(feedViewer.mainLayout);
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
                var self = this;
                GroupServer.initFeed(this.groupId).then(function(feedMemory) {
                    self.init(feedMemory);
                });
            }
        }
    });
});
