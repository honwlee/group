define([
    "dojo/on",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/event",
    "qscript/lang/Array",
    "i18n!../../nls/app",
    "i18n!utilhub/front/system/nls/common",
    "qscript/lang/Class",
    "qfacex/dijit/ITemplated",
    "utilhub/ItemsControl",
    "bundle!dependencies/services/masonry_ctrl",
    "./MemberProfile",
    "bundle!dependencies/services/group_srv"
], function(on, domClass, domStyle, domConstruct, event, array, nlsApp, nlsCommon,
    Class, ITemplated, ItemsControl, MasonryCtrl, MemberProfile, groupSrv) {
    return Class.declare({
        "-parent-": ItemsControl,
        "-interfaces-": [ITemplated],
        "-protected-": {
            "-fields-": {
                templateString: "<div></div>",
                nls: nlsApp,
                isAdmin: false,
                isSuperAdmin: false,
                groupId: null,
                "_": {
                    pageNum: 2
                },
                fontAwesome: FontAwesome
            },
            "-methods-": {
                init: function() {
                    this.initList();
                },

                initList: function() {
                    var self = this;
                    var list = this.list = MasonryCtrl.createInstance({
                        memory: this.membersMemory,
                        isScrollPage: true,
                        masonryOpts: {
                            itemSelector: 'member-profile',
                            isAnimated: true
                        },
                        itemOpts: {
                            initOpts: {
                                isAdmin: self.isAdmin,
                                isSuperAdmin: self.isSuperAdmin
                            },
                            actions: ["select", "forbidden", "remove", "setAsNormal", "setAsAdmin"],
                            classObj: MemberProfile
                        },
                        filterOpts: self.filterOpts,
                        loadNextFunc: Function.hitch(self, "loadNextPage")
                    });
                    this.addChild(list);
                    on(list, "item_forbidden", function(itemInstance) {

                    });
                    on(list, "item_remove", function(itemInstance) {
                        groupSrv.removeMember({
                            groupId: self.groupId,
                            userId: itemInstance.item.user.id
                        }).then(function() {
                            list.removeItem(itemInstance.domNode);
                        });
                    });
                    on(list, "item_setAsNormal", function(itemInstance) {
                        groupSrv.setNormal({
                            groupId: self.groupId,
                            userId: itemInstance.item.user.id
                        }).then(function(member) {
                            itemInstance.updateManager(member);
                        });
                    });
                    on(list, "item_setAsAdmin", function(itemInstance) {
                        groupSrv.setAdmin({
                            groupId: self.groupId,
                            userId: itemInstance.item.user.id
                        }).then(function(member) {
                            itemInstance.updateManager(member);
                        });
                    });
                },

                newItem: function(member) {
                    this.list.addItem(member);
                },

                loadNextPage: function() {
                    var deferred = new Deferred(),
                        self = this;
                    groupSrv.getMembers(this.groupId, this._.pageNum).then(function(items) {
                        self._.pageNum += 1;
                        deferred.resolve(items);
                    });
                    return deferred.promise;
                }
            }
        },

        "-public-": {
            "-attributes-": {
                filterOpts: {
                    "default": {
                        sortOpts: {
                            name: "createdAt"
                        },
                        queryOpts: {},
                        newPaginate: true
                    },
                    setter: function(opts) {
                        this._.filterOpts = opts;
                    }
                }
            },
            "-methods-": {
                layoutStart: function() {
                    // this.list.resize();
                },

                initData: function() {
                    var deferred = new Deferred(),
                        self = this;
                    groupSrv.getMembers(this.groupId).then(function(memory) {
                        self.membersMemory = memory;
                        self.init();
                        deferred.resolve();
                    });
                    return deferred.promise;
                },

                resize: function() {
                    if (this.list) this.list.resize();
                },

                onProfileItemClick: function() {},

                search: function(name) {
                    if (self.membersMemory) self.membersMemory.query({
                        name: name,
                        reg: true
                    });
                }
            }
        },

        "-constructor-": {
            initialize: function(params) {
                this.overrided(params);
            }
        }
    });
});
