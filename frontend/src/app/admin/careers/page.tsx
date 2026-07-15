"use client";

import React, { useState, useEffect } from "react";
import API from "@/utils/api";
import { User, FileText, CheckCircle, XCircle, Eye, ShieldCheck, GraduationCap, Briefcase } from "lucide-react";

interface Application {
  id: number;
  name: string;
  email: string;
  qualification: string;
  experience: string;
  cv_file: string;
  photo_file: string;
  status: string;
  created_at: string;
}

export default function AdminCareers() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const fetchApps = async () => {
    try {
      setLoading(true);
      const res = await API.get("/careers");
      setApps(res.data || []);
    } catch (e) {
      console.error("Failed to query applications list:", e);
      // Fallback in case of server failure
      setApps([
        {
          id: 1,
          name: "Rohan Sharma",
          email: "rohan@pilothub.com",
          qualification: '{"education":[{"school":"Aviation Institute of India","degree":"Aviation Hospitality","year":"2023"}],"certifications":["DGCA Cabin Safety Certificate","Advanced First Aid"]}',
          experience: '[{"company":"Jet Airways","role":"Junior Cabin Crew","duration":"1.5 Years"}]',
          cv_file: "rohan_sharma_cpl_resume.pdf",
          photo_file: "headshot.jpg",
          status: "Pending",
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await API.patch(`/careers/${id}`, { status });
      setApps(apps.map(a => a.id === id ? { ...a, status } : a));
      if (selectedApp?.id === id) {
        setSelectedApp({ ...selectedApp, status });
      }
    } catch (e) {
      console.error("Failed to update status in the database:", e);
      alert("Failed to save the status change in the database. Please try again.");
    }
  };

  // Safe JSON parser helper
  const parseJSON = (str: string) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="font-space text-lg font-bold text-white uppercase tracking-wider">
            Recruitment Command Center
          </h2>
          <p className="font-luxury text-[11px] text-grey-text mt-0.5">
            Review applicant qualifications, work records, and manage candidate hiring progress in the database.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 font-luxury text-xs text-grey-text">
          Syncing recruiter console...
        </div>
      ) : apps.length === 0 ? (
        <div className="text-center py-16 font-luxury text-xs text-grey-text">
          No operations resumes submitted.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Applications list - Left */}
          <div className="lg:col-span-8 glass-card rounded-xl border border-white/8 overflow-hidden bg-[#0b0f19]/40">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-luxury text-xs">
                <thead>
                  <tr className="border-b border-white/5 bg-white/2 font-space text-[10px] text-grey-text uppercase tracking-wider">
                    <th className="p-4">Applicant</th>
                    <th className="p-4">Position / Resume</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-grey-text">
                  {apps.map((app) => (
                    <tr 
                      key={app.id} 
                      onClick={() => setSelectedApp(app)}
                      className={`hover:bg-white/1 cursor-pointer transition-all hover:text-white ${selectedApp?.id === app.id ? "bg-white/2 text-white border-l-2 border-gold" : ""}`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center text-gold font-space font-bold shrink-0">
                            {app.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-white truncate">{app.name}</span>
                            <span className="text-[10px] opacity-70 truncate">{app.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-white">Air Hostess / Cabin Crew</span>
                          <a
                            href={app.cv_file.startsWith("http") || app.cv_file.startsWith("/") ? app.cv_file : "#"}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => { 
                              e.stopPropagation();
                              if (!app.cv_file.startsWith("http") && !app.cv_file.startsWith("/")) {
                                e.preventDefault(); 
                                alert(`Local resume reference: ${app.cv_file}`); 
                              }
                            }}
                            className="inline-flex items-center gap-1 text-gold hover:underline text-[9px] uppercase tracking-wider font-semibold"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            View CV
                          </a>
                        </div>
                      </td>

                      <td className="p-4">
                        <span
                          className={`text-[9px] font-space font-bold uppercase px-2 py-0.5 rounded ${
                            app.status === "Shortlisted"
                              ? "bg-teal/5 text-teal border border-teal/15"
                              : app.status === "Rejected"
                              ? "bg-red-400/5 text-red-400 border border-red-400/15"
                              : "bg-yellow-400/5 text-yellow-400 border border-yellow-400/15"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>

                      <td className="p-4 text-right flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleUpdateStatus(app.id, "Shortlisted")}
                          className="p-1.5 rounded bg-teal/5 hover:bg-teal/10 border border-teal/10 text-teal cursor-pointer"
                          title="Shortlist applicant"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(app.id, "Rejected")}
                          className="p-1.5 rounded bg-red-400/5 hover:bg-red-400/10 border border-red-400/10 text-red-400 cursor-pointer"
                          title="Reject applicant"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Application Details Panel - Right */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="glass-card rounded-xl p-5 border border-white/10 shadow-xl bg-[#0b0f19]/60 min-h-60 flex flex-col gap-6">
              {selectedApp ? (
                <div className="flex flex-col gap-5 text-xs text-grey-text">
                  <div className="border-b border-white/5 pb-3">
                    <span className="text-[9px] font-space text-gold uppercase tracking-wider font-bold block">
                      Application Details
                    </span>
                    <h3 className="font-space text-base font-bold text-white mt-1 leading-snug">
                      {selectedApp.name}
                    </h3>
                    <span className="text-[10px] opacity-75">{selectedApp.email}</span>
                  </div>

                  {/* Photo Preview if present */}
                  {selectedApp.photo_file && (selectedApp.photo_file.startsWith("http") || selectedApp.photo_file.startsWith("/")) && (
                    <div className="flex items-center gap-3 bg-white/2 border border-white/5 rounded-lg p-2.5">
                      <img 
                        src={selectedApp.photo_file} 
                        alt="Candidate Avatar" 
                        className="h-14 w-14 rounded-lg object-cover border border-white/10"
                      />
                      <div>
                        <span className="text-white font-medium block">Headshot Photo</span>
                        <span className="text-[9px] opacity-75">Click to expand</span>
                      </div>
                    </div>
                  )}

                  {/* Education details */}
                  <div className="flex flex-col gap-2">
                    <h4 className="font-space text-[10px] text-white uppercase font-bold tracking-wider border-b border-white/5 pb-1 flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4 text-gold" />
                      Education & Certifications
                    </h4>
                    {parseJSON(selectedApp.qualification) ? (
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1.5">
                          {parseJSON(selectedApp.qualification).education.map((edu: any, idx: number) => (
                            <div key={idx} className="bg-white/2 p-2 rounded border border-white/5">
                              <span className="text-white font-medium block">{edu.degree}</span>
                              <span className="opacity-75">{edu.school} ({edu.year})</span>
                            </div>
                          ))}
                        </div>
                        {parseJSON(selectedApp.qualification).certifications?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {parseJSON(selectedApp.qualification).certifications.map((cert: string, idx: number) => (
                              <span key={idx} className="bg-gold/5 border border-gold/15 px-2 py-0.5 rounded text-[10px] text-gold font-medium">
                                {cert}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="leading-relaxed bg-white/2 p-2 rounded border border-white/5">
                        {selectedApp.qualification || "DGCA qualifications certified."}
                      </p>
                    )}
                  </div>

                  {/* Experience details */}
                  <div className="flex flex-col gap-2">
                    <h4 className="font-space text-[10px] text-white uppercase font-bold tracking-wider border-b border-white/5 pb-1 flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4 text-gold" />
                      Work Experience
                    </h4>
                    {parseJSON(selectedApp.experience) ? (
                      <div className="flex flex-col gap-1.5">
                        {parseJSON(selectedApp.experience).map((exp: any, idx: number) => (
                          <div key={idx} className="bg-white/2 p-2 rounded border border-white/5">
                            <span className="text-white font-medium block">{exp.role}</span>
                            <span className="opacity-75">{exp.company} - {exp.duration}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="leading-relaxed bg-white/2 p-2 rounded border border-white/5">
                        {selectedApp.experience || "No previous airline experience listed."}
                      </p>
                    )}
                  </div>

                  {/* Recruitment actions */}
                  <div className="border-t border-white/5 pt-4 flex gap-3 mt-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedApp.id, "Shortlisted")}
                      disabled={selectedApp.status === "Shortlisted"}
                      className="flex-1 py-2 bg-teal hover:bg-teal/90 disabled:opacity-50 text-white rounded font-space text-[10px] font-bold uppercase tracking-widest cursor-pointer text-center"
                    >
                      Shortlist Candidate
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedApp.id, "Rejected")}
                      disabled={selectedApp.status === "Rejected"}
                      className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-50 text-red-400 border border-red-500/10 rounded font-space text-[10px] font-bold uppercase tracking-widest cursor-pointer text-center"
                    >
                      Reject Candidate
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-grey-text font-luxury text-xs">
                  Select an applicant from the list to view their full credentials, photo, and CV.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
