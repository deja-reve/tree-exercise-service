// @ts-nocheck

import fs from "fs";

// Seed the in memory data structure from data.json
const recordsBuffer = fs.readFileSync("data.json");
const records = JSON.parse(recordsBuffer);

const parseChildren = (children) => {
  const parsedChildren = [];

  for (const childId of children) {
    const { label, children } = records[childId];

    const node = {
      id: childId,
      label,
      children: parseChildren(children),
    };

    parsedChildren.push(node);
  }

  return parsedChildren;
};

export const initializeTree = () => {
  try {
    const rootId = "1";
    const tree = [];

    const { label, children }: { label: string; children: string[] } =
      records[rootId];

    const rootNode = {
      id: rootId,
      label,
      children: parseChildren(children),
    };

    tree.push(rootNode);

    return tree;
  } catch (error) {
    console.error("Error parsing data.json:", error);
    return [];
  }
};

export const insertNode = (parentId, label) => {
  if (!records[parentId]) {
    throw new Error("Parent node does not exist");
  }

  // NOTE: Generally I would use a UUID for the node ID, but for the sake of this
  //       exercise I'm just using the next available integer.
  const newNodeId = Object.keys(records).length + 1;
  const newNode = {
    label,
    parent: parentId,
    children: [],
  };

  records[newNodeId] = newNode;

  const parentNode = records[parentId];
  parentNode.children.push(newNodeId.toString());

  const data = JSON.stringify(records, null, 2);
  fs.writeFileSync("data.json", data);

  return { id: newNodeId, ...newNode };
};
