import bcrypt from 'bcrypt';
import { query } from '../config/supabase.js';

// Helpers for case conversion
const snakeToCamel = (str) =>
  str.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));

const camelToSnake = (str) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const sanitizeFilterKey = (k) => {
  if (['select', 'sort', 'page', 'limit', 'search', 'populate', 'lean'].includes(k)) {
    return null;
  }
  return k;
};

// Global cache for PostgreSQL table columns
const tableColumnsCache = {};

export async function getTableColumns(tableName) {
  if (tableColumnsCache[tableName]) return tableColumnsCache[tableName];
  try {
    const res = await query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1",
      [tableName]
    );
    const map = {};
    res.rows.forEach((r) => {
      map[r.column_name] = r.data_type;
    });
    tableColumnsCache[tableName] = map;
    return map;
  } catch (err) {
    console.warn(`Failed to fetch columns for ${tableName}:`, err.message);
    return {};
  }
}

const COLUMN_ALIASES = {
  heroImage: 'hero_image',
  galleryImages: 'gallery_images',
  clientName: 'client_name',
  clientImage: 'client_image',
  googleVerified: 'google_verified',
  inStock: 'in_stock',
  completionYear: 'year',
  beforeAfter: 'before_after',
  homeOrder: 'home_order',
  faqPageOrder: 'faq_page_order',
  displayOrder: 'order',
  fileName: 'file_name',
  originalName: 'original_name',
  imageUrl: 'image_url',
  storageProvider: 'storage_provider',
  cloudinaryPublicId: 'cloudinary_public_id',
  cloudinaryAssetId: 'cloudinary_asset_id',
  resourceType: 'resource_type',
  fileSize: 'file_size',
  mustChangePassword: 'must_change_password',
  lastLogin: 'last_login',
  softDelete: 'soft_delete',
  createdBy: 'created_by',
  updatedBy: 'updated_by',
};

export class SupabaseModelAdapter {
  constructor(modelName) {
    this.modelName = modelName;
    const lower = modelName.toLowerCase();
    if (lower === 'category') this.tableName = 'categories';
    else if (lower === 'activitylog') this.tableName = 'activity_logs';
    else if (lower.endsWith('s')) this.tableName = lower;
    else this.tableName = lower + 's';
  }

  _toDoc(row) {
    if (!row) return null;
    const doc = {
      _id: row.id || row._id,
      id: row.id || row._id,
    };

    Object.keys(row).forEach((col) => {
      let val = row[col];
      if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
        try { val = JSON.parse(val); } catch {}
      }
      doc[col] = val;
      const camelKey = snakeToCamel(col);
      if (camelKey !== col) {
        doc[camelKey] = val;
      }
    });

    // Unpack extra fields saved in data JSONB column so they appear directly on the doc
    if (doc.data && typeof doc.data === 'object' && !Array.isArray(doc.data)) {
      Object.keys(doc.data).forEach((k) => {
        if (doc[k] === undefined) {
          doc[k] = doc.data[k];
          const camelKey = snakeToCamel(k);
          if (doc[camelKey] === undefined) {
            doc[camelKey] = doc.data[k];
          }
        }
      });
    }

    // Universal property aliases ensuring 100% parity across controllers & frontend
    if (doc.hero_image && !doc.heroImage) doc.heroImage = doc.hero_image;
    if (doc.heroImage && !doc.hero_image) doc.hero_image = doc.heroImage;
    if (doc.gallery_images && !doc.galleryImages) doc.galleryImages = doc.gallery_images;
    if (doc.galleryImages && !doc.gallery_images) doc.gallery_images = doc.galleryImages;
    if (doc.client_name && !doc.clientName) doc.clientName = doc.client_name;
    if (doc.clientName && !doc.client_name) doc.client_name = doc.clientName;
    if (doc.client_image && !doc.clientImage) doc.clientImage = doc.client_image;
    if (doc.clientImage && !doc.client_image) doc.client_image = doc.clientImage;
    if (doc.google_verified !== undefined && doc.googleVerified === undefined) doc.googleVerified = doc.google_verified;
    if (doc.in_stock !== undefined && doc.inStock === undefined) doc.inStock = doc.in_stock;
    if (doc.year !== undefined && doc.completionYear === undefined) doc.completionYear = doc.year;
    if (doc.before_after && !doc.beforeAfter) doc.beforeAfter = doc.before_after;
    if (doc.beforeAfter && !doc.before_after) doc.before_after = doc.beforeAfter;
    if (!doc.beforeImage && Array.isArray(doc.before_after) && doc.before_after[0]?.before) {
      doc.beforeImage = doc.before_after[0].before;
    }
    if (!doc.afterImage && Array.isArray(doc.before_after) && doc.before_after[0]?.after) {
      doc.afterImage = doc.before_after[0].after;
    }
    if (doc.beforeImage && !doc.beforeImages) doc.beforeImages = [doc.beforeImage];
    if (doc.afterImage && !doc.afterImages) doc.afterImages = [doc.afterImage];
    if (Array.isArray(doc.beforeImages) && doc.beforeImages.length > 0 && !doc.beforeImage) {
      doc.beforeImage = doc.beforeImages[0];
    }
    if (Array.isArray(doc.afterImages) && doc.afterImages.length > 0 && !doc.afterImage) {
      doc.afterImage = doc.afterImages[0];
    }
    if (doc.home_order !== undefined && doc.homeOrder === undefined) doc.homeOrder = doc.home_order;
    if (doc.faq_page_order !== undefined && doc.faqPageOrder === undefined) doc.faqPageOrder = doc.faq_page_order;

    const self = this;
    doc.save = async function () {
      return await self.findByIdAndUpdate(this.id || this._id, this);
    };

    doc.comparePassword = async function (candidatePassword) {
      if (!this.password) return false;
      return await bcrypt.compare(candidatePassword, this.password);
    };

    return doc;
  }

  _buildWhereClause(filter = {}, params = []) {
    const whereParts = [];

    Object.keys(filter || {}).forEach((key) => {
      if (!sanitizeFilterKey(key)) return;
      const val = filter[key];
      if (val === undefined || val === null) return;

      const colName = camelToSnake(key);

      if (key === '$or' && Array.isArray(val)) {
        const orParts = [];
        val.forEach((orCond) => {
          Object.keys(orCond).forEach((k) => {
            const c = camelToSnake(k);
            const safeC = c === 'order' ? '"order"' : c;
            const v = orCond[k];
            if (v instanceof RegExp) {
              params.push(`%${v.source.replace(/\\/g, '')}%`);
              orParts.push(`${safeC} ILIKE $${params.length}`);
            } else if (typeof v === 'object' && v.$regex) {
              params.push(`%${v.$regex}%`);
              orParts.push(`${safeC} ILIKE $${params.length}`);
            } else {
              params.push(v);
              orParts.push(`${safeC} = $${params.length}`);
            }
          });
        });
        if (orParts.length > 0) {
          whereParts.push(`(${orParts.join(' OR ')})`);
        }
      } else if (val instanceof RegExp) {
        params.push(`%${val.source.replace(/\\/g, '')}%`);
        const safeCol = colName === 'order' ? '"order"' : colName;
        whereParts.push(`${safeCol} ILIKE $${params.length}`);
      } else if (typeof val === 'object' && val.$regex) {
        params.push(`%${val.$regex}%`);
        const safeCol = colName === 'order' ? '"order"' : colName;
        whereParts.push(`${safeCol} ILIKE $${params.length}`);
      } else {
        if (colName === 'email') {
          params.push(String(val).toLowerCase());
          whereParts.push(`LOWER(email) = $${params.length}`);
        } else if (colName === '_id' || colName === 'id') {
          params.push(String(val));
          whereParts.push(`id = $${params.length}`);
        } else {
          const safeCol = colName === 'order' ? '"order"' : colName;
          params.push(val);
          whereParts.push(`${safeCol} = $${params.length}`);
        }
      }
    });

    return whereParts;
  }

  find(filter = {}) {
    let limitNum = null;
    let skipNum = 0;
    let sortStr = null;
    let selectFields = null;
    const populateFields = [];

    const execute = async () => {
      // Special handling for settings table
      if (this.tableName === 'settings') {
        if (filter && filter.key) {
          const res = await query('SELECT * FROM settings WHERE key = $1 LIMIT 1', [filter.key]);
          if (res.rows.length > 0) {
            return [this._toDoc(res.rows[0])];
          }
          const masterRes = await query("SELECT * FROM settings WHERE key = 'site_settings' LIMIT 1");
          if (masterRes.rows.length > 0) {
            const masterDoc = this._toDoc(masterRes.rows[0]);
            const val = masterDoc.value?.[filter.key] ?? masterDoc.data?.[filter.key];
            if (val !== undefined) {
              return [{ _id: filter.key, id: filter.key, key: filter.key, value: val }];
            }
          }
          return [];
        } else {
          const res = await query('SELECT * FROM settings ORDER BY id ASC');
          return res.rows.map((r) => this._toDoc(r));
        }
      }

      let sql = `SELECT * FROM ${this.tableName}`;
      const params = [];
      const whereParts = this._buildWhereClause(filter, params);

      if (whereParts.length > 0) {
        sql += ` WHERE ${whereParts.join(' AND ')}`;
      }

      if (sortStr) {
        const sortFields = sortStr.split(' ').map((s) => s.trim()).filter(Boolean);
        const sqlSorts = sortFields.map((f) => {
          const desc = f.startsWith('-');
          const rawField = desc ? f.substring(1) : f;
          let fieldName = camelToSnake(rawField);
          if (fieldName === 'order' || fieldName === 'display_order') fieldName = '"order"';
          return `${fieldName} ${desc ? 'DESC' : 'ASC'}`;
        });
        if (sqlSorts.length > 0) {
          sql += ` ORDER BY ${sqlSorts.join(', ')}`;
        }
      }

      if (limitNum !== null) {
        sql += ` LIMIT ${Number(limitNum)}`;
      }
      if (skipNum) {
        sql += ` OFFSET ${Number(skipNum)}`;
      }

      const res = await query(sql, params);
      return res.rows.map((r) => this._toDoc(r));
    };

    const chain = {
      select: (fields) => {
        selectFields = fields;
        return chain;
      },
      sort: (s) => {
        sortStr = s;
        return chain;
      },
      limit: (n) => {
        limitNum = n;
        return chain;
      },
      skip: (n) => {
        skipNum = n;
        return chain;
      },
      populate: (path, select) => {
        populateFields.push({ path, select });
        return chain;
      },
      lean: () => chain,
      then: (onFulfilled, onRejected) => {
        return execute().then(onFulfilled, onRejected);
      },
      catch: (onRejected) => {
        return execute().catch(onRejected);
      },
    };

    return chain;
  }

  findOne(filter = {}) {
    const chain = this.find(filter);
    const originalThen = chain.then;
    chain.then = (onFulfilled, onRejected) => {
      return originalThen((docs) => {
        const doc = docs && docs.length > 0 ? docs[0] : null;
        return typeof onFulfilled === 'function' ? onFulfilled(doc) : doc;
      }, onRejected);
    };
    return chain;
  }

  findById(id) {
    return this.findOne({ id });
  }

  async countDocuments(filter = {}) {
    try {
      if (this.tableName === 'settings') {
        const docs = await this.find(filter);
        return docs.length;
      }
      const params = [];
      const whereParts = this._buildWhereClause(filter, params);
      let sql = `SELECT COUNT(*)::int as count FROM ${this.tableName}`;
      if (whereParts.length > 0) {
        sql += ` WHERE ${whereParts.join(' AND ')}`;
      }
      const res = await query(sql, params);
      return res.rows[0]?.count || 0;
    } catch (err) {
      console.warn(`countDocuments(${this.tableName}) warning:`, err.message);
      return 0;
    }
  }

  async create(data) {
    const clean = { ...data };
    const id = clean.id || clean._id || `${this.tableName.slice(0, 4)}_${Date.now()}`;
    clean.id = id;
    clean._id = id;

    if (this.tableName === 'users' && clean.password && !clean.password.startsWith('$2b$')) {
      clean.password = await bcrypt.hash(clean.password, 10);
    }

    const tableCols = await getTableColumns(this.tableName);
    const hasColMap = Object.keys(tableCols).length > 0;
    const hasDataCol = !!tableCols['data'];
    const extraFields = {};

    const cols = [];
    const placeholders = [];
    const vals = [];

    Object.keys(clean).forEach((k) => {
      if (['save', 'comparePassword'].includes(k)) return;
      let targetCol = null;
      if (!hasColMap) {
        targetCol = camelToSnake(k);
      } else if (tableCols[k]) {
        targetCol = k;
      } else if (COLUMN_ALIASES[k] && tableCols[COLUMN_ALIASES[k]]) {
        targetCol = COLUMN_ALIASES[k];
      } else if (tableCols[camelToSnake(k)]) {
        targetCol = camelToSnake(k);
      } else {
        extraFields[k] = clean[k];
        return;
      }

      const safeCol = targetCol === 'order' ? '"order"' : targetCol;
      let val = clean[k];
      const colType = tableCols[targetCol];
      if (val !== undefined && val !== null && (typeof val === 'object' || colType === 'jsonb' || colType === 'json')) {
        if (typeof val === 'object') val = JSON.stringify(val);
      }
      cols.push(safeCol);
      vals.push(val);
      placeholders.push(`$${vals.length}`);
    });

    if (hasDataCol && !cols.includes('data')) {
      const mergedData = { ...(clean.data || {}), ...extraFields };
      cols.push('data');
      vals.push(JSON.stringify(mergedData));
      placeholders.push(`$${vals.length}`);
    }

    const sql = `INSERT INTO ${this.tableName} (${cols.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`;
    const res = await query(sql, vals);
    return this._toDoc(res.rows[0]);
  }

  async saveOrUpdate(customId, data) {
    const id = String(customId || data.id || data._id || `doc_${Date.now()}`);
    const existing = await this.findById(id);
    if (existing) {
      return await this.findByIdAndUpdate(id, data);
    } else {
      return await this.create({ ...data, id, _id: id });
    }
  }

  async findByIdAndUpdate(id, data, options = {}) {
    const clean = { ...data };
    delete clean._id;
    delete clean.id;
    delete clean.save;
    delete clean.comparePassword;

    const tableCols = await getTableColumns(this.tableName);
    const hasColMap = Object.keys(tableCols).length > 0;
    const hasDataCol = !!tableCols['data'];
    const extraFields = {};

    const setParts = [];
    const vals = [id];

    Object.keys(clean).forEach((k) => {
      let targetCol = null;
      if (!hasColMap) {
        targetCol = camelToSnake(k);
      } else if (tableCols[k]) {
        targetCol = k;
      } else if (COLUMN_ALIASES[k] && tableCols[COLUMN_ALIASES[k]]) {
        targetCol = COLUMN_ALIASES[k];
      } else if (tableCols[camelToSnake(k)]) {
        targetCol = camelToSnake(k);
      } else {
        extraFields[k] = clean[k];
        return;
      }

      const safeCol = targetCol === 'order' ? '"order"' : targetCol;
      let val = clean[k];
      const colType = tableCols[targetCol];
      if (val !== undefined && val !== null && (typeof val === 'object' || colType === 'jsonb' || colType === 'json')) {
        if (typeof val === 'object') val = JSON.stringify(val);
      }
      vals.push(val);
      setParts.push(`${safeCol} = $${vals.length}`);
    });

    if (hasDataCol && Object.keys(extraFields).length > 0) {
      let existingData = {};
      try {
        const existRes = await query(`SELECT data FROM ${this.tableName} WHERE id = $1 LIMIT 1`, [id]);
        if (existRes.rows[0]?.data) {
          existingData = typeof existRes.rows[0].data === 'object' ? existRes.rows[0].data : JSON.parse(existRes.rows[0].data);
        }
      } catch {}
      const mergedData = { ...existingData, ...(clean.data || {}), ...extraFields };
      vals.push(JSON.stringify(mergedData));
      setParts.push(`data = $${vals.length}`);
    }

    if (setParts.length === 0) {
      return await this.findById(id);
    }

    if (tableCols['updated_at']) {
      setParts.push('updated_at = NOW()');
    }

    const sql = `UPDATE ${this.tableName} SET ${setParts.join(', ')} WHERE id = $1 RETURNING *`;
    const res = await query(sql, vals);
    return res.rows[0] ? this._toDoc(res.rows[0]) : null;
  }

  async findByIdAndDelete(id) {
    const res = await query(`DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`, [id]);
    return res.rows[0] ? this._toDoc(res.rows[0]) : null;
  }

  async deleteMany(filter = {}) {
    if (Object.keys(filter).length === 0) {
      await query(`DELETE FROM ${this.tableName}`);
      return;
    }
    const whereParts = [];
    const vals = [];
    Object.keys(filter).forEach((k) => {
      const col = camelToSnake(k);
      const safeCol = col === 'order' ? '"order"' : col;
      vals.push(filter[k]);
      whereParts.push(`${safeCol} = $${vals.length}`);
    });
    await query(`DELETE FROM ${this.tableName} WHERE ${whereParts.join(' AND ')}`, vals);
  }

  async aggregate(pipeline = []) {
    try {
      if (this.tableName === 'leads') {
        const isStatusGroup = pipeline.some((p) => p.$group && p.$group._id === '$status');
        if (isStatusGroup) {
          const res = await query(`
            SELECT status as _id, COUNT(*)::int as count
            FROM leads
            GROUP BY status
          `);
          return res.rows;
        }

        const isMonthGroup = pipeline.some((p) => p.$group && p.$group._id && p.$group._id.month);
        if (isMonthGroup) {
          const res = await query(`
            SELECT 
              EXTRACT(YEAR FROM created_at)::int as year,
              EXTRACT(MONTH FROM created_at)::int as month,
              COUNT(*)::int as count
            FROM leads
            GROUP BY 1, 2
            ORDER BY 1 ASC, 2 ASC
          `);
          return res.rows.map((r) => ({
            _id: { year: r.year, month: r.month },
            count: r.count,
          }));
        }
      }
      return [];
    } catch (err) {
      console.warn(`SupabaseModelAdapter.aggregate(${this.tableName}) warning:`, err.message);
      return [];
    }
  }
}

export default SupabaseModelAdapter;
