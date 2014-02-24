hiddenCuisine.ProfileView = Backbone.View.extend({

    events: {
        "click #btnSave": "saveProfile",
    },

    render: function () {
        this.$el.html(this.template());

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
                $('#profileName').val(result);
            },
            error: function () {
            }
        });

        return this;
    },

    saveProfile: function (event) {
        var name = this.$("#profileName").val();
        var currentUser = Parse.User.current();
        if (currentUser) {
            currentUser.set('name', name);
            currentUser.save(null, {
                success: function () {
                    window.location = window.location;
                },
                error: function () {
                    window.location = window.location;
                }
            });
        }
    }

});