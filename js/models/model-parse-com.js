Parse.initialize("X9iYFrUToVtIdEaENMZicpRtxJjiqZRGvFwoXj5H", "LpNzxsepjmLNe6yzhyOAw7umFaOGjzdoR8YKtIzQ");

hiddenCuisine.Restaurant = Parse.Object.extend({

    className: "Restaurants",

    initialize: function() {
    }

});

hiddenCuisine.RestaurantCollection = Parse.Collection.extend(({

    model: hiddenCuisine.Restaurant,

    fetch: function(options) {
        this.query = new Parse.Query(hiddenCuisine.Restaurant);
        this.query.equalTo("IsApproved", true);
        this.query.ascending("Name");
        Parse.Collection.prototype.fetch.apply(this, arguments);
    }

}));

hiddenCuisine.MenuItem = Parse.Object.extend({

    className: "MenuItems",

    initialize: function () {
    }

});

hiddenCuisine.MenuItemCollection = Parse.Collection.extend(({

    model: hiddenCuisine.MenuItem,

    fetchNewest: function (options) {
        this.query = new Parse.Query(hiddenCuisine.MenuItem);
        this.query.include("RestaurantId");
        this.query.include("CreatedBy");
        this.query.equalTo("IsApproved", true);
        this.query.descending("createdAt");
        this.query.limit(9);
        Parse.Collection.prototype.fetch.apply(this, arguments);
    },

    fetchByRestaurant: function (options) {
        this.query = new Parse.Query(hiddenCuisine.MenuItem);
        this.query.include("RestaurantId");
        this.query.include("CreatedBy");
        this.query.equalTo("RestaurantId", {
            __type: "Pointer",
            className: "Restaurants",
            objectId: options.restaurantId
        });
        this.query.equalTo("IsApproved", true);
        this.query.ascending("Name");
        Parse.Collection.prototype.fetch.apply(this, arguments);
    },

    fetchByPopularity: function (options) {
        this.query = new Parse.Query(hiddenCuisine.MenuItem);
        this.query.include("RestaurantId");
        this.query.include("CreatedBy");
        this.query.equalTo("IsApproved", true);
        this.query.descending("Popularity");
        this.query.limit(3);
        Parse.Collection.prototype.fetch.apply(this, arguments);
    }

}));

hiddenCuisine.MenuItemRating = Parse.Object.extend({

    className: "MenuItemRatings",

    initialize: function () {
    }

});

hiddenCuisine.MenuItemRatingCollection = Parse.Collection.extend(({

    model: hiddenCuisine.MenuItemRating,

    getByUserIdAndItemId: function (options) {
        this.query = new Parse.Query(hiddenCuisine.MenuItemRating);
        this.query.equalTo("MenuItemId", {
            __type: "Pointer",
            className: "MenuItems",
            objectId: options.menuItemId
        });
        this.query.equalTo("CreatedBy", {
            __type: "Pointer",
            className: "_User",
            objectId: options.userId
        });

        Parse.Collection.prototype.fetch.apply(this, arguments);
    }

}));

hiddenCuisine.MenuItemSuccess = Parse.Object.extend({

    className: "MenuItemSuccesses",

    initialize: function () {
    }

});

hiddenCuisine.MenuItemSuccessCollection = Parse.Collection.extend(({

    model: hiddenCuisine.MenuItemSuccess,

    getByUserIdAndItemId: function (options) {
        this.query = new Parse.Query(hiddenCuisine.MenuItemSuccess);
        this.query.equalTo("MenuItemId", {
            __type: "Pointer",
            className: "MenuItems",
            objectId: options.menuItemId
        });
        this.query.equalTo("CreatedBy", {
            __type: "Pointer",
            className: "_User",
            objectId: options.userId
        });

        Parse.Collection.prototype.fetch.apply(this, arguments);
    }

}));
