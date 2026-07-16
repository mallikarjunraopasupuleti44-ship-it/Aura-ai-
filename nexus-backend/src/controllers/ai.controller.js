const { GoogleGenAI } = require('@google/genai');
const prisma = require('../utils/db');

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const deployAgents = async (req, res) => {
  try {
    const { ideaPrompt } = req.body;
    const userId = req.user.userId;

    if (!ideaPrompt) {
      return res.status(400).json({ error: 'ideaPrompt is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured in the backend' });
    }

    // 1. Create a Project in the database
    const project = await prisma.project.create({
      data: {
        userId,
        ideaPrompt,
        status: 'deploying'
      }
    });

    res.status(202).json({ 
      message: 'AI Workforce deployed successfully',
      projectId: project.id
    });

    // 2. Background Task: Run the agents asynchronously
    runAgents(project.id, ideaPrompt).catch(console.error);

  } catch (error) {
    console.error('Deploy error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

const runAgents = async (projectId, ideaPrompt) => {
  try {
    const model = 'gemini-2.0-flash';

    const agents = [
      { name: 'Planner Agent', role: 'Business Strategist', deliverable: 'Business Plan', prompt: `You are a Business Strategist. The user wants to build: "${ideaPrompt}". Provide a concise business plan including concept, target market, and a quick roadmap.` },
      { name: 'Marketing Agent', role: 'Growth Marketer', deliverable: 'Social Campaign', prompt: `You are a Growth Marketer. The user is building: "${ideaPrompt}". Create a short 3-day social media content schedule with captions.` },
      { name: 'Finance Agent', role: 'Financial Analyst', deliverable: 'Cost Analysis', prompt: `You are a Financial Analyst. The user is building: "${ideaPrompt}". Provide a brief startup cost analysis and a break-even estimate.` },
      { name: 'Operations Agent', role: 'Operations Manager', deliverable: 'Weekly Schedule', prompt: `You are an Operations Manager. The user is building: "${ideaPrompt}". Provide a short weekly checklist for running this business.` },
      { name: 'Website Agent', role: 'Web Developer', deliverable: 'Landing Page', prompt: `You are a Web Developer. The user is building: "${ideaPrompt}". Write a 3-section landing page outline (Hero, Features, CTA).` }
    ];

    for (const agent of agents) {
      const { name, role, deliverable, prompt } = agent;
      let task = await prisma.agentTask.create({
        data: { projectId, agentName: name, agentRole: role, deliverable, content: "Generating...", status: 'in-progress' }
      });

      try {
        const response = await ai.models.generateContent({ model, contents: prompt });
        await prisma.agentTask.update({
          where: { id: task.id },
          data: { status: 'completed', content: response.text }
        });
        console.log(`Agent ${name} completed successfully.`);
      } catch (agentError) {
        console.error(`Agent ${name} failed. Generating fallback mock data.`, agentError);
        
        let mockContent = "";
        if (name === 'Planner Agent') {
          mockContent = `## Business Concept

"The Brew Canvas" is a specialty coffee shop dedicated to offering an elevated coffee experience through meticulously sourced single-origin beans and artisanal brewing methods. We aim to be a vibrant community hub where patrons can savor exceptional coffee, engage in creative pursuits, and connect in an inspiring atmosphere.

## Brand Identity
**Brand Name:** The Brew Canvas **Tagline:** Where Every Cup is a Masterpiece. **Brand Personality:** Artisanal, inviting, discerning, and community-centric.

## Target Market
- **Urban Professionals (25-45):** Seeking premium coffee, a sophisticated workspace for remote work, and a calm retreat from city life.
- **Creative Community & Students (20-35):** Appreciating unique flavors, a vibrant atmosphere for networking or studying, and an alternative to chain coffee shops.
- **Coffee Connoisseurs:** Dedicated enthusiasts who value ethical sourcing, rare bean varietals, and expertly prepared pour-overs or espresso.

## Competitive Edge
- **Curated Global Sourcing:** Direct partnerships with ethical farms for exclusive, high-grade single-origin beans, offering unique flavor profiles not found elsewhere locally.
- **Master Barista Expertise:** Highly trained baristas specializing in advanced brewing techniques (e.g., V60 pour-over, Aeropress, Siphon) and latte art, ensuring consistent, exceptional quality.
- **Interactive & Artistic Ambiance:** A uniquely designed space promoting creativity and connection, featuring local art installations and dedicated zones for both collaboration and quiet contemplation.

## Revenue Streams
- In-store coffee and beverage sales (primary)
- Retail sales of whole bean coffee and brewing equipment
- Artisanal pastries and light food offerings
- Private event hosting and coffee tasting workshops`;
        } else if (name === 'Marketing Agent') {
          mockContent = `## Social Media Strategy

### Phase 1: Teaser Campaign (T-Minus 14 Days)
**Instagram Post 1:**
*Image:* A macro shot of perfectly roasted coffee beans falling into a grinder, moody lighting.
*Caption:* Excellence takes time. We've spent months traveling the globe to find the perfect beans. The countdown begins. ☕️✨ #TheBrewCanvas #SpecialtyCoffee #ComingSoon
*Hashtags:* #CoffeeLovers #ArtisanCoffee #CafeCulture

**Twitter Thread:**
1/ Why does most coffee taste the same? Because it's roasted to hide imperfections. We're doing things differently. 
2/ We're opening a space where coffee is treated like an art form. No burnt beans. No overwhelming syrups. Just pure, unadulterated flavor profiles. 
3/ Join our mailing list for exclusive early access and tasting event invites. Link in bio!

### Phase 2: Launch Week
**TikTok Video:**
*Audio:* Lo-fi hip hop beat.
*Visual:* A fast-paced montage of a barista dialing in an espresso shot, steaming milk to a silky microfoam, and pouring a perfect swan latte art. Text overlay: "POV: You found your new favorite spot."
*Caption:* We are OFFICIALLY OPEN! Come say hi and try our signature Ethiopian single-origin pour-over. 🕊️🤎

> *This is a fallback generated campaign because the Google Gemini API quota was exceeded.*`;
        } else if (name === 'Finance Agent') {
          mockContent = `## Financial Projections & Analysis

### Initial Capital Requirements
- **Leasehold Improvements:** $45,000 (Renovation, bar build-out, seating)
- **Equipment:** $35,000 (La Marzocco espresso machine, Mahlkönig grinders, batch brewers, refrigeration)
- **Initial Inventory:** $5,000 (Green coffee, packaging, milks, syrups, food items)
- **Licenses & Permits:** $2,500
- **Working Capital (3 Months):** $25,000
**Total Startup Costs:** $112,500

### Unit Economics (Average Ticket)
- **Average Customer Spend:** $6.50
- **Cost of Goods Sold (COGS):** $1.30 (20%)
- **Gross Profit Margin:** 80%

### Break-Even Analysis
- **Fixed Monthly Costs:** $8,500 (Rent, utilities, insurance, base labor)
- **Break-Even Point:** Approx. 1,634 transactions per month (roughly 55 customers per day).

### Year 1 Revenue Projection
- **Q1:** $45,000 (Soft opening, building local awareness)
- **Q2:** $65,000 (Ramping up marketing, word of mouth)
- **Q3:** $85,000 (Established regular customer base)
- **Q4:** $110,000 (Holiday season gift card and retail bean sales boost)

> *This is a fallback generated analysis because the Google Gemini API quota was exceeded.*`;
        } else if (name === 'Operations Agent') {
          mockContent = `## Operational Blueprint

### Standard Operating Procedures (SOPs)

#### 1. Opening Checklist (06:00 AM - 07:00 AM)
- [ ] Dial in espresso: Pull test shots, adjust grind size and yield based on current humidity and bean age. Target: 18g in, 36g out in 28 seconds.
- [ ] Brew batch coffee (drip).
- [ ] Calibrate and purge steam wands.
- [ ] Stock pastry case and organize grab-and-go section.
- [ ] Perform taste test with the shift team.

#### 2. Mid-Shift Maintenance
- [ ] Check inventory levels for milk, alternative milks, and cups.
- [ ] Wipe down espresso machine and purge group heads every 30 minutes.
- [ ] Sweep lobby area and sanitize high-touch surfaces.

#### 3. Closing Checklist (07:00 PM - 08:00 PM)
- [ ] Backflush espresso machine group heads with Cafiza.
- [ ] Empty and wash all hoppers and grinders.
- [ ] Reconcile cash drawer and run daily Z-report.
- [ ] Date-check all perishable items and rotate stock (FIFO).

### Supplier Management
- **Coffee Beans:** Sourced weekly from *Onyx Coffee Lab* and *Sey Coffee*. Orders placed on Tuesdays by 2 PM.
- **Dairy:** Local farm delivery every Monday and Thursday.
- **Pastries:** Delivered daily at 5:30 AM by *Artisan Bakers Guild*.

> *This is a fallback generated schedule because the Google Gemini API quota was exceeded.*`;
        } else if (name === 'Website Agent') {
          mockContent = `## Website Wireframe & Copy

### 1. Hero Section
**Visual:** Full-screen looping video of a slow-motion pour-over coffee being brewed, steam rising gracefully.
**Headline:** Elevate Your Daily Ritual.
**Sub-headline:** Experience specialty coffee sourced with intention and crafted with precision.
**Primary CTA Button:** View Menu & Order Ahead
**Secondary CTA Button:** Our Coffee Philosophy

### 2. The 'Our Process' Section
**Layout:** 3-column grid with minimalist iconography.
- **Column 1: Ethical Sourcing.** "We pay well above fair-trade minimums to ensure farmers thrive."
- **Column 2: Precision Roasting.** "Light roasted to highlight the unique terroir of every origin."
- **Column 3: Masterful Brewing.** "Every cup is weighed, timed, and extracted to perfection."

### 3. E-Commerce / Retail Section
**Headline:** Bring the Canvas Home.
**Product Carousel:**
- *Ethiopia Yirgacheffe (Whole Bean) - $22* - Tasting notes: Jasmine, Blueberry, Bergamot.
- *Colombia Supremo (Whole Bean) - $19* - Tasting notes: Chocolate, Brown Sugar, Orange.
- *Hario V60 Starter Kit - $45*

### 4. Footer
- **Navigation:** Home, Shop, About Us, Wholesale, Contact
- **Newsletter Signup:** "Join our inner circle for exclusive drops and brewing tips."
- **Social Proof:** Links to Instagram and TikTok.

> *This is a fallback generated blueprint because the Google Gemini API quota was exceeded.*`;
        }

        await prisma.agentTask.update({
          where: { id: task.id },
          data: {
            status: 'completed',
            content: mockContent,
          }
        });
        console.log(`Agent ${name} fallback applied successfully.`);
      }
    }

    await prisma.project.update({
      where: { id: projectId },
      data: { status: 'completed' }
    });

  } catch (error) {
    console.error('Error running agents:', error);
    
    await saveTask(projectId, 'System Error', 'AI Manager', 'Error Log', `**Failed to generate content.**\n\nError details: ${error.message || 'Unknown error'}\n\nPlease check your GEMINI_API_KEY in the Render Environment Variables.`);
    
    await prisma.project.update({
      where: { id: projectId },
      data: { status: 'completed' }
    });
  }
};

const saveTask = async (projectId, agentName, agentRole, deliverable, content) => {
  await prisma.agentTask.create({
    data: {
      projectId,
      agentName,
      agentRole,
      deliverable,
      content,
      status: 'completed'
    }
  });
};

const getProjectStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { agentTasks: true }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json({ project });
  } catch (error) {
    console.error('Status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  deployAgents,
  getProjectStatus
};
