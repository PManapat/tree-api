
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

---
 
## Getting Started

1. Clone the repo
- git clone https://github.com/Pmanapat/tree-api.git
- cd tree-api
- npm i
- npx prisma generate

2. Set up .env
DATABASE_URL=
API_KEY=

3. Push Prisma schema
npx prisma db push

4. Start the server
npm run dev

## Authentication
Include your API key in all requests:
x-api-key: your_api_key_here

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