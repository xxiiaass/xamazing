db.blogtxts.drop();

db.blogtxts.insert({
	'id':10000001,
	'title': 'Hello world',
	'content': 'This is my first blog!'
});

db.blogtxts.insert({
	'id':10000002,
	'title': 'Hello world 2',
	'content': 'This is my second blog!'
});

db.blogtxts.insert({
	'id':10000003,
	'title': 'Hello world 3',
	'content': 'This is my thrid blog!'
});

db.comments.drop();

db.comments.insert({
	'id':20000001,
	'targetid':10000003,
	'content': 'good'
});

db.comments.insert({
	'id':20000002,
	'targetid':10000003,
	'content': 'very good'
});

db.piclifes.drop();

db.piclifes.insert({
	'id':30000001,
	'title': 'test1',
	'content':'teeee',
	'path':'/images/yiyexhao1.jpg',
})

db.piclifes.insert({
	'id':30000002,
	'title': 'test1',
	'content':'teeee',
	'path':'/images/showtime.jpg',
})

db.piclifes.insert({
	'id':30000003,
	'title': 'test1',
	'content':'teeee',
	'path':'/images/sunrise.jpg',
})
db.piclifes.insert({
	'id':30000004,
	'title': 'test1',
	'content':'teeee',
	'path':'/images/td.jpg',
})