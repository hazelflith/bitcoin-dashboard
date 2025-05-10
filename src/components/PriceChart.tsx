import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Box, CircularProgress } from '@mui/material';
import { format } from 'date-fns';
import { BitcoinData } from '../services/api';

interface PriceChartProps {
  data: BitcoinData[];
  loading: boolean;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  const formattedData = data.map((item) => ({
    ...item,
    date: format(new Date(item.timestamp), 'MMM dd HH:mm'),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#fff' }}
          tickLine={{ stroke: '#fff' }}
        />
        <YAxis
          tick={{ fill: '#fff' }}
          tickLine={{ stroke: '#fff' }}
          domain={['auto', 'auto']}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e1e1e',
            border: '1px solid #333',
            color: '#fff',
          }}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#90caf9"
          strokeWidth={2}
          dot={false}
          name="Price (USD)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PriceChart; 