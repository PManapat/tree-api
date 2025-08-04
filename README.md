
# Tree API

A RESTful API for managing a hierarchical tree structure built with TypeScript, Node.js, and PostgreSQL via Prisma ORM.

## Features

- Nested tree node creation with parent-child relationships
- Full tree retrieval in hierarchical format
- Duplicate prevention under same parent
- API key authentication
- Fully tested with Jest

## Tech Stack

- Node.js
- TypeScript
- PostgreSQL
- Prisma ORM
- Jest for testing
- Render (Deployment for server and database)

---
## Test Deployed APIs on Render

- uri: https://tree-api-et5g.onrender.com
    - Endpoints are listed below

---

## Getting Started

1. Clone the repo
- git clone https://github.com/Pmanapat/tree-api.git
- cd tree-api
- npm i
- npx prisma generate

2. Create a local PostgreSQL database
- default postgres user with no password
    - createdb tree_api

3. Set up .env - Can use your own postgreSQL db
- DATABASE_URL= postgresql://localhost:5432/tree_api
- API_KEY=123snhai

4. Push Prisma schema
- npx prisma db push
- npx prisma db push

5. Start the server
- npm run dev

6. *Must Run jest testing to create root node* (More details on edge cases at end of README)
- npm run test

## Authentication
Include your API key in all requests:
- header: x-api-key:123snhai

## End Points
Returns the full tree structure, nested from root nodes to their children recursively

Response: 200

{
  "status": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "label": "root",
      "parentId": null,
      "createdAt": "2025-08-03T00:00:00.000Z",
      "children": [
        {
          "id": 2,
          "label": "child1",
          "parentId": 1,
          "children": [...]
        }
      ]
    }
  ]
}

## POST /api/tree
Creates a new node in the tree

Request Body:
{
  "label": "child1",
  "parentId": 1
}

label: string – Required
parentId: number | null – Optional. Use null to attempt to create a root node (discouraged in production; root typically seeded once).

Response: 
200 Created on success
409 Conflict if duplicate label under the same parent
400 Bad request if label is missing or parentId is invalid

{
  "status": 201,
  "message": "Node created successfully",
  "data": {
    "id": 3,
    "label": "child1",
    "parentId": 1
  }
}

## Run Tests
npm test

### Test Cases:
POST /api/tree
- Should create a valid child node under the root
- Should fail to create a node with an invalid parentId
- Should fail to create a root node manually (only one root allowed)
- Should not allow duplicate labels under the same parent
- Should allow same label under different parents
- Reset and reinsert root + elephant via SQL (used for setup/test)

##### GET /api/tree
- Should return a nested tree with root and children
- Should return an empty array if no nodes exist