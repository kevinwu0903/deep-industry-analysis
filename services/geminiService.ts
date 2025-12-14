import { GoogleGenAI, Schema, Type } from "@google/genai";
import { AnalysisFormData, AnalysisResult, StockInfo, MatrixData } from "../types";

// Helper to convert File to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove Data-URL declaration (e.g., data:image/png;base64,)
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const runIndustryAnalysis = async (formData: AnalysisFormData): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Construct the prompt based on the user's specific template requirements
  const promptText = `
  基於你身為首席分析師的專業，請執行以下深度研究任務。
  
  【使用者輸入設定】
  [目標產業/技術領域]：${formData.industry}
  [關鍵技術標準/產品]：${formData.tech}
  [目標市場區域]：${formData.market}

  【任務執行】
  
  任務一：獵殺供應商 (Vendor Discovery)
  請結合聯網搜尋最新的（最近 3 - 6個月）券商報告與產業新聞。找出 ${formData.market} 在 『${formData.industry}』 領域中，真正具有 『${formData.tech}』 接單或研發能力的直接廠商。排除沾邊概念股，鎖定核心玩家。
  
  任務二：定義分析維度 (Dimension Definition)
  列出 5 個最關鍵的『分析維度 (Metrics)』。解釋為什麼選這 5 個？它們如何鑑別出公司的護城河？
  
  任務三：深度矩陣分析 (Matrix Analysis)
  利用上述 5 個維度對找出的廠商進行比較。**請同時給予每個廠商在每個維度上的評分（1-10分，10分為最優）。**
  
  任務四：犀利點評與選股 (The Verdict)
  一句犀利點評每一家公司的『優勢 vs 致命傷』。
  最後依據「股價爆發力」或「未來成長性」選出 [未來 1-2 年] 最具潛力的一家公司。

  【輸出格式要求】
  1. 請以 Markdown 格式輸出完整的分析報告。
  2. 在報告的最後，請務必提供 **唯一一個** JSON 區塊 (Markdown code block \`\`\`json)，包含所有結構化數據。JSON 結構如下：
  {
    "identifiedStocks": [
      { 
        "name": "公司名稱",
        "symbol": "股票代號 (務必符合 Yahoo Finance 格式以利即時串接，例如台股: 2330.TW, 8069.TWO; 美股: NVDA, AAPL)",
        "reason": "一句簡短的推薦/關注理由",
        "price": "搜尋到的參考股價 (若有)"
      },
      ...
    ],
    "matrixData": {
      "dimensions": ["維度1名稱", "維度2名稱", "維度3名稱", "維度4名稱", "維度5名稱"],
      "companies": [
        {
          "name": "公司A",
          "scores": [8, 9, 6, 7, 8] // 對應上述 5 個維度的 1-10 評分
        },
        ...
      ]
    }
  }

  請確保 JSON 格式正確以便程式解析，並包含所有關鍵廠商。
  `;

  const parts: any[] = [{ text: promptText }];

  // Handle Attachment
  if (formData.attachment) {
    const base64Data = await fileToBase64(formData.attachment);
    parts.push({
      inlineData: {
        mimeType: formData.attachment.type,
        data: base64Data,
      },
    });
  }

  // We use gemini-3-pro-preview for complex reasoning and search capability
  const modelId = 'gemini-3-pro-preview';

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: { parts },
      config: {
        tools: [{ googleSearch: {} }], // Enable search for "recent 3-6 months" data
      },
    });

    const fullText = response.text || "";
    
    // Extract JSON block from the response
    const jsonMatch = fullText.match(/```json\n([\s\S]*?)\n```/);
    let identifiedStocks: StockInfo[] = [];
    let matrixData: MatrixData | undefined = undefined;

    if (jsonMatch && jsonMatch[1]) {
      try {
        const parsedData = JSON.parse(jsonMatch[1]);
        if (parsedData.identifiedStocks) {
          identifiedStocks = parsedData.identifiedStocks;
        }
        if (parsedData.matrixData) {
          matrixData = parsedData.matrixData;
        }
      } catch (e) {
        console.error("Failed to parse JSON from response", e);
      }
    }

    // Clean up the markdown text (remove the JSON block to avoid duplication in UI)
    const markdownContent = fullText.replace(/```json\n[\s\S]*?\n```/, '').trim();

    return {
      markdownContent,
      identifiedStocks,
      matrixData,
    };

  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};