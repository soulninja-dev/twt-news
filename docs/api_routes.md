# API routes

_JWT tokens are used for authentication and authorization_

- GET **/** -> redirect to /posts
- GET **/posts** -> home page
- GET **/posts/create** -> page to create a new post
- POST **/posts/create** -> authenticated users can create a new post
- DELETE **/posts/:id** -> the author of that post can delete it
- GET **/auth** -> get login/register page
- POST **/auth/login** -> login and get back a cookie with a jwt token
- POST **/auth/register** -> save user to db and return a cookie with a jwt token
- GET **/auth/logout** -> remove cookie, and logout
