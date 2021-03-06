define([
    "dojo/on",
    "i18n!../nls/app",
    "i18n!utilhub/front/system/nls/common",
    "text!../templates/step/step.html",
    "text!../templates/step/step2_1.html",
    "text!../templates/step/step2_2.html",
    "text!../templates/step/step2_3.html",
    "text!../templates/step/step3.html",
    "text!../templates/step/step4.html",
    "qfacex/dijit/ITemplated",
    "utilhub/front/comctrls/BaseUi",
    "utilhub/ItemsControl",
    "qscript/lang/primitives/utils",
    "qscript/lang/Class",
    "bundle!dependencies/services/univFilter_ctrl",
    "bundle!dependencies/services/breadcrumbs_ctrl",
    "bundle!dependencies/services/group_srv",
    "bundle!dependencies/services/org_srv",
    "bundle!dependencies/services/cat_srv",
    "./filters/School",
    "./filters/Interest",
    "qfacex/dijit/container/BorderContainer",
    "qfacex/dijit/container/ContentPane",
    "qfacex/dijit/container/StackContainer"
], function(on, nlsApp, nlsCommon, stepTpl, step21Tpl, step22Tpl, step23Tpl, step3Tpl,
    step4Tpl, ITemplated, BaseUi, ItemsControl, qUtils, Class, UnivFilterCtrl,
    BreadcrumbsCtrl, groupSrv, orgSrv, catSrv, School, Interest) {
    var BaseStep = Class.declare({
        "-parent-": ItemsControl,
        "-interfaces-": [ITemplated],
        "-protected-": {
            "-fields-": {
                nls: nlsApp,
                nlsCommon: nlsCommon,
                templateString: "<div></div>",
                fontAwesome: FontAwesome,
                nextKey: null
            },
            "-methods-": {
                init: function() {}
            }
        },

        "-public-": {
            "-attributes-": {},
            "-methods-": {
                onStepOver: function(key) {}
            }
        },

        "-constructor-": {
            initialize: function(params) {
                this.overrided(params);
            }
        }
    });
    var Step1 = Class.declare({
        "-parent-": BaseStep,
        "-protected-": {
            "-fields-": {
                templateString: "<div><div class=\"list row\" data-dojo-attach-point=\"listNode\"></div></div>",
                baseClass: "step1",
                keys: null
            },
            "-methods-": {
                init: function() {
                    for (var key in this.keys) {
                        this.initItem(key, this.keys[key]);
                    }
                },

                initItem: function(key, value) {
                    var div = qUtils.domConstruct.create("div", {
                        "class": "item col-xs-6 col-md-3",
                        onclick: Function.hitch(this, function() {
                            this.onStepOver({
                                key: key
                            });
                        })
                    }, this.listNode);
                    var a = qUtils.domConstruct.create("a", {
                        "class": "thumbnail"
                    }, div);
                    qUtils.domConstruct.create("img", {
                        src: ""
                    }, a);
                    qUtils.domConstruct.create("span", {
                        innerHTML: value
                    }, a);
                }
            }
        },

        "-public-": {
            "-attributes-": {

            },
            "-methods-": {}
        },

        "-constructor-": {
            initialize: function(params) {
                this.overrided(params);
                this.init();
            }
        }
    });
    var Step21 = Class.declare({
        "-parent-": BaseStep,
        "-protected-": {
            "-fields-": {
                templateString: step21Tpl,
                baseClass: "step21"
            },
            "-methods-": {
                init: function() {
                    this.bindEvents();
                },

                initOptions: function(node, data) {
                    qUtils.domConstruct.create("option", {
                        value: null,
                        innerHTML: "请选择"
                    }, node);
                    data.forEach(function(info) {
                        qUtils.domConstruct.create("option", {
                            value: info.id,
                            innerHTML: info.name
                        }, node);
                    }, this);
                },

                bindEvents: function() {
                    var self = this;
                    on(this.provinceNode, "change", function() {
                        if (this.value) {
                            [self.univNode, self.schoolNode, self.yearNode].forEach(qUtils.domConstruct.empty);
                            orgSrv.initSubs(this.value).then(function(items) {
                                self.initOptions(self.univNode, items);
                                qUtils.domClass.remove(self.univNode, "disabled");
                            });
                            self.orgId = this.value;
                        } else {
                            self.orgId = null;
                        }
                    });

                    on(this.univNode, "change", function() {
                        if (this.value) {
                            [self.schoolNode, self.yearNode].forEach(qUtils.domConstruct.empty);
                            orgSrv.initSubs(this.value).then(function(items) {
                                self.initOptions(self.schoolNode, items);
                                qUtils.domClass.remove(self.schoolNode, "disabled");
                            });
                            self.orgId = this.value;
                        } else {
                            self.orgId = self.province.value;
                        }
                    });

                    on(this.schoolNode, "change", function() {
                        if (this.value) {
                            qUtils.domConstruct.empty(self.yearNode);
                            catSrv.initYearCats().then(function(items) {
                                self.initOptions(self.yearNode, items);
                                qUtils.domClass.remove(self.yearNode, "disabled");
                            });
                            self.orgId = this.value;
                        } else {
                            self.orgId = self.univNode.value;
                        }
                    });

                    on(this.yearNode, "click", function() {
                        self.catId = parseInt(this.value);
                        if (self.catId) {
                            self.stepOver({
                                key: self.nextKey,
                                catId: self.catId,
                                orgId: self.orgId
                            });
                        }
                    });

                    on(this.nextNode, "click", function() {
                        self.stepOver({
                            key: self.nextKey,
                            catId: self.catId,
                            orgId: self.orgId
                        });
                    });
                }
            }
        },

        "-public-": {
            "-attributes-": {},
            "-methods-": {
                stepOver: function(args) {
                    if (args.orgId) this.onStepOver(args);
                }
            }
        },

        "-constructor-": {
            initialize: function(params) {
                var self = this;
                this.overrided(params);
                orgSrv.init().then(function(memory) {
                    self.init();
                    self.initOptions(self.provinceNode, memory.query({}), self.univNode);
                });
            }
        }
    });
    var Step22 = Class.declare({
        "-parent-": BaseStep,
        "-protected-": {
            "-fields-": {
                templateString: step22Tpl,
                baseClass: "step22"
            },
            "-methods-": {
                init: function() {
                    this.bindEvents();
                },

                initOptions: function(node, data) {
                    qUtils.domConstruct.create("option", {
                        value: null,
                        innerHTML: "请选择"
                    }, node);
                    data.forEach(function(info) {
                        qUtils.domConstruct.create("option", {
                            value: info.id,
                            innerHTML: info.name
                        }, node);
                    }, this);
                },

                bindEvents: function() {
                    var self = this;
                    on(this.provinceNode, "change", function() {
                        if (this.value) {
                            qUtils.domConstruct.empty(self.univNode);
                            orgSrv.initSubs(this.value).then(function(items) {
                                self.initOptions(self.univNode, items);
                                qUtils.domClass.remove(self.univNode, "disabled");
                            });
                            self.orgId = this.value;
                        } else {
                            self.orgId = null;
                        }
                    });

                    on(this.univNode, "change", function() {
                        if (parseInt(this.value)) {
                            self.orgId = this.value;
                            self.stepOver({
                                key: self.nextKey,
                                orgId: self.orgId
                            });
                        } else {
                            self.orgId = self.province.value;
                        }
                    });

                    on(this.nextNode, "click", function() {
                        self.stepOver({
                            key: self.nextKey,
                            catId: self.catId,
                            orgId: self.orgId
                        });
                    });
                }
            }
        },

        "-public-": {
            "-attributes-": {},
            "-methods-": {
                stepOver: function(args) {
                    if (args.orgId) this.onStepOver(args);
                }
            }
        },

        "-constructor-": {
            initialize: function(params) {
                var self = this;
                this.overrided(params);
                orgSrv.init().then(function(memory) {
                    self.init();
                    self.initOptions(self.provinceNode, memory.query({}), self.univNode);
                });
            }
        }
    });
    var Step23 = Class.declare({
        "-parent-": BaseStep,
        "-protected-": {
            "-fields-": {
                templateString: step23Tpl,
                baseClass: "step23"
            },
            "-methods-": {
                init: function(cats) {
                    var self = this;
                    cats.forEach(function(cat) {
                        var div = qUtils.domConstruct.create("div", {
                            "class": "col-xs-6 col-md-3 cat-item",
                            onclick: function() {
                                self.onStepOver({
                                    key: self.nextKey,
                                    catId: cat.id
                                });
                            }
                        }, self.listNode);
                        var a = qUtils.domConstruct.create("a", {
                            "class": "thumbnail"
                        }, div);
                        qUtils.domConstruct.create("img", {
                            "class": "item-img",
                            src: ""
                        }, a);
                        qUtils.domConstruct.create("span", {
                            "class": "label label-primary",
                            innerHTML: cat.name,
                        }, a);
                    });
                }
            }
        },

        "-public-": {
            "-attributes-": {

            },
            "-methods-": {}
        },

        "-constructor-": {
            initialize: function(params) {
                this.overrided(params);
                var self = this;
                groupSrv.initInterestCats().then(function(cats) {
                    self.init(cats);
                });
            }
        }
    });
    var Step3 = Class.declare({
        "-parent-": BaseStep,
        "-protected-": {
            "-fields-": {
                templateString: step3Tpl,
                baseClass: "step3"
            },
            "-methods-": {
                init: function() {
                    this.eventsBind();
                },

                eventsBind: function() {
                    var self = this;
                    on(this.saveNode, "click", function() {
                        self.onStepOver({
                            key: null,
                            name: self.nameNode.value,
                            description: self.descNode.value
                        });
                    });
                    on(this.cancelNode, "click", Function.hitch(this, "onStepOver"));
                }
            }
        },

        "-public-": {
            "-attributes-": {

            },
            "-methods-": {

            }
        },

        "-constructor-": {
            initialize: function(params) {
                this.overrided(params);
                this.init();
            }
        }
    });

    var Step4 = Class.declare({
        "-parent-": BaseStep,
        "-protected-": {
            "-fields-": {
                templateString: step4Tpl,
                baseClass: "step4"
            },
            "-methods-": {
                init: function() {

                },

                eventBind: function() {
                    this.own(
                        on(this.saveBtnNode, "click", Function.hitch(this, "add"))
                    );
                }
            }
        },

        "-public-": {
            "-attributes-": {

            },
            "-methods-": {
                onStepOver: function() {}
            }
        },

        "-constructor-": {
            initialize: function(params) {
                this.overrided(params);
                this.init();
            }
        }
    });

    return Class.declare({
        "-parent-": BaseUi,
        "-interfaces-": [],
        "-protected-": {
            "-fields-": {
                nls: nlsApp,
                nlsCommon: nlsCommon,
                "$$contentTemplate": stepTpl,
                baseClass: "step",
                style: "width:100%;height:100%",
                fontAwesome: FontAwesome
            },
            "-methods-": {
                init: function() {
                    this.formInfo = {};
                    this.steps = {
                        step1: {
                            objClass: Step1,
                            notSkip: true,
                            prevKey: null,
                            nextKey: null
                        },
                        step21: {
                            objClass: Step21,
                            notSkip: true,
                            prevKey: "step1",
                            nextKey: "step3"
                        },
                        step22: {
                            objClass: Step22,
                            notSkip: true,
                            prevKey: "step1",
                            nextKey: "step3"
                        },
                        step23: {
                            objClass: Step23,
                            notSkip: false,
                            prevKey: "step1",
                            nextKey: "step3"
                        },
                        step3: {
                            objClass: Step3,
                            notSkip: false,
                            prevKey: null,
                            nextKey: "step4"
                        },
                        step4: {
                            objClass: Step4,
                            notSkip: true,
                            prevKey: "step3",
                            nextKey: null
                        }
                    };
                    this.overrided();
                    var self = this,
                        step = this.initStep(this.steps["step1"], {
                            keys: {
                                step21: "班级",
                                step22: "社团",
                                step23: "兴趣"
                            }
                        });
                    this.initStep(this.steps["step3"]);
                    this.initStep(this.steps["step4"]);
                    this.eventBind();
                    qUtils.domClass.add(this.prevNode, "disabled");
                    qUtils.domClass.add(this.skipNode, "disabled");
                },

                initStep: function(stepOpts, opts) {
                    opts = opts || {
                        nextKey: stepOpts.nextKey
                    };
                    var self = this,
                        step = stepOpts.step = new stepOpts["objClass"](opts);
                    self.contentNode.addChild(step);
                    var li = stepOpts.thumb = qUtils.domConstruct.create("li", {
                        "class": "thumb-item"
                    }, self.thumbsNode);
                    on(step, "stepOver", function(args) {
                        qUtils.domClass.remove(self.prevNode, "disabled");
                        if (!args) {
                            self.onHide();
                        } else {
                            var key = args.key;
                            delete args.key;
                            Function.mixin(self.formInfo, args);
                            if (key) {
                                if (!stepOpts.nextKey) stepOpts.nextKey = key;
                                if (!stepOpts.prevKey) stepOpts.prevKey = key;
                                var nextOpts = self.steps[key];
                                if (!nextOpts.step) self.initStep(nextOpts);
                                self.selectStep(nextOpts);
                            } else {
                                self.add();
                            }
                        }
                    });
                    return step;
                },

                selectStep: function(opts) {
                    this.contentNode.selectChild(opts.step, true);
                    this.currentStepOpts = opts;
                },

                eventBind: function() {
                    on(this.prevNode, "click", Function.hitch(this, "prevStep"));
                    on(this.skipNode, "click", Function.hitch(this, "skipStep"));
                }
            }
        },

        "-public-": {
            "-attributes-": {
                currentStepOpts: {
                    setter: function(opts) {
                        this._.currentStepOpts = opts;
                        if (opts.notSkip) {
                            qUtils.domClass.add(this.skipNode, "disabled");
                        } else {
                            qUtils.domClass.remove(this.skipNode, "disabled");
                        }
                    }
                }
            },
            "-methods-": {
                prevStep: function() {
                    if (!this.currentStepOpts || !this.currentStepOpts.prevKey) return;
                    this.contentNode.selectChild(this.steps[this.currentStepOpts.prevKey].step, true);
                },

                skipStep: function() {
                    if (!this.currentStepOpts || !this.currentStepOpts.nextKey || this.currentStepOpts.notSkip) return;
                    this.contentNode.selectChild(this.steps[this.currentStepOpts.nextKey].step, true);
                },

                add: function() {
                    var info = this.formInfo;
                    if (info.name === "") {
                        return qfaceDialog.alert({
                            message: "Name can't be empty!"
                        });
                    }
                    var self = this,
                        data = {
                            name: info.name,
                            description: info.description,
                            category_id: info.catId,
                            org_id: info.orgId
                        };
                    groupSrv.addGroup(data).then(function(cBData) {
                        if (cBData.status) {
                            qfaceDialog.yesno({
                                message: "社区： " + info.name + "创建成功，自定义社区？"
                            }).then(function(yes) {
                                if (yes) {
                                    self.selectStep(self.steps["step4"])
                                } else {
                                    self.onAdd(cBData.group);
                                }
                            });
                        } else {
                            qDialog.alert({
                                message: cBData.msg
                            });
                        }
                    });
                },

                onHide: function() {},
                onAdd: function(group) {}
            }
        },

        "-constructor-": {
            initialize: function(params) {
                this.overrided(params);
                this.init();
            }
        }
    });
});
