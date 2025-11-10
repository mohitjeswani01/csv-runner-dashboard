import Papa, { ParseResult, ParseError } from 'papaparse'

export type Row = {
    date: string
    person: string
    miles: number
}

export function validateHeaders(headers: string[]) {
    const required = ['date', 'person', 'miles run']
    const lower = headers.map((h) => h.trim().toLowerCase())
    const missing = required.filter((r) => !lower.includes(r))
    return { ok: missing.length === 0, missing }
}

export function parseCsv(file: File): Promise<{ rows?: Row[]; errors?: string[] }> {
    return new Promise((resolve) => {
        Papa.parse<Record<string, string>>(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results: ParseResult<Record<string, string>>) => {
                const raw = results.data
                const headerRow = results.meta.fields || []
                const headerCheck = validateHeaders(headerRow)
                if (!headerCheck.ok) {
                    resolve({ errors: headerCheck.missing.map((m) => `Missing header: ${m}`) })
                    return
                }

                const rows: Row[] = []
                const errors: string[] = []

                raw.forEach((r, idx) => {
                    const rowNum = idx + 2
                    try {
                        const dateStr = r[headerRow.find((h: string) => h.toLowerCase() === 'date')!]?.trim()
                        const person = r[headerRow.find((h: string) => h.toLowerCase() === 'person')!]?.trim()
                        const milesStr = r[headerRow.find((h: string) => h.toLowerCase() === 'miles run')!]?.trim()

                        if (!dateStr || !person || !milesStr) {
                            errors.push(`Row ${rowNum}: missing field`)
                            return
                        }

                        const d = new Date(dateStr)
                        if (isNaN(d.getTime())) {
                            errors.push(`Row ${rowNum}: invalid date '${dateStr}'`)
                            return
                        }

                        const miles = Number(milesStr)
                        if (isNaN(miles)) {
                            errors.push(`Row ${rowNum}: invalid miles '${milesStr}'`)
                            return
                        }

                        rows.push({
                            date: d.toISOString().slice(0, 10),
                            person,
                            miles,
                        })
                    } catch (e) {
                        errors.push(`Row ${rowNum}: parse error`)
                    }
                })

                if (errors.length) resolve({ errors })
                else resolve({ rows })
            },
            error: (err: Error) => resolve({ errors: [err.message] }),
        })
    })
}
