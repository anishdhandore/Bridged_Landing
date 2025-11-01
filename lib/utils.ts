import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createPageUrl(pageName: string): string {
  // Map "Home" to root route
  if (pageName.toLowerCase() === 'home') {
    return '/'
  }
  
  // Map specific page names to their actual routes
  const routeMap: Record<string, string> = {
    'bookcampaign': '/book-campaign',
    'athletesignup': '/athlete-signup',
    'athleteprofile': '/athlete-profile',
    'athletedashboard': '/athlete-dashboard',
    'companysignup': '/company-signup',
    'companydashboard': '/company-dashboard',
    'partnershipapplication': '/partnership-application',
    'partnershipapplicationsuccess': '/partnership-application-success',
    'partnershipdashboard': '/partnership-dashboard',
    'athleticdepartmentportal': '/athletic-department-portal',
    'blogpost': '/blog-post',
    'modellistenrollment': '/model-list-enrollment',
    'stripecheckout': '/stripe-checkout',
    'contentproposal': '/content-proposal',
  }
  
  const normalizedName = pageName.toLowerCase().replace(/ /g, '')
  if (routeMap[normalizedName]) {
    return routeMap[normalizedName]
  }
  
  return '/' + pageName.toLowerCase().replace(/ /g, '-')
}
