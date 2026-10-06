import { createUser } from "../models/user.model.js";
import { hashPassword } from "../utils/password.js";
import { openDatabase } from "./database.js";
import { config } from "../config.js";

const PRODUCTS = [
  {
    title: "Wireless Headphones",
    description: "Over-ear headphones with 30 hour battery life.",
    price: 129.99,
    category: "electronics",
    rate: 4.5,
    count: 312,
  },
  {
    title: "Mechanical Keyboard",
    description: "Hot-swappable 75% keyboard with tactile switches.",
    price: 89.5,
    category: "electronics",
    rate: 4.7,
    count: 198,
  },
  {
    title: "4K Monitor",
    description: "27 inch IPS display with 144Hz refresh rate.",
    price: 349.0,
    category: "electronics",
    rate: 4.2,
    count: 76,
  },
  {
    title: "Classic Denim Jacket",
    description: "Mid-weight cotton denim jacket, unisex fit.",
    price: 74.25,
    category: "clothing",
    rate: 4.1,
    count: 154,
  },
  {
    title: "Merino Wool Sweater",
    description: "Fine gauge merino sweater for cool weather.",
    price: 96.0,
    category: "clothing",
    rate: 4.6,
    count: 88,
  },
  {
    title: "Running Shoes",
    description: "Lightweight trainers with responsive foam sole.",
    price: 112.4,
    category: "clothing",
    rate: 4.4,
    count: 241,
  },
  {
    title: "The Pragmatic Programmer",
    description: "A guide to the craft of software development.",
    price: 42.9,
    category: "books",
    rate: 4.8,
    count: 512,
  },
  {
    title: "Designing Data-Intensive Applications",
    description: "Patterns for scalable, reliable data systems.",
    price: 58.75,
    category: "books",
    rate: 4.9,
    count: 634,
  },
  {
    title: "Ceramic Mug Set",
    description: "Set of four stoneware mugs, dishwasher safe.",
    price: 24.0,
    category: "home",
    rate: 3.9,
    count: 143,
  },
  {
    title: "Linen Bedding Bundle",
    description: "Duvet cover and two pillow cases in washed linen.",
    price: 139.99,
    category: "home",
    rate: 4.3,
    count: 67,
  },
  {
    title: "Vitamin C Serum",
    description: "Brightening facial serum with 15% vitamin C.",
    price: 32.6,
    category: "beauty",
    rate: 4.0,
    count: 205,
  },
  {
    title: "Sandalwood Eau de Parfum",
    description: "Warm woody fragrance, 50ml bottle.",
    price: 68.0,
    category: "beauty",
    rate: 4.2,
    count: 91,
  },
];

const COUPONS = [
  ["ROCK", 10],
  ["HALF", 50],
  ["COOL", 90],
];

const DEMO_USER = {
  username: "john",
  name: "John Doe",
  email: "a@b.c",
  password: "1234",
};

export function seed(db) {
  const summary = { products: 0, coupons: 0, users: 0 };

  const insertProduct = db.prepare(
    `INSERT INTO products
       (title, description, price, category, uri, rating_rate, rating_count)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  );

  if (count(db, "products") === 0) {
    for (const product of PRODUCTS) {
      insertProduct.run(
        product.title,
        product.description,
        product.price,
        product.category,
        `https://picsum.photos/seed/${slug(product.title)}/400`,
        product.rate,
        product.count,
      );
      summary.products += 1;
    }
  }

  const insertCoupon = db.prepare(
    "INSERT OR IGNORE INTO coupons (code, percent) VALUES (?, ?)",
  );
  for (const [code, percent] of COUPONS) {
    summary.coupons += insertCoupon.run(code, percent).changes;
  }

  if (count(db, "users") === 0) {
    createUser(db, {
      ...DEMO_USER,
      password: hashPassword(DEMO_USER.password),
    });
    summary.users += 1;
  }

  return summary;
}

function count(db, table) {
  return db.prepare(`SELECT COUNT(*) AS total FROM ${table}`).get().total;
}

function slug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

const isMain = process.argv[1]?.endsWith("seed.js");
if (isMain) {
  const db = openDatabase(config.dbPath);
  const summary = seed(db);
  console.log(`Seeded ${config.dbPath}`);
  console.log(
    `products: +${summary.products}, coupons: +${summary.coupons}, users: +${summary.users}`,
  );
  db.close();
}
