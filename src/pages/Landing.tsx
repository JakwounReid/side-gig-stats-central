import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { track } from '@vercel/analytics'
import { 
  TrendingUp, 
  Upload, 
  BarChart3, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Star,
  Users,
  Zap,
  Shield
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Landing = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('features')

  const handleCTAClick = (location: string) => {
    track('cta_click', { location, page: 'landing' })
    navigate('/auth')
  }

  const handleFeatureClick = (feature: string) => {
    track('feature_click', { feature, page: 'landing' })
  }

  const handleFAQClick = (question: string) => {
    track('faq_click', { question, page: 'landing' })
  }

  const features = [
    {
      icon: <Upload className="h-6 w-6" />,
      title: "Bulk Import",
      description: "Import your earnings data from Uber, DoorDash, Lyft, Instacart, and more with just a few clicks."
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Smart Analytics",
      description: "Visualize your earnings with interactive charts and see trends across platforms and time periods."
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Flexible Tracking",
      description: "Log individual sessions or import bulk data. Track by day, week, month, or custom date ranges."
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Earnings Overview",
      description: "See your total earnings, hours worked, and trips completed across all your gig platforms."
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Time Insights",
      description: "Understand your most profitable hours and optimize your schedule for maximum earnings."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure & Private",
      description: "Your data is encrypted and private. We never share your earnings information with third parties."
    }
  ]

  const howItWorks = [
    {
      step: "1",
      title: "Sign Up",
      description: "Create your account in seconds. No email confirmation required."
    },
    {
      step: "2", 
      title: "Import Data",
      description: "Upload your CSV files from gig apps or log sessions manually."
    },
    {
      step: "3",
      title: "Track & Analyze",
      description: "View your earnings dashboard and discover insights to boost your income."
    }
  ]

  const testimonials = [
    {
      name: "Sarah M.",
      role: "DoorDash Driver",
      content: "Gig Dash helped me realize I was making more money on weekends. Now I optimize my schedule and earn 30% more!",
      rating: 5
    },
    {
      name: "Mike R.",
      role: "Uber Driver",
      content: "Finally, a simple way to track all my gig earnings in one place. The bulk import feature is a game-changer.",
      rating: 5
    },
    {
      name: "Jessica L.",
      role: "Instacart Shopper",
      content: "I love the visual charts and being able to see my earnings trends. It's motivated me to work smarter, not harder.",
      rating: 5
    }
  ]

  const faqs = [
    {
      question: "Which gig platforms does Gig Dash support?",
      answer: "We support Uber, DoorDash, Lyft, Instacart, GrubHub, Shipt, and generic CSV imports. More platforms coming soon!"
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely! We use enterprise-grade encryption and never share your earnings data with third parties."
    },
    {
      question: "Can I export my data?",
      answer: "Yes! You can export your earnings data anytime in CSV format for your records or tax purposes."
    },
    {
      question: "Is Gig Dash free to use?",
      answer: "Currently, Gig Dash is completely free to use. We're focused on helping gig workers succeed!"
    },
    {
      question: "Do I need to verify my email?",
      answer: "No! We've made signup super simple. Just solve a quick captcha and you're ready to start tracking."
    },
    {
      question: "Can I use it on mobile?",
      answer: "Yes! Gig Dash is fully responsive and works great on phones, tablets, and desktop computers."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Gig Dash</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
              <Button onClick={() => handleCTAClick('nav_get_started')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            <Zap className="h-4 w-4 mr-1" />
            Track Your Side Hustle Earnings
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Turn Your Gig Work Into
            <span className="text-blue-600"> Smart Income</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Import your earnings data from Uber, DoorDash, Lyft, and more. 
            Visualize trends, optimize your schedule, and maximize your side hustle income.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" onClick={() => handleCTAClick('hero_cta')} className="text-lg px-8 py-3">
              Start Tracking Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              See How It Works
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              Setup in 2 minutes
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              Free forever
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Track Your Gig Income
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed specifically for gig workers to understand and optimize their earnings.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => handleFeatureClick(feature.title)}
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600">
              From signup to insights in minutes, not hours.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Loved by Gig Workers Everywhere
            </h2>
            <p className="text-xl text-gray-600">
              See what our users are saying about their experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about Gig Dash.
            </p>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card 
                key={index} 
                className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleFAQClick(faq.question)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{faq.answer}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Optimize Your Gig Income?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of gig workers who are already tracking and optimizing their earnings.
          </p>
          <Button size="lg" variant="secondary" onClick={() => handleCTAClick('cta_section_cta')} className="text-lg px-8 py-3">
            Start Tracking Free Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-blue-200 mt-4 text-sm">
            No credit card required • Setup in 2 minutes • Free forever
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">Gig Dash</span>
              </div>
              <p className="text-gray-400">
                Helping gig workers track, analyze, and optimize their earnings.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Contact</li>
                <li>Twitter</li>
                <li>Email</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Gig Dash. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing 