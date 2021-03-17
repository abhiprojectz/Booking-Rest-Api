# Hello 

This is a Express Rest Api in Node.js using MongoDB and JsonWebToken.

> Dont forget to star if this helps.


# Introduction

Basically first install the dependencies using `npm install` after that type in the shell to start the server or the api `npm start` this will execute `node index.js` and the server will be started.

# Stacks used:

+ MongoDB ( For database)
+ Express 
+ Javascript
+ Body-parser
+ Express validators
+ JWT ( Json web token ) for extra security.


# Features

+ The user can be:
	- register
	- login

+ View all the advisors on the site. (they can't add one).
+ Admin can add the advisors.
+ Book a call with the advisor using their id.
+ Can view all the bookings.

# Endpoints

These are all the endpoints prefixing by `localhost:4000/` on defualt port.

+ `/user/register`
+ `/user/login`
+ `/user/<user-id>/advisor`
+ `/user/<user-id>/advisor/<advisor-id>`
+ `/user/<user:id>/advisor/booking`
+ `/admin/advisor` 


# Conclusion

This is created for an internship task feel free to contribute view my other projects here: [github- abhiporjectz](https://github.com/abhiprojectz)
