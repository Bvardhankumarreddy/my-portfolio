import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaCertificate, FaTrophy, FaAward, FaNewspaper, FaExternalLinkAlt, FaCalendar, FaClock } from "react-icons/fa";
import Menu from "./Menu";
import { useTheme } from '../../context/ThemeContext';

const Portfolio = () => {
  const { theme } = useTheme();
  const [items, setItems] = useState(Menu);
  const [activeCategory, setActiveCategory] = useState("Everything");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const itemsPerPage = 3; // 3 cards per page for better visibility

  const filterItem = (categoryItem) => {
    setLoading(true);
    setActiveCategory(categoryItem);
    setCurrentPage(0);
    
    setTimeout(() => {
      if (categoryItem === "Everything") {
        setItems(Menu);
      } else {
        const updatedItems = Menu.filter((item) => item.category === categoryItem);
        setItems(updatedItems);
      }
      setLoading(false);
    }, 300);
  };

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentItems = items.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape' && selectedItem) setSelectedItem(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalPages, selectedItem]);

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Certifications': return <FaCertificate className="inline mr-2" />;
      case 'Achievements': return <FaTrophy className="inline mr-2" />;
      case 'Appreciations': return <FaAward className="inline mr-2" />;
      case 'Posts': return <FaNewspaper className="inline mr-2" />;
      default: return null;
    }
  };

  return (
    <section className={`section w-full py-16 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <div className="container max-w-7xl mx-auto px-6">
        <h2 className={`section__title text-4xl font-bold text-center mb-12 transition-colors duration-300 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Milestones & Accolades</h2>

        {/* Tab Filter Menu */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {["Everything", "Certifications", "Achievements", "Appreciations", "Posts"].map((category) => (
            <button
              key={category}
              onClick={() => filterItem(category)}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading Animation */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`rounded-xl p-6 animate-pulse ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className={`h-64 rounded-lg mb-4 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}></div>
                <div className={`h-6 rounded mb-3 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}></div>
                <div className={`h-4 rounded w-2/3 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 min-h-[500px]">
              {currentItems.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer flex flex-col h-full ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  }`}
                  onClick={() => setSelectedItem(item)}
                >
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden group flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <span className="text-white font-semibold flex items-center">
                          <FaExternalLinkAlt className="mr-2" /> View Details
                        </span>
                      </div>
                    </div>
                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${
                        item.category === 'Certifications' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                        item.category === 'Achievements' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                        item.category === 'Appreciations' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                        'bg-gradient-to-r from-purple-500 to-pink-600'
                      } text-white`}>
                        {getCategoryIcon(item.category)}
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className={`text-lg font-bold mb-3 min-h-[3.5rem] line-clamp-2 transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {item.title}
                    </h3>
                    
                    {/* Metadata */}
                    <div className={`space-y-2 text-sm mb-3 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {item.issuer && (
                        <div className="flex items-center">
                          <FaCertificate className="mr-2 text-blue-500 flex-shrink-0" />
                          <span className="line-clamp-1">{item.issuer}</span>
                        </div>
                      )}
                      {item.date && (
                        <div className="flex items-center">
                          <FaCalendar className="mr-2 text-purple-500 flex-shrink-0" />
                          <span>{item.date}</span>
                        </div>
                      )}
                      {item.duration && (
                        <div className="flex items-center">
                          <FaClock className="mr-2 text-green-500 flex-shrink-0" />
                          <span>{item.duration}</span>
                        </div>
                      )}
                    </div>

                    {/* Description Preview - pushes to bottom */}
                    <div className="mt-auto">
                      {item.description && (
                        <p className={`text-sm line-clamp-2 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-6 mt-10">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 0}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    currentPage === 0
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:scale-110 hover:shadow-lg'
                  } ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-white'
                      : 'bg-white text-gray-900 shadow-md'
                  }`}
                >
                  <FaChevronLeft size={20} />
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        currentPage === index
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 w-8'
                          : theme === 'dark'
                          ? 'bg-gray-700 hover:bg-gray-600'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages - 1}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    currentPage === totalPages - 1
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:scale-110 hover:shadow-lg'
                  } ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-white'
                      : 'bg-white text-gray-900 shadow-md'
                  }`}
                >
                  <FaChevronRight size={20} />
                </button>
              </div>
            )}

            {/* Results Count */}
            <div className={`text-center mt-6 text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Showing {currentPage * itemsPerPage + 1}-{Math.min((currentPage + 1) * itemsPerPage, items.length)} of {items.length} {activeCategory === "Everything" ? "items" : activeCategory.toLowerCase()}
            </div>
          </>
        )}

        {/* Modal for Full Details */}
        {selectedItem && (
          <div 
            className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <div 
              className={`relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="sticky top-4 right-4 float-right bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-bold transition-all duration-300 hover:scale-110 shadow-lg z-10"
                onClick={() => setSelectedItem(null)}
              >
                ✖ Close
              </button>
              
              <div className="p-8">
                <div className="mb-6">
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                    selectedItem.category === 'Certifications' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                    selectedItem.category === 'Achievements' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                    selectedItem.category === 'Appreciations' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                    'bg-gradient-to-r from-purple-500 to-pink-600'
                  } text-white`}>
                    {getCategoryIcon(selectedItem.category)}
                    {selectedItem.category}
                  </span>
                </div>

                <img 
                  src={selectedItem.image} 
                  alt={selectedItem.title} 
                  className="w-full h-auto max-h-96 object-contain rounded-xl mb-6 shadow-lg"
                />
                
                <h2 className={`text-3xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {selectedItem.title}
                </h2>

                {selectedItem.description && (
                  <p className={`text-lg mb-6 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {selectedItem.description}
                  </p>
                )}

                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  {selectedItem.issuer && (
                    <div>
                      <strong className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Issuer:</strong>
                      <p className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedItem.issuer}</p>
                    </div>
                  )}
                  {selectedItem.date && (
                    <div>
                      <strong className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Date:</strong>
                      <p className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedItem.date}</p>
                    </div>
                  )}
                  {selectedItem.instructor && (
                    <div>
                      <strong className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Instructor:</strong>
                      <p className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedItem.instructor}</p>
                    </div>
                  )}
                  {selectedItem.awardedBy && (
                    <div className="md:col-span-2">
                      <strong className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Awarded By:</strong>
                      <p className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedItem.awardedBy}</p>
                    </div>
                  )}
                  {selectedItem.duration && (
                    <div>
                      <strong className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Duration:</strong>
                      <p className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedItem.duration}</p>
                    </div>
                  )}
                  {selectedItem.validationNumber && (
                    <div className="md:col-span-2">
                      <strong className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Validation Number:</strong>
                      <p className={`text-sm font-mono ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedItem.validationNumber}</p>
                    </div>
                  )}
                  {selectedItem.certificateNumber && (
                    <div className="md:col-span-2">
                      <strong className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Certificate No:</strong>
                      <p className={`text-sm font-mono ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedItem.certificateNumber}</p>
                    </div>
                  )}
                  {selectedItem.certificateUrl && (
                    <div className="md:col-span-2">
                      <strong className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Certificate URL:</strong>
                      <p className={`text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                        <a href={`https://${selectedItem.certificateUrl}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {selectedItem.certificateUrl}
                        </a>
                      </p>
                    </div>
                  )}
                  {selectedItem.referenceNumber && (
                    <div>
                      <strong className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Reference Number:</strong>
                      <p className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedItem.referenceNumber}</p>
                    </div>
                  )}
                  {selectedItem.expirationDate && (
                    <div>
                      <strong className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Expires:</strong>
                      <p className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedItem.expirationDate}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
