import { Router as ExpressRouter } from "express";
require("dotenv").config({ path: __dirname+"/.env" });

const users_router = ExpressRouter();

import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host     : process.env.DATABASE_HOST,
  port     : Number(process.env.DATABASE_PORT),
  user     : process.env.DATABASE_USER,
  password : process.env.DATABASE_PASSWORD,
  database : process.env.DATABASE_NAME
});


users_router.get("/users/:user_id", async (req, res) => {
  const {user_id} = req.params;
  const onlynumber = / \d+ / ;

  if(!user_id.match(onlynumber)) return res.status(400).json({ err: "ID must be a number"});
  
  const query = "SELECT * FROM users WHERE id = ? AND role = `hacker`";
  const [rows] = await connection.query(query, [user_id]);
  res.json(rows);
});

users_router.get("/users", async (req, res) => {
  const query = "SELECT user_id FROM users WHERE role = `hacker`";
  const [rows] = await connection.query(query);
  res.json(rows);
});

users_router.post("/users", async (req, res) => {
  const email = req.body.email;
  const onlyemail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if(!email.match(onlyemail)) return res.status(400).json({ err: "Email must be valid"});
  const full_name = req.body.full_name;
  const preferred_name = req.body.preferred_name;
  const query = "INSERT INTO users (user_email,full_name,preferred_name) VALUES (?,?,?)";
  const result = await connection.query(query,[email,full_name,preferred_name]);
  res.json({id:result.insertId}); // Dunno if this works lol
});

users_router.patch("/users/:user_id",async (req, res) => {
  const {user_id} = req.params;
  const onlynumber = / \d+ / ;

  if(!user_id.match(onlynumber)) return res.status(400).json({ err: "No special characters and no numbers, please!"});
  /*
  `team_id` int DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `hashed_password` varchar(255) DEFAULT NULL,
  `discord_id` varchar(255) DEFAULT NULL,
//   `discord_name` varchar(255) DEFAULT NULL,          ---->   Retrieved from discord? Does this need to be checked every now and then? Does this need to be stored?
  `full_name` varchar(255) NOT NULL,
  `preferred_name` varchar(255) NOT NULL,
//   `role` varchar(255) DEFAULT NULL,                  ---->   Should be in admin only and checked path or slip admin checking here?
  `age` int DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `university` varchar(255) DEFAULT NULL,
  `graduation_year` varchar(4) DEFAULT NULL,
  `ethnicity` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `h_UK_Marketing` tinyint(1) DEFAULT NULL,
  `h_UK_Consent` tinyint(1) DEFAULT NULL,
//   `checked_in` tinyint(1) NOT NULL DEFAULT '0',         ---->   See above for role checking (volunteer or above)
  */
  res.json({message:"test"});
});

export default users_router;