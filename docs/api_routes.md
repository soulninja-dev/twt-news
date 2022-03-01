# API routes

_Discord OAuth is used for authenticated and authorization_

- GET **/** -> redirect to /posts
- GET **/posts** -> home page
- GET **/posts/create** -> page to create a new post
- POST **/posts/create** -> authenticated users can create a new post
- DELETE **/posts/:id** -> the author of that post can delete it
- GET **/auth/discord** -> discord oauth endpoint
- GET **/auth/logout** -> remove cookie, and logout

# Oauth flow

1. login button is clicked and redirected to /auth/discord
2. since there's no query param of code, redirected to discord's auth page
3. once authorize is clicked, discord redirects back to /auth/discord?code=dfdfdfas
4. now that we have code, we're sending post req to discord and getting back the access token, refresh token etc
5. this token is now signed into a jwt token and sent back to user as jwt cookie, and redirected to home
6. in home, for every load, javascript checks if user is signed in by checking existance of cookie
7. if cookie exists, send get req to /auth/user
8. cookie is verified, and decoded
9. call discord api with access token as Bearer and info is sent back to client
10. information displayed on client
