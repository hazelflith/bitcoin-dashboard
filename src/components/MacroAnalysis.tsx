import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { BitcoinData } from '../services/api.ts';
import { fetchMacroData } from '../services/api.ts';

interface MacroAnalysisProps {
  data: BitcoinData[];
  loading: boolean;
}

interface MacroData {
  fearGreedIndex: number;
  marketDominance: number;
}

const MacroAnalysis: React.FC<MacroAnalysisProps> = ({ loading }) => {
  const [macroData, setMacroData] = useState<MacroData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMacroData();
        setMacroData(data);
      } catch (error) {
        console.error('Error fetching macro data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, []);

  if (loading || !macroData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  const getFearGreedColor = (value: number) => {
    if (value >= 75) return '#f44336'; // Extreme Greed
    if (value >= 50) return '#ff9800'; // Greed
    if (value >= 25) return '#90caf9'; // Neutral
    return '#4caf50'; // Fear
  };

  const getFearGreedLabel = (value: number) => {
    if (value >= 75) return 'Extreme Greed';
    if (value >= 50) return 'Greed';
    if (value >= 25) return 'Neutral';
    return 'Fear';
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Fear & Greed Index
        </Typography>
        <Typography
          variant="h4"
          color={getFearGreedColor(macroData.fearGreedIndex)}
        >
          {macroData.fearGreedIndex}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {getFearGreedLabel(macroData.fearGreedIndex)}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Market Dominance
        </Typography>
        <Typography variant="h4" color="#90caf9">
          {macroData.marketDominance.toFixed(2)}%
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Market Analysis
        </Typography>
        <Typography variant="body2">
          {macroData.fearGreedIndex >= 75
            ? 'Market showing signs of extreme greed, potential correction ahead'
            : macroData.fearGreedIndex <= 25
            ? 'Market showing signs of extreme fear, potential buying opportunity'
            : 'Market sentiment is neutral'}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default MacroAnalysis; 