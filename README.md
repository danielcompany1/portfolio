# Daniel’s portfolio

A responsive, dark-first static portfolio for Daniel, a website developer and AI automation engineer based in Nigeria. It uses HTML, Tailwind CSS via its CDN, custom CSS and vanilla JavaScript. There is no build step or server-side runtime.

## Run locally

Open index.html in a browser, or serve the folder locally for behavior closer to shared hosting:

    cd portfolio
    python3 -m http.server 8000

Then visit http://localhost:8000.

The custom stylesheet provides the full visual design. Tailwind CSS and Manrope/DM Mono fonts are loaded from external CDNs, so those resources need an internet connection. System font fallbacks keep text readable if a font service is unavailable.

## Personal information

- Update Daniel’s name, role, location and bio in the page HTML files.
- Replace assets/images/profile-placeholder.svg with a real portrait and update its image paths if the filename changes.
- Update page titles, descriptions, canonical URLs, Open Graph URLs and sitemap.xml with the final domain. Also change the sitemap URL in robots.txt.
- The portfolio currently uses the first name Daniel and the email danielcompany176@gmail.com.

## Projects

The Student Directory is the first demo project; its screenshot is stored in `assets/projects/student-directory/screenshot.png`, and its demo link points to the local development URL `http://127.0.0.1:3000/`. The remaining project cards are illustrative concepts.

To add a real project, copy a project-card article in projects.html, give it a unique id, update data-project-category to web, ai, automation or backend, and replace the title, summary, tags, artwork and links. Store project screenshots under `assets/projects/<project-name>/`. The home page has three separate featured cards in index.html; update those as well. The project filters in js/script.js use the category data attribute.

## Contact form

The form in contact.html uses native browser validation. Until an endpoint is configured, submitting it opens an email draft addressed to Daniel.

In js/script.js, replace the CONTACT_ENDPOINT value with an HTTPS webhook URL. The form sends a JSON POST with these fields:

- fullName
- email
- phone
- projectType
- budget
- message

Configure the receiving service for cross-origin requests from the portfolio domain. Do not put API keys, tokens or other secrets in the frontend.

## Social links and CV

Replace the GitHub, LinkedIn, X and Instagram homepage URLs in the footer on each page with Daniel’s real profile URLs. Replace the corresponding profile links in contact.html. Add a real WhatsApp link and number there if desired.

No CV file is included. Add a real PDF as assets/resume/cv.pdf before creating a download link. The current CV action opens an email request instead.

## Optional statistics and placeholders

The experience timeline and testimonials in about.html are explicitly marked placeholders; replace them with verified information and publish testimonials only with permission. The stats section stays hidden until real positive values are entered in portfolioStats in js/script.js.

The journal entries in blog.html are draft outlines. Edit them, add real dates and remove the draft notices before presenting them as published articles.

## Deploy to cPanel / shared hosting

1. Set the final domain in canonical and social metadata, sitemap.xml and robots.txt.
2. Replace the profile and social placeholders, review the concept and draft labels, and configure the form endpoint if needed.
3. In cPanel File Manager, open public_html (or the chosen subdirectory) and upload the contents of this portfolio folder, keeping the folder structure intact.
4. Confirm that index.html is in the published directory and visit the domain over HTTPS.
5. Check the pages, contact form, mobile navigation and external profile links on the live domain.
