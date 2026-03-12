import React, { useMemo, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const MONTH_OPTIONS = [3, 6, 12];

const NICHE_PRESETS = [
  { name: "Частные детские сады", leadCost: 300, cr2: 22, cr3: 35, avgCheck: 60000 },
  { name: "Турагентства", leadCost: 200, cr2: 20, cr3: 30, avgCheck: 50000 },
  { name: "Детейлинг", leadCost: 300, cr2: 25, cr3: 40, avgCheck: 32500 },
  { name: "Ремонт квартир", leadCost: 350, cr2: 15, cr3: 25, avgCheck: 100000 },
  { name: "Фитнес-клубы", leadCost: 250, cr2: 25, cr3: 40, avgCheck: 20000 },
  { name: "Стоматологии", leadCost: 1000, cr2: 50, cr3: 25, avgCheck: 50000 },
  { name: "Лазерная эпиляция", leadCost: 500, cr2: 20, cr3: 35, avgCheck: 27500 },
  { name: "Цветочные сети", leadCost: 250, cr2: 30, cr3: 45, avgCheck: 6500 },
  { name: "Кухни премиум", leadCost: 900, cr2: 12, cr3: 20, avgCheck: 120000 },
  { name: "Медицинские клиники", leadCost: 400, cr2: 18, cr3: 30, avgCheck: 20000 },
  { name: "Недвижимость", leadCost: 600, cr2: 10, cr3: 10, avgCheck: 150000 },
  { name: "Косметология", leadCost: 400, cr2: 18, cr3: 30, avgCheck: 17500 },
  { name: "Бухгалтерские услуги", leadCost: 400, cr2: 15, cr3: 25, avgCheck: 25000 },
  { name: "Барбершопы", leadCost: 200, cr2: 30, cr3: 50, avgCheck: 3000 },
  { name: "Образовательные центры", leadCost: 700, cr2: 15, cr3: 25, avgCheck: 40000 },
  { name: "Наращивание волос", leadCost: 400, cr2: 20, cr3: 35, avgCheck: 11500 },
  { name: "Пластическая хирургия", leadCost: 1000, cr2: 8, cr3: 12, avgCheck: 200000 },
  { name: "Строительство домов", leadCost: 1300, cr2: 7, cr3: 10, avgCheck: 350000 },
  { name: "Окна и фасады", leadCost: 1200, cr2: 10, cr3: 18, avgCheck: 100000 },
  { name: "Юридические компании", leadCost: 1000, cr2: 12, cr3: 18, avgCheck: 60000 },
  { name: "Ветеринарные клиники", leadCost: 500, cr2: 20, cr3: 30, avgCheck: 6500 },
  { name: "Магазины мяса", leadCost: 1500, cr2: 8, cr3: 15, avgCheck: 2000 },
  { name: "Клиники ЭКО", leadCost: 3000, cr2: 5, cr3: 8, avgCheck: 7000 },
];

function formatMoney(value) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

function buildProjection({ months, leadsPerMonth, cr2, cr3, avgCheck, warmRate, leadCost }) {
  const rows = [];
  let warmPool = 0;

  for (let month = 1; month <= months; month++) {
    const baseBefore = warmPool;
    const dialogs = leadsPerMonth * (cr2 / 100);
    const directSales = dialogs * (cr3 / 100);
    const warmSales = warmPool * (warmRate / 100);

    const revenueDirect = directSales * avgCheck;
    const revenueWarm = warmSales * avgCheck;
    const revenue = revenueDirect + revenueWarm;
    const adSpend = leadsPerMonth * leadCost;

    const newWarm = leadsPerMonth - directSales;

    rows.push({
      month: `М${month}`,
      base: Math.round(baseBefore),
      warmBuyers: Math.round(warmSales),
      direct: Math.round(revenueDirect),
      warm: Math.round(revenueWarm),
      revenue: Math.round(revenue),
      adSpend: Math.round(adSpend),
    });

    warmPool = warmPool - warmSales + newWarm;
  }

  return rows;
}

export default function App() {
  const [selectedNiche, setSelectedNiche] = useState("custom");
  const [niche, setNiche] = useState("Своя ниша");
  const [leadCost, setLeadCost] = useState(300);
  const [cr2, setCr2] = useState(20);
  const [cr3, setCr3] = useState(30);
  const [avgCheck, setAvgCheck] = useState(30000);
  const [leadsPerMonth, setLeadsPerMonth] = useState(100);
  const [warmRate, setWarmRate] = useState(10);
  const [months, setMonths] = useState(6);

  const applyPreset = (value) => {
    setSelectedNiche(value);
    if (value === "custom") {
      setNiche("Своя ниша");
      return;
    }

    const preset = NICHE_PRESETS.find((item) => item.name === value);
    if (!preset) return;

    setNiche(preset.name);
    setLeadCost(preset.leadCost);
    setCr2(preset.cr2);
    setCr3(preset.cr3);
    setAvgCheck(preset.avgCheck);
  };

  const chartData = useMemo(
    () =>
      buildProjection({
        months,
        leadsPerMonth,
        cr2,
        cr3,
        avgCheck,
        warmRate,
        leadCost,
      }),
    [months, leadsPerMonth, cr2, cr3, avgCheck, warmRate, leadCost]
  );

  const summary = useMemo(() => {
    const totalRevenue = chartData.reduce((sum, row) => sum + row.revenue, 0);
    const totalAdSpend = chartData.reduce((sum, row) => sum + row.adSpend, 0);
    return {
      totalRevenue,
      totalAdSpend,
      profit: totalRevenue - totalAdSpend,
    };
  }, [chartData]);

  return (
    <div className="page">
      <div className="container">
        <div className="hero">
          <div className="badge">Калькулятор экономики ниши</div>
          <h1>Прогноз дохода по заявкам</h1>
          <p className="hero-text">
            Выбери нишу или задай свои показатели, чтобы увидеть прямые продажи,
            догрев базы, доход и расходы на рекламу по месяцам.
          </p>
        </div>

        <div className="layout">
          <aside className="card sidebar">
            <div className="card-head">
              <h2>Параметры ниши</h2>
              <p className="muted">Выбери нишу из списка или укажи свою вручную.</p>
            </div>

            <div className="field">
              <label>Выбор ниши</label>
              <select value={selectedNiche} onChange={(e) => applyPreset(e.target.value)}>
                <option value="custom">Своя ниша</option>
                {NICHE_PRESETS.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedNiche === "custom" && (
              <div className="field">
                <label>Название ниши</label>
                <input value={niche} onChange={(e) => setNiche(e.target.value)} />
              </div>
            )}

            <div className="field">
              <div className="field-top">
                <label>Заявки в месяц</label>
                <span>{leadsPerMonth}</span>
              </div>
              <input
                type="range"
                min="10"
                max="2000"
                step="10"
                value={leadsPerMonth}
                onChange={(e) => setLeadsPerMonth(Number(e.target.value))}
              />
            </div>

            <div className="field">
              <div className="field-top">
                <label>Стоимость заявки</label>
                <span>{formatMoney(leadCost)}</span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="50"
                value={leadCost}
                onChange={(e) => setLeadCost(Number(e.target.value))}
              />
            </div>

            <div className="field">
              <div className="field-top">
                <label>CR заявка → диалог</label>
                <span>{cr2}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                step="0.1"
                value={cr2}
                onChange={(e) => setCr2(Number(e.target.value))}
              />
            </div>

            <div className="field">
              <div className="field-top">
                <label>CR диалог → продажа</label>
                <span>{cr3}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                step="0.1"
                value={cr3}
                onChange={(e) => setCr3(Number(e.target.value))}
              />
            </div>

            <div className="field">
              <div className="field-top">
                <label>Догрев аудитории в месяц</label>
                <span>{warmRate}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={warmRate}
                onChange={(e) => setWarmRate(Number(e.target.value))}
              />
            </div>

            <div className="field">
              <div className="field-top">
                <label>Средний чек</label>
                <span>{formatMoney(avgCheck)}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="500000"
                step="1000"
                value={avgCheck}
                onChange={(e) => setAvgCheck(Number(e.target.value))}
              />
            </div>

            <div className="field">
              <label>Период</label>
              <div className="months">
                {MONTH_OPTIONS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={months === value ? "month-btn active" : "month-btn"}
                    onClick={() => setMonths(value)}
                  >
                    {value} мес
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="content">
            <div className="stats">
              <div className="card stat-card">
                <div className="muted">Выручка</div>
                <div className="big-number">{formatMoney(summary.totalRevenue)}</div>
              </div>
              <div className="card stat-card">
                <div className="muted">Расход на рекламу</div>
                <div className="big-number">{formatMoney(summary.totalAdSpend)}</div>
              </div>
              <div className="card stat-card">
                <div className="muted">Прибыль</div>
                <div className="big-number">{formatMoney(summary.profit)}</div>
              </div>
            </div>

            <section className="card">
              <div className="card-head">
                <h2>Доход по месяцам — {niche}</h2>
                <p className="muted">Прямые продажи, догрев базы, общий доход и расходы на рекламу.</p>
              </div>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatMoney(value)} />
                    <Legend />
                    <Line type="monotone" dataKey="direct" name="Прямые продажи" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="warm" name="Догрев аудитории" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="revenue" name="Общий доход" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="adSpend" name="Расходы на рекламу" stroke="#dc2626" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="card">
              <div className="card-head">
                <h2>Таблица экономики по месяцам</h2>
                <p className="muted">База на начало месяца, покупки из базы, расходы и доход.</p>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Месяц</th>
                      <th>Кол-во базы</th>
                      <th>Сколько купят с базы</th>
                      <th>Расходы за месяц</th>
                      <th>Доход за месяц</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((row) => (
                      <tr key={row.month}>
                        <td>{row.month}</td>
                        <td>{row.base}</td>
                        <td>{row.warmBuyers}</td>
                        <td>{formatMoney(row.adSpend)}</td>
                        <td>{formatMoney(row.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        </div>
      </div>

      <style>{`
* { box-sizing: border-box; }

html, body, #root {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100%;
  overflow-x: hidden;
  background: linear-gradient(135deg, #eef2ff 0%, #f8fafc 40%, #eef2ff 100%);
}

body {
  font-family: Inter, Arial, sans-serif;
  color: #0f172a;
}

button, input, select {
  font: inherit;
  color: #0f172a;
}

.page {
  min-height: 100vh;
  width: 100%;
  padding: 40px 32px;
  background: transparent;
}

.container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}

.hero {
  margin-bottom: 32px;
  text-align: center;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 10px 18px;
  border-radius: 999px;
  background: white;
  border: 1px solid #e2e8f0;
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

h1 {
  margin: 18px 0 12px;
  font-size: 48px;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: #0f172a;
}

h2 {
  margin: 0;
  font-size: 22px;
  line-height: 1.2;
  color: #0f172a;
}

.hero-text,
.muted {
  color: #64748b;
}

.hero-text {
  max-width: 820px;
  margin: 0 auto;
  font-size: 17px;
  line-height: 1.6;
  text-align: center;
}

.layout {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 28px;
  align-items: start;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 26px;
  padding: 26px;
  box-shadow: 0 14px 35px rgba(15, 23, 42, 0.06);
}

.sidebar {
  position: sticky;
  top: 20px;
}

.card-head {
  margin-bottom: 18px;
}

.field {
  margin-top: 18px;
}

.field label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #0f172a;
}

.field-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.field-top span {
  color: #475569;
  font-size: 14px;
  font-weight: 600;
}

.field input:not([type="range"]),
.field select {
  width: 100%;
  padding: 13px 14px;
  border-radius: 14px;
  border: 1px solid #cbd5e1;
  background: white;
}

.field input[type="range"] {
  width: 100%;
  accent-color: #0f172a;
}

.months {
  display: flex;
  gap: 10px;
}

.month-btn {
  border: 1px solid #cbd5e1;
  background: white;
  border-radius: 14px;
  padding: 10px 16px;
  cursor: pointer;
  color: #0f172a;
}

.month-btn.active {
  background: #0f172a;
  color: white;
  border-color: #0f172a;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.stat-card {
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.big-number {
  margin-top: 10px;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.chart-wrap {
  width: 100%;
  height: 520px;
  margin-top: 10px;
}

.table-wrap {
  overflow-x: auto;
  margin-top: 12px;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 760px;
}

th, td {
  text-align: left;
  padding: 14px 12px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
}

th {
  background: #f8fafc;
  color: #334155;
  font-weight: 700;
}

@media (max-width: 1200px) {
  .layout { grid-template-columns: 1fr; }
  .sidebar { position: static; }
}

@media (max-width: 768px) {
  .page { padding: 18px 16px; }
  h1 { font-size: 34px; }
  .stats { grid-template-columns: 1fr; }
  .card { padding: 18px; border-radius: 22px; }
  .chart-wrap { height: 380px; }
}
`}</style>
    </div>
  );
}
