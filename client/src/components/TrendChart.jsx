import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const TrendChart = ({ data, dateRange }) => (
  <div className="bg-white p-6 rounded-lg border shadow-sm">
    <h3 className="text-lg font-semibold text-gray-900 mb-6">Stock vs Demand Trend ({dateRange})</h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="day" 
          stroke="#6b7280"
          fontSize={12}
        />
        <YAxis 
          stroke="#6b7280"
          fontSize={12}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="stock" 
          stroke="#3b82f6" 
          strokeWidth={2}
          name="Stock"
          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
        />
        <Line 
          type="monotone" 
          dataKey="demand" 
          stroke="#10b981" 
          strokeWidth={2}
          name="Demand"
          dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);