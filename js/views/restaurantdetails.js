hiddenCuisine.RestaurantView = Backbone.View.extend({

    render: function () {
        this.$el.html(this.template(this.model.attributes));

        var menuItemList = new hiddenCuisine.MenuItemCollection();
        menuItemList.fetchByRestaurant({
            restaurantId: this.model.id,
            success: function () {
                $("#table").html(new hiddenCuisine.MenuItemListView({ model: menuItemList, showRestaurant: false }).el);
                $(".star").raty({
                    score: function () {
                        return $(this).attr('data-score');
                    },
                    readOnly: function () {
                        return $(this).attr('data-readonly');
                    }
                });
            }
        });

        return this;
    }
});