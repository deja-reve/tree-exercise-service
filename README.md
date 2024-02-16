# Javascript Implementation

Hello 🙋🏼‍♀️ I hope you are well today.

## The Basics

Checkout the branch name `node-implementation`

To build, open your terminal and navigate to the `javascript` directory in this project and run `npm install`.

To start your server, run `npm start`

To lint the project, run `npm run lint`.

## Task 1 | GET /api/tree

To test task 1 you could do the following...

#### Method 1:

run `npm test`

This will run 3 test in total. The test with the descriptor `should return all of the records from 'data.json' as a tree object in JSON format` should pass.

#### Method 2:

- run `npm start`

This will start the server at port 3001. Hot reloading is enabled.

Run the following curl command in a terminal to retrieve all records:

```
curl http://localhost:3001/api/tree
```

## Task 2 | POST /api/tree

To test task 2 you could do the following...

#### Method 1:

run `npm test`

The test with the descriptors

- `should fail to insert a node/record because the parent does not exist`

and

- `should insert a node/record into the tree structure defined in data.json as a tree object in JSON format`

should pass.

#### Method 2:

- run `npm start`

This will start the server at port 3001. Hot reloading is enabled.

Run the following curl command in a terminal to insert a node:

```
curl -X POST -H "Content-Type: application/json" -d '{"parent": "1", "label": "new node"}' http://localhost:3001/api/tree
```

## Task 3 | Data Persistance

Assuming we want to use SQL to query our database we can flatten the tree data into records. I chose PostgreSQL as my dialact.

Regarding a schema for the database:

```

CREATE TABLE Tree (
id INT PRIMARY KEY,
label VARCHAR(255) NOT NULL,
parent INT,
FOREIGN KEY (parent) REFERENCES Tree(id)
);

```

- `id` is the primary key of the record.
- `label` is a string that stores the label of the record.
- `parent` is a foreign key that references the id of another record in the Tree table. This represents the parent-child relationship between records.

With this schema, you can find the children of a record by querying for all records where parent is the id of the record.

### Database Read Considerations:

If you're dealing with a large amount of data and performance is a concern, there are a few strategies you can use to optimize the query:

- Indexing: Make sure the parent and id columns are indexed. This can significantly speed up the JOIN operation in the recursive part of the query.

- Limit the depth of recursion: If your tree is very deep and you don't need the whole tree, you can limit the depth of recursion to a certain level.

- Materialized View: If your data doesn't change frequently, you can store the result of the recursive query in a materialized view and select from that view instead of running the recursive query every time.

- Denormalization: If read performance is a priority and you frequently need to access the entire tree, you might want to consider denormalizing your data. For example, you could store the path to each node in a separate column and use that to retrieve the tree.

### Database Write Considerations:

- Race conditions: If another process is trying to delete the same node at the same time you're trying to write to it, you could end up with inconsistent data. To prevent this, you can use transactions to ensure that these operations are atomic. This means that they are treated as a single unit of work, and either all changes are committed to the database, or none are.

- Foreign key constraints: If you're inserting a new node with a parent value that references an existing node's id, and that node is deleted by another process before the new node is inserted, the insert operation will fail due to a foreign key constraint violation.

- Deadlocks: In a concurrent environment, if multiple processes are trying to access the same resources in a different order, it can lead to a deadlock, where each process is waiting for the other to release a resource. Most databases have mechanisms to detect and resolve deadlocks, but it's still something to be aware of.

- Performance: Writing to a database can be a relatively slow operation, especially if the database needs to maintain a certain level of consistency or durability. If you're writing a lot of new nodes in a short amount of time, it could impact the performance of your application.

To make the insert operation more robust, you can use transactions, error handling, and conditional logic.
