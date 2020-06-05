let express      	= require(`express`),
    bodyParser   	= require('body-parser'),
    mongoose     	= require('mongoose'),
    Campground   	= require('./models/campgrounds'),
    Comment      	= require('./models/comment'),
    seedDB       	= require('./seeds'),
    passport 	 	= require('passport'),
    LocalStratergy 	= require('passport-local'),
    User 			= require('./models/user'),
    expressSession 	= require('express-session'),
    methodOverride  = require('method-override'),
    flash           = require('connect-flash'),
    app          	= express()

let indexRoutes 		= require('./routes/index'),
	campgroundRoutes 	= require('./routes/campgrounds'),
	commentRoutes   	= require('./routes/comments')

// seedDB()

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true)

mongoose.connect('mongodb://localhost/yelp_camp_v3')
// mongoose.connect('mongodb+srv://admin:admin@123@cluster-iv870.mongodb.net/test?retryWrites=true&w=majority').then(() => {
// 	console.log('Connected to Mongo DB Database')
// }).catch(err => {
// 	console.log('Error: ', err.message)
// })

app.use(flash())
app.use(expressSession({
	secret: "Once again leo is a dog",
	resave: false,
	saveUninitialized: false
}))
app.use(bodyParser.urlencoded({extended: true}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.set('view engine', 'ejs')

passport.use(new LocalStratergy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(express.static(__dirname + '/public'))
app.use((req, res, next) => {
	res.locals.currentUser = req.user
    res.locals.error = req.flash('error')
    res.locals.success = req.flash('success')  
	next()
})
app.use('/', indexRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/comments', commentRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running at port ${PORT}`)
})
