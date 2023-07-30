# PolyglotChat

PolyglotChat is a chatting platform with facility of getting messages in your own preferred language.
Imagine a situation where there are 5 people in a room but no one knowing each other's language.
Now if they all wanna talk, thay can't talk directly but can send messages after translating them in google.
If you wanna have a conversation, this doesn't sounds like a good Idea.
So, that's where PolyglotChat comes into picture.
In this platform , you can join any room and can have conversation with anyone even though you don't know there language.
Whatever msg you send in the specific room, the receiver will get it translated into their own preferred language.
And whatever the other person in the room sends you in chat, you will receive it in your own preferred language.
Whenever you signup to the platform, you can select your preferred language.
That preferred language can be changed from the platform itself.

# Prerequisites Of Running this application(With Docker)

1. Docker & Docker compose installed in your system.
2. Mongodb

# Prerequisites of Running this application (locally)

1. Node, mongodb installed in your system

# Steps to setup the project in docker:

1. Clone the repository.

2. Run the command `docker-compose up -d --build` inside the directory of this project (exactly where docker compose file is present. )
   Docker will install all it needs to run the project

# Steps to setup the project locally:

1. Clone the repository.

2. Set all env variables in .env file as mentioned in example.env file

3. Run `npm i` command to install all the project dependencies.

4. Run `npm start` command to start the server.

Now when you will hit the URL `http://localhost:3000/`, you would see the Html file rendering PolyGlotChat platform.

Note: Rightnow I have not integrated all the APIs in frontend.

I have implemented basic frontend to showcase socket events handling.

You can refer to the postman collection of the APIs developed in this project : `https://polyglotchat.postman.co/workspace/PolyGlotChat-Workspace~3181ac45-f33a-4795-8fcd-e340057acd56/collection/28289805-fda3550c-bb47-4885-9080-68d8834fe1f1?action=share&creator=28289805`

Also you need to register user first in order to access other APIs as all the APIs needs authentication token.
Here is the curl : `curl --location 'http://localhost:3000/user/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "fullName": "Test User",
    "email": "test@gmail.com",
    "password":"Test@123",
    "preferredLanguage":"hi"
}'`

Now when user will login in, they will get accessToken with which you user can access all other APIs.

That's all about the current first version of PolyGlotChat. Thanks!
