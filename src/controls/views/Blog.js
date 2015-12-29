define([
    "./AppPage",
    "center/products/ihudao.com/contents/1.0.0/Blog/App",
    "qscript/lang/Class"
], function(AppPage, BlogApp, Class) {
    return Class.declare({
        "-parent-": AppPage,
        "-protected-": {
            "-fields-": {
                groupData: null,
                groupId: "",
                app: null
            },
            "-methods-": {
                init: function(group) {
                    this._initBlog(self.groupData.postsMemory.query({}));
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
                self.app.groupsrv.initBlog(this.groupId).then(function(group) {
                    self.groupData = group;
                    self.init();
                });
            }
        }
    });
});
