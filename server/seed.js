import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

db.query(`CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    username VARCHAR(60) NOT NULL,
    message TEXT NOT NULL
    );
    
    
   
  
    
    INSERT INTO messages(username,message) VALUES
    ('khashayar','hello dev'),
    ('Maz', 'hello fullstack dev'),
    ('Zeus','move away');

    
     ALTER TABLE messages
    ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;
    `);
