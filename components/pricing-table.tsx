// components/PricingPlans.tsx
import React from 'react';

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  featured: boolean;
  ctaText?: string;
}

const PricingPlans: React.FC = () => {
  const plans: Plan[] = [
    {
      name: 'Free',
      price: '$0',
      period: '',
      description: 'Perfect for personal use',
      features: [
        '1 Personal Board',
        '5 Tasks/day',
        '5 Docs/day',
        "50MB Docs & Asset Storage",
        'Basic analytics',
        'Email support',
      ],
      featured: false,
      ctaText: 'Get Started'
    },
    {
      name: 'Pro',
      price: '$59',
      period: '/month',
      description: 'Best for growing teams and startups',
      features: [
        'Unlimited Personal Board',
        '5 Team Boards',
        '5 Members/Collaborators',
        '100 Tasks/day',
        'Unlimited Docs/day',
        "5GB Docs & Asset Storage",
        'Basic analytics',
        'Email support',
      ],
      featured: true,
      ctaText: 'Popular Choice'
    },
    {
      name: 'Lifetime',
      price: '$299',
      period: '/year',
      description: 'For large scale organizations',
      features: [
        'Unlimited Personal Board',
        'Unlimited Team Boards',
        'Unlimited Members/Collaborators',
        'Unlimited Tasks/day',
        'Unlimited Docs/day',
        "50GB Docs & Asset Storage",
        'Full analytics',
        'Email support (24x7)',
      ],
      featured: false,
      ctaText: 'Contact Sales'
    }
  ];

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Pricing Plans
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Choose the perfect plan for your needs
          </p>
        </div>

        <div className="mt-16 space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 bg-white border rounded-lg shadow-sm flex flex-col ${
                plan.featured ? 'border-indigo-500 ring-2 ring-blue-500' : 'border-gray-200'
              }`}
            >
              {plan.featured && (
                <div className="absolute top-0 py-1.5 px-4 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full text-xs font-semibold uppercase tracking-wide text-white transform -translate-y-1/2">
                  Most popular
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-5xl font-extrabold">{plan.price}</span>
                  <span className="ml-1 text-xl font-semibold">{plan.period}</span>
                </p>
                <p className="mt-4 text-gray-500">{plan.description}</p>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-3 text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href="#"
                className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium ${
                  plan.featured
                    ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white hover:bg-indigo-600'
                    : 'bg-indigo-50 text-blue-500 hover:bg-indigo-100'
                }`}
              >
                {plan.ctaText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;