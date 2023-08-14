# Auth Service

Provides user identification after a user authenticates through an API using this microservice.
This is a microservice using NodeJS with Express and MongoDB for handling users authentication.

---

## Json Web Token (JWT)

JWT defines a way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed. JWTs can be signed using a secret or a public/private key pair.
* https://jwt.io/introduction

### Access Token

Token used to authenticate a User through an API.   
For security concerns this one should be stored in memory so it can be garbage-collected on app close or after a desired amount of time.
Do note that with signed tokens, all the information contained within the token is exposed to users or other parties, even though they are unable to change it. This means you should not put secret information within the token.
Also, if it's compromised the attacker has short time to use it.


* Short time living
* Stored in client memory (accessible through JS)
* Issued in auth
* Used until expires
* API verifies it using a middleware
* New one issued at Refresh Request

### Refresh Token

Token used to retrieve a new Access Token from an API.   
For security concerns this one should be stored in an http cookie, this way is not accessible from javascript and less promt to be compromised. 

* Long time living
* Stored in app DB & client httpOnly cookie (not accessible through JS)
* Issued in auth
* Expires on logout (but also after some time)
* Client uses it to request a new Access Token
* Verified with endpoint and DB

---

Inspiration from Tutorial: https://www.youtube.com/watch?v=favjC6EKFgw
* minute 5:45 --> creating access token secrets with crypto random strings
* minute 13:00 --> JWT auth tokens
* minute 29:00 --> cookie parser