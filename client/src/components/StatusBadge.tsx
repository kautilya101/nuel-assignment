export const StatusBadge = ({ status }) => {
  const statusConfig = {
    Healthy: { color: 'bg-green-100 text-green-800' },
    Low: { color: 'bg-yellow-100 text-yellow-800' },
    Critical: { color: 'bg-red-100 text-red-800' }
  };
  
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {status}
    </span>
  );
};