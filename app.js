let   express               = require("express"),
      mongoose              = require("mongoose"),
      passport              = require("passport"),
      LocalStrategy         = require("passport-local"),
      passportLocalMongoose = require("passport-local-mongoose"),
      bodyParser            = require("body-parser"),
      User                  = require("./models/user");

mongoose.connect("mongodb://localhost/auth_demo_app");

let app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "I dont have any big secrets to tell ya",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//============
// ROUTES
//============

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/secret", isLoggedIn,function (req, res) {
    res.render("secret");
});

// REGISTER FORM
app.get("/register", function (req, res) {
    res.render("register");
});

// REGISTER ACTION
app.post("/register", function (req, res) {
    req.body.username;
    req.body.password;
    User.register(new User({username: req.body.username}), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/secret");
        });
    });
});

// LOGIN
app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}) ,function (req, res) {
});

// LOGOUT
app.get("/logout", function (req, res) {
   req.logout();
   res.redirect("/");
});

// MIDDLEWEAR
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.listen(3000, function () {
    console.log('Up and running!')
});