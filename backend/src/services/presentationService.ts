import { v4 as uuidv4 } from 'uuid';
import { OpenAI } from 'openai';
import pptxgen from 'pptxgenjs';
import { Presentation, Slide, PresentationOptions } from '../types/presentation';

// OpenAI設定
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// メモリ内キャッシュ
// 実際のアプリケーションではデータベースなどの永続化層を使用する
const presentationsCache = new Map<string, Presentation>();

/**
 * テキストからプレゼンテーションの構造を生成する
 */
export const generatePresentationFromText = async (
  text: string, 
  options: PresentationOptions = {}
): Promise<Presentation> => {
  const { 
    theme = 'modern', 
    slideCount = 10, 
    includeImages = true 
  } = options;

  try {
    // GPT-4を使用してテキストからスライド構造を生成
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: `あなたはプレゼンテーションのスペシャリストです。テキストから高品質なプレゼンテーションを作成します。
以下のテーマでスライドを作成してください: ${theme}
スライド数の目安は約${slideCount}枚です。
各スライドにはタイトルとコンテンツのリストを含めてください。
結果はJSON形式で返してください。`
        },
        {
          role: 'user',
          content: text
        }
      ],
      response_format: { type: 'json_object' }
    });

    // APIレスポンスからスライドデータを取得
    const responseContent = response.choices[0].message.content;
    if (!responseContent) {
      throw new Error('レスポンスの生成に失敗しました');
    }

    // JSONパース
    const parsedResponse = JSON.parse(responseContent);
    const slides: Slide[] = parsedResponse.slides || [];

    // 画像の生成と追加（オプションで有効な場合）
    if (includeImages && process.env.OPENAI_API_KEY) {
      // 実際の実装では、ここでDALL-EなAPIを使用して関連画像を生成する
      // 現在はスキップ
    }

    // プレゼンテーションデータの作成
    const presentationId = uuidv4();
    const presentation: Presentation = {
      id: presentationId,
      slides,
      theme,
      createdAt: new Date().toISOString(),
      downloadUrl: `/api/presentations/${presentationId}/download`
    };

    // キャッシュに保存
    presentationsCache.set(presentationId, presentation);

    return presentation;
  } catch (error) {
    console.error('Error generating presentation:', error);
    throw new Error('プレゼンテーションの生成中にエラーが発生しました');
  }
};

/**
 * プレゼンテーションIDからプレゼンテーションデータを取得する
 */
export const getPresentationById = (id: string): Presentation | undefined => {
  return presentationsCache.get(id);
};

/**
 * プレゼンテーションをPowerPointファイルとして生成する
 */
export const generatePowerPointFile = async (presentation: Presentation): Promise<Buffer> => {
  try {
    const pptx = new pptxgen();

    // プレゼンテーション全体の設定
    pptx.layout = 'LAYOUT_16x9';
    
    // テーマに基づいた色とフォントの設定
    const themeSettings = getThemeSettings(presentation.theme);
    
    // 各スライドの生成
    presentation.slides.forEach(slide => {
      const pptxSlide = pptx.addSlide();
      
      // スライドのタイトル
      pptxSlide.addText(slide.title, {
        x: 0.5,
        y: 0.5,
        w: '90%',
        fontSize: 36,
        fontFace: themeSettings.titleFont,
        color: themeSettings.primaryColor,
        bold: true,
      });
      
      // スライドのコンテンツ（箇条書き）
      if (slide.content && slide.content.length > 0) {
        pptxSlide.addText(
          slide.content.map(item => ({ text: item })),
          {
            x: 0.5,
            y: 1.5,
            w: '90%',
            h: 5,
            fontSize: 18,
            fontFace: themeSettings.contentFont,
            color: themeSettings.textColor,
            bullet: { type: 'bullet' },
          }
        );
      }
      
      // 画像の追加（画像URLがある場合）
      if (slide.imageUrl) {
        pptxSlide.addImage({
          path: slide.imageUrl,
          x: 5,
          y: 2.5,
          w: 4,
          h: 3,
        });
      }
    });
    
    // PowerPointファイルをバッファとして生成
    const buffer = await pptx.exportAsync();
    return buffer;
  } catch (error) {
    console.error('Error generating PowerPoint file:', error);
    throw new Error('PowerPointファイルの生成中にエラーが発生しました');
  }
};

/**
 * テーマに基づいた設定を取得する
 */
const getThemeSettings = (theme: string) => {
  const themes = {
    modern: {
      primaryColor: '0EA5E9',
      secondaryColor: '7DD3FC',
      textColor: '374151',
      titleFont: 'Arial',
      contentFont: 'Arial',
    },
    business: {
      primaryColor: '1E40AF',
      secondaryColor: '3B82F6',
      textColor: '1F2937',
      titleFont: 'Calibri',
      contentFont: 'Calibri',
    },
    creative: {
      primaryColor: '8B5CF6',
      secondaryColor: 'C4B5FD',
      textColor: '4B5563',
      titleFont: 'Segoe UI',
      contentFont: 'Segoe UI',
    },
    minimal: {
      primaryColor: '64748B',
      secondaryColor: '94A3B8',
      textColor: '334155',
      titleFont: 'Helvetica',
      contentFont: 'Helvetica',
    },
  };
  
  return themes[theme as keyof typeof themes] || themes.modern;
};
