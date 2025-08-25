<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bar Sberro • Portfolio</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700&display=swap" rel="stylesheet">
    <link href="styles.css" rel="stylesheet">
</head>
<body>

    <nav class="navbar">
        <div class="container">
            <a href="#home" class="nav-brand">Bar Sberro</a>
            <ul class="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </div>
    </nav>

    <header id="home" class="hero-section">
        <div class="container hero-content">
            <div class="hero-text">
                <h1>Software & Computer Science Student</h1>
                <p>Python Developer | Cybersecurity Enthusiast | Network Analysis</p>
                <a href="#contact" class="btn">Get In Touch</a>
            </div>
            </div>
    </header>

    <section id="about" class="about-section">
        <div class="container">
            <h2>About Me</h2>
            <p>
                I am a final-year Computer Science student at HIT with a strong passion for network security and building robust, efficient tools. My academic journey has given me a deep understanding of algorithms, data structures and object-oriented programming. I am experienced in working both independently and as part of a team to solve complex problems.
            </p>
            <div class="skills-grid">
                <div class="skills-category">
                    <h3>Languages</h3>
                    <div class="tags">
                        <span class="tag-green">Python</span>
                        <span class="tag-green">Java</span>
                        <span class="tag-green">C++</span>
                        <span class="tag-green">C</span>
                        <span class="tag-green">SQL</span>
                    </div>
                </div>
                <div class="skills-category">
                    <h3>Tools & Libraries</h3>
                    <div class="tags">
                        <span class="tag-blue">Linux</span>
                        <span class="tag-blue">Git & GitHub</span>
                        <span class="tag-blue">Scapy</span>
                        <span class="tag-blue">Wireshark</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="projects" class="projects-section">
        <div class="container">
            <h2>My Projects</h2>
            <div class="project-grid">
                <div class="project-card">
                    <img src="assets/ids-project.jpg" alt="Lightweight Network IDS Project">
                    <div class="card-content">
                        <h3>Lightweight Network IDS</h3>
                        <p>A real-time Intrusion Detection System built with Python and Scapy, featuring a live CLI dashboard, alert logging, and PCAP evidence capture.</p>
                        <a href="https://github.com/BarDev1999/SniffGuard" class="btn-outline">View Project</a>
                    </div>
                </div>
                <div class="project-card">
                    <img src="assets/wine-project.jpg" alt="Wine Classification Project">
                    <div class="card-content">
                        <h3>Wine Classification</h3>
                        <p>A machine learning model using Random Forest to classify wine types based on chemical properties, achieving high accuracy and F1 score.</p>
                        <a href="https://github.com/BarDev1999/supervised_learning_flow-wine" class="btn-outline">View Project</a>
                    </div>
                </div>
                </div>
        </div>
    </section>

    <section id="contact" class="contact-section">
        <div class="container">
             <h2>Contact Me</h2>
             <p>Email: barsgh@gmail.com</p>
             <p>LinkedIn: <a href="https://www.linkedin.com/in/bar-sberro/">linkedin.com/in/bar-sberro</a></p>
        </div>
    </section>

    <footer class="footer">
        <p>© Bar Sberro. All rights reserved.</p>
    </footer>

</body>
</html>
