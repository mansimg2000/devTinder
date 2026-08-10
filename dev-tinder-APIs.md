# dev-tinder APIS

## auth APIS
- POST - /signup
- POST - /login
- POST - /logout

## profileRouter
- GET - /porfile/view
- PATCH - /profile/edit
- PATHCH - /profile/password

## connectionRouter
- POST - request/send/intrested/:userId
- POST - request/send/ignore/:userId

- POST - request/accept/:requestId
- POST - request/reject/:requestId

## userRouter
- GET /user/connection
- GET /user/requests
- GET /user/feed - gets you profiles of other users.