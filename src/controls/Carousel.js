define([
    "dojo/on",
    "dojo/topic",
    "dojo/_base/array",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dojo/dom-style",
    "qfacex/dijit/ITemplated",
    "utilhub/ItemsControl",
    "text!../templates/carousel.html"
], function(on, topic, array, domConstruct, domClass, domStyle, ITemplated, ItemsControl, template) {
    var Carousel = Class.declare({
        "-parent-": ItemsControl,
        "-interfaces-": [ITemplated],
        "-protected-": {
            "-fields-": {
                templateString: template,
                baseClass: "carousel",
                fontAwesome: FontAwesome,
                config: null,
                fullBundleUrl: null
            },

            "-methods-": {
                init: function() {
                    var self = this;
                    this.config.carousel.items.forEach(function(item, index) {
                        var url = require.toUrl(self.fullBundleUrl + "/resources/images/" + item.image);
                        self.initPhoto(url, index);
                    });

                    $(".carousel", this.domNode).carousel();
                },

                initPhoto: function(url, index) {
                    var activeCss = "";
                    if (index == 0) {
                        activeCss = "active";
                    }

                    var div = domConstruct.create("div", {
                        "class": "item " + activeCss
                    }, this.listBoxNode);

                    var img = domConstruct.create("img", {
                        src: url
                    }, div);
                    domConstruct.create("div", {
                        "class": "carousel-caption"
                    }, div);
                }
            }
        },

        "-public-": {
            "-attributes-": {},

            "-methods-": {}
        },

        "-constructor-": {
            initialize: function(params, srcNodeRef) {
                this.overrided(params, srcNodeRef);
                this.init();
            }
        }
    });
    return Carousel;
});
