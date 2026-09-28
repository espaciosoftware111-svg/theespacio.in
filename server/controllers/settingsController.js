import Settings from '../models/Settings.js';
import { query } from '../config/supabase.js';
import { ErrorResponse } from '../middleware/errorMiddleware.js';

let cachedSettings = null;
let cachedSettingsTime = 0;
const SETTINGS_CACHE_TTL_MS = 60000;

export const invalidateSettingsCache = () => {
  cachedSettings = null;
  cachedSettingsTime = 0;
};

/**
 * @desc    Get all system settings as a key-value object
 * @route   GET /api/settings
 * @access  Public
 */
export const getAllSettings = async (req, res, next) => {
  try {
    if (cachedSettings && (Date.now() - cachedSettingsTime < SETTINGS_CACHE_TTL_MS)) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', 'public, max-age=30');
      return res.status(200).json({
        success: true,
        data: cachedSettings,
      });
    }

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

    // Default 5 curated luxury company images
    const defaultHeroImages = [
      'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/ChatGPT_Image_Sep_21_2026_04_34_23_PM_1.png',
      'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/ChatGPT_Image_Sep_17_2026_06_59_28_PM_1.png',
      'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/ChatGPT_Image_Sep_16_2026_03_37_12_PM_1.png',
      'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/IMG_3871_1.png',
      'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/hf_20260926_111522_5d9cc288-51e5-41b7-ac4c-a4303ed6ae9c.png'
    ];

    // Synchronize hero_bg_images and hero_images array references
    let heroBgImgs = (Array.isArray(finalMap.hero_bg_images) && finalMap.hero_bg_images.length > 0)
      ? finalMap.hero_bg_images
      : (Array.isArray(finalMap.hero_images) && finalMap.hero_images.length > 0)
        ? finalMap.hero_images
        : defaultHeroImages;

    finalMap.hero_bg_images = heroBgImgs;
    finalMap.hero_images = heroBgImgs;

    const defaultServicesHeroImages = [
      'https://res.cloudinary.com/teg9ndhk/image/upload/v1790423769/hf_20260926_115135_689f37bb-4556-4b0c-825e-0586da0f2ddb.png',
      'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/hf_20260928_103008_456328d7-a078-498c-9e00-4d73fd070599.png',
      'https://res.cloudinary.com/teg9ndhk/image/upload/v1790423722/hf_20260926_115046_7312df3a-c42b-4bab-831c-c61f1a4c559a.png',
      'https://res.cloudinary.com/teg9ndhk/image/upload/v1790423697/hf_20260926_114746_45849102-0d71-4193-bf7f-41a775d147e3.png',
      'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/hf_20260928_104300_ea2f5c95-951a-49c1-b200-388396d23801.png'
    ];

    if (!Array.isArray(finalMap.services_hero_images) || finalMap.services_hero_images.length !== 5 || finalMap.services_hero_images.some(img => typeof img === 'string' && !img.includes('res.cloudinary.com'))) {
      finalMap.services_hero_images = defaultServicesHeroImages;
    }

    if (Array.isArray(finalMap.services_list) && finalMap.services_list.length >= 5) {
      defaultServicesHeroImages.forEach((imgUrl, idx) => {
        if (finalMap.services_list[idx] && (!finalMap.services_list[idx].img || !finalMap.services_list[idx].img.includes('res.cloudinary.com'))) {
          finalMap.services_list[idx].img = imgUrl;
        }
      });
    }

    finalMap.projects_cta_visible = true;
    if (!finalMap.cta_projects || finalMap.cta_projects.enabled === false) {
      finalMap.cta_projects = {
        ...(finalMap.cta_projects || {}),
        enabled: true,
        heading: finalMap.cta_projects?.heading || "Have a Project Like\nThis in Mind?",
        description: finalMap.cta_projects?.description || "Whether you need full turnkey execution or bespoke interior design, let's build your dream space together.",
        buttonText: finalMap.cta_projects?.buttonText || "GET A FORMAL QUOTE ↗",
        buttonHoverText: finalMap.cta_projects?.buttonHoverText || "REQUEST BOQ ↗",
        buttonLink: finalMap.cta_projects?.buttonLink || "/contact"
      };
    }

    cachedSettings = finalMap;
    cachedSettingsTime = Date.now();

    res.setHeader('Cache-Control', 'public, max-age=30');
    res.setHeader('X-Cache', 'MISS');

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

    invalidateSettingsCache();

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

    invalidateSettingsCache();

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
  const rawInput = req.body;
  const settingsObj = (rawInput && rawInput.data && typeof rawInput.data === 'object' && !Array.isArray(rawInput.data))
    ? rawInput.data
    : rawInput;

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

    invalidateSettingsCache();

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
