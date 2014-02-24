hiddenCuisine.LoginView = Backbone.View.extend({

    events: {
        "click #btnFacebook": "loginWithFacebook",
        "click #btnSignup": "signup",
        "click #btnLogin": "login",
        "click #btnLogout": "logout",
        "click #btnResetPassword": "resetPassword"
    },    

    render: function () {
        var currentUser = Parse.User.current();
        if (currentUser) {
            this.$el.html(new hiddenCuisine.ProfileView().render().el);
        }
        else {
            this.$el.html(this.template());
        }

        return this;
    },

    login: function(event) {
        var self = this;
        var username = this.$("#loginEmail").val();
        var password = this.$("#loginPassword").val();

        Parse.User.logIn(username, password, {
            success: function (user) {
                window.location = window.location.origin;
            },

            error: function (user, error) {
                hiddenCuisine.showError("Login failed.  Please make sure your email and password are correct.");
            }
        });

        return false;
    },

    logout: function(event) {
        Parse.User.logOut();
        window.location = window.location;
    },

    resetPassword: function(event) {
        var email = this.$("#resetEmail").val();
        Parse.User.requestPasswordReset(email, {
            success: function () {
                hiddenCuisine.showError("Email sent.");
            },
            error: function (error) {
                hiddenCuisine.showError("Error: " + error.code + " " + error.message);
            }
        });
    },

    signup: function(event) {
        var self = this;
        var name = this.$("#signupName").val();
        var email = this.$("#signupEmail").val();
        var password = this.$("#signupPassword").val();

        if (!name) {
            hiddenCuisine.showError("Please enter a Display Name.");
            return false;
        }
        if (!email) {
            hiddenCuisine.showError("Please enter an Email Address.");
            return false;
        }
        if (!password) {
            hiddenCuisine.showError("Please enter a Password.");
            return false;
        }

        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var valid = re.test(email);
        if (!valid) {
            hiddenCuisine.showError("Please enter a valid email address.");
            return false;
        }

        Parse.User.signUp(email, password, { ACL: new Parse.ACL() }, {
            success: function (user) {
                user.set('name', name);
                user.save(null, {
                    success: function () {
                        window.location = window.location.origin;
                    },
                    error: function () {
                    }
                });
            },

            error: function (user, error) {
                hiddenCuisine.showError("An error has occurred while trying to create an account.  Please try again.");
            }
        });

        return false;
    },

    loginWithFacebook: function (event) {
        event.preventDefault();
        Parse.FacebookUtils.logIn(null, {
            success: function (user) {
                if (!user.existed()) {
                    FB.api(
                        "/me",
                        function (response) {
                            if (response && !response.error) {
                                user.set("name", response.name);
                                user.save(null, {
                                    success: function () {
                                        window.location = window.location.origin;
                                    },
                                    error: function () {
                                        window.location = window.location.origin;
                                    }
                                });
                            }
                        }
                    );
                } else {
                    window.location = window.location.origin;
                }
            },
            error: function (user, error) {
                hiddenCuisine.showError("An error has occurred while trying to login with Facebook.  Please try again.");
            }
        });
    }

});