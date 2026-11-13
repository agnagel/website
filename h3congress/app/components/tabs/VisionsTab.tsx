"use client";

import type { ReactNode } from "react";
import { useReveal } from "../useReveal";

// One themed section of the Congress 2037 essay: a numbered, glyphed head on the
// left and, on the right, a scene-setting vignette followed by the list of
// end-state changes it promises.
type VisionItem = { lead: string; body: ReactNode };
type VisionSection = {
  id: string;
  eyebrow: string;
  title: string;
  glyph: ReactNode;
  scene: ReactNode;
  items: VisionItem[];
};

const SECTIONS: VisionSection[] = [
  {
    id: "gets-things-done",
    eyebrow: "The end vision",
    title: "A Congress that gets things done",
    glyph: <path d="M20 6 9 17l-5-5" />,
    scene: (
      <>
        A bill to send federal funding to repair aging rural bridges has
        cosponsors from both parties and support from most Americans, yet it sits
        for years without a vote. When it finally moves, it is folded into a giant
        package passed hours before a deadline, alongside hundreds of provisions
        most members never had time to read. In 2037, popular ideas have a
        reliable path to becoming law, whether Congress is planning ahead or
        responding to events as they happen. Committees work side by side, so
        Congress can move on several big issues at once and a crisis in one area
        no longer stalls everything else.
      </>
    ),
    items: [
      {
        lead: "The ideas in every bill get a fair chance.",
        body: "Congress returns to what insiders call regular order. Bills start in committees, where members of both parties with real expertise write and negotiate them, then move to open debate on the floor and a final agreement between the House and Senate, so the public can see who shaped a law."
      },
      {
        lead: "Bills that move on their own merits.",
        body: "Good ideas no longer wait to ride one must-pass package each year. They pass on their own, and lawmakers see the results of the policies they wrote."
      },
      {
        lead: "A Senate that isn't constantly bottlenecked by slim majorities.",
        body: "When margins are narrow, a single senator or a small group can stall the whole chamber. In 2037, bills with real support get a vote, and senators who want to block one make their case on the floor in public. The Constitution has always let each chamber write its own rules, and the Senate uses that freedom to keep popular bills moving."
      },
      {
        lead: "Hard questions brought to a decision.",
        body: "Retirement security, housing, and health care costs get worked and voted on, so Americans know where Congress stands."
      }
    ]
  },
  {
    id: "you-can-reach",
    eyebrow: "The end vision",
    title: "A Congress you can actually reach",
    glyph: (
      <>
        <path d="M5 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16" />
        <path d="M3 21h16" />
        <circle cx="13.5" cy="12" r="1" />
      </>
    ),
    scene: (
      <>
        A small business owner has a question about a federal loan. She tries her
        representative&rsquo;s website, gets pointed to a form, then to another
        office, and weeks later is still waiting to hear back. In 2037 there is one
        clear front door, and it works whether someone types, talks, or walks in.
        Answers come fast, input visibly shapes what Congress does, and the public
        record is easy to follow.
      </>
    ),
    items: [
      {
        lead: "One front door to Congress.",
        body: "Americans can raise a concern, follow a bill, or ask for help through web interfaces that are simple to use. Enough is standardized across offices and both chambers that people know what to expect, while each member has room to tailor how their office connects with the constituents they serve."
      },
      {
        lead: "Fast, transparent casework.",
        body: "AI tools sort incoming requests and draft answers to routine questions for staff to review, and constituents can check on their case anytime. A veteran waiting on benefits or a family stuck on a passport gets help in days, and caseworkers have more time for the hardest cases."
      },
      {
        lead: "Public input that shapes legislation.",
        body: "Congress gathers clear, structured views on what constituents want and which tradeoffs they will accept. Think of it as a modern version of the right to petition that the First Amendment protects, one where people can see that speaking up changes what gets written."
      },
      {
        lead: "A lasting record of who an office hears from.",
        body: "Offices keep track of stakeholder meetings and who a bill would affect back home, so members understand what a vote means for their communities before they cast it."
      },
      {
        lead: "An open, searchable public record.",
        body: "Since 1789 the Constitution has required each chamber to publish a journal of its proceedings. In 2037, hearings, reports, amendments, and votes are published as searchable data the moment they exist, so anyone can hold Congress accountable with facts."
      },
      {
        lead: "A Capitol that welcomes everyone.",
        body: "Clear signage, accessible routes, and one system for managing space make the building easy to navigate whatever a visitor's mobility, hearing, vision, or language. The people's house feels like it belongs to the people."
      }
    ]
  },
  {
    id: "you-can-trust",
    eyebrow: "The end vision",
    title: "A Congress you can trust",
    glyph: (
      <>
        <path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
    scene: (
      <>
        A voter reads that her representative bought shares in a company the week
        before voting on a bill that would help it. Maybe nothing improper
        happened, but she now wonders who that vote was really for. Only about one
        in ten Americans have a great deal or quite a lot of confidence in
        Congress, the lowest of any institution{" "}
        <a
          href="https://news.gallup.com/poll/692633/democrats-confidence-institutions-sinks-new-low.aspx"
          target="_blank"
          rel="noopener noreferrer"
        >
          Gallup measured in 2025
        </a>
        . The framers saw this risk coming and gave each chamber the power to
        discipline its own members in Article I, Section 5. In 2037, Congress uses
        that power, and the rules are clear enough that Americans can see their
        representatives work for them.
      </>
    ),
    items: [
      {
        lead: "No stock trading in office.",
        body: "Members and senior staff keep their investments in broad funds or blind trusts. No one has to wonder whether a vote was cast for the country or for a portfolio."
      },
      {
        lead: "Conflicts of interest that are easy to spot.",
        body: "Financial disclosures are published as searchable data instead of scanned forms, so reporters and voters can find conflicts in minutes."
      },
      {
        lead: "A clear view of who is lobbying whom.",
        body: "Meetings with lobbyists, and the clients behind them, are disclosed in one searchable place."
      },
      {
        lead: "A slower revolving door.",
        body: "Members and senior staff wait a meaningful period before lobbying former colleagues, so public service is never just a step toward selling access."
      },
      {
        lead: "Ethics rules with real enforcement.",
        body: "Independent investigators review complaints and publish findings on a set timeline, so misconduct has consequences no matter which party is in charge."
      }
    ]
  },
  {
    id: "pays-its-bills",
    eyebrow: "The end vision",
    title: "A government that pays its bills on time",
    glyph: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" />
        <path d="M12 13.2v4.6M10.6 16.6c.1.7.7 1.1 1.4 1.1.8 0 1.4-.4 1.4-1.1 0-1.4-2.7-.8-2.7-2.2 0-.6.6-1 1.3-1 .7 0 1.2.4 1.3 1" />
      </>
    ),
    scene: (
      <>
        Every fall, a park ranger in Montana, a federal contractor in Ohio, and a
        family waiting on a passport watch the same countdown clock, wondering
        whether the government will shut down. Since the late 1970s, Congress has
        passed all of its spending bills on time only four times, most recently for
        fiscal year 1997, according to{" "}
        <a
          href="https://www.pewresearch.org/short-reads/2025/10/01/congress-has-long-struggled-to-pass-spending-bills-on-time/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Pew Research Center
        </a>
        . Standoffs over the debt limit have put the nation&rsquo;s credit at risk
        under majorities of both parties. The power of the purse is one of the most
        important tools the Constitution gives Congress, and in 2037 Congress uses
        it on schedule.
      </>
    ),
    items: [
      {
        lead: "Government funded on time.",
        body: "The twelve spending bills move on a reliable schedule, so agencies can plan, services keep running, and shutdown threats become a thing of the past."
      },
      {
        lead: "Authorizers and appropriators understand each other.",
        body: "The committees that set policy and the committees that fund it work from the same picture of each program, so money follows the priorities Congress has agreed on and good programs are neither left unfunded nor funded without direction."
      },
      {
        lead: "Traceable appropriations data.",
        body: "Any American can follow a dollar from what Congress approved to what an agency actually spent, the kind of regular public accounting of federal money the framers called for."
      },
      {
        lead: "A tax code people can understand.",
        body: "Congress reviews tax laws on a regular schedule and explains in plain terms who pays what, so families and small businesses can plan ahead and trust that the system is fair."
      },
      {
        lead: "No more debt limit standoffs.",
        body: "Decisions about borrowing are settled as part of the regular budget process. The Fourteenth Amendment says the validity of the public debt shall not be questioned, and in 2037 it never is."
      },
      {
        lead: "One pipeline for funding requests.",
        body: "Every request from a member is checked for duplication and conflicts in one system, so taxpayers never fund the same project twice."
      },
      {
        lead: "Spending decided by Congress.",
        body: "Money Congress appropriates is spent the way Congress directed, honoring the rule in Article I, Section 9 that no money leaves the Treasury without a law to spend it. Any administration that withholds or redirects funds faces real consequences."
      }
    ]
  },
  {
    id: "keeps-its-powers",
    eyebrow: "The end vision",
    title: "A Congress that keeps the powers the Constitution gave it",
    glyph: (
      <>
        <path d="M4 21h16" />
        <path d="M6 21V9m4 12V9m4 12V9m4 12V9" />
        <path d="M3.5 9 12 4l8.5 5" />
      </>
    ),
    scene: (
      <>
        A military family learns that their son&rsquo;s unit is deploying to a
        conflict Congress never voted on. Presidents of both parties have sent
        troops into combat this way for decades, and Congress last declared war in
        1942. The Constitution&rsquo;s first words on government give{" "}
        <a
          href="https://www.archives.gov/founding-docs/constitution-transcript"
          target="_blank"
          rel="noopener noreferrer"
        >
          &ldquo;all legislative Powers&rdquo;
        </a>{" "}
        to Congress, and the framers deliberately placed decisions about taxes,
        trade, and war with the branch closest to the people. Over the past century,
        Congress has handed many of those choices to the executive branch through
        broad laws that rarely expire, no matter which party holds the White House.
        In 2037, Congress keeps those decisions for itself. That matters for
        democracy because a law passed by Congress is debated in public, reflects
        the votes of representatives from every district, and does not swing with
        each new administration.
      </>
    ),
    items: [
      {
        lead: "Congress making its own decisions.",
        body: "Laws are written clearly enough that major policy choices are settled by elected representatives instead of agencies, and authority granted for a passing emergency is taken back once it ends. Laws last beyond a single administration."
      },
      {
        lead: "Trade policy set by Congress.",
        body: "Congress revisits the tariff powers it has delegated and votes on major trade decisions, so the prices families and businesses pay are shaped by lawmakers they can hold accountable. The power to set duties sits among the very first powers the Constitution lists for Congress."
      },
      {
        lead: "A vote before going to war.",
        body: "Congress debates and votes before the country enters a major conflict and retires outdated authorizations for the use of force, keeping the decision with the branch the framers trusted with it in Article I, Section 8."
      },
      {
        lead: "Major international agreements reviewed by Congress.",
        body: "Significant commitments to other countries come before Congress, so promises that bind the nation reflect broad support and outlast any one administration."
      },
      {
        lead: "Senate review where it matters most.",
        body: "Routine positions clear quickly while judges and senior officials get careful individual review, and top posts go to confirmed officials instead of long serving acting ones. This is the advice and consent role the framers wrote into Article II."
      },
      {
        lead: "Impeachment as a trusted check.",
        body: "When any official abuses power, the House and Senate follow clear, fair procedures the public understands, so this rare and serious tool is seen as accountability that applies to everyone."
      },
      {
        lead: "Members who defend their branch.",
        body: "Members build careers on what they accomplish through Congress, so the branch closest to the people keeps its constitutional role."
      }
    ]
  },
  {
    id: "oversight",
    eyebrow: "The end vision",
    title: "Oversight that keeps up with the government it oversees",
    glyph: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </>
    ),
    scene: (
      <>
        For two years, wait times at a veterans hospital creep upward before anyone
        in Congress hears about it. By the time a hearing is called, veterans have
        already gone without care. In 2037, committees spot problems like this
        while there is still time to fix them.
      </>
    ),
    items: [
      {
        lead: "Data in place of reports.",
        body: "Congress asks agencies for data instead of stacks of written reports, decides what is public and what stays private, and pulls reports together for hearings or on request."
      },
      {
        lead: "Tracked requests to agencies.",
        body: "Congress can see everything it has asked agencies for and what has been delivered. Nothing quietly falls through the cracks."
      },
      {
        lead: "Real time agency oversight.",
        body: "Committees can review and audit the agencies they oversee through shared data and a secure intranet, so problems surface early."
      },
      {
        lead: "A real partnership with states and communities.",
        body: "Governors, mayors, and local officials have a direct channel to tell Congress how federal programs are landing, so disaster aid, grants, and new laws work where people actually live."
      },
      {
        lead: "A standing check on whether laws work.",
        body: "Findings about how a law is performing go back to the committees that wrote it, so Congress can fix what is broken without waiting for a crisis."
      }
    ]
  },
  {
    id: "writing-laws",
    eyebrow: "The end vision",
    title: "Writing laws people can understand and trust",
    glyph: (
      <>
        <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
        <path d="M14 3v4h4" />
        <path d="M9.5 13h5M9.5 16.5h3" />
      </>
    ),
    scene: (
      <>
        A staffer is handed a forty page bill full of instructions to strike a word
        here and insert a phrase there. To understand what it actually does, she
        has to rebuild the current law by hand, with no way to test how the change
        would affect real people. In 2037, everyone involved can see exactly what a
        bill does before it becomes law, and members can stand behind their votes
        with confidence.
      </>
    ),
    items: [
      {
        lead: "Understanding how the US Code fits together.",
        body: "Drafters can see how any provision connects to related laws across the Code and exactly what a bill would change, so conflicts and mistakes get caught early and anyone can trace how a law came to read the way it does."
      },
      {
        lead: "Drafting tools that show real world impact.",
        body: "AI assisted tools let staff ask plain language questions about a bill and test how it would affect different families, businesses, and regions before a vote. Drafting moves through one smooth pipeline with no more PDFs."
      },
      {
        lead: "Committee jurisdictions that match today's problems.",
        body: "Committee responsibilities are updated regularly and line up across chambers, so issues like artificial intelligence have a clear home and someone accountable for them."
      }
    ]
  },
  {
    id: "knows-what-it-knows",
    eyebrow: "The end vision",
    title: "A Congress that knows what it knows",
    glyph: (
      <>
        <ellipse cx="12" cy="6" rx="7" ry="3" />
        <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
        <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
      </>
    ),
    scene: (
      <>
        When a family asks their representative about federal disaster aid after a
        flood, the answer might already exist in another office down the hall, or
        in a report a research agency finished last month. Today there is often no
        way to find it, so staff start from scratch and the family waits. Congress
        runs as hundreds of separate offices that rarely share what they learn. In
        2037 it works as one institution. Staff can find answers in minutes, and
        lawmakers work from the same facts.
      </>
    ),
    items: [
      {
        lead: "Shared data across the institution.",
        body: "Information held by each office, committee, and support agency is unified on common standards and easy to share, so analysis built once can be reused everywhere and lawmakers work from the same facts."
      },
      {
        lead: "Offices own their constituent data.",
        body: "Constituent records live in a shared layer Congress controls, so an office can switch tools without losing the history of the people it has helped."
      },
      {
        lead: "Technology bought once, for everyone.",
        body: "A single security review and shared purchasing get proven tools to staff in days, which saves money and helps offices serve constituents with modern tools."
      },
      {
        lead: "Room to experiment.",
        body: "Staff can safely test new low risk tools, so good ideas spread quickly across Congress and better service reaches the public sooner."
      },
      {
        lead: "Trackable requests to support agencies.",
        body: "Every request for nonpartisan research or legal help is tracked from start to finish, so members get the analysis they need in time to inform their votes."
      },
      {
        lead: "Expert knowledge on demand.",
        body: "Nonpartisan research is searchable anytime, anywhere, with AI tools that point to the right analysis in seconds, so staff answer routine questions instantly and experts spend their time on the hard ones."
      }
    ]
  },
  {
    id: "time-to-represent",
    eyebrow: "The end vision",
    title: "Representatives with time to represent you",
    glyph: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4.3l3 1.8" />
      </>
    ),
    scene: (
      <>
        On a Tuesday morning, a member of Congress sits in a small room across the
        street from the Capitol dialing donors, while two of the committees she
        serves on hold hearings at the same time. New members have been advised to
        spend as much as four hours a day on these calls, according to{" "}
        <a
          href="https://www.cbsnews.com/amp/news/60-minutes-are-members-of-congress-becoming-telemarketers"
          target="_blank"
          rel="noopener noreferrer"
        >
          CBS News
        </a>
        . Reading bills, meeting constituents, and fixing problems get whatever
        time is left. In 2037, a member&rsquo;s week is built around the job voters
        sent them to do, and their success depends on what they deliver for the
        people back home.
      </>
    ),
    items: [
      {
        lead: "More floor time, used wisely.",
        body: "Both chambers spend more days in session, and that time goes to debating and voting on the issues that matter most to the country. Messaging votes and speeches made for the cameras take up far less of the calendar, leaving room for real debate."
      },
      {
        lead: "Less time fundraising.",
        body: "Campaign finance rules and party expectations no longer demand constant call time, so members spend their days on the work constituents elected them to do."
      },
      {
        lead: "Predictable schedules.",
        body: "A stable calendar published well in advance lets members focus on one thing at a time."
      },
      {
        lead: "Built in renewal.",
        body: "Institutional structures help shape how long members serve, so the body stays fresh and the public can trust that those serving remain able to do the job."
      },
      {
        lead: "A Congress sized to the job.",
        body: "The Constitution sets a minimum of 30,000 people per representative but no maximum, and the House has stayed at 435 seats for more than a century while the country's population has more than tripled. Today each member represents more than 760,000 people. In 2037, the size of Congress and its staff grows with the country by deliberate choice, so every member can hear from and speak for a real cross section of the people they represent."
      }
    ]
  },
  {
    id: "people-who-answer",
    eyebrow: "The end vision",
    title: "The people who answer your questions",
    glyph: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
        <path d="M15 5.4a3 3 0 0 1 0 5.2M16.5 20a5.6 5.6 0 0 0-3-5" />
      </>
    ),
    scene: (
      <>
        When you reach out to your representative, the person handling your question
        is often in their first job, paid less than they could earn almost anywhere
        else, and likely to move on soon. The average Hill staffer stays about three
        years, and many of the experts who review the nation&rsquo;s laws leave for
        lobbying firms just as they master the work (
        <a
          href="https://www.newamerica.org/insights/congressional-brain-drain/"
          target="_blank"
          rel="noopener noreferrer"
        >
          New America
        </a>
        ). In 2037, working for Congress is a career people can build a life on. The
        person working on your concern knows how to help, and the expert reviewing a
        bill has years of experience working on your behalf.
      </>
    ),
    items: [
      {
        lead: "A competitive first job.",
        body: "Fair starting pay and recruiting beyond the usual networks open Hill jobs to talented people from every background."
      },
      {
        lead: "Training for every staffer.",
        body: "Structured onboarding and mentorship give every staffer the same foundation, whichever office hires them."
      },
      {
        lead: "Fully supported district offices.",
        body: "District staff get the same tools and training as Washington, so the people closest to constituents can help them faster and share what they hear with lawmakers."
      },
      {
        lead: "Careers worth staying for.",
        body: "Competitive pay and benefits keep experienced staff in public service, so Congress keeps the expertise it needs to hold its own against well funded interests."
      },
      {
        lead: "Permanent technical expertise.",
        body: "Congress has its own nonpartisan corps of technologists with real career paths, so members get fast, credible answers on complex topics."
      }
    ]
  },
  {
    id: "ready-for-the-worst-day",
    eyebrow: "The end vision",
    title: "Ready for the worst day",
    glyph: (
      <>
        <path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6z" />
        <path d="M12 8v4m0 3h.01" />
      </>
    ),
    scene: (
      <>
        A winter storm knocks out power across a district just as families need help
        applying for federal emergency aid. The district office has no backup plan,
        no equipment for staff working from home, and no way to tell constituents
        what it can still do. In 2037, offices keep serving people through any
        disruption, sensitive work stays private, and the institution has tested
        plans for even the worst scenarios. For the country, that means the first
        branch is there when it is needed most.
      </>
    ),
    items: [
      {
        lead: "Offices ready for any disruption.",
        body: "Every office has a tested plan and working equipment, so constituents keep getting help during a storm, a power outage, or a security threat."
      },
      {
        lead: "Secure communications.",
        body: "Members and staff work over encrypted channels Congress controls, so the deliberations Americans rely on stay private and independent of the other branches, just as the Speech or Debate Clause intended."
      },
      {
        lead: "One office accountable for safety.",
        body: "A single, independently overseen security structure protects members, staff, and visitors, so a visit to the Capitol is safe for everyone."
      },
      {
        lead: "Continuity in any crisis.",
        body: "Rehearsed rules let Congress convene and vote under any circumstances and refill empty seats within days, so no community is left without a voice when it matters most. The Constitution already requires a quorum to do business and new elections to fill empty House seats, and in 2037 Congress has a tested plan to meet both in any emergency."
      }
    ]
  }
];

export default function VisionsTab() {
  useReveal();

  return (
    <>
      <section className="h3-vision-hero">
        <div className="h3-vision-hero-glow" aria-hidden="true" />
        <div className="h3-container h3-vision-hero-inner">
          <p className="h3-eyebrow h3-vision-hero-eyebrow" data-reveal>
            Visions &middot; A Tuesday evening in 2037
          </p>
          <h1 data-reveal>Congress 2037</h1>
          <p className="h3-vision-hero-byline" data-reveal>
            October 17, 2026
          </p>
          <div className="h3-vision-hero-lede" data-reveal>
            <p>
              It is a Tuesday evening in 2037, and Maria, a nurse in Dayton, Ohio,
              has a question about a change to her mother&rsquo;s Medicare
              coverage. After dinner she reaches out to her member of Congress in
              whatever way is easiest for her that night &mdash; a phone call, an
              email, a chatbot on a website. Before she goes to bed,
              she has a clear answer, a link to the law that made the change, and a
              note that the office has heard from forty other families in the area
              with the same concern. Two weeks later, she gets an update. After her
              representative raised the issue at a committee hearing, they were
              working with colleagues from both parties on a fix. Within a couple of
              months, the fix has passed both chambers. A month later, it has passed
              into law. Within six months, the policy change has been rolled out
              across the nation. Within a year, Congress understands whether that
              law is making a difference and actually fixing the problem. Within two
              years, Congress has iterated upon the law and come up with a solution
              that seems to be working even better for the American people.
            </p>
            <p>
              Maria was kept updated and tracking this change&rsquo;s progress that
              entire time. She feels good knowing she was one of many voices that
              moved Congress to act. She feels that the democratic process did
              exactly what it was built to do. She never had
              to chase a reply or wonder whether anyone read what she sent. Behind
              that exchange sits an
              institution that finally has the people, information, and tools to do
              the job the Constitution gave it.
            </p>
          </div>
        </div>
      </section>

      <section className="h3-section h3-methodology h3-vision-intro tex-grid-fine">
        <div className="h3-container h3-vision-intro-grid" data-reveal>
          <p>
            Today, Maria&rsquo;s evening would go differently. Her message would
            land in a crowded inbox, she might wait weeks for a form letter, and she
            would never learn that forty of her neighbors were asking the same
            thing. Most people who work in Congress want to give her a better
            answer. They are doing it with thin staffs, outdated tools, and
            processes designed for another century.
          </p>
          <p>
            Meanwhile, artificial intelligence is changing how Americans work,
            learn, and get answers, and each new wave of technology arrives faster
            than the last. People like Maria already expect quick, clear answers
            from their bank, their pharmacy, and their phone. A Congress that can
            keep pace with that change will serve them better and be better equipped
            to govern the technology itself. That future is closer than it sounds.
            Many of the changes it requires are already being piloted, debated, or
            funded in pieces. What follows is a picture of where those pieces could
            lead over the next decade, and none of it belongs to one party or
            depends on who holds the White House.
          </p>
        </div>
      </section>

      {SECTIONS.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className={`h3-section h3-methodology h3-vision-section${
            index % 2 === 1 ? " is-alt" : ""
          }`}
        >
          <div className="h3-container h3-vision-grid">
            <div className="h3-vision-head" data-reveal>
              <span className="h3-vision-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <svg
                className="h3-vision-glyph"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {section.glyph}
              </svg>
              <p className="h3-eyebrow">{section.eyebrow}</p>
              <h2 className="h3-statement">{section.title}</h2>
            </div>
            <div className="h3-vision-body">
              <p className="h3-vision-scene" data-reveal>
                {section.scene}
              </p>
              <ul className="h3-vision-list">
                {section.items.map((item) => (
                  <li key={item.lead} data-reveal>
                    <span className="h3-vision-marker" aria-hidden="true" />
                    <span className="h3-vision-item-text">
                      <strong>{item.lead}</strong> {item.body}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}

      <section className="h3-vision-closing">
        <div className="h3-container h3-vision-closing-inner">
          <p className="h3-eyebrow h3-vision-hero-eyebrow" data-reveal>
            Getting there
          </p>
          <p className="h3-vision-closing-lede" data-reveal>
            Reasonable people will disagree about how best to reach these goals, and
            the details of putting them into practice will take real debate. Some
            steps in the right direction will be big and others will be small. What
            matters is that whatever step we take builds toward the same picture: a
            Congress that acts on what Americans want, is easy to reach, earns the
            public&rsquo;s trust, pays its bills on time, and holds on to the powers
            the Constitution gave it.
          </p>
          <p className="h3-vision-closing-copy" data-reveal>
            Americans deserve a first branch that can keep up with the country it
            serves and the technology reshaping it. The ideas exist, and many of the
            people ready to carry them out are already on the Hill. The next ten
            years can decide whether they get the chance.
          </p>
          <div className="h3-vision-cta" data-reveal>
            <p>
              You have a part in this too. Ask your representatives which of these
              ideas they support, and share the ones that matter most to you.
            </p>
          </div>
        </div>
      </section>

    </>
  );
}
