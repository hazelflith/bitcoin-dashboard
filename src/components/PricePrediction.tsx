import React, { useState } from 'react';
import { Button, Box, Typography, Paper } from '@mui/material';
import { fetchBitcoinData, fetchMacroData } from '../services/api.ts';
import { getLLMPrediction } from '../services/openai.ts';

// Simple linear regression implementation
function linearRegression(x: number[], y: number[]) {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
  const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

const PricePrediction: React.FC = () => {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setPrediction(null);
    try {
      // Fetch historical price data
      const priceData = await fetchBitcoinData();
      // Use last 30 days for context
      const last30 = priceData.slice(-30);
      const priceSummary = last30.map((d, i) => `Day ${i + 1}: O:${d.open} H:${d.high} L:${d.low} C:${d.close}`).join('\n');

      // Fetch real macroeconomic data
      const macro = await fetchMacroData();

      // Compose the prompt
      const prompt = `Given the following Bitcoin technical and macroeconomic data, predict the exact price for the next day, next 2 weeks, and next month.\n\nRecent daily OHLC data (last 30 days):\n${priceSummary}\n\nMacroeconomic indicators:\n- Fear & Greed Index: ${macro.fearGreedIndex}\n- Market Dominance: ${macro.marketDominance}%\n\nPlease provide your reasoning and the predicted prices in USD for:\n- Next day\n- Next 2 weeks\n- Next month`;

      // Call OpenAI LLM
      const llmResponse = await getLLMPrediction(prompt);
      setPrediction(llmResponse);
    } catch (err: any) {
      setError(err.message || 'Prediction failed.');
    }
    setLoading(false);
  };

  return (
    <Paper sx={{ p: 3, mt: 3, backgroundColor: '#232323', color: '#fff' }}>
      <Typography variant="h5" gutterBottom>
        Price Prediction (Powered by GPT-4o)
      </Typography>
      <Button variant="contained" color="primary" onClick={handlePredict} disabled={loading}>
        {loading ? 'Analyzing with GPT-4o...' : 'Predict Price'}
      </Button>
      {error && (
        <Box mt={2} color="error.main">{error}</Box>
      )}
      {prediction && (
        <Box mt={3}>
          <Typography variant="subtitle1">GPT-4o Prediction & Reasoning:</Typography>
          <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{prediction}</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default PricePrediction; 