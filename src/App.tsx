import { useState } from 'react'
import { Layout } from './components/Layout'
import { DashboardHome } from './pages/DashboardHome'
import { BehaviorTrackingPage } from './pages/BehaviorTracking'
import { RecommendationsPage } from './pages/RecommendationsPage'
import { EmailCampaignsPage } from './pages/EmailCampaigns'
import { DynamicPricingPage } from './pages/DynamicPricing'
import { SettingsPage } from './pages/Settings'
import { motion, AnimatePresence } from 'framer-motion'
import { Analytics } from '@vercel/analytics/react'

function App() {
  const [activePage, setActivePage] = useState('dashboard')

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  }

  return (
    <Layout onNavigate={setActivePage} activePage={activePage}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activePage}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{ height: '100%' }}
        >
          {activePage === 'dashboard' && <DashboardHome />}
          {activePage === 'tracking' && <BehaviorTrackingPage />}
          {activePage === 'recommendations' && <RecommendationsPage />}
          {activePage === 'emails' && <EmailCampaignsPage />}
          {activePage === 'pricing' && <DynamicPricingPage />}
          {activePage === 'settings' && <SettingsPage />}
        </motion.div>
      </AnimatePresence>
      <Analytics />
    </Layout>
  )
}

export default App
