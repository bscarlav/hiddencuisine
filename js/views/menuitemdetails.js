hiddenCuisine.MenuItemView = Backbone.View.extend({

    events: {
        "click #btnSuccess": "onSuccess",
        "click #btnFail": "onFail",
        "click #btnFacebookShare": "shareFacebook"
    },

    render: function (callback) {
        var self = this;

        if (self.model.attributes.CreatedBy) {
            var query = new Parse.Query(Parse.User);
            query.equalTo("objectId", self.model.attributes.CreatedBy.id);
            query.find({
                success: function (user) {
                    self.model.attributes.CreatedByName = user[0].attributes.name;
                    self.$el.html(self.template(self.model.attributes));
                    callback(self);
                },
                error: function () {
                    self.$el.html(this.template(self.model.attributes));
                    callback(self);
                }
            });
        }
        else {
            self.$el.html(self.template(self.model.attributes));
            callback(self);
        }
    },

    shareFacebook: function() {
        window.open("https://www.facebook.com/sharer/sharer.php?u=" + window.location.href);
    },

    onSuccess: function () {
        this.runSuccessLogic(true);
    },

    onFail: function () {
        this.runSuccessLogic(false);
    },

    runSuccessLogic: function (isSuccess) {
        var self = this;
        var userId = null;
        var currentUser = Parse.User.current();
        if (currentUser) {
            userId = currentUser.id;
        }
        else {
            window.location = "#login";
            hiddenCuisine.showWarning("You must login first before you can rate a Menu Item.");
            return;
        }

        var menuItemSuccessList = new hiddenCuisine.MenuItemSuccessCollection();
        menuItemSuccessList.getByUserIdAndItemId({
            userId: userId,
            menuItemId: self.model.id,
            success: function (menuItemSuccesses) {
                var hasSuccess = false;
                if (menuItemSuccesses && menuItemSuccesses.models && menuItemSuccesses.models.length > 0) {
                    hasSuccess = true;
                }

                var menuItemSuccess = new hiddenCuisine.MenuItemSuccess({
                    IsSuccess: isSuccess,
                    MenuItemId: {
                        __type: "Pointer",
                        className: "MenuItems",
                        objectId: self.model.id
                    },
                    CreatedBy: {
                        __type: "Pointer",
                        className: "_User",
                        objectId: currentUser.id
                    }
                });
                if (hasSuccess) {
                    menuItemSuccess.id = menuItemSuccesses.models[0].id;
                }

                menuItemSuccess.save(null, {
                    success: function () {
                        hiddenCuisine.showSuccess("Menu Item successfully rated.");
                    },
                    error: function () {
                        hiddenCuisine.showError("Failed to rate Menu Item.  Please try again");
                    }
                });
            }
        });
    }
});