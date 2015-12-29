define([
    "dojo/on",
    "dojo/mouse",
    "dojo/topic",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "i18n!../nls/app",
    "i18n!utilhub/front/system/nls/common",
    "text!../templates/add.html",
    "qfacex/dijit/ITemplated",
    "utilhub/front/_q_/desktop/dialog",
    "utilhub/ItemsControl",
    "qscript/lang/Class",
    "bundle!dependencies/services/iPopPage_lib#module",
    "bundle!dependencies/services/topNavbar_ctrl",
    "bundle!dependencies/services/univFilter_ctrl",
    "bundle!dependencies/services/breadcrumbs_ctrl",
    "bundle!dependencies/services/group_srv",
    "./filters/School",
    "./filters/Interest"
], function(on, mouse, topic, domClass, domStyle, domConstruct, nlsApp, nlsCommon, template, ITemplated,
    qDialog, ItemsControl, Class, IPopPageLib, TopNavbarCtrl, UnivFilterCtrl, BreadcrumbsCtrl,
    groupSrv, School, Interest) {
    var Add = Class.declare({
        "-parent-": ItemsControl,
        "-interfaces-": [ITemplated, IPopPageLib],
        "-protected-": {
            "-fields-": {
                nls: nlsApp,
                templateString: template,
                baseClass: "group-add",
                fontAwesome: FontAwesome,
                postData: {}
            },
            "-methods-": {
                init: function() {
                    this.initBreadCrumbs();
                    this.initNav();
                    this.popPage = this.initPopPage(true);
                    this.domNode.appendChild(this.popPage.domNode);
                    on(this.filterNode, "click", Function.hitch(this, "showFilterPop"));
                    this.eventBind();
                },
                initNav: function() {
                    var nav = {
                        "class": {
                            name: "班级",
                            container: this.navNode,
                            callback: "navCbk",
                            opts: {
                                key: "Class"
                            }
                        },
                        college: {
                            name: "社团",
                            container: this.navNode,
                            callback: "navCbk",
                            opts: {
                                key: "College"
                            }
                        },
                        interest: {
                            name: "兴趣",
                            container: this.navNode,
                            callback: "navCbk",
                            opts: {
                                key: "Interest"
                            }
                        }
                    };
                    this.navbar = TopNavbarCtrl.createInstance({
                        navItemsData: nav,
                        host: this
                    });
                    this.navNode.appendChild(this.navbar.domNode);
                    this.navbar.selectItemByKey("class");
                },

                eventBind: function() {
                    this.own(
                        on(this.saveBtnNode, "click", Function.hitch(this, "add"))
                    );
                },

                initBreadCrumbs: function() {
                    var self = this;
                    this.breadcrumb = BreadcrumbsCtrl.createInstance({
                        deleteOlder: true
                    });
                    on(this.breadcrumb, "itemClick", function(item) {

                    });
                    this.breadcrumbsNode.appendChild(this.breadcrumb.domNode);
                },

                showFilterPop: function() {
                    var self = this,
                        univ = UnivFilterCtrl.createInstance({});
                    on(univ, "itemClick", function() {

                    });
                    on(univ, "addItem", function(item) {
                        self.breadcrumb.addItem(item);
                    });

                    on(univ, "removeItem", function(item) {
                        self.breadcrumb.hideItem(item);
                    });
                    on(univ, "orgSelect", function() {
                        self.hidePopPage();
                    });
                    on(univ, "yearCatSelect", function() {
                        self.hidePopPage();
                    });
                    // this.showPopPage(univ.domNode);
                    this.showPopPage(univ.domNode);
                },

                initFilter: function(type) {
                    Function.hitch(this, "init" + type)();
                },

                initClass: function() {
                    if (this.school) return;
                    var self = this,
                        school = this.school = new School({
                            app: this.app
                        });
                    on(school, "catSelect", function(args) {
                        // args: key, name, catItem(当前的li) parentKey(上一层元素) activeItem
                        self.addBread(args);
                        if (args.isYear) {
                            domStyle.set(school.domNode, "display", "none");
                            self.postData.catName = args.key;
                            self.postData.orgId = args.parentKey;
                        }
                    });
                    this.filterNode.appendChild(school.domNode);
                    school.startup();
                    var obj = school.initAllBtnOpts();
                    this.addBread(obj);
                },

                initInterest: function() {
                    if (this.interset) return;
                    var self = this,
                        interset = this.interset = new Interest({
                            app: this.app
                        });
                    on(interset, "catSelect", function(args) {

                    });
                    this.filterNode.appendChild(interset.domNode);
                    interset.startup();
                },

                initCollege: function() {
                    if (this.college) return;
                    var self = this,
                        college = this.college = new School({
                            app: this.app
                        });
                    on(college, "catSelect", function(args) {
                        // args: key, name, catItem(当前的li) parentKey(上一层元素) activeItem
                        self.addBread(args);
                        if (args.isYear) {
                            domStyle.set(school.domNode, "display", "none");
                            self.postData.catName = args.key;
                            self.postData.orgId = args.parentKey;
                        }
                    });
                    this.filterNode.appendChild(college.domNode);
                    college.startup();
                    var obj = college.initAllBtnOpts();
                    this.addBread(obj);
                },

                add: function() {
                    var name = this.nameNode.value;
                    if (name === "") {
                        qfaceDialog.alert({
                            message: "Name can't be empty!"
                        });
                    }
                    var self = this,
                        data = {
                            name: name
                        };
                    var item = this.breadcrumb.getLastItem();
                    if (item) {
                        data.category_id = item.key.match(/cat_(\d+)/)[1];
                        data.org_id = item.parentKey.match(/org_(\d+)/)[1];
                    }
                    Function.mixin(data, this.postData);
                    groupSrv.addGroup(data).then(function(cBData) {
                        if (cBData.status) {
                            self.onAdd(cBData.group);
                        } else {
                            qDialog.alert({
                                message: cBData.msg
                            });
                        }
                    });
                },

                onAdd: function(group) {}
            }
        },

        "-public-": {
            "-attributes-": {
                app: {
                    getter: function() {
                        return this.mainLayout.app;
                    }
                },
                nlsCommon: {
                    getter: function() {
                        return nlsCommon;
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
                }
            },
            "-methods-": {
                addBread: function(item) {
                    this.breadcrumb.addItem(item);
                },
                navCbk: function(pages, name, args) {
                    var item = pages[name];
                    this.initFilter(item.opts.key);
                },
                resize: function() {
                    domStyle.set(this.domNode, {
                        height: "100%",
                        width: "100%"
                    });
                }

            }
        },

        "-constructor-": {
            initialize: function(params) {
                this.overrided(params);
                this.init();
            }
        }
    });
    return Add;
});
