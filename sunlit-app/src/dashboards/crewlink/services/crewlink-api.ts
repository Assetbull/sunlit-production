import type { CrewJob, CrewApplication, ApiResponse } from '../types/crew';

// Use strict fallback to mock mode via USE_REAL_API toggle for Scaffold compatibility
const USE_REAL_API = process.env.NEXT_PUBLIC_USE_REAL_API === 'true';

const generateCorrelationId = () => `scaffold_crew_${Math.random().toString(36).substring(7)}`;

// Artificial delay for local testing
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`/api/v1${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });
        const data = await response.json();
        
        if (!response.ok) {
            return {
                success: false,
                error: data.error || 'API Request Failed',
                correlation_id: data.correlation_id,
            };
        }
        
        return {
            success: true,
            data: data as T,
            correlation_id: data.correlation_id,
        };
    } catch (e: unknown) {
        return {
            success: false,
            error: e instanceof Error ? e.message : 'Network error',
        };
    }
}

// -------------------------------------------------------------------------------------------------
// JOBS
// -------------------------------------------------------------------------------------------------

export async function fetchAvailableJobs(): Promise<ApiResponse<CrewJob[]>> {
    if (USE_REAL_API) {
        return apiCall<{ jobs: CrewJob[] }>('/crew/jobs').then(res => ({
            ...res,
            data: res.data?.jobs
        }));
    }

    await delay();
    return {
        success: true,
        correlation_id: generateCorrelationId(),
        data: [
            {
                id: 'job-001',
                project_id: 'proj-555',
                posted_by: 'installer-1',
                title: 'Lead Solar Installer - 10kW Array',
                description: 'We need an experienced site lead for a heavy commercial install in Lagos.',
                location_state: 'Lagos',
                required_skills: ['Panel Mounting', 'Inverter Wiring', 'Team Leadership'],
                pay_rate: 65000,
                status: 'published',
                created_at: new Date(Date.now() - 86400000).toISOString(),
                updated_at: new Date(Date.now() - 86400000).toISOString(),
            },
            {
                id: 'job-002',
                project_id: 'proj-888',
                posted_by: 'installer-2',
                title: 'General Assistant (Solar)',
                description: 'Looking for 2 reliable assistants to aid in transporting and staging equipment.',
                location_state: 'Abuja',
                required_skills: ['Physical Labor', 'Reliability'],
                pay_rate: 20000,
                status: 'published',
                created_at: new Date(Date.now() - 172800000).toISOString(),
                updated_at: new Date(Date.now() - 172800000).toISOString(),
            }
        ]
    };
}

export async function fetchJobDetails(jobId: string): Promise<ApiResponse<{ job: CrewJob, applications: CrewApplication[] }>> {
    if (USE_REAL_API) {
        return apiCall<{ job: CrewJob, applications: CrewApplication[] }>(`/crew/jobs/${encodeURIComponent(jobId)}`);
    }

    await delay();
    return {
        success: true,
        correlation_id: generateCorrelationId(),
        data: {
            job: {
                id: jobId,
                project_id: 'proj-mock',
                posted_by: 'installer-mock',
                title: 'Lead Solar Installer - 10kW Array',
                description: 'We need an experienced site lead for a heavy commercial install in Lagos.',
                location_state: 'Lagos',
                required_skills: ['Panel Mounting', 'Inverter Wiring'],
                pay_rate: 65000,
                status: 'published',
                created_at: new Date(Date.now() - 86400000).toISOString(),
                updated_at: new Date().toISOString(),
            },
            applications: []
        }
    };
}

// -------------------------------------------------------------------------------------------------
// APPLICATIONS
// -------------------------------------------------------------------------------------------------

export async function submitApplication(jobId: string, coverNote: string): Promise<ApiResponse<{ application_id: string }>> {
    if (USE_REAL_API) {
        return apiCall<{ application_id: string }>(`/crew/jobs/${encodeURIComponent(jobId)}/apply`, {
            method: 'POST',
            body: JSON.stringify({ cover_note: coverNote })
        });
    }

    await delay(1200);
    // Emit the event directly to simulate backend behavior in scaffold mode
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('crew_application_submitted', { detail: { job_id: jobId }}));
    }
    
    return {
        success: true,
        correlation_id: generateCorrelationId(),
        data: { application_id: 'app-mock-success' }
    };
}

export async function fetchMyApplications(): Promise<ApiResponse<CrewApplication[]>> {
    if (USE_REAL_API) {
        return apiCall<{ applications: CrewApplication[] }>('/crew/applications').then(res => ({
            ...res,
            data: res.data?.applications
        }));
    }

    await delay();
    return {
        success: true,
        correlation_id: generateCorrelationId(),
        data: [
            {
               id: 'app-mine-1',
               job_id: 'job-001',
               applicant_id: 'crew-1',
               cover_note: 'I am highly experienced with 10kW arrays in the Lagos area.',
               status: 'pending',
               created_at: new Date().toISOString(),
               updated_at: new Date().toISOString(),
            }
        ]
    };
}
