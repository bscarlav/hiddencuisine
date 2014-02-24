hiddenCuisine.SubmitItemView = Backbone.View.extend({

    events: {
        "click #btnSubmit": "submit"
    },

    render: function () {
        var currentUser = Parse.User.current();
        if (!currentUser) {
            window.location = "#login";
            hiddenCuisine.showWarning("You must login first before you can submit a Menu Item.");
            return;
        }

        this.$el.html(this.template());

        if (typeof window.FileReader === 'undefined') {
            // hide upload
        }

        return this;
    },

    submitMenuItem: function (imageUrl) {
        var currentUser = Parse.User.current();
        var name = this.$("#submitName").val();
        var description = this.$("#submitDescription").val();
        var restaurant = this.$("#submitRestaurant").val();

        var menuItem = new hiddenCuisine.MenuItem;
        menuItem.set('Description', description);
        menuItem.set('Name', name);
        menuItem.set('RestaurantName', restaurant);
        menuItem.set('State', "0");
        menuItem.set('Status', "0");
        menuItem.set('Rating', 0);
        menuItem.set('RatingCount', 0);
        menuItem.set('SuccessRate', 0);
        menuItem.set('SuccessRateCount', 0);
        menuItem.set('SuccessRating', 0);
        menuItem.set('SuccessRatingCount', 0);
        menuItem.set('SuccessRating', 0);
        menuItem.set('IsApproved', false);
        menuItem.set('CreatedBy', {
            __type: "Pointer",
            className: "_User",
            objectId: currentUser.id
        });
        if (imageUrl)
            menuItem.set('ImageUrl', imageUrl);

        menuItem.save(null, {
            success: function (menuItem) {
                hiddenCuisine.showSuccess("Menu Item submitted! Approval may take up to 48 hours.");
            },
            error: function (menuItem, error) {
                hiddenCuisine.showError("Error: " + error);
            }
        });
    },

    submit: function () {
        var self = this;
        var name = this.$("#submitName").val();
        var description = this.$("#submitDescription").val();
        var restaurant = this.$("#submitRestaurant").val();

        if (!name) {
            hiddenCuisine.showError("Please provide a Menu Item Name.");
            return false;
        }
        if (!restaurant) {
            hiddenCuisine.showError("Please provide a Menu Item Restaurant.");
            return false;
        }
        if (!description) {
            hiddenCuisine.showError("Please provide a Menu Item Description.");
            return false;
        }

        var match = document.location.hash.match(/access_token=(\w+)/);
        var token = !!match && match[1];
        var authorization;
        if (token) authorization = 'Bearer ' + token;
        else authorization = 'Client-ID 8f46c105c9127d3';
                
        if ($('#submitFile') && $('#submitFile')[0] && $('#submitFile')[0].files && $('#submitFile')[0].files[0]) {
            var file = $('#submitFile')[0].files[0],
                reader = new FileReader();
            if (file && file.name) {
                reader.onload = function (event) {
                    $.ajax({
                        url: 'https://api.imgur.com/3/image',
                        method: 'POST',
                        headers: {
                            Authorization: authorization,
                            Accept: 'application/json'
                        },
                        data: {
                            type: 'base64',
                            name: file.name,
                            title: name,
                            image: event.target.result.split(',')[1]
                        },
                        dataType: 'json'
                    }).success(function (data) {
                        var imageUrl = data.data.link;

                        self.submitMenuItem();
                    }).error(function (e) {
                        hiddenCuisine.showError('Error occurred while trying to upload image. ' + e);
                    });
                };
                reader.readAsDataURL(file);
            }
            else {
                self.submitMenuItem(null);
            }
        }
        else {
            self.submitMenuItem(null);
        }
    }

});