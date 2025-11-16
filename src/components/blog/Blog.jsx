import React, { useState } from 'react';
import { FaClock, FaCalendar, FaArrowRight, FaFilter } from 'react-icons/fa';
import blog1 from '../../assests/blog1.png';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

const Blog = () => {
    const { theme } = useTheme();
    const [selectedCategory, setSelectedCategory] = useState('All');

    const blogPosts = [
        {
            id: 1,
            title: "Vagrant: The Unsung Hero of Local Development Environments",
            excerpt: "Discover how Vagrant revolutionizes local development by providing consistent, reproducible environments across teams.",
            author: "Vardhan Kumar Reddy",
            date: "2024-10-15",
            readTime: 6,
            category: "DevOps",
            image: blog1,
            url: "https://medium.com/@bhopathivardhan654321/vagrant-the-unsung-hero-of-local-development-environments-b1105578c238",
            tags: ["Vagrant", "DevOps", "Development"]
        },
        {
            id: 2,
            title: "Vagrant Setup: Automate and Standardize Your Development Environment",
            excerpt: "Step-by-step guide to setting up Vagrant for automated, standardized development environments that work seamlessly.",
            author: "Vardhan Kumar Reddy",
            date: "2024-11-02",
            readTime: 8,
            category: "Tutorial",
            image: blog1,
            url: "https://medium.com/@bhopathivardhan654321/vagrant-setup-automate-and-standardize-your-development-environment-232be6303d83",
            tags: ["Vagrant", "Tutorial", "Automation"]
        },
        {
            id: 3,
            title: "Setup a Static Website Using Vagrant",
            excerpt: "Learn how to leverage Vagrant for deploying and managing static websites with ease and efficiency.",
            author: "Vardhan Kumar Reddy",
            date: "2024-11-08",
            readTime: 5,
            category: "Web Development",
            image: blog1,
            url: "https://medium.com/@bhopathivardhan654321/setup-an-static-website-using-vagrant-1520a8aa2f9f",
            tags: ["Vagrant", "Web Dev", "Static Sites"]
        }
    ];

    const categories = ['All', ...new Set(blogPosts.map(post => post.category))];

    const filteredPosts = selectedCategory === 'All' 
        ? blogPosts 
        : blogPosts.filter(post => post.category === selectedCategory);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <section className={`section w-full py-16 transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
        }`} id="blog">
            <div className="container max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className={`section__title text-4xl font-bold text-center mb-4 transition-colors duration-300 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Latest Blogs</h2>
                    <p className={`text-center mb-8 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                        Insights and tutorials from my development journey
                    </p>
                </motion.div>

                {/* Category Filter */}
                <div className="flex justify-center items-center gap-3 mb-10 flex-wrap">
                    <FaFilter className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                selectedCategory === category
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                                    : theme === 'dark'
                                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    : 'bg-white text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {filteredPosts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className={`shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl group ${
                                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                            }`}
                        >
                            {/* Image Container */}
                            <div className="relative overflow-hidden h-56 bg-gradient-to-br from-blue-50 to-purple-50">
                                <a href={post.url} target="_blank" rel="noopener noreferrer">
                                    <img 
                                        src={post.image} 
                                        alt={post.title} 
                                        className="w-full h-full object-contain transition-transform duration-500 transform group-hover:scale-110" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                        <span className="text-white font-semibold flex items-center gap-2">
                                            Read Article <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                                        </span>
                                    </div>
                                </a>
                                
                                {/* Category Badge */}
                                <div className="absolute top-3 left-3">
                                    <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg">
                                        {post.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className={`p-6 transition-colors duration-300 ${
                                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                            }`}>
                                <a href={post.url} target="_blank" rel="noopener noreferrer">
                                    <h3 className={`text-lg font-bold mb-3 line-clamp-2 transition-colors duration-300 group-hover:text-blue-500 ${
                                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        {post.title}
                                    </h3>
                                </a>
                                
                                <p className={`text-sm mb-4 line-clamp-2 ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    {post.excerpt}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {post.tags.map((tag, idx) => (
                                        <span 
                                            key={idx}
                                            className={`text-xs px-2 py-1 rounded ${
                                                theme === 'dark' 
                                                    ? 'bg-gray-700 text-gray-300' 
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Meta Info */}
                                <div className={`flex items-center justify-between text-xs border-t pt-4 ${
                                    theme === 'dark' ? 'text-gray-400 border-gray-700' : 'text-gray-600 border-gray-200'
                                }`}>
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1">
                                            <FaCalendar className="text-blue-500" />
                                            {formatDate(post.date)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FaClock className="text-purple-500" />
                                            {post.readTime} min
                                        </span>
                                    </div>
                                </div>

                                <div className={`text-xs mt-3 font-medium ${
                                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                                }`}>
                                    By {post.author}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* No Results Message */}
                {filteredPosts.length === 0 && (
                    <div className={`text-center py-12 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                        <p>No blogs found in this category.</p>
                    </div>
                )}

                {/* View All Blogs Button */}
                <motion.div 
                    className="text-center mt-12"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <a
                        href="https://medium.com/@bhopathivardhan654321"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                        View All Blogs on Medium <FaArrowRight />
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default Blog;
