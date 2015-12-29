define([
    "dojo/on",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/dom-construct",
    "qfacex/dijit/ITemplated",
    "utilhub/ItemsControl",
    "qscript/lang/Class",
    "bundle!dependencies/services/group_srv",
    "bundle!dependencies/services/topNavbar_ctrl",
    "./Carousel",
    "./publics/Panel",
    "text!../templates/public.html"
], function(on, domStyle, domClass, domConstruct, ITemplated, ItemsControl, Class, groupSrv,
    TopNavbarCtrl, Carousel, Panel, template) {
    return Class.declare({
        "-parent-": ItemsControl,
        "-interfaces-": [ITemplated],
        "-protected-": {
            "-fields-": {
                app: null,
                templateString: template,
                itemData: null,
                config: {
                    logo: {
                        src: "logo.png",
                        title: "utilhub"
                    },
                    navs: [{
                        key: "view",
                        name: "校情概览",
                        firstPage: true
                    }, {
                        key: "people",
                        name: "人才培养"
                    }, {
                        key: "science",
                        name: "科学研究"
                    }, {
                        key: "culture",
                        name: "校园文化"
                    }],
                    carousel: {
                        items: [{
                            image: "slide1.png",
                            text: "slide1"
                        }, {
                            image: "slide2.png",
                            text: "slide2"
                        }, {
                            image: "slide3.png",
                            text: "slide3"
                        }]
                    },
                    rows: [{
                        header: {
                            text: "通知通告"
                        },
                        itemData: [{
                            id: 1,
                            title: "校园招聘会"
                        }, {
                            id: 2,
                            title: "计算机程序设计大赛"
                        }, {
                            id: 3,
                            title: "数学竞赛通知"
                        }],
                        footer: {
                            remove: true
                        }
                    }, {
                        header: {
                            text: "专题链接"
                        },
                        itemData: [{
                            id: 11,
                            title: "公共招聘系统"
                        }, {
                            id: 12,
                            title: "学生创新论坛"
                        }, {
                            id: 13,
                            title: "虚拟仿真实验室"
                        }, {
                            id: 14,
                            title: "建设建议箱"
                        }, {
                            id: 15,
                            title: "教育实践论坛"
                        }],
                        footer: {
                            remove: true
                        }
                    }, {
                        header: {
                            text: "学术活动"
                        },
                        itemData: [{
                            id: 21,
                            title: "名师讲座"
                        }, {
                            id: 22,
                            title: "名校公开课"
                        }, {
                            id: 23,
                            title: "精品课程"
                        }],
                        footer: {
                            remove: true
                        }
                    }, {
                        header: {
                            text: "校园新闻"
                        },
                        itemData: [{
                            id: 31,
                            title: "第八届文化遗产保护月闭幕"
                        }, {
                            id: 32,
                            title: "名家论坛"
                        }, {
                            id: 33,
                            title: "民族音乐会"
                        }],
                        footer: {
                            remove: true
                        }
                    }]
                }
            },
            "-methods-": {
                init: function() {
                    groupSrv.getMembers(this.groupId).then(Function.hitch(this, function() {
                        this.fillHeader();
                        this.fillContent();
                    }));
                },

                fillHeader: function() {
                    if (this.config.logo) this.initLogo(this.config.logo);
                    if (this.config.navs) this.initNavs(this.config.navs);
                    var self = this;
                    if (!groupSrv.checkMemberExist(this.groupId, runtime.currentUserId)) {
                        domConstruct.create("span", {
                            "class": "btn",
                            innerHTML: "JOIN",
                            onclick: Function.hitch(self, "onJoin")
                        }, self.headerNode, "last");
                    }
                },
                onJoin: function() {},
                fillContent: function() {
                    if (this.config.carousel) this.initCarousel(this.config.carousel);
                    if (this.config.rows) this.initRowContent(this.config.rows);
                },
                initLogo: function(logo) {
                    var logoDiv = domConstruct.create("div", {
                        "class": "logo",
                        title: logo.title
                    }, this.headerNode, "first");
                    domConstruct.create("img", {
                        src: require.toUrl(this.fullBundleUrl + "/resources/images/" + logo.src)
                    }, logoDiv);
                    domConstruct.create("h2", {
                        "class": "",
                        innerHTML: this.itemData.name
                    }, this.headerNode);
                },
                initNavs: function(navsData) {
                    var navs = {},
                        firstNav;
                    navsData.forEach(function(nav, index) {
                        navs[nav.key] = {
                            name: nav.name,
                            callback: "showPage"
                        };
                        if (nav.firstPage) firstNav = nav;
                    }, this);
                    this.navbar = TopNavbarCtrl.createInstance({
                        navItemsData: navs,
                        host: this
                    });
                    this.headerNode.appendChild(this.navbar.domNode);
                    this.navbar.selectItemByKey(firstNav.key);
                },

                initCarousel: function(config) {
                    var carousel = new Carousel({
                        config: this.config,
                        fullBundleUrl: this.fullBundleUrl
                    });
                    this.contentNode.appendChild(carousel.domNode);
                    $('.carousel').carousel();
                },

                initRowContent: function(rows) {
                    var rowContainer = domConstruct.create("div", {
                        "class": "row"
                    }, this.contentNode);
                    rows.forEach(function(row) {
                        var rowDiv = domConstruct.create("div", {
                            "class": "col-sm-4"
                        }, rowContainer);
                        var panel = new Panel({
                            itemData: row.itemData,
                            header: row.header,
                            footer: row.footer
                        });
                        rowDiv.appendChild(panel.domNode);
                    }, this);
                }
            }
        },
        "-public-": {
            "-attributes-": {
                groupId: {
                    getter: function() {
                        return this.itemData.id;
                    }
                },
                fullBundleUrl: {
                    getter: function() {
                        return runtime.getFullBundleUrl("groups:ihudao.com:group");
                    }
                }
            },
            "-methods-": {
                showPage: function(item) {

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
});
