import React, { useState, useEffect } from 'react';
import Image1 from "../../assests/avatar-1.svg";
import Image2 from "../../assests/avatar-2.svg";
import Image3 from "../../assests/avatar-3.svg";
// Import Swiper core and required modules
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/autoplay';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useTheme } from '../../context/ThemeContext';
import { FaQuoteLeft, FaStar, FaLinkedin, FaBriefcase, FaPlus, FaCheckCircle, FaUser, FaClock } from 'react-icons/fa';
import { getReviews } from '../../aws/reviewService';
import ReviewForm from './ReviewForm';

const staticData = [
    {
      id: 1,
      image: Image1,
      title: "Ashish Ramkant Jaiswal",
      name: "Ashish Ramkant Jaiswal",
      subtitle: "Technical Lead at Bajaj Technology Services",
      rating: 5,
      comment:
        "Collaborating with him is always pleasure. His insights and enthusiasm make every task more enjoyable and productive. Good luck! 👍",
    },
    {
      id: 2,
      image: Image2,
      title: "Abhijeet Anil Waghdhare",
      name: "Abhijeet Anil Waghdhare",
      subtitle: "Senior Technical Lead at Bajaj Technology Services",
      rating: 5,
      comment:
        "Your Contribution for handling DevOps operations and dedication towards your work is truly remarkable. Good luck! 👍",
    },
    {
        id: 3,
        image: Image1,
        title: "Ram Gopal",
        name: "Ram Gopal",
        subtitle: "Lead Product Owner - I at Bajaj Technology Services",
        rating: 5,
        comment:
          "I appreciate how you always go above and beyond to help out your colleagues. Your dedication is truly inspiring. Your positive attitude and willingness to collaborate make our team a great place to work. Thank you for being such a supportive peer. I wanted to recognize your exceptional problem-solving skills. Your ability to think creatively and find solutions is incredibly valuable to our team. Your attention to detail and high-quality work do not go unnoticed. Thank you for your consistent commitment to excellence. I admire your strong communication skills and the way you foster open and honest dialogue within our team.",
    },
    {
        id: 4,
        image: Image2,
        title: "Daddiru Akriti",
        name: "Daddiru Akriti",
        subtitle: "Software Engineer - II at Bajaj Technology Services",
        rating: 5,
        comment:
          "Words alone can't capture the appreciation for your dedication and hard work. I strive to deliver high-quality results and remain committed to excellence in every project I undertake. With a focus on growth and consistency, I aim to make a meaningful impact throughout my career. Here's to pushing boundaries and achieving greatness every day!",
    },
    {
        id: 5,
        image: Image3,
        title: "Devendra Dilip Hazare",
        name: "Devendra Dilip Hazare",
        subtitle: "Principal at Bajaj Technology Services",
        rating: 5,
        comment:
          "You've performed admirably within your team, proving to be a valuable asset. Maintain this level of energy and dedication for future endeavors. Great job!",
    },
    {
        id: 6,
        image: Image1,
        title: "Pillalamri Krishna Dheeraj",
        name: "Pillalamri Krishna Dheeraj",
        subtitle: "Software Engineer - II at Bajaj Technology Services",
        rating: 5,
        comment:
          "A great friend and an excellent developer. He grasped and mastered a lot of technologies is a feat which can be achieved by only few people. He is always available for any issues and tasks which are out of his scope and goes above and beyond in solving them.",
    },
    {
        id: 7,
        image: Image2,
        title: "Anita Ashitosh Shinde",
        name: "Anita Ashitosh Shinde",
        subtitle: "Senior Software Engineer - I at Bajaj Technology Services",
        rating: 5,
        comment:
          "Your dedication shines bright, making our team stronger. Thank you for your invaluable contributions.",
    },
    {
        id: 8,
        image: Image3,
        title: "Shreeharsh Pandey",
        name: "Shreeharsh Pandey",
        subtitle: "Software Engineer - II at Bajaj Technology Services",
        rating: 5,
        comment:
          "Great cooperation and support from the team. Hardworking and available at any point in time. Thanks for helping out",
    },
    {
        id: 9,
        image: Image1,
        title: "Ankita Mandal",
        name: "Ankita Mandal",
        subtitle: "Senior Software Engineer - I at Bajaj Technology Services",
        rating: 5,
        comment: "Thank you for your hard work, dedication and invaluable contributions. Your positive attitude and willingness to collaborate make our team a great place to work.",
    },
    {
        id: 10,
        image: Image2,
        title: "Ashok Deshmukh",
        name: "Ashok Deshmukh",
        subtitle: "Deputy Manager at Bajaj Technology Services",
        rating: 5,
        comment: "Your hard work and dedication do not go unnoticed. You consistently put in long hours and go above and beyond to ensure that our projects are successful. Your commitment to excellence is truly remarkable, and I'm grateful to have such a dedicated coworker on our team.",
    },
];

const Testmonials = () => {
    const { theme } = useTheme();
    const [activeSlide, setActiveSlide] = useState(0);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [displayReviews, setDisplayReviews] = useState([]); // Reviews to show in carousel (static only)
    const [allReviews, setAllReviews] = useState([]); // All reviews for stats
    const [loading, setLoading] = useState(true);

    // Fetch reviews from DynamoDB
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const dynamoReviews = await getReviews();
                
                // Combine static testimonials + user reviews for display
                const combined = [...staticData, ...dynamoReviews];
                
                // Show ALL reviews in carousel (static + user submitted)
                setDisplayReviews(combined);
                setAllReviews(dynamoReviews); // Only DynamoDB for stats
                setLoading(false);
            } catch (error) {
                console.error('Error fetching reviews from DynamoDB:', error);
                // If DynamoDB fails, show only static testimonials
                setAllReviews([]);
                setDisplayReviews(staticData);
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    // Calculate stats from ONLY DynamoDB ratings
    const totalReviews = allReviews.length;
    const averageRating = totalReviews > 0 
        ? (allReviews.reduce((acc, review) => acc + (review.rating || 5), 0) / totalReviews).toFixed(1)
        : '0.0';
    
    return (
        <section className={`section w-full py-16 transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
        }`}>
            <div className="container max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className={`section__title text-4xl font-bold mb-4 transition-colors duration-300 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                        Testimonials & Reviews
                    </h2>
                    <p className={`text-lg max-w-2xl mx-auto transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                        What colleagues and team members say about working with me
                    </p>
                    
                    {/* Stats */}
                    <div className="flex justify-center gap-8 mt-6 flex-wrap">
                        <div className={`text-center px-6 py-3 rounded-lg ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                        } shadow-md`}>
                            <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                                {totalReviews}
                            </div>
                            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Total Ratings
                            </div>
                        </div>
                        <div className={`text-center px-6 py-3 rounded-lg ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                        } shadow-md`}>
                            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent flex items-center justify-center gap-1">
                                {averageRating} <FaStar className="text-yellow-500 text-xl" />
                            </div>
                            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Average Rating
                            </div>
                        </div>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                        >
                            <FaPlus /> Add Your Rating
                        </button>
                    </div>
                </div>

                <Swiper 
                    className="w-full max-w-3xl mx-auto pb-12"
                    modules={[Pagination, Autoplay, Navigation]} 
                    spaceBetween={30} 
                    slidesPerView={1}
                    loop={true} 
                    grabCursor={true} 
                    autoplay={{ delay: 5000, disableOnInteraction: false }} 
                    pagination={{ clickable: true, dynamicBullets: true }}
                    navigation={true}
                    onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
                >
                    {displayReviews.map(({ id, image, name, title, subtitle, company, role, comment, rating, createdAt }) => {
                        // Use default values for user-submitted reviews
                        const displayName = name || title || 'Anonymous';
                        const displaySubtitle = subtitle || (company && role ? `${role} at ${company}` : title) || 'Visitor';
                        const displayImage = image || Image1; // Default to Image1 if no image
                        const isUserReview = !image; // User reviews don't have images
                        
                        // Format timestamp
                        const getTimeAgo = (timestamp) => {
                            if (!timestamp) return null;
                            const date = new Date(timestamp);
                            const now = new Date();
                            const diffInSeconds = Math.floor((now - date) / 1000);
                            
                            if (diffInSeconds < 60) return 'Just now';
                            if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
                            if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
                            if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
                            if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
                            return date.toLocaleDateString();
                        };
                        
                        const timeAgo = getTimeAgo(createdAt);
                        
                        return (
                        <SwiperSlide key={id}>
                            <div className={`p-8 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl relative ${
                                rating === 5 ? 'ring-2 ring-yellow-500/50 ring-offset-2' : ''
                            } ${
                                theme === 'dark' ? 'bg-gray-800 ring-offset-gray-900' : 'bg-white ring-offset-white'
                            }`}>
                                {/* Badge for Review Type */}
                                <div className="absolute top-4 left-4">
                                    {isUserReview ? (
                                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                            theme === 'dark' 
                                                ? 'bg-green-500/20 text-green-400' 
                                                : 'bg-green-100 text-green-700'
                                        }`}>
                                            <FaUser className="text-xs" />
                                            Visitor Review
                                        </div>
                                    ) : (
                                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                            theme === 'dark' 
                                                ? 'bg-blue-500/20 text-blue-400' 
                                                : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            <FaCheckCircle className="text-xs" />
                                            Verified
                                        </div>
                                    )}
                                </div>

                                {/* 5-Star Badge */}
                                {rating === 5 && (
                                    <div className="absolute top-4 right-4">
                                        <div className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold flex items-center gap-1">
                                            <FaStar className="text-xs" />
                                            Excellent
                                        </div>
                                    </div>
                                )}

                                {/* Profile Section - Centered at Top */}
                                <div className="flex flex-col items-center text-center mb-6 mt-8">
                                    <div className="relative mb-4">
                                        <div className={`w-20 h-20 rounded-full overflow-hidden ring-2 ring-offset-4 transition-colors duration-300 ${
                                            theme === 'dark' ? 'ring-blue-500 ring-offset-gray-800' : 'ring-blue-500 ring-offset-white'
                                        }`}>
                                            <img src={displayImage} alt={displayName} className="w-full h-full object-cover scale-110" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                            <FaLinkedin className="text-white text-sm" />
                                        </div>
                                    </div>
                                    <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
                                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        {displayName}
                                    </h3>
                                    <div className="flex items-center justify-center gap-2">
                                        <FaBriefcase className={`text-sm ${
                                            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                        }`} />
                                        <span className={`text-sm transition-colors duration-300 ${
                                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                            {displaySubtitle}
                                        </span>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className={`w-24 h-px mx-auto mb-6 ${
                                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                                }`}></div>

                                {/* Quote Icon */}
                                <div className="flex justify-center mb-4">
                                    <FaQuoteLeft className="text-3xl bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent opacity-40" />
                                </div>

                                {/* Comment */}
                                <p className={`text-base leading-relaxed mb-6 text-center transition-colors duration-300 ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                    {comment}
                                </p>

                                {/* Rating - Centered */}
                                <div className="flex items-center justify-center gap-1 mb-4">
                                    {[...Array(rating)].map((_, i) => (
                                        <FaStar key={i} className="text-yellow-500 text-lg" />
                                    ))}
                                </div>

                                {/* Timestamp */}
                                {timeAgo && (
                                    <div className={`flex items-center justify-center gap-2 text-xs ${
                                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                    }`}>
                                        <FaClock className="text-xs" />
                                        {timeAgo}
                                    </div>
                                )}
                            </div>
                        </SwiperSlide>
                        );
                    })}
                </Swiper>

                {/* Testimonial Counter */}
                <div className={`text-center mt-6 text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                    {loading ? 'Loading...' : `Showing testimonial ${activeSlide + 1} of ${displayReviews.length}`}
                </div>

                {/* Review Form Modal */}
                {isFormOpen && (
                    <ReviewForm 
                        onClose={() => setIsFormOpen(false)}
                        theme={theme}
                    />
                )}
            </div>
        </section>
    );
}

export default Testmonials;
