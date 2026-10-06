import { requireAuth } from "../middleware/auth.js";
import {
  SORT_KEYS,
  createProduct,
  deleteProduct,
  getProduct,
  listCategories,
  listProducts,
  updateProduct,
} from "../models/product.model.js";
import {
  optionalString,
  requireId,
  requireNumber,
  requireString,
} from "../utils/validate.js";

const MAX_LIMIT = 200;

export function productRoutes(router, db) {
  router.get("/api/products", (ctx) => {
    const { _kw, _min, _max, _sort, category, limit, offset } = ctx.query;

    return {
      products: listProducts(db, {
        category: category || undefined,
        search: _kw || undefined,
        min: _min ? requireNumber(_min, "_min", { max: 1e9 }) : undefined,
        max: _max ? requireNumber(_max, "_max", { max: 1e9 }) : undefined,
        sort: SORT_KEYS.includes(_sort) ? _sort : undefined,
        limit: limit
          ? requireNumber(limit, "limit", { max: MAX_LIMIT })
          : undefined,
        offset: offset
          ? requireNumber(offset, "offset", { max: 1e6 })
          : undefined,
      }),
    };
  });

  router.get("/api/products/categories", () => ({
    categories: listCategories(db),
  }));

  router.get("/api/products/category/:category", (ctx) => ({
    products: listProducts(db, { category: ctx.params.category }),
  }));

  router.get("/api/products/:id", (ctx) => ({
    product: getProduct(db, requireId(ctx.params.id)),
  }));

  router.post("/api/products", (ctx) => {
    requireAuth(ctx);
    return { product: createProduct(db, readProduct(ctx.body)) };
  });

  router.patch("/api/products/:id", (ctx) => {
    requireAuth(ctx);
    const id = requireId(ctx.params.id);
    return { product: updateProduct(db, id, readProduct(ctx.body, true)) };
  });

  router.delete("/api/products/:id", (ctx) => {
    requireAuth(ctx);
    deleteProduct(db, requireId(ctx.params.id));
  });
}

function readProduct(body, partial = false) {
  const product = {};
  const set = (key, value) => {
    if (value !== undefined) product[key] = value;
  };

  if (!partial || body.title !== undefined) {
    set("title", requireString(body.title, "title", { max: 160 }));
  }
  if (!partial || body.description !== undefined) {
    set(
      "description",
      optionalString(body.description, "description", { max: 4000 }) ?? "",
    );
  }
  if (!partial || body.price !== undefined) {
    set("price", requireNumber(body.price, "price", { min: 0, max: 1e6 }));
  }
  if (!partial || body.category !== undefined) {
    set("category", requireString(body.category, "category", { max: 64 }));
  }
  set("uri", optionalString(body.uri, "uri", { max: 500 }) ?? "");

  if (body.rating !== undefined) {
    product.rating = {
      rate: requireNumber(body.rating?.rate ?? 0, "rating.rate", {
        min: 0,
        max: 5,
      }),
      count: requireNumber(body.rating?.count ?? 0, "rating.count", {
        min: 0,
        max: 1e7,
      }),
    };
  } else {
    if (body.rate !== undefined) {
      set("rate", requireNumber(body.rate, "rate", { min: 0, max: 5 }));
    }
    if (body.count !== undefined) {
      set("count", requireNumber(body.count, "count", { min: 0, max: 1e7 }));
    }
  }

  return product;
}
