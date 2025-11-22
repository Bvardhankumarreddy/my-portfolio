import React from 'react';
import './floatingIcons.css';
import { FaDocker, FaAws, FaJenkins, FaGitlab, FaGithub, FaPython, FaLinux, FaCloud, FaGitAlt, FaNodeJs } from 'react-icons/fa';
import { SiKubernetes, SiTerraform, SiGooglecloud, SiAnsible, SiPrometheus, SiGrafana, SiMongodb, SiRedis, SiNginx, SiPostgresql, SiElasticsearch, SiApache } from 'react-icons/si';

const FloatingIcons = () => {
    const icons = [
        { Icon: FaDocker, name: 'Docker', delay: 0, duration: 15, color: '#2496ED', x: 5, y: 10 },
        { Icon: SiKubernetes, name: 'Kubernetes', delay: 2, duration: 18, color: '#326CE5', x: 15, y: 25 },
        { Icon: SiTerraform, name: 'Terraform', delay: 1, duration: 17, color: '#7B42BC', x: 25, y: 5 },
        { Icon: FaAws, name: 'AWS', delay: 4, duration: 20, color: '#FF9900', x: 35, y: 30 },
        { Icon: FaCloud, name: 'Azure', delay: 3, duration: 16, color: '#0078D4', x: 45, y: 15 },
        { Icon: SiGooglecloud, name: 'GCP', delay: 5, duration: 19, color: '#4285F4', x: 55, y: 35 },
        { Icon: FaJenkins, name: 'Jenkins', delay: 2.5, duration: 21, color: '#D24939', x: 65, y: 8 },
        { Icon: FaGitlab, name: 'GitLab', delay: 4.5, duration: 14, color: '#FC6D26', x: 75, y: 28 },
        { Icon: FaGithub, name: 'GitHub', delay: 1.5, duration: 22, color: '#181717', x: 85, y: 12 },
        { Icon: SiAnsible, name: 'Ansible', delay: 3.5, duration: 18, color: '#EE0000', x: 95, y: 32 },
        { Icon: FaPython, name: 'Python', delay: 0.5, duration: 16, color: '#3776AB', x: 8, y: 50 },
        { Icon: SiPrometheus, name: 'Prometheus', delay: 2.8, duration: 19, color: '#E6522C', x: 18, y: 65 },
        { Icon: SiGrafana, name: 'Grafana', delay: 4.2, duration: 17, color: '#F46800', x: 28, y: 55 },
        { Icon: FaLinux, name: 'Linux', delay: 1.8, duration: 20, color: '#FCC624', x: 38, y: 70 },
        { Icon: SiRedis, name: 'Redis', delay: 1.2, duration: 18, color: '#DC382D', x: 48, y: 58 },
        { Icon: SiMongodb, name: 'MongoDB', delay: 3.8, duration: 16, color: '#47A248', x: 58, y: 75 },
        { Icon: SiNginx, name: 'Nginx', delay: 0.8, duration: 19, color: '#009639', x: 68, y: 52 },
        { Icon: FaGitAlt, name: 'Git', delay: 4.8, duration: 15, color: '#F05032', x: 78, y: 68 },
        { Icon: FaNodeJs, name: 'Node.js', delay: 2.2, duration: 20, color: '#339933', x: 88, y: 60 },
        { Icon: SiPostgresql, name: 'PostgreSQL', delay: 3.2, duration: 17, color: '#4169E1', x: 12, y: 85 },
        { Icon: SiElasticsearch, name: 'Elasticsearch', delay: 1.6, duration: 21, color: '#005571', x: 42, y: 88 },
        { Icon: SiApache, name: 'Apache', delay: 4.4, duration: 16, color: '#D22128', x: 72, y: 82 },
    ];

    return (
        <div className="floating-icons-container">
            {icons.map((icon, index) => {
                const IconComponent = icon.Icon;
                return (
                    <div
                        key={index}
                        className="floating-icon"
                        style={{
                            '--delay': `${icon.delay}s`,
                            '--duration': `${icon.duration}s`,
                            '--x-start': `${icon.x}%`,
                            '--y-start': `${icon.y}%`,
                            '--icon-color': icon.color,
                        }}
                        title={icon.name}
                    >
                        <IconComponent />
                    </div>
                );
            })}
        </div>
    );
};

export default FloatingIcons;
