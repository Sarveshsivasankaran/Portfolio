-- Optional: import existing LinkedIn activities ONCE before managing visibility.
-- Re-running after deleting imported rows would restore them.
-- TEXPLORE is an external magazine URL, so it remains only in the static fallback.
-- The CRYPTRIX title is shortened to fit the editor; its full story remains in the description.
begin;
insert into public.linkedin_posts (title, description, linkedin_url, images, category, published_at, sort_order) values ('🌟 What a Journey – SIH Internal Hackathon 2025 (Software Edition)! 🌟','I’m thrilled to share that our team Code-O-Philes made it to the Top 50 among 160+ teams in the SIH Internal Hackathon 2025 (Software Edition) conducted at Rajalakshmi Engineering College! 🚀

This was my first-ever major hackathon experience, and the past month has been nothing short of transformative — countless brainstorming sessions, continuous iterations, and late-night discussions all shaped our solution. It was a true test of creativity, focus, and persistence.

During the 30-hour hackathon, I faced unexpected issues with our hardware sensors on Day 1 night. I worked through the night, barely managing an hour of inconsistent sleep, until I was able to solve the problem and get everything back on track. This experience pushed me to stay calm under pressure, troubleshoot effectively, and find solutions despite fatigue and constraints.

A special mention to:

👨‍🏫 Dr.K.Vijay Sir – for his constant mentorship and guidance throughout this journey.

🤝 Sajiv Jess, swarna lakshmi B, Dejaswini B G, Akash Vardhan V, and Aniketh J – my amazing teammates whose dedication and collaboration made this achievement possible.

🙌 Abuthahir A Sir– one of our jury, for his valuable insights and encouragement.

Participating in this hackathon gave me an incredible opportunity to strengthen my technical skills, improve my problem-solving approach, and experience the excitement of building something meaningful under time pressure. It was a month-long journey of growth, collaboration, and learning that I will always remember. 💙👾

#Hackathon #SIH2025 #SoftwareEdition #Innovation #ProblemSolving #CriticalThinking #EngineeringJourney #CodeOPhiles #RajalakshmiEngineeringCollege #Teamwork #LearningJourney

#TechForGood #BuildInPublic #HackathonLife #EngineeringStudents #StudentInnovators #STEM #FutureEngineers #TechCommunity #TechInnovation #Collaboration #LearningByDoing #HardwareAndSoftware #CodingJourney #EngineeringLife #Creativity #Resilience #Persistence #GrowthMindset #DesignThinking #StudentHackathon','https://www.linkedin.com/feed/update/urn:li:activity:7375878224737677312/',array['https://media.licdn.com/dms/image/v2/D5622AQHhIWTAJy5n4w/feedshare-shrink_480/B56ZlxiFP2HQAY-/0/1758546396705?e=1781740800&v=beta&t=VOcsGTeSNtpHemiSypNEFnwj2uGgd7L3b3Yl79ZRvKo']::text[],'HACKATHON WINNER','2025-09-15T00:00:00Z',0) on conflict (linkedin_url) do nothing;
insert into public.linkedin_posts (title, description, linkedin_url, images, category, published_at, sort_order) values ('🚀 CodeSapiens - the Student Community of Coders Summer Fest 2026 — Built by Passion, Teamwork & Community 🌟','Proud to share one of the most memorable experiences from CodeSapiens - the Student Community of Coders Summer Fest 2026, organized by the CodeSapiens - the Student Community of Coders Core Team alongside incredible student communities and ambassadors.

The event was designed to create impact through Speaker Sessions 🎙️, Championships 🏆, and Workshops ⚙️, creating a platform for students and community members to learn, connect, compete, and grow together.

I had the opportunity to contribute as Event Speaker Manager.

A special mention to the amazing speakers I personally brought on board:

✨ Haritha Sivasankaran – Clean Code and Refactoring

✨ Keerthanaa K – Data Structures Review

✨ Subiksha Arul Nambi – OS and Networks

Thank you for your time, involvement, effort, and enthusiasm in making the event impactful.

A huge appreciation to all the talented speakers, workshop leads, and contributors who invested their time and shared their knowledge:

🎙️ Lochan Pokkali – DBMS Essentials

🎙️ Subashini Mannuraj – Product Research and Development

🎙️ Abinesh Magudeeswaran – Introduction to Machine Learning

🎙️ Gurmannat Kaur – AI Trends

🎙️ Akash D – Soft Skills

🎙️ Keerthanaa K – Data Structures Review

🎙️Subiksha Arul Nambi – OS and Networks

⚙️ Velayudham T N – Resume Workshop

⚙️ KEVIN DS – UI/UX Designing

⚙️ Subi Keesh.   M – E-SIM Simulation Workshop

🏆 Bharanivelan J – Portfolio Building

🏆 Haritha Sivasankaran – Contest Segment

Your involvement, dedication, and willingness to contribute made this event truly meaningful.

Huge appreciation to my amazing team who worked tirelessly behind the scenes:

Mukeshwar Raudra, Tazim sheriff.R, Prince Kevin Karthik I, Jayasri S, Harsha Vardhini, Priyanga Radhakrishnan, Puli Phanindhra, Joyceson Danielraj J, Giriprasad Karthi

Together we transformed planning into execution and ideas into impact. Every discussion, every coordination call, every poster, and every last-minute effort contributed to making this event a success.

A special thank you to our supporting communities, ambassadors, and collaborators:

🌟 N e x o r a

🌟 Microsoft Learn Student Ambassador

🌟 Google Student Ambassadors (India)

Your support and collaboration helped us build an ecosystem where learning and opportunities could reach more students.

Grateful to be part of a community that believes in creating opportunities and empowering people through collaboration.

Looking forward to building, learning, and creating even bigger experiences ahead 🚀

#Codesapiens #CodesapiensSummerFest #Leadership #CommunityBuilding #EventManagement #SpeakerManagement #StudentCommunity #TeamWork #Growth #Learning #Networking #BuildTheFutureTogether #REC #AI #UI #UX #DSA #DBMS','https://www.linkedin.com/feed/update/urn:li:activity:7463785807435313153/',array['https://media.licdn.com/dms/image/v2/D561FAQEpDqDkeYPFlg/feedshare-document-cover-images_480/B56Z5RL8d.IoBA-/0/1779478547406?e=1780484400&v=beta&t=xbpqYTU71skxHikTUKJJcY22N-NS5Ckf9l0giio158w']::text[],'TACTICAL WIN','2026-05-10T00:00:00Z',1) on conflict (linkedin_url) do nothing;
insert into public.linkedin_posts (title, description, linkedin_url, images, category, published_at, sort_order) values ('🚀 Proud Moment!','Excited to share that I’ve been featured as a Student Coordinator on the official website of the International Conference on Computing for Sustainable Development 2026 (ICCSD 2026), scheduled to be conducted by Rajalakshmi Engineering College, Chennai from July 1–3, 2026.

Being part of this conference wasn’t just a title—it was real work. I contributed to the website development and brochure creation, ensuring everything was structured, functional, and presentable at a professional level.

Alongside me, my senior balaji c also played a key role in developing the website, making this a great collaborative effort.

ICCSD 2026

Website Link: https://iccsd2026.in/

A huge thanks to Respected AYYADURAI MARUTHU Sir, Anitha Mary M Ma’am, and Karthik V Sir for trusting me with this responsibility and giving me the opportunity to contribute at this level. Special thanks to our CSE Department HOD, Respected Malathy EM Ma’am, for her guidance and support.

Grateful for the exposure and experience—definitely looking forward to taking on bigger challenges and building more impactful work ahead.

Proud to be part of a conference supported by International Federation for Information Processing (IFIP), Springer, and media partner Sathiyam Media Vision-Sathiyam TV.

#ICCSD2026 #IFIP #Springer #SathiyamTV #RajalakshmiEngineeringCollege #REC #RECChennai #Rajalakshmi #AI #ArtificialIntelligence #SustainableDevelopment #SDGs #TechForGood #Innovation #Research #AcademicConference #ComputerScience #CSE #StudentCoordinator #WebDevelopment #FrontendDevelopment #FullStackDevelopment #UIUX #EngineeringLife #LearningByDoing #CareerGrowth #TechCommunity #Opportunities #Collaboration #DigitalTransformation #FutureTech #Developers #StudentAchievements','https://www.linkedin.com/feed/update/urn:li:activity:7445666423894601729/',array['https://media.licdn.com/dms/image/v2/D5622AQGSjVLxunaLRg/feedshare-shrink_480/B56Z1PeCFeKsAo-/0/1775154766422?e=1781740800&v=beta&t=Z44z8R8DQ-tlj0a8Y9h__HhfBVlg2P03wQfqYdZ_cvE']::text[],'TACTICAL WIN','2026-05-05T00:00:00Z',2) on conflict (linkedin_url) do nothing;
insert into public.linkedin_posts (title, description, linkedin_url, images, category, published_at, sort_order) values ('🚀 Spoke at the Nexora Community on “Creating Workflows with CrewAI” as a Speaker','Had the opportunity to join the Nexora community as a speaker and share insights on building AI-powered workflows using CrewAI.

The session focused on how developers can design multi-agent systems where specialized AI agents collaborate like a real team to solve complex tasks.

💡 Key topics covered during the session:

• Understanding CrewAI fundamentals – Agents, Tasks, Tools, Crews, and Processes

• Designing structured AI workflows using sequential, hierarchical, and parallel patterns

• Building a CrewAI workflow from scratch with practical code walkthroughs

• Running CrewAI locally (offline setups) as well as in cloud environments

• Applying efficient prompting strategies for better agent reasoning and task execution

• Exploring real-world use cases such as research automation, content pipelines, and development workflows

One of the biggest takeaways was how role-based AI agents with clear goals and tools can collaborate to automate complex workflows efficiently.

It was great interacting with such a curious and enthusiastic group of builders and discussing the future of AI agents and autonomous systems.

Thanks to the Nexora community and Mukeshwar Raudra for the opportunity! 🙌

Always excited to share knowledge and learn from the community.

#CrewAI #AIAgents #MultiAgentSystems #GenerativeAI #AIWorkflows #DeveloperCommunity #Automation #AI

#ArtificialIntelligence #MachineLearning #AIEngineering #AICommunity #TechCommunity #AIInnovation

#Python #AIDevelopers #AIProjects #AgenticAI #LLMAgents #AIArchitecture #TechTalk #Speaker #REC','https://www.linkedin.com/feed/update/urn:li:activity:7441672586247417856/',array['https://media.licdn.com/dms/image/v2/D561FAQFh-1RlJ1uqZw/feedshare-document-cover-images_480/B56Z0WdkwRH0BA-/0/1774198346057?e=1780484400&v=beta&t=inUtMroRaSQOF9wY9y11Djj_W6YARhgKphlJmHFeB68']::text[],'AI WORKFLOW','2026-03-05T00:00:00Z',3) on conflict (linkedin_url) do nothing;
insert into public.linkedin_posts (title, description, linkedin_url, images, category, published_at, sort_order) values ('🚀 Open Source Isn’t Optional Anymore. It’s Foundational.','Had the privilege of speaking at the CodeSapiens - the Student Community of Coders February Meetup 2K26 on “Introduction to Open Source Contribution & GitHub Usage.”💻✨

Most developers underestimate open source. They think it’s optional. It’s not.

It’s where:

🔹 Real collaboration happens

🔹 Code meets community

🔹 Reputation gets built

🔹 Opportunities are created

During the session, we didn’t just talk theory — we went hands-on. 🛠️

As a maintainer of the open-source Intellexa REC Website repository, I opened it up for live contributions so participants could experience real PR reviews, issue tracking, and collaborative development. 🔄🔥

Huge respect to my fellow speakers:

• Puli Phanindhra 🤖 — for demonstrating how AI can accelerate open-source workflows.

• Shane Cardoz 🎯 — for decoding what actually makes a contribution truly valuable.

A special thank you to Keerthana M G, Alfred Sam D, Mahaveer A, Vignesh R, and Thiyaga B Sir 🙌 for trusting me with this opportunity and organizing such a high-impact event.

Gratitude to our venue sponsor YuniQ 🏢 and supporting sponsors DAKH EDU SOLUTIONS, navan.ai, and InterviewBuddy™ 🤝 for making the meetup possible.

The room was filled with curiosity, ambition, and builders ready to take action. ⚡

If you’re not contributing to open source yet, you’re missing one of the fastest ways to grow as a developer.

Grateful. Energized. Just getting started. 💡🔥

#OpenSource #GitHub #TechLeadership #CommunityBuilding #Codesapiens

#Developers #SoftwareEngineering #AI #ArtificialIntelligence #TechCommunity

#BuildInPublic #Programming #StudentDevelopers #CareerGrowth #Innovation

#ChennaiTech #IndiaTech #Networking #LearningInPublic #TechEvents

#DeveloperJourney #FutureOfTech #Collaboration #StartupEcosystem','https://www.linkedin.com/feed/update/urn:li:activity:7431704641278697472/',array['https://media.licdn.com/dms/image/v2/D561FAQFa3lGVFiJuxw/feedshare-document-cover-images_480/B56ZyK31I3JUBA-/0/1771856421687?e=1780484400&v=beta&t=_Q06kvWhfmvrnsyERTviT4Bjtl0sdRtzI_AJxx4Fias']::text[],'TACTICAL WIN','2026-02-20T00:00:00Z',4) on conflict (linkedin_url) do nothing;
insert into public.linkedin_posts (title, description, linkedin_url, images, category, published_at, sort_order) values ('🚀 Titanium 2K26 – An Unforgettable Milestone!','From 12th–14th February, our college Rajalakshmi Engineering College hosted Titanium 2K26, and I had the incredible opportunity to organize events for the very first time in a national-level techfest.

As part of the Intellexa REC, under my role as SPOC, I organized two flagship events:

🔹 IoT Olympics

🔹 HackRush

One of the proudest moments for me was during HackRush — the three teams I mentored secured the entire podium 🏆🏆🏆. Watching them implement ideas, refine their solutions, and finally win was extremely rewarding. It truly reflected the power of guidance, teamwork, and consistent effort.

Alongside these, Titanium 2K26 featured several exciting events like SharkTank, Netfix, and Code & Conquer, making the fest a grand success having other events around 75+.

Beyond organizing, the fest was packed with unforgettable experiences — from the thrilling F1 simulations by Red Bull 🏎️ to the intense Robo Wars that went on till late nights 🤖. The energy across campus for those three days was simply unmatched.

Being my first time organizing events in a techfest, this journey taught me leadership, coordination, problem-solving under pressure, and the importance of teamwork.

Grateful to all my club members, coordinators, participants, and everyone who made Titanium 2K26 a massive success.

This wasn’t just an event — it was growth, learning, and memories for a lifetime. ✨

#Titanium2K26 #Techfest #RajalakshmiEngineeringCollege #IntellexaREC

#StudentLeadership #CampusLeadership #Mentorship #HackathonLife

#IoT #Innovation #EngineeringLife #Teamwork #FutureEngineers

#F1 #RedBull #Notion #Actionpackd','https://www.linkedin.com/feed/update/urn:li:activity:7428811907756859392/',array['https://media.licdn.com/dms/image/v2/D561FAQEVbPslWQhvjg/feedshare-document-cover-images_480/B56ZxhxAkGHoBE-/0/1771166767497?e=1780484400&v=beta&t=shuwuz7jBij8wWeOdgG7ejimTmal1_h_P2qRAVXsJXA']::text[],'HACKATHON WINNER','2026-02-13T00:00:00Z',6) on conflict (linkedin_url) do nothing;
insert into public.linkedin_posts (title, description, linkedin_url, images, category, published_at, sort_order) values ('🚀 Excited to announce two flagship events at TITANIUM 2026 – India’s Largest Tech Fest!','TITANIUM is a 3-day revolution — where innovation meets inspiration, and the brightest minds come together to shape the future of technology.

Proud to be one of the event leads for these upcoming technical challenges organized by Rajalakshmi Engineering College.

🔹 HACKRUSH

A 6-hour SDG-based problem statement hackathon where ideas collide and futures emerge.

If you’re passionate about solving real-world problems using technology, this is your arena.

🔗 Register here: https://lnkd.in/g_UXVURx

🔹 IoT OLYMPICS

A fun yet competitive hardware-focused event featuring IoT quizzes, circuit thinking, and hands-on project building.

Race the clock. Rule the circuit.

🔗 Register here: https://lnkd.in/g7vzXxPr

📅 Dates: February 12, 13 & 14, 2026

💰 Exciting cash prizes to be won

We invite students, innovators, and tech enthusiasts to participate, collaborate, and compete on a national platform.

Looking forward to seeing creative minds turn ideas into impact! 🌐⚡

🔗 Registration details available in the poster

#Titanium2026 #HackRush #IOTOlympics #Hackathon #IoT #SDG #TechFest #Innovation #FutureTech #StudentLeaders #TechCommunity #EngineeringLife #REC','https://www.linkedin.com/feed/update/urn:li:activity:7418584520666402816/',array['https://media.licdn.com/dms/image/v2/D5622AQFUxLNvECDgmw/feedshare-shrink_480/B56ZvQbTooH4As-/0/1768728378436?e=1781740800&v=beta&t=_ZI5UeRgksJnU4LnOxj14jAt4IY6sTV7pyPLqUSCOKA']::text[],'HACKATHON WINNER','2026-02-13T00:00:00Z',7) on conflict (linkedin_url) do nothing;
insert into public.linkedin_posts (title, description, linkedin_url, images, category, published_at, sort_order) values ('✨ Attended and volunteered at the CodeSapiens - the Student Community of Coders January 2K26 Meetup, and it turned out to be one of the most refreshing tech experiences I’ve had in a while! 🚀','It was great seeing so many passionate people in one place, exchanging ideas and building real connections 🤝. I also got the chance to represent and market my college Rajalakshmi Engineering College National Level Techfest TITANIUM 2k26, which led to some really meaningful conversations.

One of the highlights for me was leading the closing debate session on:

💬 “Is LinkedIn really necessary in today’s economy?”

The discussion was interactive, opinionated, and surprisingly deep — exactly how a good meetup should end 🔥

We also had two insightful guest sessions:

🎤 Nabiel M — on using AI to learn skills, build careers, and grow businesses

🎤 Prajein C K — on whether privacy issues are AI problems or system design problems

The Tech History Kahoot! quiz added a fun competitive touch 🧠⚡, and I was happy to receive the CodeSapiens - the Student Community of Coders Keychain Award for Best Post (October 2K26 Meetup) 🏆

I came along with my sister Haritha Sivasankaran to the event, who joined the Code on JVM Chennai meetup happened the same day, and yes — I also managed to grab my own set of Code on JVM Chennai goodies 😜🎁

Special mention to my friend Sejal Sai S for accompanying me and making the experience even better 🙌

Overall, it was a genuinely fun, engaging, and refreshing day — one of those rare events that leaves you feeling energized and motivated ✨

Looking forward to more such sessions with the CodeSapiens - the Student Community of Coders community!

#CodeSapiens #TechCommunity #TechMeetup #AI #ArtificialIntelligence #DeveloperCommunity #StudentDeveloper #CollegeTech #TechEvents #LearningByDoing #SkillBuilding #CareerGrowth #Networking #BuildInPublic #TechTalks #CodeJVM #Innovation #FutureOfTech #GrowthMindset #MeetupExperience','https://www.linkedin.com/feed/update/urn:li:activity:7421155227074064384/',array['https://media.licdn.com/dms/image/v2/D561FAQEZgBb-i1ONvA/feedshare-document-cover-images_480/B56Zv09SsXIYBA-/0/1769341272053?e=1780484400&v=beta&t=mJy2HJbMmNuJq0FNI_MioUmMErAKymVBBwAhFj9nhOQ']::text[],'TACTICAL WIN','2026-02-13T00:00:00Z',8) on conflict (linkedin_url) do nothing;
insert into public.linkedin_posts (title, description, linkedin_url, images, category, published_at, sort_order) values ('🎯 Grateful for an amazing 24 hours at 0xTi CTF!','I had the opportunity to volunteer and organize in my first-ever CTF — 0xTi CTF, hosted by our club Cyber Sentinels as a pre-event for Titanium National Level Techfest 2K26, Rajalakshmi Engineering College 🚀

Being part of the 24-hour CTF was an intense but super rewarding experience. From coordinating with teams to supporting the overall event flow, it was amazing to see participants grind, learn, and compete throughout the event. All the effort behind the scenes truly paid off.

Huge shoutout to my amazing teammates who put their heart and soul into making this event successful and memorable. It was truly great working alongside you all 🤝

Special thanks to Yogeshwaran T, Nikitha A, Keerthanaa K, and Tharun H for the guidance and support. This CTF also helped me stay away from unnecessary distractions and focus on something I genuinely enjoy—with a lot of fun along the way 😄

Looking forward to learning and growing more in the cybersecurity domain! 🔐✨

#CTF #CyberSecurity #Cybersentinels #Titanium2K26 #TechFest #StudentCommunity #TeamWork #Volunteering #LearningByDoing #InfoSec #Grateful #0xTi #REC','https://www.linkedin.com/feed/update/urn:li:activity:7424491685390270464/',array['https://media.licdn.com/dms/image/v2/D5622AQGxYpTCrmUGIA/feedshare-shrink_480/B56ZwkXxhwHQAs-/0/1770136738560?e=1781740800&v=beta&t=2ajFndxMu1Es2c1n2GcECj1aHD6RibBsEhV7fM9_wsE']::text[],'CTF CHALLENGER','2026-02-10T00:00:00Z',9) on conflict (linkedin_url) do nothing;
insert into public.linkedin_posts (title, description, linkedin_url, images, category, published_at, sort_order) values ('🚀 Thrilled to share that our project “NoteZilla” was selected and showcased at the 4th Design Thinking & Innovation Project Expo at Rajalakshmi Engineering College!','Working alongside my teammates LAKSHMIKANTHA REDDY  P and kamali jaisankar, this journey taught us a lot about innovation, communication, teamwork, and resilience.

Although we couldn’t move beyond Round 1 due to concerns around “novelty,” the experience at the expo told us something completely different — the audience truly connected with NoteZilla and understood the real purpose behind what we built.

One of the best parts of the event was interacting with:

✨ First-year students who were genuinely curious and excited

✨ Visitors who took time to understand the concept deeply

✨ Volunteers and spectators who appreciated the practical impact of our work

That response mattered more than the result itself.

Sometimes innovation is not about building something flashy. It’s about solving a real problem in a meaningful way. The encouragement and positive feedback we received gave us confidence that we are moving in the right direction.

This is just the beginning for NoteZilla. We’ll continue improving, refining, and building better. 💡

A special thanks to our Design Thinking mentor Priya Jeyaprakash ma''am  and Hari Sainath Sir for guidance, encouragement, and continuous support throughout this journey.

Huge thanks to everyone who visited our stall and supported us throughout the expo!

#NoteZilla #DesignThinking #Innovation #ProjectExpo #EngineeringStudents #StudentInnovation #TechInnovation #Prototype #ProductThinking #ProblemSolving #EngineeringLife #CollegeProjects #BuildInPublic #FutureEngineers #TechForGood #CreativeThinking #InnovationCulture #REC #RajalakshmiEngineeringCollege #TeamWork #LearningJourney #YoungInnovators #ExpoExperience #ProjectShowcase #DesignInnovation #StudentDevelopers','https://www.linkedin.com/feed/update/urn:li:activity:7459074758811467776/',array['https://media.licdn.com/dms/image/v2/D5622AQFP7RPP3NzF3g/feedshare-shrink_480/B56Z4OBDjvKEAk-/0/1778351618604?e=1781740800&v=beta&t=enKCp-MfNU3hCzapbjo7ktyQiPPRShFcJLP7XMwh8N4']::text[],'TACTICAL WIN','2026-01-25T00:00:00Z',10) on conflict (linkedin_url) do nothing;
insert into public.linkedin_posts (title, description, linkedin_url, images, category, published_at, sort_order) values ('👾 Investiture Ceremony — A Defining Chapter 🚀','Stepping into the role of Design Lead at the Cyber Sentinels Club of Rajalakshmi Engineering College marks one of the most defining milestones of my college journey 🎯.

This isn’t just a title — it’s a commitment to craft identity 🎨, build impact ⚡, and elevate the way our community is perceived 🌐.

Proud to take on this journey alongside an incredible team — Abenanthan P and Somila Srinivasan 🤝. Together, we aim to push creative boundaries 🔥 and set a new standard for what we build and represent 💡.

Deeply grateful to the some people who’ve been part of this journey —

Keerthanaa K, Rahul Babu M. P. , Yogeshwaran T, Nikitha A, Sai Prapanch.H, Tharun H, Santhanalakshmi Babu, Sudhish Raghavendhar 🙌 — your support, energy, and presence mean more than you know 💙.

A sincere thank you to our mentors and coordinators —

Bhuvaneswaran B, Dr. P Kumar, Benedict J.N. 🎓 — for the trust, guidance, and constant push to do better 📈.

We’re not here to maintain standards — we’re here to redefine them ⚔️.

The journey has just begun 🌟.

#CyberSentinels #InvestitureCeremony #DesignLeadership #REC #StudentLeadership #CreativeDirection #Growth #LeadershipJourney #CampusLife #CollegeClubs #DesignThinking #Innovation #Teamwork #CommunityBuilding #FutureLeaders #StudentSuccess #CreativeMindset #PersonalGrowth #TechCommunity #BuildInPublic','https://www.linkedin.com/feed/update/urn:li:activity:7457987597756207106/',array['https://media.licdn.com/dms/image/v2/D561FAQF7XT2SIiSDow/feedshare-document-cover-images_480/B56Z3kG90YKIBA-/0/1777648526899?e=1780484400&v=beta&t=rbm8ODJenaqcyOKeaq5iIQZLlhwEW1BaBEKBdGZJJPY']::text[],'CLUB DESIGN LEAD','2026-01-10T00:00:00Z',11) on conflict (linkedin_url) do nothing;
insert into public.linkedin_posts (title, description, linkedin_url, images, category, published_at, sort_order) values ('🧠 12 Hours of Pure Cyber Thrill – What''s The Flag 2025 CTF 🕵️‍♂️','Had an amazing experience participating in “What’s The Flag 2025”, a 12-hour Capture The Flag (CTF) competition organized by the Cyber Sentinels Club through Unstop, Rajalakshmi Engineering College.

Our team F-Society 👾 — comprising me and Akash Vardhan V — finished in 21st place with 2210 points.

Even though we didn’t make it to the top 10, every challenge tested our problem-solving, logical reasoning, and Cybersecurity fundamentals to the core.

Interestingly, when the Cyber Sentinels Club conducted the CTF last year named "root@localhost", it was my first-ever CTF experience participating Solo, and I secured 34th place back then.

Seeing that improvement to 21st this year feels rewarding — proof that consistency and curiosity do pay off. 🚀

💡 Key Takeaways:

Strengthened my skills in Cryptography, web exploitation, and OSINT

Learned the power of collaboration under pressure

Reinforced the mindset of continuous learning and resilience

Huge thanks to the Cyber Sentinels Club for organizing such an engaging and intense event.

A big shoutout and gratitude to Rajalakshmi Engineering College, Cyber Sentinels, Benedict J.N. , Bhuvaneswaran B, and the amazing collaborators from Altered Security, WYNTRIX, Altruisty, and freshbooks™ for making this event such a thrilling and educational experience. 🙌

Every flag was a new puzzle and every loss, a lesson. 🔐

On to more CTFs, more flags, and more learning ahead! 💪

#CyberSecurity #CTF #EthicalHacking #CaptureTheFlag #InfoSec #OSINT #Cryptography #CyberSentinels #RajalakshmiEngineeringCollege #FSociety #Teamwork #ContinuousLearning #GrowthMindset #LearningByDoing','https://www.linkedin.com/feed/update/urn:li:activity:7387764201735405568/',array['https://media.licdn.com/dms/image/v2/D5622AQGcqV8DpTCMXA/feedshare-shrink_480/B56ZoacYiFIYAY-/0/1761380242401?e=1781740800&v=beta&t=liizTOTLfip5m_rJxP1t4qI9jB1ss6t6RMhyAf1v7hw']::text[],'CTF CHALLENGER','2026-01-10T00:00:00Z',12) on conflict (linkedin_url) do nothing;
insert into public.linkedin_posts (title, description, linkedin_url, images, category, published_at, sort_order) values ('✨ Digital Dreamers Den (D3) Community Meetup #5 — This Weekend Was Absolutely Electric','This weekend was packed with learning, energy, and genuine community spirit. Me and my friend Sejal Sai S also had the chance to present our CodeSapiens - the Student Community of Coders Mentorship Full-Stack Development Project- Webcrawler, which was even streamed live on YouTube.

🔗 Stream link: https://lnkd.in/gaawdthJ

Huge thanks to CodeSapiens - the Student Community of Coders, Keerthana M G akka, Alfred Sam D, Thiyaga B sir, and our mentor Indhu Prakash K V for constantly pushing us and guiding us.

Also, a heartfelt appreciation to ARAVIND KUMAR J, founder of Digital Dreamers Den (D3), and the entire Digital Dreamers Den (D3) community for building such a strong and empowering ecosystem.

And a big shout-out to Sahithya B A, who hosted the entire meetup flawlessly — keeping the energy high, engaging the audience, and making the whole experience smooth and lively.

🔹 Topic 1: AI integration with Docker, Inc

Speaker: Aakash Dhakshnamoorthy

AI Roadmap:

Python (NumPy, Pandas, Visualisation tools)

Supervised & Unsupervised Learning

ML & Deep Learning

TensorFlow

NLP

GenAI

A clean and practical breakdown for anyone stepping into AI.

🔹 Topic 2: Design Superpowers for Developers

Speaker: Yuvaraj Muthu (Yuvi)

Visionary Founder: Payan Design Studio

How developers can build better UI with AI

Avoiding common UI pitfalls

5 biggest developer UI mistakes:

Spacing & alignment chaos

Overusing colours

Typography inconsistency

Lack of consistency

Weak visual hierarchy

A brutally honest session every developer needed.

🔹 Topic 3: From Frontend to Frontier — Evolving for the AI-Driven Web

Speaker: Tapas Adhikary

Covered:

Real AI-powered project demos

API calls with minimal UI

React powering the frontend

How devs must evolve for an AI-first web

Simple, practical, and layered with clarity.

🔹 Special Mentions

✨ Hareesh Rajendran

Joined as a guest and threw in sharp, insightful questions that sparked deeper discussions and added a ton of value.

🎮 Connextion Game

A fun mid-event break, adding a refreshing dose of excitement to the technical flow.

We also met like-minded developers, connected with new people, bumped into our college seniors G.Savita Shri,RAGUL M and Anish D exchanged ideas, and walked away with a lot of inspiration.

A weekend full of learning and connections — and definitely one to remember. 🚀

#DigitalDreamersDen #D3Meetup #CommunityMeetup #TechCommunity #DeveloperCommunity #StudentCommunity #CodeSapiens #LearningTogether #WeekendVibes','https://www.linkedin.com/feed/update/urn:li:activity:7398262361897246720/',array['https://media.licdn.com/dms/image/v2/D5622AQFX83tGdClMvQ/feedshare-shrink_480/B56ZqvoWM9HAAc-/0/1763883182286?e=1781740800&v=beta&t=DvuZnJYJ7u5r4lQfyrijl9lkh0Z6gSmy8a5Rj8meVhc']::text[],'TACTICAL WIN','2026-01-05T00:00:00Z',13) on conflict (linkedin_url) do nothing;
insert into public.linkedin_posts (title, description, linkedin_url, images, category, published_at, sort_order) values ('🎉 Grateful & Proud Moment!','I’m happy to share that I’ve received the Certificate of Appreciation for successfully completing the one-month CodeSapiens - the Student Community of Coders - Mentorship Program, under the guidance of Indhu Prakash K V, mentor from the Digital Dreamers Den (D3) Community.

This certificate (pictured below) represents weeks of learning, building, experimenting, and improving — both technically and personally.

CodeSapiens - the Student Community of Coders - mentorship program …

Over the past month, I had the opportunity to:

🔹 Work in a collaborative team environment

🔹 Build a full-stack AI-powered project from the ground up

🔹 Improve my skills in Flask, API design, Supabase integration & authentication

🔹 Explore AI-driven web crawling, summarization, and automation

🔹 Present our work at the Digital Dreamers Den (D3) Community Meetup

I’m sincerely thankful to:

✨ Thiyaga B , Founder of CodeSapiens - the Student Community of Coders

✨ARAVIND KUMAR J – Founder of the Digital Dreamers Den (D3)

✨ Indhu Prakash K V , my mentor

✨ Keerthana M G

✨ Alfred Sam D

✨ The entire Digital Dreamers Den (D3) Community and CodeSapiens - the Student Community of Coders Community,

Your guidance and support made this journey meaningful and motivating.

Excited to carry these learnings forward and continue building impactful projects! 🚀

#Codesapiens #D3Community #Certificate #Achievement #Mentorship #LearningJourney #WebDevelopment #AIProjects #PythonDeveloper #TeamLevellers #CareerGrowth #TechLearning #SkillBuilding #DeveloperJourney #ProudMoment #Motivation #EngineeringCommunity #FutureEngineer','https://www.linkedin.com/feed/update/urn:li:activity:7401095198577102848/',array['https://media.licdn.com/dms/image/v2/D561FAQH-i2KlVfXONA/feedshare-document-cover-images_480/B56ZrT7UryI8BM-/0/1764492141841?e=1780484400&v=beta&t=GDJyougiw5zMt2jSGmRTAMdwzbCP37tRLUjd2j7WfcQ']::text[],'TACTICAL WIN','2026-01-05T00:00:00Z',14) on conflict (linkedin_url) do nothing;
insert into public.linkedin_posts (title, description, linkedin_url, images, category, published_at, sort_order) values ('🎯 A Day Full of Learning, Fun, and Wins! 🎯','Our team had an amazing experience at the National Level Technical Symposium – Technovanza 2025–26, hosted by Jerusalem College of Engineering - India!

It was a day filled with learning, excitement, and fun — we participated in multiple events and bagged several prizes 🏆👾.

My teammate Aniketh J and I secured 3rd place in TriSpark, a Logical Thinking, Decoding, and Coding event! 💻✨

Had a great time the entire day with my wonderful teammates — Sajiv Jess, SHRI DHARSHINI M, swarna lakshmi B, Dejaswini B G, and Akash Vardhan V,Aniketh J — brainstorming, competing, and making memories that will last! 💫

Although I missed the chance to attend Round 2 of Escape Room 2.0 (CTF), which I was really looking forward to, the overall experience was incredibly fun, enriching, and memorable. 💪

A huge thanks to the organizers and coordinators for hosting such a vibrant and inspiring symposium! 🙌

#Technovanza2025 #JerusalemCollegeOfEngineering #NationalLevelSymposium #TriSpark #Innovation #EngineeringJourney #TeamWork #LogicalThinking #Decoding #CodingChallenge #LearningExperience #CTF #EscapeRoom #ProblemSolving #HackathonVibes #CollegeLife #RajalakshmiEngineeringCollege #REC #Achievement #FunAndLearning #TeamSpirit #StudentLife #EngineeringWithPurpose #MemorableMoments','https://www.linkedin.com/feed/update/urn:li:activity:7382988389702254592/',array['https://media.licdn.com/dms/image/v2/D5622AQEySlVK9_uQrQ/feedshare-shrink_160/B56ZnPZwEqJYAc-/0/1760121265441?e=1781740800&v=beta&t=hyZOVY9HOMKDIStNTJU6CDsgAC_d9jnRQd31V0KrgTY']::text[],'HACKATHON WINNER','2025-12-10T00:00:00Z',15) on conflict (linkedin_url) do nothing;
insert into public.linkedin_posts (title, description, linkedin_url, images, category, published_at, sort_order) values ('3rd place - Fix & Flex UI/UX Design Challenge, CRYPTRIX ''25','The competition was an intense frontend design showdown with:

🎨 UI replication & creative redesigns

⚡ Chaos cards and curveball challenges

🧩 Frontend quizzes testing logic and design thinking

The event was very well-organized, and the people there were truly humble and kind, which made the whole experience even more memorable. 💯

On a personal note, achieving this win at St. Joseph''s College Of Engineering felt extra special — a small but significant milestone in my journey, and a moment of personal satisfaction that I’ll always cherish. ✨

This challenge pushed us to think fast, stay creative, and adapt under pressure, and we’re proud to have earned a podium finish with a cash prize 💰.

A big thanks to the organizers of CRYPTRIX ''25 for hosting such a dynamic event and to everyone who made the day special. 🙌

Looking forward to more opportunities to learn, grow, and design! 🌟

#UIUXDesign #FrontendDevelopment #Cryptrix25 #TechSymposium #DesignChallenge #Teamwork #CreativityInTech #StJosephsCollegeOfEngineering','https://www.linkedin.com/feed/update/urn:li:activity:7367542441740009474/',array['https://media.licdn.com/dms/image/v2/D5622AQHDo97IV-Rq4A/feedshare-shrink_480/B56Zj7EyCWHcAY-/0/1756558995900?e=1781740800&v=beta&t=TUoxDESGg7dnWPZBhCJEobTnLoh_jPdqImOEfw619ko']::text[],'CREDENTIAL','2025-10-15T00:00:00Z',16) on conflict (linkedin_url) do nothing;
insert into public.linkedin_posts (title, description, linkedin_url, images, category, published_at, sort_order) values ('🌟 Internship Milestone Achieved! 🌟','I am excited to share that I have successfully completed my 1-month internship in Cybersecurity at SkillCraft Technology (15th July 2025 – 14th August 2025) 🎯

This experience has been an incredible journey where I gained valuable insights into real-world Cybersecurity challenges and honed my technical, analytical, and problem-solving skills. I’m grateful for this opportunity and proud to have earned both a Certificate of Completion and a Letter of Recommendation acknowledging my performance during the internship.

This is just the beginning — I look forward to further exploring and contributing to the Cybersecurity domain in the coming years.

#CyberSecurity #Internship #SkillCraftTechnology #EthicalHacking #InformationSecurity #CyberDefense #CyberAwareness #TechJourney #CareerGrowth #LearningExperience #DigitalSecurity #CyberSecurityInternship #CyberProtection #TechSkills #FutureReady','https://www.linkedin.com/feed/update/urn:li:activity:7361979964872642560/',array['https://media.licdn.com/dms/image/v2/D5622AQGqvkSAZiJfgw/feedshare-shrink_480/B56ZisBwYgG0AY-/0/1755232800218?e=1781740800&v=beta&t=ki2uomSW-C8OZBa0iTtpGtmMS4T78c6hYPgbpdWx0Cc']::text[],'SECURE INTERN','2025-08-15T00:00:00Z',17) on conflict (linkedin_url) do nothing;
insert into public.linkedin_posts (title, description, linkedin_url, images, category, published_at, sort_order) values ('✨ Exciting News! ✨','I’m thrilled to share that I’ve been offered the Cyber Security Intern position at SkillCraft Technology! 🚀🔐

This one-month educational internship, starting from July 15, 2025, is a great opportunity for me to gain hands-on experience in the dynamic field of cybersecurity. I''m eager to learn, grow, and contribute meaningfully during this journey.

A big thank you to SkillCraft Technology for this opportunity and to everyone who has supported me along the way. 🙌

#CyberSecurity #InternshipOpportunity #SkillCraftTechnology #Grateful #LearningInProgress

#CyberSecIntern #TechGrowth #InformationSecurity #CareerDevelopment #CyberAwareness

#FutureInTech #StudentInternship #TechInternship #Infosec #CyberIntern #CyberJourney

#SkillBuilding #DigitalSecurity #EthicalHacking

#LearningByDoing #ITInternship #InternshipExperience','https://www.linkedin.com/feed/update/urn:li:activity:7348950342023204864/',array['https://media.licdn.com/dms/image/v2/D561FAQHHu83XC9RUxw/feedshare-document-cover-images_480/B56Zfy3TX.HoBM-/0/1752126274735?e=1780484400&v=beta&t=KUoH-3OJXTyDbV-vg-d-L1K-jmxv3MNvVDOIW1z57lU']::text[],'SECURE INTERN','2025-08-15T00:00:00Z',18) on conflict (linkedin_url) do nothing;
insert into public.linkedin_posts (title, description, linkedin_url, images, category, published_at, sort_order) values ('🌍✨ Thrilled to Announce! ✨🌍','I’m incredibly excited to share that I’ve joined the Intellexa REC Club at Rajalakshmi Engineering College as an IoT Team Member! 🤖🚀

Joining Intellexa REC marks a significant step in my journey toward exploring cutting-edge technology, innovation, and impactful collaboration. I’m honored to be part of a dynamic team where creativity meets real-world solutions! 💡🌐

A heartfelt thank you to my IoT team lead, AHAMED FAISAL, for your mentorship and belief in my potential 🙌 — and to SivaRamaKrishnan R. the President of Intellexa REC Club, for trusting me with this opportunity and welcoming me into such a visionary space. 🙏👨‍💼

I’m looking forward to working alongside brilliant minds, building projects that matter, and growing both technically and personally. Let’s innovate, inspire, and make a difference — together! 💫💪

#Intellexa #IoT #TechInnovation #RajalakshmiEngineeringCollege #GlobalTech #StudentInnovation #EngineeringExcellence #FutureReady #TechLeaders #SmartSolutions #REC #TeamIntellexa #DigitalTransformation #STEM #EmergingTech #Leadership #Gratitude #MakingImpact #IoTRevolution #VisionToReality #NextGenTech','https://www.linkedin.com/feed/update/urn:li:activity:7359433185811681281/',array['https://media.licdn.com/dms/image/v2/D5622AQG-EHIN7d6HuA/feedshare-shrink_480/B56ZiHZvFOHcAY-/0/1754618328211?e=1781740800&v=beta&t=N_Lzk6LgKRv-xu8D4O8V_AVc_VGaQcdOHGj_wrC31wE']::text[],'TACTICAL WIN','2025-07-20T00:00:00Z',19) on conflict (linkedin_url) do nothing;
insert into public.linkedin_posts (title, description, linkedin_url, images, category, published_at, sort_order) values ('🩸 Giving the Gift of Life Through Blood Donation 🩸','I recently had the opportunity to donate 350ml of blood at Rajalakshmi Engineering College, where Christian Medical College hosted a blood donation camp in collaboration with the Uthiram Club and Rotary Club or Rotaract. It was an incredibly fulfilling experience, knowing that a simple act like this can help save lives. ❤️

The entire process was well-organized, and the medical team ensured a smooth and comfortable donation. As a token of appreciation, donors received a care pack 🎁 with refreshments 🥤🍪 and badges 🎖️—a thoughtful gesture that made the experience even more memorable.

💡 Donating blood for the first time has been an eye-opening experience, and I encourage everyone who can to consider doing the same. A few minutes of our time can make a world of difference for someone in need! 💪🏼

#FirstBloodDonation 🩸 #DonateBloodSaveLives ❤️ #GivingBack 🤝 #Healthcare 🏥 #CommunityImpact 🌍

#BloodDonor 💉 #VolunteerWork 🙌 #LifeSaver 💓 #StudentLife 🎓 #MedicalAwareness 🧠

#YouthForChange 🌱 #BloodDonationCamp 🏫 #REC #CMC #RotaractClub #UthiramClub

#BeTheChange #ServeSociety #KindnessMatters #HumanityFirst #SocialResponsibility','https://www.linkedin.com/feed/update/urn:li:activity:7313942722250252288/',array['https://media.licdn.com/dms/image/v2/D5622AQESJJhxHBoOMQ/feedshare-shrink_160/B56ZYBYI8LGoAc-/0/1743779828057?e=1781740800&v=beta&t=8EwmVIegipLakUH-KWd-WzvqXuqY_hSucGu5FTCtkt0']::text[],'CREDENTIAL','2025-04-10T00:00:00Z',20) on conflict (linkedin_url) do nothing;
insert into public.linkedin_posts (title, description, linkedin_url, images, category, published_at, sort_order) values ('🌟 Mission Accomplished! 🌟','I’m excited to share that I have successfully secured a spot in the root@localhost Capture The Flag (CTF) contest! 🏆💻

This wasn’t just a competition—it was an electrifying journey through the fascinating world of Cybersecurity. Each challenge tested my analytical skills, determination, and problem-solving abilities, making it a truly unforgettable experience.

💡 What Made This Experience Stand Out:

🔐 Immersive Learning: Gained hands-on exposure to cutting-edge cybersecurity techniques.

🤝 Collaborative Growth: Connected with and learned from an exceptional community of peers.

🚀 Unparalleled Challenges: Pushed my boundaries to solve intricate problems with precision and creativity.

Receiving this certificate of achievement 🎓 is an incredible honor, and I owe my gratitude to the fantastic organizing team: CyberSentinels REC, Bhuvaneswaran B, Benedict J.N., Dr. P Kumar, Rajalakshmi Engineering College, Altered Security, XYZ. Your efforts made this journey truly remarkable. 👏👏

This accomplishment is not just a milestone but a stepping stone. It fuels my passion to continue exploring, learning, and contributing to the cybersecurity landscape. Let’s collaborate to build a safer and more resilient digital world! 🌐🔐

Thank you to everyone RITHESH S, SHEMKUMAR P, SAMPATH KUMAR P, Jerin B S, HARISH D, Subhikshaa S, SIVASHANKAR S, @Suriya Sundaram K.S, Karan Balaji R S, Swathi S who made this event a success. Here’s to new challenges, greater learning, and continued growth. 🚀

#rootatlocalhost #CyberSentinelsREC #CaptureTheFlag #CyberSecurity #CTFSuccess #Innovation #DigitalResilience #Hacking #CyberDefense #TechJourney #LearningNeverStops #ProblemSolving #CTFCommunity #RajalakshmiEngineeringCollege #CyberFuture #SecureTheFuture #EthicalHacking #InfoSec #BugBounty #DigitalTransformation #ThreatHunting #NetworkSecurity #PenTesting #CyberAwareness #TechInnovation #CloudSecurity #MalwareAnalysis #CyberForensics #DataPrivacy #DigitalSkills #TechSavvy #FutureOfTech #SkillDevelopment #ZeroTrust #HackThePlanet #ITSecurity #CyberTalent','https://www.linkedin.com/feed/update/urn:li:activity:7285725312061976576/',array['https://media.licdn.com/dms/image/v2/D5622AQHqXbOjfYa4Lg/feedshare-shrink_480/B56ZRwYj2yHsAY-/0/1737052274980?e=1781740800&v=beta&t=yvuhi5GMoV_9nlaVJ0ThZwVpygA7Cnhp4NjtaQHNgIg']::text[],'CTF CHALLENGER','2025-01-15T00:00:00Z',21) on conflict (linkedin_url) do nothing;
commit;
