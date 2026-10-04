import Project from '../models/Project.js';
import { ErrorResponse } from '../middleware/errorMiddleware.js';
import { uploadFile, deleteFile } from '../services/storageService.js';

// In-memory cache for ultra-fast (sub-5ms) response times
const projectsCache = new Map();
const CACHE_TTL_MS = 60000; // 60 seconds

export const invalidateProjectsCache = () => {
  projectsCache.clear();
};

/**
 * @desc    Get all projects (public listing, filtering, pagination, search)
 * @route   GET /api/projects
 * @access  Public
 */
export const getProjects = async (req, res, next) => {
  try {
    const cacheKey = JSON.stringify(req.query || {});
    const cached = projectsCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', 'public, max-age=30');
      return res.status(200).json(cached.payload);
    }

    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'search', 'admin'];
    removeFields.forEach((param) => delete reqQuery[param]);

    reqQuery.softDelete = false;
    if (req.query.status) {
      reqQuery.status = req.query.status;
    } else if (req.query.admin !== 'true') {
      reqQuery.status = 'published';
    }

    // Text search
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      reqQuery.$or = [
        { title: searchRegex },
        { location: searchRegex },
        { style: searchRegex },
        { description: searchRegex },
      ];
    }

    // Build query
    query = Project.find(reqQuery);

    // Select fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('order createdAt'); // default: canonical sequence
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;
    const total = await Project.countDocuments(reqQuery);

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const projects = await query.populate('materialsUsed', 'title slug heroImage');

    // Pagination detail object
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
    };

    const payload = {
      success: true,
      data: projects,
      pagination,
    };

    projectsCache.set(cacheKey, { timestamp: Date.now(), payload });

    res.setHeader('Cache-Control', 'public, max-age=30');
    res.setHeader('X-Cache', 'MISS');

    res.status(200).json(payload);
  } catch (err) {
    console.warn('Projects GET warning:', err.message);
    res.status(200).json({
      success: true,
      data: [],
      pagination: { currentPage: 1, totalPages: 1, totalResults: 0 }
    });
  }
};

/**
 * @desc    Get a single project details by slug
 * @route   GET /api/projects/:slug
 * @access  Public
 */
const PROJECT_SLUG_ALIASES = {
  // 1. Rajapushpa Provincia 3BHK
  'rajapushpa-provincia-3bhk': 'rajapushpa-provincia-3bhk',
  'rajapushpa-provincia': 'rajapushpa-provincia-3bhk',
  'rajapushpa': 'rajapushpa-provincia-3bhk',
  'provincia': 'rajapushpa-provincia-3bhk',
  'the-arcstone-residence': 'rajapushpa-provincia-3bhk',
  'arcstone-residence': 'rajapushpa-provincia-3bhk',
  'arcstone': 'rajapushpa-provincia-3bhk',
  'indo-classical-elegance-3bhk': 'rajapushpa-provincia-3bhk',
  'indo-classical': 'rajapushpa-provincia-3bhk',

  // 2. My Home Sayuk 3BHK
  'my-home-sayuk-3bhk': 'my-home-sayuk-3bhk',
  'my-home-sayuk': 'my-home-sayuk-3bhk',
  'sayuk-3bhk': 'my-home-sayuk-3bhk',
  'sayuk': 'my-home-sayuk-3bhk',
  'the-lattice-retreat': 'my-home-sayuk-3bhk',
  'lattice-retreat': 'my-home-sayuk-3bhk',
  'lattice': 'my-home-sayuk-3bhk',

  // 3. Kokapet 2BHK (Nagesh)
  'kokapet-2bhk': 'kokapet-2bhk',
  'kokapet': 'kokapet-2bhk',
  'kokapet-nagesh': 'kokapet-2bhk',
  'the-boucle-residence': 'kokapet-2bhk',
  'boucle-residence': 'kokapet-2bhk',
  'boucle': 'kokapet-2bhk',

  // 4. Kokapet Urban 2BHK (Rahul / Aparna Zicon)
  'kokapet-urban-2bhk': 'kokapet-urban-2bhk',
  'kokapet-urban': 'kokapet-urban-2bhk',
  'kokapet-rahul': 'kokapet-urban-2bhk',
  'rahul': 'kokapet-urban-2bhk',
  'the-ivory-retreat': 'kokapet-urban-2bhk',
  'ivory-retreat': 'kokapet-urban-2bhk',
  'ivory': 'kokapet-urban-2bhk',
  'aparna-zicon-high-rise-2bhk': 'kokapet-urban-2bhk',
  'aparna-zicon': 'kokapet-urban-2bhk',
  'urban-contemporary-flat-2bhk': 'kokapet-urban-2bhk',

  // 5. Gandipet Modern Retro 2BHK (Kiran)
  'gandipet-modern-retro-2bhk': 'gandipet-modern-retro-2bhk',
  'gandipet-modern-retro': 'gandipet-modern-retro-2bhk',
  'gandipet': 'gandipet-modern-retro-2bhk',
  'gandipet-kiran': 'gandipet-modern-retro-2bhk',
  'kiran': 'gandipet-modern-retro-2bhk',
  'the-panelled-muse': 'gandipet-modern-retro-2bhk',
  'panelled-muse': 'gandipet-modern-retro-2bhk',
  'panelled': 'gandipet-modern-retro-2bhk',
  'modern-retro-haven-2bhk': 'gandipet-modern-retro-2bhk',

  // 6. Kondapur Minimalist 2BHK (Venkatesh)
  'kondapur-minimalist-2bhk': 'kondapur-minimalist-2bhk',
  'kondapur-minimalist': 'kondapur-minimalist-2bhk',
  'kondapur': 'kondapur-minimalist-2bhk',
  'kondapur-venkatesh': 'kondapur-minimalist-2bhk',
  'venkatesh': 'kondapur-minimalist-2bhk',
  'the-dusk-lounge': 'kondapur-minimalist-2bhk',
  'dusk-lounge': 'kondapur-minimalist-2bhk',
  'dusk': 'kondapur-minimalist-2bhk',
  'executive-2bhk-residence': 'kondapur-minimalist-2bhk',

  // 7. Gachibowli Minimalist Beige 2BHK (Koteswara)
  'gachibowli-minimalist-beige-2bhk': 'gachibowli-minimalist-beige-2bhk',
  'gachibowli-minimalist-beige': 'gachibowli-minimalist-beige-2bhk',
  'gachibowli-minimalist': 'gachibowli-minimalist-beige-2bhk',
  'gachibowli': 'gachibowli-minimalist-beige-2bhk',
  'gachibowli-koteswara': 'gachibowli-minimalist-beige-2bhk',
  'koteswara': 'gachibowli-minimalist-beige-2bhk',
  'minimalist-beige-2bhk': 'gachibowli-minimalist-beige-2bhk',

  // 8. Kachiguda Fusion Duplex Villa (Subbarao)
  'kachiguda-fusion-duplex-villa': 'kachiguda-fusion-duplex-villa',
  'kachiguda-fusion-duplex': 'kachiguda-fusion-duplex-villa',
  'kachiguda-duplex': 'kachiguda-fusion-duplex-villa',
  'kachiguda': 'kachiguda-fusion-duplex-villa',
  'kachiguda-subbarao': 'kachiguda-fusion-duplex-villa',
  'subbarao': 'kachiguda-fusion-duplex-villa',
  'exquisite-duplex-fusion-4bhk': 'kachiguda-fusion-duplex-villa',
  'duplex': 'kachiguda-fusion-duplex-villa',

  // 9. Dimmu Chachu Luxury Villa
  'dimmu-chachu-luxury-villa': 'dimmu-chachu-luxury-villa',
  'dimmu-chachu': 'dimmu-chachu-luxury-villa',
  'dimmu': 'dimmu-chachu-luxury-villa',
  'the-celestial-curve-villa': 'dimmu-chachu-luxury-villa',
  'celestial-curve-villa': 'dimmu-chachu-luxury-villa',
  'celestial': 'dimmu-chachu-luxury-villa',
  'grand-3bhk-penthouse-luxe': 'dimmu-chachu-luxury-villa',

  // 10. The Restful Home (Tellapur 2BHK - Dinesh & Sarvani)
  'the-restful-home-tellapur': 'the-restful-home-tellapur',
  'the-restful-home': 'the-restful-home-tellapur',
  'restful-home': 'the-restful-home-tellapur',
  'tellapur-2bhk': 'the-restful-home-tellapur',
  'tellapur': 'the-restful-home-tellapur',
  'dinesh-sarvani': 'the-restful-home-tellapur',
  'dinesh': 'the-restful-home-tellapur',

  // 11. Casa Alta Residence (Kali Mandir 3BHK - Prakash)
  'casa-alta-residence-kali-mandir': 'casa-alta-residence-kali-mandir',
  'casa-alta-residence': 'casa-alta-residence-kali-mandir',
  'casa-alta': 'casa-alta-residence-kali-mandir',
  'kali-mandir-3bhk': 'casa-alta-residence-kali-mandir',
  'kali-mandir': 'casa-alta-residence-kali-mandir',
  'prakash': 'casa-alta-residence-kali-mandir',

  // Project _id mappings
  'proj_1_rajapushpa_provincia': 'rajapushpa-provincia-3bhk',
  'proj_2_my_home_sayuk': 'my-home-sayuk-3bhk',
  'proj_3_kokapet_nagesh': 'kokapet-2bhk',
  'proj_4_kokapet_rahul': 'kokapet-urban-2bhk',
  'proj_5_gandipet_kiran': 'gandipet-modern-retro-2bhk',
  'proj_6_kondapur_venkatesh': 'kondapur-minimalist-2bhk',
  'proj_7_gachibowli_koteswara': 'gachibowli-minimalist-beige-2bhk',
  'proj_8_kachiguda_subbarao': 'kachiguda-fusion-duplex-villa',
  'proj_9_dimmu_chachu_residence': 'dimmu-chachu-luxury-villa',
  'proj_10_the_restful_home_tellapur': 'the-restful-home-tellapur',
  'proj_11_casa_alta_residence_kali_mandir': 'casa-alta-residence-kali-mandir',

  // Order number mappings
  '1': 'rajapushpa-provincia-3bhk',
  '2': 'my-home-sayuk-3bhk',
  '3': 'kokapet-2bhk',
  '4': 'kokapet-urban-2bhk',
  '5': 'gandipet-modern-retro-2bhk',
  '6': 'kondapur-minimalist-2bhk',
  '7': 'gachibowli-minimalist-beige-2bhk',
  '8': 'kachiguda-fusion-duplex-villa',
  '9': 'dimmu-chachu-luxury-villa',
  '10': 'the-restful-home-tellapur',
  '11': 'casa-alta-residence-kali-mandir'
};

export const getProjectBySlug = async (req, res, next) => {
  try {
    const rawParam = (req.params.slug || '').trim().toLowerCase().replace(/\/+$/, '');
    const targetSlug = PROJECT_SLUG_ALIASES[rawParam] || rawParam;

    let project = await Project.findOne({
      slug: targetSlug,
      softDelete: false,
      status: 'published',
    })
      .populate('materialsUsed', 'title slug heroImage category')
      .populate('relatedProjects', 'title slug heroImage category location');

    // If not found by slug, try searching by _id
    if (!project) {
      project = await Project.findOne({
        _id: rawParam,
        softDelete: false,
        status: 'published',
      })
        .populate('materialsUsed', 'title slug heroImage category')
        .populate('relatedProjects', 'title slug heroImage category location');
    }

    // If still not found, search without strict status filter
    if (!project) {
      project = await Project.findOne({
        slug: targetSlug,
        softDelete: false,
      })
        .populate('materialsUsed', 'title slug heroImage category')
        .populate('relatedProjects', 'title slug heroImage category location');
    }

    // Fuzzy fallback: search among all non-deleted projects
    if (!project) {
      const allProjects = await Project.find({ softDelete: false });
      project = allProjects.find(p => 
        p.slug === targetSlug || 
        p.slug === rawParam || 
        (p.slug && (p.slug.includes(rawParam) || rawParam.includes(p.slug))) ||
        (p.title && p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(rawParam)) ||
        (p._id && p._id.toString() === rawParam)
      );
    }

    if (!project) {
      return next(new ErrorResponse(`Project not found with slug: ${req.params.slug}`, 404));
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new project entry
 * @route   POST /api/projects
 * @access  Private (Admin)
 */
export const createProject = async (req, res, next) => {
  try {
    let projectData;
    if (typeof req.body.data === 'string') {
      projectData = JSON.parse(req.body.data);
    } else if (req.body.data && typeof req.body.data === 'object') {
      projectData = req.body.data;
    } else {
      projectData = req.body;
    }

    // Handle files if uploaded via multer
    if (req.files) {
      // 1. Single Hero Image
      if (req.files.heroImage && req.files.heroImage[0]) {
        projectData.heroImage = await uploadFile(req.files.heroImage[0]);
      }

      // 2. Multiple Gallery Images
      if (req.files.gallery && req.files.gallery.length > 0) {
        projectData.gallery = [];
        for (const file of req.files.gallery) {
          const url = await uploadFile(file);
          projectData.gallery.push(url);
        }
      }

      // 3. Renovation Before/After Images
      if (req.files.beforeImages && req.files.beforeImages.length > 0) {
        projectData.beforeImages = [];
        for (const file of req.files.beforeImages) {
          const url = await uploadFile(file);
          projectData.beforeImages.push(url);
        }
      }
      if (req.files.afterImages && req.files.afterImages.length > 0) {
        projectData.afterImages = [];
        for (const file of req.files.afterImages) {
          const url = await uploadFile(file);
          projectData.afterImages.push(url);
        }
      }
    }

    // Set auditing
    projectData.createdBy = req.user?.id || 'admin';

    // Save project
    const project = await Project.create(projectData);
    invalidateProjectsCache();

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update a project entry
 * @route   PUT /api/projects/:id
 * @access  Private (Admin)
 */
export const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project || project.softDelete) {
      return next(new ErrorResponse(`Project not found with ID of ${req.params.id}`, 404));
    }

    let projectData;
    if (typeof req.body.data === 'string') {
      projectData = JSON.parse(req.body.data);
    } else if (req.body.data && typeof req.body.data === 'object') {
      projectData = req.body.data;
    } else {
      projectData = req.body;
    }

    // Handle file edits
    if (req.files) {
      // 1. Hero Image Update
      if (req.files.heroImage && req.files.heroImage[0]) {
        // Delete old cover
        if (project.heroImage) await deleteFile(project.heroImage);
        projectData.heroImage = await uploadFile(req.files.heroImage[0]);
      }

      // 2. Add new Gallery items
      if (req.files.gallery && req.files.gallery.length > 0) {
        const newGallery = [...(project.gallery || [])];
        for (const file of req.files.gallery) {
          const url = await uploadFile(file);
          newGallery.push(url);
        }
        projectData.gallery = newGallery;
      }

      // 3. Before/After updates
      if (req.files.beforeImages && req.files.beforeImages.length > 0) {
        const newBefore = [...(project.beforeImages || [])];
        for (const file of req.files.beforeImages) {
          const url = await uploadFile(file);
          newBefore.push(url);
        }
        projectData.beforeImages = newBefore;
      }
      if (req.files.afterImages && req.files.afterImages.length > 0) {
        const newAfter = [...(project.afterImages || [])];
        for (const file of req.files.afterImages) {
          const url = await uploadFile(file);
          newAfter.push(url);
        }
        projectData.afterImages = newAfter;
      }
    }

    if (projectData.beforeImage || projectData.afterImage) {
      const beforeImg = projectData.beforeImage || (Array.isArray(projectData.before_after) && projectData.before_after[0]?.before) || '';
      const afterImg = projectData.afterImage || projectData.heroImage || (Array.isArray(projectData.before_after) && projectData.before_after[0]?.after) || '';
      projectData.before_after = [{ before: beforeImg, after: afterImg }];
    }

    if (projectData.visionStory || projectData.challengeStory || projectData.engineeringStory) {
      projectData.story = {
        vision: projectData.visionStory || projectData.story?.vision || projectData.description || '',
        challenges: projectData.challengeStory || projectData.story?.challenges || '',
        engineering: projectData.engineeringStory || projectData.story?.engineering || ''
      };
    }

    if (projectData.testimonialName || projectData.testimonialText) {
      projectData.testimonial = {
        name: projectData.testimonialName || projectData.testimonial?.name || '',
        mobile: projectData.testimonialMobile || projectData.testimonial?.mobile || '',
        profession: projectData.testimonialProfession || projectData.testimonial?.profession || '',
        text: projectData.testimonialText || projectData.testimonial?.text || '',
        rating: Number(projectData.testimonialRating || projectData.testimonial?.rating || 5)
      };
    }

    projectData.updatedBy = req.user?.id || 'admin';

    // Update DB record
    project = await Project.findByIdAndUpdate(req.params.id, projectData, {
      new: true,
      runValidators: true,
    });
    invalidateProjectsCache();

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Soft delete a project entry
 * @route   DELETE /api/projects/:id
 * @access  Private (Admin)
 */
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project || project.softDelete) {
      return next(new ErrorResponse(`Project not found with ID of ${req.params.id}`, 404));
    }

    // Set soft delete flag
    project.softDelete = true;
    project.updatedBy = req.user.id;
    await project.save();
    invalidateProjectsCache();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Batch update / reorder multiple projects
 * @route   PUT /api/projects/bulk
 * @access  Private (Admin)
 */
export const updateProjectsBulk = async (req, res, next) => {
  try {
    const list = Array.isArray(req.body) ? req.body : req.body?.projects;
    if (!Array.isArray(list)) {
      return next(new ErrorResponse('Expected an array of projects', 400));
    }
    const saved = [];
    for (const item of list) {
      const id = item.id || item._id;
      if (id) {
        const updated = await Project.saveOrUpdate(id, { ...item, updatedBy: req.user?.id || 'admin' });
        saved.push(updated);
      } else {
        const created = await Project.create({ ...item, createdBy: req.user?.id || 'admin' });
        saved.push(created);
      }
    }
    invalidateProjectsCache();
    res.status(200).json({
      success: true,
      message: 'Projects updated successfully in batch',
      count: saved.length,
      data: saved
    });
  } catch (err) {
    next(err);
  }
};
