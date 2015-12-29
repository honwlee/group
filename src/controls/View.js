define([
    "dojo/on",
    "dojo/topic",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-geometry",
    "dojo/dom-construct",
    "i18n!../nls/app",
    "qscript/lang/Class",
    "utilhub/front/scenes/Scene",
    "utilhub/front/comctrls/BaseUi",
    "utilhub/front/comctrls/IListStyle",
    "text!../templates/view.html",
    "bundle!dependencies/services/blog_srv",
    "bundle!dependencies/services/group_srv",
    "bundle!dependencies/services/topNavbar_ctrl",
    "bundle!dependencies/services/article_ctrl",
    "bundle!dependencies/services/reshare_ctrl",
    "bundle!dependencies/services/timeline_ctrl",
    "bundle!dependencies/services/setting_ctrl",
    "bundle!dependencies/services/iPopPage_lib#module",
    "bundle!context",
    "./Public",
    "./views/Members",
    "./views/Activities",
    "./views/AddMember",
    "utilhub/front/EmbeddedDesktop",
    "qfacex/dijit/container/BorderContainer",
    "qfacex/dijit/container/ContentPane"
], function(on, topic, domClass, domStyle, domGeom, domConstruct, nlsApp, Class, Scene, BaseUi,
    IListStyle, template, blogSrv, groupSrv, TopNavbarCtrl, ArticleCtrl, ReshareCtrl, TimelineCtrl,
    SettingCtrl, IPopPage, context,
    Public, Members, Activities, AddMember, EmbeddedDesktop) {
    var View = Class.declare({
        "-parent-": BaseUi,
        "-interfaces-": [IPopPage, IListStyle],
        "-protected-": {
            "-fields-": {
                baseClass: "groupView",
                "$$contentTemplate": template,
                fontAwesome: FontAwesome,
                nls: nlsApp,
                itemData: null
            },

            "-methods-": {
                init: function() {
                    this.overrided();
                    // this.initProfilePanel();
                    this.initNavs();
                    this.popPage = this.initPopPage(true);
                    this.domNode.appendChild(this.popPage.domNode);
                    // on(this.popPage, "hide", Function.hitch(this, function() {
                    //     this.navbar.showPrevPage();
                    // }));
                },

                initActions: function() {
                    this.actions.forEach(function(action) {
                        domConstruct.create("a", {
                            "class": "btn btn-default btn-small",
                            innerHTML: action,
                            onclick: Function.hitch(this, action + "Action")
                        }, this.actionsNode);
                    }, this);
                },

                initNavs: function() {
                    var navs = {
                        // "public": {
                        //     name: nlsApp["public"],
                        //     "objClass": Public,
                        //     container: this.contentNode,
                        //     callback: "publicCbk",
                        //     opts: {
                        //         app: this.app,
                        //         region: 'center',
                        //         itemData: this.itemData
                        //     }
                        // },
                        tweets: {
                            name: nlsApp.tweets,
                            callback: "tweetCallback"
                        },
                        members: {
                            name: nlsApp.members,
                            "objClass": Members,
                            container: this.contentNode,
                            iconClass: "",
                            callback: "selectPageCallback",
                            opts: {
                                isDeferred: true,
                                isAdmin: this.isAdmin,
                                isSuperAdmin: this.isSuperAdmin,
                                style: "width:100%;height:100%",
                                region: 'center',
                                groupId: this.groupId
                            }
                        },
                        desktop: {
                            name: nlsApp.desktop,
                            callback: "desktopCbk"
                        },
                        show: {
                            name: "查看",
                            "objClass": ArticleCtrl.getControlClass(),
                            alwaysRefresh: true,
                            hidden: true,
                            container: this.contentNode,
                            opts: {
                                "class": "show-item",
                                region: "center"
                            },
                            callback: "showCbk"
                        }
                    };
                    if (this.isAdmin) {
                        Function.mixin(navs, {
                            addMember: {
                                name: nlsApp.addMember,
                                "objClass": AddMember,
                                hidden: false,
                                withoutSelected: true,
                                opts: {
                                    groupId: this.groupId
                                },
                                isPopPage: true,
                                container: this.contentNode,
                                callback: "addMemberClick"
                            },

                            setting: {
                                name: nlsApp.setting,
                                "objClass": SettingCtrl.getControlClass(),
                                iconClass: FontAwesome.setting,
                                hidden: false,
                                opts: {
                                    region: "center",
                                    app: this.app
                                },
                                callback: "settingCbk",
                                container: this.contentNode
                            }
                            // setting: {
                            //     name: nlsApp.setting,
                            //     withoutSelected: true,
                            //     isDropdown: true,
                            //     dropdownList: [{
                            //         name: "join",
                            //         callback: "joinClick"
                            //     }, {
                            //         name: "sharing",
                            //         callback: "sharingClick",
                            //         divider: true
                            //     }, {
                            //         name: "addMember",
                            //         callback: "addMemberClick",
                            //         divider: true
                            //     }]
                            // }
                        });
                    }
                    this.navbar = TopNavbarCtrl.createInstance({
                        navItemsData: navs,
                        region: "top",
                        host: this
                    });
                    var self = this;
                    this.navbar.addNewItem(this.initListStyle(self.contentNode.domNode), "first");
                    on(this, "oBaBtnClick", function() {
                        self.currentNavPage.list.resize();
                    });
                    on(this, "nBaBtnClick", function() {
                        self.currentNavPage.list.resize();
                    });
                    on(this.navbar, "selectItem", function() {
                        self.hideListStyle();
                    });
                    this.topNode.content = this.navbar;
                    this.navbar.selectItemByKey("tweets");
                },

                initDesktop: function() {
                    var self = this,
                        deferred = new Deferred();
                    groupSrv.initScene(this.groupId).then(function(sceneConfig) {
                        var desktop = self.desktop = new EmbeddedDesktop();
                        desktop.init(sceneConfig.scene).then(function() {
                            desktop.mainBorder.region = "center";
                            self.contentNode.addChild(desktop.mainBorder);
                            // self.navbar.addDropdownItem("setting", {
                            //     name: "addToDesktop",
                            //     callback: "followScene",
                            //     divider: true
                            // });
                            deferred.resolve(desktop);
                        });
                    });
                    return deferred.promise;
                },
                ajustDom: function(container) {
                    // if (container) {
                    //     var dom = container.domNode ? container.domNode : container;
                    //     domClass.add(dom, "view-item-page");
                    //     $(dom).children().wrapAll("<div class='mid-layout'></div>");
                    // }
                }
            }
        },

        "-public-": {
            "-attributes-": {
                currentItem: {
                    setter: function(item) {
                        var olderItem = this.currentItem;
                        if (olderItem) domClass.remove(olderItem.liNode, "active");
                        domClass.add(item.liNode, "active");
                        this._.currentItem = item;
                    }
                },

                currentNavPage: {
                    getter: function() {
                        return this.navbar.currentItem.page;
                    }
                },

                isAdmin: {
                    getter: function() {
                        if (this.itemData.adminInfo && this.itemData.adminInfo.role) {
                            return this.itemData.adminInfo.role.isAdmin;
                        } else {
                            return false;
                        }
                    }
                },

                isSuperAdmin: {
                    getter: function() {
                        if (this.itemData.adminInfo && this.itemData.adminInfo.role) {
                            return this.itemData.adminInfo.role.isSuper;
                        } else {
                            return false;
                        }
                    }
                },

                groupId: {
                    getter: function() {
                        return this.itemData.id;
                    }
                },

                app: {
                    getter: function() {
                        return this.mainLayout.app;
                    }
                },
                fullBundleUrl: {
                    getter: function() {
                        return runtime.getFullBundleUrl("groups:ihudao.com:group");
                    }
                }
            },

            "-methods-": {
                selectPage: function(pageName, opts) {
                    var deferred = new Deferred(),
                        self = this;
                    this.navbar.selectItemByKey(pageName, opts).then(function(page) {
                        deferred.resolve(page);
                    });
                    return deferred.promise;
                },
                tweetCallback: function(pages, name, data) {
                    var self = this;
                    this.timeline = pages[name].page;
                    this.showListStyle();

                    if (!self.timeline) {
                        groupSrv.getTweets(this.groupId).then(function(memory) {
                            var timeline = TimelineCtrl.createInstance({
                                withoutRecomends: true,
                                groupId: self.groupId,
                                memory: memory,
                                loadNextPage: function() {
                                    var deferred = new Deferred(),
                                        timelineSelf = this,
                                        qOpts = this.filterOpts.queryOpts;
                                    groupSrv.getTweets(self.groupId, this._.pageNum).then(function(items) {
                                        timelineSelf._.pageNum += 1;
                                        deferred.resolve(items);
                                    });
                                    return deferred.promise;
                                }
                            });
                            self.bindtimelineEvents(pages, timeline);
                            self.timeline = pages[name].page = timeline;
                            timeline.region = "center";
                            self.contentNode.addChild(timeline);
                        });
                    }
                },
                bindtimelineEvents: function(pages, timeline) {
                    var self = this;
                    if (timeline) timeline.refresh();
                    if (!timeline.listEventListened) {
                        on(timeline.list, "item_show", function(articleInstance) {
                            self.selectPage("show", {
                                itemData: articleInstance.getItemData()
                            });
                        });
                        on(timeline.list, "item_commentFocus", function(articleInstance) {
                            self.selectPage("show", {
                                itemData: articleInstance.getItemData()
                            });
                            var article = pages["show"].page;
                            if (!article._.commentListened) {
                                on(article, "comment", function(articleData, args) {
                                    // args: commentData, userInfo, notiObj, text
                                    article.addCommentRow(args);
                                    if (articleData.comments.length === 1) {
                                        articleInstance.initComment(args.commentData);
                                    }
                                });
                                article._.commentListened = true;
                            }
                        });
                        on(timeline.list, "item_reshare", function(articleInstance) {
                            var reshare = ReshareCtrl.createInstance({
                                itemData: articleInstance.getItemData()
                            });
                            if (reshare._.postListened) {
                                on(reshare, "post", function(data) {
                                    timeline.placeNewArticle(data);
                                    self.hidePopPage();
                                });
                                reshare._.postListened = true;
                            }
                            self.showPopPage(reshare.domNode);
                        });
                        on(timeline, "previewPost", function(postPage) {
                            self.showPopPage(postPage);
                        });
                        on(timeline, "openBlog", function(blogId) {
                            blogSrv.initById(blogId).then(function(data) {
                                self.selectPage("desktop").then(function() {
                                    var launchBlog = function() {
                                        self.desktop.launchByName("Blog").then(function(blogApp) {
                                            blogApp;
                                        });
                                    };
                                    if (!self.desktop) {
                                        self.initDesktop().then(launchBlog)
                                    } else {
                                        launchBlog();
                                    }
                                });
                            });
                        });
                        on(timeline, "sharing", function() {

                        });
                        on(timeline, "publish", function() {
                            self.hidePopPage();
                        });
                        // on(timeline, "openAlbum", Function.hitch(this, "openAlbum"));
                        // on(timeline, "openBlog", Function.hitch(this, "openBlog"));
                        on(timeline, "publishActionClick", function(nodeInstance) {
                            self.showPopPage(nodeInstance.domNode);
                            nodeInstance.startup();
                        });
                        on(timeline, "topicItemClick", function() {

                        });
                        on(timeline, "userItemClick", function() {

                        });
                        on(timeline, "groupItemClick", function() {

                        });
                    }
                },
                showCbk: function(pages, pageName, args) {
                    domStyle.set(this.listStyle, "display", "none");
                    var article = pages[pageName].page;
                    if (article) article.expand();
                    // if (!article.eventListened) {
                    //     this.own(on(addPage, "add", Function.hitch(this, function(group) {
                    //         listPage.newItem(group);
                    //         this.popPage.hide();
                    //     })));
                    //     article.eventListened = true;
                    // }
                },
                selectPageCallback: function(pages, name, data) {
                    this.ajustDom(pages[name].page);
                },
                publicCbk: function(pages, name, args) {
                    var page = pages[name].page;
                    this.ajustDom(page);
                    if (!this._publicJoinInited) {
                        on(page, "join", Function.hitch(this, function() {
                            this.addMember(runtime.currentUserId);
                        }));
                    }
                },

                desktopCbk: function(pages, name, args) {
                    var self = this,
                        page = pages[name].page;
                    if (!page) {
                        if (this.desktop) {
                            pages[name].page = this.desktop.mainBorder;
                        } else {
                            this.showLoading();
                            self.initDesktop().then(function(desktop) {
                                pages[name].page = desktop.mainBorder;
                                self.hideLoading();
                            });
                        }
                    }
                },

                search: function() {

                },

                followScene: function() {
                    groupSrv.followScene(this.groupId).then(function(sceneConfig) {
                        var scene = new Scene({
                            config: sceneConfig.scene
                        });
                        topic.publish("desktop/addScene", scene);
                        scene.init().then(function() {
                            topic.publish("desktop/selectScene", sceneConfig.scene.sceneId);
                        });
                    });
                },

                joinClick: function() {

                },

                sharingClick: function() {

                },

                addMemberClick: function(pages, name, args) {
                    var addPage = pages[name].page,
                        membersPage = pages["members"].page;
                    if (!addPage.eventListened) {
                        this.own(on(addPage, "addMember", Function.hitch(this, function(user) {
                            this.addMember(user.id);
                        })));
                        addPage.eventListened = true;
                    }
                    this.popPage.show(addPage.domNode);
                },

                addMember: function(userId) {
                    var self = this;
                    groupSrv.addMember({
                        groupId: this.groupId,
                        userId: userId
                    }).then(function(member) {
                        self.selectPage("members").then(function(page) {
                            page.newItem(member);
                            self.popPage.hide();
                        });
                    });
                },
                settingCbk: function(pages, pageName, args) {
                    domStyle.set(this.listStyle, "display", "none");
                    var self = this,
                        setting = pages[pageName].page;
                    if (!setting.eventListened) {
                        on(setting, "topStyleSelect", function(className) {
                            self.currentArea.updatePanelBGClass(className);
                        });
                        on(setting, "leftStyleSelect", function(className) {
                            self.updateNavBGClass(className);
                        });
                        on(setting, "loadingStyleSelect", function(className) {
                            self.updateLoadingBGClass(className);
                        });
                        on(setting, "bgStyleSelect", function(className) {
                            self.currentArea.updateDesktopBgClass(className);
                        });
                        setting.eventListened = true;
                    }
                },
                settingAction: function() {}
            }
        },

        "-constructor-": {
            initialize: function(params) {
                this.overrided(params);
                this.init();
            }
        }
    });
    return View;
});
