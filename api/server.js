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
	server: "http://localhost:7474",
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
var adminRoutes = express.Router();

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
				res.send({
					success : false,
					message : 'Incomplete Answer set'
				});
			}

		}
});

publicRoutes.post('/browse', function(req,res) {
	query = 'MATCH (p:Profiles)-[:HAS_ROOM]->(r) RETURN p.name AS name,p.price AS price,p.description AS description,p.catalogueKey as catalogueKey,ID(p) AS id,collect(r) AS images;';
	db.query(query, function(err,results) {
		if(err) {
			throw err;
		}
		/*
		// Format image structure and parse JSON objects
		results.forEach(function(item) {
			for(i = 0; i < item.images.length ; i++) {
				item.images[i] = JSON.parse(item.images[i]);
			}
		});
		*/
		res.send(results);
	});
});

app.use('/', publicRoutes);

/*****************
* Member Routes *
*****************/
memberRoutes.post('/register', function(req,res) {
	// Check if minimal data is available
	if(typeof req.body.name == 'undefined' || typeof req.body.email == 'undefined' || typeof req.body.mobile == 'undefined') {
		res.send({
			status : 'Failed',
			message : 'Undefined data variables'
		});
		return;
	}

	// Check if user exists in database
	var query = 'MATCH (u:User) WHERE u.email = {email} RETURN u;';
	db.query(query, {email : req.body.email},function(err,results) {
		if(err) {
			throw err;
		}
		if(results.length == 0) {
			// User doesn't exist. Create and insert.
			// Create user object
			var user = {
				name : req.body.name,
				email : req.body.email,
				mobile : req.body.mobile,
				oauth : req.body.oauth,
				password : req.body.password,
				profile_pic : req.body.profile_pic,
				user_type : 'member'
			};
			db.save(user, 'User', function(err,node) {
				if(err) {
					throw err;
				}
				console.log('[USER CREATION] ' + node.name);
				res.send({
					status : 'Success',
					message : 'User created successfully'
				});
			});
		} else {
			// User exists
			res.send({
				status : 'Failed',
				message : 'User already exists'
			});
		}
	});
});

memberRoutes.post('/login', function(req,res) {
	// Check request for oAuth or password
	if(typeof req.body.email == 'undefined') {
		res.send({
			status : 'Failed',
			message : 'Invalid data'
		});
	} else {
		// Check if oAuth exists in request
		if(typeof req.body.oauth == 'undefined') {
			// Check for password
			var query = 'MATCH (u:User) WHERE u.email = {email} RETURN u LIMIT 1;';
			db.query(query, {email : req.body.email}, function(err,results) {
				if(err) {
					console.log(err);
				}
				if(results.length == 0) {
					// User does not exist
					res.send({
						status : 'Failed',
						message : 'User does not exist'
					});
					return;
				}
				if(typeof results[0].password == 'undefined') {
					// Wrong method of authentication
					res.send({
						status : 'Failed',
						message : 'Wrong method of authentication'
					});
					return;
				}
				if(results[0].password == req.body.password) {
					// True login
					var payload = {
						id : results[0].id,
						email : results[0].email,
						userType : results[0].user_type,
						generatedAt : (new Date).getTime()
					};
					var token = jwt.sign(payload,superSecret);
					res.send({
						status : 'Success',
						message : 'Logged in successfully',
						name : results[0].name,
						email : results[0].email,
						profile_pic : results[0].profile_pic,
						mobile : results[0].mobile,
						user_type : results[0].user_type,
						token : token
					});
					console.log(results[0]);
				} else {
					// Invalid login
					res.send({
						status : 'Failed',
						message : 'Invalid combination'
					});
				}
			});
		} else {
			// Check for oauth
			var query = 'MATCH (u:User) WHERE u.email = {email} RETURN u LIMIT 1;';
			db.query(query, {email : req.body.email}, function(err,results) {
				if(err) {
					console.log(err);
				}
				if(results.length == 0) {
					// User does not exist
					res.send({
						status : 'Failed',
						message : 'User does not exist'
					});
					return;
				}
				if(typeof results[0].oauth == 'undefined') {
					// Wrong method of authentication
					res.send({
						status : 'Failed',
						message : 'Wrong method of authentication'
					});
					return;
				}
				if(results[0].oauth == req.body.oauth) {
					// True login
					var payload = {
						email : results[0].email,
						userType : results[0].user_type,
						generatedAt : (new Date).getTime()
					};
					var token = jwt.sign(payload,superSecret);
					res.send({
						status : 'Success',
						message : 'Logged in successfully',
						name : results[0].name,
						email : results[0].email,
						profile_pic : results[0].profile_pic,
						mobile : results[0].mobile,
						user_type : results[0].user_type,
						token : token
					});
				} else {
					// Invalid login
					res.send({
						status : 'Failed',
						message : 'Invalid combination'
					});
				}
			});
		}
	}
});

memberRoutes.use(function(req,res,next) {
	var token = req.headers['x-access-token'] || req.query.token || req.body.token;
	if(token) {
		jwt.verify(token, superSecret, function(err,decoded) {
			if(err) {
				res.json({
					status : 'Failed',
					message : 'Invalid token detected'
				});
			} else {
				if(decoded.userType == 'member') {
					req.decoded = decoded;
					next();
				} else {
					res.send({
						status : 'Failed',
						message : 'Forbidden endpoint'
					});
				}
			}
		});
	} else {
		return res.status(403).send({
			status : 'Failed',
			message : 'No token detected'
		});
	}
});

/***************************
* Member Utility Functions *
***************************/
memberRoutes.post('/like', function(req,res) {
	var exists = 0;
	db.relationships(req.decoded.id, 'out', 'LIKES', function(err, rels) {
		// Portential bottleneck for performance since forEach is blocking.
		rels.forEach(function(item) {
			if(item.end == req.body.like_node) {
				exists = 1;
			}
		});
		if(!exists) {
			db.relate(req.decoded.id, 'LIKES', req.body.like_node, function(err, relationship) {
				if(err) {
					res.send({
						status : 'Failed',
						message : 'Internal error'
					});
					console.log(err);
				}
				res.send({
					status : 'Success',
					message : 'Operation completed'
				})
			});
		} else {
			res.send({
				status : 'Warning',
				message : 'Operation ignored'
			});
		}
	});
});

memberRoutes.post('/unlike', function(req,res) {

});

memberRoutes.post('/likes', function(req,res) {
	var query = 'MATCH (u:User)-[:LIKES]->(r) WHERE ID(u) = {id} RETURN r;';
	db.query(query, {id : req.decoded.id}, function(err, results) {
		if(err) {
			res.send({
				status : 'Failed',
				message : 'Internal Error'
			});
		}
		res.send(results);
	});
});

memberRoutes.post('/dashboard', function(req,res) {
	res.send('Dashboard hit');
});

app.use('/member', memberRoutes);

/***************
* Admin Routes *
***************/
adminRoutes.post('/login', function(req,res) {
	// Login logic
});

app.use('/admin', adminRoutes);

/**************
* Start Server *
**************/
app.listen(port);
console.log('Server running on port ' + port);
