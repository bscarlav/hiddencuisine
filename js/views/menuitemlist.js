hiddenCuisine.MenuItemListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        var items = this.model.models;
        var len = items.length;

        var row = $('<div class="row-fluid"></div>');

        $(this.el).html(row);

        var count = 0;
        for (var i = 0; i < len; i++) {
            if (count % 3 == 0) {
                row = $('<div class="row-fluid"></div>');
                $(this.el).append(row);
            }

            $(row, this.el).append(new hiddenCuisine.MenuItemListItemView({ model: items[i], showRestaurant: this.options.showRestaurant }).render().el);
            count++;
        }

        return this;
    }
});

hiddenCuisine.MenuItemListItemView = Backbone.View.extend({

    tagName: 'div',

    className: 'span4',

    initialize: function () {
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.close, this);
    },

    render: function () {
        // The clone hack here is to support parse.com which doesn't add the id to model.attributes. For all other persistence
        // layers, you can directly pass model.attributes to the template function
        var data = _.clone(this.model.attributes);
        data.id = this.model.id;
        data.showRestaurant = this.options.showRestaurant;
        this.$el.html(this.template(data));
        return this;
    }

});