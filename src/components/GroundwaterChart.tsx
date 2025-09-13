import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

type ChartType = 'bar' | 'line' | 'pie';

interface GroundwaterChartProps {
  data: any[];
  chartType: ChartType;
  dataKey: string;
  nameKey?: string;
  title?: string;
}

const COLORS = ["#2563eb", "#22d3ee", "#f59e42", "#f43f5e", "#10b981", "#a21caf"];

export const GroundwaterChart = ({
  data,
  chartType,
  dataKey,
  nameKey = "name",
  title
}: GroundwaterChartProps) => {
  let chartElement: React.ReactElement | null = null;

  if (chartType === 'bar') {
    chartElement = (
      <BarChart data={data}>
        <XAxis dataKey={nameKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={dataKey} fill="#2563eb" />
      </BarChart>
    );
  } else if (chartType === 'line') {
    chartElement = (
      <LineChart data={data}>
        <XAxis dataKey={nameKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={dataKey} stroke="#2563eb" />
      </LineChart>
    );
  } else if (chartType === 'pie') {
    chartElement = (
      <PieChart>
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          outerRadius={60}
          fill="#2563eb"
          label
        >
          {data.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    );
  }

  return (
    <div className="w-full h-64 bg-card rounded-lg p-4 shadow-water my-4">
      {title && <h3 className="font-semibold mb-2">{title}</h3>}
      <ResponsiveContainer width="100%" height="90%">
        {chartElement}
      </ResponsiveContainer>
    </div>
  );
};