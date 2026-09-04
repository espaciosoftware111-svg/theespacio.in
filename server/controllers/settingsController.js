import Settings from '../models/Settings.js';
import { query } from '../config/supabase.js';
import { ErrorResponse } from '../middleware/errorMiddleware.js';

/**
 * @desc    Get all system settings as a key-value object
 * @route   GET /api/settings
 * @access  Public
 */
export const getAllSettings = async (req, res, next) => {
  try {
    const settingsList = await Settings.find();
    const settingsMap = {};
    let siteSettingsVal = null;

    if (Array.isArray(settingsList)) {
      settingsList.forEach((item) => {
        if ((item.key === 'site_settings' || item.id === 'site_settings' || item.id === 'global_cms_settings')) {
          const valObj = (item.value && typeof item.value === 'object')
            ? item.value
            : (item.data && typeof item.data === 'object')
              ? item.data
              : {};
          siteSettingsVal = { ...(siteSettingsVal || {}), ...valObj };
        } else if (item.key && item.key !== 'site_settings') {
          settingsMap[item.key] = item.value ?? item.data;
        }
      });
    }

    // Individual updated settings keys take priority over master site_settings object
    const finalMap = { ...(siteSettingsVal || {}), ...settingsMap };

    // Default 4 curated luxury company images
    const defaultHeroImages = [
      '/images/company/3bhk_lux/open_hall.png',
      '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Living_room_3-20260810-124909.jpg',
      '/images/company/2bhk_urban/Minimalist_Gray__A_Contemporary_Kitchen_Masterpiec-Unnamed_2-20260810-173514.jpg',
      '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Living_room_27-20260810-124917.jpg'
    ];

    // Synchronize hero_bg_images and hero_images array references
    let heroBgImgs = (Array.isArray(finalMap.hero_bg_images) && finalMap.hero_bg_images.length > 0)
      ? finalMap.hero_bg_images
      : (Array.isArray(finalMap.hero_images) && finalMap.hero_images.length > 0)
        ? finalMap.hero_images
        : defaultHeroImages;

    finalMap.hero_bg_images = heroBgImgs;
    finalMap.hero_images = heroBgImgs;

    res.status(200).json({
      success: true,
      data: finalMap,
    });
  } catch (err) {
    console.warn('Settings getAll warning:', err.message);
    res.status(200).json({
      success: true,
      data: {},
    });
  }
};

/**
 * @desc    Get system settings by key
 * @route   GET /api/settings/:key
 * @access  Public
 */
export const getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.findOne({ key: req.params.key });

    if (!settings) {
      return res.status(200).json({
        success: true,
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: settings.value,
    });
  } catch (err) {
    console.warn('Settings getByKey warning:', err.message);
    res.status(200).json({
      success: true,
      data: null,
    });
  }
};

/**
 * @desc    Update system settings by key (Admin only)
 * @route   PUT /api/settings/:key
 * @access  Private (Admin)
 */
export const updateSettings = async (req, res, next) => {
  const { value } = req.body;

  if (value === undefined) {
    return next(new ErrorResponse('Please provide settings value', 400));
  }

  try {
    let settings = await Settings.findOne({ key: req.params.key });

    if (settings && settings._id) {
      await Settings.findByIdAndUpdate(settings._id, {
        key: req.params.key,
        value,
        updatedBy: req.user?.id || 'admin'
      });
    } else {
      await Settings.create({
        key: req.params.key,
        value,
        createdBy: req.user?.id || 'admin',
      });
    }

    res.status(200).json({
      success: true,
      message: `Settings key '${req.params.key}' updated successfully`,
      data: value,
    });
  } catch (err) {
    console.error(`updateSettings error for key '${req.params.key}':`, err);
    next(err);
  }
};

/**
 * @desc    Batch update multiple settings (Admin only)
 * @route   PUT /api/settings
 * @access  Private (Admin)
 */
export const updateAllSettings = async (req, res, next) => {
  const settingsObj = req.body;
  if (!settingsObj || typeof settingsObj !== 'object') {
    return next(new ErrorResponse('Please provide a settings dictionary', 400));
  }

  try {
    // Keep hero_bg_images and hero_images synchronized
    if (Array.isArray(settingsObj.hero_bg_images)) {
      settingsObj.hero_images = [...settingsObj.hero_bg_images];
    } else if (Array.isArray(settingsObj.hero_images)) {
      settingsObj.hero_bg_images = [...settingsObj.hero_images];
    }

    // Fetch existing settings to merge cleanly
    let mainSettings = await Settings.findOne({ key: 'site_settings' });
    if (!mainSettings) mainSettings = await Settings.findById('site_settings') || await Settings.findById('global_cms_settings');

    const existingVal = (mainSettings?.value && typeof mainSettings.value === 'object')
      ? mainSettings.value
      : (mainSettings?.data && typeof mainSettings.data === 'object')
        ? mainSettings.data
        : {};

    const mergedVal = { ...existingVal, ...settingsObj };
    const mergedJson = JSON.stringify(mergedVal);
    const adminUser = req.user?.id || 'admin';

    // 1. Atomically update both master settings rows in Supabase
    await query(
      `UPDATE settings
       SET value = $1::jsonb, data = $1::jsonb, updated_at = NOW(), updated_by = $2
       WHERE id IN ('site_settings', 'global_cms_settings')`,
      [mergedJson, adminUser]
    );

    // Ensure site_settings row exists if it was somehow deleted
    await query(
      `INSERT INTO settings (id, key, value, data, created_at, updated_at, created_by, updated_by)
       VALUES ('site_settings', 'site_settings', $1::jsonb, $1::jsonb, NOW(), NOW(), $2, $2)
       ON CONFLICT (id) DO UPDATE
       SET value = $1::jsonb, data = $1::jsonb, updated_at = NOW(), updated_by = $2`,
      [mergedJson, adminUser]
    );

    // 2. Synchronously update individual setting keys for fast granular key queries
    const keys = Object.keys(settingsObj);
    await Promise.all(
      keys.map(async (key) => {
        try {
          const val = settingsObj[key];
          const valJson = (typeof val === 'object' && val !== null) ? JSON.stringify(val) : JSON.stringify(val);
          await query(
            `INSERT INTO settings (id, key, value, data, created_at, updated_at, created_by, updated_by)
             VALUES ($1, $2, $3::jsonb, $3::jsonb, NOW(), NOW(), $4, $4)
             ON CONFLICT (id) DO UPDATE
             SET value = $3::jsonb, data = $3::jsonb, updated_at = NOW(), updated_by = $4`,
            [`setting_${key}`, key, valJson, adminUser]
          );
        } catch (e) {
          // Key sync warning
        }
      })
    );

    res.status(200).json({
      success: true,
      message: 'All settings updated successfully',
      data: mergedVal,
    });
  } catch (err) {
    console.error('updateAllSettings error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update settings',
    });
  }
};
