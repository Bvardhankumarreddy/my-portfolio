export const certifications = [
    {
        id: 1,
        name: "AWS Certified Solutions Architect - Associate",
        issuer: "Amazon Web Services",
        date: "2024",
        logo: "https://images.credly.com/size/340x340/images/0e284c3f-5164-4b21-8660-0d84737941bc/image.png",
        verifyUrl: "#",
        color: "bg-orange-500"
    },
    {
        id: 2,
        name: "HashiCorp Certified: Terraform Associate",
        issuer: "HashiCorp",
        date: "2023",
        logo: "https://images.credly.com/size/340x340/images/85b9cfc4-257a-4742-878c-4f7ab4a2631b/image.png",
        verifyUrl: "#",
        color: "bg-purple-600"
    },
    {
        id: 3,
        name: "Docker Certified Associate",
        issuer: "Docker",
        date: "2023",
        logo: "https://images.credly.com/size/340x340/images/08096465-cbfc-4c3e-93e5-93c5aa61f23e/image.png",
        verifyUrl: "#",
        color: "bg-blue-500"
    }
];

export const techStack = [
    {
        category: "Cloud Platforms",
        technologies: [
            { name: "AWS", level: 85, icon: "☁️", color: "bg-orange-500" },
            { name: "Azure", level: 60, icon: "☁️", color: "bg-blue-600" },
            { name: "GCP", level: 50, icon: "☁️", color: "bg-blue-400" }
        ]
    },
    {
        category: "DevOps Tools",
        technologies: [
            { name: "Docker", level: 90, icon: "🐳", color: "bg-blue-500" },
            { name: "Kubernetes", level: 75, icon: "⚓", color: "bg-blue-600" },
            { name: "Jenkins", level: 80, icon: "🔧", color: "bg-red-500" },
            { name: "GitLab CI", level: 85, icon: "🦊", color: "bg-orange-600" }
        ]
    },
    {
        category: "Infrastructure as Code",
        technologies: [
            { name: "Terraform", level: 85, icon: "🏗️", color: "bg-purple-600" },
            { name: "Ansible", level: 70, icon: "📋", color: "bg-red-600" },
            { name: "CloudFormation", level: 65, icon: "📦", color: "bg-orange-500" }
        ]
    },
    {
        category: "Programming & Scripting",
        technologies: [
            { name: "Python", level: 85, icon: "🐍", color: "bg-yellow-500" },
            { name: "Bash", level: 90, icon: "💻", color: "bg-gray-700" },
            { name: "JavaScript", level: 75, icon: "⚡", color: "bg-yellow-400" },
            { name: "Groovy", level: 70, icon: "🔷", color: "bg-blue-700" }
        ]
    },
    {
        category: "Monitoring & Logging",
        technologies: [
            { name: "Prometheus", level: 75, icon: "📊", color: "bg-orange-600" },
            { name: "Grafana", level: 80, icon: "📈", color: "bg-orange-500" },
            { name: "ELK Stack", level: 70, icon: "🔍", color: "bg-teal-600" }
        ]
    }
];

export const careerTimeline = [
    {
        id: 1,
        year: "2023 - Present",
        role: "DevOps Engineer",
        company: "Bajaj Finserv",
        location: "Pune, India",
        description: "Leading DevOps initiatives for enterprise e-commerce platforms",
        achievements: [
            "Reduced deployment time by 60% through CI/CD automation",
            "Managed 50+ production servers with 99.9% uptime",
            "Implemented infrastructure as code using Terraform",
            "Orchestrated containerized applications with AWS ECS"
        ],
        technologies: ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform", "Python"],
        icon: "💼"
    },
    {
        id: 2,
        year: "2022 - 2023",
        role: "Junior DevOps Engineer",
        company: "Tech Startup",
        location: "Bangalore, India",
        description: "Supported cloud infrastructure and automation initiatives",
        achievements: [
            "Automated deployment pipelines for multiple microservices",
            "Reduced cloud costs by 30% through optimization",
            "Implemented monitoring and logging solutions",
            "Collaborated with development teams on CI/CD best practices"
        ],
        technologies: ["AWS", "Docker", "GitLab", "Ansible", "Python"],
        icon: "🚀"
    },
    {
        id: 3,
        year: "2021 - 2022",
        role: "DevOps Intern",
        company: "IT Services Company",
        location: "Hyderabad, India",
        description: "Learned and implemented DevOps practices and tools",
        achievements: [
            "Assisted in migrating legacy applications to cloud",
            "Created automation scripts for routine tasks",
            "Participated in infrastructure planning and deployment",
            "Gained hands-on experience with various DevOps tools"
        ],
        technologies: ["Linux", "Git", "Jenkins", "Bash", "Python"],
        icon: "🎓"
    }
];
