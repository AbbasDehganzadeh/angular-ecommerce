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
    const { search, min, max, sort, category, limit, offset } = ctx.query;
    const { products, productsCount } = listProducts(db, {
      category: category || undefined,
      search: search || undefined,
      min: min ? requireNumber(min, "min", { max: 1e9 }) : undefined,
      max: max ? requireNumber(max, "max", { max: 1e9 }) : undefined,
      sort: SORT_KEYS.includes(sort) ? sort : undefined,
      limit: limit
        ? requireNumber(limit, "limit", { max: MAX_LIMIT })
        : undefined,
      offset: offset
        ? requireNumber(offset, "offset", { max: 1e6 })
        : undefined,
    });

    return { products, productsCount };
  });

  router.get("/api/products/categories", () => ({
    categories: listCategories(db),
  }));

  router.get("/api/products/category/:category", (ctx) => {
    const { products, productsCount } = listProducts(db, {
      category: ctx.params.category,
    });
    return { products, productsCount };
  });

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
