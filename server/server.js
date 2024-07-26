import express from "express";
import pg from "pg";
import cors from "cors";
import dotenv from "dotenv";

const PORT = 3000;
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/", (req, res) => {
  res.send("API is Called");
});

app.get("/users", async (req, res) => {
  const result = await db.query(`SELECT * FROM messages`);

  const users = result.rows;
  res.json(users);
});

app.post("/sendmessage", async (req, res) => {
  try {
    const { username, message } = req.body;
    const insertQuery =
      "INSERT INTO messages (username, message) VALUES ($1, $2)";
    await db.query(insertQuery, [username, message]);
    console.log("post is done");
    res.json(req.body);
  } catch {
    console.log("post is not done");
  }
});
app.delete("/messages/", async (req, res) => {
  const { id } = req.query;
  console.log(id);
  const deleteQuery = "DELETE FROM messages WHERE id = $1";
  await db.query(deleteQuery, [id]);

  res.send(`id ${id} id deleted`);
});
app.listen(PORT, (req, res) => {
  console.log(`Your APIs are Running on port ${PORT}`);
});
