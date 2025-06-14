# Professional Portfolio Website Template

A modern, responsive portfolio website template that can be easily customized through text files. Perfect for hosting on GitHub Pages!

## Features

- 🎨 Modern and clean design
- 📱 Fully responsive layout
- ⚡ Fast loading and smooth animations
- 📝 Easy content management through text files
- 📚 Dynamic blog system with folder navigation using GitHub API
- 📂 Support for multiple file types and folder organization
- 🤖 Direct content loading from GitHub repository
- 🔗 Social media integration
- 🎯 SEO friendly
- 🌓 Dark/light theme toggle

## Getting Started

1. Clone this repository
2. Replace the content in the `data` folder with your personal information:
   - `hero.txt`: Your name and title (one per line)
   - `about.txt`: Your personal description
   - `skills.txt`: Your skills and expertise
   - `contact.txt`: Your contact information
   - `social.txt`: Your social media links (format: platform|url)
   - `footer.txt`: Your footer text

3. Add your profile picture:
   - Place your profile picture in the `data` folder
   - Name it `profile.jpg`

4. Add your blog posts:
   - Create a `blogs` folder in the root directory of your GitHub repository
   - Add your PDF blog posts or other files to this folder
   - Create subfolders to organize your content
   - The website will automatically fetch and display them using the GitHub API

5. Deploy to GitHub Pages:
   - Push your repository to GitHub
   - Go to repository Settings > Pages
   - Select the main branch as the source
   - Your portfolio will be live at `https://yourusername.github.io/repository-name`

## Customization

### Colors
You can customize the website's color scheme by modifying the CSS variables in `css/style.css`:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    --text-color: #1f2937;
    --light-text: #6b7280;
    --background: #ffffff;
    --section-bg: #f3f4f6;
}
```

### Layout
The layout can be modified by editing the CSS in `css/style.css`. The website uses CSS Grid and Flexbox for layout management.

### Animations
Scroll animations are handled by the `handleScrollAnimations()` function in `js/main.js`. You can modify the animation parameters or add new animations as needed.

## Enhanced Blog System

### Overview
The portfolio includes a dedicated blog page (`blogs.html`) that dynamically displays all content from the `blogs` directory in your GitHub repository. The system supports both files and folders, allowing for organized content management.

### Features
- **Folder Navigation**: Browse through nested folder structures
- **File Type Detection**: Automatic icon assignment based on file type
- **Breadcrumb Navigation**: Easy navigation back to parent folders
- **Responsive Design**: Works on all devices
- **GitHub API Integration**: Direct content loading from your GitHub repository

### Supported File Types
The system automatically detects and displays appropriate icons for various file types including:
- PDF documents
- Text files
- Word documents
- Excel spreadsheets
- PowerPoint presentations
- Images (JPG, PNG, GIF)
- Audio files
- Video files
- Code files (HTML, CSS, JS, etc.)

### How It Works
1. Files and folders placed in the `blogs` directory of your GitHub repository are automatically detected
2. The GitHub API is used to fetch directory contents and file information
3. The blog page dynamically displays content with proper navigation
4. Users can browse through folders and view files with a clean, consistent interface
5. Files are served directly from GitHub's raw content servers

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the LICENSE file for details.