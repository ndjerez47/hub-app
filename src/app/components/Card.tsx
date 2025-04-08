interface CardProps {
  title: string;
  value: string;
  color?: string;
}

export const Card: React.FC<CardProps> = ({ title, value, color = "bg-white" }) => {
  return (
    <div className={`${color} rounded-lg shadow p-6`}>
      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-semibold mt-2">{value}</p>
    </div>
  );
};