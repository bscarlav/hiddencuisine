hiddenCuisine.ShellView = Backbone.View.extend({

    initialize: function () {
        this.searchResults = new hiddenCuisine.RestaurantCollection();
        this.searchresultsView = new hiddenCuisine.RestaurantListView({model: this.searchResults});
    },

    render: function () {
        this.$el.html(this.template());
        this.searchResults.fetch({ reset: true });
        $('.dropdown', this.el).append(this.searchresultsView.render().el);

        var menuItemList = new hiddenCuisine.MenuItemCollection();
        menuItemList.fetchNewest({
            success: function () {
                $("#latest").html(new hiddenCuisine.MenuItemListView({ model: menuItemList, showRestaurant: true }).el);
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

        var popularList = new hiddenCuisine.MenuItemCollection();
        popularList.fetchByPopularity({
            success: function () {
                $("#popular").html(new hiddenCuisine.MenuItemListView({ model: popularList, showRestaurant: true }).el);
                $(".star").raty({
                    score: function () {
                        return $(this).attr('data-score');
                    },
                    readOnly: function () {
                        return $(this).attr('data-readonly');
                    }
                });
            },
            error: function(e) {
                alert(e);
            }
        });

        return this;
    },

    events: {
        "keyup .search-query": "search",
        "keypress .search-query": "onkeypress"
    },

    search: function (event) {
        var key = $('#searchText').val();
        this.searchResults.fetch({reset: true, data: {name: key}});
        var self = this;
        setTimeout(function () {
            $('.dropdown').addClass('open');
        });
    },

    onkeypress: function (event) {
        if (event.keyCode === 13) { // enter key pressed
            event.preventDefault();
        }
    },

    selectMenuItem: function(menuItem) {
        $('.navbar .nav li').removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }
    }

});