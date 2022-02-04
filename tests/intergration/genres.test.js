const mongoose = require("mongoose");
const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);

      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return the genre with the given id", async () => {
      const genre = await new Genre({
        name: "genre3",
      }).save();

      const res = await request(server).get(`/api/genres/${genre._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return 400 if invalid id is passed", async () => {
      const res = await request(server).get(`/api/genres/1`);
      expect(res.status).toBe(400);
    });

    it("should return 404 if the genre with given id doesn't exist", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(server).get(`/api/genres/${id}`);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let token;
    let name;

    const exec = () => {
      return request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      name = "1234";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      name = new Array(52).join("a");
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the genre if it is valid", async () => {
      await exec();

      const genre = await Genre.find({ name: "genre1" });

      expect(genre).not.toBeNull();
    });

    it("should return the genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

  describe("PUT /", () => {
    let token;
    let name;
    let objectId;

    const exec = () => {
      return request(server)
        .put(`/api/genres/${objectId}`)
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User({ isAdmin: true }).generateAuthToken();
      name = "genre10";
      objectId = new mongoose.Types.ObjectId();
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      name = "1234";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      name = new Array(52).join("a");
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      name = new Array(52).join("a");
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if invalid id is passed", async () => {
      objectId = "1";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if genre with given id is not found", async () => {
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return the updated genre object", async () => {
      const genre = await new Genre({
        name: "genre5",
      }).save();
      objectId = genre._id;

      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        name,
        _id: genre._id.toHexString(),
      });
    });
  });

  describe("DELETE /", () => {
    let token;
    let name;
    let objectId;

    const exec = () => {
      return request(server)
        .delete(`/api/genres/${objectId}`)
        .set("x-auth-token", token);
    };

    beforeEach(() => {
      token = new User({ isAdmin: true }).generateAuthToken();
      objectId = new mongoose.Types.ObjectId();
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if invalid id is passed", async () => {
      objectId = "1";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if genre with given id is not found", async () => {
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 403 if user is not an admin", async () => {
      token = new User({ isAdmin: false }).generateAuthToken();
      const res = await exec();
      expect(res.status).toBe(403);
    });

    it("should return the deleted genre object", async () => {
      let deleteName = "genre10";
      const genre = await new Genre({
        name: deleteName,
      }).save();
      objectId = genre._id;

      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        name: deleteName,
        _id: genre._id.toHexString(),
      });
    });
  });
});
