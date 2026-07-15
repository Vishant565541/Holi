"use client";

import React, { useState } from "react";
import API from "@/utils/api";
import { 
  Sparkles, CheckCircle2, ChevronRight, ChevronLeft, Upload, 
  Trash2, Plus, Info, Scale, GraduationCap, Briefcase, FileCheck, Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Types
interface EducationEntry {
  school: string;
  degree: string;
  year: string;
}

interface ExperienceEntry {
  company: string;
  role: string;
  duration: string;
}

export default function CareersPage() {
  const [isApplying, setIsApplying] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Personal Details
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  // Step 2: Education & Certifications
  const [educationList, setEducationList] = useState<EducationEntry[]>([
    { school: "", degree: "", year: "" }
  ]);
  const [certificationsList, setCertificationsList] = useState<string[]>([""]);

  // Step 3: Work Experience
  const [experienceList, setExperienceList] = useState<ExperienceEntry[]>([
    { company: "", role: "", duration: "" }
  ]);

  // Step 4: Documents
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvBase64, setCvBase64] = useState<string>("");
  const [cvError, setCvError] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string>("");
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [photoError, setPhotoError] = useState("");

  // Reset form
  const resetForm = () => {
    setIsApplying(false);
    setCurrentStep(1);
    setUploadProgress(0);
    setIsUploading(false);
    setSuccess(false);
    setError("");
    setFullName("");
    setEmail("");
    setPhone("");
    setCoverLetter("");
    setEducationList([{ school: "", degree: "", year: "" }]);
    setCertificationsList([""]);
    setExperienceList([{ company: "", role: "", duration: "" }]);
    setCvFile(null);
    setCvBase64("");
    setCvError("");
    setPhotoFile(null);
    setPhotoBase64("");
    setPhotoPreview("");
    setPhotoError("");
  };

  // Helper: File to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // File Upload Handlers
  const handleCvChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvError("");
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setCvError("Resume size must be under 5MB.");
      return;
    }

    // Validate extension
    const allowedExtensions = /(\.pdf|\.doc|\.docx)$/i;
    if (!allowedExtensions.exec(file.name)) {
      setCvError("Only PDF, DOC, or DOCX formats allowed.");
      return;
    }

    setCvFile(file);
    try {
      const base64 = await fileToBase64(file);
      setCvBase64(base64);
    } catch (err) {
      setCvError("Failed to parse file.");
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError("");
    setPhotoPreview("");
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (< 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setPhotoError("Photo size must be under 2MB.");
      return;
    }

    // Validate image format
    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    if (!allowedExtensions.exec(file.name)) {
      setPhotoError("Only JPG or PNG images allowed.");
      return;
    }

    // Check dimensions (> 100x100px)
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      if (img.width < 100 || img.height < 100) {
        setPhotoError("Photo dimensions must be at least 100x100px.");
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(img.src);
      try {
        const base64 = await fileToBase64(file);
        setPhotoBase64(base64);
      } catch (err) {
        setPhotoError("Failed to parse image.");
      }
    };
  };

  // Education Helpers
  const addEducationRow = () => {
    setEducationList([...educationList, { school: "", degree: "", year: "" }]);
  };

  const removeEducationRow = (index: number) => {
    if (educationList.length === 1) return;
    setEducationList(educationList.filter((_, idx) => idx !== index));
  };

  const updateEducationRow = (index: number, field: keyof EducationEntry, value: string) => {
    const updated = [...educationList];
    updated[index][field] = value;
    setEducationList(updated);
  };

  // Certification Helpers
  const addCertificationRow = () => {
    setCertificationsList([...certificationsList, ""]);
  };

  const removeCertificationRow = (index: number) => {
    if (certificationsList.length === 1) return;
    setCertificationsList(certificationsList.filter((_, idx) => idx !== index));
  };

  const updateCertificationRow = (index: number, value: string) => {
    const updated = [...certificationsList];
    updated[index] = value;
    setCertificationsList(updated);
  };

  // Experience Helpers
  const addExperienceRow = () => {
    setExperienceList([...experienceList, { company: "", role: "", duration: "" }]);
  };

  const removeExperienceRow = (index: number) => {
    if (experienceList.length === 1) return;
    setExperienceList(experienceList.filter((_, idx) => idx !== index));
  };

  const updateExperienceRow = (index: number, field: keyof ExperienceEntry, value: string) => {
    const updated = [...experienceList];
    updated[index][field] = value;
    setExperienceList(updated);
  };

  // Step Validation
  const isStepValid = () => {
    if (currentStep === 1) {
      return fullName.trim() !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && phone.trim() !== "";
    }
    if (currentStep === 2) {
      const validEdu = educationList.every(e => e.school.trim() !== "" && e.degree.trim() !== "" && e.year.trim() !== "");
      const validCert = certificationsList.every(c => c.trim() !== "");
      return validEdu && validCert;
    }
    if (currentStep === 3) {
      return experienceList.every(e => e.company.trim() !== "" && e.role.trim() !== "" && e.duration.trim() !== "");
    }
    if (currentStep === 4) {
      return cvFile !== null && photoFile !== null && cvError === "" && photoError === "";
    }
    return true;
  };

  // Submit Handler
  const handleSubmit = async () => {
    setIsUploading(true);
    setError("");

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 150);

    try {
      // 1. Upload CV to Django backend file storage
      const cvUploadRes = await API.post("/storage/upload", {
        file: cvBase64,
        fileName: cvFile!.name,
        folder: "resumes"
      });
      const cvUrl = cvUploadRes.data.url;

      // 2. Upload Photo to Django backend file storage
      const photoUploadRes = await API.post("/storage/upload", {
        file: photoBase64,
        fileName: photoFile!.name,
        folder: "headshots"
      });
      const photoUrl = photoUploadRes.data.url;

      // 3. Compile full resume profile
      // Format qualifications: combine education list & certifications list into a readable qualification summary
      const formattedQualifications = JSON.stringify({
        education: educationList,
        certifications: certificationsList.filter(c => c.trim() !== "")
      });

      // Format experience: combine experience entries
      const formattedExperience = JSON.stringify(experienceList);

      // 4. Save application data to Roman Aviation Django Career API
      await API.post("/careers", {
        name: fullName,
        email: email,
        qualification: formattedQualifications,
        experience: formattedExperience,
        cv_file: cvUrl,
        photo_file: photoUrl,
        status: "Pending"
      });

      setUploadProgress(100);
      clearInterval(progressInterval);
      setTimeout(() => {
        setSuccess(true);
        setIsUploading(false);
      }, 500);

    } catch (err: any) {
      clearInterval(progressInterval);
      setIsUploading(false);
      setUploadProgress(0);
      setError(err.response?.data?.error || "An error occurred during submission. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#05070D] py-12 px-6 flex items-center justify-center relative overflow-hidden">
      {/* Premium Navy/Blue Gradient Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#0a1535]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#0d2a58]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full relative z-10">
        <AnimatePresence mode="wait">
          {!isApplying ? (
            /* SECTION 1: ROLE OVERVIEW */
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="bg-gradient-to-b from-[#0b0f19] to-[#04060b] border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl flex flex-col gap-8"
            >
              <div className="flex flex-col gap-3 text-center md:text-left">
                <div className="inline-flex self-center md:self-start items-center gap-1.5 px-3 py-1 rounded-full bg-gold/5 border border-gold/25 text-[10px] uppercase tracking-widest text-gold font-bold">
                  <Sparkles className="h-3 w-3" />
                  <span>Cabin Crew Vacancy</span>
                </div>
                <h1 className="font-space text-3xl md:text-4xl font-extrabold text-white leading-tight">
                  Air Hostess / Cabin Crew
                </h1>
                <p className="font-luxury text-sm text-gold tracking-wider uppercase font-semibold">
                  Join the Elite Crew of Roman Aviation
                </p>
              </div>

              <div className="border-t border-white/5 pt-6">
                <p className="font-luxury text-sm text-grey-text leading-relaxed text-center md:text-left">
                  As a Cabin Crew member, you represent the highest standard of hospitality and safety. You will serve premium clients onboard luxury routes and chartered flights, ensuring a luxurious, safe, and memorable journey.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                {/* Key Responsibilities */}
                <div className="flex flex-col gap-4">
                  <h3 className="font-space text-xs uppercase tracking-wider text-white font-bold flex items-center gap-2 border-b border-white/5 pb-2">
                    <GraduationCap className="h-4.5 w-4.5 text-gold" />
                    Key Responsibilities
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {[
                      "Maintain exceptional flight safety and security protocols onboard.",
                      "Deliver bespoke, premium dining and guest relations service to travelers.",
                      "Handle cabin emergencies with speed, calm, and efficiency.",
                      "Coordinate flight logistics with pilots and ground operational staff."
                    ].map((resp, i) => (
                      <li key={i} className="flex items-start gap-2.5 font-luxury text-xs text-grey-text leading-normal">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold/80 mt-1.5 shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Eligibility Criteria */}
                <div className="flex flex-col gap-4">
                  <h3 className="font-space text-xs uppercase tracking-wider text-white font-bold flex items-center gap-2 border-b border-white/5 pb-2">
                    <Scale className="h-4.5 w-4.5 text-gold" />
                    Eligibility Criteria
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {[
                      "Age: 18 to 28 years.",
                      "Height: Minimum 155 cm (Female) / 170 cm (Male).",
                      "Fluency in English & Hindi (additional languages preferred).",
                      "No visible tattoos or piercings while in uniform."
                    ].map((crit, i) => (
                      <li key={i} className="flex items-start gap-2.5 font-luxury text-xs text-grey-text leading-normal">
                        <Check className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                        <span>{crit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-center md:justify-end mt-4">
                <button
                  onClick={() => setIsApplying(true)}
                  className="px-8 py-3.5 bg-gold hover:bg-gold/90 text-black font-space text-xs font-bold uppercase tracking-widest rounded-lg transition-all glow-gold border border-gold cursor-pointer"
                >
                  Apply Now
                </button>
              </div>
            </motion.div>
          ) : success ? (
            /* SECTION 3: SUCCESS CONFIRMATION SCREEN */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-b from-[#0b0f19] to-[#04060b] border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl text-center flex flex-col items-center gap-6"
            >
              <div className="h-16 w-16 rounded-full bg-teal/10 border border-teal/30 flex items-center justify-center text-teal mb-2">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h1 className="font-space text-2xl font-bold text-white">Application Submitted!</h1>
              <p className="font-luxury text-sm text-grey-text max-w-lg leading-relaxed">
                Thank you for applying. A confirmation email has been dispatched. Our team will review your credentials and physical requirements, and if shortlisted, invite you for an interview.
              </p>
              <button
                onClick={resetForm}
                className="mt-4 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-space text-xs font-bold uppercase tracking-widest rounded-lg transition-all"
              >
                Go back to Careers
              </button>
            </motion.div>
          ) : (
            /* SECTION 2: MULTI-STEP APPLICATION FORM */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="bg-gradient-to-b from-[#0b0f19] to-[#04060b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Form Progress Header */}
              <div className="bg-white/2 border-b border-white/5 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="font-space text-sm font-bold text-white uppercase tracking-wider">Crew Application</h2>
                  <span className="text-[10px] font-luxury text-grey-text uppercase tracking-widest mt-0.5 block">
                    Step {currentStep} of 5
                  </span>
                </div>
                
                {/* Horizontal Progress Bar */}
                <div className="w-full md:w-48 bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="bg-gold h-full transition-all duration-300"
                    style={{ width: `${(currentStep / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Form Content Body */}
              <div className="p-6 md:p-8 min-h-[400px]">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-lg mb-6 text-center font-luxury">
                    {error}
                  </div>
                )}

                {/* STEP 1: Personal Details */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-5"
                  >
                    <h3 className="font-space text-xs uppercase tracking-wider text-gold font-bold border-b border-white/5 pb-2">
                      Personal Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-space text-grey-text uppercase tracking-wider">Full Name <span className="text-red-400">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="Dev Patel"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-[#03050a] border border-white/10 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 font-luxury transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-space text-grey-text uppercase tracking-wider">Email Address <span className="text-red-400">*</span></label>
                        <input
                          type="email"
                          required
                          placeholder="dev@patel.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#03050a] border border-white/10 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 font-luxury transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-space text-grey-text uppercase tracking-wider">Phone Number <span className="text-red-400">*</span></label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#03050a] border border-white/10 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 font-luxury transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-space text-grey-text uppercase tracking-wider">Cover Letter / Personal Note (Optional)</label>
                      <textarea
                        rows={4}
                        placeholder="Write a brief cover note describing your passion for high-end customer hospitality..."
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        className="w-full bg-[#03050a] border border-white/10 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 font-luxury transition-all"
                      />
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Education & Certifications */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-6"
                  >
                    {/* Education History Repeating Section */}
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <h3 className="font-space text-xs uppercase tracking-wider text-gold font-bold">
                          Education History
                        </h3>
                        <button
                          type="button"
                          onClick={addEducationRow}
                          className="flex items-center gap-1 text-[10px] font-space text-gold hover:underline"
                        >
                          <Plus className="h-3 w-3" /> Add Row
                        </button>
                      </div>
                      
                      {educationList.map((edu, idx) => (
                        <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-white/2 p-4 rounded-lg border border-white/5">
                          <div className="md:col-span-4 flex flex-col gap-2">
                            <label className="text-[9px] font-space text-grey-text uppercase">School / College</label>
                            <input
                              type="text"
                              required
                              placeholder="Delhi University"
                              value={edu.school}
                              onChange={(e) => updateEducationRow(idx, "school", e.target.value)}
                              className="w-full bg-[#03050a] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold/50 font-luxury"
                            />
                          </div>
                          <div className="md:col-span-5 flex flex-col gap-2">
                            <label className="text-[9px] font-space text-grey-text uppercase">Degree / Course</label>
                            <input
                              type="text"
                              required
                              placeholder="B.A. Hospitality Management"
                              value={edu.degree}
                              onChange={(e) => updateEducationRow(idx, "degree", e.target.value)}
                              className="w-full bg-[#03050a] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold/50 font-luxury"
                            />
                          </div>
                          <div className="md:col-span-2 flex flex-col gap-2">
                            <label className="text-[9px] font-space text-grey-text uppercase">Passing Year</label>
                            <input
                              type="text"
                              required
                              placeholder="2024"
                              value={edu.year}
                              onChange={(e) => updateEducationRow(idx, "year", e.target.value)}
                              className="w-full bg-[#03050a] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold/50 font-luxury"
                            />
                          </div>
                          <div className="md:col-span-1 flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeEducationRow(idx)}
                              disabled={educationList.length === 1}
                              className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Certifications Dynamic List */}
                    <div className="flex flex-col gap-4 mt-2">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <h3 className="font-space text-xs uppercase tracking-wider text-gold font-bold">
                          Relevant Certifications
                        </h3>
                        <button
                          type="button"
                          onClick={addCertificationRow}
                          className="flex items-center gap-1 text-[10px] font-space text-gold hover:underline"
                        >
                          <Plus className="h-3 w-3" /> Add Cert
                        </button>
                      </div>

                      {certificationsList.map((cert, idx) => (
                        <div key={idx} className="flex gap-4 items-center bg-white/2 p-3 rounded-lg border border-white/5">
                          <input
                            type="text"
                            required
                            placeholder="e.g. First Aid & Evacuation Certification"
                            value={cert}
                            onChange={(e) => updateCertificationRow(idx, e.target.value)}
                            className="w-full bg-[#03050a] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold/50 font-luxury"
                          />
                          <button
                            type="button"
                            onClick={() => removeCertificationRow(idx)}
                            disabled={certificationsList.length === 1}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Work Experience */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-6"
                  >
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <h3 className="font-space text-xs uppercase tracking-wider text-gold font-bold">
                        Work Experience History
                      </h3>
                      <button
                        type="button"
                        onClick={addExperienceRow}
                        className="flex items-center gap-1 text-[10px] font-space text-gold hover:underline"
                      >
                        <Plus className="h-3 w-3" /> Add Company
                      </button>
                    </div>

                    {experienceList.map((exp, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-white/2 p-4 rounded-lg border border-white/5">
                        <div className="md:col-span-4 flex flex-col gap-2">
                          <label className="text-[9px] font-space text-grey-text uppercase">Company Name</label>
                          <input
                            type="text"
                            required
                            placeholder="Indigo Airlines"
                            value={exp.company}
                            onChange={(e) => updateExperienceRow(idx, "company", e.target.value)}
                            className="w-full bg-[#03050a] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold/50 font-luxury"
                          />
                        </div>
                        <div className="md:col-span-5 flex flex-col gap-2">
                          <label className="text-[9px] font-space text-grey-text uppercase">Role / Designation</label>
                          <input
                            type="text"
                            required
                            placeholder="Lead Cabin Crew Hostess"
                            value={exp.role}
                            onChange={(e) => updateExperienceRow(idx, "role", e.target.value)}
                            className="w-full bg-[#03050a] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold/50 font-luxury"
                          />
                        </div>
                        <div className="md:col-span-2 flex flex-col gap-2">
                          <label className="text-[9px] font-space text-grey-text uppercase">Duration</label>
                          <input
                            type="text"
                            required
                            placeholder="2 Years"
                            value={exp.duration}
                            onChange={(e) => updateExperienceRow(idx, "duration", e.target.value)}
                            className="w-full bg-[#03050a] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold/50 font-luxury"
                          />
                        </div>
                        <div className="md:col-span-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeExperienceRow(idx)}
                            disabled={experienceList.length === 1}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* STEP 4: Documents Upload */}
                {currentStep === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-6"
                  >
                    <h3 className="font-space text-xs uppercase tracking-wider text-gold font-bold border-b border-white/5 pb-2">
                      Upload Documents
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Resume */}
                      <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-space text-grey-text uppercase tracking-wider">
                          Resume / CV <span className="text-red-400">*</span>
                        </label>
                        <div className="flex flex-col gap-2">
                          <label className="border border-white/10 hover:border-gold/30 border-dashed rounded-xl p-8 bg-white/2 hover:bg-white/4 cursor-pointer text-center flex flex-col items-center justify-center gap-3 transition-all">
                            <Upload className="h-8 w-8 text-gold" />
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-white font-medium">Click to select file</span>
                              <span className="text-[9px] text-grey-text">PDF, DOC, or DOCX (max 5MB)</span>
                            </div>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              required
                              onChange={handleCvChange}
                              className="hidden"
                            />
                          </label>
                          {cvFile && (
                            <div className="bg-teal/5 border border-teal/20 text-teal text-[10px] font-space font-semibold tracking-wider rounded-lg p-2.5 flex items-center gap-2 justify-between">
                              <span className="truncate">{cvFile.name}</span>
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-teal" />
                            </div>
                          )}
                          {cvError && (
                            <span className="text-[10px] font-luxury text-red-400">{cvError}</span>
                          )}
                        </div>
                      </div>

                      {/* Photo Upload with live preview */}
                      <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-space text-grey-text uppercase tracking-wider">
                          Professional Photo <span className="text-red-400">*</span>
                        </label>
                        <div className="flex flex-col gap-2">
                          <label className="border border-white/10 hover:border-gold/30 border-dashed rounded-xl p-8 bg-white/2 hover:bg-white/4 cursor-pointer text-center flex flex-col items-center justify-center gap-3 transition-all">
                            <Upload className="h-8 w-8 text-gold" />
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-white font-medium">Click to select image</span>
                              <span className="text-[9px] text-grey-text">JPG or PNG (max 2MB, &gt;100x100px)</span>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              required
                              onChange={handlePhotoChange}
                              className="hidden"
                            />
                          </label>
                          
                          {photoPreview && (
                            <div className="flex items-center gap-3 bg-white/2 border border-white/5 rounded-xl p-3">
                              <img 
                                src={photoPreview} 
                                alt="Crew Candidate Headshot" 
                                className="h-14 w-14 rounded-lg object-cover border border-white/10" 
                              />
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-semibold text-white truncate max-w-40">{photoFile?.name}</span>
                                <span className="text-[9px] text-grey-text">Dimensions validated</span>
                              </div>
                            </div>
                          )}
                          {photoError && (
                            <span className="text-[10px] font-luxury text-red-400">{photoError}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 5: Review & Submit */}
                {currentStep === 5 && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-6"
                  >
                    <h3 className="font-space text-xs uppercase tracking-wider text-gold font-bold border-b border-white/5 pb-2">
                      Review & Submit
                    </h3>

                    {isUploading ? (
                      /* Simulated file uploading progress */
                      <div className="flex flex-col items-center justify-center py-16 gap-4">
                        <span className="font-space text-xs uppercase tracking-wider text-gold font-bold animate-pulse">
                          Uploading Files & Syncing Database...
                        </span>
                        <div className="w-64 bg-white/5 h-2 rounded-full overflow-hidden border border-white/5 relative">
                          <div 
                            className="bg-gold h-full transition-all duration-150"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-grey-text">{uploadProgress}%</span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-6 font-luxury text-xs text-grey-text">
                        {/* Personal info summary */}
                        <div className="bg-white/2 p-4 rounded-xl border border-white/5 flex flex-col gap-3">
                          <h4 className="font-space text-[10px] text-white uppercase font-bold tracking-wider border-b border-white/5 pb-1.5 flex items-center gap-1.5">
                            <Info className="h-4 w-4 text-gold" />
                            Personal Details
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="block opacity-60">Full Name</span>
                              <span className="text-white font-medium">{fullName}</span>
                            </div>
                            <div>
                              <span className="block opacity-60">Email Address</span>
                              <span className="text-white font-medium">{email}</span>
                            </div>
                            <div>
                              <span className="block opacity-60">Phone Number</span>
                              <span className="text-white font-medium">{phone}</span>
                            </div>
                          </div>
                          {coverLetter && (
                            <div className="mt-2 border-t border-white/5 pt-2">
                              <span className="block opacity-60 mb-0.5">Cover Letter</span>
                              <p className="italic leading-relaxed">{coverLetter}</p>
                            </div>
                          )}
                        </div>

                        {/* Education summary */}
                        <div className="bg-white/2 p-4 rounded-xl border border-white/5 flex flex-col gap-3">
                          <h4 className="font-space text-[10px] text-white uppercase font-bold tracking-wider border-b border-white/5 pb-1.5 flex items-center gap-1.5">
                            <GraduationCap className="h-4 w-4 text-gold" />
                            Education & Credentials
                          </h4>
                          <div className="flex flex-col gap-2">
                            {educationList.map((edu, idx) => (
                              <div key={idx} className="flex justify-between items-center text-[11px]">
                                <span>{edu.degree} - <span className="opacity-80">{edu.school}</span></span>
                                <span className="font-mono text-[10px]">{edu.year}</span>
                              </div>
                            ))}
                          </div>
                          {certificationsList.length > 0 && certificationsList[0] !== "" && (
                            <div className="border-t border-white/5 pt-2.5 flex flex-col gap-1.5">
                              <span className="block opacity-60 text-[9px] uppercase tracking-wider font-bold">Certifications</span>
                              <div className="flex flex-wrap gap-2">
                                {certificationsList.map((cert, idx) => (
                                  <span key={idx} className="bg-white/5 border border-white/5 px-2.5 py-1 rounded text-[10px] text-white">
                                    {cert}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Experience summary */}
                        <div className="bg-white/2 p-4 rounded-xl border border-white/5 flex flex-col gap-3">
                          <h4 className="font-space text-[10px] text-white uppercase font-bold tracking-wider border-b border-white/5 pb-1.5 flex items-center gap-1.5">
                            <Briefcase className="h-4 w-4 text-gold" />
                            Work Experience
                          </h4>
                          <div className="flex flex-col gap-2">
                            {experienceList.map((exp, idx) => (
                              <div key={idx} className="flex justify-between items-center text-[11px]">
                                <span>{exp.role} - <span className="opacity-80">{exp.company}</span></span>
                                <span className="font-mono text-[10px]">{exp.duration}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Files summary */}
                        <div className="bg-white/2 p-4 rounded-xl border border-white/5 flex flex-col gap-3">
                          <h4 className="font-space text-[10px] text-white uppercase font-bold tracking-wider border-b border-white/5 pb-1.5 flex items-center gap-1.5">
                            <FileCheck className="h-4 w-4 text-gold" />
                            Attached Files
                          </h4>
                          <div className="flex flex-col gap-2.5">
                            <div className="flex justify-between items-center">
                              <span>Resume / CV</span>
                              <span className="font-medium text-white">{cvFile?.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Profile Photo</span>
                              <span className="font-medium text-white">{photoFile?.name}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Form Navigation Controls */}
              {!isUploading && (
                <div className="bg-white/2 border-t border-white/5 p-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentStep > 1) {
                        setCurrentStep(currentStep - 1);
                      } else {
                        setIsApplying(false);
                      }
                    }}
                    className="flex items-center gap-1.5 px-5 py-2.5 text-xs text-grey-text hover:text-white transition-all font-space uppercase tracking-wider bg-white/2 border border-white/5 hover:border-white/10 rounded-lg cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </button>

                  {currentStep < 5 ? (
                    <button
                      type="button"
                      disabled={!isStepValid()}
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className="flex items-center gap-1.5 px-6 py-2.5 bg-gold hover:bg-gold/90 disabled:opacity-30 disabled:hover:bg-gold text-black rounded-lg font-space text-xs font-bold uppercase tracking-widest transition-all glow-gold border border-gold cursor-pointer"
                    >
                      Next Step
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="px-8 py-2.5 bg-teal hover:bg-teal/90 text-white rounded-lg font-space text-xs font-bold uppercase tracking-widest transition-all border border-teal/10 glow-teal cursor-pointer"
                    >
                      Submit Application
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
