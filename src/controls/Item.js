define([
    "dojo/on",
    "dojo/mouse",
    "dojo/topic",
    "dojo/_base/event",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "qscript/lang/Array",
    "i18n!../nls/app",
    "text!../templates/item.html",
    "bundle!dependencies/services/group_srv",
    "qscript/lang/Class",
    "bundle!context",
    "qfacex/dijit/ITemplated",
    "utilhub/ItemsControl"
], function(on, mouse, topic, event, domClass, domStyle, domConstruct, array, nlsApp,
    template, groupSrv, Class, context, ITemplated, ItemsControl) {
    var Item = Class.declare({
        "-parent-": ItemsControl,
        "-interfaces-": [ITemplated],
        "-protected-": {
            "-fields-": {
                nls: nlsApp,
                templateString: template,
                fontAwesome: FontAwesome,
                tempVar: null,
                item: null,
                types: {
                    owner: {
                        value: 1,
                        actions: ["setting"],
                        owernerShip: "Creater"
                    },
                    joined: {
                        value: 2,
                        actions: ["viewInfo"],
                        owernerShip: "Joined"
                    },
                    recommend: {
                        value: 3,
                        actions: ["joinGroup"],
                        owernerShip: "Recomm"
                    }
                }
            },
            "-methods-": {
                init: function() {
                    this.eventBind();
                    this.initActions();
                },
                initTempVar: function(item) {
                    this.tempVar = {
                        avatar: item.avatar,
                        name: item.name,
                        memberNum: item.membersCount,
                        description: item.description
                    };
                },
                eventBind: function(index) {
                    var self = this;
                    this.own(
                        on(this.domNode, "click", function() {
                            self.onItemSelect(self.item.id);
                        }),

                        on(this.returnNode, "click", function(e) {
                            event.stop(e);
                            domClass.remove(self.domNode, "hover");
                        }),

                        on(this.deleteNode, "click", function(e) {
                            event.stop(e);
                            self.deleteGroup();
                        })
                    );
                },

                initActions: function() {
                    domConstruct.empty(this.actionsContainerNode);
                    this.createActions(this.types.owner);
                },

                createActions: function(obj) {
                    obj.actions.forEach(function(name) {
                        domConstruct.create("i", {
                            "class": "actionItem " + this.fontAwesome[name],
                            onclick: Function.hitch(this, function(e) {
                                e.stopPropagation();
                                this[name]();
                            })
                        }, this.actionsContainerNode);

                    }, this);

                    this.ownerShipNode.innerHTML = obj.owernerShip;
                },

                hiddenOwnerShipDiv: function() {
                    domClass.add(this.ownerShipNode.parentNode, "hide");
                },

                setting: function() {
                    domClass.add(this.domNode, "hover");
                },

                viewInfo: function() {
                    domClass.add(this.domNode, "hover");
                }
            }
        },

        "-public-": {
            "-attributes-": {},

            "-methods-": {
                joinGroup: function() {},

                deleteGroup: function() {
                    groupSrv.deleteGroup(this.item.id).then(Function.hitch(this, function() {
                        this.onDelete(this);
                    }));
                },
                onItemSelect: function(groupId) {},
                onDelete: function() {}
            }
        },

        "-constructor-": {
            initialize: function(params) {
                this.initTempVar(params.item);
                this.overrided(params);
                this.init();
            }
        }
    });
    return Item;
});
