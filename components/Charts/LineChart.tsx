'use client'
import React from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
    Legend,
} from 'recharts'
import { Row } from '../../lib/parseCsv'

export function OverallLine({ rows }: { rows: Row[] }) {
    const byDate: Record<string, { total: number; count: number }> = {}

    rows.forEach((r) => {
        if (!byDate[r.date]) byDate[r.date] = { total: 0, count: 0 }
        byDate[r.date].total += r.miles
        byDate[r.date].count += 1
    })

    const data = Object.entries(byDate)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, v]) => ({
            date,
            avg: +(v.total / v.count).toFixed(2),
        }))

    return (
        <div className="p-4">
            <h4 className="font-semibold">Avg miles by date</h4>
            <LineChart width={700} height={250} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="avg" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
        </div>
    )
}

export function PerPersonBar({ rows }: { rows: Row[] }) {
    const byPerson: Record<string, { total: number; count: number }> = {}

    rows.forEach((r) => {
        if (!byPerson[r.person]) byPerson[r.person] = { total: 0, count: 0 }
        byPerson[r.person].total += r.miles
        byPerson[r.person].count += 1
    })

    const data = Object.entries(byPerson).map(([person, v]) => ({
        person,
        avg: +(v.total / v.count).toFixed(2),
    }))

    return (
        <div className="p-4">
            <h4 className="font-semibold">Average miles per person</h4>
            <BarChart width={700} height={250} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="person" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="avg" fill="#82ca9d" />
            </BarChart>
        </div>
    )
}
