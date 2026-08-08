// CrewLink Types

export type JobStatus = 'draft' | 'published' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
export type ApplicationStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected';

export interface CrewJob {
  id: string;
  project_id: string;
  posted_by: string;
  title: string;
  description?: string;
  location_state?: string;
  required_skills?: string[];
  pay_rate?: number;
  status: JobStatus;
  created_at: string;
  updated_at: string;
}

export interface CrewApplication {
  id: string;
  job_id: string;
  applicant_id: string;
  cover_note?: string;
  status: ApplicationStatus;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  correlation_id?: string;
}
