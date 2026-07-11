# 💬 Sandeshan - a Real-time chat Application


# Sandeshan

Sandeshan is a real-time social networking and messaging platform that enables users to connect, build friendships, and communicate instantly. 
Users can send and manage friend requests, chat with friends in real time using WebSockets, block unwanted users, and 
personalize their profiles through a secure and responsive interface. 
The application is designed with scalability, security, and modern web development practices to deliver a seamless user experience.

The application follows modern software engineering best practices and supports 100+ concurrent users.



## 📖 About

Sandeshan is a full-stack real-time social networking and messaging application built to provide a secure and engaging communication experience. 
The platform allows users to create accounts, explore a personalized feed, discover other users, send and manage friend requests, and 
build connections through a streamlined social workflow.

Once a friend request is accepted, both users are added to each other's friends list and can communicate instantly through real-time messaging powered by WebSockets. 
The application also includes user blocking functionality, profile management, and secure authentication to ensure a safe and personalized experience.

It also follows accessibility guidelines (WCAG). 

The project follows modern software engineering practices with scalable architecture, RESTful APIs, responsive user interface design, efficient state management, and 
real-time communication. 

It emphasizes performance, maintainability, and security while demonstrating production-level full-stack development using the MERN Stack.

Sandeshan is deployed with Vercel (Frontend), Render (Backend), and MongoDB Atlas (Database) and has been load-tested(k6) to reliably handle more than 100 concurrent users.


## ✨ Features

- JWT Authentication
- Middlewares
- Input Validations and Sanitization
- Files upload
- Secure REST APIs
- MVC Architecture
- Proper Schema Design
- Websockets for real-time chat



## 🛠️ Tech Stack

### Backend
- Nodejs
- Express.js
- Mongoose
- Password Hashing(bcrypt)
- JWT
- Cookie-parser
- validator

### Real-Time Communication
- Websockets

### Deployment
- Render
- MongoDB Atlas

### Tools
- Git
- GitHub
- VS Code
- API Tesing on Postman
- K6 Load test



## 📡 API Design

### Authentication

```http
POST /signup
POST /login
POST /logout
```

### Profile Management
```http
GET /profile
PATCH /profile/edit
PATCH /profile/forgot-password
```


### Users Management

```http
GET /users
POST /user/requested/:id
```

### Requests Management

```http
GET /requests
POST /requests/accept/:id
POST /requests/reject/:id
```

### Friends Management

```http
GET /friends
DEL /unfriend/:id
POST /blocked/:id
```

### Block Management

```http
GET /blocked-users
DEL /unblock/:id
PATCH /remove/:id
```

### Chat Management

```http
GET /chat/:targetId
```




## 📂 Folder Structure

```text
├── Sandeshan-backend/
│   ├── config/
    ├── middlewares/
    ├── models
    ├── routes
    ├── utils
│   ├── .gitignore
    ├── server.js
│   └── package.json
    └── README.md
```


## 🏗️ Architecture

```text
            Client(React)
                 │
           Server(Express)
                 │
      Middlewares(auth,rate limiters)
                 │
             Controllers
                 │
              Caching
                 │
              MongoDB
```


## ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/Ganeshdvp/Sandeshan-backend.git
```

Navigate to the project

```bash
cd Sandeshan-backend
```

Install dependencies

```bash
npm install
```

Start frontend

```bash
node server.js
```



### Performance Optimization

- API Optimizations
- Database Optimization
- Paginations


## 🔒 Security

- JWT Authentication
- Password Hashing (bcrypt)
- Helmet
- CORS Protection
- Input Validation and Sanitizations
- Secure HTTP Headers with HTTPS
- Preventing unauthorized access
- Dotenv
- Cookies
- Proper Error Handlings
- CSP
- Updating Dependencies everytime


## 🧪 Testing

- Manual testing
- API Testing on Postman
- Load tested using k6
- Lighthouse Audit


## 👨‍💻 Author

Cherupalli Ganesh

GitHub:
[https://github.com/Ganeshdvp/Ganeshdvp.git](https://github.com/Ganeshdvp/Ganeshdvp.git)

LinkedIn:
[https://www.linkedin.com/in/cherupalli-ganesh](https://www.linkedin.com/in/cherupalli-ganesh)



## Thank you:)








