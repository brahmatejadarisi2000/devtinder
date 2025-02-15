
#Apis

authRouter
- POST /signup
- POST /login
- POST /logout

profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

connectionReqRouter
- POST /request/send/intrested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

- GET /user/connections
- GET /user/request
- GET /user/feeds -> get profiles of other users on the platform

Status: ignore, intrested, accepted, rejected
