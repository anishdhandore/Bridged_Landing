import { buildNewsletterHtml } from '@/lib/newsletter-template'
import type { NewsletterTemplateData } from '@/lib/newsletter-template'

const sampleData: NewsletterTemplateData = {
  welcomeLine: 'Welcome to the',
  mainTitle: 'BRIDGED INSIDER',
  heroImageUrl: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?q=80&w=600&auto=format&fit=crop',
  year: '2026',
  welcomeBadgeText: 'WELCOME',
  headline: 'THE END OF ONE-OFF NIL.',
  subheadline: 'BEGINNING OF CAREER PIPELINES.',
  introCopy: "NIL opened the door. But it didn't build a pathway.",
  athletesLabel: 'Athletes,',
  athletesCopy: "You practice for hours.\nYou study film.\nYou show up disciplined every day. But when it comes to your career? There's no structured system helping you prepare.",
  companiesLabel: 'Companies,',
  companiesCopy: "You're looking for motivated, coachable, high-performance talent.\nThey're already building the discipline your company hires for.\nWhat if athletes didn't just promote your brand but worked inside it?",
  heroTagline: 'All managed and handled by one platform!',
  whatIsBridgedTitle: 'WHAT IS BRIDGED?',
  whatIsBridgedSubtitle: "YOU'RE EARLY. THAT MATTERS.",
  whatIsBridgedP1: 'Get ready to turn NIL-style marketing budgets into structured, paid internships for student-athletes.',
  whatIsBridgedP2: 'Instead of one-time posts, companies invest in guided, project-based work that builds real experience. Where we manage the vetting, structure, deliverables, and reporting ensuring measurable value on both sides.',
  whatIsBridgedP3: 'Athletes gain resume-ready experience. Companies build a disciplined, high-performance talent pipeline.',
  founderSectionTitle: 'BUILT BY STUDENT ATHLETES.',
  founderImageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=600&auto=format&fit=crop',
  founderName: 'CO-Founder Natalia Bowles',
  founderQuote: "As a college athlete, I saw teammates struggle after their playing days ended. We give our all to the game, but no one prepares us for what's next. Every athlete deserves more than a season, they deserve a future. That's why we created a platform connecting athletes to opportunities, mentorship, and purpose beyond the field.",
  lookoutTitle: 'BE ON THE LOOKOUT FOR …',
  interestedCardUrl: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?q=80&w=600&auto=format&fit=crop',
  whatsComingTitle: "WHAT'S COMING\nBEFORE LAUNCH.",
  whatsComingIntro: "Over the next few weeks, we'll be sharing:",
  whatsComingBullets: 'Athlete spotlight features\nBrand onboarding updates\nEarly internship pilot opportunities\nFounding member access\nMasterclass guest appearances\nLaunch date announcement',
  whatsComingClosing: "We are building this intentionally.\nAnd we're building it for longevity.",
  partnershipTitle: 'PARTNERSHIP SPOTLIGHTS',
  partnershipSubtitle: "WE'RE PROUD TO BEGIN ONBOARDING EARLY PARTNERS WHO BELIEVE IN THE FUTURE OF ATHLETE-DRIVEN TALENT.",
  partner1Name: 'ZENITH PREP ACADEMY',
  partner1Founder: 'FOUNDER DOMINIC HUERTA',
  partner1Copy: 'Zenith Prep Academy has been ranked multiple times as the #1 College Consulting & Education Company in America. Through this partnership, Bridged expands its pipeline to academically driven, career-focused students early in their journey.',
  partner1LogoUrl: 'https://dummyimage.com/140x60/1f2d3d/fff&text=ZENITH',
  partner2Name: 'REGGIE STEPHENS',
  partner2Founder: 'FOUNDER REGGIE STEPHENS X NFL',
  partner2Copy: "Founded by former NFL player Reggie Stephens, the Reggie Stephens Foundation empowers youth through sports, education, mentorship, and community programming — aligning directly with Bridged's mission to prepare the next generation for long-term career success.",
  partner2LogoUrl: 'https://dummyimage.com/140x60/1f2d3d/fff&text=RSF',
  footerHandle: '@bridgedplatform',
  contactEmail: 'nbowles@bridged.agency',
  websiteUrl: 'www.bridgedplatform.com',
}

export default function TestNewsletterPage() {
  const html = buildNewsletterHtml(sampleData)
  return (
    <div className="min-h-screen bg-[#f6f1ec] py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-lg border border-[#e6d6cb]">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  )
}
