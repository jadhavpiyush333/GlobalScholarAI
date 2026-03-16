import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import openaiRouter from "./openai/index";
import knowledgeRouter from "./knowledge/index";
import fieldsRouter from "./fields/index";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use("/openai", openaiRouter);
router.use("/knowledge", knowledgeRouter);
router.use("/fields", fieldsRouter);

export default router;
