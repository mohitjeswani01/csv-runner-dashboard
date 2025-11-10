'use client'
import React, { useState } from 'react'
import CsvUploader from '../components/CsvUploader'
import Overview from '../components/Overview'
import { OverallLine, PerPersonBar } from '../components/Charts/LineChart'
import { Row } from '../lib/parseCsv'

export default function Page() {
  const [rows, setRows] = useState<Row[]>([])
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-gray-200 p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-white">🏃‍♂️ CSV Runner Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - uploader */}
        <div className="col-span-1">
          <CsvUploader
            onData={(r) => {
              setRows(r)
              setSelectedPerson(null)
            }}
          />
        </div>

        {/* Right column - analysis */}
        <div className="col-span-2">
          {rows.length === 0 ? (
            <div className="p-6 border border-gray-700 rounded-xl bg-gray-900/50 text-gray-400 text-center">
              Upload a CSV to begin.
              <br />Use the <a href="/sample.csv" className="underline text-blue-400">sample.csv</a> if you need.
            </div>
          ) : (
            <div>
              <Overview rows={rows} onSelectPerson={(p) => setSelectedPerson(p)} />
              <div className="mt-4">
                <OverallLine rows={rows} />
                <PerPersonBar rows={rows} />
              </div>
              {selectedPerson && (
                <div className="mt-4 p-4 border border-gray-700 rounded-xl bg-gray-800/60">
                  <h3 className="font-semibold text-lg text-white">Details for {selectedPerson}</h3>
                  <div className="text-sm mt-2 text-gray-400">(Click another name to switch view)</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
