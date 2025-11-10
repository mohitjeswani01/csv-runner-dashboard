'use client'
import React from 'react'
import { Row } from '../lib/parseCsv'

function computeMetrics(rows: Row[]) {
    const overall = {
        avg: 0,
        min: Infinity,
        max: -Infinity,
        count: 0,
        total: 0,
    }
    const byPerson: Record<string, { total: number; count: number; min: number; max: number }> = {}

    rows.forEach((r) => {
        overall.total += r.miles
        overall.count += 1
        overall.min = Math.min(overall.min, r.miles)
        overall.max = Math.max(overall.max, r.miles)

        if (!byPerson[r.person]) byPerson[r.person] = { total: 0, count: 0, min: Infinity, max: -Infinity }
        byPerson[r.person].total += r.miles
        byPerson[r.person].count += 1
        byPerson[r.person].min = Math.min(byPerson[r.person].min, r.miles)
        byPerson[r.person].max = Math.max(byPerson[r.person].max, r.miles)
    })

    overall.avg = overall.count ? +(overall.total / overall.count).toFixed(2) : 0

    const perPerson = Object.entries(byPerson).map(([person, v]) => ({
        person,
        avg: +(v.total / v.count).toFixed(2),
        min: v.min,
        max: v.max,
        count: v.count,
    }))

    return {
        overall: {
            avg: overall.avg,
            min: overall.min === Infinity ? 0 : overall.min,
            max: overall.max === -Infinity ? 0 : overall.max,
            count: overall.count,
        },
        perPerson,
    }
}

export default function Overview({ rows, onSelectPerson }: { rows: Row[]; onSelectPerson: (p: string) => void }) {
    const metrics = computeMetrics(rows)
    return (
        <div className="p-4">
            <h3 className="text-xl font-bold">Overview</h3>

            {/* Overall summary */}
            <div className="grid grid-cols-3 gap-3 mt-3">
                <div className="p-3 border rounded">
                    <div className="text-sm">Count</div>
                    <div className="text-2xl">{metrics.overall.count}</div>
                </div>
                <div className="p-3 border rounded">
                    <div className="text-sm">Avg miles</div>
                    <div className="text-2xl">{metrics.overall.avg}</div>
                </div>
                <div className="p-3 border rounded">
                    <div className="text-sm">Min / Max</div>
                    <div className="text-2xl">
                        {metrics.overall.min} / {metrics.overall.max}
                    </div>
                </div>
            </div>

            {/* Per-person summary */}
            <div className="mt-4">
                <h4 className="font-semibold">Per person</h4>
                <div className="mt-2 grid gap-2">
                    {metrics.perPerson.map((p) => (
                        <button
                            key={p.person}
                            onClick={() => onSelectPerson(p.person)}
                            className="text-left p-2 border rounded hover:bg-gray-50"
                        >
                            <div className="flex justify-between">
                                <div>
                                    {p.person}{' '}
                                    <span className="text-sm text-gray-500">({p.count})</span>
                                </div>
                                <div className="text-sm">avg {p.avg}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
