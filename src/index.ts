import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import path from 'path';

const app = express();
const port = 3000;

// for jwt, i am simulating a secret key here. normally this should be in an env or hidden more securely
const jwtSecretKey = 'secret_key';

// Mock data models
// User (id, first name, last name, email, phone number)
interface User {
  id: number;
  firstName: String;
  lastName: String;
  email: String;
  phoneNumber: String;
}

// Product (id, title, resale_price, inspector_id, private_file_name_on_s3)
interface Product {
  id: number;
  title: String;
  resalePrice: number;
  inspectorId: number;
  privateFileNameOnS3: String;
}

// Order (id, product_id, purchaser_id, purchase_date)
interface Order {
  id: number;
  productId: number;
  purchaserId: number;
  purchaseDate: String;
}

interface CodeEntry {
  code: String;
  expiresAt: Date;
}

let generatedCodes: { [key: number]: CodeEntry } = {};

// Creating mock data, NOTE: assuming there is another table for Inspector and purchaserId pertains to User
const users: User[] = [
  {id: 1, firstName: "Jasper", lastName: "Balbada", email: "jasperbalbada@gmail.com", phoneNumber: "639191234567"},
  {id: 2, firstName: "Solana", lastName: "Rowe", email: "solanarowe@gmail.com", phoneNumber: "639192345678"},
  {id: 3, firstName: "Agatha", lastName: "Harkness", email: "agathaharkness@gmail.com", phoneNumber: "639193456789"}
];

const products: Product[] = [
  {id: 1, title: "Dummy Inspection Report #1", resalePrice: 649, inspectorId: 1, privateFileNameOnS3: "report1"},
  {id: 2, title: "Dummy Inspection Report #2", resalePrice: 299, inspectorId: 1, privateFileNameOnS3: "report2"},
  {id: 3, title: "Dummy Inspection Report #3", resalePrice: 649, inspectorId: 4, privateFileNameOnS3: "report3"},
  {id: 4, title: "Dummy Inspection Report #4", resalePrice: 649, inspectorId: 2, privateFileNameOnS3: "report4"},
  {id: 5, title: "Dummy Inspection Report #5", resalePrice: 299, inspectorId: 2, privateFileNameOnS3: "report5"},
];

const orders: Order[] = [
  {id: 1, productId: 1, purchaserId: 1, purchaseDate: "2024-10-20"},
  {id: 2, productId: 2, purchaserId: 1, purchaseDate: "2024-10-20"},
  {id: 3, productId: 3, purchaserId: 2, purchaseDate: "2024-09-15"},
  {id: 4, productId: 5, purchaserId: 3, purchaseDate: "2024-10-01"},
  {id: 5, productId: 3, purchaserId: 3, purchaseDate: "2024-10-02"},
  {id: 6, productId: 5, purchaserId: 1, purchaseDate: "2024-10-04"},
];

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.static(path.join(__dirname, '../public')));

app.use(express.json());


app.get('/api/users', (req: Request, res: Response) => {
  res.json(users);
});

app.get('/api/products', (req: Request, res: Response) => {
  res.json(products);
});

app.get('/api/orders', (req: Request, res: Response) => {
  res.json(orders);
});


app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

// generates the code and applies expiry after 10 minutes
app.get('/api/download/generate/:productId', (req: Request, res: Response) => {
  const productId = parseInt(req.params.productId);
  const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  generatedCodes[productId] = { code: generatedCode, expiresAt };

  res.json({ success: true, code: generatedCode });
});

app.post('/api/download/:productId', (req: Request, res: Response) => {
  const productId = parseInt(req.params.productId);
  const order = orders.find(order => order.productId === productId);
  const codeEntry = generatedCodes[productId];
  const user = users.find(user => user.id === order.purchaserId);

  // checks whether the code has expired or not
  const currentTime = new Date();
  if (currentTime > codeEntry.expiresAt) {
    return res.status(403).json({ success: false, message: "The code has expired." });
  }

  // checks if the code matches the sent/stored code
  const { code } = req.body;
  if (code !== codeEntry.code) {
    return res.status(403).json({ success: false, message: "Invalid code." });
  }

  // creates a JWT token to improve integrity of file
  const token = jwt.sign({ productId, userId: user.id }, jwtSecretKey, { expiresIn: '1h' });

  // creates the download link
  // NOTE: i used a mock link available for the "file"
  const downloadLink = `https://example.com/download/${token}`;

  res.json({ success: true, link: downloadLink });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});