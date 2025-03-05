import express from 'express';
import {
  generatePresentation,
  getPresentationDetails,
  downloadPresentation
} from '../controllers/presentationController';

const router = express.Router();

// プレゼンテーション生成
router.post('/generate', generatePresentation);

// プレゼンテーション詳細取得
router.get('/:id', getPresentationDetails);

// プレゼンテーションダウンロード
router.get('/:id/download', downloadPresentation);

export default router;
