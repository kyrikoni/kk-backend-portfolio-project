const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/categories", () => {
  test("200: returns an array of category objects, each of which has a slug and a description", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body: { categories } }) => {
        expect(categories).toHaveLength(4);
        categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
  test("404: returns page not found when passed an incorrect endpoint", () => {
    return request(app)
      .get("/api/categoriess")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("path not found");
      });
  });
});

describe("GET /api/reviews", () => {
  test("200: returns a reviews array of review objects, sorted by date in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("created_at", { descending: true });
        expect(reviews).toHaveLength(13);
        reviews.forEach((review) => {
          expect(review).toHaveProperty("owner");
          expect(review).toHaveProperty("title");
          expect(review).toHaveProperty("review_id");
          expect(review).toHaveProperty("category");
          expect(review).toHaveProperty("review_img_url");
          expect(review).toHaveProperty("created_at");
          expect(review).toHaveProperty("votes");
          expect(review).toHaveProperty("designer");
        });
      });
  });
  test("200: each returned object has a comment_counts property, even if value is 0", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        reviews.forEach((review) => {
          expect(review).toHaveProperty("comment_count");
        });
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("200: returns an object of the specific review that matches the review_id", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toMatchObject({
          review_id: 2,
          title: expect.any(String),
          review_body: expect.any(String),
          review_img_url: expect.any(String),
          designer: expect.any(String),
          votes: expect.any(Number),
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });
  test("404: returns page not found when a review_id that doesn't exist is searched for", () => {
    return request(app)
      .get("/api/reviews/50")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("no id found");
      });
  });
  test("400: returns bad request when an invalid review_id is searched for", () => {
    return request(app)
      .get("/api/reviews/banana")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("200: returns an array of comments for the given review_id, sorted by date in descending order", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("created_at", { descending: true });
        expect(comments).toHaveLength(3);
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("review_id");
        });
      });
  });
  test("200: returns an empty array of comments for the given review_id where zero comments exist", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(0);
        expect(comments).toEqual([]);
      });
  });
  test("404: returns page not found when a review_id that doesn't exist is searched for", () => {
    return request(app)
      .get("/api/reviews/50/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("no id found");
      });
  });
  test("400: returns bad request when an invalid review_id is searched for", () => {
    return request(app)
      .get("/api/reviews/banana/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("201: returns a successful post after passing a comment request on a valid review_id", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({
        username: "bainesface",
        body: "this is a test comment",
      })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toHaveProperty("comment_id");
        expect(comment).toHaveProperty("votes");
        expect(comment).toHaveProperty("created_at");
        expect(comment).toHaveProperty("author");
        expect(comment).toHaveProperty("body");
        expect(comment).toHaveProperty("review_id");
      });
  });
  test("404: returns id not found when a review_id that doesn't exist is searched for", () => {
    return request(app)
      .post("/api/reviews/50/comments")
      .send({
        username: "bainesface",
        body: "this is a test comment",
      })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
  test("404: returns user not found when a username doesn't exist in the database", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({
        username: "kyri",
        body: "this is a test comment",
      })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
  test("400: returns bad request when an invalid review_id is searched for", () => {
    return request(app)
      .post("/api/reviews/banana/comments")
      .send({
        username: "bainesface",
        body: "this is a test comment",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
  test("400: returns bad request when a request with missing information is sent", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({
        body: "this is a test comment",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("200: returns the updated review after passing a patch request to update the vote count positively on a valid review_id", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({
        inc_votes: 5,
      })
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment.votes).toBe(10);
        expect(comment).toEqual(
          expect.objectContaining({
            review_id: expect.any(Number),
            title: expect.any(String),
            category: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_body: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  test("200: returns the updated review after passing a patch request to update the vote count negatively on a valid review_id", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({
        inc_votes: -5,
      })
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment.votes).toBe(0);
      });
  });
  test("400: returns a bad request as total votes cannot be less than 0", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({
        inc_votes: -10,
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("total votes cannot be less than 0");
      });
  });
  test("404: returns id not found when a review_id that doesn't exist is searched for", () => {
    return request(app)
      .patch("/api/reviews/50")
      .send({
        inc_votes: -5,
      })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("no id found");
      });
  });
  test("400: returns a bad request when a request has an incorrect data type", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({
        inc_votes: "banana",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
  test("400: returns a bad request when a request has a missing required field / malformed body", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({})
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("200: returns an array of user objects, each of which has a username, name and avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
  test("404: returns page not found when passed an incorrect endpoint", () => {
    return request(app)
      .get("/api/userss")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("path not found");
      });
  });
});
