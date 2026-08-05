import ProfilePageShell from "../components/profile/ProfilePageShell";

const sections = [
  {
    title: "Introduction",
    body: `Welcome to Ascendex ("Platform", "Company", "we", "us", or "our"). These Terms of Service ("Terms") govern your access to and use of our website, applications, software, products, and services related to digital assets, cryptocurrency services, and related technologies (collectively, the "Services").

By accessing or using the Services, you acknowledge that you have read, understood, and agreed to be legally bound by these Terms. If you do not agree to these Terms, you must not access or use the Services.`,
  },
  {
    title: "1. Eligibility",
    body: `You may use the Services only if:

You are at least eighteen (18) years of age or the legal age of majority in your jurisdiction;
You possess the legal capacity to enter into binding agreements;
Your use of the Services does not violate any applicable law or regulation;
You are not subject to sanctions, restrictions, or prohibitions imposed by any governmental authority;
You are not located in, under the control of, or a resident of any prohibited jurisdiction.

The Company reserves the right to refuse, suspend, or terminate access to any user at its sole discretion where necessary for legal, regulatory, security, or compliance purposes.`,
  },
  {
    title: "2. Regulatory Compliance",
    body: `2.1 MiCA and European Union Compliance

The Company acknowledges the regulatory framework established under the European Union Markets in Crypto-Assets Regulation ("MiCA") and related financial regulations applicable within the European Economic Area ("EEA").

Users residing within the European Union acknowledge and accept that:

Certain digital assets, stablecoins, or crypto-related services may be restricted, unavailable, delayed, or modified due to MiCA requirements;
Services available in non-EU jurisdictions may not be available to EU users;
Additional compliance checks, verification procedures, reporting obligations, or limitations may apply;
Certain stablecoins or crypto-assets may only be offered where legally authorized under applicable EU law;
The Company may restrict access to products or features where regulatory authorization is unavailable or uncertain.

The Company reserves the right to modify, suspend, or terminate any Service in response to regulatory developments without prior notice.

2.2 Licensing Disclaimer

Unless explicitly stated otherwise, nothing on the Platform constitutes a representation that the Company is licensed, authorized, or regulated in every jurisdiction where the Services may be accessible. Users are solely responsible for ensuring compliance with laws applicable to their jurisdiction.`,
  },
  {
    title: "3. Account Registration and Verification",
    body: `To access certain Services, users may be required to create an account and provide accurate, current, and complete information. The Company reserves the right to require:

Identity verification ("KYC");
Source-of-funds verification;
Enhanced due diligence;
Ongoing compliance monitoring;
Submission of government-issued identification or supporting documentation.

Failure to provide requested information may result in suspension or termination of Services.`,
  },
  {
    title: "4. Prohibited Activities",
    body: `Users shall not:

Violate any applicable law, regulation, or governmental order;
Use the Platform for money laundering, terrorist financing, fraud, or unlawful conduct;
Engage in market manipulation, wash trading, spoofing, or deceptive practices;
Use stolen payment methods or unauthorized funds;
Circumvent sanctions, geographic restrictions, or compliance controls;
Interfere with the security or integrity of the Platform;
Attempt unauthorized access to systems, servers, or accounts;
Use automated systems, bots, or scraping tools without written authorization;
Misrepresent identity, affiliation, or ownership.`,
  },
  {
    title: "5. Digital Asset Risks",
    body: `You acknowledge and agree that digital assets involve substantial risk, including but not limited to:

Extreme price volatility;
Market illiquidity;
Technological vulnerabilities;
Smart contract failures;
Cybersecurity breaches;
Regulatory uncertainty;
Loss of private keys or credentials;
Permanent loss of funds.

The Company does not guarantee profitability, value retention, or protection against losses. You assume full responsibility for all trading, investment, and financial decisions.`,
  },
  {
    title: "6. No Financial or Legal Advice",
    body: `The Services and all content provided by the Company are for informational purposes only and do not constitute financial, investment, legal, tax, or regulatory advice. Users should consult qualified professional advisors before engaging in crypto-asset transactions.`,
  },
  {
    title: "7. Service Availability",
    body: `The Company may modify, suspend, restrict, or discontinue any portion of the Services at any time, including due to regulatory requirements, security concerns, technical maintenance, liquidity limitations, market disruptions, or third-party provider issues. The Company does not guarantee uninterrupted or error-free operation of the Services.`,
  },
  {
    title: "8. Geographic Restrictions",
    body: `The Services may not be available in all jurisdictions. The Company reserves the right to block or restrict access based on geographic location, implement country-specific limitations, and deny Services where prohibited by law. Users may not use VPNs, proxies, or similar methods to circumvent geographic restrictions.`,
  },
  {
    title: "9. Fees and Charges",
    body: `Users agree to pay all applicable fees associated with the Services, including trading fees, withdrawal fees, conversion fees, network or blockchain fees, and administrative or service charges. The Company reserves the right to modify fees at any time.`,
  },
  {
    title: "10. Intellectual Property",
    body: `All content, software, trademarks, logos, designs, and materials associated with the Platform are owned by or licensed to the Company and protected under applicable intellectual property laws. Users may not reproduce, distribute, modify, reverse engineer, or commercially exploit any portion of the Services without prior written consent.`,
  },
  {
    title: "11. Limitation of Liability",
    body: `To the maximum extent permitted by law, the Company and its affiliates, officers, directors, employees, contractors, and partners shall not be liable for indirect or consequential damages, loss of profits or revenue, trading losses, loss of digital assets, data loss, service interruptions, regulatory actions, unauthorized account access, or third-party conduct. The Services are provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind.`,
  },
  {
    title: "12. Indemnification",
    body: `You agree to indemnify, defend, and hold harmless the Company and its affiliates from any claims, liabilities, damages, losses, costs, or expenses arising from your use of the Services, violation of these Terms, violation of applicable laws or regulations, or infringement of third-party rights.`,
  },
  {
    title: "13. Suspension and Termination",
    body: `The Company may suspend, freeze, restrict, or terminate accounts or Services immediately and without prior notice where necessary to comply with legal obligations, prevent fraud or illegal activity, protect users or the Platform, investigate suspicious conduct, or respond to regulatory requirements. The Company shall not be liable for losses arising from such actions.`,
  },
  {
    title: "14. Privacy and Data Protection",
    body: `Use of the Services is subject to the Company's Privacy Policy. Users acknowledge that personal data may be collected, processed, stored, and shared where necessary for compliance obligations, identity verification, fraud prevention, regulatory reporting, and operational purposes. Where applicable, processing of personal data shall comply with the EU General Data Protection Regulation ("GDPR") and related laws.`,
  },
  {
    title: "15. Amendments",
    body: `The Company reserves the right to modify these Terms at any time. Updated Terms shall become effective upon publication on the Platform unless otherwise stated. Continued use of the Services after updates constitutes acceptance of the revised Terms.`,
  },
  {
    title: "16. Governing Law and Jurisdiction",
    body: `These Terms shall be governed by and construed in accordance with applicable laws. Any dispute arising under or relating to these Terms shall be subject to the exclusive jurisdiction of the competent courts.`,
  },
  {
    title: "17. Severability",
    body: `If any provision of these Terms is held invalid or unenforceable, the remaining provisions shall remain in full force and effect.`,
  },
  {
    title: "18. Entire Agreement",
    body: `These Terms constitute the entire agreement between the user and the Company regarding the Services and supersede all prior agreements or understandings.`,
  },
  {
    title: "19. Contact Information",
    body: `For legal, compliance, or support inquiries, please contact our support team through the platform's online service channel.`,
  },
];

export default function TermsPrivacy() {
  return (
    <ProfilePageShell title="Terms of Service" subtitle="Legal information">
      <div
        style={{
          fontSize: 11.5,
          color: "#64748b",
          marginBottom: 4,
        }}
      >
        Effective Date: January 1, 2025 · Last Updated: May 27, 2026
      </div>

      {sections.map((section) => (
        <div
          key={section.title}
          style={{
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.09)",
            background: "rgba(255,255,255,0.03)",
            padding: 18,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{section.title}</div>
          <p
            style={{
              fontSize: 13,
              color: "#94a3b8",
              lineHeight: 1.6,
              whiteSpace: "pre-line",
            }}
          >
            {section.body}
          </p>
        </div>
      ))}
    </ProfilePageShell>
  );
}
