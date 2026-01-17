import express from "express";
import { Product } from "../models/Product.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import mongoose from "mongoose";

export const productRouter = express.Router();

//@route POST /api/products
//@desc Create a new Product
//@aceess Private/Admin
productRouter.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      sku,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      rating,
      numReviews,
      tags,
      metaTitle,
      metaDescription,
      metaKeywords,
      dimensions,
      weight,
    } = req.body;

    // create a new product
    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      sku,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      rating,
      numReviews,
      tags,
      metaTitle,
      metaDescription,
      metaKeywords,
      dimensions,
      weight,
      user: req.user._id, // reference to the admin user who create it
    });

    // save product
    const createdProduct = await product.save();

    res.status(201).json({
      message: `Product will be created by the admin: ${req.user.name}`,
      product: createdProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error.");
  }
});

//@route PUT api/products/:id
//@desc Update existing Product
//@aceess Private/Admin
productRouter.put("/:id", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      sku,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      rating,
      numReviews,
      tags,
      metaTitle,
      metaDescription,
      metaKeywords,
      dimensions,
      weight,
    } = req.body;

    // find the existing product
    const product = await Product.findById(req.params.id);
    if (product) {
      // update product fields
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.discountPrice = discountPrice || product.discountPrice;
      product.countInStock = countInStock || product.countInStock;
      product.sku = sku || product.sku;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
      product.collections = collections || product.collections;
      product.material = material || product.material;
      product.gender = gender || product.gender;
      product.images = images || product.images;

      product.isFeatured =
        isFeatured !== undefined ? isFeatured : product.isFeatured;

      product.isPublished =
        isPublished !== undefined ? isPublished : product.isPublished;

      product.rating = rating || product.rating;
      product.numReviews = numReviews || product.numReviews;
      product.tags = tags || product.tags;

      product.metaTitle = metaTitle || product.metaTitle;
      product.metaDescription = metaDescription || product.metaDescription;
      product.metaKeywords = metaKeywords || product.metaKeywords;

      product.dimensions = dimensions || product.dimensions;
      product.weight = weight || product.weight;

      // save product
      const updatedProduct = await product.save();

      if (updatedProduct) {
        res.status(200).json({
          message: `Product Updated with id:${req.params.id} by the admin : ${req.user.name}`,
          product: updatedProduct,
        });
      }
    } else {
      res.status(404).json({ message: "Product Not Found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error.");
  }
});

//@route DELETE api/products/:id
//@desc Delete the Product by ID
//@access Private/Admin
productRouter.delete("/:id", protect, admin, async (req, res) => {
  try {
    // find product by id
    const product = await Product.findById(req.params.id);
    if (product) {
      // remove the product from DB
      await product.deleteOne();
      res.status(200).json({
        message: `Product Deleted With ID : ${req.params.id} by the admin : ${req.user.name}`,
      });
    } else {
      res.status(404).json({ message: `Product not Found.` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error.");
  }
});

//@route GET api/products
//@desc Get all products with optionals query filters
//@access Public
productRouter.get("/", async (req, res) => {
  try {
    const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit,
    } = req.query;

    let query = {};

    // filter logic , note: this logic is implements in DB
    if (collection && collection.toLocaleLowerCase() !== "all") {
      query.collections = collection;
    }

    if (category && category.toLocaleLowerCase() !== "all") {
      query.category = category;
    }

    if (material) {
      query.material = { $in: material.split(",") };
    }

    if (brand) {
      query.brand = { $in: brand.split(",") };
    }

    if (size) {
      query.sizes = { $in: size.split(",") };
    }

    if (color) {
      query.colors = { $in: [color] };
    }

    if (gender) {
      query.gender = gender;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // sort logic
    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 };
          break;
        case "priceDesc":
          sort = { price: -1 };
          break;
        case "popularity":
          sort = { rating: -1 };
          break;
        default:
          break;
      }
    }

    // Fetch products from the db and apply sorting and limit
    let products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error.");
  }
});

//@route GET api/products/best-seller
//@desc Get the product with highest rating
//@access Public
productRouter.get("/best-seller", async (req, res) => {
  try {
    const bestSeller = await Product.findOne().sort({ rating: -1 });
    if (bestSeller) {
      res.status(200).json(bestSeller);
    } else {
      res.status(404).json({ message: "Best seller product not Found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error.");
  }
});

//@route GET api/products/new-arrivals
//@desc Retriving 8-latest products based on creation date
//@access Public
productRouter.get("/new-arrivals", async (req, res) => {
  try {
    // fetch latest 8 products from db - createdAt
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
    if (newArrivals) {
      res.status(200).json(newArrivals);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error.");
  }
});


//@route GET api/products/similar/:id
//@desc Retrive similar products based on the current product's gender and category
//@access Public
productRouter.get("/similar/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 🔒 SAFETY CHECK
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not Found." });
    }

    const similarProducts = await Product.find({
      _id: { $ne: product._id },
      gender: product.gender,
      category: product.category,
    }).limit(4);

    res.status(200).json(similarProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error.");
  }
});

/*
productRouter.get("/similar/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // find the product via id
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ message: "Product not Found." });
    }
    const similarProducts = await Product.find({
      _id: { $ne: id },
      gender: product.gender,
      category: product.category,
    }).limit(4);
    res.status(200).json(similarProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error.");
  }
});
*/

//@route GET api/products/:id
//@desc Get Single Product by ID
//@access Public
productRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 🔒 IMPORTANT GUARD
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not Found." });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error.");
  }
});

