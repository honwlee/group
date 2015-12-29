define([
    "dojo/on",
    "dojo/string",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    // "text!../../templates/views/memberProfile.html",
    "i18n!../../nls/app",
    "i18n!utilhub/front/system/nls/common",
    "qscript/lang/Class",
    "bundle!dependencies/services/profile_ctrl"
], function(on, stringUtil, domClass, domStyle, domConstruct, nlsApp, nlsCommon,
    Class, ProfileCtrl) {
    return Class.declare({
        "-parent-": ProfileCtrl.getControlClass(),
        "-protected-": {
            "-fields-": {
                nls: nlsCommon,
                baseClass: "member-profile",
                isAdmin: false, // currentUser is admin or not
                isSuperAdmin: false, // currentUser is super admin or not
                fontAwesome: FontAwesome,
                actions: [],
                descData: null
            },
            "-methods-": {
                init: function() {
                    // define event methods such as onItem_remove
                    this.actions.forEach(function(action, index) {
                        var funcName = "onItem_" + action;
                        if (!this._.itemEvtInited) this.defineEvtMethod(funcName);
                    }, this);
                    this.overrided();
                    if (this.isAdmin) this.initManager();
                },

                initAccountInfo: function() {

                },

                initManager: function() {
                    this.initAccountInfo();
                    if (this.item.user.id === runtime.currentUserId) {
                        return;
                    } else {
                        var self = this,
                            actions = {
                                forbidden: {
                                    name: nlsApp.forbiddenMember,
                                    icon: FontAwesome.forbidden,
                                    funcName: "onItem_forbidden"
                                },
                                remove: {
                                    name: nlsApp.removeMember,
                                    icon: FontAwesome.deleteIcon,
                                    funcName: "onItem_remove"
                                }
                            },
                            div = this.managerDiv = domConstruct.create("div", {
                                "class": "manager-actions "
                            }),
                            i = domConstruct.create("i", {
                                "class": FontAwesome.ellipsis
                            }, div),
                            ul = domConstruct.create("ul", {
                                "class": "list-group shadow-z-1"
                            }, div),
                            initActionItem = function(item) {
                                var li = domConstruct.create("li", {
                                    "class": "list-group-item  action-item",
                                    onclick: Function.hitch(self, item.funcName, self)
                                }, ul);
                                domConstruct.create("span", {
                                    innerHTML: item.name
                                }, li);
                                domConstruct.create("i", {
                                    "class": item.icon
                                }, li);
                            };
                        if (this.role && this.isSuperAdmin) {
                            if (this.role.isAdmin) {
                                actions.normal = {
                                    name: nlsApp.setAsNormal,
                                    icon: FontAwesome.superAdmin,
                                    funcName: "onItem_setAsNormal"
                                };
                            } else {
                                actions.admin = {
                                    name: nlsApp.setAsAdmin,
                                    icon: FontAwesome.superAdmin,
                                    funcName: "onItem_setAsAdmin"
                                };
                            }
                        }
                        for (var key in actions) {
                            initActionItem(actions[key]);
                        }
                        domConstruct.place(div, this.domNode, "last");

                    }
                }
            }
        },

        "-public-": {
            "-attributes-": {
                profileDesc: {
                    "default": {
                        // baseClass: "profile-panel",
                        // headerClass: "profile-header",
                        // headerName:"",
                        actionClass: "profile-data",
                        itemClass: "",
                        actionItems: []
                    },
                    setter: function(data) {
                        var defaultData = Object.clone(this.profileDesc);
                        Object.mixin(defaultData, data);
                        this._.profileDesc = defaultData;
                    }
                },

                role: {
                    getter: function() {
                        return this.item.role;
                    }
                }
            },

            "-methods-": {
                updateManager: function(itemData) {
                    this.item = itemData;
                    domConstruct.destroy(this.managerDiv);
                    this.initManager();
                }
            }
        },

        "-constructor-": {
            initialize: function(params) {
                var user = params.item.user;
                this.descData = {
                    name: user.username,
                    content: user.profile.summary,
                    avatar: user.avatar,
                    hoverAvatar: user.avatar,
                    banner: user.profile.banner.normal
                };
                this.profileDesc = {
                    itemClass: "",
                    actionItems: actionItems = [{
                        name: "posts",
                        num: user.postCount
                    }, {
                        name: "followers",
                        num: user.followersCount
                    }, {
                        name: "following",
                        num: user.followsCount
                    }]
                };
                this.overrided(params);
            }
        }
    });
});