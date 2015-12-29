define([
    "qscript/lang/Array",
    "dojo/on",
    "dojo/topic",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/dom-geometry",
    "dojo/dom-construct",
    "i18n!../nls/app",
    "text!../templates/discover.html",
    "bundle!dependencies/services/topNavbar_ctrl",
    "bundle!dependencies/services/iPopPage_lib#module",
    "bundle!dependencies/services/breadcrumbs_ctrl",
    "bundle!dependencies/services/masonry_ctrl",
    "bundle!dependencies/services/group_srv",
    "utilhub/front/comctrls/BaseUi",
    "qscript/lang/Class",
    "bundle!context",
    "./List",
    "./Item",
    "./filters/School",
    "./filters/Interest",
    "qfacex/dijit/container/BorderContainer",
    "qfacex/dijit/container/ContentPane"
], function(array, on, topic, domStyle, domClass, domGeom, domConstruct, nlsApp, template,
    TopNavbarCtrl, IPopPage, BreadcrumbsCtrl, MasonryCtrl, groupSrv,
    BaseUi, Class, context, List, Item, School, Interest) {
    return Class.declare({
        "-parent-": BaseUi,
        "-interfaces-": [IPopPage],
        "-protected-": {
            "-fields-": {
                fontAwesome: FontAwesome,
                "$$contentTemplate": template,
                baseClass: "discover",
                style: "width:100%;height:100%",
                nls: nlsApp,
                "_": {
                    pageNum: 2
                },
                topInitHeight: 40
            },

            "-methods-": {
                init: function() {
                    this.overrided();
                    this.initNav();
                    this.initBreadCrumbs();
                    this.initList();
                    domStyle.set(this.filterNode, "display", "none");
                    this.popPage = this.initPopPage(true);
                    this.domNode.appendChild(this.popPage.domNode);
                },

                initList: function() {
                    var memory = groupSrv.getMemory();
                    this.list = MasonryCtrl.createInstance({
                        memory: memory,
                        isScrollPage: true,
                        masonryOpts: {
                            itemSelector: 'grid-item',
                            isAnimated: true
                        },
                        totalPage: groupSrv.getTotalPage(),
                        itemOpts: {
                            actions: ["select"],
                            classObj: Item
                        },
                        filterOpts: this.filterOpts,
                        loadNextFunc: Function.hitch(this, "loadNextPage")
                    });
                    this.list.region = "center";
                    this.mainNode.addChild(this.list);
                },

                doFilter: function() {
                    domStyle.set(this.filterNode, "display", "");
                    var obj = this.currentNavPage.initAllBtnOpts();
                    this.addBread(obj);

                    var fbox = domGeom.getMarginBox(this.filterNode);
                    this.navbar.changeItemName("filter", nlsApp.noFilter);
                    this.filtered = true;
                    return this.topInitHeight + fbox.h;
                },

                delFilter: function() {
                    domStyle.set(this.filterNode, "display", "none");
                    this.filtered = false;
                    this.navbar.changeItemName("filter", nlsApp.filter);
                    return this.topInitHeight;
                },

                filter: function() {
                    var height = this.filtered ? this.delFilter() : this.doFilter();
                    domStyle.set(this.topNode.domNode, "height", height + "px");
                    this.resize();
                },

                initBreadCrumbs: function() {
                    var self = this;
                    this.breadcrumb = BreadcrumbsCtrl.createInstance({
                        deleteOlder: true
                    });
                    on(this.breadcrumb, "itemClick", function(item) {
                        var key = item.catKey || "province";
                        self.currentNavPage.initSubItem(key, item.activeItem);
                        self.fillByItem(item);
                    });
                    this.breadcrumbsNode.appendChild(this.breadcrumb.domNode);
                },

                initNav: function() {
                    var subNav = {
                        school: {
                            name: nlsApp.school,
                            "objClass": School,
                            container: this.catsNode,
                            callback: "schoolCbk"
                        },
                        interest: {
                            name: nlsApp.interest,
                            "objClass": Interest,
                            container: this.catsNode,
                            callback: "interestCbk"
                        },
                        filter: {
                            name: nlsApp.filter,
                            container: this.catsNode,
                            iconClass: "navbar-right",
                            callback: "filter",
                            withoutSelected: true
                        }
                    };
                    this.navbar = TopNavbarCtrl.createInstance({
                        navItemsData: subNav,
                        host: this
                    });
                    this.navNode.appendChild(this.navbar.domNode);
                    this.navbar.selectItemByKey("school");
                },

                initQueryOpts: function(item) {
                    if (item.isOrg) {
                        return item.isRoot ? {
                            rootOrgId: item.key
                        } : {
                            orgId: item.key
                        };
                    } else if (item.isYear) {
                        return {
                            catName: item.key
                        };
                    }
                },

                newItem: function(item) {
                    this.list.newItem(item);
                },

                getFilterString: function(item) {
                    var org = item.activeItem;
                    return "org_id=" + org.id;
                },

                loadNextPage: function() {
                    var deferred = new Deferred(),
                        self = this,
                        filter,
                        qOpts = this.filterOpts.queryOpts;
                    if (qOpts) {
                        switch (Object.keys(qOpts)[0]) {
                            case "rootOrgId":
                                filter = "org_id=" + qOpts["rootOrgId"];
                                break;
                            case "orgId":
                                filter = "org_id=" + qOpts["orgId"];
                                break;
                        }
                    }
                    groupSrv.initByPage(this._.pageNum, filter).then(function(items) {
                        self._.pageNum += 1;
                        deferred.resolve(items);
                    });
                    return deferred.promise;
                }
            }
        },

        "-public-": {
            "-attributes-": {
                app: {
                    getter: function() {
                        return this.mainLayout.app;
                    }
                },
                currentNav: {
                    getter: function() {
                        return this.navbar.currentItem;
                    }
                },
                currentNavPage: {
                    getter: function() {
                        return this.navbar.currentPage;
                    }
                },
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
                    this.fillContent();
                },
                search: function(value) {
                    this.delFilter();
                    groupSrv.queryByName(value).then(Function.hitch(this.list, "search"));
                },

                searchDel: function() {
                    this.list.searchDel();
                },

                addBread: function(item) {
                    this.breadcrumb.addItem(item);
                },

                fillByItem: function(item) {
                    var self = this;
                    if (!item.activeItem || !item.key || item.isAll) {
                        self.fillContent();
                    } else {
                        var org = item.activeItem.org;
                        groupSrv.initByPage(1, "org_id=" + org.id).then(function(groups) {
                            self.fillContent({
                                orgId: org.id
                            });
                        });
                    }
                },
                fillContent: function(opts) {
                    this.list.filter(opts || {});
                },
                allCbk: function(pages, name) {
                    var all = pages[name].page;
                    if (all) this.fillContent();
                },
                schoolCbk: function(pages, name) {
                    var school = pages[name].page;
                    if (school) {
                        if (!this.schoolInited) {
                            var self = this;
                            on(school, "catSelect", function(args) {
                                // args: key, name, catItem(当前的li) parentKey(上一层元素) activeItem
                                self.fillByItem(args);
                                self.addBread(args);
                            });
                            this.schoolInited = true;
                        } else {
                            school.initSubItem("province");
                        }
                    }
                },
                interestCbk: function(pages, name) {
                    var interest = pages[name].page;
                    if (interest) {

                    }
                },

                resize: function(args) {
                    this.overrided(args);
                    this.mainNode.resize(args);
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
