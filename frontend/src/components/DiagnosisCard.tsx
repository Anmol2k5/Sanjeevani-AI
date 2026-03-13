import { motion } from "framer-motion";
import { AlertTriangle, AlertCircle, CheckCircle, Heart, Activity } from "lucide-react";
import type { DiagnosisResult } from "@/types/chat";

const severityConfig = {
  Urgent: { 
    color: "bg-red-500", 
    textColor: "text-red-600", 
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: AlertTriangle 
  },
  Medium: { 
    color: "bg-yellow-500", 
    textColor: "text-yellow-600", 
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    icon: AlertCircle 
  },
  Low: { 
    color: "bg-green-500", 
    textColor: "text-green-600", 
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    icon: CheckCircle 
  },
};

export function DiagnosisCard({ diagnosis }: { diagnosis: DiagnosisResult }) {
  const config = severityConfig[diagnosis.severity];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`${config.bgColor} border-2 ${config.borderColor} rounded-2xl p-6 max-w-xl w-full shadow-xl`}
      data-testid="diagnosis-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="bg-hospital-blue-primary p-2 rounded-lg">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <h3 className="font-display text-lg font-bold text-gray-900">AI Diagnosis Report</h3>
        </div>
        <span className={`inline-flex items-center gap-2 text-xs font-black px-3 py-1.5 rounded-full ${config.color} text-white shadow-md`}>
          <Icon className="h-3.5 w-3.5" />
          {diagnosis.severity.toUpperCase()}
        </span>
      </div>

      {/* Disease Confidence */}
      <div className="space-y-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="h-4 w-4 text-hospital-blue-primary" />
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Possible Conditions</p>
        </div>
        {diagnosis.diseases.map((d, index) => (
          <motion.div 
            key={d.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-900">{d.name}</span>
              <span className={`text-sm font-black ${config.textColor}`}>{d.confidence}%</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${d.confidence}%` }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                className={`h-full ${config.color} rounded-full shadow-sm`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Advice */}
      <div className="bg-white rounded-xl p-4 border-l-4 border-hospital-blue-primary shadow-sm">
        <p className="text-xs font-bold text-hospital-blue-primary uppercase tracking-wider mb-2 flex items-center gap-2">
          <Activity className="h-3.5 w-3.5" />
          Medical Advice
        </p>
        <p className="text-sm text-gray-800 leading-relaxed">{diagnosis.advice}</p>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 italic text-center">
          ⚠️ This is a preliminary AI assessment. Please consult a healthcare professional for accurate diagnosis.
        </p>
      </div>
    </motion.div>
  );
}
