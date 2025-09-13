**Todo GraphQL Backend**

A full-featured GraphQL API built with Node.js, TypeScript, Express, Apollo Server, Sequelize ORM, and PostgreSQL, featuring JWT authentication and CRUD for Todos.

**Getting Started**

1. Clone repo
git clone https://github.com/rahulanantharamu/todo-backend.git

2. Install dependencies
npm  install

3. Set Environment Variables
PORT=4000
DATABASE_URL=postgresql://username:password@localhost:5432/tododb
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tododb
DB_USER=username
DB_PASSWORD=password
NODE_ENV = development

4. Run Migrations
npx sequelize-cli db:migrate

5. Run App
npm run build
npm start


**Sample GraphQL queries/mutations**

1. signup

*Request*

mutation {
  signup(
    input: {
      name: "Alice"
      email: "alice@example.com"
      password: "password123"
    }
  ) {
    message
    user {
      id
      name
      email
    }
  }
}

*Response*

{
  "data": {
    "signup": {
      "message": "Signup successful",
      "user": {
        "id": "4",
        "name": "Alice",
        "email": "alice@example.com"
      }
    }
  }
}

2. login

*Request*

mutation {
  login(
    input: { 
      email: "alice@example.com" 
      password: "password123" 
    }
    ) {
    message
    token
    user {
      id
      name
      email
    }
  }
}

*Response*

{
  "data": {
    "login": {
      "message": "Login successful",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYWxpY2VAZXhhbXBsZS5jb20iLCJpYXQiOjE3NTc2MTEwNzYsImV4cCI6MTc1ODIxNTg3Nn0.ORTeCgZfTYBnPHT1XeMJjil_ZUfOiNIZtn7-C5oHt9Q",
      "user": {
        "id": "4",
        "name": "Alice",
        "email": "alice@example.com"
      }
    }
  }
}


3. Current user (me)

*Request*

query {
  me {
    id
    name
    email
  }
}

*Response*

{
  "data": {
    "me": {
      "id": "4",
      "name": "Alice",
      "email": "alice@example.com"
    }
  }
}


4. Todo Creation

*Request*

mutation {
  createTodo(
    input: {
      title: "Finish project"
      description: "Build the GraphQL Todo App end-to-end"
      dueDate: "2025-09-20"
      status: IN_PROGRESS
    }
  ) {
    id
    title
    description
    status
  }
}


*Response*

{
  "data": {
    "createTodo": {
      "id": "10",
      "title": "Finish project",
      "description": "Build the GraphQL Todo App end-to-end",
      "status": "IN_PROGRESS"
    }
  }
}


5. Update todo

*Request*

mutation {
  updateTodo(
    id: 10
    input: {
      title: "Finish integration"
      description: "Update Todo mutation works"
      status: DONE
    }
  ) {
    id
    title
    description
    status
  }
}


*Response*

{
  "data": {
    "updateTodo": {
      "id": "10",
      "title": "Finish integration",
      "description": "Update Todo mutation works",
      "status": "DONE"
    }
  }
}


6. Get single todo

*Request*

query {
  todo(id: 10) {
    id
    title
    description
    status
  }
}

*Response*

{
  "data": {
    "todo": {
      "id": "10",
      "title": "Finish integration",
      "description": "Update Todo mutation works",
      "status": "DONE"
    }
  }
}

7. Get list of todos 

*Request*

query {
  todos(page: 1, limit: 10) {
    items {
      id
      title
      status
    }
    total
    page
    limit
  }
}

*Response*

{
  "data": {
    "todos": {
      "items": [
        {
          "id": "10",
          "title": "Birthday wish",
          "status": "DONE"
        },
        {
          "id": "9",
          "title": "Finish project",
          "status": "IN_PROGRESS"
        },
        {
          "id": "8",
          "title": "Hit the gym",
          "status": "IN_PROGRESS"
        },
        {
          "id": "2",
          "title": "Finish integration",
          "status": "DONE"
        }
      ],
      "total": 4,
      "page": 1,
      "limit": 10
    }
  }
}

8. Get list of todos with filter

*Request*

query {
  todos(page:1, limit:10, status: IN_PROGRESS) {
    total
    items { 
      id 
      title 
      status 
    }
  }
}

*Response*

{
  "data": {
    "todos": {
      "total": 2,
      "items": [
        {
          "id": "9",
          "title": "Finish project",
          "status": "IN_PROGRESS"
        },
        {
          "id": "8",
          "title": "Gym",
          "status": "IN_PROGRESS"
        }
      ]
    }
  }
}


9. Delete todo

*Request*

mutation {
  deleteTodo(id: 10) {
    success
    message
  }
}


*Response*

{
  "data": {
    "deleteTodo": {
      "success": true,
      "message": "Todo deleted"
    }
  }
}