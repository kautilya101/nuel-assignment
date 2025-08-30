export const DateRangeChips = ({ dateRange, setDateRange }) => (
  <div className="flex space-x-2">
    {['7d', '14d', '30d'].map((range) => (
      <button
        key={range}
        onClick={() => setDateRange(range)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          dateRange === range
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {range}
      </button>
    ))}
  </div>
);

