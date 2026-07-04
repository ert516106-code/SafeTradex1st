import { X } from 'lucide-react';

export default function TermsModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        style={{ width: '100%', maxWidth: 512, backgroundColor: '#fff', borderRadius: '24px 24px 0 0', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px', flexShrink: 0 }}>
          <div style={{ width: 40, height: 4, borderRadius: 999, backgroundColor: '#d1d5db' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px 12px', borderBottom: '1px solid #f3f4f6', flexShrink: 0 }}>
          <h2 style={{ fontWeight: 700, fontSize: 18, margin: 0 }}>Terms of Service</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X style={{ width: 20, height: 20, color: '#9ca3af' }} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ overflowY: 'auto', padding: '20px 20px 40px', fontSize: 14, lineHeight: 1.7, color: '#374151' }}>
          <p style={{ color: '#6b7280', fontSize: 12, marginBottom: 20 }}>
            <strong>Effective Date:</strong> January 1, 2025 &nbsp;|&nbsp; <strong>Last Updated:</strong> May 27, 2026
          </p>

          <p style={{ marginBottom: 16 }}>
            Welcome to <strong>Ascendex</strong> ("Platform", "Company", "we", "us", or "our"). These Terms of Service ("Terms") govern your access to and use of our website, applications, software, products, and services related to digital assets, cryptocurrency services, and related technologies (collectively, the "Services").
          </p>
          <p style={{ marginBottom: 24 }}>
            By accessing or using the Services, you acknowledge that you have read, understood, and agreed to be legally bound by these Terms. If you do not agree to these Terms, you must not access or use the Services.
          </p>

          <Section title="1. Eligibility">
            <p>You may use the Services only if:</p>
            <ul>
              <li>You are at least eighteen (18) years of age or the legal age of majority in your jurisdiction;</li>
              <li>You possess the legal capacity to enter into binding agreements;</li>
              <li>Your use of the Services does not violate any applicable law or regulation;</li>
              <li>You are not subject to sanctions, restrictions, or prohibitions imposed by any governmental authority;</li>
              <li>You are not located in, under the control of, or a resident of any prohibited jurisdiction.</li>
            </ul>
            <p>The Company reserves the right to refuse, suspend, or terminate access to any user at its sole discretion where necessary for legal, regulatory, security, or compliance purposes.</p>
          </Section>

          <Section title="2. Regulatory Compliance">
            <p><strong>2.1 MiCA and European Union Compliance</strong></p>
            <p>The Company acknowledges the regulatory framework established under the European Union Markets in Crypto-Assets Regulation ("MiCA") and related financial regulations applicable within the European Economic Area ("EEA").</p>
            <p>Users residing within the European Union acknowledge and accept that:</p>
            <ul>
              <li>Certain digital assets, stablecoins, or crypto-related services may be restricted, unavailable, delayed, or modified due to MiCA requirements;</li>
              <li>Services available in non-EU jurisdictions may not be available to EU users;</li>
              <li>Additional compliance checks, verification procedures, reporting obligations, or limitations may apply;</li>
              <li>Certain stablecoins or crypto-assets may only be offered where legally authorized under applicable EU law;</li>
              <li>The Company may restrict access to products or features where regulatory authorization is unavailable or uncertain.</li>
            </ul>
            <p>The Company reserves the right to modify, suspend, or terminate any Service in response to regulatory developments without prior notice.</p>
            <p style={{ marginTop: 12 }}><strong>2.2 Licensing Disclaimer</strong></p>
            <p>Unless explicitly stated otherwise, nothing on the Platform constitutes a representation that the Company is licensed, authorized, or regulated in every jurisdiction where the Services may be accessible. Users are solely responsible for ensuring compliance with laws applicable to their jurisdiction.</p>
          </Section>

          <Section title="3. Account Registration and Verification">
            <p>To access certain Services, users may be required to create an account and provide accurate, current, and complete information. The Company reserves the right to require:</p>
            <ul>
              <li>Identity verification ("KYC");</li>
              <li>Source-of-funds verification;</li>
              <li>Enhanced due diligence;</li>
              <li>Ongoing compliance monitoring;</li>
              <li>Submission of government-issued identification or supporting documentation.</li>
            </ul>
            <p>Failure to provide requested information may result in suspension or termination of Services.</p>
          </Section>

          <Section title="4. Prohibited Activities">
            <p>Users shall not:</p>
            <ul>
              <li>Violate any applicable law, regulation, or governmental order;</li>
              <li>Use the Platform for money laundering, terrorist financing, fraud, or unlawful conduct;</li>
              <li>Engage in market manipulation, wash trading, spoofing, or deceptive practices;</li>
              <li>Use stolen payment methods or unauthorized funds;</li>
              <li>Circumvent sanctions, geographic restrictions, or compliance controls;</li>
              <li>Interfere with the security or integrity of the Platform;</li>
              <li>Attempt unauthorized access to systems, servers, or accounts;</li>
              <li>Use automated systems, bots, or scraping tools without written authorization;</li>
              <li>Misrepresent identity, affiliation, or ownership.</li>
            </ul>
          </Section>

          <Section title="5. Digital Asset Risks">
            <p>You acknowledge and agree that digital assets involve substantial risk, including but not limited to:</p>
            <ul>
              <li>Extreme price volatility;</li>
              <li>Market illiquidity;</li>
              <li>Technological vulnerabilities;</li>
              <li>Smart contract failures;</li>
              <li>Cybersecurity breaches;</li>
              <li>Regulatory uncertainty;</li>
              <li>Loss of private keys or credentials;</li>
              <li>Permanent loss of funds.</li>
            </ul>
            <p>The Company does not guarantee profitability, value retention, or protection against losses. You assume full responsibility for all trading, investment, and financial decisions.</p>
          </Section>

          <Section title="6. No Financial or Legal Advice">
            <p>The Services and all content provided by the Company are for informational purposes only and do not constitute financial, investment, legal, tax, or regulatory advice. Users should consult qualified professional advisors before engaging in crypto-asset transactions.</p>
          </Section>

          <Section title="7. Service Availability">
            <p>The Company may modify, suspend, restrict, or discontinue any portion of the Services at any time, including due to regulatory requirements, security concerns, technical maintenance, liquidity limitations, market disruptions, or third-party provider issues. The Company does not guarantee uninterrupted or error-free operation of the Services.</p>
          </Section>

          <Section title="8. Geographic Restrictions">
            <p>The Services may not be available in all jurisdictions. The Company reserves the right to block or restrict access based on geographic location, implement country-specific limitations, and deny Services where prohibited by law. Users may not use VPNs, proxies, or similar methods to circumvent geographic restrictions.</p>
          </Section>

          <Section title="9. Fees and Charges">
            <p>Users agree to pay all applicable fees associated with the Services, including trading fees, withdrawal fees, conversion fees, network or blockchain fees, and administrative or service charges. The Company reserves the right to modify fees at any time.</p>
          </Section>

          <Section title="10. Intellectual Property">
            <p>All content, software, trademarks, logos, designs, and materials associated with the Platform are owned by or licensed to the Company and protected under applicable intellectual property laws. Users may not reproduce, distribute, modify, reverse engineer, or commercially exploit any portion of the Services without prior written consent.</p>
          </Section>

          <Section title="11. Limitation of Liability">
            <p>To the maximum extent permitted by law, the Company and its affiliates, officers, directors, employees, contractors, and partners shall not be liable for indirect or consequential damages, loss of profits or revenue, trading losses, loss of digital assets, data loss, service interruptions, regulatory actions, unauthorized account access, or third-party conduct. The Services are provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind.</p>
          </Section>

          <Section title="12. Indemnification">
            <p>You agree to indemnify, defend, and hold harmless the Company and its affiliates from any claims, liabilities, damages, losses, costs, or expenses arising from your use of the Services, violation of these Terms, violation of applicable laws or regulations, or infringement of third-party rights.</p>
          </Section>

          <Section title="13. Suspension and Termination">
            <p>The Company may suspend, freeze, restrict, or terminate accounts or Services immediately and without prior notice where necessary to comply with legal obligations, prevent fraud or illegal activity, protect users or the Platform, investigate suspicious conduct, or respond to regulatory requirements. The Company shall not be liable for losses arising from such actions.</p>
          </Section>

          <Section title="14. Privacy and Data Protection">
            <p>Use of the Services is subject to the Company's Privacy Policy. Users acknowledge that personal data may be collected, processed, stored, and shared where necessary for compliance obligations, identity verification, fraud prevention, regulatory reporting, and operational purposes. Where applicable, processing of personal data shall comply with the EU General Data Protection Regulation ("GDPR") and related laws.</p>
          </Section>

          <Section title="15. Amendments">
            <p>The Company reserves the right to modify these Terms at any time. Updated Terms shall become effective upon publication on the Platform unless otherwise stated. Continued use of the Services after updates constitutes acceptance of the revised Terms.</p>
          </Section>

          <Section title="16. Governing Law and Jurisdiction">
            <p>These Terms shall be governed by and construed in accordance with applicable laws. Any dispute arising under or relating to these Terms shall be subject to the exclusive jurisdiction of the competent courts.</p>
          </Section>

          <Section title="17. Severability">
            <p>If any provision of these Terms is held invalid or unenforceable, the remaining provisions shall remain in full force and effect.</p>
          </Section>

          <Section title="18. Entire Agreement">
            <p>These Terms constitute the entire agreement between the user and the Company regarding the Services and supersede all prior agreements or understandings.</p>
          </Section>

          <Section title="19. Contact Information">
            <p>For legal, compliance, or support inquiries, please contact our support team through the platform's online service channel.</p>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: '#111827' }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {children}
      </div>
    </div>
  );
}
