import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Routes
import signup from "./routes/signup";
import login from "./routes/login";
import logout from "./routes/logout";
import beatmaps from "./routes/beatmaps";
import scores from "./routes/scores";
import isAuthenticated from "./routes/isAuthenticated";
import echo from "./routes/echo";

// config
const port = process.env.PORT || 3001;
console.log("PORT:", port);
console.log("ORIGIN:", process.env.ORIGIN);

const corsOptions: cors.CorsOptions = {
  origin: [process.env.ORIGIN ? process.env.ORIGIN : ""],
  credentials: true,
};

const app = express();

// middlewares
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser(process.env.COOKIE_PARSER));
app.use(cors(corsOptions));

// routes
app.use("/api/signup", signup);
app.use("/api/login", login);
app.use("/api/logout", logout);
app.use("/api/beatmaps", beatmaps);
app.use("/api/scores", scores);
app.use("/api/isAuthenticated", isAuthenticated);
app.use("/api/echo", echo);

app.listen(port, () => {
  console.log(`Listening to http://localhost:${port}`);
});
