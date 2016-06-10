/******************
* HomeLuxe Server *
******************/

/* Core API module */

/*********************
* Essential includes *
*********************/
var express = require('express');
var chalk = require('chalk');
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var sendgrid = require('sendgrid')('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');
var db = require('seraph')({
	server: "http://homeluxe.in:7474",
	user: "neo4j",
	pass: "homeluxe@123"
});
//var moment = require('moment');
var app = express();

/***********************
* Server configuration *
***********************/
var port = process.env.PORT || 3000;
var superSecret = 'Evang3l!st';
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended : false}));
app.use(bodyParser.json());

/*****************
* Custom routers *
*****************/
var publicRoutes = express.Router();
var memberRoutes = express.Router();

/********************
* Support Functions *
********************/
function search(nameKey, myArray) {
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].name === nameKey) {
            return myArray[i];
        }
    }
}

/***********************
* Cross domain support *
***********************/
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
/****************
* Public Routes *
****************/
publicRoutes.post('/getToken', function(req,res) {
	var payload = {
		userType : 'guest',
		generatedAt : (new Date).getTime()
	};
	var token = jwt.sign(payload,superSecret);
	res.json({
		success : true,
		token : token
	});
});

publicRoutes.post('/login', function(req,res) {
	/* Check for login details */
	var predicate = {
		email : req.body.email
	};
	db.find(predicate, function(err,results) {
		if(err) {
			console.log(err);
			res.send(err);
		} else {
			res.send(results);
		}
	});
});

publicRoutes.post('/register', function(req,res) {
	/* Check if user exists using email */
	var predicate = {
		email : req.body.email
	};
	db.find(predicate, function(err,results) {
		if(err) {
			console.log(err);
			res.json(err);
		} else {
			/* Check if result array has length greater than 0 */
			if(results.length == 0) {
				/* Create user object */
				newUser = {
					name : req.body.username,
					password : req.body.password,
					email : req.body.email,
					mobile : req.body.mobile
				};

				/* Save object to database */
				db.save(newUser,'User',function(err,node) {
					if(err) {
						console.log(err);
						res.send(err);
					} else {
						console.log(node);
						res.json({
							status : 'Success',
							message : 'Successful Registeration'
						});
					}
				});
			} else {
				/* User already exists */
				var responseObject = {
					status : 'Failed',
					message : 'User exists'
				}
				res.send(responseObject);
			}
		}
	});
});

publicRoutes.get('/sendmail', function(req,res) {
	// Generate email body payload
	var payload = '<p>A new guest has dropped their contact details, please get in touch immediately!<br><br>';
	payload = payload + 'Name : ' + req.query.name + '<br>Email : ' + req.query.email + '<br>Phone : ' + req.query.phone + '<br>Message : ' + req.query.message;
	payload = payload + '<br><br>This is an auto generated email, please do not reply';

	var email = new sendgrid.Email({
		to : 'info@homeluxe.in',
		from: 'no-reply@homeluxe.in',
		subject: 'New guest contact details',
		html : payload
	});

	sendgrid.send(email, function(err,json) {
		if(err) {
			console.log(err);
		}
		res.send();
	});
});


publicRoutes.use(function(req,res,next) {
	var token = req.headers['x-access-token'] || req.query.token || req.body.token;
	if(token) {
		jwt.verify(token, superSecret, function(err,decoded) {
			if(err) {
				res.json({
					success : false,
					message : 'Invalid token detected'
				});
			} else {
				/* Redis token check needs to go here */
				/* Analytics grabs data here */
				req.decoded = decoded;
				next();
			}
		});
	} else {
		return res.status(403).send({
			success : false,
			message : 'No token detected'
		});
	}
});

publicRoutes.post('/quiz', function(req,res) {
	if(req.body.submit == 0) {

		var query = "MATCH (q:Questions)-[]->(o:Options) RETURN q AS Questions,COLLECT(o) AS Options ORDER BY q.order";

		db.query(query, function(err,results) {
			if (err)
				throw err;
			res.send(results)
		});
	} else {
		/* Crunch Questionaire here */

		answer_set = JSON.parse('[' + req.body.answer_set + ']');
		count_structure = {};
		formatted_result = {};
		high = 0;
		primary_switch = 1;
		primary = '';

		if(typeof answer_set != 'undefined' && answer_set && answer_set.length == 6) {
			/* Complete answer_set start crunching */
			query = "MATCH (o:Options)-[LEADS_TO_PROFILE]->(p:Profiles) WHERE ID(o) IN {nodes} RETURN collect(p)"
			db.query(query, {nodes : answer_set}, function(err,results){
				if (err)
					console.log(err);
					// Create count structure
					results[0].forEach(function(item){
						if (count_structure.hasOwnProperty(item.name)) {
							count_structure[item.name] += 1;
						} else {
							count_structure[item.name] = 1;
						}
					});

					// Format image structure and parse JSON objects
					results[0].forEach(function(item) {
						for(i = 0; i < item.images.length ; i++) {
							item.images[i] = JSON.parse(item.images[i]);
						}
					});

					// Iterate count structure
					while(Object.keys(count_structure).length) {
						// Reset high value
						high = 0;

						for(var key in count_structure) {
							if(count_structure[key] > high) {
								high = count_structure[key];
								primary = key;
							}
						}

						// Rebuild result object
						if(primary_switch) {
							formatted_result['primary'] = search(primary,results[0]);
							formatted_result['secondary'] = [];
							primary_switch = 0;
							delete count_structure[primary];
						} else {
							formatted_result['secondary'].push(search(primary,results[0]));
							delete count_structure[primary];
						}
					}
					res.send(formatted_result);
				});
			} else {
				/* incomplete answer_set, send error */
				res.send('Incomplete Answer set')
			}

		}
});

publicRoutes.post('/browse', function(req,res) {
	query = 'MATCH (p:Profiles) RETURN p';
	db.query(query, function(err,results) {
		if(err) {
			throw err;
		}

		// Format image structure and parse JSON objects
		results.forEach(function(item) {
			for(i = 0; i < item.images.length ; i++) {
				item.images[i] = JSON.parse(item.images[i]);
			}
		});

		res.send(results);
	});
});

app.use('/', publicRoutes);

/*****************
* Member Routes *
*****************/
memberRoutes.use(function(req,res,next) {
	var token = req.headers['x-access-token'] || req.query.token || req.body.token;
	if(token) {
		jwt.verify(token, superSecret, function(err,decoded) {
			if(err) {
				res.json({
					success : false,
					message : 'Invalid token detected'
				});
			} else {
				/* Redis token check needs to go here */
				/* Analytics grabs data here */
				req.decoded = decoded;
				next();
			}
		});
	} else {
		return res.status(403).send({
			success : false,
			message : 'No token detected'
		});
	}
});

/***************************
* Member Utility Functions *
***************************/
memberRoutes.post('/like', function(req,res) {
	var style = req.body.style;
	var room = req.body.room;
});

memberRoutes.post('/dashboard', function(req,res) {
	res.send('Dashboard hit');
});

app.use('/member', memberRoutes);

/**************
* Start Server *
**************/
app.listen(port);
console.log('Server running on port ' + port);
