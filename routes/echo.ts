import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  return res.json(req.body);
});

export default router;
