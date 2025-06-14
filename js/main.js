// Function to load text content from files
async function loadTextContent() {
    try {
        // Load hero section content
        const heroResponse = await fetch('data/hero.txt');
        const heroData = await heroResponse.text();
        const [name, title] = heroData.split('\n');
        document.getElementById('hero-name').textContent = name;
        document.getElementById('hero-title').textContent = title;

        // Load about section content
        const aboutResponse = await fetch('data/about.txt');
        const aboutContent = await aboutResponse.text();
        document.getElementById('about-content').innerHTML = aboutContent;

        // Load skills content
        const skillsResponse = await fetch('data/skills.txt');
        const skillsContent = await skillsResponse.text();
        document.getElementById('skills-content').innerHTML = skillsContent;

        // Load contact details
        const contactResponse = await fetch('data/contact.txt');
        const contactContent = await contactResponse.text();
        document.getElementById('contact-details').innerHTML = contactContent.replace(/\n/g, '<br>');

        // Load social links
        const socialResponse = await fetch('data/social.txt');
        const socialContent = await socialResponse.text();
        const socialLinks = socialContent.split('\n').filter(link => link.trim());
        const socialLinksContainer = document.getElementById('social-links');
        socialLinks.forEach(link => {
            const [platform, url] = link.split('|');
            const icon = getSocialIcon(platform.trim());
            const a = document.createElement('a');
            a.href = url.trim();
            a.target = '_blank';
            a.innerHTML = `<i class="${icon}"></i>`;
            socialLinksContainer.appendChild(a);
        });

        // Load footer text
        const footerResponse = await fetch('data/footer.txt');
        const footerText = await footerResponse.text();
        document.getElementById('footer-text').textContent = footerText;

    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Function to get social media icon class
function getSocialIcon(platform) {
    const icons = {
        'github': 'fab fa-github',
        'linkedin': 'fab fa-linkedin',
        'twitter': 'fab fa-twitter',
        'instagram': 'fab fa-instagram',
        'facebook': 'fab fa-facebook',
        'youtube': 'fab fa-youtube',
        'tiktok': 'fab fa-tiktok',
        'twitch': 'fab fa-twitch',
        'discord': 'fab fa-discord',
        'telegram': 'fab fa-telegram',
        'reddit': 'fab fa-reddit',
        'pinterest': 'fab fa-pinterest',
        'snapchat': 'fab fa-snapchat',
        'whatsapp': 'fab fa-whatsapp',
        'spotify': 'fab fa-spotify',
        'apple': 'fab fa-apple',
        'google': 'fab fa-google',
        'microsoft': 'fab fa-microsoft',
        'amazon': 'fab fa-amazon',
        'apple': 'fab fa-apple',
        
    };
    return icons[platform.toLowerCase()] || 'fas fa-link';
}

// Import GitHub repository information from data/blog-data.js
import { repoOwner, repoName, blogBasePath } from '../data/blog-data.js';

// Function to load and display featured blog posts from GitHub
async function loadBlogs() {
    try {
        const blogsContainer = document.getElementById('blogs-container');
        
        // First try to load from the GitHub API
        try {
            // GitHub API URL to fetch repository contents
            const githubApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${blogBasePath}`;
            const response = await fetch(githubApiUrl);
            
            if (response.ok) {
                const contents = await response.json();
                
                // Filter out directories and special files
                const files = contents.filter(item => 
                    item.type === 'file' && 
                    item.name !== 'index.json' && 
                    item.name !== 'index.html'
                );
                
                // Display only up to 3 featured files on the homepage
                const featuredFiles = files.slice(0, 3);
                
                if (featuredFiles.length > 0) {
                    featuredFiles.forEach(file => {
                        const blogCard = document.createElement('div');
                        blogCard.className = 'blog-card file-card-style fade-in';
                        
                        const fileExtension = file.name.split('.').pop().toLowerCase();
                        const fileIcon = getFileIcon(fileExtension);
                        
                        // Format file name for display
                        const formattedName = file.name.split('.').slice(0, -1).join('.').replace(/_/g, ' ');
                        
                        // Generate a GitHub Pages URL for the file
                        // Format: https://username.github.io/repo-name/blogs/file-path
                        const githubPagesUrl = `https://${repoOwner}.github.io/${repoName}/${blogBasePath}/${file.name}`;
                        
                        blogCard.innerHTML = `
                            <div class="blog-content">
                                <div class="file-icon">
                                    <i class="${fileIcon}"></i>
                                </div>
                                <h3>${formattedName}</h3>
                                <p class="blog-date">GitHub Repository</p>
                                <p>Click to read the full content</p>
                                <a href="${githubPagesUrl}" class="btn primary" target="_blank">Read More</a>
                            </div>
                        `;
                        
                        blogsContainer.appendChild(blogCard);
                    });
                    
                    // Add a "View All Blogs" button
                    addViewAllButton(blogsContainer);
                    return; // Exit if GitHub API method succeeded
                }
            }
        } catch (apiError) {
            console.error('Error loading from GitHub API:', apiError);
            // Continue to legacy method if API fails
        }
        
        // Try to load from local directory if GitHub API fails
        try {
            // Get list of PDF files in the blogs directory
            const localFiles = [
                { name: 'Lp_spaces.pdf', title: 'Lp Spaces', date: 'Mathematics' },
                { name: '3_manifold.pdf', title: '3-Manifold Theory', date: 'Topology' },
                { name: 'Why_Homomorphism_Invocked__.pdf', title: 'Why Homomorphism Invocked', date: 'Algebra' }
            ];
            
            // Display only up to 3 featured files
            const featuredLocalFiles = localFiles.slice(0, 3);
            
            featuredLocalFiles.forEach(file => {
                const blogCard = document.createElement('div');
                blogCard.className = 'blog-card file-card-style fade-in';
                
                const fileExtension = file.name.split('.').pop().toLowerCase();
                const fileIcon = getFileIcon(fileExtension);
                
                // Local file URL
                const fileUrl = `blogs/${file.name}`;
                
                blogCard.innerHTML = `
                    <div class="blog-content">
                        <div class="file-icon">
                            <i class="${fileIcon}"></i>
                        </div>
                        <h3>${file.title}</h3>
                        <p class="blog-date">${file.date}</p>
                        <p>Click to read the full content</p>
                        <a href="${fileUrl}" class="btn primary" target="_blank">Read More</a>
                    </div>
                `;
                
                blogsContainer.appendChild(blogCard);
            });
            
            // Add a "View All Blogs" button
            addViewAllButton(blogsContainer);
            return; // Exit if local files method succeeded
        } catch (localError) {
            console.error('Error loading local files:', localError);
            // Continue to legacy method if local files method fails
        }
        
        // Fallback to legacy method if both GitHub API and local files methods fail
        const legacyIndexUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${blogBasePath}/index.html`;
        const response = await fetch(legacyIndexUrl);
        const text = await response.text();
        
        // Extract the JSON data from the div
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const blogListDiv = doc.getElementById('blog-list');
        
        if (!blogListDiv) {
            throw new Error('Blog list not found in legacy index.html');
        }
        
        const blogs = JSON.parse(blogListDiv.textContent);

        // Display only up to 3 featured blogs on the homepage
        const featuredBlogs = blogs.slice(0, 3);
        
        featuredBlogs.forEach(blog => {
            const blogCard = document.createElement('div');
            blogCard.className = 'blog-card fade-in';
            
            const fileExtension = blog.file.split('.').pop().toLowerCase();
            const fileIcon = getFileIcon(fileExtension);
            
            // Generate a GitHub Pages URL for the file
            // Format: https://username.github.io/repo-name/blogs/file-path
            const githubPagesUrl = `https://${repoOwner}.github.io/${repoName}/${blogBasePath}/${blog.file}`;
            
            blogCard.innerHTML = `
                <div class="blog-content">
                    <div class="file-icon">
                        <i class="${fileIcon}"></i>
                    </div>
                    <h3>${blog.title}</h3>
                    <p class="blog-date">${blog.date}</p>
                    <p>Click to read the full blog post</p>
                    <a href="${githubPagesUrl}" class="btn primary" target="_blank">Read More</a>
                </div>
            `;
            
            blogsContainer.appendChild(blogCard);
        });
        
        // Add a "View All Blogs" button
        addViewAllButton(blogsContainer);
        
    } catch (error) {
        console.error('Error loading blogs:', error);
        const blogsContainer = document.getElementById('blogs-container');
        blogsContainer.innerHTML = `<p class="error-message">Failed to load blog posts. Error: ${error.message}</p>`;
    }
}

// Helper function to add the "View All Blogs" button
function addViewAllButton(container) {
    const viewAllCard = document.createElement('div');
    viewAllCard.className = 'blog-card view-all-card fade-in';
    viewAllCard.innerHTML = `
        <div class="blog-content view-all-content">
            <div class="file-icon">
                <i class="fas fa-book"></i>
            </div>
            <h3>View All Blogs</h3>
            <p>Explore all my blogs and articles</p>
            <a href="blogs.html" class="btn secondary">Browse All</a>
        </div>
    `;
    container.appendChild(viewAllCard);
}

// Helper function to get appropriate icon for file type
function getFileIcon(extension) {
    const icons = {
        'pdf': 'fas fa-file-pdf',
        'txt': 'fas fa-file-alt',
        'doc': 'fas fa-file-word',
        'docx': 'fas fa-file-word',
        'xls': 'fas fa-file-excel',
        'xlsx': 'fas fa-file-excel',
        'ppt': 'fas fa-file-powerpoint',
        'pptx': 'fas fa-file-powerpoint',
        'jpg': 'fas fa-file-image',
        'jpeg': 'fas fa-file-image',
        'png': 'fas fa-file-image',
        'gif': 'fas fa-file-image',
        'mp3': 'fas fa-file-audio',
        'wav': 'fas fa-file-audio',
        'mp4': 'fas fa-file-video',
        'mov': 'fas fa-file-video',
        'zip': 'fas fa-file-archive',
        'rar': 'fas fa-file-archive',
        'html': 'fas fa-file-code',
        'css': 'fas fa-file-code',
        'js': 'fas fa-file-code',
        'json': 'fas fa-file-code',
        'md': 'fas fa-file-code'
    };
    
    return icons[extension] || 'fas fa-file';
}

// Function to handle scroll animations
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';
        observer.observe(element);
    });
}

// Theme switching functionality
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or default to light theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadTextContent();
    loadBlogs();
    handleScrollAnimations();
    initTheme();
});