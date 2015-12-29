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
                templateString: "<div><ul class=\"list\" data-dojo-attach-point=\"listNode\"></ul></div>",
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
                    var li = qUtils.domConstruct.create("li", {
                        "class": "item",
                        onclick: Function.hitch(this, "onStepOver", key)
                    }, this.listNode);
                    qUtils.domConstruct.create("span", {
                        innerHTML: value
                    }, li);
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
                    this.bindEvent(this.provinceNode, this.univNode);
                    this.bindEvent(this.univNode, this.schoolNode);
                    this.bindEvent(this.schoolNode, this.yearNode, true);
                    on(this.nextNode, "click", Function.hitch(this, "onStepOver", this.nextKey));
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

                bindEvent: function(node, nextNode, isYear) {
                    var self = this;
                    on(node, "change", function() {
                        if (this.value) {
                            qUtils.domConstruct.empty(nextNode);
                            if (isYear) {
                                catSrv.initYearCats().then(function(items) {
                                    self.initOptions(nextNode, items);
                                    qUtils.domClass.remove(nextNode, "disabled");
                                });
                            } else {
                                orgSrv.initSubs(this.value).then(function(items) {
                                    self.initOptions(nextNode, items);
                                    qUtils.domClass.remove(nextNode, "disabled");
                                });
                            }
                        }
                    });
                }
            }
        },

        "-public-": {
            "-attributes-": {},
            "-methods-": {
                addBread: function(item) {
                    this.breadcrumb.addItem(item);
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
            "-methods-": {}
        },

        "-constructor-": {
            initialize: function(params) {
                this.overrided(params);
                this.init();
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
            "-methods-": {}
        },

        "-constructor-": {
            initialize: function(params) {
                this.overrided(params);
                this.init();
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
                fontAwesome: FontAwesome
            },
            "-methods-": {
                init: function() {
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
                            nextKey: "step3"
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
                    on(step, "stepOver", function(key) {
                        stepOpts.nextKey = key;
                        var nextOpts = self.steps[key];
                        if (!nextOpts.step) self.initStep(nextOpts);
                        self.selectStep(nextOpts);
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
});
