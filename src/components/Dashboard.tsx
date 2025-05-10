import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import PriceChart from './PriceChart.tsx';
import TechnicalAnalysis from './TechnicalAnalysis.tsx';
import MacroAnalysis from './MacroAnalysis.tsx';
import PricePredictions from './PricePredictions.tsx';
import { fetchBitcoinData } from '../services/api.ts';

const Dashboard: React.FC = () => {
  const [priceData, setPriceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchBitcoinData();
        setPriceData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <Grid container spacing={3}>
      {/* Price Chart Section */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3, height: '400px' }}>
          <Typography variant="h2" gutterBottom>
            Bitcoin Price
          </Typography>
          <PriceChart data={priceData} loading={loading} />
        </Paper>
      </Grid>

      {/* Technical Analysis Section */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: '400px' }}>
          <Typography variant="h2" gutterBottom>
            Technical Analysis
          </Typography>
          <TechnicalAnalysis data={priceData} loading={loading} />
        </Paper>
      </Grid>

      {/* Macro Analysis Section */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: '400px' }}>
          <Typography variant="h2" gutterBottom>
            Macro Analysis
          </Typography>
          <MacroAnalysis data={priceData} loading={loading} />
        </Paper>
      </Grid>

      {/* Price Predictions Section */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3, height: '400px' }}>
          <Typography variant="h2" gutterBottom>
            Price Predictions
          </Typography>
          <PricePredictions data={priceData} loading={loading} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard; 