# SQL Queries

## Create Tree Table

```
CREATE TABLE Tree (
id INT PRIMARY KEY,
label VARCHAR(255) NOT NULL,
parent INT,
FOREIGN KEY (parent) REFERENCES Tree(id)
);
```

## Retrieve All Records With Hiearchy Intact

```
WITH RECURSIVE tree AS (
    SELECT id, label, parent
    FROM Tree
    WHERE parent IS NULL
    UNION ALL
    SELECT t.id, t.label, t.parent
    FROM Tree t
    INNER JOIN tree tr ON t.parent = tr.id
)
SELECT * FROM tree;
```

## Retrieve All Records (Brute Force)

```
SELECT * FROM Tree;
```

## Insert New Node

```
INSERT INTO Tree (id, label, parent)
VALUES (3, 'new node', 1);
```

## Insert New Node (Transaction)

```
BEGIN;
    -- Try to insert the new node
    INSERT INTO Tree (id, label, parent) VALUES (3, 'new node', 1);

    -- Check if the parent node exists
    IF NOT EXISTS (SELECT 1 FROM Tree WHERE id = 1) THEN
        -- If the parent node does not exist, roll back the transaction
        ROLLBACK;
        RAISE 'Parent node does not exist';
    END IF;

    -- If everything is OK, commit the transaction
    COMMIT;
EXCEPTION
    WHEN others THEN
        -- If any error occurs, roll back the transaction
        ROLLBACK;
        RAISE;
END;
```
