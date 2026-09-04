import FAQ from '../models/FAQ.js';
import { ErrorResponse } from '../middleware/errorMiddleware.js';

/**
 * @desc    Get all FAQs (ordered by displayOrder)
 * @route   GET /api/faqs
 * @access  Public
 */
export const getFAQs = async (req, res, next) => {
  try {
    const queryObj = { softDelete: false };

    if (req.query.category) {
      queryObj.category = req.query.category;
    }

    const faqs = await FAQ.find(queryObj);

    res.status(200).json({
      success: true,
      data: faqs || [],
    });
  } catch (err) {
    console.warn('FAQs GET warning:', err.message);
    res.status(200).json({
      success: true,
      data: [],
    });
  }
};

/**
 * @desc    Create a new FAQ
 * @route   POST /api/faqs
 * @access  Private (Admin)
 */
export const createFAQ = async (req, res, next) => {
  try {
    req.body.createdBy = req.user?.id || 'admin';
    const faq = await FAQ.create(req.body);

    res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      data: faq,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update an FAQ
 * @route   PUT /api/faqs/:id
 * @access  Private (Admin)
 */
export const updateFAQ = async (req, res, next) => {
  try {
    let faq = await FAQ.findById(req.params.id);

    if (!faq || faq.softDelete) {
      return next(new ErrorResponse(`FAQ not found with ID of ${req.params.id}`, 404));
    }

    req.body.updatedBy = req.user?.id || 'admin';
    faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'FAQ updated successfully',
      data: faq,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Soft delete an FAQ
 * @route   DELETE /api/faqs/:id
 * @access  Private (Admin)
 */
export const deleteFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq || faq.softDelete) {
      return next(new ErrorResponse(`FAQ not found with ID of ${req.params.id}`, 404));
    }

    faq.softDelete = true;
    faq.updatedBy = req.user.id;
    await faq.save();

    res.status(200).json({
      success: true,
      message: 'FAQ deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Batch update multiple FAQs (from Admin FAQ CMS)
 * @route   PUT /api/faqs
 * @access  Private (Admin)
 */
export const updateFAQsBatch = async (req, res, next) => {
  try {
    const list = Array.isArray(req.body) ? req.body : req.body?.faqs;
    if (!Array.isArray(list)) {
      return next(new ErrorResponse('Expected an array of faqs', 400));
    }
    const saved = [];
    for (const item of list) {
      const id = item.id || item._id;
      if (id) {
        const updated = await FAQ.saveOrUpdate(id, { ...item, updatedBy: req.user?.id || 'admin' });
        saved.push(updated);
      } else {
        const created = await FAQ.create({ ...item, createdBy: req.user?.id || 'admin' });
        saved.push(created);
      }
    }
    res.status(200).json({
      success: true,
      message: 'FAQs updated successfully',
      count: saved.length,
      data: saved
    });
  } catch (err) {
    next(err);
  }
};

