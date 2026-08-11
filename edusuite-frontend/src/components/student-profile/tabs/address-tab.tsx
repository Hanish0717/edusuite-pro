import React from "react";
import { StudentProfileData } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Home, Building, ExternalLink, Globe } from "lucide-react";

interface AddressTabProps {
  student: StudentProfileData;
}

export function AddressTab({ student }: AddressTabProps) {
  const perm = student.address.permanent;
  const curr = student.address.current;
  const maps = student.address.googleMaps;

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" /> Registered Student Addresses
          </h3>
          <p className="text-xs text-slate-500">Verified residential & campus hostel locations</p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => window.open(`https://maps.google.com/?q=${maps.latitude},${maps.longitude}`, "_blank")}
          className="rounded-xl text-xs gap-1.5 border-slate-200 dark:border-slate-700"
        >
          <ExternalLink className="h-3.5 w-3.5 text-blue-600" /> Open in Google Maps
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PERMANENT ADDRESS */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-600" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Permanent Address</h4>
            </div>
            <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]">
              Home Residence
            </Badge>
          </div>

          <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <p className="font-semibold text-sm">{perm.street}</p>
            <p>{perm.city}, {perm.state} &ndash; <span className="font-mono font-bold text-blue-600">{perm.pincode}</span></p>
            <p className="text-slate-500 flex items-center gap-1"><Globe className="h-3.5 w-3.5" /> {perm.country}</p>
          </div>
        </div>

        {/* CURRENT / CAMPUS ADDRESS */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-emerald-600" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Current / Hostel Address</h4>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
              Active Campus Residence
            </Badge>
          </div>

          <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <p className="font-semibold text-sm">{curr.street}</p>
            <p>{curr.city}, {curr.state} &ndash; <span className="font-mono font-bold text-emerald-600">{curr.pincode}</span></p>
            <p className="text-slate-500 flex items-center gap-1"><Globe className="h-3.5 w-3.5" /> {curr.country}</p>
          </div>
        </div>

      </div>

      {/* GOOGLE MAPS EMBEDDED LOCATION */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Navigation className="h-4 w-4 text-blue-600" /> Campus GPS Geofence & Location Tracker
          </h4>
          <span className="text-xs text-slate-500 font-mono">Lat: {maps.latitude}, Lng: {maps.longitude}</span>
        </div>

        <div className="relative h-64 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
          <iframe
            title="Student Campus Location Map"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src={maps.embedUrl}
            className="w-full h-full filter contrast-[0.95]"
          />
        </div>
      </div>

    </div>
  );
}
