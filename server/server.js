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
  const result = await db.query(`SELECT * FROM messages ORDER BY id ASC`);

  const users = result.rows;
  res.json(users);
});

app.post("/sendmessage", async (req, res) => {
  try {
    const { username, message } = req.body;
    const insertQuery =
      "INSERT INTO messages (username, message,likes) VALUES ($1, $2 ,$3)";
    await db.query(insertQuery, [username, message, 0]);
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

app.get("/filtermessages", async (req, res) => {
  const { word } = req.query;
  console.log(word);
  if (!word) {
    return res
      .status(400)
      .json({ error: "Query parameter 'word' is required" });
  }

  const filterQuery = `SELECT * FROM messages WHERE message LIKE $1`;
  const result = await db.query(filterQuery, [`%${word}%`]);
  const filteredMessages = result.rows;
  res.json(filteredMessages);
});

app.post("/likemessage", async (req, res) => {
  const { id } = req.body;
  const updateQuery = "UPDATE messages SET likes = likes + 1 WHERE id = $1";
  const values = [id];

  await db.query(updateQuery, values);

  const selectQuery = "SELECT likes FROM messages WHERE id = $1";

  const selectResult = await db.query(selectQuery, values);

  // Return the updated likes
  res.json({
    message: "Message liked!",
    likes: selectResult.rows[0].likes,
  });
});

app.listen(PORT, (req, res) => {
  console.log(`Your APIs are Running on port ${PORT}`);
});
