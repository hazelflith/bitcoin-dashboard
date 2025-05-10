import React, { useMemo } from 'react';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { BitcoinData } from '../services/api.ts';
import { RSI, MACD, BollingerBands } from 'technicalindicators';

interface TechnicalAnalysisProps {
  data: BitcoinData[];
  loading: boolean;
}

const TechnicalAnalysis: React.FC<TechnicalAnalysisProps> = ({ data, loading }) => {
  const indicators = useMemo(() => {
    if (!data || !data.length) return null;

    const prices = data.map(d => d.price);
    const rsi = RSI.calculate({ values: prices, period: 14 });
    const macd = MACD.calculate({
      values: prices,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
    });
    const bb = BollingerBands.calculate({
      values: prices,
      period: 20,
      stdDev: 2,
    });

    return {
      rsi: rsi[rsi.length - 1] || 0,
      macd: macd[macd.length - 1] || { MACD: 0, signal: 0, histogram: 0 },
      bb: bb[bb.length - 1] || { upper: 0, middle: 0, lower: 0 },
    };
  }, [data]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (!indicators) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <Typography variant="body1" color="text.secondary">
          No data available
        </Typography>
      </Box>
    );
  }

  const getRSIColor = (value: number) => {
    if (value > 70) return '#f44336';
    if (value < 30) return '#4caf50';
    return '#90caf9';
  };

  const getMACDSignal = (macd: any) => {
    if (!macd || !macd.MACD || !macd.signal) return 'Neutral';
    if (macd.MACD > macd.signal) return 'Bullish';
    return 'Bearish';
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          RSI (14)
        </Typography>
        <Typography
          variant="h4"
          color={getRSIColor(indicators.rsi)}
        >
          {indicators.rsi?.toFixed(2) || '0.00'}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          MACD
        </Typography>
        <Typography variant="body1">
          Signal: {getMACDSignal(indicators.macd)}
        </Typography>
        <Typography variant="body2">
          MACD: {indicators.macd?.MACD?.toFixed(2) || '0.00'}
        </Typography>
        <Typography variant="body2">
          Signal: {indicators.macd?.signal?.toFixed(2) || '0.00'}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Bollinger Bands
        </Typography>
        <Typography variant="body2">
          Upper: ${indicators.bb?.upper?.toFixed(2) || '0.00'}
        </Typography>
        <Typography variant="body2">
          Middle: ${indicators.bb?.middle?.toFixed(2) || '0.00'}
        </Typography>
        <Typography variant="body2">
          Lower: ${indicators.bb?.lower?.toFixed(2) || '0.00'}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default TechnicalAnalysis; 