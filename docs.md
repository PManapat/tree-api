# Tree API Documentation

The Tree API allows developers to interact with a hierarchical tree structure via RESTful endpoints. Nodes can be added with parent-child relationships, and the full tree can be fetched in nested form.

---

## Authentication

All requests must include an `x-api-key` header.

x-api-key: your_api_key_here

---

## ENDPOINTS

## GET /api/tree
Returns the full tree structure, nested from rot nodes to their children recursively

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

## Edge Cases

Root node creation is only allowed if no other nodes exist.
Duplicate labels under the same parent are rejected.
Same labels under different parents are allowed.

