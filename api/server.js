/******************
* HomeLuxe Server *
******************/

/* Core API module */

/*********************
* Essential includes *
*********************/

var fs = require('fs');
var https = require('https');
var options = {
	key  : fs.readFileSync('/etc/letsencrypt/live/dev.homeluxe.in/privkey.pem'),
	cert : fs.readFileSync('/etc/letsencrypt/live/dev.homeluxe.in/cert.pem')
};
var express = require('express');
var chalk = require('chalk');
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var sendgrid = require('sendgrid')('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');
var async = require('async');
var db = require('seraph')({
	server: "http://localhost:7474",
	user: "neo4j",
	pass: "homeluxe@123"
});
var mysql = require('mysql');
var archive = mysql.createConnection({
	host : 'localhost',
	user : 'dev',
	password : 'homeluxe@123',
	database : 'homeluxe'
});

// Connect to MYSQL
archive.connect();

var mode = process.argv[2] || 0;
var port = 3000;
var app = express();

/***********************
* Server configuration *
***********************/
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
function tokenBlacklisted(token, callback) {
	var query = 'SELECT COUNT(*) as count FROM blacklist WHERE token = ?';
	var values = [token];

	archive.query(query, values, function(err,rows,fields) {
		if(err) {
			res.send({
				status : 'Failed',
				message : 'Internal Server Error'
			});
			console.log(err);
			return;
		} else {
			callback(rows[0].count);
		}
	});
}

/***********************
* Cross domain support *
***********************/
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
/****************
* Public Routes *
****************/
publicRoutes.post('/getToken', function(req,res) {
	var payload = {
		userType : 'guest'
	};
	var options = {
		expiresIn : 1200
	};
	var token = jwt.sign(payload,superSecret,options);
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
		// Scan token against blacklist
		tokenBlacklisted(req.body.token, function(result) {
			if(result) {
				// Token is blacklisted, reject.
				res.send({
					status : 'Failed',
					message : 'Token has expired'
				});
			} else {
				jwt.verify(token, superSecret, function(err,decoded) {
					if(err) {
						res.json({
							success : false,
							message : 'Invalid token detected'
						});
					} else {
						req.decoded = decoded;
						next();
					}
				});
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
		if(typeof answer_set != 'undefined' && answer_set && answer_set.length == 6) {
			/* Complete answer_set start crunching */
			query = 'MATCH (o:Options)-[LEADS_TO_PROFILE]->(p:Profiles) WHERE ID(o) IN {nodes} WITH p,COUNT(p.name) AS count ORDER BY count DESC LIMIT 1 WITH p MATCH (p)-[:HAS_ROOM]->(r) WITH p,r,r.order AS order ORDER BY order ASC RETURN p.name AS name,p.price AS price,p.catalogueKey AS catalogueKey,p.cover_pic AS cover_pic,p.description AS description,ID(p) as id,collect(r) AS images;';
			db.query(query, {nodes : answer_set}, function(err,results){
				if (err)
					console.log(err);
				res.send(results);
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
	query = 'MATCH (p:Profiles)-[:HAS_ROOM]->(r) WITH p,r ORDER BY r.order RETURN p.name AS name,p.price AS price,p.description AS description,p.catalogueKey AS catalogueKey,p.cover_pic AS cover_pic,ID(p) AS id,collect(r) AS images;';
	db.query(query, function(err,results) {
		if(err) {
			throw err;
		}
		res.send(results);
	});
});

publicRoutes.post('/validateToken', function(req,res) {
	// Middleware checks for token failures
	res.send({
		status : 'Success',
		message : 'Valid token'
	});
});

publicRoutes.post('/logout', function(req,res) {
	var query = 'INSERT INTO blacklist VALUES (?,?);';
	var values = [req.body.token,req.decoded.exp];
	// Insert token into blacklist
	archive.query(query, values, function(err,rows,fields) {
		if(err) {
			console.log(err);
			res.send({
				status : 'Failed',
				message : 'Logout Failed'
			});
		} else {
			res.send({
				status : 'Success',
				message : 'Logout Successful'
			});
		}
	});
});

app.use('/', publicRoutes);

/*****************
* Member Routes *
*****************/
memberRoutes.post('/register', function(req,res) {
	// Check if minimal data is available
	if(typeof req.body.name == 'undefined' || typeof req.body.email == 'undefined') {
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
						userType : results[0].user_type
					};
					var options = {
						expiresIn : 604800
					};
					var token = jwt.sign(payload,superSecret,options);
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
						id : results[0].id,
						email : results[0].email,
						userType : results[0].user_type
					};
					var options = {
						expiresIn : 604800
					};
					var token = jwt.sign(payload,superSecret,options);
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
		tokenBlacklisted(req.body.token, function(result) {
			if(result) {
				// Token is blacklisted, reject.
				res.send({
					status : 'Failed',
					message : 'Token has expired'
				});
			} else {
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
		if(typeof rels !== 'undefined') {
			rels.forEach(function(item) {
				if(item.end == req.body.like_node) {
					exists = 1;
				}
			});
		}
		if(!exists) {
			db.relate(req.decoded.id, 'LIKES', req.body.like_node, function(err, relationship) {
				if(err) {
					res.send({
						status : 'Failed',
						message : 'Internal error'
					});
					console.log(err);
				} else {
					res.send({
						status : 'Success',
						message : 'Operation completed'
					});
				}
			});
		} else {
			res.send({
				status : 'Warning',
				message : 'Operation ignored'
			});
		}
	});
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
	// Check for invalid data
	if(typeof req.body.email == 'undefined' || typeof req.body.password == 'undefined') {
		res.send({
			status : 'Failed',
			message : 'Invalid data'
		});
		return;
	}
	// Query database with credentials
	var query = 'MATCH (u:User) WHERE u.email = {email} RETURN u;';
	db.query(query, {email : req.body.email}, function(err, results) {
		if(err) {
			res.send({
				status : 'Failed',
				message : 'Internal Error'
			});
			console.log(err);
			return;
		}
		if(results[0].password == req.body.password) {
			// Successful login. Generate admin token
			var payload = {
				id : results[0].id,
				email : results[0].email,
				userType : results[0].user_type
			};
			var options = {
				expiresIn : 604800
			};
			var token = jwt.sign(payload,superSecret,options);
			res.send({
				status : 'Success',
				message : 'Logged in successfully',
				name : results[0].name,
				email : results[0].email,
				mobile : results[0].mobile,
				user_type : results[0].user_type,
				token : token
			});
		} else {
			// Failed login
			res.send({
				status : 'Failed',
				message : 'Invalid combination'
			});
		}
	});
});

adminRoutes.use(function(req,res,next) {
	var token = req.headers['x-access-token'] || req.query.token || req.body.token;
	if(token) {
		tokenBlacklisted(req.body.token, function(result) {
			if(result) {
				// Token is blacklisted, reject.
				res.send({
					status : 'Failed',
					message : 'Token has expired'
				});
			} else {
				jwt.verify(token, superSecret, function(err,decoded) {
					if(err) {
						res.json({
							status : 'Failed',
							message : 'Invalid token detected'
						});
					} else {
						if(decoded.userType == 'admin') {
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
			}
		});
	} else {
		return res.status(403).send({
			status : 'Failed',
			message : 'No token detected'
		});
	}
});

/**************************
* Admin Utility Functions *
**************************/
adminRoutes.post('/addStyle', function(req,res) {
	// Declare transaction object
	var txn = db.batch();
	var id_exists = 0;
	// Store image nodes
	var images = req.body.node.images;
	// Unset images in request object
	delete req.body.node.images;
	// Save remainder of object as style
	var style = req.body.node;
	// Check style object for id
	if(typeof style.id !== 'undefined') {
		res.send({
			status : 'Failed',
			message : 'ID field present'
		});
		return;
	}
	// Check images for id
	// Potential bottleneck since forEach is used
	images.forEach(function(item) {
		if(typeof item.id !== 'undefined') {
			id_exists = 1;
		}
	});
	if(id_exists) {
		res.send({
			status : 'Failed',
			message : 'ID field present'
		});
		return;
	}

	var s = txn.save(style);
	var r = txn.save(images);
	txn.relate(s, 'HAS_ROOM', r);

	txn.commit(function(err,results) {
		if(err) {
			console.log(err);
			res.send({
				status : 'Failed',
				message : 'Transaction failed'
			});
		}
		// Add labels to transaction nodes
		db.label(results[0], 'Profiles', function(err) {
			if(err) {
				var query = 'MATCH (p)-[rel:HAS_ROOM]->(r) WHERE ID(p)={id} DELETE rel,p,r';
				db.query(query, {id : results[0].id}, function(err,results) {
					if(err) {
						console.log(err);
					}
				});
			} else {
				db.label(results[1], 'Rooms', function(err) {
					if(err) {
						var query = 'MATCH (p)-[rel:HAS_ROOM]->(r) WHERE ID(p)={id} DELETE rel,p,r';
						db.query(query, {id : results[0].id}, function(err,results) {
							if(err) {
								console.log(err);
							}
						});
					}
					res.send({
						status : 'Successful',
						message : 'Style Inserted'
					});
				});
			}
		});
	});
});

adminRoutes.post('/editStyle', function(req,res) {
	var id_exists = 0;
	// Store image nodes
	var images = req.body.node.images;
	// Unset images in request object
	delete req.body.node.images;
	// Save remainder of object as style
	var style = req.body.node;
	// Check style object for id
	if(typeof style.id == 'undefined') {
		res.send({
			status : 'Failed',
			message : 'ID field absent'
		});
		return;
	}
	// Declare transaction object
	var txn = db.batch();
	var s = txn.save(style);
	var r = txn.save(images);
	txn.relate(s, 'HAS_ROOM', r);
	txn.commit(function(err,results) {
		if(err) {
			console.log(err);
			res.send({
				status : 'Failed',
				message : 'Transaction failed'
			});
		}
		res.send(results);
	});
});

adminRoutes.post('/removeStyle', function(req,res) {
	if(typeof req.body.style !== 'undefined' && req.body.style == 1) {
		// Delete entire style
		var query = 'MATCH (p:Profiles)-[rel]-(r) WHERE ID(p)={id} DELETE rel,p,r;';
		db.query(query,{id : req.body.nodes}, function(err,result) {
			if(err) {
				console.log(err);
				res.send({
					status : 'Failed',
					message : 'Style deletion failed'
				});
			}
			console.log(result);
			res.send({
				status : 'Successful',
				message : 'Style deleted'
			});
		});
	} else {
		// Delete requested nodes
		var txn = db.batch();
		txn.delete(req.body.nodes, true);
		txn.commit(function(err,results) {
			if(err) {
				console.log(err);
				res.send({
					status : 'Failed',
					message : 'Transaction failed'
				});
			}
			res.send({
				status : 'Successful',
				message : 'Transaction completed'
			});
		});
	}
});

app.use('/admin', adminRoutes);

/**************
* Start Server *
**************/
if(mode) {
	app.listen(port, function() {
		console.log('[TEST MODE] Listening on port: ' + port);
	});
} else {
	https.createServer(options, app).listen(port, function () {
		console.log('[LIVE MODE] Listening on port: ' + port);
	});
}
