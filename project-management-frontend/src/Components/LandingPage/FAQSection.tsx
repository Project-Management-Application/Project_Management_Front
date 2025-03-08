
function FAQSection() {
  return (
    <section className="bg-white dark:bg-gray-900" id="faq">
  <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
      <h2 className="mb-8 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">Frequently asked questions</h2>
      <div className="grid border-t border-gray-200 pt-8 text-left dark:border-gray-700 md:grid-cols-2 md:gap-16">
          <div>
              <div className="mb-10">
                  <h3 className="mb-4 flex items-center text-lg font-medium text-gray-900 dark:text-white">
                      <svg className="mr-2 size-5 shrink-0 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>
                      What is this project management tool, and who is it for?
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">Our platform is an all-in-one project management tool designed for teams of all sizes. Whether you're a startup, enterprise, or freelancer, you can use it to organize tasks, collaborate in real-time, and streamline your workflows.</p>
              </div>
              
              <div className="mb-10">
                  <h3 className="mb-4 flex items-center text-lg font-medium text-gray-900 dark:text-white">
                      <svg className="mr-2 size-5 shrink-0 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>
                      Does this tool support remote collaboration?
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">Absolutely! Our platform is built for remote teams, offering real-time updates, task assignments, file sharing, and communication features to keep your team in sync no matter where they are.</p>
                  
              </div>
              <div className="mb-10">
                  <h3 className="mb-4 flex items-center text-lg font-medium text-gray-900 dark:text-white">
                      <svg className="mr-2 size-5 shrink-0 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>
                      How secure is my data on this platform?
                      
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">Security is our top priority. We use industry-standard encryption, regular security audits, and strict access controls to ensure your data is protected at all times.</p>
                  
              </div>
          </div>
          <div>
              <div className="mb-10">
                  <h3 className="mb-4 flex items-center text-lg font-medium text-gray-900 dark:text-white">
                      <svg className="mr-2 size-5 shrink-0 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>
                      Can I customize workflows to fit my team’s needs?
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">Yes! Our tool supports custom workflows, allowing you to use Kanban, Scrum, Agile, or create a workflow that best fits your team’s needs. You can define task priorities, automate processes, and track progress effortlessly.</p>
              </div>
              <div className="mb-10">
                  <h3 className="mb-4 flex items-center text-lg font-medium text-gray-900 dark:text-white">
                      <svg className="mr-2 size-5 shrink-0 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>
                      How is AI used in the application?
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                  The application utilizes AI to automatically prioritize tasks based on workload and deadlines, generate reminders for anticipated delays, and analyze productivity trends to provide recommendations for improving efficiency.
</p>
              </div>
              <div className="mb-10">
                  <h3 className="mb-4 flex items-center text-lg font-medium text-gray-900 dark:text-white">
                      <svg className="mr-2 size-5 shrink-0 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>
                      How does the application ensure real-time synchronization?
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">Using advanced synchronization technology, all changes made by team members are updated instantly for all users, ensuring that everyone is working with the most current information.</p>
                  
              </div>
              
          </div>
      </div>
  </div>
</section>
  )
}

export default FAQSection