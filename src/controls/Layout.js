define([
    "dojo/on",
    "dojo/topic",
    "dojo/_base/array",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dojo/dom-style",
    "qfacex/dijit/ITemplated",
    "utilhub/ItemsControl",
    "qscript/utils/ITopicHub",
    "qscript/lang/Class",
    "utilhub/front/comctrls/BaseUi",
    "utilhub/front/comctrls/LeftNavbar",
    "bundle!dependencies/services/topNavbar_ctrl",
    "bundle!dependencies/services/iPopPage_lib#module",
    "text!../templates/layout.html",
    "i18n!../nls/app",
    "bundle!context",
    "./Personal",
    "./View",
    "./Help",
    "./Step",
    "./Setting",
    "qfacex/dijit/container/BorderContainer",
    "qfacex/dijit/button/Button"
], function(on, topic, array, domConstruct, domClass, domStyle, ITemplated, ItemsControl, ITopicHub, Class,
    BaseUi, LeftNavbar, TopNavbarCtrl, IPopPageLib, template, nlsApp, context, Personal, View, Help, Step, Setting) {
    var Layout;
    Layout = Class.declare({
        "-parent-": BaseUi,
        "-interfaces-": [ITopicHub, IPopPageLib],
        "-protected-": {
            "-fields-": {
                "$$contentTemplate": template,
                baseClass: "group",
                fontAwesome: FontAwesome,
                _topicHubName: "group",
                header: {
                    "className": FontAwesome.hideShow,
                    callback: "toggleMenu"
                },
                nls: nlsApp,
                memory: null,
                app: null
            },

            "-methods-": {
                init: function() {
                    this.initTopics();
                    this.overrided();
                    this.popPage = this.initPopPage(true);
                    this.domNode.appendChild(this.popPage.domNode);
                    on(this.popPage, "hide", Function.hitch(this, function() {
                        this.navbar.showPrevPage();
                    }));
                },

                initTopics: function() {
                    var self = this;
                    this.receive("group:selectPage", function(item) {
                        self.selectPage(item);
                    });

                    this.receive("group:showPopPage", function(node) {
                        self.showPopPage(node);
                    });

                    this.receive("group:hidePopPage", function() {
                        self.hidePopPage();
                    });

                    this.receive("group:clearInterval", function() {
                        self.currentGroup.broadcast("groupView:tweet:clearInterval");
                    });

                    this.receive("group:initInterval", function() {
                        self.currentGroup.broadcast("groupView:tweet:initInterval");
                    });
                },

                initNav: function() {
                    this.navItemsData = {
                        // discover: {
                        //     name: "发现",
                        //     "objClass": Discover,
                        //     iconClass: this.fontAwesome.list,
                        //     hidden: false,
                        //     opts: {
                        //         mainLayout: this
                        //     },
                        //     container: this.centerNode,
                        //     callback: "discoverCbk"
                        // },
                        personal: {
                            name: "我的",
                            "objClass": Personal,
                            iconClass: this.fontAwesome.showList,
                            hidden: false,
                            opts: {},
                            container: this.centerNode,
                            callback: "listCallback"
                        },
                        add: {
                            name: nlsApp.add,
                            "objClass": Step,
                            iconClass: this.fontAwesome.blogAdd,
                            hidden: false,
                            opts: {},
                            editing: true,
                            alwaysRefresh: true,
                            isPopPage: true,
                            container: this.centerNode,
                            callback: "navAddCallback"
                        },
                        // help: {
                        //     name: nlsApp.help,
                        //     "objClass": Help,
                        //     hidden: false
                        // },
                        // setting: {
                        //     name: nlsApp.setting,
                        //     "objClass": Setting,
                        //     iconClass: FontAwesome.setting,
                        //     hidden: false,
                        //     opts: {
                        //         itemData: {
                        //             name: "kang",
                        //             headImg: "/filesystem/image/336/normal_3fa4d3e679d18bf0bebcf9219e243576.png",
                        //             following: "10",
                        //             follower: "12",
                        //             order: "6",
                        //             note: "我有一只小毛驴",
                        //             phoneNum: "13979123873",
                        //             email: "21614306@qq.com",
                        //             cardInfo: "46545643512",
                        //             autoGetLatestOrder: true,
                        //             autoGetLatestRemaind: true,
                        //             canAtme: "all",
                        //             canCommentMe: "all",
                        //             haveShielded: "fadfa"
                        //         }

                        //     },
                        //     editing: true,
                        //     container: this.centerNode,
                        //     callback: "updateNav"
                        // },
                        show: {
                            name: "show Group",
                            "objClass": View,
                            iconClass: this.fontAwesome.showList,
                            hidden: true,
                            opts: {},
                            container: this.centerNode,
                            callback: "navShowCallback"
                        }
                    };
                    // if (this.withoutNav) {
                    //     this.navbar = TopNavbarCtrl.createInstance({
                    //         navItemsData: this.navItemsData,
                    //         host: this
                    //     });
                    // } else {
                    this.navbar = new LeftNavbar({
                        navItemsData: this.navItemsData,
                        host: this,
                        header: this.header,
                        hostSearch: true
                    });
                    // }
                    this.navbar.selectItemByKey("personal");
                    this.mainNode.addChild(this.navbar);
                    on(this.navbar, "search", Function.hitch(this, "search"));
                    on(this.navbar, "searchDel", Function.hitch(this, "searchDel"));
                    // this.initSubNav();
                },

                initSubNav: function() {
                    this.memory.data.forEach(function(itemData) {
                        this.navbar.addSubNavItem({
                            name: itemData.name,
                            "objClass": GroupView,
                            nodeClass: "sub-item",
                            iconClass: this.fontAwesome.post,
                            parentName: "listAll",
                            hidden: false,
                            opts: {
                                itemData: itemData
                            },
                            callback: "navShowCallback",
                            container: this.centerNode
                        }, "show-" + itemData.id);
                        // use group's id as navItem's key
                    }, this);
                },

                updateNav: function() {

                }
            }
        },

        "-public-": {
            "-attributes-": {
                currentGroup: {
                    setter: function(group) {
                        // {itemData,group}
                        // this.navbar.showItem("show");
                        this._.currentGroup = group;
                    }
                }
            },

            "-methods-": {
                startup: function() {
                    if (this._started) return;
                    this.overrided();
                    this.initNav();
                    this._started = true;
                },

                search: function(value) {
                    var page = this.navbar.currentPage;
                    if (page && page.search) page.search(value);
                },

                searchDel: function() {
                    var page = this.navbar.currentPage;
                    if (page && page.search) page.searchDel();
                },

                getAppBasePath: function() {
                    return this.app.fullBundle;
                },

                showGroupList: function() {
                    domConstruct.empty(this.centerContainerNode);
                    var groupList = new Discover({
                        mainLayout: this,
                        memory: this.memory
                    });
                    this.centerContainerNode.appendChild(groupList.domNode);
                },

                selectPage: function(itemData) {
                    this.navbar.selectHiddenItem("show", {
                        itemData: itemData
                    });
                    this.navbar.changeItemName("show", itemData.name);
                },
                listCallback: function(pages, name) {
                    var list = pages[name].page;
                    if (!list._.eventListened) {
                        on(list, "itemSelect", Function.hitch(this, "onGroupItemClick"));
                        list._.eventListened = true;
                    }
                },

                navAddCallback: function(pages, name) {
                    var addPage = pages[name].page,
                        listPage = pages["personal"].page;
                    if (!addPage.onAddInited) {
                        this.own(on(addPage, "add", Function.hitch(this, function(group) {
                            listPage.newItem(group);
                            this.popPage.hide();
                        })));
                        addPage.onAddInited = true;
                    }
                    this.popPage.show(addPage.domNode);
                },

                discoverCbk: function(pages, name) {
                    var discover = pages[name].page,
                        self = this;

                    on.once(this.navbar, "pageShow", function() {
                        discover.resize(dojo.position(self.domNode));
                    });
                },

                navShowCallback: function(pages, name) {
                    this.currentGroup = pages[name].page;
                    // if (!group.onAddMemberInited) {
                    //     this.own(on(group, "addMember", Function.hitch(this, function(node) {
                    //         this.popPage.show(node);
                    //     })));
                    //     group.onAddMemberInited = true;
                    // }
                },
                onGroupItemClick: function(item) {
                    this.selectPage(item);
                }
            }
        },

        "-constructor-": {
            initialize: function(params, srcNodeRef) {
                this.overrided(params, srcNodeRef);
                this.init();
            }
        }
    });
    return Layout;
});
