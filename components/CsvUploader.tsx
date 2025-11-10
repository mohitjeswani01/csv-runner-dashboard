'use client'
import React, { useRef, useState } from 'react'
import { parseCsv, Row } from '../lib/parseCsv'

export default function CsvUploader({ onData }: { onData: (rows: Row[]) => void }) {
    const ref = useRef<HTMLInputElement | null>(null)
    const [errors, setErrors] = useState<string[] | null>(null)
    const [loading, setLoading] = useState(false)
    const [fileName, setFileName] = useState<string | null>(null)

    async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        setErrors(null)
        const f = e.target.files?.[0]
        if (!f) return
        setFileName(f.name)
        setLoading(true)
        const res = await parseCsv(f as File)
        setLoading(false)
        if (res.errors) setErrors(res.errors)
        else if (res.rows) onData(res.rows)
    }

    return (
        <div className="p-5 border rounded-2xl shadow-sm bg-[#111111]/50 backdrop-blur-sm transition-all hover:shadow-md">
            <h2 className="text-lg font-semibold mb-2">📁 Upload your CSV file</h2>
            <p className="text-sm text-gray-400 mb-4">
                Make sure your file has the headers <code>date, person, miles run</code>.
                You can also try the <a href="/sample.csv" className="underline text-blue-400">sample.csv</a>.
            </p>

            <div
                className="border-2 border-dashed border-gray-600 rounded-lg py-10 flex flex-col items-center justify-center hover:bg-gray-800/30 transition cursor-pointer"
                onClick={() => ref.current?.click()}
            >
                <p className="text-gray-300">
                    {fileName ? (
                        <>
                            <strong>{fileName}</strong> selected
                        </>
                    ) : (
                        <>Click or drag a CSV file here</>
                    )}
                </p>
                <input
                    ref={ref}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFile}
                />
            </div>

            {loading && <div className="mt-3 text-yellow-400 text-sm">Parsing your file...</div>}
            {errors?.length ? (
                <div className="mt-3 text-red-400 text-sm">
                    <strong>Errors found:</strong>
                    <ul className="list-disc ml-5 mt-1">
                        {errors.map((e, i) => (
                            <li key={i}>{e}</li>
                        ))}
                    </ul>
                </div>
            ) : null}
        </div>
    )
}
