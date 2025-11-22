const Data = [
  {
    id: 1,
    category: "education",
    icon: "icon-graduation",
    year: "2019 - 2023",
    title: "Bachelor of Technology (B.Tech) - CSE",
    company: "SRM University AP",
    desc: "CGPA: - 8.78",
  },
  {
    id: 2,
    category: "education",
    icon: "icon-graduation",
    year: "2017 - 2019",
    title: "Senior Secondary Education - CBSE",
    company: "Sri Viswasanthi EM High School",
    desc: "Percentage: - 87.2",
  },
  {
    id: 3,
    category: "education",
    icon: "icon-graduation",
    year: "2016 - 2017",
    title: "Secondary School Certificate - CBSE",
    company: "Pooja International School",
    desc: "CGPA: - 10/10",
  },
  {
    id: 4,
    category: "experience",
    icon: "icon-briefcase",
    year: "Jul 2023 - Present",
    title: "Software Engineer - II",
    company: "Bajaj Finserv",
    location: "Pune, India",
    desc: "Leading DevOps initiatives for enterprise-scale e-commerce platforms, managing 50+ production servers with 99.9% uptime.",
    responsibilities: [
      "Architected and implemented CI/CD pipelines using Jenkins and GitLab, reducing deployment time by 60%",
      "Managed containerized applications with AWS ECS and Docker, improving scalability and resource utilization",
      "Automated infrastructure provisioning with Terraform and CloudFormation",
      "Developed Python and Bash automation scripts for monitoring, deployment, and maintenance tasks",
      "Implemented comprehensive monitoring and logging solutions using Prometheus and Grafana",
      "Optimized cloud costs by 30% through resource right-sizing and automation"
    ],
    technologies: ["AWS", "Docker", "Kubernetes", "Jenkins", "GitLab", "Terraform", "Python", "Bash", "ECS", "CloudFormation"],
    achievements: {
      uptime: "99.9%",
      deploymentTime: "60% faster",
      servers: "50+",
      costReduction: "30%"
    }
  },
  {
    id: 5,
    category: "experience",
    icon: "icon-briefcase",
    year: "Jan 2023 - Jun 2023",
    title: "Byte Intern",
    company: "Bajaj Finserv",
    location: "Pune, India",
    desc: "Contributed to the development and deployment of Commerce Project, gaining hands-on experience in DevOps practices and cloud technologies.",
    responsibilities: [
      "Assisted in building CI/CD pipelines for microservices deployment",
      "Participated in infrastructure setup and configuration using AWS services",
      "Developed automation scripts for routine DevOps tasks",
      "Collaborated with senior engineers on deployment strategies and best practices",
      "Learned and implemented containerization using Docker",
      "Supported production deployments and troubleshooting activities"
    ],
    technologies: ["AWS", "Docker", "Jenkins", "Git", "Linux", "Python", "Bash"],
    achievements: {
      projects: "3+",
      deployments: "20+",
      automation: "5 scripts"
    }
  },
];

export default Data;
