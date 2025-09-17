import { Router } from 'express';
import { presignUpload, presignDownload, deleteObject, validateContentType } from './uploads.service';

const uploadsRouter = Router();

// GET /uploads/presign?key=media-dev/uuid-file.jpg&contentType=image/jpeg
uploadsRouter.get('/presign', /* authenticate(), */ async (req, res, next) => {
  try {
    const key = String(req.query.key || '');
    const contentType = String(req.query.contentType || 'application/octet-stream');
    if (!key) return res.status(400).json({ status: 'error', message: 'Missing key' });

    if (!validateContentType(contentType)) {
      return res.status(415).json({ status: 'error', message: 'Unsupported content type' });
    }

    const url = await presignUpload(key, contentType, 60);
    return res.json({ status: 'success', message: 'ok', data: { url } });
  } catch (err) {
    next(err);
  }
});

// GET /uploads/view-url?key=media-dev/uuid-file.jpg
uploadsRouter.get('/view-url', /* authenticate(), */ async (req, res, next) => {
  try {
    const key = String(req.query.key || '');
    if (!key) return res.status(400).json({ status: 'error', message: 'Missing key' });

    const url = await presignDownload(key, 3600);
    return res.json({ status: 'success', message: 'ok', data: { url } });
  } catch (err) {
    next(err);
  }
});

// DELETE /uploads?key=media-dev/uuid-file.jpg
uploadsRouter.delete('/', /* authenticate(), */ async (req, res, next) => {
  try {
    const key = String(req.query.key || '');
    if (!key) return res.status(400).json({ status: 'error', message: 'Missing key' });
    await deleteObject(key);
    return res.json({ status: 'success', message: 'ok', data: { ok: true } });
  } catch (err) {
    next(err);
  }
});

export default uploadsRouter;

