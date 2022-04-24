import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("This is the backend server for Cockroach Poker - you might want to try https://cockroach-poker.rcr.dev for something more interesting");
});

app.get("/ping", (req, res) => {
  res.json({ status: "success" });
});

export default app;
