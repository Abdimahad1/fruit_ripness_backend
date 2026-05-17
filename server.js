import dotenv from "dotenv";

// =====================================================
// LOAD ENV VARIABLES FIRST
// =====================================================

dotenv.config();

import express from "express";
import cors from "cors";

import analyzeRoutes from "./routes/analyzeRoutes.js";

// =====================================================
// EXPRESS APP
// =====================================================

const app = express();

// =====================================================
// MIDDLEWARES
// =====================================================

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =====================================================
// ROOT ROUTE
// =====================================================

app.get("/", (req, res) => {

  res.status(200).json({
    success: true,
    message:
      "Fruit Ripeness AI Backend Running Successfully",
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

  console.error(
    "GLOBAL SERVER ERROR:"
  );

  console.error(
    err.message
  );

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

  console.log(
    `SERVER RUNNING ON PORT ${PORT}`
  );

});