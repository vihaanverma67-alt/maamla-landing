import { CollectorResult } from './types';
import { computeHash, now } from './utils';

interface NgoEntry {
	title: string;
	org: string;
	url: string;
	description: string;  // starts with "Time: X · Duration: Y · Cert: Z · ..."
	location: string;
	region: 'india' | 'global';
	deadline: string | null;
}

// ── Description format ────────────────────────────────────────────────────────
// "Time: <hrs/week or monthly> · Duration: <length> · Cert: <Yes/Letter/No> · <what you do>"
// Kept under 200 chars so the card truncation shows the key metadata.

const CATALOG: NgoEntry[] = [

	// ─── India — Education ────────────────────────────────────────────────────

	{
		title: 'MAD School Volunteer',
		org: 'Make a Difference (MAD)',
		url: 'https://makeadiff.in/volunteer',
		description: 'Time: 3-4 hrs/week · Duration: 10 months · Cert: Yes · Mentor underprivileged children in English, Math and life skills in 30+ Indian cities. Program runs August to May.',
		location: 'Pan-India (30+ cities)',
		region: 'india',
		deadline: null,
	},
	{
		title: 'Teach For India Fellowship',
		org: 'Teach For India',
		url: 'https://www.teachforindia.org/apply',
		description: 'Time: Full-time · Duration: 2 years · Cert: Nationally recognised fellowship · Teach in an under-resourced classroom in Mumbai, Delhi, Pune, Hyderabad, Ahmedabad, Bengaluru, Chennai, or Kolkata.',
		location: 'Mumbai / Delhi / Bengaluru / Pune + 4 more',
		region: 'india',
		deadline: null,
	},
	{
		title: 'Volunteer Teaching Program',
		org: 'Pratham Education Foundation',
		url: 'https://www.pratham.org/get-involved/volunteer',
		description: 'Time: 4-6 hrs/week · Duration: 3-6 months · Cert: Appreciation letter · Support literacy and numeracy education for out-of-school children across India through in-person or online teaching sessions.',
		location: 'Pan-India',
		region: 'india',
		deadline: null,
	},
	{
		title: 'Centre Volunteer',
		org: 'Akanksha Foundation',
		url: 'https://www.akanksha.org/volunteer',
		description: 'Time: 3-4 hrs/week · Duration: 6-10 months · Cert: Certificate of volunteering · Provide quality education and holistic development to children from low-income communities in Mumbai, Pune, and Delhi.',
		location: 'Mumbai / Pune / Delhi',
		region: 'india',
		deadline: null,
	},
	{
		title: 'Smile Volunteer Program',
		org: 'Smile Foundation',
		url: 'https://www.smilefoundationindia.org/volunteer.html',
		description: 'Time: 4-5 hrs/week · Duration: 3-12 months · Cert: Volunteering certificate · Support child education, health, and livelihood programs across India. Skills-based roles available in communications, design, and tech.',
		location: 'Pan-India',
		region: 'india',
		deadline: null,
	},
	{
		title: 'After-School Volunteer',
		org: 'Dream a Dream',
		url: 'https://dreamadream.org/volunteer/',
		description: 'Time: 3-4 hrs/week · Duration: 6-12 months · Cert: Certificate of completion · Facilitate life-skill sessions for children from vulnerable communities in Bengaluru through activity-based learning.',
		location: 'Bengaluru, India',
		region: 'india',
		deadline: null,
	},
	{
		title: 'Volunteer Mentor',
		org: 'Door Step School',
		url: 'https://doorstepschool.org/volunteer/',
		description: 'Time: 2-3 hrs/week · Duration: 3-6 months · Cert: Appreciation letter · Teach migrant and pavement-dwelling children in Mumbai and Pune. Commitment as a weekly reader or tutor.',
		location: 'Mumbai / Pune, India',
		region: 'india',
		deadline: null,
	},
	{
		title: 'Magic Bus Community Champion',
		org: 'Magic Bus',
		url: 'https://magicbus.org/get-involved/volunteer',
		description: 'Time: 4-5 hrs/week · Duration: 6-12 months · Cert: Certificate · Facilitate life-skills and sports sessions for children and youth from marginalised communities across India.',
		location: 'Pan-India (20+ cities)',
		region: 'india',
		deadline: null,
	},

	// ─── India — Social & Community ───────────────────────────────────────────

	{
		title: 'Robin Hood Army Volunteer',
		org: 'Robin Hood Army',
		url: 'https://robinhoodarmy.com/join',
		description: 'Time: 3-4 hrs/month (weekend drives) · Duration: Ongoing · Cert: Appreciation letter · Rescue surplus food from restaurants and distribute to the homeless and hungry. Active in 40+ Indian cities.',
		location: 'Pan-India (40+ cities)',
		region: 'india',
		deadline: null,
	},
	{
		title: 'Volunteer Activist',
		org: 'CRY — Child Rights and You',
		url: 'https://www.cry.org/get-involved/volunteer.html',
		description: 'Time: 2-4 hrs/week · Duration: Ongoing · Cert: Certificate after milestones · Advocate for child rights through online campaigns, fundraising marathons, and community awareness drives across India.',
		location: 'Pan-India',
		region: 'india',
		deadline: null,
	},
	{
		title: 'Youth for Seva Volunteer',
		org: 'Youth for Seva',
		url: 'https://www.youthforseva.org/volunteer',
		description: 'Time: 3-4 hrs/week · Duration: 3-6 months · Cert: Certificate · Participate in community service projects covering education, environment, and social welfare in Bengaluru and expanding cities.',
		location: 'Bengaluru / Hyderabad, India',
		region: 'india',
		deadline: null,
	},
	{
		title: 'Urban Outreach Volunteer',
		org: 'Pravah',
		url: 'https://pravah.org/get-involved/',
		description: 'Time: 4-5 hrs/week · Duration: 3-6 months · Cert: Programme certificate · Work with adolescents and youth on issues of identity, leadership, and social change in Delhi and NCR.',
		location: 'Delhi / NCR, India',
		region: 'india',
		deadline: null,
	},
	{
		title: 'AIESEC Leadership Experience',
		org: 'AIESEC India',
		url: 'https://aiesec.in/',
		description: 'Time: 5-8 hrs/week · Duration: 6-8 weeks · Cert: International AIESEC certificate · Lead social impact projects, attend leadership seminars, and join a global youth network. Chapters in 45+ Indian cities.',
		location: 'Pan-India (45+ cities)',
		region: 'india',
		deadline: null,
	},
	{
		title: 'Volunteer Distributor',
		org: 'Goonj',
		url: 'https://goonj.org/volunteer/',
		description: 'Time: 4-8 hrs/month (collection drives) · Duration: Ongoing · Cert: Appreciation letter · Collect, sort, and distribute urban surplus materials — clothing, books, household goods — to rural communities across India.',
		location: 'Pan-India (20+ cities)',
		region: 'india',
		deadline: null,
	},
	{
		title: 'Habitat Volunteer Build',
		org: 'Habitat for Humanity India',
		url: 'https://www.habitatindia.org/volunteer',
		description: 'Time: Weekend builds (1-2 days) · Duration: Project-based · Cert: Volunteer certificate · Help build homes for families in need through hands-on construction and community engagement in cities across India.',
		location: 'Pan-India',
		region: 'india',
		deadline: null,
	},
	{
		title: 'Street Child Volunteer',
		org: 'Salaam Baalak Trust',
		url: 'https://www.salaambaalaktrust.com/volunteer/',
		description: 'Time: 3-4 hrs/week · Duration: 3-6 months · Cert: Volunteering certificate · Support street and runaway children in Delhi through education, shelter, and rehabilitation programs.',
		location: 'Delhi, India',
		region: 'india',
		deadline: null,
	},
	{
		title: 'National Service Scheme (NSS)',
		org: 'Ministry of Youth Affairs, Govt. of India',
		url: 'https://nss.gov.in/',
		description: 'Time: 4 hrs/week · Duration: 1-2 years (120 hrs/year) · Cert: NSS certificate (MHRD-recognised, adds 5 marks on board exams) · Community service through your college unit covering health, literacy, and environment.',
		location: 'Pan-India (college-based)',
		region: 'india',
		deadline: null,
	},
	{
		title: 'HelpAge Volunteer',
		org: 'HelpAge India',
		url: 'https://www.helpageindia.org/volunteer.php',
		description: 'Time: 2-3 hrs/week · Duration: 3 months+ · Cert: Certificate of appreciation · Support elderly citizens through mobile medical units, digital literacy classes, and elder care home visits across India.',
		location: 'Pan-India',
		region: 'india',
		deadline: null,
	},
	{
		title: 'Round Table India Volunteer',
		org: 'Round Table India Foundation',
		url: 'https://www.rtif.org/',
		description: 'Time: 4-6 hrs/month · Duration: Ongoing · Cert: Appreciation certificate · Build primary schools for rural communities; also supports scholarships and literacy projects in India.',
		location: 'Pan-India',
		region: 'india',
		deadline: null,
	},
	{
		title: 'iVolunteer Program',
		org: 'iVolunteer',
		url: 'http://www.ivolunteer.in/',
		description: 'Time: Varies by project · Duration: 1-6 months · Cert: Varies by partner NGO · India platform connecting volunteers with 200+ NGOs. Roles in teaching, fundraising, communications, tech, design, and events.',
		location: 'Pan-India (online + offline)',
		region: 'india',
		deadline: null,
	},
	{
		title: 'Project Nanhi Kali Volunteer',
		org: 'Project Nanhi Kali (Naandi Foundation)',
		url: 'https://www.nanhikali.org/volunteer.aspx',
		description: 'Time: 2-3 hrs/week · Duration: Academic year · Cert: Certificate · Support the education of underprivileged girls in India through online mentorship or community mobilisation programs.',
		location: 'Pan-India',
		region: 'india',
		deadline: null,
	},
	{
		title: 'Give.do Volunteer Listings',
		org: 'Give.do (GiveIndia)',
		url: 'https://www.give.do/volunteer',
		description: 'Time: Varies · Duration: Varies · Cert: Varies by NGO · India\'s largest volunteering platform. Browse hundreds of online and offline roles with vetted NGOs across education, health, environment, and social welfare.',
		location: 'Pan-India (online + offline)',
		region: 'india',
		deadline: null,
	},

	// ─── India — Environment ──────────────────────────────────────────────────

	{
		title: 'Green Volunteer',
		org: 'Greenpeace India',
		url: 'https://www.greenpeace.org/india/en/get-involved/',
		description: 'Time: 2-4 hrs/week · Duration: Ongoing · Cert: Volunteer certificate · Participate in online campaigns, street outreach, and petition drives focused on climate, forests, oceans, and sustainable energy in India.',
		location: 'Pan-India',
		region: 'india',
		deadline: null,
	},
	{
		title: 'Wildlife Conservation Volunteer',
		org: 'WWF India',
		url: 'https://www.wwfindia.org/get_involved/volunteers/',
		description: 'Time: 3-5 hrs/week · Duration: 3-6 months · Cert: WWF volunteer certificate · Support conservation field research, biodiversity surveys, community education, and awareness campaigns across India.',
		location: 'Pan-India',
		region: 'india',
		deadline: null,
	},

	// ─── India — Tech & Innovation ────────────────────────────────────────────

	{
		title: 'Tech Volunteer for Social Good',
		org: 'NASSCOM Foundation',
		url: 'https://nasscomfoundation.org/programs/volunteers/',
		description: 'Time: 3-5 hrs/week · Duration: 3-6 months · Cert: NASSCOM volunteer certificate · Use tech, data, software development, and digital skills to support NGOs and social enterprises across India. Online roles available.',
		location: 'Pan-India (online + offline)',
		region: 'india',
		deadline: null,
	},
	{
		title: 'Tech Policy Volunteer',
		org: 'iSPIRT Foundation',
		url: 'https://ispirt.in/',
		description: 'Time: 3-5 hrs/week · Duration: Project-based · Cert: Recognition letter · Contribute to India stack and open technology policy — software development, research, documentation, and public interest technology advocacy.',
		location: 'Online / Bengaluru, India',
		region: 'india',
		deadline: null,
	},
	{
		title: 'Agricultural Technology Volunteer',
		org: 'Digital Green',
		url: 'https://www.digitalgreen.org/get-involved/',
		description: 'Time: 4-5 hrs/week · Duration: 3-6 months · Cert: Programme certificate · Support technology-driven agricultural development projects in rural India — data collection, video production, platform support, and field research.',
		location: 'Pan-India / Online',
		region: 'india',
		deadline: null,
	},
	{
		title: 'Pratham InfoTech Volunteer',
		org: 'Pratham InfoTech Foundation',
		url: 'https://www.pif.org.in/volunteer',
		description: 'Time: 3-4 hrs/week · Duration: 3-6 months · Cert: Certificate · Teach digital literacy and computer skills to underprivileged youth and adults in community centres across India.',
		location: 'Pan-India',
		region: 'india',
		deadline: null,
	},

	// ─── India — Disability & Inclusion ──────────────────────────────────────

	{
		title: 'Buddy Volunteer',
		org: 'Samarthanam Trust for the Disabled',
		url: 'https://samarthanam.org/volunteer/',
		description: 'Time: 2-4 hrs/week · Duration: 3-6 months · Cert: Volunteering certificate · Support people with visual or other disabilities through sports coaching, digital assistance, audio description, and skilling programs in Bengaluru and beyond.',
		location: 'Bengaluru / Pan-India',
		region: 'india',
		deadline: null,
	},

	// ─── Global / Online ──────────────────────────────────────────────────────

	{
		title: 'UN Online Volunteer',
		org: 'United Nations Volunteers (UNV)',
		url: 'https://www.unv.org/become-volunteer',
		description: 'Time: 2-8 hrs/week · Duration: 1-6 months · Cert: UN certificate · Remote volunteer assignments in research, translation, web development, graphic design, and communications for UN agencies worldwide. Open to students.',
		location: 'Online (Global)',
		region: 'global',
		deadline: null,
	},
	{
		title: 'Skills-Based Online Volunteer',
		org: 'Catchafire',
		url: 'https://www.catchafire.org/',
		description: 'Time: 2-40 hrs (project-based) · Duration: 1 week to 3 months · Cert: Project badge · Match your professional skills — design, coding, marketing, finance, writing — to high-impact nonprofit projects online. Free to join.',
		location: 'Online (Global)',
		region: 'global',
		deadline: null,
	},
	{
		title: 'Translator Volunteer',
		org: 'Translators Without Borders',
		url: 'https://translatorswithoutborders.org/volunteer/',
		description: 'Time: 1-5 hrs/week · Duration: Ongoing · Cert: Volunteer badge · Translate humanitarian content into local languages for NGOs and crisis response teams. Supports Hindi, Tamil, Telugu, Kannada, and 200+ other languages.',
		location: 'Online (Global)',
		region: 'global',
		deadline: null,
	},
	{
		title: 'Human Rights Volunteer',
		org: 'Amnesty International India',
		url: 'https://www.amnesty.org.in/volunteer/',
		description: 'Time: 2-3 hrs/week · Duration: Ongoing · Cert: Volunteer ID · Campaign for human rights through online petitions, letter writing, social media activism, and local awareness events across India.',
		location: 'Online / Pan-India',
		region: 'india',
		deadline: null,
	},
	{
		title: 'Wikipedia Editor / Contributor',
		org: 'Wikimedia Foundation',
		url: 'https://en.wikipedia.org/wiki/Wikipedia:Getting_started',
		description: 'Time: 1-5 hrs/week · Duration: Ongoing · Cert: Contributor barnstars/recognition · Write and improve Wikipedia articles in English or Indian languages. Great for research, writing, and fact-checking skill development.',
		location: 'Online (Global)',
		region: 'global',
		deadline: null,
	},
	{
		title: 'OpenStreetMap Contributor',
		org: 'OpenStreetMap Foundation',
		url: 'https://www.openstreetmap.org/welcome',
		description: 'Time: 1-4 hrs/week · Duration: Ongoing · Cert: Contributor profile · Map roads, buildings, and community infrastructure for the world\'s open geographic database. Used in disaster response, humanitarian aid, and navigation.',
		location: 'Online (Global)',
		region: 'global',
		deadline: null,
	},
	{
		title: 'Engineering for Development Volunteer',
		org: 'Engineers Without Borders International',
		url: 'https://www.ewb-international.org/get-involved/',
		description: 'Time: 3-6 hrs/week · Duration: 3-6 months · Cert: EWB membership certificate · Apply engineering and technology skills to sustainable development challenges in low-resource communities. Online project teams and field placements.',
		location: 'Online / Field (Global)',
		region: 'global',
		deadline: null,
	},
	{
		title: 'Climate Reality Volunteer',
		org: 'Climate Reality Project',
		url: 'https://www.climaterealityproject.org/volunteer',
		description: 'Time: 2-4 hrs/week · Duration: Ongoing · Cert: Climate Reality volunteer recognition · Present climate education to communities, participate in online training, and support local climate action campaigns globally.',
		location: 'Online (Global)',
		region: 'global',
		deadline: null,
	},
	{
		title: 'Open Source for Nonprofits',
		org: 'Code for Good (J.P. Morgan) / Code for India',
		url: 'https://careers.jpmorgan.com/global/en/students/programs/code-for-good',
		description: 'Time: Weekend hackathon (24-48 hrs) · Duration: 1-2 days per event · Cert: Participation certificate · Build software solutions for NGOs at hackathon events. Judges award winning teams; excellent portfolio project for CS students.',
		location: 'Online / Pan-India',
		region: 'india',
		deadline: null,
	},
	{
		title: 'UNICEF India Youth Volunteer',
		org: 'UNICEF India',
		url: 'https://www.unicef.org/india/get-involved',
		description: 'Time: 2-4 hrs/week · Duration: 3-6 months · Cert: UNICEF volunteer certificate · Advocate for children\'s rights, run community campaigns, and support UNICEF India programs in education, health, and nutrition.',
		location: 'Online / Pan-India',
		region: 'india',
		deadline: null,
	},
	{
		title: 'Open Data Contributor',
		org: 'Open Knowledge Foundation',
		url: 'https://okfn.org/en/get-involved/',
		description: 'Time: 2-5 hrs/week · Duration: Ongoing · Cert: Contributor recognition · Help build open datasets, publish civic data, and develop open-source tools that make public information freely accessible. Remote-first community.',
		location: 'Online (Global)',
		region: 'global',
		deadline: null,
	},
	{
		title: 'Kiva Lending Team Volunteer',
		org: 'Kiva',
		url: 'https://www.kiva.org/volunteer',
		description: 'Time: 2-4 hrs/week · Duration: Ongoing · Cert: No formal certificate · Support microfinance for entrepreneurs in developing countries — translate loan stories, review applications, or manage a student lending team. Online role.',
		location: 'Online (Global)',
		region: 'global',
		deadline: null,
	},
	{
		title: 'Vandrevala Foundation Helpline Volunteer',
		org: 'Vandrevala Foundation',
		url: 'https://www.vandrevalafoundation.com/free-counseling',
		description: 'Time: 4-6 hrs/week · Duration: 6 months+ · Cert: Certificate after training · Provide mental health support over phone/chat for people in crisis across India. Free training provided; open to psychology and social work students.',
		location: 'Online / Pan-India',
		region: 'india',
		deadline: null,
	},
	{
		title: 'iCall Peer Support Volunteer',
		org: 'iCall (TISS)',
		url: 'https://icallservices.in/volunteers.html',
		description: 'Time: 4-6 hrs/week · Duration: 6 months · Cert: TISS iCall volunteer certificate · Provide psychological first aid and peer counselling under supervision at Tata Institute of Social Sciences. Training in mental health provided.',
		location: 'Mumbai / Online, India',
		region: 'india',
		deadline: null,
	},
	{
		title: 'Save the Children India Volunteer',
		org: 'Save the Children India',
		url: 'https://www.savethechildren.in/get-involved/volunteer/',
		description: 'Time: 3-5 hrs/week · Duration: 3-6 months · Cert: Volunteer certificate · Support child protection, education, and disaster response programs. Communication, design, and tech skills especially welcome.',
		location: 'Pan-India',
		region: 'india',
		deadline: null,
	},
	{
		title: 'Agastya Science Volunteer',
		org: 'Agastya International Foundation',
		url: 'https://www.agastya.org/volunteer/',
		description: 'Time: 4-5 hrs/week · Duration: 3-6 months · Cert: Volunteer certificate · Inspire scientific curiosity in rural school children through hands-on experiment sessions and mobile science labs. Headquartered in Karnataka.',
		location: 'Karnataka / Pan-India',
		region: 'india',
		deadline: null,
	},
];

// ── Collector ─────────────────────────────────────────────────────────────────

export async function collectNgos(db: D1Database): Promise<CollectorResult> {
	let inserted = 0;
	const fetched = CATALOG.length;

	for (const ngo of CATALOG) {
		const dedup_hash = await computeHash(`ngo:${ngo.url}:${ngo.title}`);

		const result = await db
			.prepare(
				`INSERT OR IGNORE INTO opportunities
				 (type, title, organization, source, url, location, deadline, description, fit_score, status, dedup_hash, discovered_at, region)
				 VALUES ('ngo', ?, ?, 'curated', ?, ?, ?, ?, NULL, 'new', ?, ?, ?)`,
			)
			.bind(ngo.title, ngo.org, ngo.url, ngo.location, ngo.deadline, ngo.description, dedup_hash, now(), ngo.region)
			.run();

		if (result.meta.changes > 0) inserted++;
	}

	return { fetched, kept: fetched, inserted, skipped: fetched - inserted };
}
