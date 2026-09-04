import express from 'express';
import { getFAQs, createFAQ, updateFAQ, updateFAQsBatch, deleteFAQ } from '../controllers/faqController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getFAQs);

// Batch update from Admin FAQ CMS
router.put('/', updateFAQsBatch);
router.put('/bulk', updateFAQsBatch);

router.post('/', protect, authorize('admin', 'superadmin'), createFAQ);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateFAQ);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteFAQ);

export default router;

