// @ts-nocheck

require("dotenv").config();

import express from "express";
import bodyParser from "body-parser";
import { initializeTree, insertNode } from "./helper";

const app = express();
const router = express.Router();

// Use body-parser middleware to parse JSON input
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;
const ROUTER_PATH = "/tree";

// ** HTTP endpoints **
router.get(ROUTER_PATH, (req, res) => {
  console.log("GET /api/tree/ | Retrieving Tree ");
  res.json(initializeTree());
});

router.post(ROUTER_PATH, (req, res) => {
  console.log("POST /api/tree/ | Inserting Node: ", req.body);
  if (!req.body.parent || !req.body.label) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const newNode = insertNode(req.body.parent, req.body.label);
    return res.status(201).json(newNode);
  } catch (error) {
    return res.status(404).send(error.message);
  }
});

app.use("/api", router);

// ** Start the server - default PORT 3001 **
if (process.env.DEVELOPMENT === "true") {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
