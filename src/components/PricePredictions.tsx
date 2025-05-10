import React, { useMemo } from 'react';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { BitcoinData } from '../services/api';
import { RSI, MACD } from 'technicalindicators';

interface PricePredictionsProps {
  data: BitcoinData[];
  loading: boolean;
}

const PricePredictions: React.FC<PricePredictionsProps> = ({ data, loading }) => {
  const predictions = useMemo(() => {
    if (!data.length) return null;

    const prices = data.map(d => d.price);
    const rsi = RSI.calculate({ values: prices, period: 14 });
    const macd = MACD.calculate({
      values: prices,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
    });

    const currentPrice = prices[prices.length - 1];
    const currentRSI = rsi[rsi.length - 1];
    const currentMACD = macd[macd.length - 1];

    // Simple prediction model based on technical indicators
    const shortTermPrediction = calculateShortTermPrediction(currentPrice, currentRSI, currentMACD);
    const midTermPrediction = calculateMidTermPrediction(currentPrice, currentRSI, currentMACD);
    const longTermPrediction = calculateLongTermPrediction(currentPrice, currentRSI, currentMACD);

    return {
      shortTerm: shortTermPrediction,
      midTerm: midTermPrediction,
      longTerm: longTermPrediction,
    };
  }, [data]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (!predictions) return null;

  const getPredictionColor = (prediction: number) => {
    if (prediction > 0) return '#4caf50';
    return '#f44336';
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Typography variant="h6" gutterBottom>
          Short Term (24h)
        </Typography>
        <Typography
          variant="h4"
          color={getPredictionColor(predictions.shortTerm)}
        >
          {predictions.shortTerm > 0 ? '+' : ''}
          {predictions.shortTerm.toFixed(2)}%
        </Typography>
      </Grid>

      <Grid item xs={12} md={4}>
        <Typography variant="h6" gutterBottom>
          Mid Term (7d)
        </Typography>
        <Typography
          variant="h4"
          color={getPredictionColor(predictions.midTerm)}
        >
          {predictions.midTerm > 0 ? '+' : ''}
          {predictions.midTerm.toFixed(2)}%
        </Typography>
      </Grid>

      <Grid item xs={12} md={4}>
        <Typography variant="h6" gutterBottom>
          Long Term (30d)
        </Typography>
        <Typography
          variant="h4"
          color={getPredictionColor(predictions.longTerm)}
        >
          {predictions.longTerm > 0 ? '+' : ''}
          {predictions.longTerm.toFixed(2)}%
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="body2" color="text.secondary">
          Note: These predictions are based on technical analysis and should not be considered as financial advice.
          Always do your own research before making investment decisions.
        </Typography>
      </Grid>
    </Grid>
  );
};

// Simple prediction functions based on technical indicators
const calculateShortTermPrediction = (price: number, rsi: number, macd: any): number => {
  let prediction = 0;
  
  // RSI-based prediction
  if (rsi < 30) prediction += 2;
  else if (rsi > 70) prediction -= 2;
  
  // MACD-based prediction
  if (macd.MACD > macd.signal) prediction += 1;
  else prediction -= 1;
  
  return prediction;
};

const calculateMidTermPrediction = (price: number, rsi: number, macd: any): number => {
  return calculateShortTermPrediction(price, rsi, macd) * 2;
};

const calculateLongTermPrediction = (price: number, rsi: number, macd: any): number => {
  return calculateShortTermPrediction(price, rsi, macd) * 3;
};

export default PricePredictions; 