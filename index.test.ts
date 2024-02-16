import request from "supertest";
import app from "./index";
import { initializeTree } from "./helper";

const generateMockResponse_retrieveAll = () => {
  return initializeTree();
};

describe("GET /api/tree", () => {
  it("should return all of the records from 'data.json' as a tree object in JSON format", async () => {
    const mockResponse = generateMockResponse_retrieveAll();

    const response = await request(app).get(`/api/tree`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);
  });
});

describe("POST /api/tree", () => {
  it("should insert a node/record into the tree structure defined in 'data.json'", async () => {
    const response = await request(app).post("/api/tree").send({
      parent: "1",
      label: "bird",
    });

    expect(response.status).toBe(201);
    expect(response.body.label).toEqual("bird");
    expect(response.body.parent).toEqual("1");
  });
});

it("should fail to insert a node/record because the parent does not exist", async () => {
  const response = await request(app).post("/api/tree").send({
    parent: "999",
    label: "axolotl",
  });

  expect(response.status).toBe(404);
  expect(response.text).toEqual("Parent node does not exist");
});
