define([
    "utilhub/Application",
    "i18n!utilhub/front/system/nls/apps",
    "bundle!dependencies/services/group_srv",
    "./controls/Layout",
    "nanoscroller/jquery.nanoscroller.min"
], function(_App, nlsApps, groupsrv, Layout) {

    return Class.declare({
        "-parent-": _App,
        "-module-": "./App",
        "-protected-": {
            "-fields-": {
                isDeferred: true,
                winMaxed: false,
                width: 960,
                height: 600,
                title: nlsApps["Group"] || "Group"
            }
        },

        "-public-": {
            "-methods-": {
                init: function(args) {
                    this.overrided();
                    var self = this;
                    groupsrv.init().then(function(memory) {
                        var opts = {
                            app: self,
                            memory: memory
                        };
                        Function.mixin(opts, args);
                        self.mainLayout = new Layout(opts);
                        self.deferred.resolve();
                    });
                    return this.deferred.promise;
                },

                blockade: function() {
                    this.mainLayout.broadcast("group:clearInterval");
                },

                unblock: function() {
                    this.mainLayout.broadcast("group:initInterval");
                }
            }
        },

        "-constructor-": {
            initialize: function(args) {
                this.overrided(args);
            }
        }
    });
});
