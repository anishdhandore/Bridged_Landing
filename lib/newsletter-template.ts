export type NewsletterTemplateData = {
  // Header
  welcomeLine: string
  mainTitle: string
  // Hero
  heroImageUrl: string
  year: string
  welcomeBadgeText: string
  headline: string
  subheadline: string
  introCopy: string
  athletesLabel: string
  athletesCopy: string
  companiesLabel: string
  companiesCopy: string
  heroTagline: string
  // What is Bridged section
  whatIsBridgedTitle: string
  whatIsBridgedSubtitle: string
  whatIsBridgedP1: string
  whatIsBridgedP2: string
  whatIsBridgedP3: string
  // Founder section
  founderSectionTitle: string
  founderImageUrl: string
  founderName: string
  founderQuote: string
  // Be on the lookout
  lookoutTitle: string
  interestedCardUrl: string
  // What's coming
  whatsComingTitle: string
  whatsComingIntro: string
  whatsComingBullets: string
  whatsComingClosing: string
  // Partnership spotlights
  partnershipTitle: string
  partnershipSubtitle: string
  partner1Name: string
  partner1Founder: string
  partner1Copy: string
  partner1LogoUrl: string
  partner2Name: string
  partner2Founder: string
  partner2Copy: string
  partner2LogoUrl: string
  // Footer
  footerHandle: string
  contactEmail: string
  websiteUrl: string
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const sanitizeText = (value: string) => escapeHtml(value.trim())

const SCRIPT_FONT = "'Brush Script MT','Snell Roundhand','Segoe Script','Lucida Handwriting',cursive"
const SERIF_FONT = "Georgia,'Times New Roman',serif"
const BODY_FONT = "Arial,Helvetica,sans-serif"
const NAVY = '#1f2d3d'
const COPPER = '#c9774a'
const BROWN_BADGE = '#9b6a4d'
const TAN_BG = '#fbf7f3'
const PAGE_BG = '#f6f1ec'
const DIVIDER = '#e6d6cb'
const BANNER_BG = '#b99a87'
const FOOTER_BG = '#0f0f12'

function buildBulletsTable(bulletsText: string): string {
  const items = bulletsText
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
  if (items.length === 0) return ''
  return items
    .map((item) => `<tr><td style="padding:2px 0;">&#9679;&nbsp; ${escapeHtml(item)}</td></tr>`)
    .join('')
}

export function buildNewsletterHtml(data: NewsletterTemplateData): string {
  const bulletsTable = buildBulletsTable(data.whatsComingBullets)

  const template = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Bridged Insider</title>
  </head>
  <body style="margin:0;padding:0;background:${PAGE_BG};">
    <table width="100%" cellpadding="0" cellspacing="0" bgcolor="${PAGE_BG}">
      <tr>
        <td align="center" style="padding:20px 0;">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:${TAN_BG};font-family:${BODY_FONT};color:${NAVY};">

            <!-- ═══ TOP NAV ═══ -->
            <tr>
              <td style="padding:18px 32px;border-bottom:1px solid #d7c9bf;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size:11px;letter-spacing:2px;font-weight:600;text-transform:uppercase;padding:0 18px 0 0;" width="20%">HOME</td>
                    <td style="font-size:11px;letter-spacing:2px;font-weight:600;text-transform:uppercase;padding:0 18px;" width="20%" align="center">ATHLETES</td>
                    <td style="font-size:20px;font-weight:700;font-family:${SERIF_FONT};letter-spacing:3px;padding:0 18px;" width="20%" align="center">BRIDGED</td>
                    <td style="font-size:11px;letter-spacing:2px;font-weight:600;text-transform:uppercase;padding:0 18px;" width="20%" align="center">COMPANIES</td>
                    <td style="font-size:11px;letter-spacing:2px;font-weight:600;text-transform:uppercase;padding:0 0 0 18px;" width="20%" align="right">ABOUT</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- ═══ HEADER ═══ -->
            <tr>
              <td align="center" style="padding:32px 24px 14px 24px;">
                <div style="font-size:28px;letter-spacing:1px;font-family:${SCRIPT_FONT};color:${NAVY};line-height:1.2;">{{welcome_line}}</div>
                <div style="font-size:46px;font-weight:900;letter-spacing:2px;margin-top:2px;font-family:${SERIF_FONT};color:${NAVY};line-height:1.1;">{{main_title}}</div>
              </td>
            </tr>

            <!-- ═══ HERO SECTION ═══ -->
            <tr>
              <td style="padding:12px 24px 20px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <!-- Hero image -->
                    <td width="46%" valign="top">
                      <img src="{{hero_image_url}}" width="250" style="width:100%;max-width:250px;display:block;border-radius:6px;" alt="Hero"/>
                    </td>
                    <td width="4%"></td>
                    <!-- Hero copy -->
                    <td width="50%" valign="top">
                      <!-- Badges -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
                        <tr>
                          <td><span style="display:inline-block;padding:5px 14px;background:${BROWN_BADGE};color:#fff;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:1px;">{{welcome_badge_text}}</span></td>
                          <td align="right"><span style="display:inline-block;padding:5px 14px;background:${BROWN_BADGE};color:#fff;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:1px;">{{year}}</span></td>
                        </tr>
                      </table>
                      <!-- Headline -->
                      <div style="font-size:19px;font-weight:900;font-family:${SERIF_FONT};color:${NAVY};line-height:1.2;margin:0 0 4px 0;text-transform:uppercase;">{{headline}}</div>
                      <div style="font-size:17px;font-weight:800;font-family:${SERIF_FONT};color:${COPPER};line-height:1.2;margin:0 0 10px 0;text-transform:uppercase;">{{subheadline}}</div>
                      <!-- Intro -->
                      <p style="font-size:12.5px;line-height:1.65;margin:0 0 10px 0;color:#333;">{{intro_copy}}</p>
                      <!-- Athletes -->
                      <p style="font-size:12.5px;line-height:1.65;margin:0 0 4px 0;color:#333;">
                        <span style="color:${COPPER};font-weight:700;font-style:italic;">{{athletes_label}}</span><br/>
                        {{athletes_copy}}
                      </p>
                      <!-- Companies -->
                      <p style="font-size:12.5px;line-height:1.65;margin:8px 0 4px 0;color:#333;">
                        <span style="color:${COPPER};font-weight:700;font-style:italic;">{{companies_label}}</span><br/>
                        {{companies_copy}}
                      </p>
                      <!-- Tagline -->
                      <p style="font-size:12px;color:${COPPER};font-style:italic;margin:10px 0 0 0;">{{hero_tagline}}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- ═══ DIVIDER ═══ -->
            <tr><td style="height:8px;background:linear-gradient(90deg,${DIVIDER},${BANNER_BG},${DIVIDER});"></td></tr>

            <!-- ═══ WHAT IS BRIDGED + FOUNDER ═══ -->
            <tr>
              <td style="padding:28px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <!-- Left: What is Bridged -->
                    <td width="48%" valign="top" style="padding-right:14px;">
                      <div style="font-size:22px;font-weight:900;font-family:${SERIF_FONT};color:${NAVY};line-height:1.2;margin:0 0 4px 0;text-transform:uppercase;">{{what_is_bridged_title}}</div>
                      <div style="font-size:16px;font-weight:800;font-family:${SERIF_FONT};color:${COPPER};line-height:1.2;margin:0 0 14px 0;text-transform:uppercase;">{{what_is_bridged_subtitle}}</div>
                      <p style="font-size:12.5px;line-height:1.65;margin:0 0 10px 0;color:#333;">{{what_is_bridged_p1}}</p>
                      <p style="font-size:12.5px;line-height:1.65;margin:0 0 10px 0;color:#333;">{{what_is_bridged_p2}}</p>
                      <p style="font-size:12.5px;line-height:1.65;margin:0;color:#333;">{{what_is_bridged_p3}}</p>
                    </td>
                    <!-- Right: Founder -->
                    <td width="4%"></td>
                    <td width="48%" valign="top">
                      <div style="font-size:20px;font-weight:900;font-family:${SERIF_FONT};color:${NAVY};line-height:1.2;margin:0 0 12px 0;text-transform:uppercase;">{{founder_section_title}}</div>
                      <img src="{{founder_image_url}}" width="250" style="width:100%;max-width:250px;display:block;border-radius:8px;" alt="Founder"/>
                      <p style="font-size:13px;color:${COPPER};margin:10px 0 2px 0;font-style:italic;font-weight:700;">{{founder_name}}</p>
                      <p style="font-size:12px;line-height:1.55;margin:0;color:#444;font-style:italic;">&ldquo;{{founder_quote}}&rdquo;</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- ═══ BE ON THE LOOKOUT ═══ -->
            <tr>
              <td style="padding:18px 24px;background:linear-gradient(135deg,${BANNER_BG},#a8846f);">
                <div style="font-size:26px;font-family:${SCRIPT_FONT};color:${NAVY};font-weight:400;line-height:1.2;">{{lookout_title}}</div>
              </td>
            </tr>

            <!-- ═══ INTERESTED + WHAT'S COMING ═══ -->
            <tr>
              <td style="padding:24px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <!-- Left: Interested card -->
                    <td width="46%" valign="top" style="padding-right:14px;">
                      <img src="{{interested_card_url}}" width="250" style="width:100%;max-width:250px;display:block;border-radius:10px;" alt="Interested"/>
                    </td>
                    <td width="4%"></td>
                    <!-- Right: What's coming -->
                    <td width="50%" valign="top">
                      <div style="font-size:24px;font-family:${SCRIPT_FONT};color:${COPPER};line-height:1.2;margin:0 0 12px 0;">{{whats_coming_title}}</div>
                      <p style="font-size:12.5px;line-height:1.6;margin:0 0 8px 0;color:#333;">{{whats_coming_intro}}</p>
                      <table cellpadding="0" cellspacing="0" style="font-size:12.5px;line-height:1.7;color:#333;">{{whats_coming_bullets}}</table>
                      <p style="font-size:12.5px;line-height:1.6;margin:12px 0 0 0;color:#333;">{{whats_coming_closing}}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- ═══ PARTNERSHIP SPOTLIGHTS BANNER ═══ -->
            <tr>
              <td style="padding:18px 24px;background:linear-gradient(135deg,${BANNER_BG},#a8846f);">
                <div style="font-size:28px;font-weight:900;font-family:${SERIF_FONT};color:${NAVY};line-height:1.2;text-transform:uppercase;">{{partnership_title}}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 24px 6px 24px;">
                <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;line-height:1.5;margin:0;color:${NAVY};">{{partnership_subtitle}}</p>
              </td>
            </tr>

            <!-- ═══ PARTNERS ═══ -->
            <tr>
              <td style="padding:16px 24px 28px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <!-- Partner 1 -->
                    <td width="48%" valign="top" style="padding-right:14px;">
                      <div style="font-size:18px;font-weight:900;font-family:${SERIF_FONT};color:${NAVY};letter-spacing:2px;text-transform:uppercase;margin:0 0 4px 0;">{{partner1_name}}</div>
                      <p style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px 0;color:#555;">{{partner1_founder}}</p>
                      <p style="font-size:12px;line-height:1.6;margin:0 0 12px 0;color:#333;">{{partner1_copy}}</p>
                      <img src="{{partner1_logo_url}}" width="140" style="display:block;max-width:140px;" alt="Partner 1"/>
                    </td>
                    <td width="4%"></td>
                    <!-- Partner 2 -->
                    <td width="48%" valign="top">
                      <div style="font-size:18px;font-weight:900;font-family:${SERIF_FONT};color:${NAVY};letter-spacing:2px;text-transform:uppercase;margin:0 0 4px 0;">{{partner2_name}}</div>
                      <p style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px 0;color:#555;">{{partner2_founder}}</p>
                      <p style="font-size:12px;line-height:1.6;margin:0 0 12px 0;color:#333;">{{partner2_copy}}</p>
                      <img src="{{partner2_logo_url}}" width="140" style="display:block;max-width:140px;" alt="Partner 2"/>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- ═══ FOOTER ═══ -->
            <tr>
              <td style="padding:18px 24px;background:${FOOTER_BG};color:#ffffff;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size:12px;color:#ccc;" width="33%">&#9675; {{footer_handle}}</td>
                    <td style="font-size:12px;color:#ccc;" width="34%" align="center">&#9993; {{contact_email}}</td>
                    <td style="font-size:12px;color:#ccc;" width="33%" align="right">&#9741; {{website_url}}</td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

  return template
    .replace('{{welcome_line}}', sanitizeText(data.welcomeLine))
    .replace('{{main_title}}', sanitizeText(data.mainTitle))
    .replace('{{hero_image_url}}', sanitizeText(data.heroImageUrl))
    .replace('{{year}}', sanitizeText(data.year))
    .replace('{{welcome_badge_text}}', sanitizeText(data.welcomeBadgeText))
    .replace('{{headline}}', sanitizeText(data.headline))
    .replace('{{subheadline}}', sanitizeText(data.subheadline))
    .replace('{{intro_copy}}', sanitizeText(data.introCopy))
    .replace('{{athletes_label}}', sanitizeText(data.athletesLabel))
    .replace('{{athletes_copy}}', sanitizeText(data.athletesCopy))
    .replace('{{companies_label}}', sanitizeText(data.companiesLabel))
    .replace('{{companies_copy}}', sanitizeText(data.companiesCopy))
    .replace('{{hero_tagline}}', sanitizeText(data.heroTagline))
    .replace('{{what_is_bridged_title}}', sanitizeText(data.whatIsBridgedTitle))
    .replace('{{what_is_bridged_subtitle}}', sanitizeText(data.whatIsBridgedSubtitle))
    .replace('{{what_is_bridged_p1}}', sanitizeText(data.whatIsBridgedP1))
    .replace('{{what_is_bridged_p2}}', sanitizeText(data.whatIsBridgedP2))
    .replace('{{what_is_bridged_p3}}', sanitizeText(data.whatIsBridgedP3))
    .replace('{{founder_section_title}}', sanitizeText(data.founderSectionTitle))
    .replace('{{founder_image_url}}', sanitizeText(data.founderImageUrl))
    .replace('{{founder_name}}', sanitizeText(data.founderName))
    .replace('{{founder_quote}}', sanitizeText(data.founderQuote))
    .replace('{{lookout_title}}', sanitizeText(data.lookoutTitle))
    .replace('{{interested_card_url}}', sanitizeText(data.interestedCardUrl))
    .replace('{{whats_coming_title}}', sanitizeText(data.whatsComingTitle).replace(/\n/g, '<br/>'))
    .replace('{{whats_coming_intro}}', sanitizeText(data.whatsComingIntro))
    .replace('{{whats_coming_bullets}}', bulletsTable)
    .replace('{{whats_coming_closing}}', sanitizeText(data.whatsComingClosing).replace(/\n/g, '<br/>'))
    .replace('{{partnership_title}}', sanitizeText(data.partnershipTitle))
    .replace('{{partnership_subtitle}}', sanitizeText(data.partnershipSubtitle))
    .replace('{{partner1_name}}', sanitizeText(data.partner1Name))
    .replace('{{partner1_founder}}', sanitizeText(data.partner1Founder))
    .replace('{{partner1_copy}}', sanitizeText(data.partner1Copy))
    .replace('{{partner1_logo_url}}', sanitizeText(data.partner1LogoUrl))
    .replace('{{partner2_name}}', sanitizeText(data.partner2Name))
    .replace('{{partner2_founder}}', sanitizeText(data.partner2Founder))
    .replace('{{partner2_copy}}', sanitizeText(data.partner2Copy))
    .replace('{{partner2_logo_url}}', sanitizeText(data.partner2LogoUrl))
    .replace('{{footer_handle}}', sanitizeText(data.footerHandle))
    .replace('{{contact_email}}', sanitizeText(data.contactEmail))
    .replace('{{website_url}}', sanitizeText(data.websiteUrl))
}
