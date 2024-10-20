import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import logo from './p.png';
import profilePic from './about.png';
import { FaGithub, FaTwitter, FaDiscord, FaSun, FaMoon, FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs, FaPython, FaGitAlt, FaDocker, FaEnvelope } from 'react-icons/fa';
import { SiTypescript, SiNextdotjs, SiExpress, SiDjango, SiMysql, SiAmazon, SiGraphql, SiVuedotjs } from 'react-icons/si';
import { Link, Element, LinkProps } from 'react-scroll';
import Carousel from 'react-spring-3d-carousel';
import { config, useSpring, animated } from '@react-spring/web';
import { BentoGrid, BentoGridItem } from './components/BentoGrid';
import ReactConfetti from 'react-confetti';

// Define the Particle interface
interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  life: number;
}

// Define the TrailPoint interface
interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
}

function App() {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const roles = ['I am a Frontend Developer', 'I am a Backend Developer'];
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [goToSlide, setGoToSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetRadius, setOffsetRadius] = useState(2);
  const [showNavigation, setShowNavigation] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragStartTime, setDragStartTime] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const skills = [
    { name: 'HTML', icon: <FaHtml5 /> },
    { name: 'CSS', icon: <FaCss3Alt /> },
    { name: 'JavaScript', icon: <FaJs /> },
    { name: 'React', icon: <FaReact /> },
    { name: 'Next.js', icon: <SiNextdotjs /> },
    { name: 'TypeScript', icon: <SiTypescript /> },
    { name: 'Node.js', icon: <FaNodeJs /> },
    { name: 'Python', icon: <FaPython /> },
    { name: 'Django', icon: <SiDjango /> },
    { name: 'SQL', icon: <SiMysql /> },
    { name: 'Git', icon: <FaGitAlt /> },
    { name: 'Docker', icon: <FaDocker /> },
  ];

  const slides = skills.map((skill, index) => ({
    key: index,
    content: (
      <div className="skill-item">
        {skill.icon}
        <span>{skill.name}</span>
      </div>
    ),
  }));

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
    setDragStartTime(Date.now());
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const dragDistance = e.clientX - dragStart;
    const dragTime = Date.now() - dragStartTime;
    
    if (Math.abs(dragDistance) > 50 && dragTime < 250) {
      if (dragDistance > 0) {
        setGoToSlide((prev) => (prev - 1 + slides.length) % slides.length);
      } else {
        setGoToSlide((prev) => (prev + 1) % slides.length);
      }
      setIsDragging(false);
    }
  }, [isDragging, dragStart, dragStartTime, slides.length]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGoToSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 2000); // Changed from 3000 to 2000 milliseconds (2 seconds)

    return () => clearInterval(interval);
  }, [slides.length]);

  const carouselStyles = useSpring({
    loop: true,
    from: { transform: 'translateX(0%)' },
    to: { transform: 'translateX(-100%)' },
    config: { duration: 20000 }, // Adjust duration for speed
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (animationComplete) {
      const intervalId = setInterval(() => {
        setCurrentRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
      }, 8000); // Change role every 8 seconds

      return () => clearInterval(intervalId);
    }
  }, [animationComplete]);

  useEffect(() => {
    if (animationComplete) {
      const currentRole = roles[currentRoleIndex];
      let isDeleting = true;
      let textIndex = displayedText.length;

      const intervalId = setInterval(() => {
        if (isDeleting) {
          if (textIndex > 0) {
            setDisplayedText(displayedText.slice(0, textIndex - 1));
            textIndex--;
          } else {
            isDeleting = false;
            textIndex = 0;
          }
        } else {
          if (textIndex < currentRole.length) {
            setDisplayedText(currentRole.slice(0, textIndex + 1));
            textIndex++;
          } else {
            clearInterval(intervalId);
          }
        }
      }, 50); // Adjust speed of typing/deleting here

      return () => clearInterval(intervalId);
    }
  }, [currentRoleIndex, animationComplete]);

  const createParticle = useCallback((x: number, y: number): Particle => {
    return {
      x,
      y,
      size: Math.random() * 5 + 1,
      speedX: Math.random() * 3 - 1.5,
      speedY: Math.random() * 3 - 1.5,
      life: Math.random() * 60 + 60,
    };
  }, []);

  const updateParticles = useCallback(() => {
    setParticles(prevParticles => 
      prevParticles
        .map(p => ({
          ...p,
          x: p.x + p.speedX,
          y: p.y + p.speedY,
          life: p.life - 1,
        }))
        .filter(p => p.life > 0)
    );
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const aboutMeText = "I am a 13 year old developer with experience in both frontend and backend technologies. I focus on creating user-friendly web applications that are responsive and efficient. On the frontend, I use HTML, CSS, and JavaScript frameworks to design intuitive interfaces. On the backend, I work with server-side languages and databases to manage data and application logic. I enjoy solving complex problems and delivering reliable solutions.";

  useEffect(() => {
    const glitchText = document.querySelector('.glitch-text') as HTMLElement;
    if (glitchText) {
      const glitchInterval = setInterval(() => {
        const glitchStyles = `
          --clip-one: inset(${Math.random() * 100}% 0 ${Math.random() * 100}% 0);
          --clip-two: inset(${Math.random() * 100}% 0 ${Math.random() * 100}% 0);
          --clip-three: inset(${Math.random() * 100}% 0 ${Math.random() * 100}% 0);
          --transform-one: translate(${(Math.random() - 0.5) * 2}px, ${(Math.random() - 0.5) * 2}px);
          --transform-two: translate(${(Math.random() - 0.5) * 2}px, ${(Math.random() - 0.5) * 2}px);
          --transform-three: translate(${(Math.random() - 0.5) * 2}px, ${(Math.random() - 0.5) * 2}px);
        `;
        glitchText.setAttribute('style', glitchStyles);
      }, 2000); // Change the interval to 2 seconds for less frequent updates

      return () => clearInterval(glitchInterval);
    }
  }, []);

  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const skillCategories = [
    {
      name: "Frontend",
      skills: [
        { name: "HTML", level: 4, icon: <FaHtml5 /> },
        { name: "CSS", level: 4, icon: <FaCss3Alt /> },
        { name: "JavaScript", level: 4, icon: <FaJs /> },
        { name: "React", level: 3, icon: <FaReact /> },
        { name: "Vue.js", level: 1, icon: <SiVuedotjs /> },
      ]
    },
    {
      name: "Backend",
      skills: [
        { name: "Next.js", level: 4, icon: <SiNextdotjs /> },
        { name: "Express", level: 2, icon: <SiExpress /> },
        { name: "Python", level: 4, icon: <FaPython /> },
        { name: "Django", level: 2, icon: <SiDjango /> },
        { name: "SQL", level: 3, icon: <SiMysql /> },
      ]
    },
    {
      name: "Tools & Others",
      skills: [
        { name: "Git", level: 3, icon: <FaGitAlt /> },
        { name: "Docker", level: 2, icon: <FaDocker /> },
        { name: "AWS", level: 1, icon: <SiAmazon /> },
        { name: "GraphQL", level: 2, icon: <SiGraphql /> },
        { name: "TypeScript", level: 4, icon: <SiTypescript /> },
      ]
    }
  ];

  const projects = [
    {
      title: "E-commerce Platform",
      description: "A full-stack e-commerce solution with React, Node.js, and MongoDB.",
      className: "md:col-span-2",
      thumbnail: "path/to/ecommerce-thumbnail.jpg",
    },
    {
      title: "Weather App",
      description: "Real-time weather forecasting app using OpenWeatherMap API.",
      thumbnail: "path/to/weather-thumbnail.jpg",
    },
    {
      title: "Task Manager",
      description: "A productivity app built with React and Firebase.",
      thumbnail: "path/to/taskmanager-thumbnail.jpg",
    },
    {
      title: "Portfolio Website",
      description: "A responsive portfolio website showcasing my projects and skills.",
      className: "md:col-span-2",
      thumbnail: "path/to/portfolio-thumbnail.jpg",
    },
    {
      title: "Chat Application",
      description: "Real-time chat app using Socket.io and Express.",
      thumbnail: "path/to/chat-thumbnail.jpg",
    },
  ];

  const handleContactClick = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      window.location.href = 'mailto:noahwhiteson5@gmail.com';
    }, 3000);
  }, []);

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div 
        className="grid-background"
        style={{
          '--mouse-x': `${mousePosition.x}px`,
          '--mouse-y': `${mousePosition.y}px`
        } as React.CSSProperties}
      ></div>
      <div className="top-bar">
        <img src={logo} alt="Logo" className="logo" />
        <nav>
          <Link to="home" smooth={true} duration={500}>Home</Link>
          <Link to="about" smooth={true} duration={500}>About</Link>
          <Link to="skills" smooth={true} duration={500}>Skills</Link>
          <Link to="projects" smooth={true} duration={500}>Projects</Link>
          <Link to="contact" smooth={true} duration={500}>Contact</Link>
        </nav>
        <button onClick={toggleDarkMode} className="mode-toggle">
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
      <div className="side-bar">
        <a href="https://github.com/NoahWhiteson" target="_blank" rel="noopener noreferrer">
          <FaGithub />
        </a>
        <a href="https://x.com/PrisumDevelopes" target="_blank" rel="noopener noreferrer">
          <FaTwitter />
        </a>
        <a href="https://discord.gg/yourinvite" target="_blank" rel="noopener noreferrer">
          <FaDiscord />
        </a>
      </div>
      <div className={`loading-overlay ${animationComplete ? 'complete' : ''}`}>
        <div className="loading-bar top"></div>
        <div className="loading-bar bottom"></div>
      </div>
      <div className="content">
        <Element name="home" className="section home">
          <div className="center-content">
            <h1>Hi, I'm <span className="gradient-text">Noah,</span>👋</h1>
            <p className="role">
              {displayedText}<span className="cursor">|</span>
            </p>
          </div>
        </Element>
        <Element name="about" className="section about">
          <h2>About Me</h2>
          <div className="about-content">
            <div className="profile-pic">
              <img src={profilePic} alt="Profile" />
            </div>
            <div className="about-text">
              <p className="glitch-text" data-text={aboutMeText}>
                {aboutMeText}
              </p>
            </div>
          </div>
        </Element>
        <Element name="skills" className="section skills">
          <h2>Skills</h2>
          <div className="skills-content">
            <div className="skills-intro">
              <p>As a full-stack developer, I've cultivated a diverse set of skills across various technologies and tools. Here's an overview of my technical proficiencies:</p>
            </div>
            <div className="skills-carousel">
              <Carousel
                slides={slides}
                goToSlide={goToSlide}
                offsetRadius={3}
                showNavigation={false}
                animationConfig={{
                  tension: 120,
                  friction: 14
                }}
              />
            </div>
            <div className="skills-details">
              {skillCategories.map((category, index) => (
                <div key={index} className="skill-category">
                  <h3>{category.name}</h3>
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="skill-item-detailed">
                      <span className="skill-icon">{skill.icon}</span>
                      <span className="skill-name">{skill.name}</span>
                      <div className="skill-level-container">
                        {skillLevels.map((level, levelIndex) => (
                          <div 
                            key={levelIndex} 
                            className={`skill-level-indicator ${levelIndex <= skill.level - 1 ? 'filled' : ''}`}
                          ></div>
                        ))}
                      </div>
                      <span className="skill-level-text">{skillLevels[skill.level - 1]}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Element>
        <Element name="projects" className="section projects">
          <h2>Projects</h2>
          <BentoGrid className="max-w-4xl mx-auto">
            {projects.map((project, index) => (
              <BentoGridItem
                key={index}
                title={project.title}
                description={project.description}
                className={project.className}
                thumbnail={project.thumbnail}
              />
            ))}
          </BentoGrid>
        </Element>
        <Element name="contact" className="section contact">
          <h2>Get in Touch</h2>
          <Link 
            to="contact" 
            smooth={true} 
            duration={500} 
            className="contact-button"
            onClick={handleContactClick}
          >
            <FaEnvelope className="contact-button-icon" />
            Contact Me
          </Link>
          {showConfetti && (
            <ReactConfetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
              numberOfPieces={200}
            />
          )}
        </Element>
      </div>
    </div>
  );
}

export default App;
