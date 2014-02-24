hiddenCuisine.AboutView = Backbone.View.extend({

    events: {        
        "click #btnFacebookShare": "shareFacebook"
    },

    render:function () {
        this.$el.html(this.template());
        return this;
    },

    shareFacebook: function () {
        window.open("https://www.facebook.com/sharer/sharer.php?u=hiddencuisine.com");
    }

});