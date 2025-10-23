import {Router, Request, Response} from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.send(`
    <html>
      <head>
        <title>HIDB Back</title>
      </head>
      <body style="font-family: sans-serif; text-align: center; margin-top: 50px;">
        <h1>Welcome to HIDB Back</h1>
      </body>
    </html>
  `);
});

export default router;
