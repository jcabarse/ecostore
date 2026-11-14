import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans px-6 py-12">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-[#F5EBE0]">
        <h1 className="text-3xl font-bold text-[#1B4332] mb-6">Privacy Policy & Terms</h1>
        <div className="prose text-gray-600 space-y-4">
          <p><strong>Last Updated:</strong> Demo Version</p>
          <p>This is a presentation demo for ECO STORE. In a production environment, this page will contain full compliance disclosures for:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Philippine Data Privacy Act of 2012 compliance</li>
            <li>GDPR/UK GDPR and CCPA/CPRA data handling procedures</li>
            <li>Cookie consent logging and tracking policies</li>
            <li>International payment gateway tax and data transfer notices</li>
          </ul>
          <p className="pt-6">
            <Link href="/" className="text-[#1B4332] font-semibold hover:underline">
              &larr; Return to Store
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}