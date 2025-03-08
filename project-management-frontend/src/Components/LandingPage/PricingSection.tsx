  function PricingSection() {
    const pricingPlans = [
      {
        title: 'Starter',
        description: 'Ideal for individuals looking to streamline their task management.',
        price: 0,
        features: [
          'Individual project configuration',
          'Real-time synchronization',
          'Team size: 1 user',
          'Basic support: 6 months',
          'Free updates: 6 months',
          'Access to core features'
        ],
      },
      {
        title: 'Team',
        description: 'Perfect for small teams needing advanced features and support.',
        price: 49,
        features: [
          'Individual project configuration',
          'Real-time synchronization',
          'Team size: Up to 10 users',
          'No setup or hidden fees',
          
          'Premium support: 12 months',
          
          'Advanced task management features',
          
        ],
      },
      
      {
        title: 'Enterprise',
        description: 'Designed for organizations needing scalability and extensive support.',
        price: 499,
        features: [
          'Individual project configuration',
          'Real-time synchronization',
          'Team size: 100+ users',
          'Dedicated account manager',
          'Premium support: 36 months',
          
          'All features included',
          
        ],
      },
    ];
    return (
      <section className="bg-slate-50 dark:bg-gray-900" id="pricing">
        <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
          <div className="mx-auto mb-8 flex max-w-screen-md flex-col items-center text-center lg:mb-12">
            <h2 className="mb-4 font-inter text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Unlock Exclusive Productivity Tips & AI Insights
            </h2>
            <p className="mb-5 inline-block whitespace-nowrap font-light text-gray-500 dark:text-gray-400 sm:text-xl">
              Subscribe to get the latest updates, exclusive productivity insights, and access to more features.
            </p>
          </div>

          <div className="space-y-8 sm:gap-6 lg:grid lg:grid-cols-3 lg:space-y-0 xl:gap-10">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className="mx-auto flex max-w-lg flex-col rounded-lg border border-gray-100 bg-white p-6 text-center text-gray-900 shadow dark:border-gray-600 dark:bg-gray-800 dark:text-white xl:p-8"
              >
                <h3 className="mb-4 text-2xl font-semibold">{plan.title}</h3>
                <p className="font-light text-gray-500 dark:text-gray-400 sm:text-lg">
                  {plan.description}
                </p>
                <div className="my-8 flex items-baseline justify-center">
                  <span className="mr-2 text-5xl font-extrabold">${plan.price}</span>
                  <span className="text-gray-500 dark:text-gray-400">/month</span>
                </div>
                <ul role="list" className="mb-8 space-y-4 text-left">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <svg
                        className="size-5 shrink-0 text-green-500 dark:text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900"
                >
                  Get started
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  export default PricingSection;
