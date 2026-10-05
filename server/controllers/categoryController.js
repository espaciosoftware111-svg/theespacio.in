import Category from '../models/Category.js';
import { ErrorResponse } from '../middleware/errorMiddleware.js';
import { uploadFile, deleteFile } from '../services/storageService.js';

let cachedCategories = null;
let cachedCategoriesTime = 0;
let inflightCategoriesPromise = null;
const CATEGORIES_CACHE_TTL_MS = 300000; // 5 minutes

export const invalidateCategoriesCache = () => {
  cachedCategories = null;
  cachedCategoriesTime = 0;
};

export const loadCategoriesFromDB = async () => {
  if (inflightCategoriesPromise) return inflightCategoriesPromise;
  inflightCategoriesPromise = (async () => {
    try {
      const categories = await Category.find({
        softDelete: false,
        status: 'active',
      }).sort('displayOrder').catch(() => []);
      cachedCategories = Array.isArray(categories) ? categories : [];
      cachedCategoriesTime = Date.now();
      return cachedCategories;
    } catch {
      return cachedCategories || [];
    } finally {
      inflightCategoriesPromise = null;
    }
  })();
  return inflightCategoriesPromise;
};

// Pre-warm categories cache on boot
loadCategoriesFromDB().catch(() => {});

/**
 * @desc    Get all space categories (What We Do list)
 * @route   GET /api/categories
 * @access  Public
 */
export const getCategories = async (req, res, next) => {
  try {
    if (cachedCategories) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', 'public, max-age=60');
      if (Date.now() - cachedCategoriesTime > CATEGORIES_CACHE_TTL_MS) {
        loadCategoriesFromDB().catch(() => {});
      }
      return res.status(200).json({
        success: true,
        data: cachedCategories,
      });
    }

    const categories = await Promise.race([
      loadCategoriesFromDB(),
      new Promise((resolve) => setTimeout(() => resolve([]), 2000))
    ]);

    res.setHeader('X-Cache', 'MISS');
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single space category details by slug
 * @route   GET /api/categories/:slug
 * @access  Public
 */
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug,
      softDelete: false,
      status: 'active',
    });

    if (!category) {
      return next(new ErrorResponse(`Category not found with slug: ${req.params.slug}`, 404));
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new space category
 * @route   POST /api/categories
 * @access  Private (Admin)
 */
export const createCategory = async (req, res, next) => {
  try {
    const categoryData = JSON.parse(req.body.data || '{}');

    if (req.files) {
      // 1. Hero Image
      if (req.files.heroImage && req.files.heroImage[0]) {
        categoryData.heroImage = await uploadFile(req.files.heroImage[0]);
      }

      // 2. Gallery Images
      if (req.files.galleryImages && req.files.galleryImages.length > 0) {
        categoryData.galleryImages = [];
        for (const file of req.files.galleryImages) {
          const url = await uploadFile(file);
          categoryData.galleryImages.push(url);
        }
      }
    }

    categoryData.createdBy = req.user?.id || 'admin';

    const category = await Category.create(categoryData);

    res.status(201).json({
      success: true,
      message: 'Space category created successfully',
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update a space category
 * @route   PUT /api/categories/:id
 * @access  Private (Admin)
 */
export const updateCategory = async (req, res, next) => {
  try {
    let category = await Category.findById(req.params.id);

    if (!category || category.softDelete) {
      return next(new ErrorResponse(`Category not found with ID of ${req.params.id}`, 404));
    }

    const categoryData = JSON.parse(req.body.data || '{}');

    if (req.files) {
      // 1. Hero Image
      if (req.files.heroImage && req.files.heroImage[0]) {
        if (category.heroImage) await deleteFile(category.heroImage);
        categoryData.heroImage = await uploadFile(req.files.heroImage[0]);
      }

      // 2. Gallery Images
      if (req.files.galleryImages && req.files.galleryImages.length > 0) {
        const newGallery = [...(category.galleryImages || [])];
        for (const file of req.files.galleryImages) {
          const url = await uploadFile(file);
          newGallery.push(url);
        }
        categoryData.galleryImages = newGallery;
      }
    }

    categoryData.updatedBy = req.user?.id || 'admin';

    category = await Category.findByIdAndUpdate(req.params.id, categoryData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Space category updated successfully',
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Soft delete space category
 * @route   DELETE /api/categories/:id
 * @access  Private (Admin)
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category || category.softDelete) {
      return next(new ErrorResponse(`Category not found with ID of ${req.params.id}`, 404));
    }

    category.softDelete = true;
    category.updatedBy = req.user.id;
    await category.save();

    res.status(200).json({
      success: true,
      message: 'Space category deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
