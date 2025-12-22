# Yasamin Soraghi - Portfolio Website

A complete multi-page portfolio website built with HTML, CSS, and vanilla JavaScript. No build tools or frameworks required - just open and run!

## 🚀 Quick Start

### Running the Site

1. **Using Live Server (Recommended)**
   - Install the "Live Server" extension in VS Code
   - Right-click on `index.html` and select "Open with Live Server"
   - The site will automatically open in your browser at `http://localhost:5500`

2. **Using Python (Alternative)**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Then open http://localhost:8000 in your browser
   ```

3. **Using Node.js (Alternative)**
   ```bash
   npx http-server
   
   # Then open the URL shown in the terminal
   ```

4. **Direct File Opening**
   - Simply open `index.html` in your browser
   - Note: Some features (like loading projects.json) may not work due to CORS restrictions when opening files directly

## 📁 Project Structure

```
Yasamin/
├── index.html              # Home page
├── work.html               # Projects hub
├── frontend.html           # Frontend development page
├── backend.html            # Backend development page
├── wordpress.html          # WordPress development page
├── motion.html             # Motion graphics page
├── about.html              # About page
├── contact.html            # Contact page
├── assets/
│   ├── css/
│   │   └── styles.css      # Main stylesheet
│   └── js/
│       ├── main.js         # Shared JavaScript functionality
│       └── projects.js      # Projects filtering and display
├── data/
│   └── projects.json       # Projects data file
└── README.md               # This file
```

## 🎨 Features

- **Dark Blue Theme**: Professional, modern design with CSS variables
- **Fully Responsive**: Works on desktop, tablet, and mobile devices
- **Smooth Animations**: Scroll reveal, hover effects, and transitions
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- **Reduced Motion Support**: Respects user preferences for reduced motion
- **Multi-page Navigation**: Shared header and footer across all pages
- **Project Filtering**: Filter projects by category (Frontend, Backend, WordPress, Motion)
- **Search Functionality**: Search projects by title, description, or tags
- **No Build Tools**: Pure HTML, CSS, and JavaScript - no compilation needed

## 📝 Adding Projects

To add new projects, edit `data/projects.json`. Each project should follow this structure:

```json
{
  "id": 11,
  "title": "Project Title",
  "description": "Project description here",
  "category": "frontend",
  "tags": ["HTML", "CSS", "JavaScript"],
  "thumbnail": "project-name",
  "live": "https://example.com",
  "github": "https://github.com/username/repo",
  "youtube": "https://www.youtube.com/watch?v=...",
  "caseStudy": "Detailed case study text here"
}
```

### Project Fields

- **id**: Unique number identifier
- **title**: Project title
- **description**: Brief project description
- **category**: One of `frontend`, `backend`, `wordpress`, or `motion`
- **tags**: Array of technology tags
- **thumbnail**: Thumbnail identifier (currently using emoji placeholders)
- **live**: (Optional) URL to live project
- **github**: (Optional) URL to GitHub repository
- **youtube**: (Optional) YouTube video URL (for motion projects)
- **caseStudy**: (Optional) Detailed case study text

### Categories

- `frontend`: Frontend development projects
- `backend`: Backend development projects
- `wordpress`: WordPress themes and plugins
- `motion`: Motion graphics and animations

## 🎯 Pages Overview

### Home (`index.html`)
- Hero section with introduction
- Skills spotlight with clickable tiles
- Featured work section with filters
- Toolkit section
- About preview
- Contact CTA

### Work (`work.html`)
- All projects displayed in a grid
- Category filters
- Search functionality
- Project cards with links to live demos, GitHub, and case studies

### Field Pages (`frontend.html`, `backend.html`, `wordpress.html`, `motion.html`)
- Field-specific hero and description
- "My approach" section
- Skills list
- Filtered projects for that field
- FAQ section

### About (`about.html`)
- Detailed biography
- Journey and approach
- Skills overview
- Contact links

### Contact (`contact.html`)
- Contact form (opens email client)
- Direct contact information
- Links to GitHub, Telegram, and Email

## 🎨 Customization

### Colors

All colors are defined as CSS variables in `assets/css/styles.css`:

```css
:root {
  --bg: #070B14;
  --surface: #0B1224;
  --surface2: #0F1A33;
  --primary: #2D6BFF;
  --glow: #4DA3FF;
  --accent: #20D3FF;
  --text: #EAF0FF;
  --text2: #A9B6D3;
  --border: #1A2A52;
}
```

Change these values to customize the color scheme.

### Animations

Animations are controlled in `assets/css/styles.css`. To disable all animations, add:

```css
* {
  animation: none !important;
  transition: none !important;
}
```

The site already respects `prefers-reduced-motion` media query.

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Uses modern CSS features (Grid, Flexbox, CSS Variables) and ES6+ JavaScript.

## 📱 Responsive Breakpoints

- Desktop: 1200px+ (default)
- Tablet: 768px - 1199px
- Mobile: < 768px

## 🐛 Troubleshooting

### Projects not loading
- Make sure you're using a local server (Live Server, Python http.server, etc.)
- Check browser console for errors
- Verify `data/projects.json` is valid JSON

### Styles not applying
- Check that `assets/css/styles.css` path is correct
- Clear browser cache
- Check browser console for 404 errors

### Navigation not working
- Ensure all HTML files are in the root directory
- Check that file names match exactly (case-sensitive)

## 📄 License

This portfolio website is personal property. Feel free to use it as inspiration for your own portfolio!

## 👤 Contact

- **GitHub**: [Yasamin-E84](https://github.com/Yasamin-E84)
- **Telegram**: [@yasamin_e84](https://t.me/yasamin_e84)
- **Email**: fatemeh.s8424@gmail.com

---

Built with ❤️ using vanilla HTML, CSS, and JavaScript.

