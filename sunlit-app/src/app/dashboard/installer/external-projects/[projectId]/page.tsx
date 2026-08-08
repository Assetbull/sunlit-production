'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Zap,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  DollarSign,
  User,
  Building2,
  Wallet,
  Shield,
  Users,
  Plus,
  Star,
  Award,
  TrendingUp,
  X,
} from 'lucide-react';
import { getSession } from '@/shared/session/sessionManager';
import styles from './page.module.css';

/**
 * External Project Detail Page
 * 
 * Feature: EPC Dashboard Enterprise System
 * Task: 8.4 Create milestone approval UI
 * Requirements: 5.1
 * 
 * Displays external project details and milestone management interface
 * for EPC contractors. Allows milestone approval with confirmation dialog.
 */

interface Milestone {
  id: string;
  title: string;
  amount: number;
  position: number;
  is_completed: boolean;
  is_approved: boolean;
  approved_at?: string;
  approved_by?: string;
  created_at: string;
}

interface CrewMember {
  id: string;
  name: string;
  email: string;
  skills: string[];
  availability_status: 'available' | 'busy' | 'unavailable';
  current_workload: number; // 0-100 percentage
  ratings: {
    quality: number;
    timeliness: number;
    communication: number;
  };
  hourly_rate: number;
}

interface CrewAssignment {
  id: string;
  crew_member_id: string;
  crew_member_name: string;
  milestone_assignments: string[]; // milestone IDs
  start_date?: string;
  end_date?: string;
  agreed_rate: number;
  work_status: 'assigned' | 'active' | 'completed' | 'cancelled';
  hours_logged: number;
  created_at: string;
  quality_rating?: number; // 1-5
  timeliness_rating?: number; // 1-5
  communication_rating?: number; // 1-5
  completion_notes?: string;
}

interface PerformanceMetrics {
  milestone_completions: Record<string, any>;
  aggregate_scores: {
    quality_avg: number;
    timeliness_avg: number;
    communication_avg: number;
    total_hours: number;
  };
  completion_rate: number;
  on_time_rate: number;
  total_hours: number;
}

interface ExternalProject {
  project_id: string;
  title: string;
  description?: string;
  location_state: string;
  location_city: string;
  system_size_kw?: number;
  funding_source: 'client' | 'epc_funded';
  status: string;
  project_source: 'external';
  creator_id: string;
  approval_authority: 'epc_contractor';
  created_at: string;
  milestones?: Milestone[];
  crew_assignments?: CrewAssignment[];
  crew_coordination?: {
    max_concurrent_crews: number;
    coordination_method: string;
    communication_channel: string;
  };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  planning: { label: 'Planning', color: '#F5A623', bg: 'rgba(245,166,35,0.08)', icon: Clock },
  in_progress: { label: 'In Progress', color: '#0F631B', bg: 'rgba(15,99,27,0.08)', icon: Zap },
  completed: { label: 'Completed', color: '#0F631B', bg: 'rgba(15,99,27,0.08)', icon: CheckCircle2 },
  on_hold: { label: 'On Hold', color: '#707A6C', bg: 'rgba(112,122,108,0.08)', icon: AlertCircle },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function ExternalProjectDetailPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  
  const [project, setProject] = useState<ExternalProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvingMilestone, setApprovingMilestone] = useState<string | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState<string | null>(null);
  
  // Crew assignment state
  const [availableCrews, setAvailableCrews] = useState<CrewMember[]>([]);
  const [showCrewAssignmentModal, setShowCrewAssignmentModal] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState<string | null>(null);
  const [selectedMilestones, setSelectedMilestones] = useState<string[]>([]);
  const [assignmentStartDate, setAssignmentStartDate] = useState('');
  const [assignmentEndDate, setAssignmentEndDate] = useState('');
  const [agreedRate, setAgreedRate] = useState('');
  const [assigningCrew, setAssigningCrew] = useState(false);

  // Performance tracking state
  const [showRatingModal, setShowRatingModal] = useState<string | null>(null); // assignment ID
  const [qualityRating, setQualityRating] = useState(0);
  const [timelinessRating, setTimelinessRating] = useState(0);
  const [communicationRating, setCommunicationRating] = useState(0);
  const [completionNotes, setCompletionNotes] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  // Get user session to verify EPC contractor role
  const session = getSession();
  const isEpcContractor = session?.role === 'epc_contractor';

  useEffect(() => {
    if (!isEpcContractor) {
      setError('Access denied. EPC contractor role required.');
      setLoading(false);
      return;
    }

    loadProjectDetails();
    loadAvailableCrews();
  }, [projectId, isEpcContractor]);

  async function loadProjectDetails() {
    try {
      // In a real implementation, this would fetch from the API
      // For now, using mock data that matches the external project structure
      const mockProject: ExternalProject = {
        project_id: projectId,
        title: 'Corporate Office Solar Installation',
        description: 'Large-scale commercial solar installation for corporate headquarters with battery backup system.',
        location_state: 'Lagos',
        location_city: 'Victoria Island',
        system_size_kw: 150,
        funding_source: 'epc_funded',
        status: 'in_progress',
        project_source: 'external',
        creator_id: session?.id || '',
        approval_authority: 'epc_contractor',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        crew_coordination: {
          max_concurrent_crews: 3,
          coordination_method: 'daily_standup',
          communication_channel: 'WhatsApp Group',
        },
        milestones: [
          {
            id: 'milestone-1',
            title: 'Site Assessment & Planning',
            amount: 2250000,
            position: 1,
            is_completed: true,
            is_approved: true,
            approved_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            approved_by: session?.id || '',
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'milestone-2',
            title: 'Equipment Procurement',
            amount: 6750000,
            position: 2,
            is_completed: true,
            is_approved: false,
            created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'milestone-3',
            title: 'Installation & Setup',
            amount: 4500000,
            position: 3,
            is_completed: false,
            is_approved: false,
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'milestone-4',
            title: 'Testing & Commissioning',
            amount: 1500000,
            position: 4,
            is_completed: false,
            is_approved: false,
            created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
        crew_assignments: [
          {
            id: 'assignment-1',
            crew_member_id: 'crew-1',
            crew_member_name: 'John Okafor',
            milestone_assignments: ['milestone-1', 'milestone-2'],
            start_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            agreed_rate: 15000,
            work_status: 'active',
            hours_logged: 32,
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
      };

      setProject(mockProject);
    } catch (err) {
      console.error('Error loading project details:', err);
      setError('Failed to load project details');
    } finally {
      setLoading(false);
    }
  }

  async function loadAvailableCrews() {
    try {
      // Mock crew data - in real implementation, this would fetch from API
      const mockCrews: CrewMember[] = [
        {
          id: 'crew-1',
          name: 'John Okafor',
          email: 'john.okafor@example.com',
          skills: ['Solar Installation', 'Electrical Work', 'Safety Management'],
          availability_status: 'busy',
          current_workload: 75,
          ratings: {
            quality: 4.8,
            timeliness: 4.5,
            communication: 4.9,
          },
          hourly_rate: 15000,
        },
        {
          id: 'crew-2',
          name: 'Amina Mohammed',
          email: 'amina.mohammed@example.com',
          skills: ['Solar Installation', 'Project Management', 'Quality Control'],
          availability_status: 'available',
          current_workload: 30,
          ratings: {
            quality: 5.0,
            timeliness: 4.8,
            communication: 4.7,
          },
          hourly_rate: 18000,
        },
        {
          id: 'crew-3',
          name: 'Chidi Nwosu',
          email: 'chidi.nwosu@example.com',
          skills: ['Electrical Work', 'Testing & Commissioning', 'Documentation'],
          availability_status: 'available',
          current_workload: 20,
          ratings: {
            quality: 4.6,
            timeliness: 4.9,
            communication: 4.5,
          },
          hourly_rate: 16000,
        },
        {
          id: 'crew-4',
          name: 'Fatima Bello',
          email: 'fatima.bello@example.com',
          skills: ['Solar Installation', 'Equipment Procurement', 'Logistics'],
          availability_status: 'available',
          current_workload: 40,
          ratings: {
            quality: 4.7,
            timeliness: 4.6,
            communication: 4.8,
          },
          hourly_rate: 17000,
        },
      ];

      setAvailableCrews(mockCrews);
    } catch (err) {
      console.error('Error loading available crews:', err);
    }
  }

  async function handleApproveMilestone(milestoneId: string) {
    if (!project) return;

    setApprovingMilestone(milestoneId);
    setError(null);

    try {
      const response = await fetch(`/api/v1/milestones/${milestoneId}/approve`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: project.project_id,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update milestone in local state
        setProject(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            milestones: prev.milestones?.map(m => 
              m.id === milestoneId 
                ? { 
                    ...m, 
                    is_approved: true, 
                    approved_at: new Date().toISOString(),
                    approved_by: session?.id || '',
                  }
                : m
            ),
          };
        });

        setShowApprovalDialog(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to approve milestone');
      }
    } catch (err) {
      console.error('Error approving milestone:', err);
      setError('Failed to approve milestone');
    } finally {
      setApprovingMilestone(null);
    }
  }

  function openCrewAssignmentModal() {
    setShowCrewAssignmentModal(true);
    setSelectedCrew(null);
    setSelectedMilestones([]);
    setAssignmentStartDate('');
    setAssignmentEndDate('');
    setAgreedRate('');
    setError(null);
  }

  function toggleMilestoneSelection(milestoneId: string) {
    setSelectedMilestones(prev => 
      prev.includes(milestoneId)
        ? prev.filter(id => id !== milestoneId)
        : [...prev, milestoneId]
    );
  }

  async function handleAssignCrew() {
    if (!project || !selectedCrew) return;

    // Validation
    if (selectedMilestones.length === 0) {
      setError('Please select at least one milestone');
      return;
    }

    if (!agreedRate || parseFloat(agreedRate) <= 0) {
      setError('Please enter a valid agreed rate');
      return;
    }

    setAssigningCrew(true);
    setError(null);

    try {
      // Create a mock job ID for the assignment
      const mockJobId = `job-${Date.now()}`;

      const response = await fetch('/api/v1/crew/assignments', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: mockJobId,
          crew_member_id: selectedCrew,
          project_id: project.project_id,
          agreed_rate: parseFloat(agreedRate),
          start_date: assignmentStartDate || undefined,
          end_date: assignmentEndDate || undefined,
          milestone_assignments: selectedMilestones.map(milestoneId => {
            const milestone = project.milestones?.find(m => m.id === milestoneId);
            return {
              milestone_id: milestoneId,
              milestone_name: milestone?.title || '',
              estimated_hours: 40,
              required_skills: [],
              priority: 'medium' as const,
            };
          }),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update local state with new assignment
        const crewMember = availableCrews.find(c => c.id === selectedCrew);
        if (crewMember) {
          const newAssignment: CrewAssignment = {
            id: result.assignment.id,
            crew_member_id: selectedCrew,
            crew_member_name: crewMember.name,
            milestone_assignments: selectedMilestones,
            start_date: assignmentStartDate || undefined,
            end_date: assignmentEndDate || undefined,
            agreed_rate: parseFloat(agreedRate),
            work_status: 'assigned',
            hours_logged: 0,
            created_at: new Date().toISOString(),
          };

          setProject(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              crew_assignments: [...(prev.crew_assignments || []), newAssignment],
            };
          });
        }

        setShowCrewAssignmentModal(false);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to assign crew');
      }
    } catch (err) {
      console.error('Error assigning crew:', err);
      setError('Failed to assign crew');
    } finally {
      setAssigningCrew(false);
    }
  }

  function openRatingModal(assignmentId: string) {
    setShowRatingModal(assignmentId);
    setQualityRating(0);
    setTimelinessRating(0);
    setCommunicationRating(0);
    setCompletionNotes('');
    setError(null);
  }

  async function handleSubmitRating() {
    if (!showRatingModal) return;

    // Validation
    if (qualityRating === 0 || timelinessRating === 0 || communicationRating === 0) {
      setError('Please provide all ratings (1-5 stars)');
      return;
    }

    setSubmittingRating(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/crew/assignments/${showRatingModal}/rate`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quality_rating: qualityRating,
          timeliness_rating: timelinessRating,
          communication_rating: communicationRating,
          completion_notes: completionNotes || undefined,
        }),
      });

      if (response.ok) {
        // Update local state with ratings
        setProject(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            crew_assignments: prev.crew_assignments?.map(a =>
              a.id === showRatingModal
                ? {
                    ...a,
                    quality_rating: qualityRating,
                    timeliness_rating: timelinessRating,
                    communication_rating: communicationRating,
                    completion_notes: completionNotes || a.completion_notes,
                  }
                : a
            ),
          };
        });

        setShowRatingModal(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to submit rating');
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
      setError('Failed to submit rating');
    } finally {
      setSubmittingRating(false);
    }
  }

  if (!isEpcContractor) {
    return (
      <div className={styles.page}>
        <div className={styles.errorState}>
          <AlertCircle size={48} style={{ color: '#ba1a1a' }} />
          <h3 className={styles.errorTitle}>Access Denied</h3>
          <p className={styles.errorDesc}>
            This page is only accessible to EPC contractors.
          </p>
          <Link href="/dashboard/installer" className={styles.backBtn}>
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.skeleton} style={{ height: 40, width: '35%', marginBottom: 12 }} />
        <div className={styles.skeleton} style={{ height: 20, width: '50%', marginBottom: 24 }} />
        <div className={styles.skeleton} style={{ height: 200, borderRadius: 16, marginBottom: 24 }} />
        <div className={styles.skeleton} style={{ height: 400, borderRadius: 16 }} />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className={styles.page}>
        <div className={styles.errorState}>
          <AlertCircle size={48} style={{ color: '#ba1a1a' }} />
          <h3 className={styles.errorTitle}>Error</h3>
          <p className={styles.errorDesc}>
            {error || 'Project not found'}
          </p>
          <Link href="/dashboard/installer/external-projects" className={styles.backBtn}>
            Back to External Projects
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[project.status] || STATUS_CONFIG.planning;
  const StatusIcon = statusConfig.icon;
  const totalAmount = project.milestones?.reduce((sum, m) => sum + m.amount, 0) || 0;
  const approvedAmount = project.milestones?.filter(m => m.is_approved).reduce((sum, m) => sum + m.amount, 0) || 0;

  return (
    <div className={styles.page}>
      {/* Back Navigation */}
      <Link href="/dashboard/installer/external-projects" className={styles.backLink}>
        <ArrowLeft size={16} /> Back to External Projects
      </Link>

      {/* Error Banner */}
      {error && (
        <div className={styles.errorBanner}>
          <AlertCircle size={16} />
          <span>{error}</span>
          <button onClick={() => setError(null)} className={styles.errorClose}>×</button>
        </div>
      )}

      {/* Project Header */}
      <div className={styles.projectHeader}>
        <div className={styles.projectInfo}>
          <div className={styles.projectBadges}>
            <span
              className={styles.statusBadge}
              style={{ background: statusConfig.bg, color: statusConfig.color }}
            >
              <StatusIcon size={12} />
              {statusConfig.label}
            </span>
            <span className={styles.sourceBadge}>
              <Building2 size={12} />
              External Project
            </span>
          </div>

          <h1 className={styles.projectTitle}>{project.title}</h1>
          
          {project.description && (
            <p className={styles.projectDesc}>{project.description}</p>
          )}

          <div className={styles.projectMeta}>
            <div className={styles.metaItem}>
              <MapPin size={14} />
              <span>{project.location_city}, {project.location_state}</span>
            </div>
            {project.system_size_kw && (
              <div className={styles.metaItem}>
                <Zap size={14} />
                <span>{project.system_size_kw} kW System</span>
              </div>
            )}
            <div className={styles.metaItem}>
              <Wallet size={14} />
              <span>{project.funding_source === 'epc_funded' ? 'EPC Funded' : 'Client Funded'}</span>
            </div>
            <div className={styles.metaItem}>
              <Calendar size={14} />
              <span>Created {formatDate(project.created_at)}</span>
            </div>
          </div>
        </div>

        <div className={styles.projectStats}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{formatCurrency(totalAmount)}</span>
            <span className={styles.statLabel}>Total Value</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{formatCurrency(approvedAmount)}</span>
            <span className={styles.statLabel}>Approved</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{project.milestones?.length || 0}</span>
            <span className={styles.statLabel}>Milestones</span>
          </div>
        </div>
      </div>

      {/* Milestones Section */}
      <div className={styles.milestonesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Project Milestones</h2>
          <span className={styles.sectionBadge}>
            {project.milestones?.filter(m => m.is_approved).length || 0} of {project.milestones?.length || 0} approved
          </span>
        </div>

        <div className={styles.milestonesList}>
          {project.milestones?.map((milestone) => (
            <div key={milestone.id} className={styles.milestoneCard}>
              <div className={styles.milestoneHeader}>
                <div className={styles.milestoneInfo}>
                  <div className={styles.milestonePosition}>
                    {milestone.position}
                  </div>
                  <div>
                    <h3 className={styles.milestoneTitle}>{milestone.title}</h3>
                    <p className={styles.milestoneAmount}>{formatCurrency(milestone.amount)}</p>
                  </div>
                </div>

                <div className={styles.milestoneStatus}>
                  {milestone.is_approved ? (
                    <div className={styles.statusApproved}>
                      <CheckCircle2 size={16} />
                      <span>Approved</span>
                      {milestone.approved_at && (
                        <span className={styles.statusDate}>
                          {formatDate(milestone.approved_at)}
                        </span>
                      )}
                    </div>
                  ) : milestone.is_completed ? (
                    <button
                      className={styles.approveBtn}
                      onClick={() => setShowApprovalDialog(milestone.id)}
                      disabled={approvingMilestone === milestone.id}
                    >
                      <Shield size={16} />
                      {approvingMilestone === milestone.id ? 'Approving...' : 'Approve Milestone'}
                    </button>
                  ) : (
                    <div className={styles.statusPending}>
                      <Clock size={16} />
                      <span>Pending Completion</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.milestoneProgress}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ 
                      width: milestone.is_approved ? '100%' : milestone.is_completed ? '75%' : '25%',
                      background: milestone.is_approved ? '#0F631B' : milestone.is_completed ? '#F5A623' : '#BFCABA'
                    }}
                  />
                </div>
                <span className={styles.progressLabel}>
                  {milestone.is_approved ? 'Approved & Released' : milestone.is_completed ? 'Awaiting Approval' : 'In Progress'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Crew Assignment Section */}
      <div className={styles.crewSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Crew Assignments</h2>
            {project.crew_coordination && (
              <p className={styles.sectionSubtitle}>
                Max {project.crew_coordination.max_concurrent_crews} concurrent crews • {project.crew_coordination.coordination_method.replace('_', ' ')}
              </p>
            )}
          </div>
          <button className={styles.assignCrewBtn} onClick={openCrewAssignmentModal}>
            <Plus size={16} />
            Assign Crew
          </button>
        </div>

        {/* Current Assignments */}
        {project.crew_assignments && project.crew_assignments.length > 0 ? (
          <div className={styles.crewAssignmentsList}>
            {project.crew_assignments.map((assignment) => {
              const assignedMilestones = project.milestones?.filter(m => 
                assignment.milestone_assignments.includes(m.id)
              ) || [];

              return (
                <div key={assignment.id} className={styles.crewAssignmentCard}>
                  <div className={styles.crewAssignmentHeader}>
                    <div className={styles.crewMemberInfo}>
                      <div className={styles.crewAvatar}>
                        <User size={20} />
                      </div>
                      <div>
                        <h3 className={styles.crewMemberName}>{assignment.crew_member_name}</h3>
                        <p className={styles.crewMemberRate}>{formatCurrency(assignment.agreed_rate)}/hour</p>
                      </div>
                    </div>

                    <div className={styles.crewStatusBadge} data-status={assignment.work_status}>
                      {assignment.work_status === 'assigned' && <Clock size={14} />}
                      {assignment.work_status === 'active' && <TrendingUp size={14} />}
                      {assignment.work_status === 'completed' && <CheckCircle2 size={14} />}
                      <span>{assignment.work_status}</span>
                    </div>
                  </div>

                  <div className={styles.crewAssignmentDetails}>
                    <div className={styles.crewDetailItem}>
                      <Calendar size={14} />
                      <span>
                        {assignment.start_date && assignment.end_date
                          ? `${new Date(assignment.start_date).toLocaleDateString()} - ${new Date(assignment.end_date).toLocaleDateString()}`
                          : 'No dates specified'}
                      </span>
                    </div>
                    <div className={styles.crewDetailItem}>
                      <Clock size={14} />
                      <span>{assignment.hours_logged} hours logged</span>
                    </div>
                  </div>

                  {assignedMilestones.length > 0 && (
                    <div className={styles.assignedMilestones}>
                      <span className={styles.assignedMilestonesLabel}>Assigned Milestones:</span>
                      <div className={styles.milestoneChips}>
                        {assignedMilestones.map(milestone => (
                          <span key={milestone.id} className={styles.milestoneChip}>
                            {milestone.position}. {milestone.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Users size={48} style={{ color: '#BFCABA' }} />
            <h3 className={styles.emptyStateTitle}>No Crew Assigned Yet</h3>
            <p className={styles.emptyStateDesc}>
              Assign crew members to this project to start work on milestones.
            </p>
            <button className={styles.emptyStateBtn} onClick={openCrewAssignmentModal}>
              <Plus size={16} />
              Assign First Crew
            </button>
          </div>
        )}
      </div>

      {/* Performance Dashboard Section */}
      {project.crew_assignments && project.crew_assignments.length > 0 && (
        <div className={styles.performanceSection}>
          <div className={styles.performanceHeader}>
            <h2 className={styles.sectionTitle}>Crew Performance</h2>
          </div>

          <div className={styles.performanceCards}>
            {project.crew_assignments.map((assignment) => {
              const hasRatings = assignment.quality_rating && assignment.timeliness_rating && assignment.communication_rating;
              const avgRating = hasRatings
                ? ((assignment.quality_rating! + assignment.timeliness_rating! + assignment.communication_rating!) / 3).toFixed(1)
                : 'N/A';

              const assignedMilestones = project.milestones?.filter(m =>
                assignment.milestone_assignments.includes(m.id)
              ) || [];
              const completedMilestones = assignedMilestones.filter(m => m.is_completed).length;
              const completionRate = assignedMilestones.length > 0
                ? Math.round((completedMilestones / assignedMilestones.length) * 100)
                : 0;

              return (
                <div key={assignment.id} className={styles.performanceCard}>
                  <div className={styles.performanceCardHeader}>
                    <div className={styles.performanceCrewInfo}>
                      <div className={styles.performanceCrewAvatar}>
                        <User size={20} />
                      </div>
                      <div className={styles.performanceCrewDetails}>
                        <h4>{assignment.crew_member_name}</h4>
                        <p>{formatCurrency(assignment.agreed_rate)}/hour</p>
                      </div>
                    </div>

                    {!hasRatings && assignment.work_status === 'completed' && (
                      <button
                        className={styles.rateCrewBtn}
                        onClick={() => openRatingModal(assignment.id)}
                      >
                        <Star size={14} />
                        Rate Crew
                      </button>
                    )}
                  </div>

                  <div className={styles.performanceMetrics}>
                    <div className={styles.performanceMetricItem}>
                      <span className={styles.performanceMetricLabel}>Quality</span>
                      <div className={styles.performanceMetricValue}>
                        {hasRatings ? (
                          <div className={styles.performanceStars}>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                fill={i < assignment.quality_rating! ? '#F5A623' : 'none'}
                                color={i < assignment.quality_rating! ? '#F5A623' : '#BFCABA'}
                              />
                            ))}
                          </div>
                        ) : (
                          <span style={{ color: '#BFCABA' }}>Not rated</span>
                        )}
                      </div>
                    </div>

                    <div className={styles.performanceMetricItem}>
                      <span className={styles.performanceMetricLabel}>Timeliness</span>
                      <div className={styles.performanceMetricValue}>
                        {hasRatings ? (
                          <div className={styles.performanceStars}>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                fill={i < assignment.timeliness_rating! ? '#F5A623' : 'none'}
                                color={i < assignment.timeliness_rating! ? '#F5A623' : '#BFCABA'}
                              />
                            ))}
                          </div>
                        ) : (
                          <span style={{ color: '#BFCABA' }}>Not rated</span>
                        )}
                      </div>
                    </div>

                    <div className={styles.performanceMetricItem}>
                      <span className={styles.performanceMetricLabel}>Communication</span>
                      <div className={styles.performanceMetricValue}>
                        {hasRatings ? (
                          <div className={styles.performanceStars}>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                fill={i < assignment.communication_rating! ? '#F5A623' : 'none'}
                                color={i < assignment.communication_rating! ? '#F5A623' : '#BFCABA'}
                              />
                            ))}
                          </div>
                        ) : (
                          <span style={{ color: '#BFCABA' }}>Not rated</span>
                        )}
                      </div>
                    </div>

                    <div className={styles.performanceMetricItem}>
                      <span className={styles.performanceMetricLabel}>Hours Logged</span>
                      <div className={styles.performanceMetricValue}>
                        <Clock size={16} style={{ color: '#0F631B' }} />
                        {assignment.hours_logged}h
                      </div>
                    </div>
                  </div>

                  <div className={styles.performanceProgress}>
                    <div className={styles.performanceProgressLabel}>
                      Milestone Completion
                    </div>
                    <div className={styles.performanceProgressBar}>
                      <div
                        className={styles.performanceProgressFill}
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                    <div className={styles.performanceProgressText}>
                      {completedMilestones} of {assignedMilestones.length} milestones completed ({completionRate}%)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Approval Confirmation Dialog */}
      {showApprovalDialog && (
        <div className={styles.modal} onClick={() => setShowApprovalDialog(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Approve Milestone</h2>
              <button
                className={styles.modalClose}
                onClick={() => setShowApprovalDialog(null)}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.confirmationIcon}>
                <Shield size={48} style={{ color: '#0F631B' }} />
              </div>
              
              <h3 className={styles.confirmationTitle}>
                Confirm Milestone Approval
              </h3>
              
              <p className={styles.confirmationDesc}>
                You are about to approve this milestone. This action will:
              </p>
              
              <ul className={styles.confirmationList}>
                <li>Mark the milestone as approved</li>
                <li>Trigger payment release if project is funded</li>
                <li>Create an audit trail entry</li>
                <li>Cannot be undone</li>
              </ul>

              {project.milestones?.find(m => m.id === showApprovalDialog) && (
                <div className={styles.milestonePreview}>
                  <strong>{project.milestones.find(m => m.id === showApprovalDialog)?.title}</strong>
                  <span>{formatCurrency(project.milestones.find(m => m.id === showApprovalDialog)?.amount || 0)}</span>
                </div>
              )}
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.modalBtnSecondary}
                onClick={() => setShowApprovalDialog(null)}
              >
                Cancel
              </button>
              <button
                className={styles.modalBtnPrimary}
                onClick={() => handleApproveMilestone(showApprovalDialog)}
                disabled={approvingMilestone === showApprovalDialog}
              >
                {approvingMilestone === showApprovalDialog ? 'Approving...' : 'Approve Milestone'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Crew Assignment Modal */}
      {showCrewAssignmentModal && (
        <div className={styles.modal} onClick={() => setShowCrewAssignmentModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Assign Crew to Project</h2>
              <button
                className={styles.modalClose}
                onClick={() => setShowCrewAssignmentModal(false)}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody} style={{ textAlign: 'left' }}>
              {/* Crew Selection */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Select Crew Member</label>
                <div className={styles.crewSelectionList}>
                  {availableCrews.map((crew) => (
                    <div
                      key={crew.id}
                      className={`${styles.crewSelectionCard} ${selectedCrew === crew.id ? styles.selected : ''}`}
                      onClick={() => setSelectedCrew(crew.id)}
                    >
                      <div className={styles.crewSelectionHeader}>
                        <div className={styles.crewSelectionInfo}>
                          <div className={styles.crewAvatar}>
                            <User size={16} />
                          </div>
                          <div>
                            <h4 className={styles.crewSelectionName}>{crew.name}</h4>
                            <p className={styles.crewSelectionRate}>{formatCurrency(crew.hourly_rate)}/hour</p>
                          </div>
                        </div>
                        <div className={styles.crewAvailabilityBadge} data-status={crew.availability_status}>
                          {crew.availability_status}
                        </div>
                      </div>

                      <div className={styles.crewSelectionDetails}>
                        <div className={styles.crewSkills}>
                          {crew.skills.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className={styles.skillChip}>{skill}</span>
                          ))}
                        </div>
                        <div className={styles.crewRatings}>
                          <div className={styles.ratingItem}>
                            <Star size={12} />
                            <span>{crew.ratings.quality.toFixed(1)}</span>
                          </div>
                          <div className={styles.workloadBar}>
                            <div className={styles.workloadFill} style={{ width: `${crew.current_workload}%` }} />
                          </div>
                          <span className={styles.workloadLabel}>{crew.current_workload}% capacity</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestone Selection */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Assign to Milestones</label>
                <div className={styles.milestoneCheckboxList}>
                  {project.milestones?.map((milestone) => (
                    <label key={milestone.id} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={selectedMilestones.includes(milestone.id)}
                        onChange={() => toggleMilestoneSelection(milestone.id)}
                        className={styles.checkbox}
                      />
                      <span className={styles.checkboxText}>
                        {milestone.position}. {milestone.title}
                        <span className={styles.checkboxAmount}>{formatCurrency(milestone.amount)}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Start Date (Optional)</label>
                  <input
                    type="date"
                    value={assignmentStartDate}
                    onChange={(e) => setAssignmentStartDate(e.target.value)}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>End Date (Optional)</label>
                  <input
                    type="date"
                    value={assignmentEndDate}
                    onChange={(e) => setAssignmentEndDate(e.target.value)}
                    className={styles.formInput}
                  />
                </div>
              </div>

              {/* Agreed Rate */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Agreed Hourly Rate (NGN)</label>
                <input
                  type="number"
                  value={agreedRate}
                  onChange={(e) => setAgreedRate(e.target.value)}
                  placeholder="Enter hourly rate"
                  className={styles.formInput}
                  min="0"
                  step="1000"
                />
              </div>

              {error && (
                <div className={styles.formError}>
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.modalBtnSecondary}
                onClick={() => setShowCrewAssignmentModal(false)}
              >
                Cancel
              </button>
              <button
                className={styles.modalBtnPrimary}
                onClick={handleAssignCrew}
                disabled={assigningCrew || !selectedCrew}
              >
                {assigningCrew ? 'Assigning...' : 'Assign Crew'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Performance Rating Modal */}
      {showRatingModal && (
        <div className={styles.modal} onClick={() => setShowRatingModal(null)}>
          <div className={`${styles.modalContent} ${styles.ratingModalContent}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Rate Crew Performance</h2>
              <button
                className={styles.modalClose}
                onClick={() => setShowRatingModal(null)}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody} style={{ textAlign: 'left' }}>
              {/* Quality Rating */}
              <div className={styles.ratingGroup}>
                <label className={styles.ratingLabel}>Quality of Work</label>
                <div className={styles.ratingStars}>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      className={`${styles.ratingStar} ${qualityRating >= rating ? styles.selected : ''}`}
                      onClick={() => setQualityRating(rating)}
                    >
                      <Star size={20} fill={qualityRating >= rating ? '#FFFFFF' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeliness Rating */}
              <div className={styles.ratingGroup}>
                <label className={styles.ratingLabel}>Timeliness</label>
                <div className={styles.ratingStars}>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      className={`${styles.ratingStar} ${timelinessRating >= rating ? styles.selected : ''}`}
                      onClick={() => setTimelinessRating(rating)}
                    >
                      <Star size={20} fill={timelinessRating >= rating ? '#FFFFFF' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Communication Rating */}
              <div className={styles.ratingGroup}>
                <label className={styles.ratingLabel}>Communication</label>
                <div className={styles.ratingStars}>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      className={`${styles.ratingStar} ${communicationRating >= rating ? styles.selected : ''}`}
                      onClick={() => setCommunicationRating(rating)}
                    >
                      <Star size={20} fill={communicationRating >= rating ? '#FFFFFF' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Completion Notes */}
              <div className={styles.ratingGroup}>
                <label className={styles.ratingLabel}>Completion Notes (Optional)</label>
                <textarea
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  placeholder="Add any notes about the crew's performance..."
                  className={styles.ratingTextarea}
                  maxLength={1000}
                />
              </div>

              {error && (
                <div className={styles.formError}>
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.modalBtnSecondary}
                onClick={() => setShowRatingModal(null)}
              >
                Cancel
              </button>
              <button
                className={styles.modalBtnPrimary}
                onClick={handleSubmitRating}
                disabled={submittingRating || qualityRating === 0 || timelinessRating === 0 || communicationRating === 0}
              >
                {submittingRating ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}