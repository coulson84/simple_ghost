# Ghost

 - Prerequisites - Redis (non-essential)

 - to install 
 	`
 	make install
 	`

 - There are a limited number of tests that can be run via
 	`
 	make test
 	`

 - you can run the server either via
 	`
 	npm start
 	`
 	or
 	`
 	node ./server/main.js
 	`
  The game can then be accessed via http://127.0.0.1:8001. When on a computer with a keyboard simply type letters in order for them to be used. On a mobile device there should be a select menu available to enter letters.

  Redis is used as a persistent session store, whilst it will log an error to the console when the server runs if Redis is not available it will not prevent the server from working.