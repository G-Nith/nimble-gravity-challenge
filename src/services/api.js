const BASE_URL = 'https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net'

export const getCandidateByEmail = async (email) => {
    const res = await fetch(`${BASE_URL}/api/candidate/get-by-email?email=${encodeURIComponent(email)}`)
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || `Error ${res.status}: Unable to fetch candidate`)
    }
    const data = await res.json()
    console.log(data)

    return data
}

export const getJobsList = async () => {
    const res = await fetch(`${BASE_URL}/api/jobs/get-list`)
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || `Error ${res.status}: Unable to fetch job list`)
    }
    const data = await res.json()
    console.log(data)

    return data
}

export const applyToJob = async ({ uuid, candidateId, jobId, repoUrl, applicationId }) => {
    console.log({ uuid, candidateId, jobId, repoUrl, applicationId })
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
            applicationId,
        }),
    })

    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        console.log(err)
        throw new Error(err.message || `Error ${res.status}: Unable to apply to Job`)
    }

    const data = await res.json()
    console.log(data)

    return data
}

