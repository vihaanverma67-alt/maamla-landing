import { CollectorResult } from './types';
import { computeHash, now } from './utils';

interface CertEntry {
	title: string;
	org: string;
	url: string;
	description: string;
	region: 'global' | 'india';
}

// ── Curated catalog ───────────────────────────────────────────────────────────
// Rule: free to enroll (or free to audit). Descriptions are keyword-rich so the
// ranker's interest buckets fire correctly.
const CATALOG: CertEntry[] = [
	// ── Google Career Certificates ───────────────────────────────────────────
	{
		title: 'Google Data Analytics Professional Certificate',
		org: 'Google',
		url: 'https://grow.google/certificates/data-analytics/',
		description: 'Learn data analytics, SQL, spreadsheets, data visualisation, R programming, and Tableau. Prepares for entry-level data analyst roles. Free to audit on Coursera.',
		region: 'global',
	},
	{
		title: 'Google IT Support Professional Certificate',
		org: 'Google',
		url: 'https://grow.google/certificates/it-support/',
		description: 'Covers troubleshooting, networking, operating systems, system administration, and cloud technology. Ideal for IT support and helpdesk entry-level roles. Free to audit on Coursera.',
		region: 'global',
	},
	{
		title: 'Google UX Design Professional Certificate',
		org: 'Google',
		url: 'https://grow.google/certificates/ux-design/',
		description: 'Learn UX design, Figma prototyping, user research, wireframing, and usability testing. Prepares for entry-level UX designer roles. Free to audit on Coursera.',
		region: 'global',
	},
	{
		title: 'Google Project Management Professional Certificate',
		org: 'Google',
		url: 'https://grow.google/certificates/project-management/',
		description: 'Master project management, Agile, Scrum, risk management, and stakeholder communication. Entry-level project coordinator or manager roles. Free to audit on Coursera.',
		region: 'global',
	},
	{
		title: 'Google Cybersecurity Professional Certificate',
		org: 'Google',
		url: 'https://grow.google/certificates/cybersecurity/',
		description: 'Learn cybersecurity fundamentals, Linux, Python scripting, SIEM tools, network security, and threat analysis. Entry-level cybersecurity analyst roles. Free to audit on Coursera.',
		region: 'global',
	},
	{
		title: 'Google Advanced Data Analytics Professional Certificate',
		org: 'Google',
		url: 'https://grow.google/certificates/advanced-data-analytics/',
		description: 'Python, statistics, regression, machine learning, and data science with Python. Intermediate data analytics and data science roles. Free to audit on Coursera.',
		region: 'global',
	},
	{
		title: 'Google Business Intelligence Professional Certificate',
		org: 'Google',
		url: 'https://grow.google/certificates/business-intelligence/',
		description: 'Data pipelines, SQL, Tableau, data modeling, and business intelligence dashboards. Entry-level BI analyst roles. Free to audit on Coursera.',
		region: 'global',
	},
	{
		title: 'Google AI Essentials',
		org: 'Google',
		url: 'https://grow.google/ai-essentials/',
		description: 'Introduction to artificial intelligence, generative AI, large language models, and responsible AI use in the workplace. Free certificate via Coursera.',
		region: 'global',
	},
	{
		title: 'Google Digital Marketing & E-commerce Professional Certificate',
		org: 'Google',
		url: 'https://grow.google/certificates/digital-marketing-ecommerce/',
		description: 'Digital marketing, SEO, SEM, email marketing, social media analytics, and e-commerce. Entry-level digital marketing roles. Free to audit on Coursera.',
		region: 'global',
	},

	// ── Coursera (free to audit) ─────────────────────────────────────────────
	{
		title: 'Machine Learning Specialization',
		org: 'Stanford / DeepLearning.AI (Coursera)',
		url: 'https://www.coursera.org/specializations/machine-learning-introduction',
		description: 'Andrew Ng\'s machine learning course. Covers supervised learning, neural networks, decision trees, and Python. Industry-standard introduction to machine learning and AI algorithms.',
		region: 'global',
	},
	{
		title: 'Deep Learning Specialization',
		org: 'DeepLearning.AI (Coursera)',
		url: 'https://www.coursera.org/specializations/deep-learning',
		description: 'Build and train deep learning, neural networks, CNNs, RNNs, and LSTMs using TensorFlow and Python. Covers artificial intelligence and computer vision projects. Free to audit.',
		region: 'global',
	},
	{
		title: 'IBM Data Science Professional Certificate',
		org: 'IBM (Coursera)',
		url: 'https://www.coursera.org/professional-certificates/ibm-data-science',
		description: 'Python, data analysis, SQL, data visualisation, machine learning, and Jupyter notebooks. Hands-on data science projects. Free to audit on Coursera.',
		region: 'global',
	},
	{
		title: 'IBM AI Engineering Professional Certificate',
		org: 'IBM (Coursera)',
		url: 'https://www.coursera.org/professional-certificates/ai-engineer',
		description: 'Machine learning, deep learning, neural networks, PyTorch, Keras, and TensorFlow. Build AI and computer vision applications using Python. Free to audit.',
		region: 'global',
	},
	{
		title: 'Meta Back-End Developer Professional Certificate',
		org: 'Meta (Coursera)',
		url: 'https://www.coursera.org/professional-certificates/meta-back-end-developer',
		description: 'Python, Django, REST APIs, databases, version control, and backend development. Entry-level back-end software developer roles. Free to audit on Coursera.',
		region: 'global',
	},
	{
		title: 'Meta Front-End Developer Professional Certificate',
		org: 'Meta (Coursera)',
		url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
		description: 'HTML, CSS, JavaScript, React, UX design principles, and frontend development. Entry-level front-end software developer roles. Free to audit on Coursera.',
		region: 'global',
	},
	{
		title: 'Algorithms Specialization',
		org: 'Stanford (Coursera)',
		url: 'https://www.coursera.org/specializations/algorithms',
		description: 'Computer science algorithm design and analysis: sorting, graph algorithms, dynamic programming, greedy algorithms, and NP-completeness. Core computer science fundamentals. Free to audit.',
		region: 'global',
	},
	{
		title: 'IBM Cybersecurity Analyst Professional Certificate',
		org: 'IBM (Coursera)',
		url: 'https://www.coursera.org/professional-certificates/ibm-cybersecurity-analyst',
		description: 'Cybersecurity, threat intelligence, security operations, SIEM, network security, and incident response. Entry-level security analyst roles. Free to audit on Coursera.',
		region: 'global',
	},
	{
		title: 'IBM Full Stack Software Developer Professional Certificate',
		org: 'IBM (Coursera)',
		url: 'https://www.coursera.org/professional-certificates/ibm-full-stack-cloud-developer',
		description: 'HTML, CSS, JavaScript, React, Node.js, Python, Django, cloud computing, containers, and Docker. Full-stack web development and cloud deployment. Free to audit.',
		region: 'global',
	},

	// ── Microsoft Learn ──────────────────────────────────────────────────────
	{
		title: 'Microsoft Azure Fundamentals (AZ-900)',
		org: 'Microsoft',
		url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/',
		description: 'Cloud computing concepts, Azure services, security, compliance, pricing, and Azure infrastructure. Entry-level Microsoft Azure cloud certification. Free learning paths on Microsoft Learn.',
		region: 'global',
	},
	{
		title: 'Microsoft Azure AI Fundamentals (AI-900)',
		org: 'Microsoft',
		url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/',
		description: 'Artificial intelligence, machine learning workloads, natural language processing, computer vision, and Azure AI services. Free learning paths on Microsoft Learn.',
		region: 'global',
	},
	{
		title: 'Microsoft Azure Data Fundamentals (DP-900)',
		org: 'Microsoft',
		url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-data-fundamentals/',
		description: 'Core data concepts, relational databases, non-relational data, analytics, and Azure data services. Free learning paths on Microsoft Learn.',
		region: 'global',
	},
	{
		title: 'Microsoft Power BI Data Analyst Associate (PL-300)',
		org: 'Microsoft',
		url: 'https://learn.microsoft.com/en-us/credentials/certifications/data-analyst-associate/',
		description: 'Power BI, data modeling, DAX, data visualisation, business intelligence dashboards, and report design. Data analyst roles. Free learning paths on Microsoft Learn.',
		region: 'global',
	},
	{
		title: 'Microsoft Azure Developer Associate (AZ-204)',
		org: 'Microsoft',
		url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-developer/',
		description: 'Azure compute, storage, security, cloud-native development, serverless, APIs, and DevOps. Software developer and cloud developer roles. Free learning paths on Microsoft Learn.',
		region: 'global',
	},

	// ── AWS Training ─────────────────────────────────────────────────────────
	{
		title: 'AWS Cloud Practitioner Essentials',
		org: 'Amazon Web Services',
		url: 'https://explore.skillbuilder.aws/learn/courses/134/aws-cloud-practitioner-essentials',
		description: 'AWS cloud concepts, services, security, architecture, pricing, and cloud infrastructure fundamentals. Free digital training on AWS Skill Builder.',
		region: 'global',
	},
	{
		title: 'AWS Machine Learning Foundations',
		org: 'Amazon Web Services',
		url: 'https://explore.skillbuilder.aws/learn/courses/22-amazon-sagemaker-studio-lab-getting-started',
		description: 'Introduction to machine learning, deep learning, natural language processing, and computer vision using AWS tools. Free on AWS Skill Builder.',
		region: 'global',
	},
	{
		title: 'AWS Data Engineering Learning Plan',
		org: 'Amazon Web Services',
		url: 'https://explore.skillbuilder.aws/learn/public/learning_plan/view/1046/data-engineering-learning-plan',
		description: 'Data lakes, analytics, streaming data, AWS Glue, Amazon Redshift, and cloud data engineering pipelines. Free on AWS Skill Builder.',
		region: 'global',
	},

	// ── edX / Harvard / MIT ──────────────────────────────────────────────────
	{
		title: 'CS50: Introduction to Computer Science (Harvard)',
		org: 'Harvard University (edX)',
		url: 'https://cs50.harvard.edu/x/',
		description: 'Introduction to computer science covering algorithms, data structures, C, Python, SQL, JavaScript, and web development. Free to enroll; certificate available.',
		region: 'global',
	},
	{
		title: 'CS50\'s Introduction to AI with Python (Harvard)',
		org: 'Harvard University (edX)',
		url: 'https://cs50.harvard.edu/ai/',
		description: 'Artificial intelligence concepts using Python: graph search algorithms, machine learning, neural networks, natural language processing, and computer vision. Free to enroll.',
		region: 'global',
	},
	{
		title: 'CS50\'s Web Programming with Python and JavaScript (Harvard)',
		org: 'Harvard University (edX)',
		url: 'https://cs50.harvard.edu/web/',
		description: 'Web programming with Python, JavaScript, Django, SQL, React, GitHub, and cloud deployment. Full-stack web development. Free to enroll.',
		region: 'global',
	},
	{
		title: 'Introduction to Computer Science and Programming Using Python (MIT)',
		org: 'MIT (edX)',
		url: 'https://www.edx.org/learn/computer-science/massachusetts-institute-of-technology-introduction-to-computer-science-and-programming-using-python',
		description: 'MIT 6.0001: Python programming, algorithms, data structures, and computational problem solving. Core computer science fundamentals. Free to audit on edX.',
		region: 'global',
	},
	{
		title: 'Data Analysis in Social Science — Assessing Your Knowledge (MIT)',
		org: 'MIT (edX)',
		url: 'https://www.edx.org/learn/data-analysis/massachusetts-institute-of-technology-data-analysis-in-social-science-assessing-your-knowledge',
		description: 'Statistics, probability, data analysis, Python, and inference for data science. Free to audit on edX.',
		region: 'global',
	},

	// ── freeCodeCamp ─────────────────────────────────────────────────────────
	{
		title: 'Responsive Web Design Certification',
		org: 'freeCodeCamp',
		url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
		description: 'HTML, CSS, Flexbox, Grid, and responsive web design for frontend development. Build accessible web pages. Free certification with projects.',
		region: 'global',
	},
	{
		title: 'JavaScript Algorithms and Data Structures Certification',
		org: 'freeCodeCamp',
		url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/',
		description: 'JavaScript programming, algorithms, data structures, object-oriented programming, and functional programming. Coding fundamentals. Free certification.',
		region: 'global',
	},
	{
		title: 'Front End Development Libraries Certification',
		org: 'freeCodeCamp',
		url: 'https://www.freecodecamp.org/learn/front-end-development-libraries/',
		description: 'React, Redux, Bootstrap, jQuery, and modern frontend development libraries. Frontend JavaScript development projects. Free certification.',
		region: 'global',
	},
	{
		title: 'Back End Development and APIs Certification',
		org: 'freeCodeCamp',
		url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/',
		description: 'Node.js, Express.js, MongoDB, REST APIs, and backend web development. Build full-stack JavaScript applications. Free certification.',
		region: 'global',
	},
	{
		title: 'Scientific Computing with Python Certification',
		org: 'freeCodeCamp',
		url: 'https://www.freecodecamp.org/learn/scientific-computing-with-python/',
		description: 'Python programming, data structures, algorithms, object-oriented programming, and scientific computing. Python fundamentals. Free certification.',
		region: 'global',
	},
	{
		title: 'Data Analysis with Python Certification',
		org: 'freeCodeCamp',
		url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/',
		description: 'Python, NumPy, Pandas, data analysis, data visualisation, and Jupyter notebooks. Data science fundamentals. Free certification.',
		region: 'global',
	},
	{
		title: 'Machine Learning with Python Certification',
		org: 'freeCodeCamp',
		url: 'https://www.freecodecamp.org/learn/machine-learning-with-python/',
		description: 'Machine learning algorithms, TensorFlow, neural networks, and Python. Build AI and ML models. Free certification from freeCodeCamp.',
		region: 'global',
	},
	{
		title: 'Relational Database Certification',
		org: 'freeCodeCamp',
		url: 'https://www.freecodecamp.org/learn/relational-database/',
		description: 'SQL, PostgreSQL, relational database design, Bash scripting, and Git. Database programming fundamentals. Free certification.',
		region: 'global',
	},

	// ── Kaggle (free) ────────────────────────────────────────────────────────
	{
		title: 'Intro to Machine Learning (Kaggle)',
		org: 'Kaggle',
		url: 'https://www.kaggle.com/learn/intro-to-machine-learning',
		description: 'Decision trees, random forests, model validation, and machine learning with Python and scikit-learn. Data science competition skills. Free Kaggle certificate.',
		region: 'global',
	},
	{
		title: 'Pandas (Kaggle)',
		org: 'Kaggle',
		url: 'https://www.kaggle.com/learn/pandas',
		description: 'Data analysis using Python Pandas: selecting, filtering, grouping, and transforming datasets. Data science and analytics skills. Free Kaggle certificate.',
		region: 'global',
	},
	{
		title: 'Deep Learning (Kaggle)',
		org: 'Kaggle',
		url: 'https://www.kaggle.com/learn/deep-learning',
		description: 'Deep learning with TensorFlow and Keras, neural networks, computer vision, and transfer learning using Python. AI project skills. Free Kaggle certificate.',
		region: 'global',
	},
	{
		title: 'Natural Language Processing (Kaggle)',
		org: 'Kaggle',
		url: 'https://www.kaggle.com/learn/natural-language-processing',
		description: 'NLP, text classification, word vectors, and machine learning for natural language processing with Python. Free Kaggle certificate.',
		region: 'global',
	},
	{
		title: 'SQL (Kaggle)',
		org: 'Kaggle',
		url: 'https://www.kaggle.com/learn/intro-to-sql',
		description: 'SQL fundamentals, database queries, BigQuery, data analysis, and filtering large datasets. Data analytics skill. Free Kaggle certificate.',
		region: 'global',
	},
	{
		title: 'Intro to AI Ethics (Kaggle)',
		org: 'Kaggle',
		url: 'https://www.kaggle.com/learn/intro-to-ai-ethics',
		description: 'Artificial intelligence ethics, bias in machine learning, fairness, accountability, and responsible AI development. Free Kaggle certificate.',
		region: 'global',
	},

	// ── NPTEL (India, free from IITs) ────────────────────────────────────────
	{
		title: 'Introduction to Machine Learning (NPTEL)',
		org: 'IIT Madras / NPTEL',
		url: 'https://nptel.ac.in/courses/106106139',
		description: 'Machine learning algorithms, supervised and unsupervised learning, neural networks, deep learning, and Python. IIT-certified free online course with proctored exam.',
		region: 'india',
	},
	{
		title: 'Python for Data Science (NPTEL)',
		org: 'IIT Madras / NPTEL',
		url: 'https://nptel.ac.in/courses/106106212',
		description: 'Python programming, data science, NumPy, Pandas, data analysis, and machine learning. Free NPTEL certificate with elite/topper distinction.',
		region: 'india',
	},
	{
		title: 'Data Science for Engineers (NPTEL)',
		org: 'IIT Madras / NPTEL',
		url: 'https://nptel.ac.in/courses/106106179',
		description: 'Data science, statistics, Python, data analysis, machine learning, and analytics for engineering students. Free IIT-certified course.',
		region: 'india',
	},
	{
		title: 'Programming in Java (NPTEL)',
		org: 'IIT Kharagpur / NPTEL',
		url: 'https://nptel.ac.in/courses/106105191',
		description: 'Java programming, object-oriented programming, data structures, algorithms, and software development. Free NPTEL certificate with proctored exam.',
		region: 'india',
	},
	{
		title: 'Cloud Computing (NPTEL)',
		org: 'IIT Kharagpur / NPTEL',
		url: 'https://nptel.ac.in/courses/106105167',
		description: 'Cloud computing, virtualization, Google Cloud, AWS, Azure, cloud architecture, and infrastructure. Free IIT-certified course with exam.',
		region: 'india',
	},
	{
		title: 'Ethical Hacking (NPTEL)',
		org: 'IIT Kharagpur / NPTEL',
		url: 'https://nptel.ac.in/courses/106105217',
		description: 'Ethical hacking, cybersecurity, penetration testing, network security, cryptography, and web security fundamentals. Free NPTEL course with exam.',
		region: 'india',
	},
	{
		title: 'Problem Solving Through Programming in C (NPTEL)',
		org: 'IIT Kharagpur / NPTEL',
		url: 'https://nptel.ac.in/courses/106105085',
		description: 'C programming, algorithm design, problem solving, data structures, and computational thinking. Free IIT-certified course for beginner programmers.',
		region: 'india',
	},
	{
		title: 'Introduction to Internet of Things (NPTEL)',
		org: 'IIT Kharagpur / NPTEL',
		url: 'https://nptel.ac.in/courses/106105166',
		description: 'IoT architecture, sensors, embedded systems, networking, cloud technology, and Arduino programming. Free NPTEL course with exam.',
		region: 'india',
	},

	// ── Cisco NetAcad ────────────────────────────────────────────────────────
	{
		title: 'Cisco Networking Basics',
		org: 'Cisco NetAcad',
		url: 'https://skillsforall.com/course/networking-basics',
		description: 'Network fundamentals, TCP/IP, routing, switching, wireless networking, and internet infrastructure. Free beginner course from Cisco Skills for All.',
		region: 'global',
	},
	{
		title: 'Cisco Introduction to Cybersecurity',
		org: 'Cisco NetAcad',
		url: 'https://skillsforall.com/course/introduction-to-cybersecurity',
		description: 'Cybersecurity fundamentals, threat landscape, network security, cryptography, and security best practices. Free beginner course from Cisco Skills for All.',
		region: 'global',
	},
	{
		title: 'Cisco Python Essentials 1',
		org: 'Cisco NetAcad',
		url: 'https://skillsforall.com/course/python-essentials-1',
		description: 'Python programming fundamentals, data types, control flow, functions, and basic algorithms. Free programming course from Cisco Skills for All.',
		region: 'global',
	},

	// ── IBM SkillsBuild ──────────────────────────────────────────────────────
	{
		title: 'IBM Python for Data Science (Cognitive Class)',
		org: 'IBM / Cognitive Class',
		url: 'https://cognitiveclass.ai/courses/python-for-data-science',
		description: 'Python for data science: Pandas, NumPy, data analysis, Jupyter notebooks, and scientific computing. Free IBM badge on completion.',
		region: 'global',
	},
	{
		title: 'IBM Machine Learning with Python (Cognitive Class)',
		org: 'IBM / Cognitive Class',
		url: 'https://cognitiveclass.ai/courses/machine-learning-with-python',
		description: 'Machine learning algorithms using Python and scikit-learn: regression, classification, clustering, and recommender systems. Free IBM badge.',
		region: 'global',
	},
	{
		title: 'IBM Docker Essentials: A Developer Introduction',
		org: 'IBM / Cognitive Class',
		url: 'https://cognitiveclass.ai/courses/docker-essentials',
		description: 'Docker containers, images, microservices, DevOps workflows, and containerization for software development. Free IBM badge.',
		region: 'global',
	},

	// ── Meta ──────────────────────────────────────────────────────────────────
	{ title: 'Meta Front-End Developer Professional Certificate', org: 'Meta', url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer', description: 'HTML, CSS, JavaScript, React, UI/UX design, and version control. Taught by Meta engineers. Free to audit on Coursera.', region: 'global' },
	{ title: 'Meta Back-End Developer Professional Certificate', org: 'Meta', url: 'https://www.coursera.org/professional-certificates/meta-back-end-developer', description: 'Python, Django REST API, databases, and cloud deployment. Taught by Meta engineers. Free to audit on Coursera.', region: 'global' },
	{ title: 'Meta Database Engineer Professional Certificate', org: 'Meta', url: 'https://www.coursera.org/professional-certificates/meta-database-engineer', description: 'MySQL, Python, database architecture, SQL for data science. Free to audit on Coursera.', region: 'global' },

	// ── DeepLearning.AI ──────────────────────────────────────────────────────
	{ title: 'Deep Learning Specialization', org: 'DeepLearning.AI', url: 'https://www.coursera.org/specializations/deep-learning', description: 'Neural networks, CNNs, RNNs, LSTM, sequence models, and ML strategy. 5-course specialization by Andrew Ng. Free to audit.', region: 'global' },
	{ title: 'Machine Learning Specialization', org: 'DeepLearning.AI / Stanford', url: 'https://www.coursera.org/specializations/machine-learning-introduction', description: 'Supervised, unsupervised, and reinforcement learning with Python. By Andrew Ng. Free to audit.', region: 'global' },
	{ title: 'Generative AI for Everyone', org: 'DeepLearning.AI', url: 'https://www.coursera.org/learn/generative-ai-for-everyone', description: 'LLMs, prompting, RAG, and real-world AI applications. Free to audit.', region: 'global' },
	{ title: 'LangChain for LLM Application Development', org: 'DeepLearning.AI', url: 'https://www.deeplearning.ai/short-courses/langchain-for-llm-application-development/', description: 'Build LLM apps using LangChain: chains, agents, memory, and RAG. Free short course.', region: 'global' },
	{ title: 'Prompt Engineering for Developers', org: 'DeepLearning.AI', url: 'https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/', description: 'Prompting best practices with the OpenAI API: summarisation, inference, and chatbots. Free course.', region: 'global' },

	// ── NPTEL / Swayam India ─────────────────────────────────────────────────
	{ title: 'Data Science for Engineers', org: 'NPTEL / IIT Madras', url: 'https://nptel.ac.in/courses/106106195', description: 'Statistics, Python, regression, classification, clustering, and neural networks. NPTEL certificate. Free on Swayam.', region: 'india' },
	{ title: 'Programming, Data Structures and Algorithms using Python', org: 'NPTEL / IIT Madras', url: 'https://nptel.ac.in/courses/106106145', description: 'Core Python, data structures, and algorithm design. NPTEL certificate. Free on Swayam.', region: 'india' },
	{ title: 'Introduction to Machine Learning', org: 'NPTEL / IIT Kharagpur', url: 'https://nptel.ac.in/courses/106105152', description: 'Decision trees, SVM, neural networks, clustering. NPTEL certificate. Free on Swayam.', region: 'india' },
	{ title: 'Cloud Computing', org: 'NPTEL / IIT Kharagpur', url: 'https://nptel.ac.in/courses/106105167', description: 'Cloud service models, virtualisation, AWS, Azure, MapReduce. NPTEL certificate. Free on Swayam.', region: 'india' },
	{ title: 'Database Management System', org: 'NPTEL / IIT Madras', url: 'https://nptel.ac.in/courses/106106093', description: 'SQL, ER diagrams, normalisation, transactions, query optimisation. NPTEL certificate. Free on Swayam.', region: 'india' },
	{ title: 'Joy of Computing using Python', org: 'NPTEL / IIT Ropar', url: 'https://nptel.ac.in/courses/106106168', description: 'Beginner Python with games and simulations. Great for first-year undergrads. Free NPTEL certificate on Swayam.', region: 'india' },
	{ title: 'Introduction to Internet of Things', org: 'NPTEL / IIT Kharagpur', url: 'https://nptel.ac.in/courses/106105166', description: 'IoT architecture, Raspberry Pi, Arduino, and cloud connectivity. NPTEL certificate. Free on Swayam.', region: 'india' },
	{ title: 'Ethical Hacking', org: 'NPTEL / IIT Kharagpur', url: 'https://nptel.ac.in/courses/106105217', description: 'Penetration testing, network security, cryptography, web app security. NPTEL certificate. Free on Swayam.', region: 'india' },
	{ title: 'Software Engineering', org: 'NPTEL / IIT Bombay', url: 'https://nptel.ac.in/courses/106101061', description: 'SDLC, agile, UML, design patterns, testing. NPTEL certificate. Free on Swayam.', region: 'india' },
	{ title: 'Blockchain and its Applications', org: 'NPTEL / IIT Kharagpur', url: 'https://nptel.ac.in/courses/106105184', description: 'Bitcoin, Ethereum, smart contracts, Solidity, consensus mechanisms, and DApps. NPTEL certificate. Free on Swayam.', region: 'india' },
	{ title: 'Design Thinking — A Primer', org: 'NPTEL / IIT Bombay', url: 'https://nptel.ac.in/courses/109101092', description: 'Human-centred design, empathy mapping, ideation, and prototyping. NPTEL certificate. Free on Swayam.', region: 'india' },

	// ── Cisco NetAcad ────────────────────────────────────────────────────────
	{ title: 'CCNA: Introduction to Networks', org: 'Cisco Networking Academy', url: 'https://www.netacad.com/courses/ccna-introduction-networks', description: 'Network fundamentals, Ethernet, IP addressing, routing, and switching. Free Cisco NetAcad certificate.', region: 'global' },
	{ title: 'Cybersecurity Essentials', org: 'Cisco Networking Academy', url: 'https://www.netacad.com/courses/cybersecurity-essentials', description: 'Cyber threats, vulnerabilities, cryptography, and incident response. Free Cisco certificate.', region: 'global' },
	{ title: 'Introduction to Data Science', org: 'Cisco Networking Academy', url: 'https://www.netacad.com/courses/data-science', description: 'Data analysis, visualisation, SQL, Python, and ML basics. Free Cisco certificate.', region: 'global' },
	{ title: 'Python Essentials 1 & 2', org: 'Cisco Networking Academy', url: 'https://www.netacad.com/courses/python-essentials-1', description: 'Python from basics to OOP, file handling, and modules. Free Cisco certificate.', region: 'global' },

	// ── Microsoft / GitHub ────────────────────────────────────────────────────
	{ title: 'GitHub Foundations Certification', org: 'GitHub', url: 'https://examregistration.github.com/certification/GHF', description: 'Git, GitHub repos, pull requests, Actions, Codespaces. Free exam voucher available periodically.', region: 'global' },
	{ title: 'Microsoft Azure Fundamentals (AZ-900)', org: 'Microsoft', url: 'https://learn.microsoft.com/en-us/certifications/azure-fundamentals/', description: 'Cloud concepts, Azure services, security, compliance. Entry-level cert with free Microsoft Learn path.', region: 'global' },
	{ title: 'Microsoft AI Fundamentals (AI-900)', org: 'Microsoft', url: 'https://learn.microsoft.com/en-us/certifications/azure-ai-fundamentals/', description: 'ML workloads, computer vision, NLP, and conversational AI on Azure. Free learning path.', region: 'global' },
	{ title: 'Power BI Data Analyst Associate (PL-300)', org: 'Microsoft', url: 'https://learn.microsoft.com/en-us/certifications/power-bi-data-analyst-associate/', description: 'Data prep, modelling, visualisation, and analysis with Power BI. Free Microsoft Learn path.', region: 'global' },

	// ── Kaggle ───────────────────────────────────────────────────────────────
	{ title: 'Kaggle Python Course', org: 'Kaggle', url: 'https://www.kaggle.com/learn/python', description: 'Python for data science: syntax, functions, loops, and libraries. Free Kaggle certificate.', region: 'global' },
	{ title: 'Kaggle Machine Learning', org: 'Kaggle', url: 'https://www.kaggle.com/learn/intro-to-machine-learning', description: 'Decision trees, random forests, XGBoost, and cross-validation. Free Kaggle certificate.', region: 'global' },
	{ title: 'Kaggle Deep Learning', org: 'Kaggle', url: 'https://www.kaggle.com/learn/deep-learning', description: 'Computer vision with TensorFlow/Keras: CNNs and transfer learning. Free Kaggle certificate.', region: 'global' },
	{ title: 'Kaggle NLP', org: 'Kaggle', url: 'https://www.kaggle.com/learn/natural-language-processing', description: 'Text processing, word vectors, word2vec, spaCy. Free Kaggle certificate.', region: 'global' },
	{ title: 'Kaggle Pandas', org: 'Kaggle', url: 'https://www.kaggle.com/learn/pandas', description: 'Data manipulation with Pandas: indexing, aggregation, groupby, merging. Free Kaggle certificate.', region: 'global' },
	{ title: 'Kaggle SQL', org: 'Kaggle', url: 'https://www.kaggle.com/learn/intro-to-sql', description: 'SQL for data analysis: SELECT, JOIN, aggregation, subqueries, window functions. Free Kaggle certificate.', region: 'global' },
	{ title: 'Kaggle AI Ethics', org: 'Kaggle', url: 'https://www.kaggle.com/learn/intro-to-ai-ethics', description: 'Fairness, algorithmic bias, and responsible AI design. Free Kaggle certificate.', region: 'global' },
	{ title: 'Kaggle Geospatial Analysis', org: 'Kaggle', url: 'https://www.kaggle.com/learn/geospatial-analysis', description: 'Geospatial data, maps, and visualisation with geopandas and folium. Free Kaggle certificate.', region: 'global' },

	// ── Harvard / Stanford / edX ──────────────────────────────────────────────
	{ title: 'CS50: Introduction to Computer Science', org: 'Harvard / edX', url: 'https://www.edx.org/learn/computer-science/harvard-university-cs50-s-introduction-to-computer-science', description: 'C, Python, SQL, JavaScript, and web development. The world\'s most popular CS course. Free to audit on edX.', region: 'global' },
	{ title: 'CS50 Web Programming with Python and JavaScript', org: 'Harvard / edX', url: 'https://www.edx.org/learn/web-development/harvard-university-cs50-s-web-programming-with-python-and-javascript', description: 'Django, JavaScript, SQL, React, testing, and CI/CD. Full-stack web development. Free to audit on edX.', region: 'global' },
	{ title: 'CS50 AI with Python', org: 'Harvard / edX', url: 'https://www.edx.org/learn/artificial-intelligence/harvard-university-cs50-s-introduction-to-artificial-intelligence-with-python', description: 'Search, inference, ML, and neural networks in Python. Free to audit on edX.', region: 'global' },
	{ title: 'Algorithms Specialization', org: 'Stanford / Coursera', url: 'https://www.coursera.org/specializations/algorithms', description: 'Sorting, graph algorithms, greedy, dynamic programming, NP-completeness by Tim Roughgarden. Free to audit.', region: 'global' },

	// ── Design / Other ────────────────────────────────────────────────────────
	{ title: 'Figma UI/UX Design Fundamentals', org: 'Figma', url: 'https://help.figma.com/hc/en-us/categories/360002042553', description: 'UI design, prototyping, auto layout, components, design systems. Free official Figma learning resources.', region: 'global' },
	{ title: 'Salesforce Administrator Trailhead', org: 'Salesforce', url: 'https://trailhead.salesforce.com/credentials/administrator', description: 'CRM config, automation, reports, and security. Salesforce Admin is among India\'s most in-demand tech skills. Free prep on Trailhead.', region: 'global' },
];

// ── Collector ─────────────────────────────────────────────────────────────────

export async function collectCertificates(db: D1Database): Promise<CollectorResult> {
	let inserted = 0;
	const fetched = CATALOG.length;

	for (const cert of CATALOG) {
		const dedup_hash = await computeHash(`certificate:${cert.url}`);

		const result = await db
			.prepare(
				`INSERT OR IGNORE INTO opportunities
				 (type, title, organization, source, url, location, deadline, description, fit_score, status, dedup_hash, discovered_at, region)
				 VALUES ('certificate', ?, ?, 'curated', ?, 'Online', NULL, ?, NULL, 'new', ?, ?, ?)`,
			)
			.bind(cert.title, cert.org, cert.url, cert.description, dedup_hash, now(), cert.region)
			.run();

		if (result.meta.changes > 0) inserted++;
	}

	return { fetched, kept: fetched, inserted, skipped: fetched - inserted };
}
