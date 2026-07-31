import React, { useEffect, useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { useAppContext } from "../context/AppContext";

const KnowledgeBase = () => {
  const { axios, token, user } = useAppContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get("/api/dashboard/usage", {
        headers: {
          Authorization: token,
        },
      });
      if (data.success) {
        setData(data);
      }
    } catch (error) {
      console.log("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // --- LOGIC SỬA LỖI BIỂU ĐỒ (AGGREGATION & SORTING) ---
  const chartData = useMemo(() => {
    if (!data?.usages) return [];

    // 1. Gom nhóm dữ liệu theo ngày
    const grouped = data.usages.reduce((acc, item) => {
      const dateObj = new Date(item.createdAt);
      // Định dạng ngày thành DD/MM để hiển thị trên trục X cho gọn
      const dateLabel = dateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
      });

      if (!acc[dateLabel]) {
        acc[dateLabel] = { 
          date: dateLabel, 
          tokens: 0, 
          latency: 0, 
          count: 0, 
          rawDate: dateObj // Giữ lại object Date để sort
        };
      }

      acc[dateLabel].tokens += item.totalTokens;
      acc[dateLabel].latency += item.latency;
      acc[dateLabel].count += 1;

      return acc;
    }, {});

    // 2. Chuyển thành mảng, tính trung bình Latency và Sắp xếp theo thời gian
    return Object.values(grouped)
      .map((item) => ({
        date: item.date,
        tokens: item.tokens,
        latency: Math.round(item.latency / item.count),
        rawDate: item.rawDate,
      }))
      .sort((a, b) => a.rawDate - b.rawDate); // Sắp xếp từ cũ đến mới chuẩn xác
  }, [data]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-2xl dark:text-white">
        Loading Dashboard...
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="flex-1 flex items-center justify-center text-3xl font-semibold dark:text-white">
        Admin Access Only
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#F5F5F7] dark:bg-transparent text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <p className="text-sm tracking-[6px] uppercase text-purple-400 dark:text-primary mb-3">
            Admin Dashboard
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold mb-4">
            AI Usage Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Monitor AI requests, token usage, performance, and activity.
          </p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 shadow-xl">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Requests</p>
            <h2 className="text-4xl font-bold mt-3">{data.totalRequests}</h2>
          </div>
          <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 shadow-xl">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Tokens</p>
            <h2 className="text-4xl font-bold mt-3">{data.totalTokens.toLocaleString()}</h2>
          </div>
          <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 shadow-xl">
            <p className="text-sm text-gray-500 dark:text-gray-400">Avg Latency</p>
            <h2 className="text-4xl font-bold mt-3">{data.avgLatency}ms</h2>
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
          {/* TOKEN USAGE (LINE CHART) */}
          <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Token Usage</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Daily total AI token consumption</p>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#A855F7' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="tokens"
                    stroke="#A855F7"
                    strokeWidth={4}
                    dot={{ r: 4, fill: '#A855F7' }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RESPONSE LATENCY (BAR CHART) */}
          <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Response Latency</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Average AI response speed per day (ms)</p>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '12px', color: '#fff' }}
                     cursor={{fill: 'rgba(124, 58, 237, 0.1)'}}
                  />
                  <Bar
                    dataKey="latency"
                    fill="#7C3AED"
                    radius={[8, 8, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;