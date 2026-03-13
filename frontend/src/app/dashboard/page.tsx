'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, User, Activity, AlertTriangle, FileText, Heart, Users, TrendingUp, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

// Types based on our backend Supabase schema
type PatientSession = {
  id: string
  patient_id: string
  symptoms: string
  severity: string
  created_at: string
  patients: {
    name: string
    age: number
  }
}

export default function Dashboard() {
  const [sessions, setSessions] = useState<PatientSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch('http://localhost:8000/patients/sessions?limit=10')
        if (res.ok) {
          const data = await res.json()
          setSessions(data)
        }
      } catch (err) {
        console.error("Failed to fetch sessions:", err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchSessions()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-hospital-blue-light via-white to-hospital-green-light">
      {/* Top Nav */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-hospital-blue-primary transition-colors" data-testid="back-home-btn">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="bg-hospital-blue-primary p-2 rounded-lg">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold bg-gradient-to-r from-hospital-blue-primary to-hospital-green bg-clip-text text-transparent">SANJEEVANI DASHBOARD</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-900">ASHA Worker</span>
              <span className="text-xs text-gray-500">ID: worker_bora</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-hospital-blue-primary to-hospital-green flex items-center justify-center shadow-lg">
              <User className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-gray-900 mb-2">Health Worker Console</h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Activity className="h-4 w-4 text-hospital-green" />
              Monitoring community health and AI-assisted triage sessions
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button asChild size="lg" className="rounded-full font-semibold bg-hospital-blue-primary hover:bg-hospital-blue-dark text-white shadow-lg hover:shadow-xl transition-all" data-testid="new-patient-btn">
              <Link href="/chat">
                <Users className="mr-2 h-5 w-5" />
                New Patient Intake
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-hospital-blue-primary/10 group-hover:bg-hospital-blue-primary/20 transition-colors">
                <Users className="h-6 w-6 text-hospital-blue-primary" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-3xl font-display font-black text-gray-900 mb-1">12</p>
            <p className="text-sm font-medium text-gray-600">Patients Today</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-red-200 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-500 opacity-10 rounded-full -mr-10 -mt-10" />
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-red-500/20 group-hover:bg-red-500/30 transition-colors">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">URGENT</div>
            </div>
            <p className="text-3xl font-display font-black text-red-600 mb-1">3</p>
            <p className="text-sm font-medium text-red-700">Urgent Referrals</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-hospital-green/10 group-hover:bg-hospital-green/20 transition-colors">
                <Activity className="h-6 w-6 text-hospital-green" />
              </div>
              <Heart className="h-5 w-5 text-hospital-green animate-heartbeat" />
            </div>
            <p className="text-3xl font-display font-black text-gray-900 mb-1">156</p>
            <p className="text-sm font-medium text-gray-600">Total AI Scans</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-100 group-hover:bg-purple-200 transition-colors">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-xs text-gray-500">This Month</span>
            </div>
            <p className="text-3xl font-display font-black text-gray-900 mb-1">89%</p>
            <p className="text-sm font-medium text-gray-600">Success Rate</p>
          </motion.div>
        </div>

        {/* Recent Sessions Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-hospital-blue-primary" />
            Recent Clinic Sessions
          </h2>
          <Button variant="outline" size="sm" className="text-hospital-blue-primary border-hospital-blue-primary hover:bg-hospital-blue-light">
            View All
          </Button>
        </div>
        
        {/* Sessions Table */}
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300"
          >
            <div className="relative">
              <div className="animate-spin h-12 w-12 border-4 border-hospital-blue-primary border-t-transparent rounded-full"></div>
              <Heart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-hospital-blue-primary" />
            </div>
            <p className="text-gray-600 font-medium mt-4">Synchronizing with medical database...</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-hospital-blue-primary to-hospital-blue-dark text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-xs">Patient</th>
                    <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-xs">Primary Symptoms</th>
                    <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-xs">AI Triage</th>
                    <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-xs">Record Date</th>
                    <th className="px-6 py-4 text-right font-bold uppercase tracking-wider text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sessions.map((s, index) => (
                    <motion.tr 
                      key={s.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-hospital-blue-light/30 transition-colors group"
                      data-testid={`session-row-${index}`}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-hospital-blue-primary to-hospital-green flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 group-hover:text-hospital-blue-primary transition-colors">{s.patients.name}</div>
                            <div className="text-xs text-gray-500">{s.patients.age} years • {s.patients.name.length % 2 === 0 ? 'Female' : 'Male'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 max-w-sm">
                        <p className="text-gray-700 line-clamp-2 italic text-sm">"{s.symptoms}"</p>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                          s.severity === 'URGENT' 
                            ? 'bg-red-100 text-red-700 border-2 border-red-300' 
                            : s.severity === 'Medium'
                              ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300'
                              : 'bg-green-100 text-green-700 border-2 border-green-300'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${
                             s.severity === 'URGENT' ? 'bg-red-500 animate-pulse' : s.severity === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}></span>
                          {s.severity}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-gray-600 font-mono text-sm">
                        {new Date(s.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="inline-flex items-center gap-2 text-hospital-blue-primary hover:text-hospital-blue-dark font-bold text-sm transition-colors group-hover:underline">
                          <FileText className="h-4 w-4" />
                          VIEW REPORT
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                  
                  {sessions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center">
                          <FileText className="h-12 w-12 text-gray-300 mb-3" />
                          <p className="text-gray-500 italic">No clinical sessions found in the current cache.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
