import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = 3000;

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

app.get('/about', (req: Request, res: Response) => {
  res.send('About Page');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});