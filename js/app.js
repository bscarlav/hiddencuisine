var hiddenCuisine = {

    views: {},

    models: {},

    loadTemplates: function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            if (hiddenCuisine[view]) {
                deferreds.push($.get('tpl/' + view + '.html', function(data) {
                    hiddenCuisine[view].prototype.template = _.template(data);
                }, 'html'));
            } else {
                alert(view + " not found");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    },

    getThumbnail: function (imageUrl) {
        if (!imageUrl) {
            return "../img/placeholder_white.jpg";
        }

        var extension = imageUrl.substring(imageUrl.length - 4, imageUrl.length);
        var noExtension = imageUrl.substring(0, imageUrl.length - 4);
        return noExtension + "l" + extension;
    },

    getLoginTabText: function (callback) {        
        var result = "Login";
        var currentUser = Parse.User.current();
        if (!currentUser) {
            callback(result);
            return;
        }

        var query = new Parse.Query(Parse.User);
        query.equalTo("objectId", currentUser.id);
        query.find({
            success: function (user) {
                result = user[0].attributes.name;
                callback(result);
            },
            error: function () {
                callback(result);
            }
        });
    },

    showError: function (error) {
        $('#errorText').text(error);
        $('#error').show();
    },

    showSuccess: function (success) {
        $('#successText').text(success);
        $('#success').show();
    },

    showWarning: function (warning) {
        $('#warningText').text(warning);
        $('#warning').show();
    },

    showInfo: function (info) {
        $('#infoText').text(info);
        $('#info').show();
    }

};

hiddenCuisine.Router = Backbone.Router.extend({

    routes: {
        "": "home",
        "login": "login",
        "about": "about",
        "submit": "submitItem",
        "restaurants/:id": "restaurantDetails",
        "menuitems/:id": "menuItemDetails"
    },

    initialize: function () {
        hiddenCuisine.shellView = new hiddenCuisine.ShellView();
        $('body').html(hiddenCuisine.shellView.render().el);
        // Close the search dropdown on click anywhere in the UI
        $('body').click(function () {
            $('.dropdown').removeClass("open");
        });
        this.$content = $("#content");
    },

    home: function () {
        // Since the home view never changes, we instantiate it and render it only once
        if (!hiddenCuisine.homelView) {
            hiddenCuisine.homelView = new hiddenCuisine.HomeView();
            hiddenCuisine.homelView.render();
        } else {
            console.log('reusing home view');
            hiddenCuisine.homelView.delegateEvents(); // delegate events when the view is recycled
        }
        this.$content.html(hiddenCuisine.homelView.el);
        hiddenCuisine.shellView.selectMenuItem('home-menu');
    },

    login: function () {
        if (!hiddenCuisine.loginView) {
            hiddenCuisine.loginView = new hiddenCuisine.LoginView();
            hiddenCuisine.loginView.render();
        }
        this.$content.html(hiddenCuisine.loginView.el);
    },

    about: function () {
        if (!hiddenCuisine.aboutView) {
            hiddenCuisine.aboutView = new hiddenCuisine.AboutView();
            hiddenCuisine.aboutView.render();
        }
        this.$content.html(hiddenCuisine.aboutView.el);
    },

    submitItem: function () {
        if (!hiddenCuisine.submitItem) {
            hiddenCuisine.submitItem = new hiddenCuisine.SubmitItemView();
            hiddenCuisine.submitItem.render();
        }
        this.$content.html(hiddenCuisine.submitItem.el);
    },

    restaurantDetails: function (id) {
        var restaurant = new hiddenCuisine.Restaurant({ id: id });
        var self = this;
        restaurant.fetch({
            success: function (data) {
                console.log(data);
                self.$content.html(new hiddenCuisine.RestaurantView({model: data}).render().el);
            }
        });
        hiddenCuisine.shellView.selectMenuItem();
    },

    menuItemDetails: function (id) {
        var self = this;
        var query = new Parse.Query(hiddenCuisine.MenuItem);
        query.include("RestaurantId");
        query.equalTo("objectId", id);
        query.find({
            success: function (data) {
                var menuItemData = data[0];
                var userId = null;
                var currentUser = Parse.User.current();
                if (currentUser) {
                    userId = currentUser.id;
                }

                var menuItemRatingList = new hiddenCuisine.MenuItemRatingCollection();
                menuItemRatingList.getByUserIdAndItemId({
                    userId: userId,
                    menuItemId: menuItemData.id,
                    success: function (menuItemRatings) {
                        menuItemData.attributes.MyRating = 0;
                        var hasRating = false;
                        if (menuItemRatings && menuItemRatings.models && menuItemRatings.models.length > 0) {
                            hasRating = true;
                            menuItemData.attributes.MyRating = menuItemRatings.models[0].attributes.Rating;
                        }

                        new hiddenCuisine.MenuItemView({ model: menuItemData }).render(function(result) {
                            self.$content.html(result.el);
                            $(".star").raty({
                                score: function () {
                                    return $(this).attr('data-score');
                                },
                                readOnly: function () {
                                    return $(this).attr('data-readonly');
                                },
                                click: function (rating, e) {
                                    if (!currentUser) {
                                        $(".star").raty('cancel', false);
                                        window.location = "#login";
                                        hiddenCuisine.showWarning("You must login first before you can rate a Menu Item.");
                                        return false;
                                    }
                                    else {
                                        var menuItemRating = new hiddenCuisine.MenuItemRating({
                                            Rating: rating,
                                            MenuItemId: {
                                                __type: "Pointer",
                                                className: "MenuItems",
                                                objectId: menuItemData.id
                                            },
                                            CreatedBy: {
                                                __type: "Pointer",
                                                className: "_User",
                                                objectId: currentUser.id
                                            }
                                        });
                                        if (hasRating) {
                                            menuItemRating.id = menuItemRatings.models[0].id;
                                        }

                                        menuItemRating.save(null, {
                                            success: function () {
                                                hiddenCuisine.showSuccess("Menu Item successfully rated.");
                                            },
                                            error: function () {
                                                hiddenCuisine.showError("Failed to rate Menu Item.  Please try again");
                                            }
                                        });
                                    }
                                }
                            });
                        });
                    }
                });
            }
        });

        hiddenCuisine.shellView.selectMenuItem();
    }

});

$(document).on("ready", function () {
    hiddenCuisine.loadTemplates(["HomeView", "AboutView", "ShellView", "RestaurantView", "RestaurantListItemView", "MenuItemView",
        "MenuItemListItemView", "LoginView", "SubmitItemView", "ProfileView"],
        function () {
            hiddenCuisine.router = new hiddenCuisine.Router();
            Backbone.history.start();
        });
});
