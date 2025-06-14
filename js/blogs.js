// Global variables to track current path and GitHub repository info
let currentPath = '';
let blogData = [];

// Import GitHub repository information from data/blog-data.js
import { repoOwner, repoName, blogBasePath } from '../data/blog-data.js';

// Function to initialize the blogs page
async function initBlogsPage() {
    // Show loading spinner
    document.getElementById('loading-spinner').style.display = 'flex';
    
    // Get the folder path from URL if any
    const urlParams = new URLSearchParams(window.location.search);
    const folderPath = urlParams.get('folder') || '';
    currentPath = folderPath;
    
    // Update breadcrumb
    updateBreadcrumb(folderPath);
    
    // Load blog content using GitHub API
    await loadBlogContentFromGitHub(folderPath);
    
    // Hide loading spinner
    document.getElementById('loading-spinner').style.display = 'none';
    
    // Add scroll animations
    handleScrollAnimations();
}

// Function to update breadcrumb navigation
function updateBreadcrumb(path) {
    const breadcrumb = document.getElementById('blog-breadcrumb');
    const currentFolder = document.getElementById('current-folder');
    
    if (!path) {
        // We're at the root blogs directory
        currentFolder.textContent = '';
        return;
    }
    
    // Split the path into segments
    const segments = path.split('/');
    
    // Clear previous breadcrumb segments (except the first 'Blogs' link)
    while (breadcrumb.children.length > 1) {
        breadcrumb.removeChild(breadcrumb.lastChild);
    }
    
    // Build the breadcrumb trail
    let currentSegmentPath = '';
    
    segments.forEach((segment, index) => {
        if (segment) {
            // Add separator
            const separator = document.createElement('span');
            separator.className = 'breadcrumb-separator';
            separator.textContent = ' / ';
            breadcrumb.appendChild(separator);
            
            // Add folder segment
            currentSegmentPath += (currentSegmentPath ? '/' : '') + segment;
            
            if (index === segments.length - 1) {
                // Last segment (current folder)
                const current = document.createElement('span');
                current.className = 'current-segment';
                current.textContent = segment;
                breadcrumb.appendChild(current);
            } else {
                // Parent folder (clickable)
                const link = document.createElement('a');
                link.href = `blogs.html?folder=${encodeURIComponent(currentSegmentPath)}`;
                link.textContent = segment;
                breadcrumb.appendChild(link);
            }
        }
    });
}

// Function to load blog content from GitHub API
async function loadBlogContentFromGitHub(folderPath) {
    try {
        const blogsContainer = document.getElementById('blogs-container');
        blogsContainer.innerHTML = ''; // Clear previous content
        
        // Construct the API path for the GitHub contents API
        const apiPath = folderPath 
            ? `${blogBasePath}/${folderPath}` 
            : blogBasePath;
        
        // GitHub API URL to fetch repository contents
        const githubApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${apiPath}`;
        
        // Fetch directory contents from GitHub API
        const response = await fetch(githubApiUrl);
        
        if (!response.ok) {
            // Fallback to the old method for backward compatibility
            if (!folderPath) {
                await loadLegacyBlogs();
                return;
            }
            
            blogsContainer.innerHTML = `
                <div class="error-message">
                    <p>Unable to load content for this folder. GitHub API returned: ${response.status} ${response.statusText}</p>
                    <a href="blogs.html" class="btn primary">Back to Blogs</a>
                </div>
            `;
            return;
        }
        
        const contents = await response.json();
        
        // Separate folders and files
        const folders = contents.filter(item => item.type === 'dir');
        const files = contents.filter(item => item.type === 'file' && item.name !== 'index.json' && item.name !== 'index.html');
        
        // Store the data for potential later use
        blogData = { folders: folders.map(f => f.name), files };
        
        // Display folders if any
        if (folders.length > 0) {
            const foldersSection = document.createElement('div');
            foldersSection.className = 'folders-section';
            
            const foldersTitle = document.createElement('h2');
            foldersTitle.textContent = 'Folders';
            foldersTitle.setAttribute('data-icon', '📁');
            foldersSection.appendChild(foldersTitle);
            
            const foldersGrid = document.createElement('div');
            foldersGrid.className = 'folders-grid';
            
            folders.forEach(folder => {
                const folderCard = document.createElement('div');
                folderCard.className = 'folder-card fade-in';
                
                const folderPath = currentPath ? `${currentPath}/${folder.name}` : folder.name;
                
                folderCard.innerHTML = `
                    <div class="folder-icon">
                        <i class="fas fa-folder"></i>
                    </div>
                    <div class="folder-content">
                        <h3>${folder.name}</h3>
                        <a href="blogs.html?folder=${encodeURIComponent(folderPath)}" class="btn secondary">Open Folder</a>
                    </div>
                `;
                
                foldersGrid.appendChild(folderCard);
            });
            
            foldersSection.appendChild(foldersGrid);
            blogsContainer.appendChild(foldersSection);
        }
        
        // Display files if any
        if (files.length > 0) {
            const filesSection = document.createElement('div');
            filesSection.className = 'files-section';
            
            const filesTitle = document.createElement('h2');
            filesTitle.textContent = 'Files';
            filesTitle.setAttribute('data-icon', '📄');
            filesSection.appendChild(filesTitle);
            
            const filesGrid = document.createElement('div');
            filesGrid.className = 'blogs-grid';
            
            // Get file metadata and create cards
            files.forEach(file => {
                const blogCard = document.createElement('div');
                blogCard.className = 'blog-card file-card-style fade-in';
                
                const filePath = currentPath ? `${currentPath}/${file.name}` : file.name;
                const fileExtension = getFileExtension(file.name);
                const fileIcon = getFileIcon(fileExtension);
                
                // Format the date from the GitHub API (if available)
                // Note: GitHub API doesn't provide last modified date in the contents API
                // We'll use the current date as a fallback
                const fileDate = new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                // Generate a GitHub Pages URL for the file
                // Format: https://username.github.io/repo-name/blogs/file-path
                const githubPagesUrl = `https://${repoOwner}.github.io/${repoName}/${blogBasePath}/${filePath}`;
                
                // Generate a description based on the file name
                const description = `Click to view ${formatFileName(file.name)}`;
                
                blogCard.innerHTML = `
                    <div class="blog-content">
                        <div class="file-icon">
                            <i class="${fileIcon}"></i>
                        </div>
                        <h3>${formatFileName(file.name)}</h3>
                        <p class="blog-date">${fileDate}</p>
                        <p>${description}</p>
                        <a href="${githubPagesUrl}" class="btn primary" target="_blank">Open File</a>
                    </div>
                `;
                
                filesGrid.appendChild(blogCard);
            });
            
            filesSection.appendChild(filesGrid);
            blogsContainer.appendChild(filesSection);
        }
        
        // If no content found
        if (folders.length === 0 && files.length === 0) {
            blogsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <p>No content found in this folder.</p>
                    ${currentPath ? `<a href="blogs.html" class="btn primary">Back to Blogs</a>` : ''}
                </div>
            `;
        }
        
    } catch (error) {
        console.error('Error loading blog content from GitHub:', error);
        const blogsContainer = document.getElementById('blogs-container');
        blogsContainer.innerHTML = `
            <div class="error-message">
                <p>Failed to load content from GitHub. Error: ${error.message}</p>
                ${currentPath ? `<a href="blogs.html" class="btn primary">Back to Blogs</a>` : ''}
            </div>
        `;
    }
}

// Function to load blogs using the legacy method (for backward compatibility)
async function loadLegacyBlogs() {
    try {
        const blogsContainer = document.getElementById('blogs-container');
        
        // Try to fetch the legacy blog list from GitHub
        const legacyIndexUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${blogBasePath}/index.html`;
        const response = await fetch(legacyIndexUrl);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch legacy blog index: ${response.status} ${response.statusText}`);
        }
        
        const text = await response.text();
        
        // Extract the JSON data from the div
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const blogListDiv = doc.getElementById('blog-list');
        
        if (!blogListDiv) {
            throw new Error('Blog list not found in legacy index.html');
        }
        
        const blogs = JSON.parse(blogListDiv.textContent);

        // Create a files section
        const filesSection = document.createElement('div');
        filesSection.className = 'files-section';
        
        const filesTitle = document.createElement('h2');
        filesTitle.textContent = 'Files';
        filesSection.appendChild(filesTitle);
        
        const filesGrid = document.createElement('div');
        filesGrid.className = 'blogs-grid';
        
        blogs.forEach(blog => {
            const blogCard = document.createElement('div');
            blogCard.className = 'blog-card fade-in';
            
            const fileExtension = getFileExtension(blog.file);
            const fileIcon = getFileIcon(fileExtension);
            
            // Generate the GitHub Pages URL for the file
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
            
            filesGrid.appendChild(blogCard);
        });
        
        filesSection.appendChild(filesGrid);
        blogsContainer.appendChild(filesSection);
        
    } catch (error) {
        console.error('Error loading legacy blogs:', error);
        const blogsContainer = document.getElementById('blogs-container');
        blogsContainer.innerHTML = `
            <div class="error-message">
                <p>Failed to load legacy blog posts. Error: ${error.message}</p>
                <a href="blogs.html" class="btn primary">Try Again</a>
            </div>
        `;
        
        // As a fallback, try to load directly from GitHub API
        try {
            await loadBlogContentFromGitHub('');
        } catch (fallbackError) {
            console.error('Fallback loading also failed:', fallbackError);
        }
    }
}

// Helper function to get file extension
function getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
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

// Helper function to format file name for display
function formatFileName(filename) {
    // Remove file extension
    const name = filename.split('.').slice(0, -1).join('.');
    
    // Replace underscores with spaces
    return name.replace(/_/g, ' ');
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

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initBlogsPage);