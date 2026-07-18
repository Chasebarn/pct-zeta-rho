/* Career Navigator content library.
   Every sentence here comes from the fixed specification — edit copy here,
   never in career.html. To edit one major, find its object in MAJORS. */
window.CAREER_DATA = (function () {
  "use strict";

  var STAGE_ORDER = ["freshman", "sophomore", "junior", "senior", "postGrad"];

  var STAGE_LABELS = {
    freshman: "Freshman",
    sophomore: "Sophomore",
    junior: "Junior",
    senior: "Senior",
    postGrad: "Post-Grad"
  };

  var STAGE_BLOCKS = {
    freshman: "You are still early in college, so the goal is not to have your entire career figured out. This stage is mostly about understanding the field, building a professional foundation, and giving yourself enough exposure to make better decisions later.",
    sophomore: "You are at the point where general interest should begin turning into experience. The strongest use of this stage is taking on real responsibility, learning how recruiting works in your field, and beginning to test the kinds of work you may want after graduation.",
    junior: "You are entering the stage where employers will care more about what you have actually done. Focus on relevant experience, clear evidence of your contribution, and a more intentional approach to internships and future roles.",
    senior: "You are in the conversion stage now. The priority is turning your coursework, experience, projects, and relationships into a credible post-graduation direction rather than adding random activities at the last minute.",
    postGrad: "You are past the campus-building stage and into the part where experience needs to become leverage. The first role does not have to be perfect, but it should help you build useful skills, measurable accomplishments, and a clearer next move."
  };

  var CERTAINTY_BLOCKS = {
    confident: "You said you feel confident about your major, which is a strong starting point.",
    evaluating: "You said you think the major fits, but you are still evaluating it. That is normal, and the best test is comparing the classroom version of the subject with the work people actually perform.",
    considering_change: "You mentioned that you are seriously considering another major. Before switching, compare the work, recruiting path, required skills, and long-term flexibility of both options instead of judging the decision through one class or one difficult semester.",
    unsure: "You said you are not currently sure whether the major is right for you. You do not need to force certainty immediately, but you should use projects, conversations, coursework, and early experience to test the direction instead of drifting further into it without evidence."
  };

  var DIRECTION_BLOCKS = {
    clear: "You also have a clear idea of the kind of work you want, so use the roadmap to build experience and proof around that direction.",
    narrowing: "You are still choosing between a few directions, which is completely workable. You do not need a permanent answer today. You need enough exposure to compare the options before recruiting becomes urgent.",
    unclear_roles: "You understand the major generally but are less clear on the jobs connected to it. It would help to compare a few common roles based on the daily work, the skills they reward, and the kind of environment you would actually enjoy.",
    no_direction: "You are not yet sure what you would do with the degree. That does not make the degree useless, but it does mean you should explore real roles before sending applications without a target."
  };

  function stage(title, objective, milestones) {
    return { title: title, objective: objective, milestones: milestones };
  }
  function m(id, title) { return { id: id, title: title }; }

  var MAJORS = [

    {
      id: "accountancy",
      name: "Accountancy and Analytics",
      overview: "Accountancy and Analytics can lead into public accounting, corporate accounting, audit, tax, advisory, compliance, government, nonprofit work, and financial reporting. The field rewards accuracy, judgment, ethics, and the ability to explain what financial information means for a business.",
      dailyLife: "The daily work often involves reviewing records, testing controls, preparing or interpreting reports, investigating differences, communicating with clients or internal teams, and using systems or data to make financial information more reliable.",
      commonConcern: "A common concern is that accounting will feel repetitive or lock someone into one narrow lane. The early work can be structured, but the degree can lead toward advisory, analytics, systems, forensics, leadership, and specialized industry roles as experience grows.",
      closingGuidance: "What matters most is building technical credibility early, understanding whether a credential such as the CPA fits your goals, and gaining enough real exposure to choose between public, corporate, government, nonprofit, or advisory work.",
      directions: ["Audit and assurance", "Tax", "Corporate accounting and financial reporting", "Advisory and consulting", "Forensics and compliance", "Government or nonprofit accounting"],
      competitiveFactors: ["Strong accounting fundamentals", "Excel and data-analysis ability", "Attention to detail without losing the business context", "Internship exposure", "A clear CPA or non-CPA plan"],
      misconception: "Accounting is not only bookkeeping. Much of the work involves judgment, controls, risk, analysis, regulation, and communication.",
      stages: {
        freshman: stage("Build the accounting foundation",
          "Learn what accountants actually do and build the academic and professional foundation required for more advanced coursework.", [
          m("accountancy-freshman-compare-paths", "Understand the differences between audit, tax, corporate accounting, advisory, government, nonprofit, and forensic work."),
          m("accountancy-freshman-resume-linkedin", "Build a basic resume and LinkedIn profile that can grow as experience is added."),
          m("accountancy-freshman-join-activity", "Join one meaningful accounting, business, service, or professional activity."),
          m("accountancy-freshman-excel-fundamentals", "Strengthen Excel, business math, and introductory financial-statement understanding.")
        ]),
        sophomore: stage("Prepare for accounting recruiting",
          "Move from general business preparation into accounting-specific exposure and early recruiting awareness.", [
          m("accountancy-sophomore-recruiting-calendar", "Learn the internship and recruiting calendar used by accounting firms and corporate accounting teams."),
          m("accountancy-sophomore-employer-events", "Attend employer events, accounting panels, career fairs, or conversations with professionals."),
          m("accountancy-sophomore-intermediate-coursework", "Begin intermediate accounting and analytics coursework with a focus on understanding, not memorization alone."),
          m("accountancy-sophomore-cpa-mapping", "Decide whether the CPA path is worth exploring and map the education requirements with an advisor.")
        ]),
        junior: stage("Prove technical and professional ability",
          "Use internships and higher-level coursework to test the field and build credible accounting experience.", [
          m("accountancy-junior-internship", "Secure or complete an accounting, audit, tax, finance, compliance, or analytics internship."),
          m("accountancy-junior-explain-statements", "Become comfortable explaining financial statements, controls, reconciliations, and accounting decisions."),
          m("accountancy-junior-data-tools", "Build experience with Excel, accounting systems, visualization, or data tools used to analyze financial information."),
          m("accountancy-junior-professional-relationships", "Develop relationships with professionals who can explain different firms, industries, and career tracks.")
        ]),
        senior: stage("Convert preparation into a first role",
          "Choose a direction and turn accounting preparation into a clear post-graduation plan.", [
          m("accountancy-senior-focused-search", "Run a focused search for public, corporate, government, nonprofit, advisory, or related roles."),
          m("accountancy-senior-present-experience", "Present internship, class, and project experience through clear examples of accuracy, judgment, and problem-solving."),
          m("accountancy-senior-credential-plan", "Finalize the CPA, graduate-credit, or alternative credential plan that fits the selected path."),
          m("accountancy-senior-evaluate-offers", "Evaluate offers based on training, team quality, workload, specialization, and long-term mobility.")
        ]),
        postGrad: stage("Build credibility and specialization",
          "Turn the first role into technical credibility, business understanding, and a useful specialty.", [
          m("accountancy-postgrad-learn-systems", "Learn the organization's systems, reporting cycle, controls, clients, and industry context."),
          m("accountancy-postgrad-cpa-exams", "Complete CPA exams or other relevant credentials when they support the chosen path."),
          m("accountancy-postgrad-measurable-examples", "Build measurable examples of improved accuracy, efficiency, insight, compliance, or client service."),
          m("accountancy-postgrad-next-step", "Decide whether the next step is promotion, specialization, advisory work, leadership, or a strategic move.")
        ])
      }
    },

    {
      id: "advertising",
      name: "Advertising",
      overview: "Advertising combines business strategy with audience insight, communication, media, creative development, and campaign execution. Common directions include account management, media, creative work, strategy, digital advertising, production, traffic, and direct marketing.",
      dailyLife: "The daily work can involve writing briefs, researching audiences, presenting ideas, coordinating creative teams, managing clients, selecting media, tracking campaign performance, and keeping projects moving through deadlines and feedback.",
      commonConcern: "A common concern is that advertising is only for designers or extremely creative people. Creative talent helps in some roles, but agencies and in-house teams also need strategists, account managers, researchers, analysts, media planners, producers, and organized project leaders.",
      closingGuidance: "The strongest students do not rely on the degree title alone. They build a body of work that shows how they understand an audience, make decisions, collaborate, and connect an idea to a real business goal.",
      directions: ["Account management", "Creative and copywriting", "Media planning and buying", "Brand and campaign strategy", "Digital advertising", "Production and project coordination"],
      competitiveFactors: ["Strong communication", "Campaign or portfolio work", "Understanding of audience and strategy", "Reliable project execution", "Internship or client exposure"],
      misconception: "Advertising is not only making visuals or slogans. A large part of the field is research, planning, client service, media, operations, and business decision-making.",
      stages: {
        freshman: stage("Explore the advertising system",
          "Understand how strategy, creative, media, accounts, and production work together.", [
          m("advertising-freshman-compare-roles", "Compare account management, creative, strategy, media, digital, research, and production roles."),
          m("advertising-freshman-resume-portfolio-space", "Build a basic resume, LinkedIn profile, and organized place to save future work samples."),
          m("advertising-freshman-join-org", "Join one meaningful organization, publication, agency-style group, or communications activity."),
          m("advertising-freshman-small-project", "Complete one small project involving an audience, message, promotion, or campaign idea.")
        ]),
        sophomore: stage("Build real campaign evidence",
          "Move beyond classroom knowledge and create work that shows strategic thinking and execution.", [
          m("advertising-sophomore-real-campaign", "Contribute to a real campaign, event promotion, client project, publication, or organization initiative."),
          m("advertising-sophomore-creative-brief", "Learn how to write or interpret a creative brief and connect the work to a business objective."),
          m("advertising-sophomore-portfolio", "Begin building a portfolio or case-study collection with context, process, and outcomes."),
          m("advertising-sophomore-research-agencies", "Research agencies, in-house teams, and internship timelines before applications become urgent.")
        ]),
        junior: stage("Test the field professionally",
          "Gain agency, client, media, or in-house experience and clarify which side of advertising fits best.", [
          m("advertising-junior-internship", "Secure or complete an advertising, marketing, media, communications, or client-services internship."),
          m("advertising-junior-own-deliverable", "Own a meaningful deliverable instead of only observing or completing minor tasks."),
          m("advertising-junior-case-studies", "Turn the strongest projects into concise case studies showing the problem, audience, decisions, and result."),
          m("advertising-junior-practitioner-relationships", "Build relationships with practitioners who can explain agency culture, role expectations, and hiring standards.")
        ]),
        senior: stage("Package the work and target the right roles",
          "Convert the portfolio and experience into a focused entry-level search.", [
          m("advertising-senior-target-roles", "Select a manageable set of target roles rather than applying to every advertising title."),
          m("advertising-senior-polish-portfolio", "Polish the portfolio, work samples, resume, and interview stories around the chosen direction."),
          m("advertising-senior-pursue-opportunities", "Pursue agency, brand, media, production, creative, or account opportunities that fit the available evidence."),
          m("advertising-senior-evaluate-offers", "Evaluate offers based on mentorship, workload, quality of work, client exposure, and room to grow.")
        ]),
        postGrad: stage("Develop a clear professional identity",
          "Become known for reliable execution and a useful specialty inside the advertising process.", [
          m("advertising-postgrad-learn-workflow", "Learn the agency or in-house workflow, client expectations, approval process, and performance measures."),
          m("advertising-postgrad-body-of-work", "Build a stronger body of work with real campaigns, decisions, and outcomes."),
          m("advertising-postgrad-specialty", "Deepen into strategy, creative, media, accounts, analytics, production, or another valuable specialty."),
          m("advertising-postgrad-next-move", "Decide whether the next move is greater client ownership, a stronger portfolio, team leadership, or a different environment.")
        ])
      }
    },

    {
      id: "ai-analytics",
      name: "Artificial Intelligence and Business Analytics",
      overview: "Artificial Intelligence and Business Analytics sits between data, machine learning, business decisions, and operational improvement. It can lead toward AI analysis, business intelligence, data science, machine-learning analysis, database work, algorithm development, and other analytics roles.",
      dailyLife: "The daily work may involve cleaning data, building models, testing assumptions, writing code, interpreting results, developing dashboards, documenting methods, and explaining what an analysis means to people who are not technical specialists.",
      commonConcern: "A common concern is that the field changes too quickly to keep up. Tools will change, but the durable advantage comes from strong fundamentals, careful reasoning, ethical judgment, and the ability to connect technical work to an actual business problem.",
      closingGuidance: "Do not rely on course completion alone. Build projects that show how you framed a problem, worked with data, evaluated the result, and translated the work into a useful recommendation or system.",
      directions: ["AI analyst", "Business intelligence analyst", "Data analyst or data scientist", "Machine-learning analyst", "Database or data-warehouse roles", "Analytics consulting"],
      competitiveFactors: ["Python, SQL, statistics, and data preparation", "Projects using real or realistic datasets", "Clear communication of technical findings", "Responsible AI and model-evaluation awareness", "Internship or applied-project experience"],
      misconception: "Using an AI tool is not the same as understanding AI and analytics. Employers care about data quality, reasoning, evaluation, implementation, and business impact.",
      stages: {
        freshman: stage("Build technical and business fundamentals",
          "Develop the baseline needed to understand both the data and the business problem.", [
          m("ai-analytics-freshman-python-sql", "Build introductory ability in Python, SQL, spreadsheets, and basic statistics."),
          m("ai-analytics-freshman-business-use", "Learn how businesses use data and AI to support decisions, operations, and customer experiences."),
          m("ai-analytics-freshman-github", "Create a GitHub profile or organized project space for technical work."),
          m("ai-analytics-freshman-first-project", "Complete one small analysis or automation project and explain the business question behind it.")
        ]),
        sophomore: stage("Turn coursework into applied projects",
          "Use stronger technical skills to solve increasingly realistic business problems.", [
          m("ai-analytics-sophomore-applied-project", "Build a project involving data cleaning, visualization, prediction, classification, or business intelligence."),
          m("ai-analytics-sophomore-model-evaluation", "Learn how to evaluate model quality, bias, limitations, and whether the result is actually useful."),
          m("ai-analytics-sophomore-competition", "Join a competition, research project, technical organization, or team-based analytics experience."),
          m("ai-analytics-sophomore-internship-pursuit", "Begin pursuing analytics, data, technology, or AI-related internships.")
        ]),
        junior: stage("Prove that the work transfers beyond class",
          "Gain applied experience and build a portfolio that demonstrates both technical ability and business judgment.", [
          m("ai-analytics-junior-internship", "Secure or complete an AI, analytics, data, business-intelligence, research, or technology internship."),
          m("ai-analytics-junior-substantial-project", "Build one substantial project with a clear problem, reproducible process, evaluation, and final recommendation."),
          m("ai-analytics-junior-communication", "Practice explaining technical work to nontechnical decision-makers without hiding behind jargon."),
          m("ai-analytics-junior-narrow-direction", "Narrow toward a useful direction such as AI analysis, business intelligence, data science, data engineering, or consulting.")
        ]),
        senior: stage("Convert technical proof into a focused search",
          "Package the strongest projects and experience for roles that match the student's actual depth.", [
          m("ai-analytics-senior-portfolio", "Build a focused portfolio with code, documentation, visuals, limitations, and business outcomes."),
          m("ai-analytics-senior-interview-prep", "Prepare for technical assessments, case interviews, and behavioral questions about project decisions."),
          m("ai-analytics-senior-targeted-search", "Run a targeted search for AI, analytics, data, business-intelligence, and related roles."),
          m("ai-analytics-senior-evaluate-roles", "Evaluate roles based on data access, mentorship, technical standards, ethical practices, and responsibility.")
        ]),
        postGrad: stage("Build production-level judgment",
          "Move from classroom projects into reliable systems, decisions, and measurable business results.", [
          m("ai-analytics-postgrad-learn-environment", "Learn the organization's data environment, governance, users, and business model."),
          m("ai-analytics-postgrad-own-product", "Own a model, dashboard, analysis, workflow, or data product that people actually use."),
          m("ai-analytics-postgrad-skills", "Improve skills in monitoring, documentation, security, ethics, and communication."),
          m("ai-analytics-postgrad-next-direction", "Choose whether to deepen technically, move toward product or strategy, enter consulting, or lead analytics work.")
        ])
      }
    },

    {
      id: "bais",
      name: "Business Analytics and Information Systems",
      overview: "Business Analytics and Information Systems connects business operations with data, software, systems, databases, and technology management. Common roles include business analyst, data analyst, business-intelligence analyst, consultant, systems analyst, database administrator, and project manager.",
      dailyLife: "The daily work often involves understanding a business problem, documenting requirements, analyzing data, improving a process, designing or supporting a system, coordinating stakeholders, and translating between technical teams and business users.",
      commonConcern: "A common concern is being stuck between business and technology without being technical enough for either side. The strength of the degree is the bridge, but students still need tangible projects that prove they can analyze, build, document, and communicate.",
      closingGuidance: "Use the roadmap to create a visible body of work. A dashboard, database, workflow, application, process analysis, or systems project is much stronger than simply listing software names on a resume.",
      directions: ["Business analyst", "Data or business-intelligence analyst", "Systems analyst", "Technology consultant", "Database administrator", "Project or product coordination"],
      competitiveFactors: ["SQL, data visualization, and systems thinking", "Requirements and process analysis", "Projects with clear business use", "Communication across technical and nontechnical teams", "Internship or consulting-style experience"],
      misconception: "BAIS is not only coding and it is not only business. The value comes from understanding how technology, data, people, and processes fit together.",
      stages: {
        freshman: stage("Build the bridge",
          "Develop enough business and technical literacy to begin solving simple problems.", [
          m("bais-freshman-intro-tools", "Learn introductory spreadsheets, SQL, programming, and data visualization."),
          m("bais-freshman-compare-roles", "Understand the differences between analyst, systems, database, consulting, and project roles."),
          m("bais-freshman-resume-repository", "Build a basic resume, LinkedIn profile, and project repository."),
          m("bais-freshman-first-project", "Complete one small dashboard, database, automation, or process-improvement project.")
        ]),
        sophomore: stage("Create portfolio-ready systems work",
          "Turn foundational skills into projects that show how technology improves a business process or decision.", [
          m("bais-sophomore-stronger-project", "Build a stronger project involving databases, dashboards, application development, systems analysis, or workflow design."),
          m("bais-sophomore-document-problem", "Document the business problem, users, requirements, decisions, and result."),
          m("bais-sophomore-join-team", "Join a competition, practice-center project, technical organization, or consulting-style team."),
          m("bais-sophomore-internship-applications", "Begin applying for analyst, technology, data, consulting, or systems internships.")
        ]),
        junior: stage("Test the bridge professionally",
          "Gain experience translating business needs into technical or analytical solutions.", [
          m("bais-junior-internship", "Secure or complete a BAIS, analytics, consulting, systems, database, project, or technology internship."),
          m("bais-junior-own-project-portion", "Own a meaningful portion of a project and show how the work improved a decision, process, system, or user experience."),
          m("bais-junior-requirements-comfort", "Build comfort with requirements, stakeholder communication, testing, documentation, and implementation."),
          m("bais-junior-narrow-direction", "Narrow toward a target direction while maintaining enough range to explain the broader business context.")
        ]),
        senior: stage("Package the portfolio and target the role",
          "Convert the strongest technical and business evidence into a focused search.", [
          m("bais-senior-select-roles", "Select target roles such as business analyst, BI analyst, systems analyst, consultant, or project coordinator."),
          m("bais-senior-polish-projects", "Polish projects so employers can quickly understand the problem, tools, process, and impact."),
          m("bais-senior-interview-prep", "Prepare for case, technical, SQL, analytical, and behavioral interviews where relevant."),
          m("bais-senior-evaluate-roles", "Evaluate roles based on mentorship, project ownership, technology exposure, and business impact.")
        ]),
        postGrad: stage("Become a trusted translator and problem-solver",
          "Build a reputation for understanding both the business need and the technical reality.", [
          m("bais-postgrad-learn-systems", "Learn the organization's systems, data, processes, users, and decision structure."),
          m("bais-postgrad-own-delivery", "Own requirements, analysis, implementation, reporting, or project delivery with measurable results."),
          m("bais-postgrad-specialty", "Develop a specialty in analytics, systems, databases, consulting, product, cybersecurity, or project leadership."),
          m("bais-postgrad-next-move", "Decide whether the next move is deeper technical work, broader business ownership, consulting, or management.")
        ])
      }
    },

    {
      id: "entrepreneurship",
      name: "Entrepreneurship and Innovation",
      overview: "Entrepreneurship and Innovation prepares students to build their own ventures or create new products, services, markets, and business units inside existing organizations. The field rewards initiative, customer understanding, sales ability, financial discipline, and the willingness to test ideas instead of only discussing them.",
      dailyLife: "The daily work can include customer interviews, product decisions, selling, budgeting, operations, hiring, partnerships, experimentation, and solving whatever problem is currently preventing the idea from moving forward.",
      commonConcern: "A common concern is that the degree is only useful if someone launches a successful startup immediately. The same skills can also support sales, product, operations, innovation, business development, and fast-moving roles inside established companies.",
      closingGuidance: "The strongest evidence is action. Build, test, sell, measure, and learn. A small real project with customers teaches more than a polished business plan that never leaves the document.",
      directions: ["Founder or small-business owner", "Startup operations", "Business development", "Product or innovation roles", "Founder's associate", "Corporate innovation or intrapreneurship"],
      competitiveFactors: ["Customer discovery", "Sales and communication", "Basic financial and operational control", "Evidence of testing and execution", "Comfort learning across functions"],
      misconception: "Entrepreneurship is not only pitching ideas or raising money. Most of the work is testing assumptions, selling, operating, and adapting.",
      stages: {
        freshman: stage("Learn through small experiments",
          "Understand how value is created and begin testing ideas at a manageable scale.", [
          m("entrepreneurship-freshman-customer-problems", "Identify real customer problems instead of beginning with a product idea alone."),
          m("entrepreneurship-freshman-resume-documentation", "Build a basic resume and LinkedIn profile while documenting entrepreneurial projects separately."),
          m("entrepreneurship-freshman-test-offer", "Test one small offer, service, event, product, audience, or business concept."),
          m("entrepreneurship-freshman-basics", "Learn basic sales, customer discovery, budgeting, and simple unit economics.")
        ]),
        sophomore: stage("Validate and operate",
          "Move from ideas into evidence that customers, users, or an organization actually care.", [
          m("entrepreneurship-sophomore-customer-interviews", "Conduct customer interviews and use the results to change or narrow the concept."),
          m("entrepreneurship-sophomore-track-metric", "Track a real metric such as revenue, users, leads, retention, participation, or cost."),
          m("entrepreneurship-sophomore-build-team", "Build a small team, partnership, or operating system that reduces dependence on one person."),
          m("entrepreneurship-sophomore-learn-basics", "Learn the legal, financial, marketing, and operational basics relevant to the project.")
        ]),
        junior: stage("Grow the venture or test innovation professionally",
          "Take on more serious execution through a venture, startup, innovation team, or high-responsibility internship.", [
          m("entrepreneurship-junior-grow-or-intern", "Grow a venture, complete a startup or innovation internship, or own a new initiative inside an organization."),
          m("entrepreneurship-junior-repeatable-approach", "Build a repeatable approach to customer acquisition, delivery, operations, or product improvement."),
          m("entrepreneurship-junior-present-venture", "Present the venture clearly to mentors, customers, partners, judges, or investors and use the feedback."),
          m("entrepreneurship-junior-operator-network", "Develop a network of operators and specialists who can fill gaps in finance, legal, product, technology, or sales.")
        ]),
        senior: stage("Choose a credible launch path",
          "Decide whether to continue the venture, join a growing company, or pursue an innovation-focused role.", [
          m("entrepreneurship-senior-evaluate-venture", "Evaluate whether the venture has enough demand, economics, and personal commitment to continue after graduation."),
          m("entrepreneurship-senior-first-year-plan", "Create a realistic operating, funding, revenue, or employment plan for the first year after college."),
          m("entrepreneurship-senior-package-evidence", "Package entrepreneurial work as evidence of sales, leadership, resilience, execution, and business judgment."),
          m("entrepreneurship-senior-fulltime-options", "Pursue full-time opportunities that still build useful skills when the venture is not ready to support the student.")
        ]),
        postGrad: stage("Build something sustainable",
          "Turn entrepreneurial activity into a repeatable business capability or a strong innovation career.", [
          m("entrepreneurship-postgrad-improve-economics", "Improve the economics, customer experience, delivery, and reliability of the venture or business unit."),
          m("entrepreneurship-postgrad-build-systems", "Build systems and a team so progress is not dependent on constant personal improvisation."),
          m("entrepreneurship-postgrad-track-learning", "Track measurable learning and stop pursuing ideas that repeatedly fail the test."),
          m("entrepreneurship-postgrad-next-move", "Decide whether the next move is scale, profitability, funding, acquisition, a new venture, or deeper operating experience.")
        ])
      }
    },

    {
      id: "finance",
      name: "Finance",
      overview: "Finance can lead into corporate finance, banking, investments, financial services, fintech, insurance, real estate, and other analytical business roles. The major is broad, but recruiting timing and technical expectations can vary sharply between paths.",
      dailyLife: "The daily work may involve analyzing financial statements, building forecasts, evaluating investments, preparing presentations, supporting transactions, working with clients, monitoring risk, or helping a company allocate money and make decisions.",
      commonConcern: "A common concern is that every finance student must pursue investment banking or an extremely competitive Wall Street path. Those options exist, but finance also supports corporate planning, commercial banking, real estate, wealth, operations, fintech, and many other careers.",
      closingGuidance: "Explore the paths early because the recruiting calendar is not the same everywhere. Once a direction is clearer, build the technical skills, relationships, and experience that match that lane instead of preparing vaguely for all of finance.",
      directions: ["Corporate finance and FP&A", "Commercial banking", "Investments and asset management", "Financial services and wealth", "Real estate finance", "Fintech and financial analysis"],
      competitiveFactors: ["Accounting and financial-statement understanding", "Excel, modeling, and analytical ability", "Early recruiting awareness", "Relevant projects, competitions, or internships", "Clear communication and business judgment"],
      misconception: "Finance is not one career. The lifestyle, recruiting timeline, client exposure, and technical expectations vary significantly by path.",
      stages: {
        freshman: stage("Learn the finance landscape",
          "Understand the major paths and build the analytical foundation needed to compare them.", [
          m("finance-freshman-compare-paths", "Compare corporate finance, banking, investments, financial services, fintech, insurance, and real estate."),
          m("finance-freshman-fundamentals", "Strengthen accounting, Excel, economics, and financial-statement fundamentals."),
          m("finance-freshman-resume-activity", "Build a basic resume and LinkedIn profile and join one meaningful finance or business activity."),
          m("finance-freshman-recruiting-timing", "Learn which finance paths recruit unusually early and which follow a more flexible timeline.")
        ]),
        sophomore: stage("Build technical evidence and recruiting awareness",
          "Begin proving analytical ability and pursue early opportunities that match the selected path.", [
          m("finance-sophomore-technical-skills", "Develop stronger Excel, valuation, forecasting, financial analysis, or data skills."),
          m("finance-sophomore-technical-project", "Complete a finance project, case competition, investment analysis, research report, or business valuation."),
          m("finance-sophomore-relationships", "Build relationships with upperclassmen, alumni, and professionals in the paths being considered."),
          m("finance-sophomore-early-applications", "Begin applying early for internships, especially when targeting structured or accelerated recruiting tracks.")
        ]),
        junior: stage("Gain relevant finance experience",
          "Test the chosen direction through professional work and stronger analytical responsibility.", [
          m("finance-junior-internship", "Secure or complete a finance, banking, investment, real estate, fintech, insurance, or analytical internship."),
          m("finance-junior-analysis-examples", "Build examples of forecasts, analysis, recommendations, client work, transactions, or financial decisions."),
          m("finance-junior-narrow-target", "Narrow the full-time target based on the work actually enjoyed and performed well."),
          m("finance-junior-recruiting-prep", "Prepare early for full-time recruiting, technical interviews, and path-specific expectations.")
        ]),
        senior: stage("Convert the evidence into a focused role",
          "Run a targeted search and present a coherent finance story.", [
          m("finance-senior-defined-roles", "Apply to a defined group of roles rather than using finance as one broad category."),
          m("finance-senior-explain-work", "Explain analytical work, decisions, assumptions, and business impact clearly in interviews."),
          m("finance-senior-alumni-relationships", "Use alumni and professional relationships to understand teams, training, and realistic entry points."),
          m("finance-senior-evaluate-offers", "Evaluate offers based on skill development, workload, compensation, mobility, and fit with the chosen path.")
        ]),
        postGrad: stage("Build judgment and a valuable specialty",
          "Move beyond completing analyses and begin understanding how financial decisions affect the organization or client.", [
          m("finance-postgrad-learn-business", "Learn the business model, revenue drivers, risks, systems, and decision process behind the role."),
          m("finance-postgrad-measurable-examples", "Build measurable examples of better forecasting, analysis, client outcomes, investment decisions, or process improvement."),
          m("finance-postgrad-credentials", "Pursue credentials such as CFA, FINRA licenses, or other training only when they directly support the path."),
          m("finance-postgrad-next-move", "Decide whether the next move is promotion, specialization, graduate study, a different finance lane, or leadership.")
        ])
      }
    },

    {
      id: "global",
      name: "Global Business",
      overview: "Global Business combines business preparation with international context, language study, overseas experience, and a functional concentration in finance, management, marketing, or business analytics and information systems. It is strongest when the student pairs global awareness with a concrete business skill.",
      dailyLife: "The daily work can involve international customers, suppliers, teams, markets, regulations, logistics, analysis, communication across cultures, and adapting business decisions to different political, economic, and social environments.",
      commonConcern: "A common concern is that Global Business sounds broad and may not point to one job title. That is fair. The degree becomes much more useful when the student develops a clear functional concentration, language ability, and evidence of working across cultures or borders.",
      closingGuidance: "Do not treat international interest as the complete professional skill. Build a strong finance, management, marketing, or BAIS foundation, then use language and overseas experience to make that skill more valuable in a global setting.",
      directions: ["International sales or business development", "Global marketing", "International finance or analysis", "Global operations and supply relationships", "International project or account coordination", "Business analytics in multinational organizations"],
      competitiveFactors: ["Functional business concentration", "Language development", "Meaningful overseas study or work", "Cross-cultural communication", "Understanding of international markets and risk"],
      misconception: "Global Business is not only travel. Most roles require a concrete business function plus the ability to operate across countries, cultures, and systems.",
      stages: {
        freshman: stage("Choose the functional foundation",
          "Understand the global degree structure and begin building both business and international capability.", [
          m("global-freshman-compare-concentrations", "Compare the finance, management, marketing, and BAIS concentration options."),
          m("global-freshman-language-study", "Begin or continue serious language study connected to a region or professional goal."),
          m("global-freshman-resume-activity", "Build a basic resume and LinkedIn profile and join one meaningful international or business activity."),
          m("global-freshman-learn-differences", "Learn how political, economic, cultural, regulatory, and technological differences affect business decisions.")
        ]),
        sophomore: stage("Plan the global experience",
          "Build functional skills while preparing for meaningful study or work abroad.", [
          m("global-sophomore-concentration-progress", "Make progress in the selected concentration and connect it to possible roles."),
          m("global-sophomore-plan-abroad", "Plan the timing, funding, location, and purpose of the overseas study or work experience."),
          m("global-sophomore-international-project", "Complete a project involving international markets, customers, suppliers, culture, or business conditions."),
          m("global-sophomore-internship-pursuit", "Begin pursuing internships or roles where language, global exposure, or the concentration is relevant.")
        ]),
        junior: stage("Apply the degree across borders",
          "Use an overseas experience or globally relevant internship to test the combination of function and international context.", [
          m("global-junior-overseas-experience", "Complete meaningful overseas study, work, research, or project experience."),
          m("global-junior-internship", "Secure or complete an internship connected to the concentration or a global organization."),
          m("global-junior-adaptation-evidence", "Build evidence of adapting communication, analysis, or decisions across cultural and market differences."),
          m("global-junior-professional-relationships", "Develop relationships with professionals working in multinational organizations or international roles.")
        ]),
        senior: stage("Convert global experience into a specific search",
          "Present the international experience as business evidence, not tourism.", [
          m("global-senior-target-roles", "Target roles that combine the concentration with global customers, teams, suppliers, markets, or operations."),
          m("global-senior-explain-growth", "Explain what changed in the student's thinking or performance because of the overseas experience."),
          m("global-senior-language-honesty", "Maintain language ability and demonstrate the level honestly."),
          m("global-senior-evaluate-roles", "Evaluate roles based on functional development, international exposure, mobility, and long-term opportunity.")
        ]),
        postGrad: stage("Build a global professional identity",
          "Develop enough functional credibility to take on broader international responsibility.", [
          m("global-postgrad-learn-operations", "Learn how the organization operates across markets, cultures, regulations, and teams."),
          m("global-postgrad-functional-accomplishments", "Build measurable accomplishments in the core business function."),
          m("global-postgrad-language-value", "Continue language and regional development when it creates professional value."),
          m("global-postgrad-next-move", "Decide whether the next move is deeper specialization, international assignment, regional leadership, or a different global function.")
        ])
      }
    },

    {
      id: "hospitality",
      name: "Hospitality Management",
      overview: "Hospitality Management prepares students for operations and leadership across hotels, resorts, restaurants, clubs, airlines, cruise companies, attractions, events, and tourism businesses. The degree is highly experiential and rewards students who understand both guest experience and business performance.",
      dailyLife: "The daily work can involve staffing, service recovery, scheduling, revenue, events, food and beverage, guest experience, sales, facilities, budgeting, and solving operational problems in real time.",
      commonConcern: "A common concern is that hospitality means low-level service work forever. Entry-level experience is often hands-on, but the purpose is to understand operations deeply enough to manage people, revenue, quality, and complex guest-facing businesses.",
      closingGuidance: "Experience matters heavily in this field. Treat every role as a chance to learn how an operation works, take responsibility, and build a record of improving service, efficiency, revenue, or team performance.",
      directions: ["Hotel and resort operations", "Food and beverage management", "Events and convention services", "Revenue management and sales", "Club, attraction, cruise, or airline operations", "Hospitality entrepreneurship"],
      competitiveFactors: ["Significant industry experience", "Strong service and communication", "Operational and financial understanding", "Supervisory responsibility", "Ability to stay composed under pressure"],
      misconception: "Hospitality is not only customer service. Management roles require finance, operations, leadership, sales, analytics, and fast decision-making.",
      stages: {
        freshman: stage("Enter the industry and learn the operation",
          "Build early industry exposure and understand how guest experience connects to business performance.", [
          m("hospitality-freshman-industry-experience", "Begin accumulating meaningful hospitality industry experience."),
          m("hospitality-freshman-compare-sectors", "Compare hotels, restaurants, events, clubs, attractions, travel, and other sectors."),
          m("hospitality-freshman-resume", "Build a basic resume and LinkedIn profile around reliability, service, and responsibility."),
          m("hospitality-freshman-fundamentals", "Learn the fundamentals of guest experience, operations, teamwork, and service recovery.")
        ]),
        sophomore: stage("Move beyond entry-level participation",
          "Use industry experience to develop stronger operational and business understanding.", [
          m("hospitality-sophomore-industry-hours", "Continue building required or expected industry hours and exposure."),
          m("hospitality-sophomore-take-responsibility", "Take responsibility for a shift, event, process, team task, or guest-facing outcome."),
          m("hospitality-sophomore-business-basics", "Learn basic budgeting, revenue, staffing, inventory, sales, or operational analysis."),
          m("hospitality-sophomore-manager-relationships", "Build relationships with managers and explore internships or management-development opportunities.")
        ]),
        junior: stage("Gain supervisory and specialized experience",
          "Test leadership ability and begin narrowing toward a hospitality function or sector.", [
          m("hospitality-junior-internship", "Secure or complete a hospitality internship, supervisory role, or management-development experience."),
          m("hospitality-junior-own-improvement", "Own a measurable improvement involving service, revenue, efficiency, events, inventory, or team performance."),
          m("hospitality-junior-explore-specialty", "Explore a specialty such as operations, revenue management, events, sales, food and beverage, or lodging."),
          m("hospitality-junior-industry-leaders", "Build relationships with industry leaders who can explain career progression and employer quality.")
        ]),
        senior: stage("Complete the experience and enter management",
          "Turn industry hours, leadership, and coursework into a focused post-graduation role.", [
          m("hospitality-senior-complete-experience", "Complete the program's industry-experience expectations and document the strongest accomplishments."),
          m("hospitality-senior-pursue-roles", "Pursue management-training, supervisory, sales, events, revenue, or specialized hospitality roles."),
          m("hospitality-senior-interview-examples", "Prepare interview examples involving pressure, conflict, service recovery, leadership, and business decisions."),
          m("hospitality-senior-evaluate-employers", "Evaluate employers based on training, culture, scheduling, mobility, compensation, and promotion potential.")
        ]),
        postGrad: stage("Build operating credibility",
          "Become a reliable hospitality operator who can manage both people and business performance.", [
          m("hospitality-postgrad-learn-operation", "Learn the operation, standards, financial drivers, staffing model, and guest expectations."),
          m("hospitality-postgrad-measurable-accomplishments", "Build measurable accomplishments in revenue, service, cost control, efficiency, or team development."),
          m("hospitality-postgrad-specialty", "Develop a specialty while gaining broader operational understanding."),
          m("hospitality-postgrad-next-move", "Decide whether the next move is promotion, a management program, a stronger property or brand, specialization, or ownership.")
        ])
      }
    },

    {
      id: "cybersecurity",
      name: "Information Assurance and Cybersecurity Management",
      overview: "Information Assurance and Cybersecurity Management combines security knowledge with business risk, governance, policy, analytics, incident response, and communication. It is designed for people who can understand technical threats and explain their business impact to decision-makers.",
      dailyLife: "The daily work may involve reviewing alerts, assessing risk, testing controls, documenting policies, supporting incidents, analyzing vulnerabilities, preparing reports, working with technical teams, and helping leaders decide what risks require action.",
      commonConcern: "A common concern is that the major is not as technical as computer science. The degree is not meant to produce the same profile. Its advantage is managing cybersecurity as a business function, but students still need hands-on labs and enough technical depth to earn credibility.",
      closingGuidance: "Build both sides. Practice the technical work, then learn to translate threats, controls, costs, and business consequences clearly. That bridge is the point of the degree.",
      directions: ["Cybersecurity analyst", "Governance, risk, and compliance", "Security audit", "Incident and intrusion analysis", "Vulnerability management", "Cybersecurity management"],
      competitiveFactors: ["Hands-on labs and technical fundamentals", "Risk and governance understanding", "Ethical judgment", "Clear written and verbal communication", "Internship, competition, or security-project experience"],
      misconception: "Cybersecurity management is not only policy and it is not only hacking. Organizations need people who can connect technical realities to risk, budgets, operations, and leadership decisions.",
      stages: {
        freshman: stage("Build security and business fundamentals",
          "Develop baseline technical literacy and understand cybersecurity as an organizational responsibility.", [
          m("cybersecurity-freshman-intro-concepts", "Learn introductory networking, operating systems, databases, security concepts, and business processes."),
          m("cybersecurity-freshman-home-lab", "Build a basic home lab, capture-the-flag record, or documented security-learning environment."),
          m("cybersecurity-freshman-resume-activity", "Build a resume and LinkedIn profile and join one security, technology, or business activity."),
          m("cybersecurity-freshman-consequences", "Learn the ethical, legal, and business consequences of security decisions.")
        ]),
        sophomore: stage("Turn concepts into hands-on evidence",
          "Practice technical and risk-management skills through labs, projects, and competitions.", [
          m("cybersecurity-sophomore-projects", "Complete projects involving network security, cloud security, risk assessment, policy, databases, or incident response."),
          m("cybersecurity-sophomore-frameworks", "Learn how standards and frameworks organize controls, governance, and risk decisions."),
          m("cybersecurity-sophomore-competitions", "Participate in security competitions, Cyber Florida opportunities, labs, or team projects."),
          m("cybersecurity-sophomore-internship-pursuit", "Begin pursuing cybersecurity, audit, risk, compliance, technology, or security-operations internships.")
        ]),
        junior: stage("Test security skills professionally",
          "Gain experience in a real security environment and learn how technical findings become business actions.", [
          m("cybersecurity-junior-internship", "Secure or complete a security, risk, audit, compliance, incident-response, or technology internship."),
          m("cybersecurity-junior-assessment-example", "Build a strong example of assessing a threat, vulnerability, control, incident, or business risk."),
          m("cybersecurity-junior-communication", "Practice communicating findings to both technical personnel and business leadership."),
          m("cybersecurity-junior-narrow-direction", "Narrow toward security operations, governance and risk, audit, cloud, incident response, or another direction.")
        ]),
        senior: stage("Package technical credibility and business judgment",
          "Run a focused search for roles that match the actual experience and technical depth.", [
          m("cybersecurity-senior-portfolio", "Build a portfolio of labs, reports, risk assessments, policies, or projects that can be discussed safely."),
          m("cybersecurity-senior-interview-prep", "Prepare for technical, scenario, risk, and behavioral interviews."),
          m("cybersecurity-senior-certifications", "Pursue certifications only when they align with the target role and current level."),
          m("cybersecurity-senior-evaluate-employers", "Evaluate employers based on mentorship, ethical culture, incident maturity, technical exposure, and responsibility.")
        ]),
        postGrad: stage("Become trusted with real risk",
          "Build the judgment required to protect an organization and communicate difficult tradeoffs.", [
          m("cybersecurity-postgrad-learn-environment", "Learn the organization's assets, systems, threat environment, controls, and business priorities."),
          m("cybersecurity-postgrad-own-improvements", "Own measurable improvements in detection, response, compliance, resilience, risk reduction, or security awareness."),
          m("cybersecurity-postgrad-continue-practice", "Continue technical practice while developing stronger governance and communication ability."),
          m("cybersecurity-postgrad-next-direction", "Decide whether to deepen into operations, risk, audit, cloud, incident response, architecture, or management.")
        ])
      }
    },

    {
      id: "management",
      name: "Management",
      overview: "Management covers leadership, organizational behavior, human resources, negotiation, ethics, projects, and the systems used to coordinate people and work. It can support careers in operations, HR, project management, training, sales leadership, entrepreneurship, and many industry-specific roles.",
      dailyLife: "The daily work depends heavily on the function. It can involve coordinating projects, improving processes, hiring and developing people, resolving conflict, planning resources, communicating priorities, and making sure a team delivers results.",
      commonConcern: "A common concern is that companies do not hire new graduates directly into senior management. That is true. The degree becomes valuable when the student pairs it with a function, industry, and evidence of responsibility rather than expecting the title alone to create authority.",
      closingGuidance: "Do not market yourself as someone who simply wants to manage. Show where you have organized work, improved a process, handled responsibility, led people, or delivered an outcome.",
      directions: ["Human resources", "Project management", "Operations", "Training and development", "Sales or retail leadership", "Organizational leadership and administration"],
      competitiveFactors: ["Real responsibility", "Project and process ownership", "Communication and conflict resolution", "Analytical and financial awareness", "Internship or supervisory experience"],
      misconception: "A management degree does not automatically make someone a manager. Employers usually promote or hire leaders after they prove competence in a function and responsibility for results.",
      stages: {
        freshman: stage("Explore functions and build responsibility",
          "Understand where management skills are applied and begin taking responsibility in real settings.", [
          m("management-freshman-compare-functions", "Compare HR, operations, project management, sales leadership, training, and organizational roles."),
          m("management-freshman-resume-activity", "Build a basic resume and LinkedIn profile and join one meaningful activity or work environment."),
          m("management-freshman-small-responsibility", "Take responsibility for a small task, event, process, team assignment, or customer outcome."),
          m("management-freshman-fundamentals", "Learn the fundamentals of communication, teamwork, ethics, and organizational behavior.")
        ]),
        sophomore: stage("Move from participation into ownership",
          "Develop proof that the student can organize work and follow through.", [
          m("management-sophomore-own-project", "Own a project, deliverable, process, shift, event, or team responsibility."),
          m("management-sophomore-select-concentration", "Explore and select a concentration or functional direction when appropriate."),
          m("management-sophomore-skills", "Build basic project-management, data, budgeting, and presentation skills."),
          m("management-sophomore-internship-pursuit", "Begin pursuing internships or jobs connected to operations, HR, projects, sales, or the selected function.")
        ]),
        junior: stage("Prove leadership through outcomes",
          "Gain professional experience where responsibility can be measured.", [
          m("management-junior-internship", "Secure or complete an internship or role involving operations, HR, projects, supervision, sales, or administration."),
          m("management-junior-improvement-example", "Build an example of improving a process, coordinating people, solving a conflict, or delivering a result."),
          m("management-junior-industry-understanding", "Develop stronger understanding of the selected industry or business function."),
          m("management-junior-professional-relationships", "Build relationships with professionals who can explain realistic entry points and leadership progression.")
        ]),
        senior: stage("Target a function, not a vague title",
          "Convert management preparation into a credible first role with room for responsibility.", [
          m("management-senior-specific-roles", "Target specific roles such as HR coordinator, project coordinator, operations analyst, management trainee, or sales leader."),
          m("management-senior-leadership-examples", "Present leadership examples through clear actions and outcomes rather than personality claims."),
          m("management-senior-rotational-programs", "Pursue rotational or training programs when they provide structured development."),
          m("management-senior-evaluate-opportunities", "Evaluate opportunities based on manager quality, responsibility, skill growth, and promotion path.")
        ]),
        postGrad: stage("Earn broader leadership",
          "Build functional credibility first, then expand responsibility for people, projects, and decisions.", [
          m("management-postgrad-learn-function", "Learn the operation, customers, metrics, systems, and expectations of the function."),
          m("management-postgrad-accomplishments-first", "Build measurable accomplishments before pursuing a management title."),
          m("management-postgrad-leadership-skills", "Develop skills in feedback, delegation, planning, budgeting, and conflict management."),
          m("management-postgrad-next-move", "Decide whether to specialize, move into people leadership, pursue project credentials, or change industries strategically.")
        ])
      }
    },

    {
      id: "marketing",
      name: "Marketing",
      overview: "Marketing can lead into market development, professional sales, brand and product work, digital marketing, consumer insights, research, analytics, communications, and customer-focused roles. The degree is flexible, which creates opportunity but also makes self-direction and evidence especially important.",
      dailyLife: "The daily work varies by path. It may involve customer research, campaign planning, content, analytics, sales, positioning, product decisions, account management, pricing, distribution, or explaining how a business should reach and retain customers.",
      commonConcern: "A common concern is that Marketing is too broad or that employers only want experience. The degree can be useful, but students need to show initiative through campaigns, sales, research, projects, customer work, analytics, or measurable growth rather than relying on the diploma alone.",
      closingGuidance: "Use college to test different forms of marketing, then build a useful specialty. The goal is to show that you can understand an audience, communicate value, support revenue, analyze performance, or improve a customer decision.",
      directions: ["Market development and sales", "Brand and product marketing", "Digital marketing and growth", "Marketing analytics and consumer insights", "Content and communications", "Account management"],
      competitiveFactors: ["Real customer, campaign, sales, or research work", "Measurable outcomes", "Clear communication", "Analytical ability", "A portfolio or case-study record"],
      misconception: "Marketing is not only social media or advertising. It includes customer understanding, product, pricing, distribution, research, sales, analytics, and revenue strategy.",
      stages: {
        freshman: stage("Explore the customer-facing side of business",
          "Understand the range of marketing work and begin building basic professional evidence.", [
          m("marketing-freshman-explore-paths", "Compare market development, sales, brand, product, digital, research, analytics, and content roles."),
          m("marketing-freshman-resume-activity", "Build a basic resume and LinkedIn profile and join one meaningful activity."),
          m("marketing-freshman-early-experience", "Gain early customer-facing, promotional, sales, research, content, or event experience."),
          m("marketing-freshman-save-examples", "Save examples of work and begin noting the goal, audience, decisions, and result.")
        ]),
        sophomore: stage("Build one credible marketing case",
          "Move from general interest into work that shows initiative and an understanding of customers.", [
          m("marketing-sophomore-own-deliverable", "Own a campaign, event promotion, research project, sales goal, content plan, or customer-focused deliverable."),
          m("marketing-sophomore-analytics", "Learn enough analytics to measure what happened instead of only describing the activity."),
          m("marketing-sophomore-portfolio", "Begin building a portfolio or case-study collection around the strongest work."),
          m("marketing-sophomore-internship-research", "Research internships and begin applying when a relevant opportunity appears.")
        ]),
        junior: stage("Test a marketing direction professionally",
          "Gain meaningful experience and narrow toward the type of marketing work that fits best.", [
          m("marketing-junior-internship", "Secure or complete a marketing, sales, research, communications, product, customer, or analytics internship."),
          m("marketing-junior-case-study", "Build at least one strong case study with a clear objective, decisions, execution, and measurable outcome."),
          m("marketing-junior-primary-direction", "Choose a primary direction to pursue while keeping one reasonable secondary path."),
          m("marketing-junior-relationships", "Develop relationships with marketers, sales professionals, alumni, or managers in the target area.")
        ]),
        senior: stage("Convert the evidence into a role",
          "Run a focused search using projects and experience that employers can evaluate quickly.", [
          m("marketing-senior-defined-roles", "Target a defined group of roles instead of applying to every position containing the word marketing."),
          m("marketing-senior-polish-materials", "Polish the resume, portfolio, case studies, and interview examples around results and judgment."),
          m("marketing-senior-alumni-network", "Use alumni and professional relationships to understand teams, roles, and realistic entry points."),
          m("marketing-senior-evaluate-offers", "Evaluate offers based on ownership, training, measurable work, manager quality, and room to specialize.")
        ]),
        postGrad: stage("Build a measurable specialty",
          "Become known for creating value in a specific part of the customer or revenue process.", [
          m("marketing-postgrad-learn-business", "Learn the customer, product, market, economics, channels, and performance measures of the business."),
          m("marketing-postgrad-own-outcome", "Own a campaign, account, channel, segment, research problem, sales goal, or product outcome."),
          m("marketing-postgrad-specialty", "Build measurable accomplishments and a clearer specialty."),
          m("marketing-postgrad-next-move", "Decide whether to deepen, manage a team, move toward product or strategy, enter sales leadership, or change environments.")
        ])
      }
    },

    {
      id: "pfp",
      name: "Personal Financial Planning",
      overview: "Personal Financial Planning prepares students to analyze a client's financial situation and create recommendations involving cash flow, investments, retirement, taxes, insurance, estates, and long-term goals. The work combines technical knowledge with trust, communication, ethics, and relationship management.",
      dailyLife: "The daily work can involve meeting clients, gathering information, building financial plans, researching strategies, preparing recommendations, coordinating with specialists, following regulations, and helping people make difficult decisions about money.",
      commonConcern: "A common concern is that financial planning is only sales. Business development can be part of the field, but strong planners also need technical competence, ethical judgment, empathy, and the ability to build long-term client relationships.",
      closingGuidance: "Use the program's industry access and mentorship. Learn how different firms are compensated and structured, then choose an environment that supports real planning, professional development, and the client experience you want to provide.",
      directions: ["Financial planner or advisor", "Wealth-management associate", "Paraplanner", "Retirement-planning specialist", "Client-service associate", "Financial-planning analyst"],
      competitiveFactors: ["Financial-planning knowledge", "Client communication", "Ethical judgment", "Mentorship and industry exposure", "A clear CFP education and experience plan"],
      misconception: "Financial planning is not simply picking investments. It involves the client's full financial picture, behavior, goals, risk, taxes, insurance, retirement, and estate considerations.",
      stages: {
        freshman: stage("Understand the profession and client relationship",
          "Learn what planners do and begin building the communication and financial foundation required for client work.", [
          m("pfp-freshman-compare-roles", "Compare planning, wealth management, client service, retirement, insurance, and related roles."),
          m("pfp-freshman-resume-events", "Build a basic resume and LinkedIn profile and attend industry or program events."),
          m("pfp-freshman-fundamentals", "Strengthen personal-finance, accounting, economics, and communication fundamentals."),
          m("pfp-freshman-cfp-path", "Learn how the CFP path, ethics, education, examination, experience, and certification fit together.")
        ]),
        sophomore: stage("Build technical and professional exposure",
          "Develop planning knowledge while learning how firms serve clients and build relationships.", [
          m("pfp-sophomore-plan-structure", "Learn the structure of a financial plan and how recommendations connect across planning areas."),
          m("pfp-sophomore-firm-models", "Use mentorship, employer events, or professional conversations to compare different firm models."),
          m("pfp-sophomore-software-experience", "Build experience with planning software, client communication, research, or financial case work."),
          m("pfp-sophomore-internship-pursuit", "Begin pursuing internships in planning, wealth management, banking, insurance, or client service.")
        ]),
        junior: stage("Test planning in a real client environment",
          "Gain professional experience and determine what kind of planning practice fits best.", [
          m("pfp-junior-internship", "Secure or complete a financial-planning, wealth, advisory, insurance, or client-service internship."),
          m("pfp-junior-client-examples", "Build examples of gathering client information, preparing analysis, supporting recommendations, or improving service."),
          m("pfp-junior-cfp-timeline", "Clarify the CFP exam, education, experience, and post-graduation timeline."),
          m("pfp-junior-planner-relationships", "Develop relationships with planners who can explain compensation, training, client ownership, and firm culture.")
        ]),
        senior: stage("Enter the profession deliberately",
          "Convert the program, mentorship, and internship experience into a credible first role.", [
          m("pfp-senior-pursue-roles", "Pursue planner, paraplanner, client-service, analyst, or advisor-development roles that fit the desired model."),
          m("pfp-senior-interview-prep", "Prepare to discuss ethics, client communication, planning cases, and the reason for choosing the profession."),
          m("pfp-senior-credential-steps", "Complete the academic and administrative steps required for the selected credential path."),
          m("pfp-senior-evaluate-firms", "Evaluate firms based on training, compensation structure, client standards, mentorship, and long-term development.")
        ]),
        postGrad: stage("Earn trust and professional credibility",
          "Build the experience, judgment, and client skill required to become a trusted planner.", [
          m("pfp-postgrad-learn-process", "Learn the firm's planning process, technology, compliance standards, and client-service model."),
          m("pfp-postgrad-cfp-requirements", "Complete CFP examination and experience requirements when pursuing certification."),
          m("pfp-postgrad-measurable-value", "Build measurable value through stronger plans, client retention, service, business development, or specialized knowledge."),
          m("pfp-postgrad-niche", "Develop a client niche or planning specialty while maintaining broad financial understanding.")
        ])
      }
    },

    {
      id: "rmi",
      name: "Risk Management and Insurance",
      overview: "Risk Management and Insurance focuses on how individuals, organizations, and society identify, analyze, finance, transfer, and respond to uncertainty. Career paths include underwriting, brokerage, claims, compliance, consulting, corporate risk, insurance marketing, and risk analysis.",
      dailyLife: "The daily work may involve reviewing exposures, pricing or underwriting risk, analyzing claims, advising clients, interpreting policy language, evaluating controls, managing relationships, and helping organizations decide how to reduce or finance potential losses.",
      commonConcern: "A common concern is that insurance is only selling policies. Sales is one path, but the industry also needs analysts, underwriters, claims professionals, brokers, consultants, compliance specialists, and corporate risk managers.",
      closingGuidance: "Explore the functions early. The industry is easier to understand after seeing how underwriting, brokerage, claims, risk analysis, and client service connect, so use internships and professional conversations to identify the right side of the business.",
      directions: ["Underwriting", "Brokerage and risk consulting", "Claims", "Corporate risk management", "Compliance", "Insurance sales and client service"],
      competitiveFactors: ["Analytical and communication ability", "Industry exposure", "Understanding of risk and coverage", "Client or operational experience", "Relevant licensing or credentials when useful"],
      misconception: "Insurance is not only a sales industry. It is also a major analytical, legal, financial, operational, and advisory system for managing uncertainty.",
      stages: {
        freshman: stage("Learn how the risk system works",
          "Understand the major functions and build a foundation in business, analysis, and communication.", [
          m("rmi-freshman-compare-functions", "Compare underwriting, brokerage, claims, corporate risk, consulting, compliance, and sales."),
          m("rmi-freshman-resume-activity", "Build a basic resume and LinkedIn profile and join one meaningful business or risk activity."),
          m("rmi-freshman-fundamentals", "Strengthen Excel, financial, analytical, and communication fundamentals."),
          m("rmi-freshman-industry-conversation", "Attend an employer event or speak with someone in the industry to understand the workflow.")
        ]),
        sophomore: stage("Build industry exposure",
          "Move from broad understanding into practical knowledge of products, clients, and risk decisions.", [
          m("rmi-sophomore-project", "Complete a project, case, competition, or analysis involving risk, insurance, claims, or business exposure."),
          m("rmi-sophomore-product-basics", "Learn how policies, underwriting, loss history, pricing, and client needs fit together at a basic level."),
          m("rmi-sophomore-employer-relationships", "Build relationships with employers and alumni across different insurance functions."),
          m("rmi-sophomore-internship-pursuit", "Begin pursuing internships in underwriting, claims, brokerage, risk, compliance, or client service.")
        ]),
        junior: stage("Test the industry professionally",
          "Gain experience and determine which side of risk and insurance fits best.", [
          m("rmi-junior-internship", "Secure or complete a risk-management, insurance, brokerage, underwriting, claims, compliance, or consulting internship."),
          m("rmi-junior-analysis-example", "Build an example of analyzing exposure, supporting a client, evaluating a claim, or improving a risk process."),
          m("rmi-junior-narrow-function", "Narrow toward a target function and learn the relevant recruiting, licensing, or credential expectations."),
          m("rmi-junior-maintain-relationships", "Maintain professional relationships with people who can explain teams, employers, and career progression.")
        ]),
        senior: stage("Convert industry knowledge into a role",
          "Run a focused search and present a clear reason for entering the selected function.", [
          m("rmi-senior-targeted-roles", "Pursue targeted roles in underwriting, brokerage, claims, corporate risk, compliance, consulting, or sales."),
          m("rmi-senior-interview-examples", "Prepare examples showing analytical judgment, communication, client service, and attention to detail."),
          m("rmi-senior-licenses", "Complete or plan relevant licenses and credentials only when they support the role."),
          m("rmi-senior-evaluate-employers", "Evaluate employers based on training, specialization, client exposure, compensation, and advancement.")
        ]),
        postGrad: stage("Build industry judgment and client value",
          "Develop enough product, risk, and relationship knowledge to become trusted with larger decisions.", [
          m("rmi-postgrad-learn-environment", "Learn the organization's products, clients, risk appetite, systems, and regulatory environment."),
          m("rmi-postgrad-measurable-accomplishments", "Build measurable accomplishments in underwriting quality, claims, client retention, risk reduction, compliance, or growth."),
          m("rmi-postgrad-designations", "Earn designations or licenses that provide real value in the selected function."),
          m("rmi-postgrad-next-move", "Decide whether to specialize, manage accounts, enter consulting, move into corporate risk, or lead a team.")
        ])
      }
    },

    {
      id: "supply-chain",
      name: "Supply Chain Management",
      overview: "Supply Chain Management covers the end-to-end movement of materials, products, information, and returns across suppliers, production, distribution, transportation, and customers. The work combines operations, analytics, technology, coordination, and fast problem-solving.",
      dailyLife: "The daily work may involve forecasting, purchasing, inventory, logistics, supplier communication, warehouse or fulfillment operations, transportation, customer service, process improvement, and responding when plans break.",
      commonConcern: "A common concern is that supply chain means working only in warehouses or transportation. Those environments are part of the field, but careers also include planning, procurement, analytics, operations, consulting, supplier management, and strategy.",
      closingGuidance: "This is an applied major. Use the required internship and hands-on projects to learn how a real operation works, then build evidence of improving cost, speed, quality, reliability, inventory, or customer service.",
      directions: ["Supply-chain analyst", "Logistics analyst", "Procurement or purchasing", "Operations and fulfillment supervision", "Demand or inventory planning", "Supply-chain consulting"],
      competitiveFactors: ["Required internship completed well", "Excel, analytics, and process skills", "Understanding of end-to-end tradeoffs", "Operational experience", "Clear examples of improvement"],
      misconception: "Supply chain is not only shipping. It connects sourcing, production, inventory, planning, technology, logistics, service, and business risk.",
      stages: {
        freshman: stage("Understand the end-to-end system",
          "Learn how supply chains create value and build the analytical foundation for later operations work.", [
          m("supply-chain-freshman-understand-flow", "Understand sourcing, production, inventory, logistics, distribution, customer service, and returns."),
          m("supply-chain-freshman-resume-activity", "Build a basic resume and LinkedIn profile and join one meaningful operations or business activity."),
          m("supply-chain-freshman-analytics-foundation", "Strengthen Excel, data, statistics, process thinking, and business communication."),
          m("supply-chain-freshman-early-exposure", "Gain early exposure through operations, retail, fulfillment, customer service, manufacturing, or logistics work when possible.")
        ]),
        sophomore: stage("Build process and analytics evidence",
          "Use projects and early experience to understand how supply-chain decisions affect cost, service, and reliability.", [
          m("supply-chain-sophomore-project", "Complete a process map, forecasting, inventory, logistics, procurement, or analytics project."),
          m("supply-chain-sophomore-tools", "Learn the tools and technologies used to plan and monitor supply-chain performance."),
          m("supply-chain-sophomore-internship-process", "Research the required internship process and begin pursuing qualifying opportunities early."),
          m("supply-chain-sophomore-relationships", "Build relationships with supply-chain employers, alumni, and professionals.")
        ]),
        junior: stage("Complete meaningful industry experience",
          "Use the required internship and stronger coursework to test a supply-chain function.", [
          m("supply-chain-junior-required-internship", "Secure or complete the required supply-chain internship."),
          m("supply-chain-junior-own-improvement", "Own or document a measurable improvement involving cost, time, inventory, quality, service, or reliability."),
          m("supply-chain-junior-explore-functions", "Explore planning, procurement, logistics, operations, analytics, supplier management, or consulting."),
          m("supply-chain-junior-communication", "Build comfort communicating across suppliers, operations, customers, and internal teams.")
        ]),
        senior: stage("Convert operational proof into a role",
          "Run a focused search using internship results and end-to-end understanding.", [
          m("supply-chain-senior-target-roles", "Target analyst, planning, procurement, logistics, operations, fulfillment, or consulting roles."),
          m("supply-chain-senior-present-metrics", "Present projects and internship work through clear metrics, constraints, decisions, and tradeoffs."),
          m("supply-chain-senior-complete-requirements", "Complete remaining experiential and program requirements."),
          m("supply-chain-senior-evaluate-employers", "Evaluate employers based on training, operational exposure, technology, mobility, and advancement.")
        ]),
        postGrad: stage("Own performance across the chain",
          "Develop the judgment required to manage tradeoffs and improve a real operation.", [
          m("supply-chain-postgrad-learn-operation", "Learn the organization's products, suppliers, systems, customers, constraints, and performance measures."),
          m("supply-chain-postgrad-own-improvements", "Own measurable improvements in cost, service, inventory, lead time, quality, or resilience."),
          m("supply-chain-postgrad-cross-functional", "Build cross-functional credibility with finance, sales, operations, technology, and leadership."),
          m("supply-chain-postgrad-next-direction", "Decide whether to deepen into planning, procurement, logistics, analytics, consulting, or operations leadership.")
        ])
      }
    },

    {
      id: "csb",
      name: "Computer Science and Business",
      overview: "Computer Science and Business combines programming, computing, data, algorithms, and secure systems with the business context required to turn technology into useful products and decisions. It supports hybrid careers where technical depth and strategic understanding are both valuable.",
      dailyLife: "The daily work may involve software development, data systems, product decisions, technical analysis, automation, consulting, translating stakeholder needs, and working between engineering teams and business leadership.",
      commonConcern: "A common concern is that a combined degree may make someone less technical than a traditional computer-science graduate or less business-focused than a business major. The answer is to build serious technical projects while using the business concentration to create a clear and differentiated application.",
      closingGuidance: "Do not stop at being able to speak both languages. Build proof that you can create technology, understand why the business needs it, and explain the outcome to developers, users, and decision-makers.",
      directions: ["Software or application development in business environments", "Data and analytics roles", "Technical consulting", "Fintech development", "Product and technology strategy", "Automation and digital transformation"],
      competitiveFactors: ["Strong programming and computer-science fundamentals", "Deployed or substantial technical projects", "A clear business concentration", "Internship experience", "Ability to explain technical tradeoffs and business impact"],
      misconception: "The degree is not two shallow subjects placed together. Its value depends on developing real computing ability and applying it to a specific business domain.",
      stages: {
        freshman: stage("Build both foundations",
          "Develop introductory computing ability while understanding how businesses use technology.", [
          m("csb-freshman-cs-fundamentals", "Build programming, mathematics, problem-solving, and computer-science fundamentals."),
          m("csb-freshman-business-concepts", "Learn basic accounting, economics, data, and business decision concepts."),
          m("csb-freshman-github-project", "Create a GitHub profile and complete one small application, automation, or data project."),
          m("csb-freshman-explore-concentrations", "Explore the available business concentrations and the roles each combination can support.")
        ]),
        sophomore: stage("Apply computing to a business problem",
          "Move from isolated assignments into projects with users, requirements, and a practical purpose.", [
          m("csb-sophomore-stronger-project", "Build a stronger project involving software, data, AI, secure computing, or automation."),
          m("csb-sophomore-connect-concentration", "Connect the project to the selected concentration, such as fintech, analytics, marketing, accounting, or supply chain."),
          m("csb-sophomore-join-team", "Join a technical team, hackathon, research project, competition, or open-source effort."),
          m("csb-sophomore-internship-pursuit", "Begin pursuing software, data, technology, consulting, or product internships.")
        ]),
        junior: stage("Prove technical depth and business application",
          "Gain professional experience and build one substantial project that demonstrates the combined degree.", [
          m("csb-junior-internship", "Secure or complete a software, data, technical consulting, fintech, analytics, product, or technology internship."),
          m("csb-junior-substantial-project", "Build or deploy a substantial technical project with documentation, testing, and a clear business use."),
          m("csb-junior-translation-practice", "Practice translating business requirements into technical decisions and explaining technical constraints clearly."),
          m("csb-junior-narrow-role", "Narrow toward a target hybrid role while continuing to strengthen core computing fundamentals.")
        ]),
        senior: stage("Package the hybrid advantage",
          "Convert the technical portfolio and concentration into a focused full-time search.", [
          m("csb-senior-target-roles", "Target roles where the combination of computing and business is genuinely relevant."),
          m("csb-senior-interview-prep", "Prepare for coding, systems, analytical, product, case, and behavioral interviews as required."),
          m("csb-senior-portfolio", "Build a concise portfolio showing technical depth, business context, decisions, and results."),
          m("csb-senior-evaluate-roles", "Evaluate roles based on engineering standards, mentorship, product impact, ownership, and growth.")
        ]),
        postGrad: stage("Become the person who connects technology to results",
          "Build technical credibility while taking greater ownership of products, systems, or business outcomes.", [
          m("csb-postgrad-learn-context", "Learn the codebase, data, product, users, business model, and decision process."),
          m("csb-postgrad-own-impact", "Own a feature, system, analysis, automation, or technical product with measurable impact."),
          m("csb-postgrad-specialty", "Deepen into software, data, fintech, analytics, product, security, or another chosen specialty."),
          m("csb-postgrad-next-move", "Decide whether the next move is technical leadership, product ownership, architecture, consulting, entrepreneurship, or management.")
        ])
      }
    }

  ];

  return {
    STAGE_ORDER: STAGE_ORDER,
    STAGE_LABELS: STAGE_LABELS,
    STAGE_BLOCKS: STAGE_BLOCKS,
    CERTAINTY_BLOCKS: CERTAINTY_BLOCKS,
    DIRECTION_BLOCKS: DIRECTION_BLOCKS,
    MAJORS: MAJORS
  };
})();
