const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const { get } = require("../app");

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

describe("GET /api/reviews (queries)", () => {
  test("200: returns an array of review objects where the order defaults to descending and the sort by category is created_at", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: returns an array of review objects a query of a specific category is searched for", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toHaveLength(1);
        expect(reviews[0].category).toBe("dexterity");
      });
  });
  test("200: returns an array of review objects which is sorted by the specified sort_by column in the query", () => {
    return request(app)
      .get("/api/reviews/?sort_by=votes")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("votes", { descending: true });
      });
  });
  test("200: returns an array of review objects which is ordered in the specified way as per the query", () => {
    return request(app)
      .get("/api/reviews/?order=asc")
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("created_at", { ascending: true });
      });
  });
  test("200: sort_by and order queries work in conjunction", () => {
    return request(app)
      .get("/api/reviews?sort_by=review_id&order=desc")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("review_id", { descending: true });
      });
  });
  test("200: returns an empty array where the category is valid but it has no reviews", () => {
    return request(app)
      .get("/api/reviews?category=children's games")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toEqual([]);
      });
  });
  test("400: returns a bad request when user tries to sort the query with an invalid column", () => {
    return request(app)
      .get("/api/reviews?sort_by=review_img_url")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
  test("400: returns a bad request when an order query is entered incorrectly", () => {
    return request(app)
      .get("/api/reviews?order=new")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });
  test("400: returns bad request when sort_by is entered incorrectly", () => {
    return request(app)
      .get("/api/reviews?sort_by=")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });
  test("400: returns a bad request when queries are used in conjunction and one of them is used incorrectly", () => {
    return request(app)
      .get("/api/reviews?order=new&sort_by=category")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });
  test("404: returns a page not found when a category that doesn't exist is queried", () => {
    return request(app)
      .get("/api/reviews?category=bananas")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("no category found");
      });
  });
});

describe("GET /api/reviews/:review_id (comment count)", () => {
  test("200: returns a review object which includes comment_count as a column", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toHaveProperty("comment_count");
      });
  });
  test("200: returns a comment_count of 0 when zero comments have been made to a review", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review.comment_count).toBe("0");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: returns no content after removing the comment by comment_id", () => {
    return request(app)
      .delete("/api/comments/5")
      .expect(204)
      .then((res) => {
        expect(res.noContent).toBe(true);
      });
  });
  test("404: returns id not found when a review_id that doesn't exist is searched for", () => {
    return request(app)
      .delete("/api/comments/20")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("no comment found");
      });
  });
  test("400: returns a bad request when an invalid id is searched to delete", () => {
    return request(app)
      .delete("/api/comments/banana")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
});
