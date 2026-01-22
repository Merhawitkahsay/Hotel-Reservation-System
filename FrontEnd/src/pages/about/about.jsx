import React from "react";
import { motion } from "framer-motion";
// Relative path to your local campus image
import mitCampus from "./campus2-2f314de0.png";
import {
  Github,
  Linkedin,
  Mail,
  School,
  User,
  UserCircle2
} from "lucide-react";

const About = () => {
  const teamMembers = [
    {
      name: "Kalab Tesfay",
      id: "mit/ur190574/16",
      role: "Developer",
      email: "kalabtesfay645@gmail.com",
      gender: "male"
    },
    {
      name: "Mehari Ashfare",
      id: "mit/ur188418/16",
      role: "Developer",
      email: "mehariashfare2012@gmail.com",
      gender: "male"
    },
    {
      name: "Merhawit Kahsay",
      id: "mit/ur190588/16",
      role: "Developer",
      email: "merhawitkahsay99@gmail.com",
      gender: "female"
    },
    {
      name: "Minilik Werku",
      id: "mit/ur190597/16",
      role: "Developer",
      email: "mnwe6632@gmail.com",
      gender: "male"
    },
    {
      name: "Shewit G/tsadik",
      id: "mit/ur190626/16",
      role: "Developer",
      email: "shewit27gebre@gmail.com",
      gender: "male"
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative min-h-screen bg-white pt-32 pb-24 px-4">
      <div className="relative max-w-7xl mx-auto">

        {/* --- HERO SECTION --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="flex justify-center gap-3 mb-6">
            <span className="px-4 py-1 bg-gray-100 text-gray-500 rounded-full text-[9px] font-black tracking-[0.3em] border border-gray-200">
              SECTION 2 • GROUP 7
            </span>
            <span className="px-4 py-1 bg-black text-white rounded-full text-[9px] font-black tracking-[0.3em]">
              3RD YEAR CSE
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 text-gray-900 font-serif">
            Meet the  <span className="text-amber-600">Team</span>
          </h1>

          <p className="max-w-2xl mx-auto text-gray-500 font-medium leading-relaxed">
            A comprehensive hotel management solution developed by Computer Science 
            & Engineering students at Mekelle Institute of Technology.
          </p>
        </motion.div>

        {/* --- MIT INSTITUTION IMAGE --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative mb-28 rounded-[2.5rem] overflow-hidden shadow-2xl bg-black border-[12px] border-gray-50"
        >
          <img
            src={mitCampus}
            alt="Mekelle Institute of Technology Campus"
            className="w-full h-[450px] object-cover opacity-70"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col items-center justify-center text-center text-white p-10">
            <School size={48} className="text-amber-500 mb-4" />
            <h3 className="text-3xl font-black uppercase tracking-[0.2em] mb-2 font-serif">
              Mekelle Institute of Technology
            </h3>
            <p className="text-xs tracking-[0.4em] font-bold text-amber-500 opacity-90">
              MU-MIT • CSE DEPARTMENT
            </p>
          </div>
        </motion.div>

        {/* --- TEAM SECTION (REARRANGED FOR ALIGNMENT) --- */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col gap-8"
        >
          {/* Row 1: First 3 Members */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.slice(0, 3).map((member, i) => (
              <TeamCard key={i} member={member} variants={item} />
            ))}
          </div>

          {/* Row 2: Last 2 Members Centered */}
          <div className="flex flex-wrap justify-center gap-8">
            {teamMembers.slice(3, 5).map((member, i) => (
              <div key={i} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.5rem)]">
                <TeamCard member={member} variants={item} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* --- FOOTER DECORATION --- */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-32 text-center"
        >
           <div className="w-16 h-1 bg-amber-600 mx-auto mb-8 rounded-full" />
           <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">
             Built for Excellence • MIT 2026
           </p>
        </motion.div>

      </div>
    </div>
  );
};

// Sub-component for Team Cards to keep code clean
const TeamCard = ({ member, variants }) => (
  <motion.div
    variants={variants}
    whileHover={{ y: -5 }}
    className="group bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 h-full"
  >
    <div className="relative z-10 text-center">
      <div className="w-20 h-20 mx-auto mb-6 bg-black rounded-full flex items-center justify-center text-white shadow-lg group-hover:bg-amber-600 transition-colors duration-300">
        {member.gender === "female" ? (
          <UserCircle2 size={40} strokeWidth={1.5} />
        ) : (
          <User size={40} strokeWidth={1.5} />
        )}
      </div>

      <h3 className="font-black text-lg text-gray-900 mb-1">{member.name}</h3>
      <p className="text-amber-600 text-[9px] font-black tracking-[0.2em] uppercase mb-1">
        {member.role}
      </p>
      <p className="text-gray-400 text-[9px] font-bold uppercase mb-6 tracking-tighter">
        {member.id}
      </p>

      <div className="flex justify-center gap-4 pt-4 border-t border-gray-50">
        <a href={`mailto:${member.email}`} className="p-2 text-gray-400 hover:text-amber-600 transition-colors">
          <Mail size={18} />
        </a>
        <button className="p-2 text-gray-400 hover:text-black transition-colors">
          <Github size={18} />
        </button>
        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
          <Linkedin size={18} />
        </button>
      </div>
    </div>
  </motion.div>
);

export default About;