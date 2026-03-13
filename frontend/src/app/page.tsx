"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Heart, Activity, Stethoscope, Users, Clock, Shield, Ambulance, Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-hospital-blue-light to-white relative overflow-hidden">
      {/* Medical pattern background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 text-hospital-blue-primary">
          <Heart className="w-32 h-32" />
        </div>
        <div className="absolute bottom-40 right-20 text-hospital-green">
          <Activity className="w-40 h-40" />
        </div>
        <div className="absolute top-1/2 left-1/3 text-hospital-blue-primary">
          <Stethoscope className="w-24 h-24" />
        </div>
      </div>

      {/* Animated pulse effect */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-hospital-blue-primary opacity-10 blur-[120px] animate-pulse-slow" />
      <div className="absolute top-20 right-1/4 w-[500px] h-[500px] rounded-full bg-hospital-green opacity-10 blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }} />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto bg-white/80 backdrop-blur-md rounded-b-2xl shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-hospital-blue-primary p-2 rounded-xl">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <span className="font-display text-2xl font-bold tracking-tight bg-gradient-to-r from-hospital-blue-primary to-hospital-green bg-clip-text text-transparent">
            SANJEEVANI
          </span>
          <span className="text-xs bg-hospital-green text-white px-2 py-1 rounded-full font-semibold">AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#services" className="text-sm font-medium text-gray-700 hover:text-hospital-blue-primary transition-colors">Services</a>
          <a href="#features" className="text-sm font-medium text-gray-700 hover:text-hospital-blue-primary transition-colors">Features</a>
          <a href="#about" className="text-sm font-medium text-gray-700 hover:text-hospital-blue-primary transition-colors">About</a>
          <a href="#contact" className="text-sm font-medium text-gray-700 hover:text-hospital-blue-primary transition-colors">Contact</a>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" className="hidden md:inline-flex text-hospital-blue-primary hover:text-hospital-blue-dark">
            <Link href="/dashboard">
              <Activity className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button asChild className="rounded-full px-6 bg-hospital-blue-primary hover:bg-hospital-blue-dark text-white shadow-lg hover:shadow-xl transition-all">
            <Link href="/chat" data-testid="try-model-btn">
              Start Consultation <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </nav>

      {/* Emergency Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 max-w-7xl mx-auto px-6 mt-4"
      >
        <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Ambulance className="w-5 h-5 text-red-500 animate-pulse" />
            <p className="text-sm font-medium text-red-800">
              <strong>Emergency?</strong> Call our 24/7 helpline: <span className="font-bold">1800-XXX-XXXX</span>
            </p>
          </div>
          <Phone className="w-5 h-5 text-red-500" />
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-16 pb-20 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-hospital-green/10 border border-hospital-green/20 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-hospital-green rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-hospital-green">AI-Powered Healthcare</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1] mb-6">
              Your Intelligent
              <span className="block bg-gradient-to-r from-hospital-blue-primary to-hospital-green bg-clip-text text-transparent">
                Medical Assistant
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-xl mb-8 leading-relaxed">
              Sanjeevani AI helps you understand symptoms, get instant medical insights, and access healthcare information 24/7 using advanced artificial intelligence. Your health companion, always ready to help.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
              <Button asChild size="lg" className="rounded-full px-8 bg-hospital-blue-primary hover:bg-hospital-blue-dark text-white font-semibold shadow-lg hover:shadow-xl transition-all" data-testid="get-started-btn">
                <Link href="/chat">
                  <Heart className="mr-2 h-5 w-5 animate-heartbeat" />
                  Get Started Free
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-2 border-hospital-blue-primary text-hospital-blue-primary hover:bg-hospital-blue-light font-semibold">
                <Link href="#features">
                  Learn More
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
              <div>
                <p className="text-3xl font-bold text-hospital-blue-primary">24/7</p>
                <p className="text-sm text-gray-600 mt-1">Available</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-hospital-blue-primary">10K+</p>
                <p className="text-sm text-gray-600 mt-1">Consultations</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-hospital-blue-primary">95%</p>
                <p className="text-sm text-gray-600 mt-1">Accuracy</p>
              </div>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" 
                alt="Professional Healthcare" 
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-hospital-blue-primary/20 to-transparent" />
            </div>
            
            {/* Floating card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="bg-hospital-green/10 p-3 rounded-lg">
                  <Shield className="w-6 h-6 text-hospital-green" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Secure & Private</p>
                  <p className="text-xs text-gray-600">Your data is protected</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">Our Healthcare Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Comprehensive AI-powered medical assistance at your fingertips</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Activity,
              title: "Symptom Analysis",
              description: "Get instant AI-powered analysis of your symptoms with detailed medical insights.",
              color: "hospital-blue-primary"
            },
            {
              icon: Heart,
              title: "Health Monitoring",
              description: "Track your health metrics and receive personalized recommendations.",
              color: "hospital-green"
            },
            {
              icon: Users,
              title: "Patient Management",
              description: "Comprehensive patient records and history management for healthcare workers.",
              color: "hospital-blue-dark"
            },
            {
              icon: Clock,
              title: "24/7 Availability",
              description: "Access medical assistance anytime, anywhere with our AI assistant.",
              color: "hospital-blue-primary"
            },
            {
              icon: Stethoscope,
              title: "Medical Diagnosis",
              description: "Advanced AI diagnosis with high accuracy for preliminary assessments.",
              color: "hospital-green"
            },
            {
              icon: Shield,
              title: "Data Security",
              description: "Your medical information is encrypted and securely stored.",
              color: "hospital-blue-dark"
            }
          ].map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 group hover:border-hospital-blue-primary"
            >
              <div className={`bg-${service.color}/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <service.icon className={`w-7 h-7 text-${service.color}`} />
              </div>
              <h3 className="font-display text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-hospital-blue-primary to-hospital-blue-dark rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <Heart className="absolute top-10 right-10 w-32 h-32 text-white" />
            <Activity className="absolute bottom-10 left-10 w-40 h-40 text-white" />
          </div>
          
          <div className="relative z-10">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Experience Smart Healthcare?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust Sanjeevani AI for their healthcare needs.
            </p>
            <Button asChild size="lg" className="rounded-full px-10 bg-white text-hospital-blue-primary hover:bg-gray-100 font-semibold shadow-lg text-lg" data-testid="cta-start-btn">
              <Link href="/chat">
                Start Your Consultation
                <ArrowUpRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-50 border-t border-gray-200 px-6 py-12 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-hospital-blue-primary" />
                <span className="font-display text-xl font-bold text-gray-900">SANJEEVANI</span>
              </div>
              <p className="text-sm text-gray-600">AI-powered healthcare assistant for better health outcomes.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Services</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-hospital-blue-primary">Symptom Analysis</a></li>
                <li><a href="#" className="hover:text-hospital-blue-primary">Health Monitoring</a></li>
                <li><a href="#" className="hover:text-hospital-blue-primary">Patient Management</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-hospital-blue-primary">About Us</a></li>
                <li><a href="#" className="hover:text-hospital-blue-primary">Contact</a></li>
                <li><a href="#" className="hover:text-hospital-blue-primary">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Emergency</h4>
              <p className="text-sm text-gray-600 mb-2">24/7 Helpline</p>
              <p className="text-lg font-bold text-hospital-blue-primary">1800-XXX-XXXX</p>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>© 2025 Sanjeevani AI. All rights reserved. | Built with ❤️ for better healthcare</p>
          </div>
        </div>
      </footer>
    </div>
  );
}