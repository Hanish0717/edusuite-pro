import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRole } from "@/context/role-context";
import {
  FACULTY_DASHBOARD_DATA_BY_DEPT,
  type FacultyProfileData,
  type FacultyDashboardData,
} from "@/data/faculty-mock-data";

// Subcomponents imports
import { ProfileHeader } from "@/components/dashboard/faculty-profile/profile-header";
import { PersonalInfoCard } from "@/components/dashboard/faculty-profile/personal-info-card";
import { ProfessionalInfoCard } from "@/components/dashboard/faculty-profile/professional-info-card";
import { AcademicInfoCard } from "@/components/dashboard/faculty-profile/academic-info-card";
import { ResearchCard } from "@/components/dashboard/faculty-profile/research-card";
import { DocumentsGrid } from "@/components/dashboard/faculty-profile/documents-grid";
import { SkillsSection } from "@/components/dashboard/faculty-profile/skills-section";
import { StatisticsCards } from "@/components/dashboard/faculty-profile/statistics-cards";
import { ActivityTimeline } from "@/components/dashboard/faculty-profile/activity-timeline";
import { ProfileCompletion } from "@/components/dashboard/faculty-profile/profile-completion";

export const Route = createFileRoute("/faculty/profile")({
  head: () => ({
    meta: [{ title: "My Profile — EduSuite Pro" }],
  }),
  component: FacultyProfilePage,
});

function FacultyProfilePage() {
  const { profile } = useRole();
  const deptCode = profile.department || "CSE";
  
  // Retrieve mock data dynamically based on active department
  const dashboardData = (FACULTY_DASHBOARD_DATA_BY_DEPT[deptCode] || FACULTY_DASHBOARD_DATA_BY_DEPT["CSE"]) as FacultyDashboardData;
  
  // Local state to keep track of edited fields (Frontend-only simulation)
  const [activeProfileData, setActiveProfileData] = useState<FacultyProfileData>(
    dashboardData.profileData
  );

  // Sync profile data if department changes
  useEffect(() => {
    setActiveProfileData(dashboardData.profileData);
  }, [deptCode]);

  const handleSaveProfile = (updatedData: Partial<FacultyProfileData>) => {
    setActiveProfileData((prev) => {
      const next = { ...prev };
      
      if (updatedData.personalInfo) {
        next.personalInfo = {
          ...prev.personalInfo,
          ...updatedData.personalInfo,
        };
      }
      
      // If Emergency Contact is filled in during Edit Modal, dynamically update completion score!
      if (updatedData.personalInfo?.emergencyContact && prev.profileCompletion.percentage === 92) {
        next.profileCompletion = {
          percentage: 96,
          missingFields: ["Current Profile Photo (High Resolution)"],
        };
      }

      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Profile Header with modals */}
      <ProfileHeader
        profileData={activeProfileData}
        onSaveProfile={handleSaveProfile}
      />

      {/* 2. Stats Section */}
      <StatisticsCards stats={activeProfileData.stats} />

      {/* 3. Main Grid layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column (Documentation, Activity, Skills) */}
        <div className="space-y-6 lg:col-span-1">
          <ProfileCompletion completion={activeProfileData.profileCompletion} />
          <SkillsSection skills={activeProfileData.skills} />
          <ActivityTimeline timeline={activeProfileData.activityTimeline} />
        </div>

        {/* Right column (Tabs for details cards) */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto gap-1 bg-muted p-1 rounded-2xl">
              <TabsTrigger value="personal" className="rounded-xl text-xs py-2 cursor-pointer">Personal</TabsTrigger>
              <TabsTrigger value="professional" className="rounded-xl text-xs py-2 cursor-pointer">Professional</TabsTrigger>
              <TabsTrigger value="academic" className="rounded-xl text-xs py-2 cursor-pointer">Academic</TabsTrigger>
              <TabsTrigger value="research" className="rounded-xl text-xs py-2 cursor-pointer">Research</TabsTrigger>
              <TabsTrigger value="documents" className="rounded-xl text-xs py-2 cursor-pointer sm:col-span-1 col-span-2">Documents</TabsTrigger>
            </TabsList>
            
            <div className="mt-4">
              <TabsContent value="personal" className="focus-visible:outline-none">
                <PersonalInfoCard personalInfo={activeProfileData.personalInfo} />
              </TabsContent>
              
              <TabsContent value="professional" className="focus-visible:outline-none">
                <ProfessionalInfoCard professionalInfo={activeProfileData.professionalInfo} />
              </TabsContent>
              
              <TabsContent value="academic" className="focus-visible:outline-none">
                <AcademicInfoCard academicInfo={activeProfileData.academicInfo} />
              </TabsContent>
              
              <TabsContent value="research" className="focus-visible:outline-none">
                <ResearchCard researchInfo={activeProfileData.researchPublications} />
              </TabsContent>
              
              <TabsContent value="documents" className="focus-visible:outline-none">
                <DocumentsGrid documents={activeProfileData.documents} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
