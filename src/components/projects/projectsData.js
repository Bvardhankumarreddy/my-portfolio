import bajajmall from '../../assests/project2.png';
import portfolio from '../../assests/project1.png';
import todolist from '../../assests/todolist.png';

export const projectsData = [
    {
        id: 1,
        title: "Bajajmall 1.0 (Ecommerce)",
        shortDescription: "Enterprise e-commerce platform with DevOps automation",
        category: "DevOps & CI/CD",
        techStack: ["AWS", "ECS", "PHP", "AEM", "Core Java", "Python", "GitLab", "Jenkins", "Bash", "Groovy"],
        images: [bajajmall],
        liveUrl: "https://www.bajajmall.in/emi-store",
        githubUrl: null,
        metrics: {
            uptime: "99.9%",
            deploymentTime: "8 mins",
            servers: "50+"
        },
        features: [
            "Automated CI/CD pipeline with Jenkins & GitLab",
            "Container orchestration with AWS ECS",
            "AEM-based content management system",
            "Python ETL processes for data integration",
            "Bash automation scripts for DevOps tasks"
        ]
    },
    {
        id: 2,
        title: "Bajajmall 2.0 (Ecommerce)",
        shortDescription: "Next-gen e-commerce platform with Adobe Cloud infrastructure",
        category: "DevOps & CI/CD",
        techStack: ["Adobe Cloud", "AEM", "PHP", "Core Java", "Python", "GitHub"],
        images: [bajajmall],
        liveUrl: "https://www.bajajmall.in/",
        githubUrl: null,
        metrics: {
            uptime: "99.95%",
            deploymentTime: "5 mins",
            servers: "20+"
        },
        features: [
            "Advanced CI/CD with automated testing",
            "Adobe Cloud Enterprise Edition hosting",
            "Enhanced monitoring and logging",
            "GitHub-based version control",
            "Multi-environment automation"
        ]
    },
    {
        id: 3,
        title: "My Portfolio",
        shortDescription: "Personal portfolio with AWS serverless backend",
        category: "Web Development",
        techStack: ["React", "AWS Lambda", "DynamoDB", "API Gateway", "Tailwind CSS"],
        images: [portfolio],
        liveUrl: "https://www.portfolio.vardhandevops.xyz/",
        githubUrl: "https://github.com/Bvardhankumarreddy/my-portfolio",
        metrics: {
            visitors: "200+",
            loadTime: "< 2s",
            hosting: "S3 + CloudFront"
        },
        features: [
            "Serverless visitor counter with AWS Lambda",
            "DynamoDB for persistent storage",
            "Responsive design with Tailwind CSS",
            "Dark/Light theme support"
        ]
    },
    {
        id: 4,
        title: "Todo List Application",
        shortDescription: "Interactive task management app with local storage",
        category: "Web Development",
        techStack: ["JavaScript", "HTML", "CSS", "LocalStorage"],
        images: [todolist],
        liveUrl: "https://bvardhankumarreddy.github.io/Todo-List/",
        githubUrl: "https://github.com/Bvardhankumarreddy/Todo-List",
        metrics: {
            features: "5+",
            responsive: "100%",
            performance: "A+"
        },
        features: [
            "Add, edit, and delete tasks",
            "Mark tasks as complete",
            "Filter by status (all, active, completed)",
            "Persistent storage using localStorage"
        ]
    }
];

export const categories = [
    "All Projects",
    "DevOps & CI/CD",
    "Cloud Infrastructure",
    "Web Development",
    "Automation Scripts"
];

export const techStackColors = {
    "AWS": "bg-orange-500",
    "Adobe Cloud": "bg-red-700",
    "ECS": "bg-orange-600",
    "PHP": "bg-indigo-600",
    "AEM": "bg-red-600",
    "Core Java": "bg-red-500",
    "Python": "bg-yellow-500",
    "GitHub": "bg-gray-800",
    "GitLab": "bg-orange-700",
    "Jenkins": "bg-red-500",
    "Bash": "bg-gray-700",
    "Groovy": "bg-blue-700",
    "Terraform": "bg-purple-600",
    "Docker": "bg-blue-500",
    "Kubernetes": "bg-blue-600",
    "Node.js": "bg-green-600",
    "React": "bg-cyan-500",
    "JavaScript": "bg-yellow-400",
    "HTML": "bg-orange-400",
    "CSS": "bg-blue-400",
    "LocalStorage": "bg-gray-600",
    "DynamoDB": "bg-blue-700",
    "API Gateway": "bg-purple-500",
    "AWS Lambda": "bg-orange-600",
    "Tailwind CSS": "bg-teal-500"
};
