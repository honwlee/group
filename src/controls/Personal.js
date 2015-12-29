define([
    "qscript/lang/Array",
    "dojo/on",
    "dojo/topic",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/dom-construct",
    "i18n!../nls/app",
    "bundle!dependencies/services/user_srv",
    "bundle!dependencies/services/group_srv",
    "text!../templates/personal.html",
    "qscript/lang/Class",
    "qfacex/dijit/ITemplated",
    "utilhub/ItemsControl",
    "./Item"
], function(array, on, topic, domStyle, domClass, domConstruct, nlsApp, userSrv, groupSrv, template,
    Class, ITemplated, ItemsControl, Item) {
    var SmallItem = Class.declare({
        "-parent-": ItemsControl,
        "-interfaces-": [ITemplated],
        "-module-": "",
        "-protected-": {
            "-fields-": {
                fontAwesome: FontAwesome
            },
            "-methods-": {

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
            }
        }
    });
    return Class.declare({
        "-parent-": ItemsControl,
        "-interfaces-": [ITemplated],
        "-protected-": {
            "-fields-": {
                fontAwesome: FontAwesome,
                baseClass: "personal",
                templateString: template,
                memory: null
            },

            "-methods-": {
                init: function() {
                    this.fillOwnerNode();
                    this.fillJoinedNode();
                    this.fillRecommendedNode();
                },

                bindEvents: function() {
                    var self = this;
                    on(this.ownerPrevNode, "click", function() {

                    });
                    on(this.ownerNextNode, "click", function() {

                    });
                    on(this.joinedPrevNode, "click", function() {

                    });
                    on(this.joinedNextNode, "click", function() {

                    });
                    on(this.recomPrevNode, "click", function() {

                    });
                    on(this.recomNextNode, "click", function() {

                    });
                },

                initItem: function(item, className) {
                    var group = new Item({
                        item: item,
                        baseClass: className
                    });
                    on(group, "itemSelect", Function.hitch(this, function() {
                        this.onItemSelect(item);
                    }));
                    return group;
                },

                fillOwnerNode: function() {
                    var self = this;
                    groupSrv.initOwner().then(function(groups) {
                        groups.forEach(function(groupData) {
                            var group = self.initItem(groupData, "owner col-sm-2");
                            self.ownerNode.appendChild(group.domNode);
                        });
                    });
                },

                fillJoinedNode: function() {
                    var self = this;
                    groupSrv.initJoined().then(function(groups) {
                        groups.forEach(function(groupData) {
                            var group = self.initItem(groupData, "joined col-sm-2");
                            self.joinedNode.appendChild(group.domNode);
                        });
                    });
                },

                fillRecommendedNode: function() {
                    var self = this;
                    groupSrv.initRecommend().then(function(groups) {
                        groups.forEach(function(groupData) {
                            var group = self.initItem(groupData, "recommed col-sm-1");
                            self.recommendedNode.appendChild(group.domNode);
                        });
                    });
                }

            }
        },

        "-public-": {
            "-attributes-": {
                app: {
                    getter: function() {
                        return this.mainLayout.app;
                    }
                }
            },

            "-methods-": {
                onItemSelect: function(groupId) {},
                newItem: function(item) {
                    var group = this.initItem(item, "owner col-sm-2");
                    this.ownerNode.appendChild(group.domNode);
                }
            }
        },

        "-constructor-": {
            initialize: function(params, srcNodeRef) {
                this.overrided(params, srcNodeRef);
                var self = this;
                userSrv.getUserById(runtime.currentUserId).then(function(user) {
                    groupSrv.getUserGroup(user).then(function(memory) {
                        self.memory = memory;
                        self.init();
                    });
                });
            }
        }
    });
});
