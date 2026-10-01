'use client';
import { useId, useState } from 'react';
import { scaleLinear } from 'd3-scale';
import { line, area } from 'd3-shape';
import type { EarthEvent, Forecast } from '@/data/types';
import { daysBetween, formatValue } from '@/lib/forecast';
export function TrajectoryChart({
  event,
  result,
  showForecast = true,
  selected = 3,
}: {
  event: EarthEvent;
  result: Forecast;
  showForecast?: boolean;
  selected?: number;
}) {
  const id = useId().replaceAll(':', ''),
    [table, setTable] = useState(false);
  const last = event.observations.at(-1)!;
  const hist = event.observations.map((o) => ({
    day: daysBetween(last.date, o.date),
    value: o.value,
  }));
  const future = showForecast ? result.points : [];
  const extent = [...hist.map((o) => o.value), ...future.flatMap((o) => [o.lower, o.upper])];
  const low = Math.min(...extent),
    high = Math.max(...extent),
    pad = Math.max((high - low) * 0.15, 1);
  const x = scaleLinear()
    .domain([-36, showForecast ? Math.max(result.points.at(-1)!.day, 30) : 2])
    .range([52, 720]);
  const y = scaleLinear()
    .domain([low - pad, high + pad])
    .nice()
    .range([224, 22]);
  const path = line<{ day: number; value: number }>()
    .x((p) => x(p.day))
    .y((p) => y(p.value));
  const band = area<{ day: number; lower: number; upper: number }>()
    .x((p) => x(p.day))
    .y0((p) => y(p.lower))
    .y1((p) => y(p.upper));
  return (
    <div className="trajectory">
      <div className="chart-legend">
        <span>
          <i className="legend-line observed-line" />
          History · illustrative
        </span>
        {showForecast && (
          <>
            <span>
              <i className="legend-line forecast-line" />
              TerraCast
            </span>
            <span>
              <i className="legend-band" />
              Sensitivity envelope
            </span>
          </>
        )}
        <button className="text-button" onClick={() => setTable(!table)} aria-expanded={table}>
          {table ? 'Hide' : 'View'} data table
        </button>
      </div>
      <svg viewBox="0 0 750 265" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <title
          id={`${id}-title`}
        >{`${event.variable} history and ${showForecast ? 'forecast scenario' : 'observations'}`}</title>
        <desc
          id={`${id}-desc`}
        >{`Four illustrative observations from ${event.observations[0].date} to ${last.date}. Latest value ${last.value} ${event.unit}. ${showForecast ? `Projected endpoint ${formatValue(result.points.at(-1)!.value)} ${event.unit}. Shading is an uncalibrated sensitivity envelope.` : ''}`}</desc>
        {y.ticks(5).map((t) => (
          <g key={t}>
            <line x1="52" x2="720" y1={y(t)} y2={y(t)} stroke="#e4e8e0" />
            <text x="40" y={y(t) + 4} textAnchor="end">
              {formatValue(t, 0)}
            </text>
          </g>
        ))}
        <text x="10" y="14">
          {event.unit}
        </text>
        {showForecast && (
          <>
            <path d={band(future) || ''} fill="#e5d9f5" opacity=".85" />
            <line x1={x(0)} x2={x(0)} y1="15" y2="224" stroke="#939b95" strokeDasharray="3 4" />
            <text x={x(0) + 8} y="14">
              DEMO NOW
            </text>
            <path
              d={path(future) || ''}
              fill="none"
              stroke="#7950af"
              strokeWidth="2.5"
              strokeDasharray="7 5"
            />
          </>
        )}
        <path d={path(hist) || ''} fill="none" stroke="#3263ba" strokeWidth="2.5" />
        {hist.map((p, i) => (
          <g key={p.day}>
            <circle
              cx={x(p.day)}
              cy={y(p.value)}
              r={selected === i ? 6 : 4}
              fill="#3263ba"
              stroke="white"
              strokeWidth="2"
            />
            <text x={x(p.day)} y="248" textAnchor="middle">
              {event.observations[i].date.slice(5)}
            </text>
          </g>
        ))}
        {showForecast &&
          [30, 60, 90]
            .filter((n) => n <= result.points.at(-1)!.day)
            .map((n) => (
              <text key={n} x={x(n)} y="248" textAnchor="middle">
                +{n}D
              </text>
            ))}
      </svg>
      {table && (
        <div className="table-scroll">
          <table>
            <caption>{event.variable} • all values illustrative</caption>
            <thead>
              <tr>
                <th>Date / horizon</th>
                <th>Evidence</th>
                <th>Value ({event.unit})</th>
                <th>Sensitivity range</th>
              </tr>
            </thead>
            <tbody>
              {event.observations.map((o) => (
                <tr key={o.date}>
                  <td>{o.date}</td>
                  <td>Observation fixture</td>
                  <td>{formatValue(o.value)}</td>
                  <td>±{o.error} (assumed error)</td>
                </tr>
              ))}
              {future
                .filter((p) => p.day > 0 && p.day % 30 === 0)
                .map((p) => (
                  <tr key={p.day}>
                    <td>+{p.day} days</td>
                    <td>Forecast</td>
                    <td>{formatValue(p.value)}</td>
                    <td>
                      {formatValue(p.lower)} to {formatValue(p.upper)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
