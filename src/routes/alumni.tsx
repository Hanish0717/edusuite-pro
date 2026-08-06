import { createFileRoute, useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useRole } from "@/context/role-context";
import {
  AlumniTab,
  AlumniProfileItem,
  AlumniJobItem,
  MentorItem,
  AlumniEventItem,
  DonationCampaignItem,
  TopContributorItem,
  InvitationItem,
  VerificationQueueItem,
  PlacementDriveRequest,
} from "@/types/alumni";
import {
  INITIAL_ALUMNI_PROFILES,
  INITIAL_JOB_REFERRALS,
  INITIAL_MENTORS,
  INITIAL_EVENTS,
  TOP_CONTRIBUTORS,
  INITIAL_DONATION_CAMPAIGNS,
  INITIAL_INVITATIONS,
  INITIAL_VERIFICATION_QUEUE,
} from "@/data/alumniData";

import { AlumniDashboardView } from "@/pages/alumni/Dashboard/AlumniDashboardView";
import { AlumniDirectoryView } from "@/pages/alumni/Directory/AlumniDirectoryView";
import { AlumniCareerView } from "@/pages/alumni/Career/AlumniCareerView";
import { AlumniMentorshipView } from "@/pages/alumni/Mentorship/AlumniMentorshipView";
import { AlumniEventsView } from "@/pages/alumni/Events/AlumniEventsView";
import { AlumniDonationsView } from "@/pages/alumni/Donations/AlumniDonationsView";
import { AlumniAnalyticsView } from "@/pages/alumni/Analytics/AlumniAnalyticsView";
import { AlumniProfileView } from "@/pages/alumni/Profile/AlumniProfileView";
import { AlumniInvitationsView } from "@/pages/alumni/Invitations/AlumniInvitationsView";

import { AlumniPlacementCollaborationView } from "@/pages/alumni/PlacementCollaboration/AlumniPlacementCollaborationView";
import { AlumniGuestLecturesView } from "@/pages/alumni/GuestLectures/AlumniGuestLecturesView";
import { AlumniStudentNetworkingView } from "@/pages/alumni/StudentNetworking/AlumniStudentNetworkingView";
import { AlumniNewsAnnouncementsView } from "@/pages/alumni/NewsAnnouncements/AlumniNewsAnnouncementsView";

import {
  INITIAL_PLACEMENT_DRIVES,
  INITIAL_GUEST_LECTURES,
  INITIAL_STUDENT_QUESTIONS,
  INITIAL_NEWS_ARTICLES,
} from "@/data/alumniData";

import { RegisterAlumniForm } from "@/components/alumni/forms/RegisterAlumniForm";
import { PostJobForm } from "@/components/alumni/forms/PostJobForm";
import { InviteBatchmateModal } from "@/components/alumni/dialogs/InviteBatchmateModal";
import { AlumniRegistrationWizardModal } from "@/components/alumni/dialogs/AlumniRegistrationWizardModal";
import { VerificationQueueModal } from "@/components/alumni/dialogs/VerificationQueueModal";

import { AlumniMessagingCenterModal } from "@/components/alumni/dialogs/AlumniMessagingCenterModal";

import { AlumniVerificationQueueView } from "@/pages/alumni/VerificationQueue/AlumniVerificationQueueView";

export const Route = createFileRoute("/alumni")({
  head: () => ({
    meta: [{ title: "Enterprise Alumni Management Portal — EduSuite Pro" }],
  }),
  component: AlumniPage,
});

export function AlumniPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, externalPersona } = useRole();

  const isAlumniUser = role === "external-user" || externalPersona === "alumni";

  const searchObj = (location.search || {}) as Record<string, string | undefined>;
  const activeModule = (searchObj["tab"] as string) || "directory";
  const activeSubTab: string = searchObj["sub"] || "";

  // Shared State
  const [alumniList, setAlumniList] = useState<AlumniProfileItem[]>(INITIAL_ALUMNI_PROFILES);
  const [jobListings, setJobListings] = useState<AlumniJobItem[]>(INITIAL_JOB_REFERRALS);
  const [mentorsList, setMentorsList] = useState<MentorItem[]>(INITIAL_MENTORS);
  const [eventsList, setEventsList] = useState<AlumniEventItem[]>(INITIAL_EVENTS);
  const [campaignsList, setCampaignsList] = useState<DonationCampaignItem[]>(INITIAL_DONATION_CAMPAIGNS);
  const [contributorsList] = useState<TopContributorItem[]>(TOP_CONTRIBUTORS);

  // Workflow State
  const [invitationsList, setInvitationsList] = useState<InvitationItem[]>(INITIAL_INVITATIONS);
  const [verificationQueue, setVerificationQueue] = useState<VerificationQueueItem[]>(INITIAL_VERIFICATION_QUEUE);

  // Phase 2 State
  const [drivesList, setDrivesList] = useState<PlacementDriveRequest[]>(INITIAL_PLACEMENT_DRIVES);
  const [sessionsList] = useState(INITIAL_GUEST_LECTURES);
  const [questionsList] = useState(INITIAL_STUDENT_QUESTIONS);
  const [articlesList] = useState(INITIAL_NEWS_ARTICLES);

  // Global Modals State
  const [isWizardModalOpen, setIsWizardModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isVerificationQueueModalOpen, setIsVerificationQueueModalOpen] = useState(false);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isMessagingCenterOpen, setIsMessagingCenterOpen] = useState(false);

  const handleNavigateTab = (tab: string) => {
    navigate({ to: "/alumni", search: { tab } as any });
  };

  const handleSendInvitation = (newInvite: InvitationItem) => {
    setInvitationsList((prev) => [newInvite, ...prev]);
  };

  const handleAddPendingRegistration = (newQueueItem: VerificationQueueItem) => {
    setVerificationQueue((prev) => [newQueueItem, ...prev]);
  };

  const handleUpdateQueueStatus = (id: string, newStatus: VerificationQueueItem["status"]) => {
    setVerificationQueue((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
    );
  };

  const handleAddAlumni = (newAlumnus: AlumniProfileItem) => {
    setAlumniList((prev) => [newAlumnus, ...prev]);
  };

  const handleAddJob = (newJob: AlumniJobItem) => {
    setJobListings((prev) => [newJob, ...prev]);
  };

  const openPrimaryRegisterAction = () => {
    if (isAlumniUser) {
      setIsInviteModalOpen(true);
    } else {
      setIsWizardModalOpen(true);
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full space-y-6 animate-fade-up">
        {activeModule === "dashboard" && (
          <AlumniDashboardView
            onNavigateTab={handleNavigateTab}
            onOpenRegisterModal={openPrimaryRegisterAction}
            onOpenJobModal={() => setIsPostJobModalOpen(true)}
            onOpenMessagingCenter={() => setIsMessagingCenterOpen(true)}
          />
        )}

        {activeModule === "directory" && (
          <AlumniDirectoryView
            alumniList={alumniList}
            onOpenRegisterModal={openPrimaryRegisterAction}
            onOpenMessagingCenter={() => setIsMessagingCenterOpen(true)}
          />
        )}

        {activeModule === "placement-collaboration" && (
          <AlumniPlacementCollaborationView
            drivesList={drivesList}
            jobListings={jobListings}
            onUpdateDrives={setDrivesList}
            onOpenMessagingCenter={() => setIsMessagingCenterOpen(true)}
          />
        )}

        {activeModule === "career" && (
          <AlumniCareerView
            jobListings={jobListings}
            onOpenPostJobModal={() => setIsPostJobModalOpen(true)}
            subTab={activeSubTab}
          />
        )}

        {activeModule === "mentorship" && (
          <AlumniMentorshipView
            mentorsList={mentorsList}
            subTab={activeSubTab}
          />
        )}

        {activeModule === "guest-lectures" && (
          <AlumniGuestLecturesView
            sessionsList={sessionsList}
            onOpenMessagingCenter={() => setIsMessagingCenterOpen(true)}
          />
        )}

        {activeModule === "student-networking" && (
          <AlumniStudentNetworkingView
            questionsList={questionsList}
            onOpenMessagingCenter={() => setIsMessagingCenterOpen(true)}
          />
        )}

        {activeModule === "events" && (
          <AlumniEventsView
            eventsList={eventsList}
            subTab={activeSubTab}
          />
        )}

        {activeModule === "news-announcements" && (
          <AlumniNewsAnnouncementsView
            articlesList={articlesList}
            onOpenMessagingCenter={() => setIsMessagingCenterOpen(true)}
          />
        )}

        {activeModule === "invitations" && (
          <AlumniInvitationsView
            invitationsList={invitationsList}
            onOpenInviteModal={() => setIsInviteModalOpen(true)}
          />
        )}

        {activeModule === "verification-queue" && (
          <AlumniVerificationQueueView
            queue={verificationQueue}
            onUpdateStatus={handleUpdateQueueStatus}
            onOpenMessagingCenter={() => setIsMessagingCenterOpen(true)}
          />
        )}

        {activeModule === "donations" && (
          <AlumniDonationsView
            campaignsList={campaignsList}
            contributorsList={contributorsList}
          />
        )}

        {activeModule === "analytics" && <AlumniAnalyticsView />}

        {activeModule === "profile" && (
          <AlumniProfileView alumnus={(alumniList[0] || INITIAL_ALUMNI_PROFILES[0])!} />
        )}

        {/* WORKFLOW DIALOGS & MODALS */}
        <InviteBatchmateModal
          open={isInviteModalOpen}
          onOpenChange={setIsInviteModalOpen}
          onSendInvitation={handleSendInvitation}
        />

        <AlumniRegistrationWizardModal
          open={isWizardModalOpen}
          onOpenChange={setIsWizardModalOpen}
          onAddPendingRegistration={handleAddPendingRegistration}
        />

        <VerificationQueueModal
          queue={verificationQueue}
          open={isVerificationQueueModalOpen}
          onOpenChange={setIsVerificationQueueModalOpen}
          onUpdateStatus={handleUpdateQueueStatus}
        />

        <AlumniMessagingCenterModal
          open={isMessagingCenterOpen}
          onOpenChange={setIsMessagingCenterOpen}
        />

        <PostJobForm
          open={isPostJobModalOpen}
          onOpenChange={setIsPostJobModalOpen}
          onAddJob={handleAddJob}
        />
      </div>
    </DashboardLayout>
  );
}
