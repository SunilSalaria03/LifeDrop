Prompt for build ---

Read all /docs files before starting:
skills.md, rules.md, architecture.md

Task:
Create a modern, clean, responsive landing page for LifeDrop (blood donation platform).

Design Reference:
Take inspiration from Pixabay landing page:
- Large hero section
- Centered heading + search bar
- Soft background (image/gradient)
- Minimal and clean UI
- Rounded search bar
- Category chips/tags style

Tech Stack:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui

----------------------------------------

🎯 Goal:
Landing page where users can:
1. Quickly choose action:
   - Donate Blood
   - Request Blood
2. Search available donors/requesters by city
3. Understand platform purpose
4. Navigate easily

----------------------------------------

🧩 Page Structure:

1. HEADER
- Logo: LifeDrop
- Right side:
  - Login button
  - Join button (primary)
- Sticky header
- Clean minimal design

----------------------------------------

2. HERO SECTION (Pixabay style)

- Full width section
- Background:
  - Soft gradient OR blurred medical/blood theme image
- Center content:

Heading:
"Find Blood Donors Near You. Save Lives Faster."

Subtext:
"Connect with nearby donors or request blood instantly in emergency situations."

Search Bar (main focus):
- Rounded full-width input
- Placeholder: "Search by city or pincode"
- Search button inside input

Below search:
- Quick chips/tags:
  - Delhi
  - Mumbai
  - Bangalore
  - O+
  - A+
  - Emergency

CTA Buttons:
- Primary: "Request Blood" (red theme)
- Secondary: "Join as a Donor" (green theme)

----------------------------------------

3. ACTION CARDS SECTION

Two main cards:

Card 1:
"Request Blood"
- Short description
- Icon (alert/emergency)
- Button

Card 2:
"Donate Blood"
- Short description
- Icon (heart/donation)
- Button

Design:
- Grid (2 columns desktop, 1 mobile)
- Soft shadow
- Hover effect

----------------------------------------

4. SEARCH RESULTS PREVIEW SECTION

Title:
"Available Donors Near You"

- Card list/grid:
  Each card:
  - Name
  - Blood Group
  - Distance
  - Availability badge (Available / Not Available)
  - Button: View Profile

(Use backend donor search data from MongoDB only)

----------------------------------------

5. HOW IT WORKS

3 steps:

1. Search donors
2. Contact / request
3. Save lives

Use icons + clean layout

----------------------------------------

6. TRUST / IMPACT SECTION

- "Helping thousands of lives"
- Stats:
  - Donors registered
  - Requests fulfilled
  - Cities covered

----------------------------------------

7. FOOTER

Include:
- Logo + short description
- Links:
  - About
  - Contact
  - Privacy Policy
- Social icons
- Copyright

----------------------------------------

🎨 DESIGN RULES:

- Use Tailwind properly (no inline styles)
- Use shadcn/ui components where possible
- Keep spacing consistent
- Use rounded-xl or 2xl for modern look
- Use subtle shadows
- Responsive design (mobile-first)

Color Theme:
- Primary: Blue (#2563EB)
- Success: Green (#27AE60)
- Danger: Red (#E74C3C)

----------------------------------------

⚙️ FUNCTIONAL RULES:

- Search input should update state
- Buttons should route:
  /request-blood
  /become-donor
- Use Next.js router
- Keep components reusable

----------------------------------------

📁 FILE STRUCTURE:

src/app/page.tsx

src/components/
  layout/Header.tsx
  layout/Footer.tsx
  landing/HeroSection.tsx
  landing/ActionCards.tsx
  landing/DonorList.tsx
  landing/HowItWorks.tsx
  landing/StatsSection.tsx

----------------------------------------

🚫 IMPORTANT:

- Do not overcomplicate UI
- Do not use heavy animations
- Do not add unnecessary libraries
- Do not hardcode API URLs
- Keep code clean and modular

----------------------------------------

📄 AFTER COMPLETION:

- Ensure page builds successfully
- Ensure no TypeScript errors
- Ensure responsive layout works
- Update feature-status.md
- Add changelog entry



Pro tip (very important)

After generating this, next prompt:   
 - Improve UI spacing, typography, and visual hierarchy to match modern SaaS landing pages like Stripe or Airbnb while keeping current structure.



 Prompt for Hero Section (Advanced Functional):-

 Read all /docs files before starting:
skills.md, rules.md, architecture.md

Task:
Build a production-ready Hero Section for LifeDrop landing page with real functionality:
- Location detection
- Blood group + state + city filter
- Donor search
- Donor list preview

Tech Stack:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Axios

----------------------------------------

🎯 FEATURES REQUIRED:

1. Detect User Location (Auto + Manual)
2. Filter by:
   - Blood Group
   - State
   - City/District
3. Search Button:
   - "Find Donors"
   - "Search Donors"
4. Show donor list below search

----------------------------------------

🧩 HERO SECTION STRUCTURE:

1. HEADER INTEGRATION

- Show user location in header:
  Example:
  📍 Chandigarh, Punjab

- On first visit:
  Ask for location permission using browser API

- If allowed:
  Use navigator.geolocation
  Convert lat/lng through a backend reverse-geocoding API when configured

- If denied:
  Show:
  "Select Location manually"

----------------------------------------

2. HERO CONTENT

Heading:
"Search donors by blood group and location across your city"

Subtext:
"Filter by blood group and location, then contact donors who appear in search."

----------------------------------------

3. FILTER SEARCH BAR (MAIN UI)

Design:
- Horizontal bar (Pixabay style but functional)
- Rounded container
- Responsive

Fields:

1. Blood Group Dropdown
Options:
A+, A-, B+, B-, AB+, AB-, O+, O-

2. State Dropdown
- Static list for now (India states)

3. City/District Dropdown
- Depends on selected state
- Use backend donor search data from MongoDB only

4. Buttons:
- Primary: "Find Donors"
- Secondary: "Search Donors"

----------------------------------------

⚙️ BEHAVIOR:

On click "Find Donors":

- Validate:
  - bloodGroup required
  - state required
  - city required

- Call API:
GET /api/v1/donors/search

Query:
?bloodGroup=O+&state=Punjab&city=Chandigarh

- Store results in state

----------------------------------------

4. DONOR LIST (Below Search)

Title:
"Available Donors"

UI:
- Grid (3 columns desktop, 1 mobile)

Each Card:
- Name
- Blood Group (badge)
- Distance from backend geo search
- Availability (green/red badge)
- Button: View Profile

----------------------------------------

📁 COMPONENT STRUCTURE:

src/components/landing/
  HeroSection.tsx
  LocationSelector.tsx
  BloodGroupDropdown.tsx
  StateDropdown.tsx
  CityDropdown.tsx
  DonorList.tsx
  DonorCard.tsx

----------------------------------------

🧠 STATE MANAGEMENT:

Use:
- useState for filters
- TanStack Query for API

Example state:

{
  bloodGroup: "",
  state: "",
  city: "",
  location: {
    lat: null,
    lng: null
  }
}

----------------------------------------

🌍 LOCATION LOGIC:

On mount:

if (navigator.geolocation) {
  request permission
  get lat/lng
  set location
  show in header
}

Fallback:
Manual dropdown selection

----------------------------------------

🎨 UI RULES:

- Use shadcn Select for dropdowns
- Use Card for donor list
- Use Badge for blood group and availability
- Use Button variants:
  - red for "Search Donors"
  - blue for "Find Donors"

- Proper spacing
- Mobile responsive
- Clean modern design

----------------------------------------

🚫 IMPORTANT:

- Do not hardcode API URL
- Use NEXT_PUBLIC_API_BASE_URL
- Do not mix UI and API logic
- Keep components reusable
- No console.logs
- No unused code

----------------------------------------

📄 MOCK DATA (if API not ready):

Return 6 donors with:
- name
- bloodGroup
- city
- isAvailable
- distance

----------------------------------------

📄 AFTER IMPLEMENTATION:

- Ensure no TypeScript errors
- Ensure UI responsive
- Ensure dropdowns working
- Ensure API integration clean
- Update:
  - skills.md (add search feature)
  - feature-status.md
  - changelog.md
