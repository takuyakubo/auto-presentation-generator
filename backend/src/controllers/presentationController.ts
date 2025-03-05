import { Request, Response } from 'express';
import {
  generatePresentationFromText,
  getPresentationById,
  generatePowerPointFile
} from '../services/presentationService';

/**
 * テキストからプレゼンテーションを生成する
 */
export const generatePresentation = async (req: Request, res: Response) => {
  try {
    const { text, options } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'テキストが必要です' });
    }

    const result = await generatePresentationFromText(text, options);
    res.status(201).json(result);
  } catch (error: any) {
    console.error('Presentation generation error:', error);
    res.status(500).json({ error: error.message || '内部サーバーエラー' });
  }
};

/**
 * プレゼンテーションの詳細を取得する
 */
export const getPresentationDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const presentation = getPresentationById(id);

    if (!presentation) {
      return res.status(404).json({ error: 'プレゼンテーションが見つかりません' });
    }

    res.status(200).json(presentation);
  } catch (error: any) {
    console.error('Presentation details error:', error);
    res.status(500).json({ error: error.message || '内部サーバーエラー' });
  }
};

/**
 * 生成されたプレゼンテーションをダウンロードする
 */
export const downloadPresentation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const presentation = getPresentationById(id);

    if (!presentation) {
      return res.status(404).json({ error: 'プレゼンテーションが見つかりません' });
    }

    // PowerPointファイルを生成
    const buffer = await generatePowerPointFile(presentation);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.setHeader('Content-Disposition', `attachment; filename="presentation-${id}.pptx"`);
    res.send(buffer);
  } catch (error: any) {
    console.error('Presentation download error:', error);
    res.status(500).json({ error: error.message || '内部サーバーエラー' });
  }
};
