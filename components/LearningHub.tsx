import React, { useState } from 'react';
import { ChevronDownIcon } from './icons';
import { ScenarioSimulator } from './ScenarioSimulator';
import { Quiz } from './Quiz';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, isOpen, onClick }) => {
  return (
    <div className="border-b border-white/10 last:border-b-0">
      <h2>
        <button
          type="button"
          className="flex justify-between items-center w-full p-5 font-medium text-left text-gray-300 hover:bg-white/5 transition-colors"
          onClick={onClick}
          aria-expanded={isOpen}
        >
          <span>{title}</span>
          <ChevronDownIcon className={`w-5 h-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </h2>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-5 border-t border-white/10">
            <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const learningContent = [
    {
      title: 'What is Phishing?',
      content: (
        <>
          <p>Phishing is a type of cyber attack where attackers try to trick you into giving them your sensitive information, like passwords, credit card numbers, or personal details. They do this by pretending to be someone you trust, like your bank, a social media site, or even a friend.</p>
          <h4 className="text-gray-200 font-semibold mt-4 mb-2">How it works:</h4>
          <ul>
            <li>You receive an email, text message, or direct message that looks legitimate.</li>
            <li>It often creates a sense of urgency, like "Your account will be suspended!" or "You've won a prize!".</li>
            <li>It contains a link or an attachment. Clicking the link takes you to a fake website that looks real, where you're asked to enter your information.</li>
          </ul>
          <h4 className="text-gray-200 font-semibold mt-4 mb-2">Key takeaway:</h4>
          <p>Always be suspicious of unexpected messages that ask for your personal information or urge you to act quickly. Check the sender's address carefully and never click on suspicious links.</p>
        </>
      ),
    },
    {
      title: 'How to Recognize Scams',
      content: (
        <>
          <p>Scammers are creative, but their tactics often have common warning signs. Learning to spot these red flags is your best defense.</p>
          <h4 className="text-gray-200 font-semibold mt-4 mb-2">Look out for:</h4>
          <ul>
            <li><strong>Sense of Urgency:</strong> Scammers pressure you to act fast so you don't have time to think (e.g., "Limited time offer!", "Act now!").</li>
            <li><strong>Too Good to Be True:</strong> Offers of free money, lottery winnings, or unbelievable discounts are almost always scams.</li>
            <li><strong>Unusual Payment Methods:</strong> Requests for payment via gift cards, wire transfers, or cryptocurrency are a major red flag.</li>
            <li><strong>Spelling and Grammar Mistakes:</strong> Professional companies usually proofread their communications. Obvious errors can indicate a scam.</li>
            <li><strong>Threats or Blackmail:</strong> Messages that threaten you or try to scare you into doing something are a clear sign of a scam.</li>
          </ul>
        </>
      ),
    },
    {
        title: 'Protecting Your Online Privacy',
        content: (
          <>
            <p>Your personal information is valuable. Protecting it online is crucial to avoid identity theft and unwanted attention.</p>
            <h4 className="text-gray-200 font-semibold mt-4 mb-2">Simple steps to improve your privacy:</h4>
            <ul>
              <li><strong>Use Strong, Unique Passwords:</strong> Combine letters, numbers, and symbols. Use a password manager to keep track of them.</li>
              <li><strong>Enable Two-Factor Authentication (2FA):</strong> This adds an extra layer of security to your accounts, requiring a second step (like a code from your phone) to log in.</li>
              <li><strong>Be Careful What You Share:</strong> Think twice before posting personal information like your full name, address, phone number, or birthday on social media.</li>
              <li><strong>Review App Permissions:</strong> Check what access you've granted to apps on your phone and computer. Does that game really need access to your contacts?</li>
              <li><strong>Beware of Public Wi-Fi:</strong> Avoid accessing sensitive accounts (like banking) on unsecured public Wi-Fi networks. Use a VPN for better protection.</li>
            </ul>
          </>
        ),
      },
  ];

export const LearningHub: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="space-y-8">
            <div className="card">
                <div className="p-0">
                    <h2 className="text-2xl font-bold text-white">Knowledge Base</h2>
                    <p className="mt-2 text-gray-400">Strengthen your digital defenses. Learn how to spot and avoid common online threats.</p>
                </div>
                <div id="accordion-flush" className="mt-4 -mx-6">
                {learningContent.map((item, index) => (
                    <AccordionItem
                        key={index}
                        title={item.title}
                        isOpen={openIndex === index}
                        onClick={() => handleToggle(index)}
                    >
                        {item.content}
                    </AccordionItem>
                ))}
                </div>
            </div>

            <ScenarioSimulator />

            <Quiz />
        </div>
    );
};
