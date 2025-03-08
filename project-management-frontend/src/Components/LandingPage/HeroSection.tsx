function HeroSection() {
  return (
    <section className="bg-white dark:bg-gray-900 "id="home">
      <div className="mx-auto mb-8 grid max-w-screen-xl px-4 py-12 lg:grid-cols-12 lg:gap-8 lg:py-16 xl:gap-12">
        {/* Left Content */}
        <div className="mr-auto place-self-center lg:col-span-6">
          <h1 className="mb-4 max-w-2xl text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white md:text-5xl xl:text-6xl">
            Boost Team Productivity with{" "}
            <span className="text-blue-600 dark:text-blue-400">AI-Driven</span>{" "}
            Project Management
          </h1>
          <p className="mb-6 max-w-2xl text-lg font-light text-gray-600 dark:text-gray-400 lg:mb-8 lg:text-xl">
            From task creation to real-time collaboration, teams worldwide use
            Taskify to streamline their workflow and meet deadlines
            effortlessly.
          </p>
          <a
            href="#"
            className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-6 py-3 text-base font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
          >
            Get Started
            <svg
              className="ml-2 size-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </a>
        </div>

        {/* Right Image */}
        <div className="hidden justify-center lg:col-span-6 lg:flex">
          <img
            src="src/assets/images/group-brainstorming.png"
            alt="Team collaboration"
            className="w-full max-w-lg"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
