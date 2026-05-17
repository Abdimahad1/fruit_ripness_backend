import dotenv from "dotenv";

// =====================================================
// LOAD ENV VARIABLES
// =====================================================

dotenv.config();

import express from "express";
import cors from "cors";

// =====================================================
// ROUTES
// =====================================================

import analyzeRoutes from "./routes/analyzeRoutes.js";

// =====================================================
// EXPRESS APP
// =====================================================

const app = express();

// =====================================================
// TRUST PROXY
// =====================================================

app.set("trust proxy", true);

// =====================================================
// CORS
// =====================================================

app.use(
  cors({
    origin: [
      "https://food-ripness-detector.vercel.app",
    ],

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
    ],

    credentials: true,
  })
);

// =====================================================
// BODY PARSER
// =====================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// =====================================================
// REQUEST LOGGER
// =====================================================

app.use((req, res, next) => {

  console.log("===================================");
  console.log("NEW REQUEST RECEIVED");
  console.log("METHOD:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("TIME:", new Date().toISOString());
  console.log("IP:", req.ip);
  console.log("===================================");

  next();

});

// =====================================================
// ROOT ROUTE
// =====================================================

app.get("/", (req, res) => {

  res.status(200).json({
    success: true,
    message:
      "Fruit Ripeness AI Backend Running Successfully",
    serverTime:
      new Date().toISOString(),
  });

});

// =====================================================
// HEALTH CHECK ROUTE
// =====================================================

app.get("/health", (req, res) => {

  console.log("HEALTH CHECK HIT");

  res.status(200).json({
    success: true,
    status: "ACTIVE",
    message:
      "Backend server is awake",
    timestamp:
      new Date().toISOString(),
  });

});

// =====================================================
// API ROUTES
// =====================================================

app.use(
  "/api/analyze",
  analyzeRoutes
);

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {

  console.log(
    "404 ROUTE NOT FOUND:",
    req.originalUrl
  );

  res.status(404).json({
    success: false,
    message: "Route not found",
  });

});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use((
  err,
  req,
  res,
  next
) => {

  console.log("===================================");
  console.log("GLOBAL SERVER ERROR");
  console.log("MESSAGE:", err.message);
  console.log("STACK:", err.stack);
  console.log("===================================");

  res.status(500).json({
    success: false,
    message:
      "Internal server error",
  });

});

// =====================================================
// PORT
// =====================================================

const PORT =
  process.env.PORT || 5000;

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {

  console.log("===================================");
  console.log(
    `SERVER RUNNING ON PORT ${PORT}`
  );
  console.log(
    "FRONTEND:",
    "https://food-ripness-detector.vercel.app"
  );
  console.log(
    "NODE ENV:",
    process.env.NODE_ENV
  );
  console.log(
    "GEMINI API:",
    process.env.GEMINI_API_KEY
      ? "CONNECTED ✅"
      : "MISSING ❌"
  );
  console.log("===================================");

});