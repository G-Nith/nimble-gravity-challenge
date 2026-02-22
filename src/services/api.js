const BASE_URL = ''

export const getCandidateByEmail = async (email) => {
    const res = await fetch(`${BASE_URL}/api/candidate/get-by-email?email=${EMAIL}`)
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || `Error ${res.status}: Unable to fetch candidate`)
    }
    return res.json()
}

export const getJobsList = async () => {
    const res = await fetch(`${BASE_URL}/api/jobs/get-list`)
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || `Error ${res.status}: Unable to fetch job list`)
    }
    return res.json()
}

export const applyToJob = async ({ uuid, candidateId, jobId, repoUrl }) => {
    const res = await fetch(`${BASE_URL}/api/candidate/apply-to-job`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            uuid,
            candidateId,
            jobId,
            repoUrl,
        }),
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || `Error ${res.status}: Unable to apply to Job`)
    }
    return res.json
}

