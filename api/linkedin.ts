import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

interface LinkedInPost {
  id: number | string
  title: string
  summary: string
  date: string
  url: string
  type: 'post' | 'article' | 'certificate' | 'project'
  badge: string
  image: string
}

const FALLBACK_POSTS: LinkedInPost[] = [
  {
    "id": 1,
    "title": "Sarvesh Sivasankaran \u2014 Portfolio",
    "summary": "This Portfolio is based on Solo Levelling anime theme",
    "date": "2026-05-20",
    "url": "https://solo-p-leveller-portfolio.netlify.app",
    "type": "post",
    "badge": "SYSTEM LOG",
    "image": "https://media.licdn.com/dms/image/v2/D562DAQHor2RlfROF0w/profile-treasury-image-shrink_480_480/B56Z5bHSLbGoAU-/0/1779645096923?e=1780480800&v=beta&t=R2kMua_drYHqfMrTBo_o3U0xkCNZYF9HSTk97tEnHzk"
  },
  {
    "id": 2,
    "title": "\ud83d\ude80 CodeSapiens - the Student Community of Coders Summer Fest 2026 \u2014 Built by Passion, Teamwork & Community \ud83c\udf1f",
    "summary": "Proud to share one of the most memorable experiences from CodeSapiens - the Student Community of Coders Summer Fest 2026, organized by the CodeSapiens - the Student Community of Coders Core Team alongside incredible student communities and ambassadors.\n\nThe event was designed to create impact through Speaker Sessions \ud83c\udf99\ufe0f, Championships \ud83c\udfc6, and Workshops \u2699\ufe0f, creating a platform for students and community members to learn, connect, compete, and grow together.\n\nI had the opportunity to contribute as Event Speaker Manager.\n\nA special mention to the amazing speakers I personally brought on board:\n\n\u2728 Haritha Sivasankaran \u2013 Clean Code and Refactoring\n\n\u2728 Keerthanaa K \u2013 Data Structures Review\n\n\u2728 Subiksha Arul Nambi \u2013 OS and Networks\n\nThank you for your time, involvement, effort, and enthusiasm in making the event impactful.\n\nA huge appreciation to all the talented speakers, workshop leads, and contributors who invested their time and shared their knowledge:\n\n\ud83c\udf99\ufe0f Lochan Pokkali \u2013 DBMS Essentials\n\n\ud83c\udf99\ufe0f Subashini Mannuraj \u2013 Product Research and Development\n\n\ud83c\udf99\ufe0f Abinesh Magudeeswaran \u2013 Introduction to Machine Learning\n\n\ud83c\udf99\ufe0f Gurmannat Kaur \u2013 AI Trends\n\n\ud83c\udf99\ufe0f Akash D \u2013 Soft Skills\n\n\ud83c\udf99\ufe0f Keerthanaa K \u2013 Data Structures Review\n\n\ud83c\udf99\ufe0fSubiksha Arul Nambi \u2013 OS and Networks\n\n\u2699\ufe0f Velayudham T N \u2013 Resume Workshop\n\n\u2699\ufe0f KEVIN DS \u2013 UI/UX Designing\n\n\u2699\ufe0f Subi Keesh.   M \u2013 E-SIM Simulation Workshop\n\n\ud83c\udfc6 Bharanivelan J \u2013 Portfolio Building\n\n\ud83c\udfc6 Haritha Sivasankaran \u2013 Contest Segment\n\nYour involvement, dedication, and willingness to contribute made this event truly meaningful.\n\nHuge appreciation to my amazing team who worked tirelessly behind the scenes:\n\nMukeshwar Raudra, Tazim sheriff.R, Prince Kevin Karthik I, Jayasri S, Harsha Vardhini, Priyanga Radhakrishnan, Puli Phanindhra, Joyceson Danielraj J, Giriprasad Karthi\n\nTogether we transformed planning into execution and ideas into impact. Every discussion, every coordination call, every poster, and every last-minute effort contributed to making this event a success.\n\nA special thank you to our supporting communities, ambassadors, and collaborators:\n\n\ud83c\udf1f N e x o r a\n\n\ud83c\udf1f Microsoft Learn Student Ambassador\n\n\ud83c\udf1f Google Student Ambassadors (India)\n\nYour support and collaboration helped us build an ecosystem where learning and opportunities could reach more students.\n\nGrateful to be part of a community that believes in creating opportunities and empowering people through collaboration.\n\nLooking forward to building, learning, and creating even bigger experiences ahead \ud83d\ude80\n\n#Codesapiens #CodesapiensSummerFest #Leadership #CommunityBuilding #EventManagement #SpeakerManagement #StudentCommunity #TeamWork #Growth #Learning #Networking #BuildTheFutureTogether #REC #AI #UI #UX #DSA #DBMS",
    "date": "2026-05-10",
    "url": "https://www.linkedin.com/feed/update/urn:li:activity:7463785807435313153/",
    "type": "project",
    "badge": "TACTICAL WIN",
    "image": "https://media.licdn.com/dms/image/v2/D561FAQEpDqDkeYPFlg/feedshare-document-cover-images_480/B56Z5RL8d.IoBA-/0/1779478547406?e=1780480800&v=beta&t=UMMhyOqZKCiAN9My-q-Jgbh0-mahuubMhqi5iAiuTsM"
  },
  {
    "id": 3,
    "title": "\ud83d\ude80 Proud Moment!",
    "summary": "Excited to share that I\u2019ve been featured as a Student Coordinator on the official website of the International Conference on Computing for Sustainable Development 2026 (ICCSD 2026), scheduled to be conducted by Rajalakshmi Engineering College, Chennai from July 1\u20133, 2026.\n\nBeing part of this conference wasn\u2019t just a title\u2014it was real work. I contributed to the\u00a0website development and brochure creation, ensuring everything was structured, functional, and presentable at a professional level.\n\nAlongside me, my senior balaji c also played a key role in developing the website, making this a great collaborative effort.\n\nICCSD 2026\n\nWebsite Link: https://iccsd2026.in/\n\nA huge thanks to Respected AYYADURAI MARUTHU Sir, Anitha Mary M Ma\u2019am, and Karthik V Sir for trusting me with this responsibility and giving me the opportunity to contribute at this level. Special thanks to our CSE Department HOD, Respected Malathy EM Ma\u2019am, for her guidance and support.\n\nGrateful for the exposure and experience\u2014definitely looking forward to taking on bigger challenges and building more impactful work ahead.\n\nProud to be part of a conference supported by International Federation for Information Processing (IFIP), Springer, and media partner Sathiyam Media Vision-Sathiyam TV.\n\n#ICCSD2026 #IFIP #Springer #SathiyamTV #RajalakshmiEngineeringCollege #REC #RECChennai #Rajalakshmi #AI #ArtificialIntelligence #SustainableDevelopment #SDGs #TechForGood #Innovation #Research #AcademicConference #ComputerScience #CSE #StudentCoordinator #WebDevelopment #FrontendDevelopment #FullStackDevelopment #UIUX #EngineeringLife #LearningByDoing #CareerGrowth #TechCommunity #Opportunities #Collaboration #DigitalTransformation #FutureTech #Developers #StudentAchievements",
    "date": "2026-05-05",
    "url": "https://www.linkedin.com/feed/update/urn:li:activity:7445666423894601729/",
    "type": "project",
    "badge": "TACTICAL WIN",
    "image": "https://media.licdn.com/dms/image/v2/D5622AQGSjVLxunaLRg/feedshare-shrink_480/B56Z1PeCFeKsAo-/0/1775154766422?e=1781740800&v=beta&t=Z44z8R8DQ-tlj0a8Y9h__HhfBVlg2P03wQfqYdZ_cvE"
  },
  {
    "id": 4,
    "title": "\ud83d\ude80 Spoke at the Nexora Community on \u201cCreating Workflows with CrewAI\u201d as a Speaker",
    "summary": "Had the opportunity to join the Nexora community as a speaker and share insights on building AI-powered workflows using CrewAI.\n\nThe session focused on how developers can design multi-agent systems where specialized AI agents collaborate like a real team to solve complex tasks.\n\n\ud83d\udca1 Key topics covered during the session:\n\n\u2022 Understanding CrewAI fundamentals \u2013 Agents, Tasks, Tools, Crews, and Processes\n\n\u2022 Designing structured AI workflows using sequential, hierarchical, and parallel patterns\n\n\u2022 Building a CrewAI workflow from scratch with practical code walkthroughs\n\n\u2022 Running CrewAI locally (offline setups) as well as in cloud environments\n\n\u2022 Applying efficient prompting strategies for better agent reasoning and task execution\n\n\u2022 Exploring real-world use cases such as research automation, content pipelines, and development workflows\n\nOne of the biggest takeaways was how role-based AI agents with clear goals and tools can collaborate to automate complex workflows efficiently.\n\nIt was great interacting with such a curious and enthusiastic group of builders and discussing the future of AI agents and autonomous systems.\n\nThanks to the Nexora community and Mukeshwar Raudra for the opportunity! \ud83d\ude4c\n\nAlways excited to share knowledge and learn from the community.\n\n#CrewAI #AIAgents #MultiAgentSystems #GenerativeAI #AIWorkflows #DeveloperCommunity #Automation #AI\n\n#ArtificialIntelligence #MachineLearning #AIEngineering #AICommunity #TechCommunity #AIInnovation\n\n#Python #AIDevelopers #AIProjects #AgenticAI #LLMAgents #AIArchitecture #TechTalk #Speaker #REC",
    "date": "2026-03-05",
    "url": "https://www.linkedin.com/feed/update/urn:li:activity:7441672586247417856/",
    "type": "project",
    "badge": "AI WORKFLOW",
    "image": "https://media.licdn.com/dms/image/v2/D561FAQFh-1RlJ1uqZw/feedshare-document-cover-images_480/B56Z0WdkwRH0BA-/0/1774198346057?e=1780480800&v=beta&t=IM_731OnaUsmfbjnAsQt4BbaAmZt0dw4p0x6xJjMeVo"
  },
  {
    "id": 5,
    "title": "\ud83d\ude80 Open Source Isn\u2019t Optional Anymore. It\u2019s Foundational.",
    "summary": "Had the privilege of speaking at the CodeSapiens - the Student Community of Coders February Meetup 2K26 on \u201cIntroduction to Open Source Contribution & GitHub Usage.\u201d\ud83d\udcbb\u2728\n\nMost developers underestimate open source. They think it\u2019s optional. It\u2019s not.\n\nIt\u2019s where:\n\n\ud83d\udd39 Real collaboration happens\n\n\ud83d\udd39 Code meets community\n\n\ud83d\udd39 Reputation gets built\n\n\ud83d\udd39 Opportunities are created\n\nDuring the session, we didn\u2019t just talk theory \u2014 we went hands-on. \ud83d\udee0\ufe0f\n\nAs a maintainer of the open-source Intellexa REC Website repository, I opened it up for live contributions so participants could experience real PR reviews, issue tracking, and collaborative development. \ud83d\udd04\ud83d\udd25\n\nHuge respect to my fellow speakers:\n\n\u2022 Puli Phanindhra \ud83e\udd16 \u2014 for demonstrating how AI can accelerate open-source workflows.\n\n\u2022 Shane Cardoz \ud83c\udfaf \u2014 for decoding what actually makes a contribution truly valuable.\n\nA special thank you to Keerthana M G, Alfred Sam D, Mahaveer A, Vignesh R, and Thiyaga B Sir \ud83d\ude4c for trusting me with this opportunity and organizing such a high-impact event.\n\nGratitude to our venue sponsor YuniQ \ud83c\udfe2 and supporting sponsors DAKH EDU SOLUTIONS, navan.ai, and InterviewBuddy\u2122 \ud83e\udd1d for making the meetup possible.\n\nThe room was filled with curiosity, ambition, and builders ready to take action. \u26a1\n\nIf you\u2019re not contributing to open source yet, you\u2019re missing one of the fastest ways to grow as a developer.\n\nGrateful. Energized. Just getting started. \ud83d\udca1\ud83d\udd25\n\n#OpenSource #GitHub #TechLeadership #CommunityBuilding #Codesapiens\n\n#Developers #SoftwareEngineering #AI #ArtificialIntelligence #TechCommunity\n\n#BuildInPublic #Programming #StudentDevelopers #CareerGrowth #Innovation\n\n#ChennaiTech #IndiaTech #Networking #LearningInPublic #TechEvents\n\n#DeveloperJourney #FutureOfTech #Collaboration #StartupEcosystem",
    "date": "2026-02-20",
    "url": "https://www.linkedin.com/feed/update/urn:li:activity:7431704641278697472/",
    "type": "project",
    "badge": "TACTICAL WIN",
    "image": "https://media.licdn.com/dms/image/v2/D561FAQFa3lGVFiJuxw/feedshare-document-cover-images_480/B56ZyK31I3JUBA-/0/1771856421687?e=1780480800&v=beta&t=Uh0u3RMM7WYpY4YUkNRaNrkxOH3tpCh-sXelfIbnO0E"
  },
  {
    "id": 6,
    "title": "\u2726 TEXPLORE Magazine \u2726",
    "summary": "Displayed in Texplore Magazine 2k26 for CSE Department in Rajalakshmi Engineering College, As Speaker in Student Organisations chronicle",
    "date": "2026-02-15",
    "url": "https://Recmagazine.vercel.app",
    "type": "certificate",
    "badge": "KEYNOTE SPEAKER",
    "image": "https://media.licdn.com/dms/image/v2/D562DAQFw10yp8FLnZA/profile-treasury-image-shrink_800_800/B56Z5i.579IQAI-/0/1779777118480?e=1780480800&v=beta&t=fuDGs_vjVfHZs1ZcHGNBhpI4_TDVFGFvKsyKiPZi79k"
  },
  {
    "id": 7,
    "title": "\ud83d\ude80 Titanium 2K26 \u2013 An Unforgettable Milestone!",
    "summary": "From 12th\u201314th February, our college Rajalakshmi Engineering College hosted Titanium 2K26, and I had the incredible opportunity to organize events for the very first time in a national-level techfest.\n\nAs part of the Intellexa REC, under my role as SPOC, I organized two flagship events:\n\n\ud83d\udd39 IoT Olympics\n\n\ud83d\udd39 HackRush\n\nOne of the proudest moments for me was during HackRush \u2014 the three teams I mentored secured the entire podium \ud83c\udfc6\ud83c\udfc6\ud83c\udfc6. Watching them implement ideas, refine their solutions, and finally win was extremely rewarding. It truly reflected the power of guidance, teamwork, and consistent effort.\n\nAlongside these, Titanium 2K26 featured several exciting events like SharkTank, Netfix, and Code & Conquer, making the fest a grand success having other events around 75+.\n\nBeyond organizing, the fest was packed with unforgettable experiences \u2014 from the thrilling F1 simulations by Red Bull \ud83c\udfce\ufe0f to the intense Robo Wars that went on till late nights \ud83e\udd16. The energy across campus for those three days was simply unmatched.\n\nBeing my first time organizing events in a techfest, this journey taught me leadership, coordination, problem-solving under pressure, and the importance of teamwork.\n\nGrateful to all my club members, coordinators, participants, and everyone who made Titanium 2K26 a massive success.\n\nThis wasn\u2019t just an event \u2014 it was growth, learning, and memories for a lifetime. \u2728\n\n#Titanium2K26 #Techfest #RajalakshmiEngineeringCollege #IntellexaREC\n\n#StudentLeadership #CampusLeadership #Mentorship #HackathonLife\n\n#IoT #Innovation #EngineeringLife #Teamwork #FutureEngineers\n\n#F1 #RedBull #Notion #Actionpackd",
    "date": "2026-02-13",
    "url": "https://www.linkedin.com/feed/update/urn:li:activity:7428811907756859392/",
    "type": "project",
    "badge": "HACKATHON WINNER",
    "image": "https://media.licdn.com/dms/image/v2/D561FAQEVbPslWQhvjg/feedshare-document-cover-images_480/B56ZxhxAkGHoBE-/0/1771166767497?e=1780480800&v=beta&t=EPeJ4TYp7Qhm_Lmbidpl481oLfYJgQZE86bu_9mpyD4"
  },
  {
    "id": 8,
    "title": "\ud83d\ude80 Excited to announce two flagship events at TITANIUM 2026 \u2013 India\u2019s Largest Tech Fest!",
    "summary": "TITANIUM is a 3-day revolution \u2014 where innovation meets inspiration, and the brightest minds come together to shape the future of technology.\n\nProud to be one of the event leads for these upcoming technical challenges organized by Rajalakshmi Engineering College.\n\n\ud83d\udd39 HACKRUSH\n\nA 6-hour SDG-based problem statement hackathon where ideas collide and futures emerge.\n\nIf you\u2019re passionate about solving real-world problems using technology, this is your arena.\n\n\ud83d\udd17 Register here: https://lnkd.in/g_UXVURx\n\n\ud83d\udd39 IoT OLYMPICS\n\nA fun yet competitive hardware-focused event featuring IoT quizzes, circuit thinking, and hands-on project building.\n\nRace the clock. Rule the circuit.\n\n\ud83d\udd17 Register here: https://lnkd.in/g7vzXxPr\n\n\ud83d\udcc5 Dates: February 12, 13 & 14, 2026\n\n\ud83d\udcb0 Exciting cash prizes to be won\n\nWe invite students, innovators, and tech enthusiasts to participate, collaborate, and compete on a national platform.\n\nLooking forward to seeing creative minds turn ideas into impact! \ud83c\udf10\u26a1\n\n\ud83d\udd17 Registration details available in the poster\n\n#Titanium2026 #HackRush #IOTOlympics #Hackathon #IoT #SDG #TechFest #Innovation #FutureTech #StudentLeaders #TechCommunity #EngineeringLife #REC",
    "date": "2026-02-13",
    "url": "https://www.linkedin.com/feed/update/urn:li:activity:7418584520666402816/",
    "type": "project",
    "badge": "HACKATHON WINNER",
    "image": "https://media.licdn.com/dms/image/v2/D5622AQFUxLNvECDgmw/feedshare-shrink_480/B56ZvQbTooH4As-/0/1768728378436?e=1781740800&v=beta&t=_ZI5UeRgksJnU4LnOxj14jAt4IY6sTV7pyPLqUSCOKA"
  },
  {
    "id": 9,
    "title": "\u2728 Attended and volunteered at the CodeSapiens - the Student Community of Coders January 2K26 Meetup, and it turned out to be one of the most refreshing tech experiences I\u2019ve had in a while! \ud83d\ude80",
    "summary": "It was great seeing so many passionate people in one place, exchanging ideas and building real connections \ud83e\udd1d. I also got the chance to represent and market my college Rajalakshmi Engineering College National Level Techfest TITANIUM 2k26, which led to some really meaningful conversations.\n\nOne of the highlights for me was leading the closing debate session on:\n\n\ud83d\udcac \u201cIs LinkedIn really necessary in today\u2019s economy?\u201d\n\nThe discussion was interactive, opinionated, and surprisingly deep \u2014 exactly how a good meetup should end \ud83d\udd25\n\nWe also had two insightful guest sessions:\n\n\ud83c\udfa4 Nabiel M \u2014 on using AI to learn skills, build careers, and grow businesses\n\n\ud83c\udfa4 Prajein C K \u2014 on whether privacy issues are AI problems or system design problems\n\nThe Tech History Kahoot! quiz added a fun competitive touch \ud83e\udde0\u26a1, and I was happy to receive the CodeSapiens - the Student Community of Coders Keychain Award for Best Post (October 2K26 Meetup) \ud83c\udfc6\n\nI came along with my sister Haritha Sivasankaran to the event, who joined the Code on JVM Chennai meetup happened the same day, and yes \u2014 I also managed to grab my own set of Code on JVM Chennai goodies \ud83d\ude1c\ud83c\udf81\n\nSpecial mention to my friend Sejal Sai S for accompanying me and making the experience even better \ud83d\ude4c\n\nOverall, it was a genuinely fun, engaging, and refreshing day \u2014 one of those rare events that leaves you feeling energized and motivated \u2728\n\nLooking forward to more such sessions with the CodeSapiens - the Student Community of Coders community!\n\n#CodeSapiens #TechCommunity #TechMeetup #AI #ArtificialIntelligence #DeveloperCommunity #StudentDeveloper #CollegeTech #TechEvents #LearningByDoing #SkillBuilding #CareerGrowth #Networking #BuildInPublic #TechTalks #CodeJVM #Innovation #FutureOfTech #GrowthMindset #MeetupExperience",
    "date": "2026-02-13",
    "url": "https://www.linkedin.com/feed/update/urn:li:activity:7421155227074064384/",
    "type": "project",
    "badge": "TACTICAL WIN",
    "image": "https://media.licdn.com/dms/image/v2/D561FAQEZgBb-i1ONvA/feedshare-document-cover-images_480/B56Zv09SsXIYBA-/0/1769341272053?e=1780480800&v=beta&t=fkYPFZHowmThPsVM8QqhCM5YEDl7sxLO9FSd5KM3tH4"
  },
  {
    "id": 10,
    "title": "\ud83c\udfaf Grateful for an amazing 24 hours at 0xTi CTF!",
    "summary": "I had the opportunity to volunteer and organize in my first-ever CTF \u2014 0xTi CTF, hosted by our club Cyber Sentinels as a pre-event for Titanium National Level Techfest 2K26, Rajalakshmi Engineering College \ud83d\ude80\n\nBeing part of the 24-hour CTF was an intense but super rewarding experience. From coordinating with teams to supporting the overall event flow, it was amazing to see participants grind, learn, and compete throughout the event. All the effort behind the scenes truly paid off.\n\nHuge shoutout to my amazing teammates who put their heart and soul into making this event successful and memorable. It was truly great working alongside you all \ud83e\udd1d\n\nSpecial thanks to Yogeshwaran T, Nikitha A, Keerthanaa K, and Tharun H for the guidance and support. This CTF also helped me stay away from unnecessary distractions and focus on something I genuinely enjoy\u2014with a lot of fun along the way \ud83d\ude04\n\nLooking forward to learning and growing more in the cybersecurity domain! \ud83d\udd10\u2728\n\n#CTF #CyberSecurity #Cybersentinels #Titanium2K26 #TechFest #StudentCommunity #TeamWork #Volunteering #LearningByDoing #InfoSec #Grateful #0xTi #REC",
    "date": "2026-02-10",
    "url": "https://www.linkedin.com/feed/update/urn:li:activity:7424491685390270464/",
    "type": "certificate",
    "badge": "CTF CHALLENGER",
    "image": "https://media.licdn.com/dms/image/v2/D5622AQGxYpTCrmUGIA/feedshare-shrink_480/B56ZwkXxhwHQAs-/0/1770136738560?e=1781740800&v=beta&t=2ajFndxMu1Es2c1n2GcECj1aHD6RibBsEhV7fM9_wsE"
  },
  {
    "id": 11,
    "title": "\ud83d\ude80 Thrilled to share that our project \u201cNoteZilla\u201d was selected and showcased at the 4th Design Thinking & Innovation Project Expo at Rajalakshmi Engineering College!",
    "summary": "Working alongside my teammates LAKSHMIKANTHA REDDY  P and kamali jaisankar, this journey taught us a lot about innovation, communication, teamwork, and resilience.\n\nAlthough we couldn\u2019t move beyond Round 1 due to concerns around \u201cnovelty,\u201d the experience at the expo told us something completely different \u2014 the audience truly connected with NoteZilla and understood the real purpose behind what we built.\n\nOne of the best parts of the event was interacting with:\n\n\u2728 First-year students who were genuinely curious and excited\n\n\u2728 Visitors who took time to understand the concept deeply\n\n\u2728 Volunteers and spectators who appreciated the practical impact of our work\n\nThat response mattered more than the result itself.\n\nSometimes innovation is not about building something flashy. It\u2019s about solving a real problem in a meaningful way. The encouragement and positive feedback we received gave us confidence that we are moving in the right direction.\n\nThis is just the beginning for NoteZilla. We\u2019ll continue improving, refining, and building better. \ud83d\udca1\n\nA special thanks to our Design Thinking mentor Priya Jeyaprakash ma'am  and Hari Sainath Sir for guidance, encouragement, and continuous support throughout this journey.\n\nHuge thanks to everyone who visited our stall and supported us throughout the expo!\n\n#NoteZilla #DesignThinking #Innovation #ProjectExpo #EngineeringStudents #StudentInnovation #TechInnovation #Prototype #ProductThinking #ProblemSolving #EngineeringLife #CollegeProjects #BuildInPublic #FutureEngineers #TechForGood #CreativeThinking #InnovationCulture #REC #RajalakshmiEngineeringCollege #TeamWork #LearningJourney #YoungInnovators #ExpoExperience #ProjectShowcase #DesignInnovation #StudentDevelopers",
    "date": "2026-01-25",
    "url": "https://www.linkedin.com/feed/update/urn:li:activity:7459074758811467776/",
    "type": "project",
    "badge": "TACTICAL WIN",
    "image": "https://media.licdn.com/dms/image/v2/D5622AQFP7RPP3NzF3g/feedshare-shrink_480/B56Z4OBDjvKEAk-/0/1778351618604?e=1781740800&v=beta&t=enKCp-MfNU3hCzapbjo7ktyQiPPRShFcJLP7XMwh8N4"
  },
  {
    "id": 12,
    "title": "\ud83d\udc7e Investiture Ceremony \u2014 A Defining Chapter \ud83d\ude80",
    "summary": "Stepping into the role of Design Lead at the Cyber Sentinels Club of Rajalakshmi Engineering College marks one of the most defining milestones of my college journey \ud83c\udfaf.\n\nThis isn\u2019t just a title \u2014 it\u2019s a commitment to craft identity \ud83c\udfa8, build impact \u26a1, and elevate the way our community is perceived \ud83c\udf10.\n\nProud to take on this journey alongside an incredible team \u2014 Abenanthan P and Somila Srinivasan \ud83e\udd1d. Together, we aim to push creative boundaries \ud83d\udd25 and set a new standard for what we build and represent \ud83d\udca1.\n\nDeeply grateful to the some people who\u2019ve been part of this journey \u2014\n\nKeerthanaa K, Rahul Babu M. P. , Yogeshwaran T, Nikitha A, Sai Prapanch.H, Tharun H, Santhanalakshmi Babu, Sudhish Raghavendhar \ud83d\ude4c \u2014 your support, energy, and presence mean more than you know \ud83d\udc99.\n\nA sincere thank you to our mentors and coordinators \u2014\n\nBhuvaneswaran B, Dr. P Kumar, Benedict J.N. \ud83c\udf93 \u2014 for the trust, guidance, and constant push to do better \ud83d\udcc8.\n\nWe\u2019re not here to maintain standards \u2014 we\u2019re here to redefine them \u2694\ufe0f.\n\nThe journey has just begun \ud83c\udf1f.\n\n#CyberSentinels #InvestitureCeremony #DesignLeadership #REC #StudentLeadership #CreativeDirection #Growth #LeadershipJourney #CampusLife #CollegeClubs #DesignThinking #Innovation #Teamwork #CommunityBuilding #FutureLeaders #StudentSuccess #CreativeMindset #PersonalGrowth #TechCommunity #BuildInPublic",
    "date": "2026-01-10",
    "url": "https://www.linkedin.com/feed/update/urn:li:activity:7457987597756207106/",
    "type": "certificate",
    "badge": "CLUB DESIGN LEAD",
    "image": "https://media.licdn.com/dms/image/v2/D561FAQF7XT2SIiSDow/feedshare-document-cover-images_480/B56Z3kG90YKIBA-/0/1777648526899?e=1780480800&v=beta&t=IST0k23oaKn7lqGXHKeF2j4NL8H0VRy14A8yRCxXHY8"
  },
  {
    "id": 13,
    "title": "\ud83e\udde0 12 Hours of Pure Cyber Thrill \u2013 What's The Flag 2025 CTF \ud83d\udd75\ufe0f\u200d\u2642\ufe0f",
    "summary": "Had an amazing experience participating in \u201cWhat\u2019s The Flag 2025\u201d, a 12-hour Capture The Flag (CTF) competition organized by the Cyber Sentinels Club through Unstop, Rajalakshmi Engineering College.\n\nOur team F-Society \ud83d\udc7e \u2014 comprising me and Akash Vardhan V \u2014 finished in 21st place with 2210 points.\n\nEven though we didn\u2019t make it to the top 10, every challenge tested our problem-solving, logical reasoning, and Cybersecurity fundamentals to the core.\n\nInterestingly, when the Cyber Sentinels Club conducted the CTF last year named \"root@localhost\", it was my first-ever CTF experience participating Solo, and I secured 34th place back then.\n\nSeeing that improvement to 21st this year feels rewarding \u2014 proof that consistency and curiosity do pay off. \ud83d\ude80\n\n\ud83d\udca1 Key Takeaways:\n\nStrengthened my skills in Cryptography, web exploitation, and OSINT\n\nLearned the power of collaboration under pressure\n\nReinforced the mindset of continuous learning and resilience\n\nHuge thanks to the Cyber Sentinels Club for organizing such an engaging and intense event.\n\nA big shoutout and gratitude to Rajalakshmi Engineering College, Cyber Sentinels, Benedict J.N. , Bhuvaneswaran B, and the amazing collaborators from Altered Security, WYNTRIX, Altruisty, and freshbooks\u2122 for making this event such a thrilling and educational experience. \ud83d\ude4c\n\nEvery flag was a new puzzle and every loss, a lesson. \ud83d\udd10\n\nOn to more CTFs, more flags, and more learning ahead! \ud83d\udcaa\n\n#CyberSecurity #CTF #EthicalHacking #CaptureTheFlag #InfoSec #OSINT #Cryptography #CyberSentinels #RajalakshmiEngineeringCollege #FSociety #Teamwork #ContinuousLearning #GrowthMindset #LearningByDoing",
    "date": "2026-01-10",
    "url": "https://www.linkedin.com/feed/update/urn:li:activity:7387764201735405568/",
    "type": "certificate",
    "badge": "CTF CHALLENGER",
    "image": "https://media.licdn.com/dms/image/v2/D5622AQGcqV8DpTCMXA/feedshare-shrink_480/B56ZoacYiFIYAY-/0/1761380242401?e=1781740800&v=beta&t=liizTOTLfip5m_rJxP1t4qI9jB1ss6t6RMhyAf1v7hw"
  },
  {
    "id": 14,
    "title": "\u2728 Digital Dreamers Den (D3) Community Meetup #5 \u2014 This Weekend Was Absolutely Electric",
    "summary": "This weekend was packed with learning, energy, and genuine community spirit. Me and my friend Sejal Sai S also had the chance to present our CodeSapiens - the Student Community of Coders Mentorship Full-Stack Development Project- Webcrawler, which was even streamed live on YouTube.\n\n\ud83d\udd17 Stream link: https://lnkd.in/gaawdthJ\n\nHuge thanks to CodeSapiens - the Student Community of Coders, Keerthana M G akka, Alfred Sam D, Thiyaga B sir, and our mentor Indhu Prakash K V for constantly pushing us and guiding us.\n\nAlso, a heartfelt appreciation to ARAVIND KUMAR J, founder of Digital Dreamers Den (D3), and the entire Digital Dreamers Den (D3) community for building such a strong and empowering ecosystem.\n\nAnd a big shout-out to Sahithya B A, who hosted the entire meetup flawlessly \u2014 keeping the energy high, engaging the audience, and making the whole experience smooth and lively.\n\n\ud83d\udd39 Topic 1: AI integration with Docker, Inc\n\nSpeaker: Aakash Dhakshnamoorthy\n\nAI Roadmap:\n\nPython (NumPy, Pandas, Visualisation tools)\n\nSupervised & Unsupervised Learning\n\nML & Deep Learning\n\nTensorFlow\n\nNLP\n\nGenAI\n\nA clean and practical breakdown for anyone stepping into AI.\n\n\ud83d\udd39 Topic 2: Design Superpowers for Developers\n\nSpeaker: Yuvaraj Muthu (Yuvi)\n\nVisionary Founder: Payan Design Studio\n\nHow developers can build better UI with AI\n\nAvoiding common UI pitfalls\n\n5 biggest developer UI mistakes:\n\nSpacing & alignment chaos\n\nOverusing colours\n\nTypography inconsistency\n\nLack of consistency\n\nWeak visual hierarchy\n\nA brutally honest session every developer needed.\n\n\ud83d\udd39 Topic 3: From Frontend to Frontier \u2014 Evolving for the AI-Driven Web\n\nSpeaker: Tapas Adhikary\n\nCovered:\n\nReal AI-powered project demos\n\nAPI calls with minimal UI\n\nReact powering the frontend\n\nHow devs must evolve for an AI-first web\n\nSimple, practical, and layered with clarity.\n\n\ud83d\udd39 Special Mentions\n\n\u2728 Hareesh Rajendran\n\nJoined as a guest and threw in sharp, insightful questions that sparked deeper discussions and added a ton of value.\n\n\ud83c\udfae Connextion Game\n\nA fun mid-event break, adding a refreshing dose of excitement to the technical flow.\n\nWe also met like-minded developers, connected with new people, bumped into our college seniors G.Savita Shri,RAGUL M and Anish D exchanged ideas, and walked away with a lot of inspiration.\n\nA weekend full of learning and connections \u2014 and definitely one to remember. \ud83d\ude80\n\n#DigitalDreamersDen #D3Meetup #CommunityMeetup #TechCommunity #DeveloperCommunity #StudentCommunity #CodeSapiens #LearningTogether #WeekendVibes",
    "date": "2026-01-05",
    "url": "https://www.linkedin.com/feed/update/urn:li:activity:7398262361897246720/",
    "type": "project",
    "badge": "TACTICAL WIN",
    "image": "https://media.licdn.com/dms/image/v2/D5622AQFX83tGdClMvQ/feedshare-shrink_480/B56ZqvoWM9HAAc-/0/1763883182286?e=1781740800&v=beta&t=DvuZnJYJ7u5r4lQfyrijl9lkh0Z6gSmy8a5Rj8meVhc"
  },
  {
    "id": 15,
    "title": "\ud83c\udf89 Grateful & Proud Moment!",
    "summary": "I\u2019m happy to share that I\u2019ve received the Certificate of Appreciation for successfully completing the one-month CodeSapiens - the Student Community of Coders - Mentorship Program, under the guidance of Indhu Prakash K V, mentor from the Digital Dreamers Den (D3) Community.\n\nThis certificate (pictured below) represents weeks of learning, building, experimenting, and improving \u2014 both technically and personally.\n\nCodeSapiens - the Student Community of Coders - mentorship program \u2026\n\nOver the past month, I had the opportunity to:\n\n\ud83d\udd39 Work in a collaborative team environment\n\n\ud83d\udd39 Build a full-stack AI-powered project from the ground up\n\n\ud83d\udd39 Improve my skills in Flask, API design, Supabase integration & authentication\n\n\ud83d\udd39 Explore AI-driven web crawling, summarization, and automation\n\n\ud83d\udd39 Present our work at the Digital Dreamers Den (D3) Community Meetup\n\nI\u2019m sincerely thankful to:\n\n\u2728 Thiyaga B , Founder of CodeSapiens - the Student Community of Coders\n\n\u2728ARAVIND KUMAR J \u2013 Founder of the Digital Dreamers Den (D3)\n\n\u2728 Indhu Prakash K V , my mentor\n\n\u2728 Keerthana M G\n\n\u2728 Alfred Sam D\n\n\u2728 The entire Digital Dreamers Den (D3) Community and CodeSapiens - the Student Community of Coders Community,\n\nYour guidance and support made this journey meaningful and motivating.\n\nExcited to carry these learnings forward and continue building impactful projects! \ud83d\ude80\n\n#Codesapiens #D3Community #Certificate #Achievement #Mentorship #LearningJourney #WebDevelopment #AIProjects #PythonDeveloper #TeamLevellers #CareerGrowth #TechLearning #SkillBuilding #DeveloperJourney #ProudMoment #Motivation #EngineeringCommunity #FutureEngineer",
    "date": "2026-01-05",
    "url": "https://www.linkedin.com/feed/update/urn:li:activity:7401095198577102848/",
    "type": "project",
    "badge": "TACTICAL WIN",
    "image": "https://media.licdn.com/dms/image/v2/D561FAQH-i2KlVfXONA/feedshare-document-cover-images_480/B56ZrT7UryI8BM-/0/1764492141841?e=1780480800&v=beta&t=obq97_uH0RMH55WDG-rOIaHA84ssYjB2UJ4YBiHgyBI"
  },
  {
    "id": 16,
    "title": "\ud83c\udfaf A Day Full of Learning, Fun, and Wins! \ud83c\udfaf",
    "summary": "Our team had an amazing experience at the National Level Technical Symposium \u2013 Technovanza 2025\u201326, hosted by Jerusalem College of Engineering - India!\n\nIt was a day filled with learning, excitement, and fun \u2014 we participated in multiple events and bagged several prizes \ud83c\udfc6\ud83d\udc7e.\n\nMy teammate Aniketh J and I secured 3rd place in TriSpark, a Logical Thinking, Decoding, and Coding event! \ud83d\udcbb\u2728\n\nHad a great time the entire day with my wonderful teammates \u2014 Sajiv Jess, SHRI DHARSHINI M, swarna lakshmi B, Dejaswini B G, and Akash Vardhan V,Aniketh J \u2014 brainstorming, competing, and making memories that will last! \ud83d\udcab\n\nAlthough I missed the chance to attend Round 2 of Escape Room 2.0 (CTF), which I was really looking forward to, the overall experience was incredibly fun, enriching, and memorable. \ud83d\udcaa\n\nA huge thanks to the organizers and coordinators for hosting such a vibrant and inspiring symposium! \ud83d\ude4c\n\n#Technovanza2025 #JerusalemCollegeOfEngineering #NationalLevelSymposium #TriSpark #Innovation #EngineeringJourney #TeamWork #LogicalThinking #Decoding #CodingChallenge #LearningExperience #CTF #EscapeRoom #ProblemSolving #HackathonVibes #CollegeLife #RajalakshmiEngineeringCollege #REC #Achievement #FunAndLearning #TeamSpirit #StudentLife #EngineeringWithPurpose #MemorableMoments",
    "date": "2025-12-10",
    "url": "https://www.linkedin.com/feed/update/urn:li:activity:7382988389702254592/",
    "type": "project",
    "badge": "HACKATHON WINNER",
    "image": "https://media.licdn.com/dms/image/v2/D5622AQEySlVK9_uQrQ/feedshare-shrink_160/B56ZnPZwEqJYAc-/0/1760121265441?e=1781740800&v=beta&t=hyZOVY9HOMKDIStNTJU6CDsgAC_d9jnRQd31V0KrgTY"
  },
  {
    "id": 17,
    "title": "I\u2019m excited to share that my teammate Sherin Katherina Daniel and I secured 3rd place \ud83e\udd49 in the Fix & Flex (UI/UX Design Challenge) at CRYPTRIX '25, the annual technical symposium of the CSE Department, St. Joseph's College Of Engineering! \ud83d\ude80\ud83d\udc7e",
    "summary": "The competition was an intense frontend design showdown with:\n\n\ud83c\udfa8 UI replication & creative redesigns\n\n\u26a1 Chaos cards and curveball challenges\n\n\ud83e\udde9 Frontend quizzes testing logic and design thinking\n\nThe event was very well-organized, and the people there were truly humble and kind, which made the whole experience even more memorable. \ud83d\udcaf\n\nOn a personal note, achieving this win at St. Joseph's College Of Engineering felt extra special \u2014 a small but significant milestone in my journey, and a moment of personal satisfaction that I\u2019ll always cherish. \u2728\n\nThis challenge pushed us to think fast, stay creative, and adapt under pressure, and we\u2019re proud to have earned a podium finish with a cash prize \ud83d\udcb0.\n\nA big thanks to the organizers of CRYPTRIX '25 for hosting such a dynamic event and to everyone who made the day special. \ud83d\ude4c\n\nLooking forward to more opportunities to learn, grow, and design! \ud83c\udf1f\n\n#UIUXDesign #FrontendDevelopment #Cryptrix25 #TechSymposium #DesignChallenge #Teamwork #CreativityInTech #StJosephsCollegeOfEngineering",
    "date": "2025-10-15",
    "url": "https://www.linkedin.com/feed/update/urn:li:activity:7367542441740009474/",
    "type": "certificate",
    "badge": "CREDENTIAL",
    "image": "https://media.licdn.com/dms/image/v2/D5622AQHDo97IV-Rq4A/feedshare-shrink_480/B56Zj7EyCWHcAY-/0/1756558995900?e=1781740800&v=beta&t=TUoxDESGg7dnWPZBhCJEobTnLoh_jPdqImOEfw619ko"
  },
  {
    "id": 18,
    "title": "\ud83c\udf1f What a Journey \u2013 SIH Internal Hackathon 2025 (Software Edition)! \ud83c\udf1f",
    "summary": "I\u2019m thrilled to share that our team Code-O-Philes made it to the Top 50 among 160+ teams in the SIH Internal Hackathon 2025 (Software Edition) conducted at Rajalakshmi Engineering College! \ud83d\ude80\n\nThis was my first-ever major hackathon experience, and the past month has been nothing short of transformative \u2014 countless brainstorming sessions, continuous iterations, and late-night discussions all shaped our solution. It was a true test of creativity, focus, and persistence.\n\nDuring the 30-hour hackathon, I faced unexpected issues with our hardware sensors on Day 1 night. I worked through the night, barely managing an hour of inconsistent sleep, until I was able to solve the problem and get everything back on track. This experience pushed me to stay calm under pressure, troubleshoot effectively, and find solutions despite fatigue and constraints.\n\nA special mention to:\n\n\ud83d\udc68\u200d\ud83c\udfeb Dr.K.Vijay Sir \u2013 for his constant mentorship and guidance throughout this journey.\n\n\ud83e\udd1d Sajiv Jess, swarna lakshmi B, Dejaswini B G, Akash Vardhan V, and Aniketh J \u2013 my amazing teammates whose dedication and collaboration made this achievement possible.\n\n\ud83d\ude4c Abuthahir A Sir\u2013 one of our jury, for his valuable insights and encouragement.\n\nParticipating in this hackathon gave me an incredible opportunity to strengthen my technical skills, improve my problem-solving approach, and experience the excitement of building something meaningful under time pressure. It was a month-long journey of growth, collaboration, and learning that I will always remember. \ud83d\udc99\ud83d\udc7e\n\n#Hackathon #SIH2025 #SoftwareEdition #Innovation #ProblemSolving #CriticalThinking #EngineeringJourney #CodeOPhiles #RajalakshmiEngineeringCollege #Teamwork #LearningJourney\n\n#TechForGood #BuildInPublic #HackathonLife #EngineeringStudents #StudentInnovators #STEM #FutureEngineers #TechCommunity #TechInnovation #Collaboration #LearningByDoing #HardwareAndSoftware #CodingJourney #EngineeringLife #Creativity #Resilience #Persistence #GrowthMindset #DesignThinking #StudentHackathon",
    "date": "2025-09-15",
    "url": "https://www.linkedin.com/feed/update/urn:li:activity:7375878224737677312/",
    "type": "project",
    "badge": "HACKATHON WINNER",
    "image": "https://media.licdn.com/dms/image/v2/D5622AQHhIWTAJy5n4w/feedshare-shrink_480/B56ZlxiFP2HQAY-/0/1758546396705?e=1781740800&v=beta&t=VOcsGTeSNtpHemiSypNEFnwj2uGgd7L3b3Yl79ZRvKo"
  },
  {
    "id": 19,
    "title": "\ud83c\udf1f Internship Milestone Achieved! \ud83c\udf1f",
    "summary": "I am excited to share that I have successfully completed my 1-month internship in Cybersecurity at SkillCraft Technology (15th July 2025 \u2013 14th August 2025) \ud83c\udfaf\n\nThis experience has been an incredible journey where I gained valuable insights into real-world Cybersecurity challenges and honed my technical, analytical, and problem-solving skills. I\u2019m grateful for this opportunity and proud to have earned both a Certificate of Completion and a Letter of Recommendation acknowledging my performance during the internship.\n\nThis is just the beginning \u2014 I look forward to further exploring and contributing to the Cybersecurity domain in the coming years.\n\n#CyberSecurity #Internship #SkillCraftTechnology #EthicalHacking #InformationSecurity #CyberDefense #CyberAwareness #TechJourney #CareerGrowth #LearningExperience #DigitalSecurity #CyberSecurityInternship #CyberProtection #TechSkills #FutureReady",
    "date": "2025-08-15",
    "url": "https://www.linkedin.com/feed/update/urn:li:activity:7361979964872642560/",
    "type": "certificate",
    "badge": "SECURE INTERN",
    "image": "https://media.licdn.com/dms/image/v2/D5622AQGqvkSAZiJfgw/feedshare-shrink_480/B56ZisBwYgG0AY-/0/1755232800218?e=1781740800&v=beta&t=ki2uomSW-C8OZBa0iTtpGtmMS4T78c6hYPgbpdWx0Cc"
  },
  {
    "id": 20,
    "title": "\u2728 Exciting News! \u2728",
    "summary": "I\u2019m thrilled to share that I\u2019ve been offered the Cyber Security Intern position at SkillCraft Technology! \ud83d\ude80\ud83d\udd10\n\nThis one-month educational internship, starting from July 15, 2025, is a great opportunity for me to gain hands-on experience in the dynamic field of cybersecurity. I'm eager to learn, grow, and contribute meaningfully during this journey.\n\nA big thank you to SkillCraft Technology for this opportunity and to everyone who has supported me along the way. \ud83d\ude4c\n\n#CyberSecurity #InternshipOpportunity #SkillCraftTechnology #Grateful #LearningInProgress\n\n#CyberSecIntern #TechGrowth #InformationSecurity #CareerDevelopment #CyberAwareness\n\n#FutureInTech #StudentInternship #TechInternship #Infosec #CyberIntern #CyberJourney\n\n#SkillBuilding #DigitalSecurity #EthicalHacking\n\n#LearningByDoing #ITInternship #InternshipExperience",
    "date": "2025-08-15",
    "url": "https://www.linkedin.com/feed/update/urn:li:activity:7348950342023204864/",
    "type": "certificate",
    "badge": "SECURE INTERN",
    "image": "https://media.licdn.com/dms/image/v2/D561FAQHHu83XC9RUxw/feedshare-document-cover-images_480/B56Zfy3TX.HoBM-/0/1752126274735?e=1780480800&v=beta&t=DREJVDFBEQYFQUnIV1F_85B671C_tD1tSK8nKmmw_eI"
  },
  {
    "id": 21,
    "title": "\ud83c\udf0d\u2728 Thrilled to Announce! \u2728\ud83c\udf0d",
    "summary": "I\u2019m incredibly excited to share that I\u2019ve joined the Intellexa REC Club at Rajalakshmi Engineering College as an IoT Team Member! \ud83e\udd16\ud83d\ude80\n\nJoining Intellexa REC marks a significant step in my journey toward exploring cutting-edge technology, innovation, and impactful collaboration. I\u2019m honored to be part of a dynamic team where creativity meets real-world solutions! \ud83d\udca1\ud83c\udf10\n\nA heartfelt thank you to my IoT team lead, AHAMED FAISAL, for your mentorship and belief in my potential \ud83d\ude4c \u2014 and to SivaRamaKrishnan R. the President of Intellexa REC Club, for trusting me with this opportunity and welcoming me into such a visionary space. \ud83d\ude4f\ud83d\udc68\u200d\ud83d\udcbc\n\nI\u2019m looking forward to working alongside brilliant minds, building projects that matter, and growing both technically and personally. Let\u2019s innovate, inspire, and make a difference \u2014 together! \ud83d\udcab\ud83d\udcaa\n\n#Intellexa #IoT #TechInnovation #RajalakshmiEngineeringCollege #GlobalTech #StudentInnovation #EngineeringExcellence #FutureReady #TechLeaders #SmartSolutions #REC #TeamIntellexa #DigitalTransformation #STEM #EmergingTech #Leadership #Gratitude #MakingImpact #IoTRevolution #VisionToReality #NextGenTech",
    "date": "2025-07-20",
    "url": "https://www.linkedin.com/feed/update/urn:li:activity:7359433185811681281/",
    "type": "project",
    "badge": "TACTICAL WIN",
    "image": "https://media.licdn.com/dms/image/v2/D5622AQG-EHIN7d6HuA/feedshare-shrink_480/B56ZiHZvFOHcAY-/0/1754618328211?e=1781740800&v=beta&t=N_Lzk6LgKRv-xu8D4O8V_AVc_VGaQcdOHGj_wrC31wE"
  },
  {
    "id": 22,
    "title": "\ud83e\ude78 Giving the Gift of Life Through Blood Donation \ud83e\ude78",
    "summary": "I recently had the opportunity to donate 350ml of blood at Rajalakshmi Engineering College, where Christian Medical College hosted a blood donation camp in collaboration with the Uthiram Club and Rotary Club or Rotaract. It was an incredibly fulfilling experience, knowing that a simple act like this can help save lives. \u2764\ufe0f\n\nThe entire process was well-organized, and the medical team ensured a smooth and comfortable donation. As a token of appreciation, donors received a care pack \ud83c\udf81 with refreshments \ud83e\udd64\ud83c\udf6a and badges \ud83c\udf96\ufe0f\u2014a thoughtful gesture that made the experience even more memorable.\n\n\ud83d\udca1 Donating blood for the first time has been an eye-opening experience, and I encourage everyone who can to consider doing the same. A few minutes of our time can make a world of difference for someone in need! \ud83d\udcaa\ud83c\udffc\n\n#FirstBloodDonation \ud83e\ude78 #DonateBloodSaveLives \u2764\ufe0f #GivingBack \ud83e\udd1d #Healthcare \ud83c\udfe5 #CommunityImpact \ud83c\udf0d\n\n#BloodDonor \ud83d\udc89 #VolunteerWork \ud83d\ude4c #LifeSaver \ud83d\udc93 #StudentLife \ud83c\udf93 #MedicalAwareness \ud83e\udde0\n\n#YouthForChange \ud83c\udf31 #BloodDonationCamp \ud83c\udfeb #REC #CMC #RotaractClub #UthiramClub\n\n#BeTheChange #ServeSociety #KindnessMatters #HumanityFirst #SocialResponsibility",
    "date": "2025-04-10",
    "url": "https://www.linkedin.com/feed/update/urn:li:activity:7313942722250252288/",
    "type": "certificate",
    "badge": "CREDENTIAL",
    "image": "https://media.licdn.com/dms/image/v2/D5622AQESJJhxHBoOMQ/feedshare-shrink_160/B56ZYBYI8LGoAc-/0/1743779828057?e=1781740800&v=beta&t=8EwmVIegipLakUH-KWd-WzvqXuqY_hSucGu5FTCtkt0"
  },
  {
    "id": 23,
    "title": "\ud83c\udf1f Mission Accomplished! \ud83c\udf1f",
    "summary": "I\u2019m excited to share that I have successfully secured a spot in the root@localhost Capture The Flag (CTF) contest! \ud83c\udfc6\ud83d\udcbb\n\nThis wasn\u2019t just a competition\u2014it was an electrifying journey through the fascinating world of Cybersecurity. Each challenge tested my analytical skills, determination, and problem-solving abilities, making it a truly unforgettable experience.\n\n\ud83d\udca1 What Made This Experience Stand Out:\n\n\ud83d\udd10 Immersive Learning: Gained hands-on exposure to cutting-edge cybersecurity techniques.\n\n\ud83e\udd1d Collaborative Growth: Connected with and learned from an exceptional community of peers.\n\n\ud83d\ude80 Unparalleled Challenges: Pushed my boundaries to solve intricate problems with precision and creativity.\n\nReceiving this certificate of achievement \ud83c\udf93 is an incredible honor, and I owe my gratitude to the fantastic organizing team: CyberSentinels REC, Bhuvaneswaran B, Benedict J.N., Dr. P Kumar, Rajalakshmi Engineering College, Altered Security, XYZ. Your efforts made this journey truly remarkable. \ud83d\udc4f\ud83d\udc4f\n\nThis accomplishment is not just a milestone but a stepping stone. It fuels my passion to continue exploring, learning, and contributing to the cybersecurity landscape. Let\u2019s collaborate to build a safer and more resilient digital world! \ud83c\udf10\ud83d\udd10\n\nThank you to everyone RITHESH S, SHEMKUMAR P, SAMPATH KUMAR P, Jerin B S, HARISH D, Subhikshaa S, SIVASHANKAR S, @Suriya Sundaram K.S, Karan Balaji R S, Swathi S who made this event a success. Here\u2019s to new challenges, greater learning, and continued growth. \ud83d\ude80\n\n#rootatlocalhost #CyberSentinelsREC #CaptureTheFlag #CyberSecurity #CTFSuccess #Innovation #DigitalResilience #Hacking #CyberDefense #TechJourney #LearningNeverStops #ProblemSolving #CTFCommunity #RajalakshmiEngineeringCollege #CyberFuture #SecureTheFuture #EthicalHacking #InfoSec #BugBounty #DigitalTransformation #ThreatHunting #NetworkSecurity #PenTesting #CyberAwareness #TechInnovation #CloudSecurity #MalwareAnalysis #CyberForensics #DataPrivacy #DigitalSkills #TechSavvy #FutureOfTech #SkillDevelopment #ZeroTrust #HackThePlanet #ITSecurity #CyberTalent",
    "date": "2025-01-15",
    "url": "https://www.linkedin.com/feed/update/urn:li:activity:7285725312061976576/",
    "type": "certificate",
    "badge": "CTF CHALLENGER",
    "image": "https://media.licdn.com/dms/image/v2/D5622AQHqXbOjfYa4Lg/feedshare-shrink_480/B56ZRwYj2yHsAY-/0/1737052274980?e=1781740800&v=beta&t=yvuhi5GMoV_9nlaVJ0ThZwVpygA7Cnhp4NjtaQHNgIg"
  }
]

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.RAPIDAPI_LINKEDIN_KEY

  // Return static fallback if API key is missing
  if (!apiKey || apiKey.includes('your_') || apiKey === '') {
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600') // Cache fallback for 24h
    return res.status(200).json(FALLBACK_POSTS)
  }

  try {
    const response = await axios.get('https://linkedin-data-api.p.rapidapi.com/get-profile-featured', {
      params: { 
        username: 'sarvesh-sivasankaran'
      },
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'linkedin-data-api.p.rapidapi.com'
      }
    })

    const rawItems = response.data?.data || response.data || []
    
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      console.warn('[Secure API Proxy] Empty response from LinkedIn Featured API, returning fallbacks.')
      return res.status(200).json(FALLBACK_POSTS)
    }

    const mappedPosts: LinkedInPost[] = rawItems.slice(0, 10).map((item: any, idx: number) => {
      const text = item.text || item.commentary || item.description || item.title || ''
      const lines = text.split('\n').filter((l: string) => l.trim() !== '')
      
      const title = item.title || lines[0] || 'LinkedIn Featured'
      const summary = item.description || lines.slice(1).join('\n') || text || 'Read the full transmission on LinkedIn.'
      
      // Handle image extraction (thumbnails, attachments, custom headers)
      let image = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80' // default
      if (item.images && item.images.length > 0) {
        image = item.images[0]
      } else if (item.attachments && item.attachments[0]?.mediaUrl) {
        image = item.attachments[0].mediaUrl
      } else if (item.image) {
        image = item.image
      } else if (item.imageUrl) {
        image = item.imageUrl
      } else if (item.thumbnail) {
        image = item.thumbnail
      } else if (item.thumbnailUrl) {
        image = item.thumbnailUrl
      }

      // Handle variable date schemas
      let date = new Date().toISOString().split('T')[0]
      if (item.time) {
        date = new Date(item.time).toISOString().split('T')[0]
      } else if (item.postDate) {
        date = new Date(item.postDate).toISOString().split('T')[0]
      } else if (item.createdAt) {
        date = new Date(item.createdAt).toISOString().split('T')[0]
      }

      // Resolve URL link (handles postUrl, links, urns)
      let url = 'https://in.linkedin.com/in/sarvesh-sivasankaran'
      if (item.url) {
        url = item.url
      } else if (item.postUrl) {
        url = item.postUrl
      } else if (item.link) {
        url = item.link
      } else if (item.itemUrl) {
        url = item.itemUrl
      } else if (item.urn) {
        url = `https://www.linkedin.com/feed/update/${item.urn}`
      }

      // Keyword type classification for themed highlights
      let type: 'post' | 'article' | 'certificate' | 'project' = 'post'
      const lowerText = text.toLowerCase()
      if (lowerText.includes('hackathon') || lowerText.includes('project') || lowerText.includes('built')) {
        type = 'project'
      } else if (lowerText.includes('certificate') || lowerText.includes('certified') || lowerText.includes('award') || lowerText.includes('record')) {
        type = 'certificate'
      } else if (lowerText.includes('article') || lowerText.includes('blog') || lowerText.includes('writeup') || lowerText.includes('dev log')) {
        type = 'article'
      }

      // Choose a structured S-rank subtitle badge
      const badge = type === 'project' ? 'TACTICAL WIN' : type === 'certificate' ? 'CREDENTIAL' : 'SYSTEM LOG'

      return {
        id: item.id || item.urn || idx,
        title: title.length > 70 ? title.substring(0, 67) + '...' : title,
        summary: summary.length > 200 ? summary.substring(0, 197) + '...' : summary,
        date,
        url,
        type,
        badge,
        image
      }
    })

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600') // Cache serverless for 1 hour
    return res.status(200).json(mappedPosts)

  } catch (error: any) {
    console.error('[Secure API Proxy] LinkedIn Scraper Failed, returning fallback static wins:', error.message)
    res.setHeader('Cache-Control', 's-maxage=300') // Cache error for 5 mins
    return res.status(200).json(FALLBACK_POSTS)
  }
}
