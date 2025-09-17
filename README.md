# Lead Management System – Backend

A Role-Based Access Control (RBAC) backend system built with Node.js, Express.js, and MongoDB.

This project demonstrates secure JWT authentication, admin-controlled user onboarding, lead CRUD operations, role-based access permissions, and activity logging.

---

##  Features

 JWT Authentication & Role-Based Access Control (RBAC)

 Admin Can register Managers & Sales Reps

 Manager
    Full CRUD on Leads
    Assign leads to Sales Reps

 Sales Rep
-  View only assigned leads
- Update status (Engaged/Disposed)
- Log sales activities (notes + timestamps)

---

## Tech Stack

- Node.js, Express.js
- MongoDB, Mongoose
- JWT, bcryptjs

---

## 4. **Setup & Run Instructions**

Step-by-step guide to get the project running:

1. Clone repo
```
   git clone https://github.com/roysouvik50000/lead-management-system-server.git

   cd lead-management-system

```

2. Install dependencies
```
   npm install

```

3. Create `.env` file with config

```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/Lead_Management_System
   JWT_SECRET= your_jwt_secret
   JWT_EXPIRES_IN=1d
```
4. Run server (`npm start`)
```
   npm start

```
---


---

# 6. **\*API Documentation**

## **Auth APIs**

 ####   - Register User (Admin only)
 - Endpoint: POST /api/auth/register
- Headers: Authorization: Bearer <token>
- Body:
```
    {
        "name": "My Manager",
        "email": "manager@example.com",
        "password": "123456",
        "role": "Manager"
        }

```
Response:
```

    {
        "message": "User registered successfully",
        "user": { 
            "id": "68ca4afca1270650a90e28de",
            "name": "My Manager",
            "email": "manager@example.com",
            "role": "Manager" 
            }
    }

```

    Body:

```
          {
        "name":"My SalesRep",
        "email":"salesrep@example.com",
        "password":"123456",
        "role":"SalesRep"
        }
```
    Response:
```

            {
            "message": "User registered successfully",

            "user": {
                "id": "68ca4bbba1270650a90e28e1",
                "name": "My SalesRep",
                "email": "salesrep@example.com",
                "role": "SalesRep"
            }
        }

```

### - Login
- Endpoint: POST /api/auth/login

-Body:
```
    {
        "email": "manager@example.com",
        "password": "123456"
    }

```

-Response:

```
    {
        "message": "Login successful",
        "token": "eyJhbGciOiJIUzI1...",
        "user": { "id": "64b...", "name": "My Manager", "role": "Manager" }
    }

```

---


## **Lead APIs**

  ## 1. Create Lead (Manager)
  1. Create Lead (Manager only)
   - Endpoint: POST /api/leads
   - Headers: Authorization: Bearer <token>

-Body:
```
    {
        "name": "New Lead1",
        "email": "lead1@web.com",
        "phone": "9876543210"
    }

```

-Response:
```
{
  "message": "Lead created",
  "lead": {
    "name": "New Lead1",
    "email": "lead1@web.com",
    "phone": "9876543210",
    "status": "New",
    "_id": "68ca4f55a1270650a90e28e4",
    "activities": [],
    "createdAt": "2025-09-17T06:04:05.768Z",
    "updatedAt": "2025-09-17T06:04:05.768Z",
    "__v": 0
  }
}

```

 2. Get Leads
- Endpoint: GET /api/leads
 -   Manager → all leads
  -  SalesRep → only assigned leads

-Response:
```
[
        {
            "id": "64c...",
            "name": "Acme Corp",
            "status": "Assigned",
            "assignedTo": { "id": "64b...", "name": "Sales Rep 1" }
        }
    ]
```
  3. Update Lead
- Endpoint: PUT /api/leads/:id
- Manager → full update
- SalesRep → can only change status (Engaged/Disposed) and add notes
- Body:
```
    {
        "status": "Engaged",
        "note": "Follow-up scheduled for next week"
    }
```
  4. Delete Lead (Manager only)
   - Endpoint: DELETE /api/leads/:id
   - Response:

```
    { 
        "message": "Lead deleted successfully" 
        }
```
  5. Assign Lead to SalesRep (Manager only)
-  Endpoint: PUT /api/leads/:id/assign/:userId
- Response:
```
    {
    "message": "Lead assigned successfully",
    "lead": {
        "_id": "68ca4f55a1270650a90e28e4",
        "name": "New Lead1",
        "email": "lead1@web.com",
        "phone": "9876543210",
        "status": "Assigned",
        "activities": [
        {
            "action": "Assigned",
            "note": "Lead assigned to My SalesRep",
            "actor": "68ca4afca1270650a90e28de",
            "_id": "68ca5295a1270650a90e28ee",
            "timestamp": "2025-09-17T06:17:57.023Z"
        }
        ],
        "createdAt": "2025-09-17T06:04:05.768Z",
        "updatedAt": "2025-09-17T06:17:57.031Z",
        "__v": 1,
        "assignedTo": "68ca4bbba1270650a90e28e1"
        }
    }

```
  6. SalesRep Logs Activity
   - Endpoint: POST /api/leads/:id/activity
   - Body:
```
    {
        "status": "Engaged",
        "note": "Discussed pricing with client."
    }

```
    Response:
    
```
    {
    "message": "Activity logged",
    "lead": {
        "_id": "68ca4f55a1270650a90e28e4",
        "name": "New Lead1",
        "email": "lead1@web.com",
        "phone": "9876543210",
        "status": "Engaged",
        "activities": [
        {
            "action": "Assigned",
            "note": "Lead assigned to My SalesRep",
            "actor": "68ca4afca1270650a90e28de",
            "_id": "68ca5295a1270650a90e28ee",
            "timestamp": "2025-09-17T06:17:57.023Z"
        },
        {
            "action": "Sales Activity",
            "note": "Discussed pricing with client.",
            "actor": "68ca4bbba1270650a90e28e1",
            "_id": "68ca5354a1270650a90e28f5",
            "timestamp": "2025-09-17T06:21:08.810Z"
        }
        ],
        "createdAt": "2025-09-17T06:04:05.768Z",
        "updatedAt": "2025-09-17T06:21:08.811Z",
        "__v": 2,
        "assignedTo": "68ca4bbba1270650a90e28e1"
        }
    }

```

---

## 7. **Postman Collection**

 “Import `LeadManagementSystem.postman_collection.json` in Postman to test APIs.”

---

## 8. **Folder Structure**

Show how the code is organized:

```
project/
 ├─ config/
 ├─ controllers/
 ├─ middleware/
 ├─ models/
 ├─ routes/
 ├─ server.js
 ├─ package.json
 └─ .env
```

---


---

## 9. **Notes**
    - Admin user should be seeded manually in DB for first login.
    - JWT expiration is set to 1 day.
    - SalesRep can only change status to "Engaged" or "Disposed".

    ```
    Email: admin@example.com
    Password: admin123

    ```

---