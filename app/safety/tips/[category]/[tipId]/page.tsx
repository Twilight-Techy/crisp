"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertTriangle,
  Phone,
  Share2,
  Download,
  BookOpen,
  ExternalLink,
  Home,
  Car,
  User,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"

export default function SafetyTipDetailPage() {
  const params = useParams()
  const { category, tipId } = params

  // Mock data - in a real app, this would come from an API or database
  const safetyTipData = {
    "personal-safety": {
      "stay-alert": {
        title: "Stay Alert in Public",
        category: "Personal Safety",
        priority: "high",
        readingTime: "5 min",
        lastUpdated: "December 2024",
        overview:
          "Staying alert and aware of your surroundings is one of the most important personal safety skills you can develop. This comprehensive guide will teach you how to maintain situational awareness in various environments.",
        keyPoints: [
          "Keep your head up and eyes scanning your environment",
          "Avoid distractions like phones or headphones in unfamiliar areas",
          "Trust your instincts if something feels wrong",
          "Identify potential escape routes and safe spaces",
          "Be aware of people around you and their behavior",
        ],
        implementation: [
          {
            step: 1,
            title: "Practice the 360-Degree Scan",
            description:
              "Regularly look around you in all directions. Make it a habit to check behind you, to your sides, and ahead. This should become second nature.",
          },
          {
            step: 2,
            title: "Use Your Peripheral Vision",
            description:
              "Train yourself to notice movement and changes in your peripheral vision. This helps you detect potential threats without obviously looking around.",
          },
          {
            step: 3,
            title: "Identify Baseline Behavior",
            description:
              "Learn what normal behavior looks like in different environments so you can quickly spot when something is out of place.",
          },
          {
            step: 4,
            title: "Plan Your Routes",
            description:
              "Before going somewhere new, familiarize yourself with the area. Know where exits are located and identify safe places you could go if needed.",
          },
        ],
        commonMistakes: [
          "Being completely absorbed in your phone while walking",
          "Wearing headphones at full volume in public spaces",
          "Ignoring your gut feelings about a situation",
          "Not having an exit strategy when entering new places",
          "Assuming that busy areas are always safe",
        ],
        emergencyActions: [
          "If you feel threatened, move to a well-lit, populated area immediately",
          "Call 911 if you witness or experience a crime",
          "Trust your instincts - if something feels wrong, leave the area",
          "Make noise to attract attention if you're in danger",
          "Have emergency contacts readily available on your phone",
        ],
        relatedTips: [
          { id: "trust-instincts", title: "Trust Your Instincts", category: "personal-safety" },
          { id: "share-location", title: "Share Your Location", category: "personal-safety" },
          { id: "emergency-contacts", title: "Carry Emergency Contacts", category: "personal-safety" },
        ],
        resources: [
          {
            title: "Personal Safety Awareness Guide",
            type: "PDF",
            size: "2.1 MB",
            description: "Comprehensive guide to situational awareness",
          },
          {
            title: "Self-Defense Basics Video",
            type: "Video",
            duration: "15 min",
            description: "Basic self-defense techniques and awareness tips",
          },
        ],
      },
      "trust-instincts": {
        title: "Trust Your Instincts",
        category: "Personal Safety",
        priority: "high",
        readingTime: "4 min",
        lastUpdated: "December 2024",
        overview:
          "Your intuition is a powerful safety tool that has evolved over thousands of years. Learning to recognize and trust your gut feelings can help you avoid dangerous situations before they escalate.",
        keyPoints: [
          "Your subconscious picks up on danger signals before your conscious mind",
          "Physical sensations often accompany intuitive warnings",
          "It's better to be wrong and safe than right and sorry",
          "Don't let social politeness override your safety instincts",
          "Practice listening to your inner voice in low-stakes situations",
        ],
        implementation: [
          {
            step: 1,
            title: "Recognize Physical Warning Signs",
            description:
              "Learn to identify how your body responds to danger: increased heart rate, sweating, muscle tension, or a feeling in your stomach.",
          },
          {
            step: 2,
            title: "Don't Rationalize Away Concerns",
            description:
              "If something feels off, don't talk yourself out of the feeling. Your subconscious may have noticed something your conscious mind missed.",
          },
          {
            step: 3,
            title: "Act on Your Instincts",
            description:
              "When you get a warning feeling, take action immediately. Leave the situation, seek help, or move to a safer location.",
          },
          {
            step: 4,
            title: "Practice in Safe Environments",
            description:
              "Start paying attention to your gut feelings in everyday situations to strengthen your ability to recognize them when it matters.",
          },
        ],
        commonMistakes: [
          "Ignoring gut feelings to avoid seeming rude or paranoid",
          "Overthinking and rationalizing away warning signs",
          "Waiting for concrete evidence before taking action",
          "Dismissing feelings as 'just anxiety' without consideration",
          "Not trusting your instincts about people you've just met",
        ],
        emergencyActions: [
          "If you feel immediate danger, leave the area immediately",
          "Don't worry about being polite if your safety is at risk",
          "Call for help or contact authorities if the feeling persists",
          "Move to a public, well-lit area with other people around",
          "Contact someone you trust to let them know your situation",
        ],
        relatedTips: [
          { id: "stay-alert", title: "Stay Alert in Public", category: "personal-safety" },
          { id: "share-location", title: "Share Your Location", category: "personal-safety" },
        ],
        resources: [
          {
            title: "The Gift of Fear - Key Concepts",
            type: "PDF",
            size: "1.8 MB",
            description: "Summary of Gavin de Becker's safety principles",
          },
          {
            title: "Intuition and Safety Podcast",
            type: "Audio",
            duration: "25 min",
            description: "Expert discussion on trusting your instincts",
          },
        ],
      },
    },
    "home-security": {
      "secure-entry-points": {
        title: "Secure All Entry Points",
        category: "Home Security",
        priority: "high",
        readingTime: "7 min",
        lastUpdated: "December 2024",
        overview:
          "Your home's entry points are the first line of defense against intruders. This guide covers how to properly secure doors, windows, and other potential access points to keep your home safe.",
        keyPoints: [
          "All doors should have deadbolt locks in addition to standard locks",
          "Windows should be secured with locks and reinforcement",
          "Sliding doors need special security considerations",
          "Don't forget about basement and attic access points",
          "Regular maintenance keeps security features effective",
        ],
        implementation: [
          {
            step: 1,
            title: "Install Quality Deadbolts",
            description:
              "Install Grade 1 deadbolts on all exterior doors. The bolt should extend at least 1 inch into the door frame.",
          },
          {
            step: 2,
            title: "Reinforce Door Frames",
            description:
              "Use 3-inch screws in door hinges and strike plates to anchor them into the wall studs, not just the door frame.",
          },
          {
            step: 3,
            title: "Secure Windows",
            description:
              "Install window locks on all accessible windows. Consider security film or bars for ground-level windows.",
          },
          {
            step: 4,
            title: "Address Sliding Doors",
            description:
              "Place a security bar or dowel in the track of sliding doors. Consider installing a pin lock for additional security.",
          },
        ],
        commonMistakes: [
          "Relying only on the lock that comes with the door",
          "Using short screws that don't reach the wall studs",
          "Forgetting to secure basement or garage entry points",
          "Leaving spare keys in obvious hiding places",
          "Not maintaining locks and security hardware",
        ],
        emergencyActions: [
          "If you discover signs of attempted break-in, call police immediately",
          "Don't enter your home if you suspect someone may be inside",
          "Have a family emergency plan for home security breaches",
          "Keep emergency numbers easily accessible",
          "Consider a safe room with communication capabilities",
        ],
        relatedTips: [
          { id: "security-systems", title: "Install Security Systems", category: "home-security" },
          { id: "hide-valuables", title: "Don't Advertise Valuables", category: "home-security" },
        ],
        resources: [
          {
            title: "Home Security Assessment Checklist",
            type: "PDF",
            size: "1.5 MB",
            description: "Complete checklist for evaluating your home's security",
          },
          {
            title: "Door and Window Security Installation Guide",
            type: "Video",
            duration: "20 min",
            description: "Step-by-step installation instructions",
          },
        ],
      },
    },
    "vehicle-safety": {
      "lock-vehicle": {
        title: "Lock Your Vehicle",
        category: "Vehicle Safety",
        priority: "high",
        readingTime: "4 min",
        lastUpdated: "December 2024",
        overview:
          "Vehicle theft and break-ins are crimes of opportunity. By consistently locking your vehicle and following proper security practices, you can significantly reduce your risk of becoming a victim.",
        keyPoints: [
          "Always lock your vehicle, even for short stops",
          "Never leave valuables visible inside your car",
          "Park in well-lit, populated areas when possible",
          "Don't leave your car running unattended",
          "Keep your keys secure and don't leave spare keys in the vehicle",
        ],
        implementation: [
          {
            step: 1,
            title: "Develop a Locking Habit",
            description:
              "Make locking your car an automatic habit every time you exit, regardless of how long you'll be away or where you're parked.",
          },
          {
            step: 2,
            title: "Remove All Valuables",
            description:
              "Take all valuable items with you or store them in the trunk before arriving at your destination. Don't move items to the trunk while parked.",
          },
          {
            step: 3,
            title: "Choose Parking Spots Carefully",
            description:
              "Park in well-lit areas with good visibility. Avoid isolated spots, even if they're more convenient.",
          },
          {
            step: 4,
            title: "Secure Your Keys",
            description:
              "Never leave keys in the ignition or hide spare keys on the vehicle. Keep your keys secure and consider a key fob with alarm features.",
          },
        ],
        commonMistakes: [
          "Leaving the car unlocked for 'just a minute'",
          "Storing valuables in plain sight",
          "Parking in isolated or poorly lit areas",
          "Leaving windows down or sunroof open",
          "Hiding spare keys in obvious places on the vehicle",
        ],
        emergencyActions: [
          "If you discover your vehicle has been broken into, don't touch anything and call police",
          "If you see someone breaking into your vehicle, don't confront them - call 911",
          "If your keys are stolen, contact police and your insurance company immediately",
          "Have your vehicle identification number (VIN) and license plate number readily available",
          "Keep a list of items typically stored in your vehicle for insurance purposes",
        ],
        relatedTips: [
          { id: "well-lit-parking", title: "Park in Well-Lit Areas", category: "vehicle-safety" },
          { id: "fuel-tank", title: "Keep Fuel Tank Full", category: "vehicle-safety" },
        ],
        resources: [
          {
            title: "Vehicle Security Best Practices",
            type: "PDF",
            size: "1.2 MB",
            description: "Comprehensive guide to protecting your vehicle",
          },
          {
            title: "Car Theft Prevention Tips",
            type: "Infographic",
            size: "800 KB",
            description: "Visual guide to vehicle security measures",
          },
        ],
      },
    },
  }

  const categoryData = safetyTipData[category as keyof typeof safetyTipData]
  const tipData = categoryData?.[tipId as keyof typeof categoryData]

  if (!tipData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50/30 pt-16">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Safety Tip Not Found</h1>
            <p className="text-muted-foreground mb-8">The safety tip you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/safety">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Safety Hub
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "personal safety":
        return User
      case "home security":
        return Home
      case "vehicle safety":
        return Car
      default:
        return Shield
    }
  }

  const CategoryIcon = getCategoryIcon(tipData.category)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "low":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50/30 pt-16">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/safety" className="hover:text-emerald-600">
              Safety Hub
            </Link>
            <span>/</span>
            <span>{tipData.category}</span>
            <span>/</span>
            <span className="text-foreground">{tipData.title}</span>
          </div>

          {/* Header */}
          <div className="space-y-6">
            <Button variant="outline" asChild className="bg-transparent">
              <Link href="/safety">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Safety Hub
              </Link>
            </Button>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                  <CategoryIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{tipData.title}</h1>
                  <p className="text-muted-foreground">{tipData.category}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Badge className={getPriorityColor(tipData.priority)}>{tipData.priority} priority</Badge>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{tipData.readingTime} read</span>
                </div>
                <div className="text-sm text-muted-foreground">Updated {tipData.lastUpdated}</div>
              </div>

              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Overview */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                    <span>Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">{tipData.overview}</p>
                </CardContent>
              </Card>

              {/* Key Points */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Key Points</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tipData.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Implementation Steps */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Step-by-Step Implementation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {tipData.implementation.map((step, index) => (
                      <div key={index} className="flex space-x-4">
                        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                            {step.step}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold">{step.title}</h4>
                          <p className="text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Common Mistakes */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <span>Common Mistakes to Avoid</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tipData.commonMistakes.map((mistake, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span>{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Emergency Actions */}
              <Card className="border-0 shadow-lg border-red-200 bg-red-50 dark:bg-red-950/30">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-700 dark:text-red-300">
                    <Phone className="w-5 h-5" />
                    <span>Emergency Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tipData.emergencyActions.map((action, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Phone className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-red-700 dark:text-red-300">{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Related Tips */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Related Safety Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {tipData.relatedTips.map((relatedTip, index) => (
                      <Card key={index} className="bg-muted/30 hover:bg-muted/50 transition-colors">
                        <CardContent className="p-4">
                          <Link
                            href={`/safety/tips/${relatedTip.category}/${relatedTip.id}`}
                            className="flex items-center justify-between group"
                          >
                            <span className="font-medium group-hover:text-emerald-600">{relatedTip.title}</span>
                            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-emerald-600" />
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Additional Resources */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Additional Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tipData.resources.map((resource, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div className="space-y-1">
                          <h4 className="font-medium">{resource.title}</h4>
                          <p className="text-sm text-muted-foreground">{resource.description}</p>
                          <div className="text-xs text-muted-foreground">
                            {resource.type} • {resource.size || resource.duration}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Emergency Contacts */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-red-600" />
                    <span>Emergency Contacts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                  >
                    <span className="text-lg mr-3">🚨</span>
                    Emergency - 911
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                  >
                    <span className="text-lg mr-3">👮</span>
                    Police - (555) 123-4567
                  </Button>
                </CardContent>
              </Card>

              {/* Report Incident */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30">
                <CardContent className="p-6 text-center space-y-4">
                  <Shield className="w-12 h-12 text-emerald-600 mx-auto" />
                  <div>
                    <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">Need to Report Something?</h3>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-2">
                      Report incidents anonymously to help keep our community safe.
                    </p>
                  </div>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                  >
                    <Link href="/report">Report Incident</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
